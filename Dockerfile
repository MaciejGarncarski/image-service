FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . ${APP_DIR}
WORKDIR ${APP_DIR}

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps ${APP_DIR}/node_modules ${APP_DIR}/node_modules
COPY --from=build ${APP_DIR}/dist ${APP_DIR}/dist
EXPOSE ${PORT}
CMD [ "pnpm", "start" ]