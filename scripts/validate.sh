#! /usr/bin/env sh

pnpm eslint && \
  pnpm prettier-check && \
  pnpm test-full && \
  pnpm coverage-check
