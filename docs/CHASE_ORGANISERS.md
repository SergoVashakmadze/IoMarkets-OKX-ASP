# Chase — expedite ASP listing review (#5774)

Copy-paste wording to nudge the **OKX AI Genesis Hackathon** organisers (HackQuest /
OKX.AI) about our listing that is still "under review". Pick the channel version you
have access to. Keep it polite and factual — the service is healthy; we're only
asking them to complete the manual approval before the deadline.

**Key facts (already verified):**
- ASP **#5774** "IoMarkets.ai" (role: ASP) — submitted **Jul 14, ~21:37 UTC**
- Status: still **"Listing under review" / "not listed"** (~25h+ at time of writing)
- Wallet / owner: `0x015bfbe816635b173e924688fba8794e30031266`
- Endpoint health: `/health` 200 (`questdb:true, proof:true, x402:true`),
  `/v1/signal/vwap` returns a valid **HTTP 402** x402 challenge
  (`exact` · `eip155:196` · USDT0 · $0.002), `/mcp/tools` 200
- Hard deadline: **Jul 17, 23:59 UTC** — eligibility requires the listing to be **LIVE**

---

## Short version — Discord / Telegram / X DM

> Hi team 👋 — could you help expedite review of my ASP listing for the OKX AI
> Genesis Hackathon? **Agent #5774 "IoMarkets.ai"** (ASP) has been **"under review"
> for ~25h** and still shows **"not listed"**. The service is fully live and passing:
> `/health` is 200, the priced route returns a valid x402 402 challenge (exact,
> eip155:196, USDT0), and the MCP manifest is up. Since eligibility requires the
> listing to be **live before Jul 17 23:59 UTC**, I'd really appreciate a review
> before the deadline. Owner wallet: `0x015bfbe816635b173e924688fba8794e30031266`.
> Happy to provide anything you need. Thank you!

---

## Longer version — email / support ticket / Google form comment

> **Subject: Expedite listing review before deadline — ASP #5774 "IoMarkets.ai" (OKX AI Genesis Hackathon)**
>
> Hi OKX.AI / HackQuest team,
>
> I'm submitting to the OKX AI Genesis Hackathon and my ASP listing is still pending
> manual review with the deadline approaching. Details:
>
> - **Agent / ASP ID:** #5774
> - **Name:** IoMarkets.ai — agent-native, pay-per-call market data with verifiable price proofs
> - **Role:** ASP (Agent-to-MCP / x402)
> - **Owner wallet:** `0x015bfbe816635b173e924688fba8794e30031266`
> - **Submitted:** Jul 14, ~21:37 UTC
> - **Current status:** "Listing under review" / "not listed" (~25h+ elapsed)
>
> The service is deployed and fully operational:
> - `https://okx.iomarkets.ai/health` → 200 (`questdb:true, proof:true, x402:true`)
> - `https://okx.iomarkets.ai/v1/signal/vwap` → **HTTP 402** with a valid x402 v2
>   challenge (`scheme: exact`, `network: eip155:196`, asset: USDT0
>   `0x779ded0c9e1022225f8e0630b35a9b54be713736`, price `2000` = $0.002,
>   payTo = the wallet above)
> - `https://okx.iomarkets.ai/mcp/tools` → 200 (MCP manifest)
>
> Because hackathon eligibility requires the listing to be **live before the Jul 17,
> 23:59 UTC deadline**, I'd be very grateful if you could review and approve #5774
> ahead of time. Please let me know if anything is missing or if I can provide
> additional information — I'll respond immediately.
>
> Thank you for your time,
> [Your name] — IoMarkets.ai

---

## Where to send it

- **HackQuest hackathon page / Discord:** https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon (look for the event Discord/Telegram + a "support" or "help" channel)
- **X:** post/DM referencing **#OKXAI** and tag **@OKX_AI**
- **Google form:** if it has a comments/notes field, paste the longer version there too when you submit

> Timing tip: send the nudge if it's **still not live by the morning of Jul 16**.
> Reference the Agent ID (**#5774**) and the deadline in the first line so it's
> triaged fast.
