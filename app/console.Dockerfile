# renovate: datasource=github-tags depName=rust lookupName=rust-lang/rust
ARG RUST_VERSION=1.76.0@sha256:d36f9d8a9a4c76da74c8d983d0d4cb146dd2d19bb9bd60b704cdcf70ef868d3a

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
