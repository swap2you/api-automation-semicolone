# Notifications setup (email and Microsoft Teams)

After a test run, [`global-teardown.ts`](../global-teardown.ts) reads `test-results.json` and sends alerts when tests fail (default: **only on failure**).

## Why email might not arrive

Email was **not sent** in local runs when:

- `NOTIFY_ENABLED` is not `true`, or
- `SMTP_HOST` / `NOTIFY_FROM` / `NOTIFY_TO` are empty, or
- Corporate SMTP blocks unauthenticated relay from your laptop.

The teardown logs: `Notification not sent: ...` with the reason.

## Option A — Email (SMTP)

1. Copy [`.env.example`](../.env.example) → `.env`.
2. Set:

```env
NOTIFY_CHANNEL=email
NOTIFY_ENABLED=true
NOTIFY_TO=swapnil_patil10@persistent.com
NOTIFY_FROM=<approved-sender@persistent.com>
SMTP_HOST=<your-org-smtp-host>
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<if-required>
SMTP_PASS=<if-required>
NOTIFY_ONLY_ON_FAILURE=true
```

3. Run tests (failures trigger mail):

```powershell
npm run test:open-meteo
```

4. Preview without sending:

```powershell
npm run notify:test -- --failure --to swapnil_patil10@persistent.com
```

## Option B — Microsoft Teams (recommended if SMTP is blocked)

No SMTP required. Supports:

- **Power Automate** HTTP trigger (Workflows URL from `powerplatform.com`) — default in this repo
- **Classic Incoming Webhook** (`outlook.office.com/webhook/...`)

**Step-by-step:** [`run-project-wizard.md`](run-project-wizard.md) §6.

### Configure `.env`

```env
NOTIFY_CHANNEL=teams
NOTIFY_ONLY_ON_FAILURE=true
TEAMS_WEBHOOK_KIND=powerautomate
TEAMS_WEBHOOK_URL=https://....powerplatform.com/.../invoke?api-version=1&...
ALLURE_REPORT_URL=http://localhost:9292
```

### Test without a failing test run

```powershell
npm run notify:teams -- --failure --send
```

### Power Automate flow mapping

In the **Post message in a chat or channel** action, bind:

| Teams field | Trigger body field |
|-------------|-------------------|
| Message | `message` or `text` |
| Title (if separate) | `title` |
| Card (optional) | first item in `attachments` |

Payload includes: **verdict**, **counts**, **failed test list with errors**, **Allure URL**, and **numbered next steps**.

### Run after real tests

```powershell
npm run test:ci
```

On failure, global teardown posts automatically when `TEAMS_WEBHOOK_URL` is set.

## Option C — Both

```env
NOTIFY_CHANNEL=both
NOTIFY_ENABLED=true
# ... SMTP_* and TEAMS_WEBHOOK_URL
```

## GitHub Actions secrets

| Secret | Used for |
|--------|----------|
| `NOTIFY_CHANNEL` | `email` \| `teams` \| `both` |
| `NOTIFY_ENABLED` | `true` for email path |
| `SMTP_*`, `NOTIFY_FROM`, `NOTIFY_TO` | Email |
| `TEAMS_WEBHOOK_URL` | Teams |
| `NOTIFY_ONLY_ON_FAILURE` | `true` on nightly (recommended) |

Wire these in [`.github/workflows/nightly.yml`](../.github/workflows/nightly.yml) (PR CI keeps notifications off by default).

## Disable notifications

```env
NOTIFY_CHANNEL=none
```
