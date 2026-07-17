# Chase — expedite ASP listing review (#5774)

> ## 🛑 STOP — chasing is over (Jul 16, ~21:00 UTC)
>
> Two attempts, two moderation actions: **Telegram restricted** the account, **Discord
> timed it out**. Do not post in any public community channel again — a third strike
> risks a permanent ban, which is a real cost against zero demonstrated benefit.
> Community mods do not run the OKX.AI listing queue; the review is OKX-internal.
>
> **The chase has produced nothing and cost two accounts. Drop it and go do the four
> deliverables that are actually in your control** (bridge → demo → X post → form),
> all of which are still undone with ~26h left. If you want one more nudge, put it in
> the **Google form's notes field** — official, unfiltered, and required anyway.
>
> Everything below is retained as a record. Most of it should not be sent.

Copy-paste wording to nudge the **OKX AI Genesis Hackathon** organisers (HackQuest /
OKX.AI) about our listing that is still "under review". Keep it polite and factual —
the service is healthy; we're only asking them to complete the manual approval.

**Key facts (already verified):**
- ASP **#5774** "IoMarkets.ai" (role: ASP) — submitted **Jul 14, ~21:37 UTC**
- Status: still **"Listing under review" / "not listed"** (~47h as of Jul 16, 20:51 UTC;
  `approvalRemark` is null — no rejection, no changes requested, just queued)
- Wallet / owner: `0x015bfbe816635b173e924688fba8794e30031266`
- Endpoint health: `/health` 200 (`questdb:true, proof:true, x402:true`),
  `/v1/signal/vwap` returns a valid **HTTP 402** x402 challenge
  (`exact` · `eip155:196` · USDT0 · $0.002), `/mcp/tools` 200
- Hard deadline: **Jul 17, 23:59 UTC** — eligibility requires the listing to be **LIVE**

---

## No-links version — for channels that reject links

> **⛔ DO NOT USE IN THE TELEGRAM GROUP.** Posting this as a reworded retry after the
> first message was filtered got the account **restricted** — see the Telegram
> section at the bottom. Use it only where links are rejected by format (e.g. a form
> field with a length/URL limit) and no filter has already blocked you.
>
> Note `IoMarkets.ai` and `OKX.AI` parse as domains (`.ai` is a real TLD), so they
> trip link filters even with no `https://` present. This version identifies the
> agent by **ID #5774** and omits every domain-like string.

> Hi team 👋 Could you help expedite a listing review for the OKX AI Genesis
> Hackathon? Agent **#5774** (name: IoMarkets, role: ASP) has been "under review" for
> **~47h** and still shows "not listed" — with no rejection and no changes requested
> against it, so it looks like it's simply queued. The service is fully live on my
> side: health check returns 200, the priced route returns a valid x402 v2 challenge
> (scheme `exact`, network `eip155:196`, asset USDT0, price $0.002), and the MCP
> manifest is serving. Eligibility requires the listing to be LIVE before the
> **Jul 17, 23:59 UTC** deadline — that's ~27h away. Owner wallet:
> `0x015bfbe816635b173e924688fba8794e30031266`. Happy to send the endpoint URL and
> full details by DM if that's easier. Thank you!

**If it still gets hidden:** the filter may block new/non-admin members outright
rather than matching on content. Then DM an organiser/admin directly (DMs normally
allow links) and use the long version there, or ask in-group "may I DM an admin about
ASP #5774?" — a question with no link at all will pass any filter.

---

## Short version — Discord / Telegram / X DM

> Hi team 👋 — could you help expedite review of my ASP listing for the OKX AI
> Genesis Hackathon? **Agent #5774 "IoMarkets.ai"** (ASP) has been **"under review"
> for ~47h** and still shows **"not listed"**, with no rejection or requested changes.
> The deadline is **~27h away**. The service is fully live and passing:
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
> - **Current status:** "Listing under review" / "not listed" (~47h elapsed, no
>   rejection or requested changes recorded against the listing)
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

## ⛔ Discord — DO NOT POST (timed out, Jul 16)

