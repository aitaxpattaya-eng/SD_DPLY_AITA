---
title: SuiteDash Tools & Automation Scripts Overview
source: local:synto-knowledge, office:synto_wiki, wsl-bkk:synto_wiki
tags: [automation, bkk-sync, obsidian-vault, office-sync, suitedash, synto-knowledge,
  tools]
type: suitedash-hierarchy
---

# SuiteDash Secure API helper

Quote-safe PowerShell helper for calling the SuiteDash Secure API from this monorepo.

## Why this exists

The SuiteDash secret key is a bcrypt-style hash (`$2y$13$...`). If you put it inside a
**double-quoted** PowerShell string, PowerShell expands `$2y`, `$13`, `$BQVv...` as
(undefined) variables and sends a mangled secret → **401**. This helper reads creds
from env vars / a `.env` file, so the `$` chars are always preserved verbatim.

## Setup

```powershell
cp .env.example .env      # then edit .env with the real Public ID + Secret Key
. .\sd-api.ps1            # dot-source to load the functions
```

Or set env vars for the current shell only (use **single quotes** for the secret):

```powershell
$env:SUITEDASH_PUBLIC_ID  = 'a7b83bd6-...'
$env:SUITEDASH_SECRET_KEY = '$2y$13$...'
. .\sd-api.ps1
```

## Usage

```powershell
# schema (field definitions, no PII)
Invoke-SDApi '/secure-api/company/meta'

# list with paging
Invoke-SDApi '/secure-api/contacts' -Query @{ page = 1 }

# create
Invoke-SDApi '/secure-api/contacts' -Method POST -Body @{ name = 'Test'; role = 'Lead' }
```

`SUITEDASH_BASE` defaults to the white-label host `https://app.virtuallaunch.pro`
(verified working). Canonical host `https://app.suitedash.com` returns identical results.

## Security

- `.env` is gitignored — never commit real credentials.
- Rotate the Secure API key in SuiteDash (Settings → Secure API) if it is ever exposed.
- These endpoints expose Contact/Company **PII**. Don't bulk-dump records into logs,
  commits, or chat transcripts.
