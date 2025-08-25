use candid::{CandidType, Decode, Encode};
use ic_cdk::api::time;
use ic_cdk_macros::{init, post_upgrade, pre_upgrade, query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum Provider { 
    Stripe, 
    PayPal, 
    CkBTC, 
    Custom(String) 
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub enum IntentStatus { 
    Processing, 
    Succeeded, 
    Refunded, 
    Failed 
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Intent {
    pub id: String,
    pub amount_minor: u64,
    pub currency: String,
    pub description: Option<String>,
    pub provider: Provider,
    pub created_at: u64,
    pub status: IntentStatus,
    pub receipt_hash: Option<String>, // optional "on-chain receipt" marker
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct Invoice {
    pub id: String,
    pub amount_minor: u64,
    pub currency: String,
    pub issued_at: u64,
    pub email_enc: Option<String>,
    pub description: Option<String>,
    pub paid: bool,
}

#[derive(CandidType, Deserialize, Serialize, Clone)]
pub struct ProviderConfig {
    pub provider: Provider,
    pub kv: Vec<(String, String)>, // demo only (plain text) — NOTE security in README
}

#[derive(CandidType, Deserialize, Serialize, Default)]
struct StableState {
    intents: Vec<Intent>,
    invoices: Vec<Invoice>,
    configs: Vec<ProviderConfig>,
}

thread_local! {
    static STATE: RefCell<StableState> = RefCell::new(StableState::default());
}

fn gen_id(prefix: &str) -> String {
    format!("{}-{}", prefix, time())
}

#[init]
fn init() {}

#[pre_upgrade]
fn pre_upgrade() {
    let bytes = STATE.with(|s| Encode!(&*s.borrow()).unwrap());
    ic_cdk::storage::stable_save((bytes,)).unwrap();
}

#[post_upgrade]
fn post_upgrade() {
    if let Ok((bytes,)) = ic_cdk::storage::stable_restore::<(Vec<u8>,)>() {
        if let Ok(state) = Decode!(&bytes, StableState) {
            STATE.with(|s| *s.borrow_mut() = state);
        }
    }
}

#[update]
fn create_intent(amount_minor: u64, currency: String, description: Option<String>, provider: Provider) -> Intent {
    let intent = Intent {
        id: gen_id("int"),
        amount_minor,
        currency,
        description,
        provider,
        created_at: time(),
        status: IntentStatus::Processing,
        receipt_hash: None,
    };
    STATE.with(|s| s.borrow_mut().intents.push(intent.clone()));
    intent
}

#[query]
fn get_intent(id: String) -> Option<Intent> {
    STATE.with(|s| s.borrow().intents.iter().cloned().find(|i| i.id == id))
}

#[query]
fn list_intents() -> Vec<Intent> {
    STATE.with(|s| s.borrow().intents.clone())
}

#[update]
fn mark_paid(id: String, receipt_hash: Option<String>) -> Option<Intent> {
    STATE.with(|s| {
        let st = &mut *s.borrow_mut();
        if let Some(i) = st.intents.iter_mut().find(|i| i.id == id) {
            i.status = IntentStatus::Succeeded;
            i.receipt_hash = receipt_hash;
            return Some(i.clone());
        }
        None
    })
}

#[update]
fn refund_intent(id: String) -> Option<Intent> {
    STATE.with(|s| {
        let st = &mut *s.borrow_mut();
        if let Some(i) = st.intents.iter_mut().find(|i| i.id == id) {
            i.status = IntentStatus::Refunded;
            return Some(i.clone());
        }
        None
    })
}

#[update]
fn create_invoice(amount_minor: u64, currency: String, email_enc: Option<String>, description: Option<String>) -> Invoice {
    let inv = Invoice {
        id: gen_id("inv"),
        amount_minor, 
        currency,
        issued_at: time(),
        email_enc, 
        description,
        paid: false,
    };
    STATE.with(|s| s.borrow_mut().invoices.push(inv.clone()));
    inv
}

#[query]
fn list_invoices() -> Vec<Invoice> {
    STATE.with(|s| s.borrow().invoices.clone())
}

#[update]
fn set_provider_config(cfg: ProviderConfig) {
    STATE.with(|s| {
        let st = &mut *s.borrow_mut();
        if let Some(pos) = st.configs.iter().position(|c| std::mem::discriminant(&c.provider) == std::mem::discriminant(&cfg.provider)) {
            st.configs[pos] = cfg;
        } else {
            st.configs.push(cfg);
        }
    });
}

#[query]
fn get_provider_configs() -> Vec<ProviderConfig> {
    STATE.with(|s| s.borrow().configs.clone())
}

#[query]
fn health() -> (bool, u64) {
    (true, time())
}
