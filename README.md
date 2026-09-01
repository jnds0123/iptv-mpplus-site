# Orpheus Hospitality Suite

Materials for the hospitality solutions pitch: a sales deck for hotel owners and
operators, the platform architecture behind it, and a clickable prototype.

> **Working name.** "Orpheus Hospitality Suite" is a placeholder used consistently
> across all three deliverables. Rename in one pass when the brand is settled.

## What's here

| Path | What it is |
|---|---|
| `presentation/Orpheus-Hospitality-Suite.pptx` | 24-slide sales deck, with speaker notes on every slide |
| `presentation/Orpheus-Hospitality-Suite.pdf` | The same deck as PDF, for sending ahead of a meeting |
| `presentation/build_deck.js` | Generator for the deck — edit this, not the .pptx |
| `docs/architecture.md` | Platform architecture: modules, data model, Android device strategy, build sequence |
| `demo/index.html` | Clickable prototype — guest television and hotel operations console |
| `privacy-policy.html` | Existing privacy policy for the IPTV MP+ Android app |

## The pitch, in one paragraph

A group operator's enterprise core — central reservations, an Opera-class property
management system, enterprise loyalty — is already solved and estate-wide. The layer
beneath it is not: in-room television, restaurant and bar point of sale, concierge
requests and guest identity documents are bought property by property from whoever is
local. The platform owns that layer, on one guest record, plugged into the enterprise
systems the group already runs. The guest television is the visible edge of it, running
natively on the set with no box behind it.

Every device in the property runs Android — the television, the point-of-sale tablets,
the kitchen display, the housekeeping handhelds, the identity scanner and the lobby
kiosk. One codebase, one device-management enrolment, commodity hardware. Two deliberate
exceptions: the guest's own phone, served as a web page because no guest installs an app
for a two-night stay, and the handset beside the bed, which is a standard SIP endpoint
registered to the hotel's existing PBX.

Telephony is integrated, not replaced. The platform gives the handset the guest record —
name on the display, class of service by stay state, wake-up calls, do-not-disturb that
the television and the housekeeping board both honour — and posts rated call records to
the same folio as dinner and the minibar. The Android handhelds housekeeping already
carry register as extensions on that same PBX, which removes the case for a separate
DECT fleet.

## Rebuilding the deck

```bash
npm install pptxgenjs
node presentation/build_deck.js
```

Content and layout both live in `build_deck.js`. To re-render for visual checking:

```bash
soffice --headless --convert-to pdf --outdir presentation \
        presentation/Orpheus-Hospitality-Suite.pptx
```

## The prototype

Open `demo/index.html` in any browser — no build step, no dependencies.

The point of the prototype is the cross-link, not the styling. Place an in-room dining
order on the television, then switch to the hotel console: the kitchen order, the
service ticket and the folio line are already there, because both screens read the same
state. That is the deck's central claim, made demonstrable in about fifteen seconds.

The television is driven by arrow keys, Enter and Backspace — the four inputs a hotel
remote actually has — or by the on-screen remote.

## Before this goes to a client

Four things in these materials are deliberately marked rather than invented, and need
real input:

1. **Orpheus Nations content.** `orpheusnations.com` was not reachable from the
   environment these materials were built in, so the catalogue, channel line-up and
   licensed territories are placeholders. Slide 19 and the prototype's `CATALOGUE`
   array both need the real thing.
2. **The commercial model** (slide 21) is a relative, illustrative model with no client
   figures in it. Rebuild it on the group's own outlet revenue, vendor spend, payroll
   and capex plan.
3. **Certification** (slide 22) is stated as a commitment with a date, not as a
   credential already held. Update it when the SOC 2 audit and penetration test
   actually complete — and correct anyone who reads it the other way.
4. **PMS and loyalty integration** is scoped per vendor. The deck deliberately promises
   no generic connector.

One trade is stated plainly in both the deck and the architecture doc rather than
buried: **Samsung Tizen and LG webOS sets cannot run the Android app natively.** A
property on either runs the same app on a small Android device behind the set until the
televisions refresh. Establish which sets a target property actually has before the
"no set-top box" line is used in a room.
