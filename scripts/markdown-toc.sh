#! /usr/bin/sh

cmd="${1}"

pnpm markdown-toc-gen "${cmd}" ./readme.md \
  ./docs/**/*.md
