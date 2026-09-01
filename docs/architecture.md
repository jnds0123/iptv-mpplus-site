# Orpheus Hospitality Suite — Platform Architecture

> **Working name.** "Orpheus Hospitality Suite" is a placeholder used consistently across
> this document, the sales deck, and the demo. Rename in one pass when the brand is settled.

**Status:** Design specification, v0.1. Nothing in this repository is implemented yet —
this document defines what gets built and in what order.

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

Design constraints:

- **The raw ID image is the most sensitive object in the system.** It is encrypted at rest with a
  separate key, is never returned to any surface except the front desk with an explicit reason
  code, and is purged on the retention clock even when the extracted fields are kept.
- Extraction is stored as structured fields, not as an image blob to be re-read later. Downstream
  modules consume fields, never the scan.
- Every read of a document is written to the audit log with actor, time, and reason.

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

The television is the highest-dwell-time screen in the room and, in most hotels, the least useful.
This module makes it the primary in-room interface.

- Personalised welcome: guest name, nights remaining, folio balance, messages waiting.
- Live TV with EPG, VOD, and the **Orpheus Nations** catalogue as the entertainment layer.
- Casting and screen mirroring from the guest's own device, with the session cleared at checkout.
- Hotel information: services, dining, spa, wayfinding, events, promotions.
- Ordering and concierge surfaced directly on the TV — this is what turns the screen from a cost
  line into a revenue line.
- Checkout and folio review from the remote.
- Housekeeping-triggered room reset: on checkout the profile, cast pairings, watch history, and any
  cached credentials are wiped before the next guest arrives.

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
| In-room television | Android TV / Google TV hospitality set | Native Android TV app (leanback UI, D-pad input) |
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
| 3 | `tv` guest app on Android TV | Highest visible impact; needs phases 1–2 to be worth anything |
| 4 | `serve` + `resv` + `voice` | Operational depth once the guest-facing surfaces exist; voice needs `pay` in place before calls can be charged |
| 5 | `booking` + distribution | Largest integration surface, most valuable once the rest is proven |
| 6 | `ops` analytics, multi-property | Meaningful only once real data is flowing |

---

## 9. Open questions

Items that need a decision or an answer from outside this document before build starts.

1. **Orpheus Nations integration surface.** Catalogue API, authentication model, DRM, and licensing
   territory are all unknown here — `orpheusnations.com` was not reachable from the environment this
   document was drafted in. The `tv` module treats the catalogue as an abstract content provider
   until the real interface is documented.
2. **Android television SKUs per target property.** The estate's actual models decide whether
   a property is a native deployment or needs an interim Android device behind the set.
3. **PMS shape per target property.** System of record, or alongside an incumbent.
4. **Target markets**, which determine statutory guest-register reporting, tax and receipt rules,
   and the payment methods that must be supported at launch.
5. **Payment acquirer and wallet partners**, per market.
6. **PBX vendor and version per property**, which decides how endpoints are provisioned, how
   call records are collected, and whether wake-ups and message-waiting live in the PBX or in
   the platform. Assume nothing generic here.
7. **Emergency calling rules per market**, and whether each property's current telephony
   already meets them.
