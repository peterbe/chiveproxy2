# https://github.com/casey/just
# https://just.systems/

dev:
    bun dev

build:
    bun run build

start: build
    bun run serve

start-for-testing:
    NODE_ENV=test bun run build
    NODE_ENV=test bun run preview -- --port 3000

tsc:
    bun run tsc

lint:
    bun run lint
    bun run tsc

lintfix:
    bun run lint:fix

format: lintfix
    bun run fmt

install:
    bun install

outdated:
    bun outdated

upgrade:
    bun update --interactive --minimum-release-age=86400 && bun install

