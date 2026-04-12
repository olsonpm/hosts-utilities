#! /usr/bin/env sh

pnpm eslint && \
  pnpm prettier-check && \
  pnpm test-full && \
  pnpm coverage-check && \
  pnpm markdown-toc check && \
  pnpm check-markdown-links
