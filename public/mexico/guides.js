/* Condesa Days \u2014 guides
   Longer-form reads, separate from the place directory in data.js.

   Section shapes the renderer understands:
     { h: "Heading" }                     a subheading
     { p: ["para", "para"] }               paragraphs
     { list: ["item", "item"] }            a bulleted list
     { steps: ["do this", "then this"] }   a numbered list
     { table: { head: [...], rows: [[...]] } }
     { note: "callout text" }              a highlighted aside
     { quote: "text", by: "attribution" }
   Any section may combine keys; they render in the order above. */

window.CDMX_GUIDES = [

  {
    id: "lucha-libre",
    title: "Lucha Libre",
    kicker: "Masks, three falls, and a crowd with opinions",
    icon: "🎭",
    tint: "rgba(217,69,95,.12)",
    accent: "#C2410C",
    status: "ready",
    updated: "29 July 2026",
    summary: "How the shows work, which night is the family night, what the crowd shouts, and whether it survives contact with small children.",
    sections: [
      { note: "Sunday 2 August, 5:00 PM, Arena M\u00e9xico \u2014 Domingo Familiar. Confirmed on Ticketmaster. This is the family matinee and the only realistic slot with a toddler in tow. The specific card is usually posted only a few days ahead, so the line-up will appear late." },

      { h: "What is actually on this week",
        table: { head: ["When", "Where", "What", "Time"], rows: [
          ["Thu 30 Jul", "Arena M\u00e9xico", "Mitos en el Ring \u2014 a one-off special", "8:00 PM"],
          ["Fri 31 Jul", "Arena M\u00e9xico", "Leyenda de Plata final \u2014 two title matches", "8:30 PM"],
          ["Sat 1 Aug", "Arena Coliseo", "S\u00e1bados de Lucha Libre", "7:30 PM"],
          ["Sun 2 Aug", "Arena M\u00e9xico", "Domingo Familiar \u2014 the family show", "5:00 PM"],
          ["Mon 3 Aug", "\u2014", "No show. Monday is CMLL\u2019s dark night", "\u2014"]
        ]},
        p: ["Friday is the bigger card by a distance \u2014 a tournament final with two championships on the line. It also starts at 8:30 and runs past three hours, which puts it out of reach on this trip.",
            "AEW\u2019s Grand Slam M\u00e9xico is at the same arena on 5 August, after departure. It does not displace any of the earlier cards."] },

      { h: "Why Sunday is genuinely the family night",
        p: ["This is not marketing. CMLL builds the Sunday matinee around families: it starts early enough to be over before a normal bedtime, the tone is lighter and more comic, there are more mini-estrellas bouts, and there is a standing children\u2019s price.",
            "A child under ten, or under 1.30 m, pays $50 MXN from the tenth row back when accompanied by a paying adult. Note this is a discount, not free entry \u2014 the \u201cunder 1.20 m goes free\u201d line repeated on travel sites does not match CMLL\u2019s own posted terms."] },

      { h: "Where to sit",
        p: ["Take mid-tier grada seating, not ringside. Ringside is the most expensive section and buys proximity rather than comfort: it is the loudest part of the building, it is where the crude chanting is most concentrated, and wrestlers are thrown out of the ring into the front rows with some regularity. A raised, wider view of the whole ring is the better experience for a small child anyway."],
        table: { head: ["Section", "Rough price"], rows: [
          ["Cheapest general seats", "from ~$50 MXN"],
          ["Mid-tier grada, side view", "~$250\u2013450 MXN"],
          ["Ringside", "~$450\u2013700 MXN, far more on marquee cards"]
        ]} },

      { h: "Getting tickets",
        p: ["Ticketmaster Mexico is the official channel. For the Sunday family show the box office is a perfectly reasonable bet even for a group of seven \u2014 CMLL holds back a real chunk of inventory for walk-ups. Arrive 45 to 60 minutes early.",
            "The Friday tournament final is the exception. That one is close to a hot ticket and should be bought in advance if it is ever the choice."] },

      { h: "The format, so it makes sense",
        p: ["Almost every match is dos de tres ca\u00eddas \u2014 best of three falls. A fall ends by pin, submission, or being thrown over the top rope. This is why a match can be over in ninety seconds when the villains cheat to steal two straight falls, or unfold across a full three-act arc.",
            "The moral axis is t\u00e9cnicos against rudos. T\u00e9cnicos are the acrobatic rule-followers; rudos brawl, cheat, gang up and work the crowd\u2019s hatred. Taking a side loudly is the audience\u2019s job.",
            "The mask is the thing to understand. A masked luchador\u2019s m\u00e1scara is treated as his identity, and in a lucha de apuestas \u2014 a bet match \u2014 losing it means unmasking in the ring and giving up his real name. It is the most serious loss in the sport. Wrestlers who already wrestle unmasked bet their hair instead, and lose it to a razor on the spot.",
            "Mini-estrellas are a division of smaller-stature wrestlers performing the same acrobatic style. They are seriously skilled rather than a novelty, and they are usually the highlight for children."] },

      { h: "Names worth knowing",
        list: ["M\u00edstico \u2014 currently CMLL\u2019s biggest draw and reigning World Light Heavyweight Champion. Masked, spectacular, the one to hope for on the card.",
               "Volador Jr. \u2014 two decades in, multiple titles, a dependable main-event t\u00e9cnico.",
               "Templario \u2014 a dominant rudo and current World Middleweight Champion.",
               "Atlantis Jr. \u2014 carries one of the most storied masked names in the sport.",
               "On Friday specifically: M\u00e1scara Dorada, Komander, Hechicero, Roderick Strong, Persephone, Tessa Blanchard."] },

      { h: "The honest caveat about the crowd",
        p: ["Arena M\u00e9xico crowds chant crude, sexually explicit and often homophobic insults at the villains and the referee. This is long-running arena culture rather than an occasional lapse. It is milder at the Sunday family show than on a Friday night, but it is not absent.",
            "Worth deciding in advance how to handle the inevitable question about what a particular chant means. Beer and micheladas are sold freely in the stands throughout."] },

      { h: "Practicalities",
        list: ["Doctores is a working-class inner-city neighbourhood that is fine on a fight night with heavy crowds and police, but not somewhere to wander after dark. Arrive by car, leave by car.",
               "After a big card, hundreds of people spill out at once and drivers struggle to find the pickup point. Walk with the crowd toward Av. Cuauht\u00e9moc and order the car from there.",
               "Bring proper ear muffs for the youngest, not foam plugs. This is a loud building with a live band.",
               "A stroller is awkward on steep narrow bleacher stairs \u2014 use a carrier.",
               "Leaving early is normal. The card is a sequence of standalone matches, not one narrative, so walking out after any bout is unremarkable. There is no re-entry.",
               "Masks from street vendors outside run $250\u2013450 MXN and haggling is expected. The official shop inside is closer to $500 MXN."] },

      { h: "If the timing does not work",
        p: ["Masks are easy to buy without attending anything \u2014 souvenir shops around Centro, La Ciudadela and Mercado de Sonora all carry them.",
            "Guided packages exist that bundle transfer, a bilingual guide and a mask, but they take you to the same CMLL show; you are buying the logistics, not a different spectacle. Note that Lucha VaVoom is a travelling Los Angeles production, not a standing Mexico City show."] }
    ],
    links: [
      { label: "CMLL tickets on Ticketmaster Mexico", url: "https://www.ticketmaster.com.mx/lucha-libre-cmll-tickets/artist/1156538?language=en-mx" },
      { label: "CMLL cartelera \u2014 the official card listing", url: "https://cmll.com/cartelera/" }
    ]
  },

  {
    id: "pyramids",
    title: "Pyramids & Short Excursions",
    kicker: "Getting out of the city without losing the day",
    icon: "⛰",
    tint: "rgba(122,78,158,.13)",
    accent: "#6B3F92",
    status: "ready",
    updated: "29 July 2026",
    summary: "Teotihuacán honestly assessed, the pyramids you can reach without leaving town, and everything else sorted by whether it fits a morning, an afternoon, or a whole day.",
    sections: [
      { note: "The 1-year-old\u2019s nap falls around 11 AM, and that single fact sorts every option below. Cuicuilco combined with Bosque de Tlalpan is the closest thing to a nap-friendly pyramid this city has. Teotihuac\u00e1n is not a morning or afternoon trip \u2014 it is a 6\u20137.5 hour day that sacrifices the nap outright, and a stranded return Uber from the site is a documented real risk, not a hypothetical one." },

      { h: "The three time-shapes",
        p: ["Everything here is sorted into one of four shapes: fits before the 11 AM nap, fits a 2:30\u20136 PM afternoon, needs a whole day with the nap deliberately sacrificed, or simply does not fit this trip and should wait for another visit."],
        table: { head: ["Fits", "Option", "Why"], rows: [
          ["MORNING", "Cuicuilco + Bosque de Tlalpan", "Free pyramid, playground, market \u2014 both southern, both close, combine into one loop"],
          ["MORNING", "Templo Mayor (Centro)", "25\u201330 minutes each way, compact site, air-conditioned museum doubles as rain cover"],
          ["AFTERNOON", "Coyoac\u00e1n / Frida Kahlo Museum", "30\u201345 minutes each way, timed-entry museum, plaza and market food after"],
          ["AFTERNOON", "Xochimilco canals, kept short", "45\u201360 minutes each way; a tight 1\u20131.5 hour boat block fits a 2:30\u20136 PM window"],
          ["AFTERNOON", "San \u00c1ngel Bazar S\u00e1bado", "Saturdays only, runs to 7 PM, so a 2:30 arrival still gets four hours"],
          ["FULL-DAY EXCEPTION", "Teotihuac\u00e1n", "6\u20137.5+ hours door to door; see the verdict below before booking anything"],
          ["FULL-DAY EXCEPTION", "Tepoztl\u00e1n (town, not the pyramid hike)", "Bus alone is 2\u20132.5 hours round trip; go on Sunday 2 August for the market"],
          ["FULL-DAY EXCEPTION, marginal", "Desierto de los Leones, Tepotzotl\u00e1n, La Marquesa", "All doable in a day; all modest payoff for a 1-year-old"],
          ["DOESN\u2019T FIT", "Xochicalco, Cholula/Puebla, Grutas de Tolantongo", "2.5\u20134.5 hours each way \u2014 cut from this trip entirely"]
        ]} },

      { h: "Teotihuac\u00e1n, honestly assessed",
        p: ["The site is open daily, 8 AM\u20135 PM, last entry before close. The 2026 entry fee is genuinely unsettled between sources \u2014 budget somewhere between $95 and $210 MXN per adult and confirm at inah.gob.mx or on arrival; children under 13 are free. Buy timed tickets in advance where you can, to avoid a ticket line with three small kids in tow.",
            "Whether you can still climb the pyramids is the single most important thing to confirm before you go, and it is genuinely unresolved: one account says the Pyramid of the Sun has stayed climbable throughout and the Moon reopened for climbing in May 2025; another says climbing the Sun pyramid is flatly prohibited in 2026 for conservation reasons. Check the INAH page or ask on the morning of \u2014 if climbing turns out to be closed, the site is essentially a very large, shadeless walk, and that tips the calculus further against going at all with the youngest child.",
            "Uber direct runs roughly $500\u2013900 MXN one-way and about an hour outside rush hour, but the real risk is the return leg: Teotihuac\u00e1n is a rural site where pickup requests can sit unmatched for 20\u201340+ minutes, especially after 2 PM, because drivers don\u2019t want to make the trip back empty. The fix is to negotiate your inbound driver to wait and do the round trip, or book a tour that guarantees return transport. The bus from Terminal Norte (Autobuses Teotihuac\u00e1n, Sala 8, ~$52 MXN, every 15 minutes) is a safety net, but the last easy direct return bus leaves early afternoon \u2014 after 2 PM your options thin out fast.",
            "On site there is no shade along the Avenue of the Dead beyond one bench area behind the Pyramid of the Moon, and the avenue itself is unpaved for long stretches with stair-like level changes \u2014 multiple family accounts describe carrying the stroller rather than pushing it. A structured carrier, not a stroller, is the realistic way to move a 1-year-old around. La Gruta, a restaurant built into a volcanic cave near Gate 5, solves the \u201cno food inside the site\u201d problem and is worth building the day around; reserve ahead on weekends."],
        note: "Verdict: marginal-to-no with a 1-year-old. Unresolved climbing access, no shade, a stroller-hostile avenue, a real risk of a stranded return trip, and a minimum 6\u20137.5 hour commitment stack up against this one. If the group wants it anyway: book a tour with guaranteed return transport, arrive at opening, use a carrier not a stroller, and treat La Gruta as the reward at the end." },

      { h: "Cuicuilco \u2014 the honest alternative",
        p: ["Free, both the site and its museum, Tuesday\u2013Sunday 9 AM\u20135 PM, closed Mondays. Reports on whether you can climb the circular mound conflict \u2014 confirm on arrival \u2014 but this is a small, low, round earthen pyramid, nothing like Teotihuac\u00e1n\u2019s scale, so the climb is a short, gentle grade regardless. The site museum (pottery, tools, ornaments excavated on site) is small and manageable for short attention spans; 1.5\u20133 hours covers the mound, museum, and ecology walking path.",
            "Given the short visit and free admission, this pairs naturally with Bosque de Tlalpan into one southern morning: arrive at Cuicuilco for the 9 AM opening, an hour to ninety minutes at the mound and museum, then on to Bosque de Tlalpan\u2019s playground and Sunday organic market before the 11 AM nap deadline. Tight, but plausible if you\u2019re not fighting traffic."] },

      { h: "Templo Mayor and Tlatelolco \u2014 a pyramid without leaving town",
        p: ["Templo Mayor, beside the Cathedral in Centro, is the best pyramid experience in this guide for a stroller-and-toddler family: compact, walkable in under an hour, centrally located, and its museum (Museo del Templo Mayor, home to the Coyolxauhqui stone) is air-conditioned with real bathrooms \u2014 a built-in rain and heat contingency. Tuesday\u2013Sunday, 9 AM\u20135 PM, closed Mondays; ticket price is another source conflict ($100 vs $210 MXN), confirm at inah.gob.mx. Plan a focused 45\u201390 minutes rather than a leisurely museum crawl \u2014 the dense artifact displays hold a 4- and 5-year-old\u2019s attention only briefly. About 20\u201330 minutes and $120\u2013200 MXN by Uber from Condesa, more in Centro traffic.",
            "Tlatelolco / Plaza de las Tres Culturas, a short distance north, is free to enter (museum ~$20 MXN) and puts Aztec ruins, a colonial church, and 1960s apartment blocks side by side \u2014 historically important (the 1968 massacre site) but that context is lost on this age group. It\u2019s a less curated experience than Templo Mayor, with no equivalent indoor museum draw. Treat it as an add-on if you\u2019re already in the area, not a standalone destination with three small kids."] },

      { h: "Afternoon options beyond the ruins",
        p: ["Coyoac\u00e1n\u2019s Frida Kahlo Museum (Casa Azul) uses timed-entry tickets that sell out and must be booked online, not bought at the door. The courtyard gardens are genuinely toddler-friendly open space; the museum interior itself, with dense displays and often no strollers allowed, is less suited to a 1-year-old, so plan for one adult to trade off garden time against museum time. Coyoac\u00e1n\u2019s plazas add churros, ice cream, and room to run. Budget 30\u201345 minutes each way.",
            "Xochimilco is one of the easier activities in this whole guide for a 1-year-old, because nobody has to walk anywhere once aboard: a trajinera runs about $500\u2013600 MXN per boat per hour, not per person, with room for up to 15 \u2014 cheap per head for a group of seven. Board at Nuevo Nativitas, the busiest embarcadero with posted standardized prices. Most guides recommend 3\u20134 hours to do it properly, but going straight there, boarding, and coming back in 1\u20131.5 hours is what makes this fit a 2:30\u20136 PM window instead of eating a whole day. Toilets are limited once on the water \u2014 handle that before boarding.",
            "San \u00c1ngel\u2019s Bazar S\u00e1bado runs Saturdays only, 10 AM\u20137 PM \u2014 it doesn\u2019t exist on any other day, so check which Saturday falls in the trip window. Craft stalls and cobblestone plazas are pleasant, but sidewalks get crowded with vendors and strollers by early-mid afternoon. Since it runs to 7 PM, arriving at 2:30\u20133 PM still leaves a comfortable window."] },

      { h: "If you sacrifice the nap: full-day options, ranked",
        list: ["Tepoztl\u00e1n (town only) \u2014 the Tepozteco pyramid hike is a genuinely demanding 2-hour-each-way climb up loose stone steps and should be off the table entirely for this trip; visit as a town instead. Go specifically on Sunday 2 August for the tianguis (ceramics, textiles, novelty ice cream flavors \u2014 avocado, corn, tequila, mole), and see the ex-convento (free, closed Mondays).",
               "Desierto de los Leones \u2014 a cool, genuinely atmospheric cloud-forest monastery with underground passages, about 40 minutes by Uber. But its real appeal (long forest trails) is aimed at hikers, not toddlers, and it needs 3\u20134 hours on site to be worth the trip \u2014 a soft full-day option with a modest payoff specifically for a 1-year-old.",
               "Tepotzotl\u00e1n / Museo Nacional del Virreinato \u2014 a former Jesuit monastery turned colonial-art museum; the baroque chapel is visually striking, but the core content (colonial religious paintings and furniture) has essentially no engagement value for a 1-, 4-, or 5-year-old. Only worth it if an adult specifically wants the art and is willing to treat the kids\u2019 experience as secondary.",
               "La Marquesa \u2014 a large activity park (horse rides, quad bikes, zip lines) that functions more like a loosely regulated bazaar than a curated attraction; expect haggling over per-ride prices at informal stands. Short pony rides are plausible for the 4- and 5-year-olds; the 1-year-old has nothing to do here beyond being carried around."],
        note: "Pick one full-day sacrifice, not two. Doing Teotihuac\u00e1n and a second full-day exception like Tepoztl\u00e1n in the same trip is a lot to ask of three small children." },

      { h: "What to cut, and why",
        p: ["Xochicalco is roughly 76 miles from CDMX; without a car it\u2019s 2\u00bd\u20132\u00be hours each way via Cuernavaca with at least one transfer plus a taxi leg \u2014 call it 5.5\u20136 hours of round-trip transit alone. Cut it; if there\u2019s real interest, it belongs on a future trip based out of Cuernavaca, not a CDMX day trip with this group.",
            "Cholula and Puebla are a comparable distance, roughly 2 hours each way by direct bus from TAPO, and multiple sources independently describe the combined Puebla-plus-Cholula day as 10\u201312 hours even for able-bodied adults without kids. Cholula\u2019s Great Pyramid is genuinely striking \u2014 the largest pyramid by volume in the world, grown over as a hill with a church on top \u2014 but four hours of round-trip travel plus a full day to make it worthwhile doesn\u2019t clear the bar this trip. Cut it; save it for a future trip with an overnight in Puebla.",
            "Grutas de Tolantongo is 3.5\u20134.5 hours each way, with the final approach a mountain road with tight curves and no shoulders. This is a well-known Mexican weekend or overnight destination, not a day trip \u2014 confirmed and dismissed."] },

      { h: "Sunday 2 August \u2014 Mu\u00e9vete en Bici",
        p: ["Mexico City closes major avenues to car traffic 8 AM\u20132 PM every Sunday for its open-streets cycling program \u2014 confirmed to include Paseo de la Reforma, Patriotismo, Calzada de Guadalupe, and notably Hip\u00f3dromo Condesa and Roma Norte themselves, meaning your own base neighborhood sits inside the closure footprint on Sunday mornings. Confirm the exact 2026 closure map closer to the date if a Sunday-morning car departure is planned.",
            "Sunday 2 August is also the day Tepoztl\u00e1n\u2019s best market runs, which is the one thing most worth doing on that specific Sunday. Any Uber pickup from inside Condesa/Roma between 8 AM and 2 PM should expect detours. There\u2019s no clash for afternoon departures after 2 PM or for travel by Metro/Metrobus, which the closures don\u2019t affect. And there\u2019s a genuine upside: walking or pushing a stroller along the closed streets in Condesa/Roma itself before 11 AM is a real, zero-cost, zero-transit-risk morning activity that needs no Uber and no bus at all."] },

      { h: "Shade, toilets, and the stroller question",
        table: { head: ["Place", "Stroller verdict"], rows: [
          ["Teotihuac\u00e1n", "Poor \u2014 unpaved Avenue of the Dead; carry or use a carrier, not a stroller"],
          ["Cuicuilco", "Likely manageable \u2014 a compact urban archaeological park, not a kilometer-long avenue"],
          ["Templo Mayor", "Workable \u2014 paved Centro streets around it, some uneven original stonework on the excavation itself"],
          ["Coyoac\u00e1n / San \u00c1ngel", "Fine in the plazas and streets; check each museum\u2019s own stroller policy"],
          ["Xochimilco", "Not relevant \u2014 no walking once aboard the boat"],
          ["Desierto de los Leones / Tepotzotl\u00e1n", "Fine in courtyards, poor beyond them \u2014 unpaved forest trails or period colonial flooring"]
        ]} }
    ],
    links: [
      { label: "Teotihuac\u00e1n complete planning guide", url: "https://www.machupicchu.org/teotihuacan-complete-guide-2026-ultimate-planning-resource.htm" },
      { label: "La Gruta cave restaurant (official)", url: "https://www.lagruta.mx/index_en.php" },
      { label: "Cuicuilco archaeological site and museum", url: "https://mexicocity.cdmx.gob.mx/venues/cuicuilco-archaeological-site-museum/?lang=en" },
      { label: "Bosque de Tlalpan (official)", url: "https://bosquedetlalpan.com/" },
      { label: "Templo Mayor (official)", url: "https://templomayor.inah.gob.mx/english" },
      { label: "Mu\u00e9vete en Bici explained", url: "https://mexiconewsdaily.com/lifestyle/ride-your-way-across-mexico-citys-reforma-avenue-every-sunday-bike-tour-mexico-city/" }
    ]
  },

  {
    id: "sounds",
    title: "The Sounds of the City",
    kicker: "The whistle, the singsong, and the barrel organ",
    icon: "🔔",
    tint: "rgba(217,144,47,.14)",
    accent: "#B4761F",
    status: "ready",
    updated: "29 July 2026",
    summary: "Mexico City announces itself. The steam whistle on the sweet-potato cart, the recorded voice buying mattresses, the hand-cranked organs — what each one is, and a listening list to tick off.",
    sections: [
      { note: "None of this is staged for tourists \u2014 it\u2019s the actual working soundtrack of a residential CDMX street. Two sounds are near-certain over a week in Condesa: the camote cart\u2019s genuine steam whistle in the evening, and the recorded child\u2019s voice selling scrap in daytime. Neither needs seeking out; both will come to you." },

      { h: "The camote cart \u2014 a real steam whistle, not a recording",
        p: ["The camotero pushes a hand-built sheet-metal cart with a small wood- or charcoal-fired oven inside, roasting sweet potatoes and plantains. The whistle is a genuine pressure-release steam mechanism: a small water reservoir connects by a pipe that runs through the firebox, the coals heat the pipe, the water inside turns to steam, and the steam is forced out through a narrow whistle fitted at the pipe\u2019s end \u2014 mechanically the same idea as a kettle or a steam locomotive\u2019s whistle. The camotero controls it by opening a valve to let water into the heated pipe on demand, so the shriek is deliberate, not constant.",
            "What it sounds like: a long, rising, mournful, train-like shriek \u2014 genuinely startling up close, not a toy sound. Carts typically appear from dusk into the night, roughly 6 PM onward, and they still work the residential streets of Roma-Condesa most evenings \u2014 high odds of hearing one, possibly more than once, over a week\u2019s stay."] },

      { h: "\u201cSe compran colchones\u201d \u2014 the recorded call buying scrap",
        p: ["A looped recording plays from a loudspeaker on a slow-moving pickup truck as it works a street buying old household items for resale. The canonical wording announces that the truck buys mattresses, refrigerators, stoves, washing machines, and microwaves (\u201ccolchones, refrigeradores, estufas, lavadoras, microondas\u2026\u201d), spoken in a distinctive high, sped-up child\u2019s voice.",
            "The origin story is documented and genuinely charming: the voice is Mar\u00eda del Mar Terr\u00f3n, recorded as a child at the request of her father, Marco Antonio Terr\u00f3n, an itinerant scrap-and-used-appliance buyer (a fierroviejero). Sources place the original cassette recording at the very end of 2004 or in 2005 \u2014 accounts differ on the exact date, treat it as approximate. It spread because it was cheap to duplicate onto cassette and later MP3, and is now used by the large majority of scrap-buying trucks across the city and beyond; Mar\u00eda is popularly nicknamed \u201cla ni\u00f1a de fierro viejo\u201d (the iron girl), and the recording has since been remixed and repurposed, including as an activist chant.",
            "What it sounds like: a tinny, echoing loudspeaker loop, the child\u2019s voice pitched slightly high, repeating on a roughly 15\u201320 second cycle, audible from blocks away as the truck idles down a street. Daytime, weekdays especially, but routes are irregular \u2014 this is one of the most reliably heard sounds anywhere in the city, including quiet residential Condesa streets."] },

      { h: "Organilleros \u2014 the barrel organ players",
        p: ["The instrument is German: the first organillos arrived in Mexico around 1880, during the Porfirio D\u00edaz era, imported and rented out by Wagner y Levien, a musical-instrument house founded by German immigrants. Organilleros don\u2019t usually own their organ \u2014 they rent it from a family business, one reason the tradition has persisted institutionally. They wear a distinctive beige uniform with a captain-style cap, often work in pairs (one cranks, one holds out a cap for coins), and a tip in the 10\u201320 peso range is typical, though there\u2019s no fixed price.",
            "Historically concentrated in the Centro Hist\u00f3rico, organilleros have expanded their pitches into Roma and Condesa since the pandemic, so there\u2019s a real chance of catching one on a Condesa corner rather than only downtown. The trade is genuinely at risk \u2014 police friction with residents annoyed by the noise, a reported manufacturing crisis (no one left in Mexico who still builds or properly repairs the organs), and cheap mass-produced imitations undercutting it. On the positive side, the tradition was formally recognized as intangible cultural heritage of Mexico City, marked by the fourth annual Festival de Organilleros in the Centro Hist\u00f3rico, 22\u201324 May 2026.",
            "What it sounds like: a wheezy, slightly out-of-tune mechanical waltz or pasodoble, cranked by hand at an uneven tempo \u2014 instantly recognizable as old fairground music, warmer than a music box. Moderate-to-good odds near Parque M\u00e9xico, Avenida Amsterdam, or busy Roma corners \u2014 not guaranteed daily, but plausible several times over a week."] },

      { h: "The knife sharpener, the gas truck, the tamales tricycle",
        list: ["Afilador (knife sharpener) \u2014 rides a bicycle rigged so the spinning wheel turns a whetstone, sharpening knives and scissors on the spot. He announces himself with a caramillo, a small handheld pan-flute whistle, played continuously while riding: a shrill, breathy, repeating two- or three-note pattern, thin and reedy. Once heard multiple times a day, these calls are now down to maybe once a week in many areas \u2014 moderate odds of catching one over the trip.",
               "Gas truck \u2014 LP delivery trucks circulating residential streets refilling household tanks, traditionally announced by a live, drawn-out shout of \u201c\u00a1el gaaas!\u201d, sometimes with the truck\u2019s own horn, and increasingly a recorded jingle (there are well-documented viral cases of vendors singing modified Christmas carols to sell gas). No fixed public schedule \u2014 routes vary by company and colonia, generally daytime, weekdays most common \u2014 but high odds of hearing one, near-daily in CDMX residential streets.",
               "Tamales oaxaque\u00f1os tricycle \u2014 the iconic recording is the voice of El\u00edas Zavaleta, recorded in the 1980s, now a near-universal soundtrack of the city. The canonical phrasing invites you to \u201cpida sus ricos y deliciosos tamales oaxaque\u00f1os\u201d over and over; wording varies slightly by vendor, since some cuts of the same base recording differ. Sold from a pedal tricycle fitted with a large steamer drum, heard evening into early morning \u2014 high odds, near-certain over a week\u2019s stay."] },

      { h: "The rubbish collection bell",
        p: ["A hand bell rung on a wooden handle by a collector walking ahead of or alongside the slow-moving garbage truck \u2014 like an old-time town crier, summoning residents to bring trash out as the truck approaches. Roma-Condesa and the Hip\u00f3dromo area specifically run nocturnal collection routes (a 2015 news report put it at five dedicated trucks for the zone \u2014 dated context, though the nocturnal pattern is still broadly described as current), so the bell here is more an evening or night sound than a daytime one.",
            "CDMX rolled out a mandatory 3-stream sorting system on 1 January 2026: organic waste Tuesdays/Thursdays/Saturdays, recyclables Mondays/Wednesdays/Sundays, non-recyclables Mondays/Wednesdays/Fridays/Sundays. That means the bell-and-truck pattern repeats several nights a week rather than just once \u2014 a genuinely useful, high-odds cue for kids to listen for at bedtime: a clear, hand-rung clang, irregular and human-paced, followed by the truck\u2019s diesel idle and the clatter of bags being loaded."] },

      { h: "Church bells, mariachi, and danz\u00f3n",
        p: ["Two parishes sit close to Condesa: Parroquia Santa Rosa de Lima (Tamaulipas 177) and Parroquia Coronaci\u00f3n de Santa Mar\u00eda de Guadalupe, right on Parque Espa\u00f1a. Bells typically mark Mass times \u2014 roughly 7\u20138 AM, midday, and 7\u20138 PM, fuller on Sundays \u2014 though the exact bell-ringing schedule (as opposed to Mass times) isn\u2019t confirmed from a single source; check horariodemisa.com.mx or dondehaymisa.com nearer the date if it matters.",
            "Plaza Garibaldi is genuinely worth a family visit if timed right: mid-afternoon is calmer and safer than the after-dark scene it\u2019s famous for, and plenty of mariachi bands are actually playing from mid-afternoon onward, not only at night. The adjoining Mercado de San Camilito adds food and atmosphere; standard urban precautions apply \u2014 mind the crowd and pickpockets, use a taxi rather than walking in after dark. A kid-friendlier alternative: mariachi bands performing from boats in Xochimilco, especially on a Sunday when the canals fill with local families rather than tourists.",
            "Danz\u00f3n \u2014 free open-air dancing still runs in 2026: the Alameda Central kiosco, Saturdays roughly 3\u20135 PM; Plaza de la Ciudadela, Saturdays and Sundays from around noon; Coyoac\u00e1n\u2019s Alameda del Sur, Sunday afternoons around 5 PM, all free entry. One correction worth keeping in mind: there\u2019s no evidence Parque de los Venados hosts regular danz\u00f3n \u2014 the name only turned up a Metro station \u2014 so treat the three venues above as the better-verified bets."] },

      { h: "The earthquake alert (alerta s\u00edsmica) \u2014 explained calmly",
        p: ["Mexico City runs a public early-warning system, SASMEX, linked to roughly 14,000 loudspeakers across the city and State of Mexico, giving a short warning window \u2014 seconds to tens of seconds \u2014 before strong shaking arrives. The sound is a distinctive alternating siren/klaxon tone, deliberately designed in 1993 to be unmistakable from any other alarm in the city, and it runs for about a minute in Mexico City.",
            "A routine monthly loudspeaker test happens the first Monday of every month at noon. In August 2026 that falls on Monday 3 August \u2014 but the family\u2019s flight departs that same morning, so you\u2019ll already be en route to the airport before the test happens; nothing to prep the kids for on this trip specifically. Real alerts can sound at any time, day or night, without warning, separate from the monthly test; the well-known annual commemorative drill (19 September, marking both the 1985 and 2017 earthquakes) falls well after this trip."],
        steps: ["Stop and listen \u2014 it\u2019s unmistakable once you\u2019ve heard it: a repeating alternating tone from neighborhood speakers, and possibly phones.",
                "Move away from windows and anything that could fall; get under a sturdy table or into a doorway/interior wall, or head to open space if there\u2019s a clear path and time.",
                "Ask the host or building staff about the designated outdoor meeting point on arrival \u2014 a two-minute practical step, not something to worry the kids with.",
                "After shaking stops, expect aftershocks and follow building staff instructions."] },

      { h: "Listening bingo \u2014 near-certain to lucky",
        list: ["\u201cSe compran colchones\u201d truck (recorded child\u2019s voice, loudspeaker) \u2014 near-certain, several times over the week",
               "Tamales oaxaque\u00f1os tricycle (\u201cRicos tamales oaxaque\u00f1os\u2026\u201d) \u2014 near-certain, evening or early morning",
               "Garbage bell at night (Roma-Condesa nocturnal routes) \u2014 very likely, several nights",
               "Camote cart steam whistle \u2014 very likely, evening",
               "Church bells (Santa Rosa de Lima or the Parque Espa\u00f1a parish) \u2014 likely, especially Sunday morning",
               "Gas truck cry or jingle (\u201c\u00a1el gaaas!\u201d) \u2014 likely, daytime",
               "Elote/esquites cart bell or whistle \u2014 likely, late afternoon/evening, near the park",
               "Dogs, birdsong, and the general Parque M\u00e9xico \u201cbuzz\u201d \u2014 not a vendor sound, but a near-certain ambient signature of this neighborhood on any weekend daytime visit",
               "Organillero barrel organ \u2014 possible, check corners of Roma/Condesa and Parque M\u00e9xico",
               "Knife sharpener\u2019s pan-flute whistle (afilador) \u2014 possible, less frequent now",
               "Danz\u00f3n brass band \u2014 a deliberate \u201cfield trip\u201d item, if you make a special trip to the Alameda Central kiosco or Ciudadela on the right afternoon",
               "The alerta s\u00edsmica \u2014 hopefully a \u201cdid not hear it\u201d box to check, or at most the routine monthly test, which this trip you\u2019ll miss by leaving that morning"] },

      { h: "Where to just sit and listen",
        list: ["Parque M\u00e9xico (inside Hip\u00f3dromo Condesa) \u2014 benches around the pond/fountain or near Foro Lindbergh catch dogs, families, vendors, and often an organillero or two; best on a weekend morning or late afternoon.",
               "Parque Espa\u00f1a \u2014 quieter than Parque M\u00e9xico, right next to the Guadalupe parish, good for catching church bells plus ambient park sound.",
               "Avenida Amsterdam (the old horse-racetrack oval) \u2014 a slow walking loop where vendor carts and organilleros tend to pass repeatedly; good for a spotting game since sounds recur as you circle.",
               "A caf\u00e9 terrace or apartment window facing a residential Condesa street in the early evening, 6\u20138 PM \u2014 prime time to stack multiple sounds in one sitting: camote whistle, garbage bell, tamales tricycle, gas truck, possibly all within an hour."] }
    ],
    links: [
      { label: "Se compran colchones \u2014 Wikipedia", url: "https://en.wikipedia.org/wiki/Se_compran_colchones" },
      { label: "The voice behind \u201cfierro viejo\u201d \u2014 Luz Media", url: "https://luzmedia.co/the-voice-behind-fierro-viejo/" },
      { label: "Mexico City\u2019s organ grinders \u2014 Christian Science Monitor", url: "https://www.csmonitor.com/Arts-Culture/2024/0607/organ-grinders-mexico-city" },
      { label: "Jirones Sonoros \u2014 street-sound archive", url: "https://jironessonoros.mrj.mx/audio/tamales-oaxaquenos/" },
      { label: "Mexican Seismic Alert System \u2014 Wikipedia", url: "https://en.wikipedia.org/wiki/Mexican_Seismic_Alert_System" },
      { label: "Danz\u00f3n, salsa, cumbia y m\u00e1s \u2014 Chilango", url: "https://www.chilango.com/que-hacer/baile-gratis-en-cdmx-lugares/" }
    ]
  },

  {
    id: "street-food",
    title: "Street Food",
    kicker: "What to eat, how to ask for it, when it exists",
    icon: "🌮",
    tint: "rgba(47,107,79,.12)",
    accent: "#2F6B4F",
    status: "ready",
    updated: "29 July 2026",
    summary: "The canon dish by dish, the phrases that get you the right thing, the safety rules that actually matter, and a timetable — because half of this food simply does not exist at the wrong hour.",
    sections: [
      { note: "Half of this food simply does not exist outside its hour: tacos de canasta and tamales/the guajolota are a morning-only ritual, gone by mid-morning; barbacoa is Friday\u2013Sunday morning only and sells out by early afternoon; al pastor barely exists before evening, when the trompos fire up. The single most useful phrase for eating with kids is \u201csalsa aparte, por favor\u201d \u2014 salsa on the side." },

      { h: "Tacos, dish by dish",
        list: ["Al pastor \u2014 thin-sliced marinated pork shaved off a vertical spit (el trompo) with a chunk of pineapple on top, a technique inherited from Lebanese-immigrant shawarma. ~18\u201325 MXN a taco at a serious stand, 30\u201335 MXN in touristy Condesa/Roma. Overwhelmingly an evening/night dish \u2014 many of the best spots don\u2019t open until dusk. The meat itself isn\u2019t spicy; salsa is separate, so order it withheld for kids.",
               "Suadero \u2014 beef brisket/flank braised then griddle-crisped and chopped, softer and fattier than pastor, a defining CDMX taco rarely found outside the city. 18\u201330 MXN. Available all day, strongest lunch through late night. Soft texture, easy for kids to chew.",
               "Campechano \u2014 usually suadero plus chorizo griddled together, the combo-plate of taco culture. ~30 MXN, same carts and hours as suadero. Fine for an adventurous 4- or 5-year-old; the chorizo brings grease more than real heat.",
               "Carnitas \u2014 whole cuts of pork confit-braised for hours in lard, then chopped; richer and less charred than pastor. ~25\u201335 MXN, often sold by weight at market stalls, strong at weekend lunch. Very good for kids if you ask for maciza (lean) rather than a mixed cut that includes skin and cartilage.",
               "Barbacoa \u2014 lamb (sometimes goat) steamed in maguey leaves in an underground pit overnight, shredded, served with its own consomm\u00e9. The one dish here that\u2019s genuinely weekend-only: Friday\u2013Sunday mornings, roughly 7 AM\u20132 PM, and it sells out early. El Hidalguense in Roma Sur is open specifically for this, Fri\u2013Sun 7 AM\u20136 PM. Taco ~30\u201340 MXN, consomm\u00e9 extra. Good for kids, but the broth is genuinely hot \u2014 mind small hands.",
               "Birria \u2014 originally a Jalisco stewed goat or beef dish, now everywhere as birria tacos: meat pan-fried in its own reddish, chile-laced consomm\u00e9 (\u201cquesabirria\u201d with cheese added), served with a dipping cup. ~35\u201345 MXN, increasingly available all day/night in CDMX. The consomm\u00e9 carries real, moderate heat and the dipping is messy \u2014 better for a braver 5-year-old than the 1-year-old.",
               "Tacos de canasta (\u201csudados\u201d) \u2014 pre-filled tacos (potato, beans, chicharr\u00f3n, mole) steamed and stacked in a cloth-lined basket, sold off bicycles, self-steaming soft over hours. Very cheap \u2014 4\u201310 MXN each. Strictly morning, roughly 7\u201311 AM, and vendors sell out. One of the best options here for small children: small, soft, cheap, minimal mess if the salsa is left off."] },

      { h: "Beyond tacos",
        list: ["Tlacoyos \u2014 oval blue-corn masa cakes stuffed with beans, fava beans, or cheese before cooking, then griddled and topped with nopales, salsa, crema. ~20\u201330 MXN, all day, strong at breakfast/lunch stalls. Good for kids ordered \u201csin salsa\u201d \u2014 the filling itself is mild.",
               "Huaraches \u2014 a large sandal-shaped flattened masa base topped with beans, meat, lettuce, salsa, crema \u2014 the biggest of the masa-cake family, a full meal. ~35\u201355 MXN with meat. Better eaten with a fork than as handheld finger food; kids often prefer it without the wet salsa layer.",
               "Sopes \u2014 thicker, smaller masa cakes with a pinched-up rim to hold the filling, between a tlacoyo and a huarache in size. ~20\u201330 MXN, usually sold in pairs or trios. Good for small hands.",
               "Gorditas \u2014 a thick masa pocket split open like a pita and stuffed (chicharr\u00f3n prensado, picadillo, cheese, beans) \u2014 the thickest \u201cbread\u201d of the family. ~25\u201335 MXN. Good handheld option with a mild filling like queso or frijol.",
               "Tamales and the guajolota \u2014 tamales (masa steamed in a corn husk or banana leaf) are strictly a breakfast food here, sold from carts announced by a recorded call or steam whistle at dawn. The guajolota \u2014 a tamal stuffed inside a bolillo roll, carbs on carbs \u2014 is the iconic CDMX combo. Tamal alone ~15\u201325 MXN, guajolota ~25\u201335 MXN. Strictly morning, roughly 6\u201310 AM, mostly sold out by mid-morning. Order \u201cde dulce\u201d (sweet, pink, raisin-studded) for an easy, chile-free win with kids.",
               "Elotes and esquites \u2014 corn on the cob or corn kernels in a cup, dressed with mayo, crema, cotija, chile powder, lime. ~25\u201335 MXN. Afternoon into evening, a genuine park-walking snack. Esquites in a cup with a spoon, ordered plain with cheese added on top only, is one of the best kid-friendly street options anywhere.",
               "Tortas \u2014 a sandwich on a crusty bolillo or telera roll, endless fillings. The everyday CDMX lunch, ~45\u201370 MXN. Familiar format, order plain ham/cheese or milanesa (breaded, unspiced) for kids.",
               "Tortas ahogadas \u2014 a Jalisco import, a roll fully drowned in a chile-de-\u00e1rbol tomato sauce, inherently spicy and eaten as much with a spoon as with hands. ~55\u201370 MXN. Not a beginner-kid dish \u2014 skip for toddlers, and for older kids ask for the sauce \u201caparte\u201d (on the side) so they can try the meat first."] },

      { h: "The quesadilla argument",
        p: ["In Mexico City, ordering a quesadilla does not guarantee cheese. A folded, griddled or fried tortilla filled with squash blossom, mushroom, potato, or chicharr\u00f3n is still called a quesadilla even with zero cheese \u2014 cheese is an add-on you have to ask for. This is a real, actively argued Chilango quirk: linguistically \u201cquesadilla\u201d comes from queso, and everywhere else in Mexico a quesadilla implies cheese by default, but a CDMX vendor will ask \u201c\u00bfcon queso o sin queso?\u201d as a completely normal question, and locals genuinely bicker with each other over which answer is correct."],
        note: "Always say \u201ccon queso\u201d if you want cheese included \u2014 otherwise you may get a cheese-free one by default, at ~20\u201335 MXN depending on filling, with cheese usually a small upcharge." },

      { h: "Sweets, drinks, and the adults-only stuff",
        list: ["Marquesitas \u2014 a Yucat\u00e1n-origin dessert, a thin crispy rolled crepe filled with melted Nutella, cajeta, or cheese (Edam is classic), sold from carts with a griddle-iron. ~30\u201345 MXN, afternoon into night. Great for kids, but the filling comes out genuinely hot \u2014 let it cool two to three minutes.",
               "Churros \u2014 fried dough sticks rolled in sugar. Churrer\u00eda El Moro\u2019s Condesa branch, a century-old institution, is right in Hip\u00f3dromo \u2014 buy churros and walk straight to Parque M\u00e9xico across the street. ~20\u201335 MXN each, or a combo with hot chocolate for ~70\u2013100 MXN. Very sugary and hot fresh from the fryer \u2014 not a great idea right before a nap.",
               "Camotes and pl\u00e1tanos fritos \u2014 roasted sweet potato and fried plantain from the camotero\u2019s wood-fired cart, split and topped with sweetened condensed milk and sugar. The cart announces itself with the unmistakable steam whistle heard on residential streets in the evening (see the sounds guide). ~30\u201345 MXN. Good for kids but very sweet and hot \u2014 cool it and cut small for the 1-year-old.",
               "Aguas frescas \u2014 fresh fruit or grain waters (jamaica, horchata, tamarindo, mel\u00f3n) served over ice from big glass jars. ~20\u201335 MXN a cup. Ask if the ice is purified, or order \u201csin hielo\u201d \u2014 see the safety section.",
               "Tejate \u2014 an Oaxacan pre-Hispanic drink of toasted corn, cacao, and mamey seed whisked into a foamy, chocolatey cold drink. It is genuinely hard to find as a street item in Condesa/Roma \u2014 you\u2019re more likely to catch it at an Oaxacan-focused market or festival than on a random corner, so treat it as a special find rather than something to plan around.",
               "Pulque \u2014 a mildly alcoholic (2\u20134% ABV), fermented maguey-sap drink, traditionally unpasteurized and best drunk fresh, often flavored (\u201ccurado\u201d \u2014 guava, oatmeal, celery). Adults only. Pulquer\u00eda Insurgentes sits right on the Condesa/Roma Norte border and is the most tourist-comfortable option; La Nuclear in Roma Norte is a well-regarded alternative. Because it\u2019s live-fermented, a busy established pulquer\u00eda is a safer bet than a random unmarked jug.",
               "Nieves \u2014 hand-cranked traditional ice cream or sorbet, often in unusual regional flavors (mamey, tuna/prickly pear, corn, chile). ~25\u201345 MXN a scoop. Check the flavor board before handing one to a toddler \u2014 some savory or spiced flavors sit right alongside the sweet ones."] },

      { h: "How to actually order",
        table: { head: ["Phrase", "What it gets you"], rows: [
          ["\u201cUno de pastor, por favor\u201d", "One pastor taco, please"],
          ["\u201c\u00bfMe da dos de suadero?\u201d", "Can I get two suadero?"],
          ["\u201c\u00bfCu\u00e1nto cuesta?\u201d", "How much does it cost \u2014 ask before ordering, it\u2019s normal, not rude"],
          ["\u201cSalsa aparte, por favor\u201d", "Salsa on the side \u2014 the single most useful phrase for eating with kids"],
          ["\u201c\u00bfPica?\u201d / \u201c\u00bfCu\u00e1l pica menos?\u201d", "Is it spicy? / Which one is less spicy?"],
          ["\u201cCon todo\u201d", "With everything \u2014 the default: chopped onion and cilantro, sometimes lime"],
          ["\u201cSin cilantro / sin cebolla, por favor\u201d", "Without cilantro/onion \u2014 completely normal to ask"],
          ["\u201cPara llevar\u201d / \u201cpara aqu\u00ed\u201d", "To go / for here"]
        ]},
        p: ["Cash is standard and often the only option at a genuine street stall \u2014 carry small bills and coins; 500-peso notes are frequently refused for small purchases because vendors can\u2019t make change. Tipping isn\u2019t expected at a cart the way it is at a sit-down table \u2014 rounding up to the next 5 or 10 pesos is appreciated but optional; at a sit-down restaurant, 10\u201315% is the norm."] },

      { h: "The availability grid \u2014 what exists at what hour",
        p: ["This is the single most practical table in this guide: half the canon simply isn\u2019t there outside its window."],
        table: { head: ["Time", "Available", "Mostly unavailable"], rows: [
          ["8 AM", "Tamales/guajolota, tacos de canasta, coffee/atole, barbacoa (Fri\u2013Sun, just opening), Mercado Medell\u00edn opening up", "Al pastor (trompos not fired yet), quesadillas (thin coverage), pulque (bars not open)"],
          ["1 PM", "Carnitas, tlacoyos, huaraches, sopes, gorditas, tortas, quesadillas, barbacoa (last chance before ~2 PM sellout), elotes/esquites starting", "Tamales/guajolota (mostly gone), al pastor (limited daytime stands only)"],
          ["6 PM", "Al pastor ramping up, suadero/campechano active, elotes/esquites at their peak, churros, marquesitas starting, aguas frescas", "Barbacoa (sold out), tacos de canasta (long gone), tamales (gone)"],
          ["10 PM", "Al pastor/suadero/campechano at peak, birria/quesabirria, tortas ahogadas, marquesitas, the camotero\u2019s steam whistle, nieves carts winding down", "Barbacoa, tamales, tacos de canasta, tlacoyos/huaraches (most day stalls closed)"]
        ]} },

      { h: "Safety, honestly",
        p: ["The real heuristics matter more than \u201cstreet versus restaurant.\u201d A visible line of locals at lunchtime is the single best signal \u2014 high turnover means food isn\u2019t sitting, and it\u2019s a harsher, more frequent quality test than any tourist review. Watch that the trompo, comal, or pot is actively in use, not sitting half-full for the last hour. One person handling cash and a different person handling food is a good sign; the same hands doing both without a wipe in between is a small negative, not a dealbreaker. Salsa made fresh and visibly \u2014 a molcajete or blender in view, bowls that get refilled \u2014 beats a jug that\u2019s clearly been sitting in the sun.",
            "Specific risk items worth knowing: raw salsas left out too long in heat; unpeeled or pre-cut fruit sitting exposed on ice (peeled-to-order or whole fruit is safer for the kids); ice in aguas frescas, where purified-water ice is common but not universal \u2014 ask \u201c\u00bfel hielo es de agua purificada?\u201d or just order \u201csin hielo\u201d; unpasteurized quesos frescos at markets, where a well-known packaged brand is the safer bet for the 1-year-old; and tap water, which should be avoided for drinking and brushing teeth even though CDMX\u2019s own health authorities note the water leaves treatment plants clean and degrades passing through old building plumbing.",
            "Ordinary travelers\u2019 diarrhea is common regardless of how carefully you eat \u2014 CDC-cited rates run 30\u201370% of travelers to the region on any given trip \u2014 so treat some mild GI adjustment as a real possibility, not a sign something went wrong. Adult-only preventive bismuth subsalicylate (Pepto-Bismol) has been shown in Mexico-based studies to roughly halve incidence when taken preventively; it is not for the toddler."],
        note: "Street food is often not riskier than restaurant food. A busy, high-turnover stall cooking to order in front of you can be safer than a quiet, half-empty restaurant with food sitting in a steam table you can\u2019t see. Choose based on the queue and the cooking method, not the address." },

      { h: "With small children",
        list: ["Handheld and low-mess defaults for the 4- and 5-year-old, shareable in small soft-only bites for the 1-year-old: quesadilla (plain cheese or potato), tlacoyo (bean, mild), gordita (queso/frijol), sope (mild topping), esquites in a cup with a spoon, elote cut off the cob into pieces, marquesita (cooled), churro, tamal dulce.",
               "Reliably not spicy by default, because the salsa is separate: al pastor (meat only), suadero, carnitas, quesadillas, tlacoyos, tamales (choose dulce or rajas con queso), esquites/elotes plain, tortas with plain fillings."],
        note: "A likely disaster with a toddler \u2014 skip or heavily modify: tortas ahogadas (built-in chile sauce, spoon-eaten, drips everywhere), birria/quesabirria (hot consomm\u00e9 dipping, real mess, moderate heat), the barbacoa consomm\u00e9 cup (hot liquid near small hands), and anything ordered \u201ccon todo\u201d without asking \u2014 raw onion is a common toddler dealbreaker, easily fixed by saying \u201csin cebolla.\u201d",
        p: ["Mercado Roma and Mercado de Medell\u00edn both have proper stalls with stools, tables, and bathrooms \u2014 better bail-out options than a street corner if a meltdown looks likely. Parque M\u00e9xico and Parque Espa\u00f1a are the natural move for grab-and-go: buy at a cart, eat on a bench or the grass, let the kids run while the adults finish. Specifically for the 1-year-old: ask for maciza (lean, boneless) rather than a mixed cut that may carry cartilage or small bone fragments; keep whole chiles off the plate entirely, not just mild salsa; let anything fried cool a couple of minutes before handing it over; and sequence sugar \u2014 churros, marquesitas, camotes with lechera \u2014 as an after-nap treat, not a pre-nap one."] },

      { h: "Where, near Hip\u00f3dromo and Roma",
        table: { head: ["Place", "What", "Notes"], rows: [
          ["Churrer\u00eda El Moro (Condesa)", "Churros, hot chocolate", "Steps from Parque M\u00e9xico \u2014 grab-and-stroll is the local move"],
          ["El Tizoncito (original)", "Tacos al pastor, credited as one of the dish\u2019s originators", "Since 1966, on Av. Tamaulipas; evening/night hours"],
          ["El Hidalguense", "Weekend-only barbacoa", "Campeche 155, Roma Sur; Fri\u2013Sun 7 AM\u20136 PM, arrive before ~1 PM"],
          ["Mercado de Medell\u00edn", "Market \u2014 carnitas, barbacoa, Latin American antojitos", "Mon\u2013Sat 8 AM\u20137 PM, Sun 8 AM\u20136 PM; liveliest weekend mornings"],
          ["Mercado Roma", "Gourmet food hall", "Good fallback for indoor seating and bathrooms with kids"],
          ["Pulquer\u00eda Insurgentes", "Pulque (adults)", "On Av. Insurgentes, Condesa/Roma Norte border; tourist-comfortable, rooftop"]
        ]},
        p: ["Tianguis (street markets) are genuinely some of the best places to eat with a family \u2014 quesadillas, guisado tacos, even barbacoa set up alongside produce stalls, outdoors, with room to spread out. The Condesa tianguis runs Tuesdays on Pachuca St. and Fridays on Campeche St.; Roma Norte\u2019s runs Fridays on Calle M\u00e9rida."] },

      { h: "If you only eat five things",
        steps: ["Tacos al pastor, at night, meat-only for the kids and salsa on the side for the adults \u2014 the single most essential CDMX dish and the most kid-adaptable of the \u201ciconic\u201d tacos.",
                "Esquites or elotes from a park cart at Parque M\u00e9xico or Parque Espa\u00f1a \u2014 cheap, mild if ordered plain, one of the best kid-friendly street snacks anywhere.",
                "Tacos de canasta at breakfast \u2014 cheap, soft, easy, and a real morning-only ritual you\u2019d otherwise miss entirely if you sleep past ten.",
                "Barbacoa on a Friday\u2013Sunday morning at El Hidalguense or a market stall \u2014 the most schedule-dependent dish here, worth building one morning around.",
                "Churros at Churrer\u00eda El Moro, eaten in Parque M\u00e9xico \u2014 it\u2019s in the neighborhood and the easiest \u201ciconic CDMX\u201d box to check with zero risk to small kids."],
        note: "The genuinely local thing most visitors miss: the guajolota (tamal-in-a-bolillo) from a morning tamale cart, bought while it\u2019s still dark-ish out. It isn\u2019t on tourist \u201cbest tacos\u201d lists because it isn\u2019t glamorous \u2014 it\u2019s just what millions of Chilangos eat walking to work, and it\u2019s a more honest slice of daily CDMX life than most curated food-tour stops." }
    ],
    links: [
      { label: "Mexico City Street Food Guide 2026 \u2014 Nomado Travel", url: "https://www.nomadotravel.app/en/guides/mexico-city-street-food-guide" },
      { label: "To cheese or not to cheese \u2014 Mexico News Daily", url: "https://mexiconewsdaily.com/food/to-cheese-or-not-to-cheese-whats-in-a-quesadilla/" },
      { label: "The Best Weekend Barbacoa Joint \u2014 Culinary Backstreets", url: "https://culinarybackstreets.com/stories/mexico-city/el-hidalguense" },
      { label: "Guajolota: Mexico City's Tamale Breakfast Sandwich", url: "https://www.mexicotravelandleisure.com/blog/guajolota-torta/" },
      { label: "Mercado Medell\u00edn \u2014 Mexico News Daily", url: "https://mexiconewsdaily.com/mexico-living/colonia-romas-best-old-school-market/" },
      { label: "Where to Try Pulque in Mexico City \u2014 Matador Network", url: "https://matadornetwork.com/read/mexico-pulque-drink/" }
    ]
  }

];
