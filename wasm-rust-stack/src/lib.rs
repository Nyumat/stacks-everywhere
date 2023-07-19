#[macro_use]
extern crate wasm_bindgen;
extern crate wasm_bindgen_futures;

use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{window, Request, RequestInit, RequestMode, Response};

macro_rules! our_macro {
    ($url:expr) => {{
        let mut opts = RequestInit::new();
        opts.method("GET");
        opts.mode(RequestMode::Cors);

        let request = Request::new_with_str_and_init($url.as_str(), &opts)?;

        let window = window().unwrap();
        let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;

        assert!(resp_value.is_instance_of::<Response>());
        let resp: Response = resp_value.dyn_into().unwrap();

        let json = JsFuture::from(resp.json()?).await?;
        Ok(json)
    }};
}


#[wasm_bindgen]
pub async fn fetch_external(url: String) -> Result<JsValue, JsValue> {
    our_macro!(url)
}