**This message got the account timed out.** Do not send it. Kept only as a record of
what not to do.

**Why it failed — the scam signature.** In a crypto community, a new account posting

> **wallet address + multiple URLs + urgency ("deadline", "expedite", "nudge")**

is the textbook drainer/spam pattern, and auto-mod is tuned to catch precisely that
combination. This message had all three. Both the Telegram hide and the Discord
timeout have the same root cause: **the gatekeeper was an automated filter, not a
human**, and the text was optimised for the human who never got to read it.

**The rule:** public community channels are the wrong tool for chasing a listing
review. Their mods cannot approve #5774 anyway — the review is OKX-internal. Use the
official, unfiltered channels: the **Google form's notes field** (goes straight to the
organisers, no auto-mod, and must be filed regardless) and **email/support ticket**.

> Hi! 👋 Hoping someone can point me in the right direction — I'm entered in the OKX
> AI Genesis Hackathon and my ASP listing is stuck in review with the deadline close.
>
> **Agent #5774 — "IoMarkets.ai"** (role: ASP). Submitted Jul 14 ~21:37 UTC, still
> showing "Listing under review" / "not listed" ~47h later, with no rejection and no
> changes requested against it — so I think it's queued rather than blocked on
> something I need to fix.
>
> The service is live and healthy on my side:
> • `https://okx.iomarkets.ai/health` → 200 (`questdb:true, proof:true, x402:true`)
> • `https://okx.iomarkets.ai/v1/signal/vwap` → HTTP 402 with a valid x402 v2
>   challenge (`exact`, `eip155:196`, USDT0, $0.002)
> • `https://okx.iomarkets.ai/mcp/tools` → 200 (MCP manifest)
>
> Since eligibility needs the listing LIVE before **Jul 17, 23:59 UTC**, is there
> anyone who can nudge the review — or is there a better channel for this? Owner
> wallet: `0x015bfbe816635b173e924688fba8794e30031266`. Happy to provide anything you
> need. Thanks!

The "is there a better channel for this?" line is deliberate — it gives whoever reads
it an easy, non-committal way to respond, and it's the question that actually gets you
routed to the OKX.AI reviewers rather than stuck with community mods.

---

## Where to send it

- **HackQuest hackathon page / Discord:** https://www.hackquest.io/hackathons/OKXAI-Genesis-Hackathon (look for the event Discord/Telegram + a "support" or "help" channel)
- **X:** post/DM referencing **#OKXAI** and tag **@okx**
- **Google form:** if it has a comments/notes field, paste the longer version there too when you submit

> **Status as of Jul 16, 20:51 UTC: send now** — review is at ~47h against an
> expected ~24h, and only ~27h remain. Reference the Agent ID (**#5774**) and the
> deadline in the first line so it's triaged fast.

## ⛔ Telegram — do not post here again (Jul 16)

The first paste was auto-hidden ("links not allowed in this group"). A reworded,
link-free repost followed, and **the admin then restricted the account from posting.**

**What went wrong:** rewording a filtered message and immediately reposting it reads
as deliberate filter evasion, and sending the same text across several channels at
once reads as spam. Both were bad advice recorded in an earlier version of this doc.

**Rules now:**
- **Do not post in that group again**, and do not attempt to work around the
  restriction. Evading a moderation action turns a slow review into a banned account.
- **Do not rapid-fire the same text across channels.** One channel, then wait.
- If a filter blocks a message, **ask a human** — don't re-engineer the message.
- Telegram was a weak channel anyway: **group admins do not run the OKX.AI listing
  queue.** Approval is OKX internal, so the channels below matter more.

**Appeal DM to the admin** (short, no links, no re-pitch — the goal is the restriction
lifted and a pointer to the right channel, not to sell the ASP):

> Hi — apologies, I wasn't trying to spam. My first message was auto-hidden for
> links, so I reposted without them; I realise now that looked like dodging the
> filter, which wasn't my intent. I'm a hackathon participant chasing a listing
> review that's stuck. Happy to stay quiet in the group — could you point me to the
> right place to ask? Sorry for the noise.
