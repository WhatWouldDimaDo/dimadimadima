---
title: Permit Propensity
date: 2026-07-24
description: "I’m investigating the predictive power of public permit and real-estate data for uncovering new opportunities and better leads for high-end trades."
shortDescription: "Can public property data reveal the next useful opportunity for a builder or high-end trade?"
tags: [data, analytics, python, duckdb, gis, experimentation]
status: research
featured: true
caseStudy: true
order: 2
image: /groundline/img/mock-targeting-map.png
proof:
  - "8,701 permit records across 7 public-source pipelines"
  - "143,031 parcel records and 97,446 valuation rows"
  - "388 named outdoor-project households identified in Atlanta and Sandy Springs"
buildTools:
  - name: Python + DuckDB
    detail: Parcel-keyed data store, source ingestion, matching, back-testing, and reproducible outputs.
  - name: ArcGIS + county permit systems
    detail: Public permit and parcel sources across Atlanta, Fulton, DeKalb, Dunwoody, and Sandy Springs.
  - name: Conditional logistic regression
    detail: Compared customer parcels with value- and geography-matched controls without pretending the sample was larger than it was.
  - name: Address + parcel resolution
    detail: Parcel identifiers, normalized addresses, and spatial point-in-polygon matching connect events to properties.
  - name: Research agents
    detail: Mapped source availability, competitors, market positioning, and failure modes; load-bearing claims were rechecked.
  - name: Property Transition Atlas
    detail: Turns the research into an explorable view of events, territories, contractor patterns, and evidence quality.
---

## The Hunch

Landscaping companies usually hear about a project after the homeowner has already decided to act. I wondered whether public data could surface the opportunity earlier.

A pool permit can imply a yard that will need to be rebuilt. An addition, recent sale, retaining wall, or nearby completed project might also signal future outdoor work. The initial question sounded simple:

> Which public signals make a household more likely to buy a high-end landscaping project?

The temptation was to jump straight to a score. I started with a back-test instead.

## Round One: A Small Sample and One Surviving Signal

I resolved one landscaping client’s historical jobs to parcels, removed non-customer and zero-dollar records, and compared **30 customer properties with 140 controls** matched on ZIP and appraised-value band.

The result was mostly a useful rejection of my assumptions:

- **Recent sale:** not supported in the covered sample; these customers skewed toward established owners investing in homes they had held, not new movers
- **A sharp value increase:** not supported
- **Absentee ownership:** not supported
- **Near a prior paying job:** the one signal that survived

Six of the 30 customer properties were within 500 meters of an earlier, different-client job. But those six observations represented only about four real geographic clusters. That is enough to support a straightforward neighbor campaign—not enough to sell a magical prediction model.

The judgment call was to leave the p-value inside the research and tell the simpler truth outside it:

> Every finished project seeds its street. Start by helping the neighbors see what is now possible.

## The Pivot

Instead of squeezing a fitted propensity score out of 30 cases, I reframed the work at population scale. Public home-service permits became observable project events, and the client’s customer history became a validation overlay rather than the entire truth set.

The first DeKalb pull proved that the data could be joined, but it centered on homes well below the client’s target market. So I moved the same method to Buckhead and in-town Atlanta, where the permit and parcel systems are both open.

The working data store now holds **8,701 permit records from seven public-source pipelines, 143,031 parcel records, and 97,446 valuation rows**. The expanded pull also identified **388 named households tied to outdoor-project permits** in Atlanta and Sandy Springs. That creates a useful, refreshable opportunity feed today. It does not yet prove which household will buy landscaping tomorrow.

<figure class="story-image">
  <img src="/groundline/img/mock-targeting-map.png" alt="A Groundline targeting map showing candidate properties and nearby completed work" />
  <figcaption>The operating question is not “can I make a score?” It is “which property change is useful enough for someone to act on?” This campaign map is an illustrative artifact, not model output.</figcaption>
</figure>

## From Propensity Score to Property Transition Atlas

The broader product idea is now a **Property Transition Atlas**:

- What tends to happen after a pool, addition, sale, or other property event?
- How long later does adjacent work appear?
- Which contractors repeatedly show up together?
- Which parts of a territory are changing now?
- What evidence is strong enough to act on, and what is merely interesting?

That framing is more useful than raw permit alerts and more honest than an unvalidated “likely to buy” score.

## What the Work Changed

- The first campaign should emphasize completed-job neighborhoods and partner relationships, not a complicated model
- Public data can already create valuable lists and territory intelligence without predictive claims
- Geography matters as much as method: a technically clean dataset in the wrong housing market is still the wrong answer
- Identity resolution does not need to be perfect everywhere; it needs to be explicit enough that people know what they can trust
- Prediction comes later, after prospective campaigns produce real outcomes

## Still Unfinished

- Prospective validation against delivered campaigns, estimates, wins, and revenue
- A true population-scale control analysis for the expanded Atlanta footprint
- Deeper Dunwoody outcome coverage
- Clear evidence that a ranked feed outperforms simpler ring-mail and referral plays
- Privacy, suppression, and usage rules suitable for a repeatable commercial product
