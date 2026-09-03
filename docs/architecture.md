# Orpheus Hospitality Suite — Platform Architecture

> **Working name.** "Orpheus Hospitality Suite" is a placeholder used consistently across
> this document, the sales deck, and the demo. Rename in one pass when the brand is settled.

**Status:** Design specification, v0.2. No production code exists yet. A working prototype in
`demo/` demonstrates the guest television, the pre-arrival capture flow and the operations
console against shared state; where this document and that prototype disagree, this document is
the intent and the prototype is a sketch of it.

---

## 1. The thesis

A hotel today runs its business on six to ten systems that do not talk to each other: a PMS, a
booking engine, a channel manager, a restaurant POS, a separate bar POS, a payment terminal, a
spreadsheet for concierge requests, a filing cabinet of photocopied passports, and a TV system
sold by whoever installed the televisions.

Every one of those systems holds a partial copy of the same guest. None of them holds the whole
one. The cost shows up as re-keying, reconciliation, missed upsell, and a guest who has to
introduce themselves five times in a three-night stay.

**The platform's single organising idea: one guest record, written once at check-in, read by
every surface the guest or the staff touches.** Every module below is a consumer of that record,
not an owner of its own copy.

---

## 2. System context

```
                       ┌─────────────────────────────────────────┐
                       │          Guest-facing surfaces          │
                       ├──────────┬──────────┬─────────┬─────────┤
                       │ In-room  │  Guest   │  Web    │  QR /   │
                       │ TV+phone │  mobile  │ booking │ kiosk   │
                       └────┬─────┴────┬─────┴────┬────┴────┬────┘
                            │          │          │         │
                            └──────────┴────┬─────┴─────────┘
                                            │  HTTPS / JSON
                       ┌────────────────────▼────────────────────┐
                       │              API gateway                │
                       │   authn · authz · rate limit · audit    │
                       └────────────────────┬────────────────────┘
                                            │
        ┌───────────┬───────────┬───────────┼───────────┬───────────┬──────────┐
        │           │           │           │           │           │          │
   ┌────▼───┐  ┌────▼───┐  ┌────▼───┐  ┌────▼───┐  ┌────▼───┐  ┌────▼───┐ ┌────▼───┐
   │identity│  │  crm   │  │booking │  │  pay   │  │ order  │  │ serve  │ │tv+voice│
   │ + docs │  │        │  │ + resv │  │        │  │        │  │        │ │        │
   └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘  └────┬───┘ └────┬───┘
        │           │           │           │           │           │          │
        └───────────┴───────────┴─────┬─────┴───────────┴───────────┴──────────┘
                                      │
                        ┌─────────────▼─────────────┐
                        │  Guest record (canonical)  │
                        │  + event log (append-only) │
                        └─────────────┬─────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
   ┌────▼─────┐   ┌────────────┐   ┌─────▼──────┐               ┌──────▼──────┐
   │ Existing │   │  Existing  │   │  Payment   │               │   Orpheus   │
   │   PMS    │   │  SIP PBX   │   │  acquirer  │               │   Nations   │
   │(optional)│   │            │   │  / wallet  │               │  (content)  │
   └──────────┘   └────────────┘   └────────────┘               └─────────────┘
```

**Staff surfaces** (front desk, housekeeping, kitchen display, manager dashboard) sit on the same
gateway with different role scopes. They are deliberately not drawn above to keep the diagram
readable; architecturally they are peers of the guest surfaces.

---

## 3. Modules

Each module is an independently deployable service with its own datastore. They communicate
synchronously through the gateway for reads and asynchronously through the event log for
state changes, so a module can be down without taking the stay down with it.

### 3.1 `identity` — Guest identity and digital documentation

The module that replaces the photocopier and the filing cabinet, and the reason "digitalize
everything" is achievable rather than aspirational.

