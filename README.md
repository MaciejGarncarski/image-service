# Image service

Upload images to your server! And serve them to your users!

<div align="center">
  <img alt="Image service logo" src="https://raw.githubusercontent.com/MaciejGarncarski/image-service/refs/heads/main/.github/assets/logo-crop.jpeg"/>
</div>

## Features

- File upload
- Static image serving
- API key authentication
  - Use x-api-header, could be changed by modifying the config file (src/config/config.ts)

## Documentation

https://image.maciej-garncarski.pl/docs

## Installation

### Fill out the .env file

```dotenv
API_KEY= # api key for authentication
PORT= # fastify app port
SERVER_HOST= # name of docker-compose service
# default name is "image-service" and "localhost" in development
REVERSE_PROXY_PORT= # reverse proxy port, most likely 80 or 443
REVERSE_PROXY_HOST= # your domain or "image-service-proxy" in development
IMAGE_DIR= # folder where images will be stored, folder should be located in this directory
```

### Install dependencies

Keep in mind that this app uses `Fastify v5`, which requires `Node.js v20` or higher.

You should use `pnpm` as package manager, I use it via `corepack`.

You need `docker` and `docker-compose` installed on your machine.

```bash
pnpm install
```

## Usage

```bash
docker compose up --build -d
```

## Development

### Start fastify app

```bash
pnpm dev
```

### Start reverse proxy

```bash
docker compose up nginx --build -d
```

## Testing

I used [vitest](https://vitest.dev/) for testing. My first thought was to use native Node.js test runner, but it has
some gimmicks like not being able to run Typescript files out of the box or running some tests twice. So I decided to
use vitest.

```bash
pnpm test
```

### Coverage

```bash
pnpm coverage
```

### Vitest UI

```bash
pnpm test-ui
```

## License

MIT

Copyright (c) 2024 Maciej Garncarski
