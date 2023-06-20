#[macro_use]
extern crate wasm_bindgen;
extern crate wasm_bindgen_futures;

use js_sys::Promise;
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::JsFuture;
use web_sys::{window, Request, RequestInit, RequestMode, Response};

macro_rules! fetch_internal {
    ($url:expr) => {{
        #[wasm_bindgen]
        pub async fn fetch_internal(url: String) -> Result<JsValue, JsValue> {
            let mut opts = RequestInit::new();
            opts.method("GET");
            opts.mode(RequestMode::Cors);
            let request = Request::new_with_str_and_init(&url, &opts)?;
            let window = window().unwrap();
            let resp_value = JsFuture::from(window.fetch_with_request(&request)).await?;
            let resp: Response = resp_value.dyn_into().unwrap();
            let json = JsFuture::from(resp.json()?).await?;

            Ok(json)
        }
        fetch_internal($url.into()).await
    }};
}


#[wasm_bindgen]
pub async fn fetch_external(url: String) -> Result<JsValue, JsValue> {
    fetch_internal!(url)
}