| Capability | Detail |
|---|---|
| ID capture | Passport MRZ, national ID, driver's licence — camera or flatbed scanner |
| OCR + parse | Name, document number, nationality, date of birth, expiry, sex |
| Liveness / match | Optional selfie-to-document face match for remote pre-check-in |
| Registration card | Pre-filled from the scan, signed on a tablet or the guest's own phone |
| Document vault | Registration cards, folios, invoices, receipts, contracts, incident reports |
| Statutory reporting | Guest register export for local police / immigration filing |
| Retention | Per-document-type TTL with automatic purge and a deletion audit trail |
| Access record | A read counter and full audit entry per document, visible to the front desk |

Design constraints:

- **The raw ID image is the most sensitive object in the system.** It is encrypted at rest with a
  separate key, is never returned to any surface except the front desk with an explicit reason
  code, and is purged on the retention clock even when the extracted fields are kept.
- Extraction is stored as structured fields, not as an image blob to be re-read later. Downstream
  modules consume fields, never the scan.
- Every read of a document is written to the audit log with actor, time, and reason, and increments
  a visible counter on the document. A document nobody should be opening that shows a rising count
  is the signal a compliance review is looking for.
- **Pre-arrival capture runs on the guest's own phone as a web page, not as an app.** Nobody
  installs software for a two-night stay, and that surface must work on iOS. It is the one
  deliberate exception to the Android-everywhere rule in section 4. The scan is parsed on the
  device; what reaches the platform is structured fields.

### 3.2 `crm` — Guest profile and relationship

- Unified profile keyed on the canonical guest ID: stay history, spend across every outlet,
  loyalty tier, lifetime value.
- Preferences captured once and honoured everywhere: floor, bed, pillow, newspaper, allergies and
  dietary restrictions, language, do-not-disturb pattern.
- Allergy and dietary flags propagate into `order` as hard warnings on the kitchen ticket. This is
  a safety feature, not a marketing one.
- Segmentation and campaigns: pre-arrival upsell, post-stay follow-up, win-back.
- Consent ledger: what the guest agreed to, when, on which surface, and the version of the text
  they were shown. Marketing sends check consent at send time, not at list-build time.

### 3.3 `booking` — Reservations and distribution

- Direct booking engine (web and mobile), commission-free, with the hotel's own rate presentation.
- Rate plans, inventory, restrictions (min-stay, closed-to-arrival, stop-sell).
- Channel management to OTAs, with inventory decrements committed through the event log so an
  overbooking race resolves deterministically rather than by whoever wrote last.
- Group and corporate blocks, allotments, cut-off dates.
- Pre-arrival flow: confirmation → pre-check-in link → ID scan → payment authorisation → room
  ready notification. A guest who completes it walks past the front desk queue.

### 3.4 `resv` — Facility reservations

Distinct from room booking and often conflated with it, to everyone's cost. Covers restaurant
tables, spa treatments, gym classes, function and meeting rooms, tours, and airport transfers.

Generic resource-and-capacity calendar: a resource has capacity per time slot, a booking consumes
capacity, and overbooking rules are per-resource. One engine serves every facility type rather
than a bespoke calendar per outlet.

### 3.5 `pay` — Payments and folio

- Methods: card (tap, chip, keyed), digital wallets, bank transfer, cash reconciliation.
- **Room charge is the important one.** Any outlet — bar, restaurant, spa, TV, minibar — posts to
  the guest folio through one API. The folio is the single account for the stay.
- Tokenised card-on-file for pre-authorisation, incidentals, and no-show charges. Card data goes
  from the capture device to the acquirer; the platform stores a token, never a PAN. This keeps
  PCI DSS scope at SAQ A / A-EP rather than SAQ D.
- Split billing, partial settlement, company/city ledger, deposits, refunds.
- Multi-currency with the rate locked at authorisation.

### 3.6 `order` — Food, beverage, and retail

- POS for restaurant and bar, running on tablets or fixed terminals.
- In-room dining ordered from the TV or the guest's phone, charged to the folio without a signature
  chase.
- QR ordering at table, poolside, and in the lobby.
- Kitchen display system with routing by prep station and course firing; bar tickets separated from
  kitchen tickets.
- Menu engineering: modifiers, combos, availability by daypart, 86-ing an item propagates to the TV
  and QR menus within seconds.
- Recipe costing and stock depletion feeding into `ops` margin reporting.

