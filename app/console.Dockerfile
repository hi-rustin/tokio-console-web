# renovate: datasource=github-tags depName=rust lookupName=rust-lang/rust
ARG RUST_VERSION=1.76.0@sha256:a71cd88f9dd32fbdfa67c935f55165ddd89b7166e95de6c053c9bf33dd7381d5

FROM rust:$RUST_VERSION

RUN apt-get update \
    && apt-get install -y git

RUN git clone https://github.com/tokio-rs/console.git /opt/console

WORKDIR /opt/console

# Build the app example with web feature enabled
RUN cargo build --release --example grpc_web --features grpc-web

# Start app example with web feature enabled
CMD ["cargo", "run", "--release", "--example", "grpc_web", "--features", "grpc-web"]

# Expose port 9999
EXPOSE 9999
