---
title: Weaver
description: A local-first Go CLI for stacked Git branches, dependency DAGs, stack sync, and ephemeral integration branches.
repo: https://github.com/lutefd/weaver
stack:
  - go
  - git
  - cli
featured: true
status: active
---

Weaver stores stack relationships in `.git/weaver/`, resolves them as a DAG, and uses regular Git commands so the workflow remains inspectable without GitHub metadata or external services.