### 3.7 `serve` — Concierge and service delivery

- One request queue behind every channel: TV, phone, chat, QR, front desk.
- Ticketing with type, priority, SLA clock, assignment, and escalation on breach.
- Housekeeping board: room status, turn-down, linen change, inspection, out-of-order rooms.
- Maintenance work orders with asset history.
- Messaging: in-app and TV chat, plus the channels guests actually use in-market.
- Local recommendations, transport, and tour bookings, which hand off to `resv`.

### 3.8 `tv` — In-room entertainment and the guest hub

The television is the highest-dwell-time screen in the room and, in most hotels, the least
useful. This module makes it the primary in-room interface.

**The decision that shapes this module: the guest television is the Orpheus client, not a
hotel application that embeds Orpheus.** The in-room app is the same Android TV codebase that
serves the consumer product, running in a hospitality mode, with a group of stay sections added
to the existing navigation. It is not a fork.

That has consequences worth being explicit about, because the alternative — a separate hotel app
that calls a content API — is the obvious choice and the wrong one:

- **One codebase, one release train.** A fork would need every player, source-handling and
  interface change applied twice, and would drift within two releases.
- **The guest gets the product, not an imitation of it.** Navigation, artwork, and playback are
  identical to what they would use at home.
- **Hospitality mode is provisioning, not a build.** The same APK, flagged at enrolment, hides the
  account-holder controls and shows the stay group.

Navigation follows the consumer product's own taxonomy, with the stay group beneath a divider:

| Group | Sections |
|---|---|
| Entertainment | Home, Live TV, Live Radio, Movies, TV Shows, Music, Playlist |
| Your stay | Dining, Reservations, Concierge, Hotel, My Bill |

Account-holder controls — account, address book, invitations, and the whole administration group
(user status, stream setup, stream maintenance) — are **absent in hospitality mode**. They belong
to whoever owns the subscription, not to a guest in room 812.

Guest-facing capability:

- Personalised welcome: guest name, nights remaining, loyalty tier, messages waiting.
- Live TV with guide data, live radio, on-demand film, series and music — from the sources the
  property has registered, not from a bundled library. See *Content sourcing* below.
- Casting and screen mirroring from the guest's own device.
- Hotel information: services, dining, spa, wayfinding, events, promotions.
- Ordering, reservations and concierge on the remote — what turns the screen from a cost line
  into a revenue line.
- Folio review and express checkout.

#### Content sourcing: a player, not a library

**Orpheus Nations owns no content and holds no catalogue.** It is a multimedia player over a
source registry. Getting this right in the document matters, because the obvious reading — that
the platform brings a licensed library with it — is wrong and would be a misrepresentation to a
hotel.

- **Sources** are playlists and service endpoints: M3U/M3U8, Xtream-style services, and XMLTV
  guide data. They are registered per property, not compiled into the application.
- **Sources are dynamic by design.** They are expected to change, and can be updated at any time
  without redeploying anything to a single television in the estate.
- **Smart search is a liveness and accuracy prober.** Every registered endpoint is checked
  continuously — is it reachable, does it serve what its metadata claims, does it still play —
  and the result gates what the interface offers.
- **Only live sources are surfaced.** A dead or misdescribed endpoint is withheld from the guest
  interface rather than shown and failing on selection. On a hotel television a channel that does
  not play is a call to the front desk, so this is an operational feature, not a cosmetic one.
- Nothing is stored, hosted or transcoded by the platform. The player resolves and plays.

**Where the rights sit, and why hospitality differs from consumer use.**

A consumer pointing a player at their own sources is playing content to themselves. A hotel
putting a stream on a guest television is **publicly performing it commercially**, which requires
the right to do so. The architecture therefore treats the source registry as property-supplied
and property-licensed:

- A hospitality deployment is provisioned only against sources the property or group already has
  the right to show: its existing linear feeds, its licensed on-demand provider, free
  ad-supported channels offered for redistribution, and its own hotel channels.
- **Community-maintained link lists are not a licensed source for commercial redistribution.**
  The public repository and forum lists a consumer install might use must not be provisioned into
  a hospitality estate. This is a hard constraint on the product, not a deployment preference.
