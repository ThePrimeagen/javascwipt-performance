use std::sync::Arc;

use anyhow::Result;
use clap::Parser;
use futures_util::{StreamExt, SinkExt, future::join_all};
use tokio_tungstenite::tungstenite::Message;
use url::Url;

#[derive(Debug, Parser)]
struct Config {
    #[clap(short, long, default_value = "0.0.0.0")]
    addr: String,

    #[clap(short, long, default_value = "42069")]
    port: u16,

    #[clap(short = 'q', long, default_value_t = 8)]
    parallel: usize,

    #[clap(short, long, default_value_t = 10000)]
    count: usize,
}

async fn handle_connection(addr: &'static Url) -> Result<()> {
    let (mut socket, _) = tokio_tungstenite::connect_async(addr).await?;
    let (mut write, mut read) = socket.split();

    write.send(Message::Text("join foobar".into())).await?;
    write.send(Message::Text("join bazbuz".into())).await?;

    return Ok(());
}

#[tokio::main]
async fn main() -> Result<()> {
    // start tokio tungstenite server
    let config = Config::parse();
    let addr: Url = Url::parse(&format!("ws://{}:{}", config.addr, config.port))?;
    let addr: &'static Url = Box::leak(Box::new(addr));
    let semaphore = Arc::new(tokio::sync::Semaphore::new(config.parallel));

    let mut handles = Vec::with_capacity(config.count);
    for _ in 0..config.count {
        let semaphore = semaphore.clone();
        let permit = semaphore.acquire_owned().await?;

        handles.push(tokio::spawn(async move {
            handle_connection(addr).await.unwrap();

            drop(permit);
        }));
    }

    join_all(handles).await;

    return Ok(());
}
