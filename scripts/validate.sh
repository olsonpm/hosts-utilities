#! /usr/bin/env sh

pnpm prettier-check && \
  pnpm test-full && \
  pnpm coverage-check