- Source provenance is recorded per entry, so a property can evidence what it is showing and on
  whose authority. Treat it as an audit requirement.

This boundary is also the easier sale. The group keeps the content contracts it already has and
gets a better player over them, rather than being asked to change supplier.

#### Identity and entitlement: the room is the subscriber

On the consumer product the account is the person. In a hotel it cannot be — a guest will not sign
in for two nights, and nothing they do may survive them. **The stay is the subscriber.**

- Entitlement is issued to the room, bound to the stay, and expires at checkout. No guest account
  is created and no guest credential is stored.
- Watch history, resume points, playlist and cast pairings are scoped to the `Stay`, not to a
  person. They are the guest's while the stay is open and are destroyed when it closes.
- **Room reset on checkout is a hard requirement, not a feature.** Profile, pairings, history,
  playlist and any cached credential are wiped before housekeeping releases the room. This is the
  single most common failure in hotel TV deployments and the first thing a hotel's IT will test.
- A guest who wants their own subscriptions uses casting. Their credentials stay on their phone
  and never touch the room.
- Because the platform holds no catalogue and no subscriber accounts, entitlement is internal and
  simple: a room is bound to the property's registered source set while its stay is open, and
  unbound at checkout. There is no external rights-holder to grant or revoke against, which
  removes a class of integration risk the alternative — reselling someone's licensed library —
  would have carried.

### 3.9 `voice` — In-room telephony and staff extensions

The hotel already owns a SIP PBX. This module does not replace it — it becomes a client
of it, and gives the handset the one thing it has never had: the guest record.

| Capability | Detail |
|---|---|
| Endpoint | SIP desk phone in the room, registered to the hotel's existing PBX |
| Guest identity | Name and language on the handset display, set at check-in and cleared at checkout |
| Class of service | Call barring by stay state — international opened on request, everything barred once the room is vacant |
| Wake-up calls | One schedule, settable from the handset, the television or the desk, escalating to the desk on no answer |
| Do not disturb | Set anywhere, honoured everywhere: handset, television and the housekeeping board |
| Message waiting | Indicator driven by `serve` messages, so the lamp and the television agree |
| Room-to-room | Guests dial a room number; the platform maps it to the current extension |
| Call charging | Call detail records collected from the PBX, rated, and posted as folio lines |
| Staff extensions | The Android handhelds housekeeping and maintenance already carry register as extensions on the same PBX |
| Emergency calling | Direct dial with no prefix, simultaneous on-site notification, dispatchable location per room |

**What we need from the PBX**, and the thing to establish per vendor before quoting:

1. **Endpoint registration or provisioning** — the ability to register handsets, or to push
   per-extension configuration (display name, class of service) as guests come and go.
2. **A call detail record feed** — file drop, database, or API. Without CDRs there is no
   call billing, only dial tone.
3. **A control interface** for wake-ups, DND and message-waiting, if those are to live in
   the PBX rather than in the platform.

Where a PBX exposes only a legacy hospitality link (a serial or socket protocol built for
a 1990s PMS), the platform speaks it rather than asking the hotel to replace the PBX — but
that is integration work to be scoped, not assumed.

**Emergency calling is a legal obligation, not a feature.** Several markets require that an
emergency number be reachable with no prefix from any handset, that someone on site is
notified when it is dialled, and that the location passed to the emergency service is precise
enough to find the room. Verify a property's current telephony against the rules of its own
market at survey — the answer is often that the existing setup does not comply, which makes
this module easier to justify rather than harder.

Older rooms with analogue handsets bridge to the same PBX through an analogue terminal
adapter. A room does not have to be rewired to join the platform.

### 3.10 `ops` — Administration and analytics

- Single operational dashboard across every module, with role-based access control.
- Multi-property: a group sees the estate, a property sees itself, staff see their function.
- Commercial reporting: occupancy, ADR, RevPAR, F&B covers and average check, outlet margin,
  service SLA attainment, channel mix and cost of acquisition.
- Full audit trail across modules, exportable for compliance review.

---

## 4. Device strategy — Android everywhere

