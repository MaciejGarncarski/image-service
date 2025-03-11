FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /home/image-service
WORKDIR /home/image-service

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=prod-deps /home/image-service/node_modules /home/image-service/node_modules
COPY --from=build /home/image-service/dist /home/image-service/dist
EXPOSE ${PORT}
CMD [ "pnpm", "start" ]