# Image service

Upload images to your server! And serve them to your users!

## Features

- File upload
- Static image serving
- API key authentication
    - Use x-api-header, could be changed by modifying the config file (src/config/config.ts)

## Documentation

https://todo.dontuse/documentation

## Installation

### Fill out the .env file

```dotenv
IMAGE_DIR=
APP_DIR=
PORT=
API_KEY=
```

### Install dependencies

Keep in mind that this app uses Fastify v5, which requires Node.js v20 or higher.

```bash
pnpm install
```

## Usage

```bash
pnpm dev
```

## Testing

TODO

```bash
pnpm test
```

## License

MIT

Copyright (c) 2024 Maciej Garncarski