**The platform targets one operating system: Android.** Not only the television — every
device in the property, guest-facing and staff-facing alike.

| Surface | Device | Client |
|---|---|---|
| In-room television | Android TV / Google TV hospitality set | The Orpheus Android TV app in hospitality mode (D-pad input) — see 3.8 |
| Restaurant, bar, room-service POS | Android tablet | Native Android app (touch UI) |
| Kitchen display | Android tablet or Android-based panel | Native Android app, kiosk mode |
| Housekeeping and maintenance | Android handheld or tablet | Native Android app |
| Identity capture | Android handheld with camera, or a tablet at the desk | Native Android app, on-device MRZ/OCR |
| Self-service kiosk | Android kiosk unit | Native Android app, locked task mode |
| Guest's own phone | Android or iOS | Responsive web — no install asked of a guest |
| Manager dashboard | Any browser | Responsive web |

The one deliberate exception is the guest's own phone. Asking a guest to install an app
for a two-night stay fails; that surface is a web page reached from a QR code or a link
in the confirmation, and it is the only client that must also work on iOS.

### Why this is the right constraint

- **One codebase and one release train.** A shared Kotlin core (networking, auth, the
  guest record, offline queue, sync) with per-surface UI modules. Supporting Tizen and
  webOS alongside Android would mean maintaining an HTML5 client in parallel forever,
  for a minority of screens.
- **One device-management story.** A single Android Enterprise / EMM enrolment covers
  the television, the tablets, the handhelds and the kiosk. Provisioning, policy,
  patching and remote wipe are one process across the estate, not four.
- **Commodity hardware.** Android hospitality televisions, tablets and handhelds are
  sourceable in any market at competitive prices, with more than one vendor. Nothing
  in the platform ties a group to a single hardware supplier.
- **One security posture.** A single patch baseline and one set of platform controls to
  present at a vendor review, rather than a matrix of per-OS answers.
- **Offline tolerance.** Native Android lets every staff device hold a local queue and
  keep taking orders and requests through a network drop, syncing when it returns. An
  HTML5 client on a vendor's TV stack cannot be relied on to do this.

### The honest cost

**Samsung Tizen and LG webOS sets cannot run the application natively.** Those two
account for a large share of installed hospitality estates. A property on either runs
the identical app on a small Android device behind the set until the televisions
refresh — which reintroduces exactly the box the platform otherwise removes, for that
property, for that period.

This is a real trade and should be stated in the first meeting, not discovered at
survey. The counter-argument is timing: the box is temporary and aligned to a refresh
cycle the group already budgets for, and it buys a single codebase in exchange.

**Two constraints to put in front of a hotel's IT before signing anything:**

1. **Hospitality SKU, not consumer.** Hospitality-model Android televisions permit
   managed app install, kiosk lockdown, cloned setup across rooms and centralised
   firmware control. Consumer models generally do not.
2. **Network.** Per-room wired or reliable WiFi, VLAN separation of guest and device
   traffic, and multicast support if live TV is delivered over IP rather than RF.

Neither is a blocker. Both are cheaper to discover at survey stage than at install stage.

### Server-side by default

All business logic, personalisation, pricing and billing stay server-side. Every Android
client is a rendering, input and local-queue layer. This keeps behaviour identical across
surfaces, lets a menu or rate change take effect everywhere at once, and keeps the client
small enough to run on the modest hardware inside a television.

## 5. PMS position

Two deployment shapes, chosen per property:

- **Platform as system of record.** For independents and small groups with no PMS, or with a PMS
  they want to retire. The platform owns the guest, the reservation, and the folio.
- **Platform alongside an existing PMS.** For properties committed to an incumbent. The PMS remains
  the reservation and folio system of record; the platform syncs guest, stay, and folio postings
  over the PMS's integration interface, and owns the surfaces the PMS does not serve — TV,
  ordering, concierge, documents.

The second shape is the more common sale and the harder integration. Scope it per PMS vendor;
do not promise a generic connector.

---

## 6. Data model — core entities

```
Guest        id, names, contact, nationality, language, preferences[], consents[], loyalty
Document     id, guest_id, type, extracted_fields, storage_ref, retention_until, access_log[]
Reservation  id, guest_id, property_id, room_type, dates, rate_plan, channel, status
Stay         id, reservation_id, room_id, checked_in_at, checked_out_at, folio_id
Folio        id, stay_id, currency, lines[], balance, settlements[]
FolioLine    id, folio_id, source_module, outlet_id, description, amount, tax, posted_at
Order        id, stay_id | table_id, outlet_id, items[], status, folio_line_id
Request      id, stay_id, type, priority, sla_due_at, assignee_id, status, events[]
ResvSlot     id, resource_id, starts_at, capacity, consumed
CallRecord   id, stay_id, extension, dialled, direction, started_at, seconds, rate, folio_line_id
Device       id, property_id, room_id, platform, app_version, last_seen, health
```

Two rules that keep the model honest:

- **`FolioLine` is the universal revenue primitive.** Every module that can charge money produces
  folio lines and nothing else. There is exactly one path from a charge to the guest's bill —
  a rated call reaches the guest's bill by exactly the same route as a club sandwich.
- **The event log is append-only and authoritative for state changes.** Module datastores are
  projections. This is what makes the audit trail credible to a compliance reviewer and what lets
  a module rebuild after failure.

---

## 7. Security and compliance

- TLS 1.3 in transit; AES-256 at rest, with identity documents under a separately managed key.
- RBAC with least privilege; every privileged read carries an actor, timestamp, and reason code.
- PCI DSS scope minimised by tokenisation — the platform is never in the cardholder data path.
- Data subject rights: export and erasure implemented as first-class operations, with erasure
  respecting statutory retention on guest registers where local law requires it.
- Data residency configurable per property, which matters for groups operating across borders.
- Guest-facing consent is versioned; the consent ledger records which version was shown.

---

## 8. Build sequence

Ordered so that each phase ships something a hotel can use, rather than deferring value to a
big-bang launch.

| Phase | Scope | Why this order |
|---|---|---|
| 1 | `identity` + `crm` + document vault | The guest record is the spine; nothing else is coherent without it |
| 2 | `pay` + folio, `order` for one outlet | Proves the universal charge path on a small blast radius |
| 3 | `tv` — hospitality mode in the existing Orpheus Android TV app | Highest visible impact; an extension of a shipped app rather than a new one, so the work is the stay group and entitlement, not a player |
| 4 | `serve` + `resv` + `voice` | Operational depth once the guest-facing surfaces exist; voice needs `pay` in place before calls can be charged |
| 5 | `booking` + distribution | Largest integration surface, most valuable once the rest is proven |
| 6 | `ops` analytics, multi-property | Meaningful only once real data is flowing |

---

## 9. Open questions

Items that need a decision or an answer from outside this document before build starts.

1. **Source provisioning per property.** There is no catalogue to license — the platform is a
   player over a registry, per section 3.8. What each property is entitled to show, and who
   supplies and licenses those sources, is a per-deal question and the first thing to settle in
   the television module. A group with an existing linear contract is straightforward; a property
   with nothing needs a content conversation before a technical one.
2. **Source health at hospitality standard.** Smart search already gates dead endpoints. What is
   not yet established is the standard a hotel will hold it to — how quickly a failure is
   detected, what the guest sees in the gap, and whether a property will accept a channel list
   that can change beneath it. Agree the target before the pilot, because "the channel was there
   yesterday" is a front-desk problem, not a technical one.
3. **Android television SKUs per target property.** The estate's actual models decide whether
   a property is a native deployment or needs an interim Android device behind the set.
4. **PMS shape per target property.** System of record, or alongside an incumbent.
5. **Target markets**, which determine statutory guest-register reporting, tax and receipt rules,
   and the payment methods that must be supported at launch.
6. **Payment acquirer and wallet partners**, per market.
7. **PBX vendor and version per property**, which decides how endpoints are provisioned, how
   call records are collected, and whether wake-ups and message-waiting live in the PBX or in
   the platform. Assume nothing generic here.
8. **Emergency calling rules per market**, and whether each property's current telephony
   already meets them.
