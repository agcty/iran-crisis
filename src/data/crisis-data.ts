// Iran War Crisis Propagation — Feb 28 to Apr 9, 2026 (41 days, 40 countries)
// Data extracted from crisis-propagation-map.html + multi-agent validation

export const DATES = [
  "Feb 28","Mar 1","Mar 2","Mar 3","Mar 4","Mar 5","Mar 6","Mar 7","Mar 8","Mar 9",
  "Mar 10","Mar 11","Mar 12","Mar 13","Mar 14","Mar 15","Mar 16","Mar 17","Mar 18","Mar 19",
  "Mar 20","Mar 21","Mar 22","Mar 23","Mar 24","Mar 25","Mar 26","Mar 27","Mar 28","Mar 29","Mar 30","Mar 31","Apr 1","Apr 2","Apr 3","Apr 4","Apr 5","Apr 6","Apr 7","Apr 8","Apr 9",
] as const;

export const TOTAL_DAYS = DATES.length; // 41

// Oil prices per day ($/barrel, settlement/close unless noted)
// Validated: Pre-war $72.48 spot (Wikipedia). Intraday peak $119 on Mar 19 (CNBC),
// but close that day was $108.65. Highest close: $118.35 on Mar 31 (CNBC).
// Day 33: Brent opened $105.27, plunged to $98.52 intraday (briefly below $100 for first
// time in a week), settled ~$102. War premium deflated on Trump exit rhetoric.
// WTI ~$102.92. Dubai physical at $128.51 — $26 spread screams physical shortage.
// Day 34: Brent surged 7.4% to $108.62 after Trump "stone ages" speech. WTI +6.9% to $107.05.
// Hope rally completely reversed. Macquarie: 40% chance of $200 if war lasts to June.
// Day 35: Brent ~$110. First Western European ship exits Hormuz but escalation dominates.
// Brent surged ~60-64% in March (CNBC end-of-month) — largest monthly gain since 1988.
// Goldman forecasts $110 April avg. SocGen warns $150 if disruptions persist.
// Day 36: Markets closed (Good Friday + Saturday). Brent futures ~$109 (ICE, Investing.com).
// Range 99.08-109.74. Trump 48hr ultimatum looms — Apr 6 deadline for strikes on power grid.
// Confirmed Day 35 actual: Brent ~$109.03 (projected $110, delta -$1). Projection accurate.
// Day 37: Markets closed (Easter Saturday). Brent futures ~$109.24 (oilpriceapi.com live).
// April 6 deadline 24hrs away — expect gap-up Monday if strikes happen.
// Day 38: Markets reopen. Brent $111.25 at 9AM ET (Fortune), down $2.78 from prior session.
// First time above $110 on ICE since Mar 30. Pakistan ceasefire proposal caps upside but
// Trump "Power Plant Day" Tuesday threat caps downside. Iran adds Iraq to Hormuz exemption.
// Day 39: Brent volatile $106.89-$111.68. Kharg Island struck (military targets, not oil —
// US official) but WTI spiked 3% to ~$116 on news. "A whole civilization will die tonight" —
// Trump. Deadline 8PM ET. Iran human chains at power plants. ~$112 estimated close.
// Day 40: Brent COLLAPSES to ~$96.24 settlement (Fortune, TradingEconomics, CNBC) — down
// 11.93%, steepest single-day drop of the war. ~90 min before 8PM ET deadline, US + Iran
// announced Pakistan-mediated 2-week ceasefire contingent on Hormuz reopening. Intraday low
// ~$93.76. BUT: physical Dated Brent at $124.68 (CNBC) — massive paper-vs-physical divergence
// signals market still pricing in Hormuz disruption.
// Day 41: Brent rebounds to ~$101 (+5%) as Israel's "Operation Eternal Darkness" (160 bombs,
// 254 killed in Lebanon) fractures ceasefire and Iran de facto re-closes Hormuz (army consent
// requirement). Relief rally fully reverses. Physical Dubai still trading at huge premium.
export const BRENT_PRICES = [72,85,92,98,105,110,115,112,108,105,100,100,103,106,110,108,112,109,109,108,110,113,108,106,110,113,110,113,115,114,115,118,102,109,110,109,109,111,112,96,101];
// Dubai physical crude: confirmed peak $166-170/bbl (Seeking Alpha, CNBC).
// Pre-war $71. Spread to Brent hit ~$65 intraday Mar 18-19 (Manila Times).
// Revised from original to reflect verified physical market dislocation.
// Day 33: Dubai futures $128.51 (significantly above Brent — Asian premium + physical crunch).
// UAE fuel prices up 30% for April. Brent-Dubai spread $26 = extreme dislocation.
// Day 34: Dubai physical likely ~$135+ as Asian markets react to speech. KOSPI -4%.
// Day 35: Dubai physical ~$130 (reported $128.52 Apr 2, Fortune). Brent-Dubai spread ~$20.
// Day 36: Dubai physical ~$132. Platts futures 117.25, but physical premium persists.
// Murban stabilised ~$115 (GulfNews). UAE fuel up 30% for April. Brent-Dubai spread ~$23.
// Day 37: ~$132 (weekend, similar to Day 36). Kuwait strikes on KPC HQ may widen spread.
// Day 38: Dubai physical ~$130 (oilpriceapi.com $128.52 Apr 4). Iraq added to Hormuz exemption
// eases Asian physical premium slightly. Brent-Dubai spread ~$19 — still extreme dislocation.
// Day 39: Dubai physical ~$133. Kharg Island military strikes add risk premium to Asian physical.
// Brent-Dubai spread widens to ~$21. Saudi export cuts tightening Asian market further.
// Day 40: Dubai physical ~$122. Dated Brent cited by CNBC at $124.68 — physical market
// resisted the paper-Brent collapse. Ceasefire announcement didn't unclog actual Gulf barrels.
// Brent-Dubai spread widens to ~$26 — extreme divergence between futures and wet barrels.
// Day 41: Dubai physical ~$125. Iran deputy FM confirms ships need "army consent" for Hormuz
// — permission regime, not open passage. Only 5 bulk carriers transit in first 24hr of deal.
// Physical market continues to price in effective closure despite nominal ceasefire.
export const DUBAI_PRICES = [71,88,96,105,115,130,140,138,125,118,112,110,120,128,140,135,150,158,166,155,140,150,138,132,140,145,138,130,128,125,126,124,128,135,130,132,132,130,133,122,125];

// European jet fuel CIF NWE ($/metric tonne, S&P Global Platts assessments)
// Pre-war: $831/mt. Peak: $1,698/mt on Mar 16 (all-time Platts record).
// ~50% of EU jet imports came from Middle East in 2025. Kuwait alone ~25%.
// Kuwait refineries struck Mar 19 → 260K bpd of 1.77M global seaborne jet trade.
// Jet-to-LSGO spread hit $400/mt (record). Bid-offer $30/mt wide (vs $0.50 normal).
// By Day 31, major EU airports warning airlines "no fuel available" within 1 week.
// Jet fuel leads diesel by 2-4 weeks (Shell CEO Sawan, CERAWeek Mar 24).
// Day 33: $1,710/mt confirmed (City AM, AirLive). 130% above pre-war $742.
// Tanker Maetiga (last known UK-bound ME jet fuel cargo) arriving ~Apr 3.
// Two ships departed New York → England — historically unprecedented reroute (Bloomberg).
// UK imports 50% of jet fuel from ME (Kuwait 38%/4.1mt). Argus: "most exposed in Europe."
// Kerosene stocks exhaust in ~3 months without Gulf supply. May = danger zone.
// Day 34: Jet fuel likely pushed higher on escalation fears. Maetiga arrives ~Apr 3.
// Day 35: Maetiga arrives UK — last known ME jet fuel cargo. Jet CIF NWE ~$1,740/mt.
// UK "most exposed in Europe" (Argus). Industry warns weeks from rationing.
// Day 36: Jet CIF NWE ~$1,750/mt. No replacement cargoes visible on AIS after Maetiga.
// Mahshahr petrochemical zone struck — further tightens refined product supply.
// Day 37: ~$1,755. Kuwait KPC fire + Mahshahr casualties (5 dead, 170 wounded) = supply pressure.
// Day 38: ~$1,760/mt. IATA global avg $195.19/bbl (Apr 3). No replacement cargoes for UK after
// Maetiga. Kuwait KPC fire + Mahshahr zone damage tightens refined product supply further.
// Day 39: ~$1,775/mt. Israel's largest South Pars petrochemical complex struck. Kharg military
// targets hit. Pipeline/refinery risk premium elevated. UK still no replacement cargoes after Maetiga.
// Day 40: ~$1,640/mt — crashes ~8% alongside Brent on ceasefire announcement. But no physical
// replacement cargoes visible on AIS. Paper relief; physical shortage persists. UK still the
// most exposed European market (Argus). Kuwait KPC capacity still offline.
// Day 41: ~$1,695/mt — retraces as Lebanon strikes + Hormuz re-closure reprice risk. Still no
// replacement cargoes after Maetiga. Platts bid-offer spreads remain wide; physical supply not
// restored by ceasefire. EU energy commissioner publicly acknowledges rationing "being considered."
export const JET_FUEL_PRICES = [831,870,935,1000,1100,1150,1200,1250,1300,1370,1435,1501,1540,1580,1620,1660,1698,1660,1620,1580,1550,1560,1570,1580,1590,1600,1620,1650,1680,1700,1700,1710,1710,1730,1740,1750,1755,1760,1775,1640,1695];

// Strait of Hormuz oil flow (million barrels per day)
// Pre-crisis baseline: 20.9 mbpd (EIA, 2025 H1 average)
// Day 1: war starts late day, full day of normal flow
// Day 2-4: ships in transit clear; no new entries; flow collapses
// Day 5: Qatar force majeure on all LNG, near-total shutdown
// Day 6+: effectively closed (~0.2 mbpd residual small-vessel traffic)
// Day 29: Houthis enter war, even less; Day 30: Pakistan ships negotiated through
// Day 35: ~12 transits (UANI) but flow still minimal. French ship exits = symbolic, not volume.
// Day 36: ~13 transits (Bloomberg: highest weekly avg since war began). 10 exiting, 3 entering.
// LPG carriers + Saudi/UAE crude tankers (Dhalkut 2M bbl Saudi, Habrut 2M bbl UAE, Sohar LNG).
// Actual oil flow up slightly — real cargo moving, not just empties. ~0.6 mbpd estimated.
// Day 37: ~0.6 mbpd. Continued trickle. ~150 total transits since Mar 1 (vs ~5,000 normal).
// Day 38: ~0.7 mbpd. Iran adds Iraq to exemption list (alongside CN, RU, IN, PK, MY, TH).
// Turkish-owned Ocean Thunder transits today (Al Jazeera). Weekly transits highest since war.
// Day 39: ~0.5 mbpd. Deadline day — ships cautious. Lloyd's: 221 total transits since Mar 1.
// Weekend data: Fri 9, Sat 4, Sun 7 vessels (incl. 1 oil tanker, 1 products, 1 LNG on Fri).
// Kharg military strikes add uncertainty. 8 nations now have passage: CN,RU,IN,IQ,PK,MY,TH,PH.
// Day 40: ~0.3 mbpd. Ceasefire announced but IRGC briefly HALTS all traffic after Israel's
// Lebanon strikes. NBC: Hormuz "effectively at a standstill." IMO: ~2,000 ships stranded in
// Persian Gulf. Iran Deputy FM Khatibzadeh: ships must "coordinate with Iranian Armed Forces"
// — permission regime, not open passage. S&P Global: only 9 transits across Apr 8-9 combined.
// Day 41: ~0.4 mbpd. Bloomberg: 3 ships left Gulf. CNBC: "weeks, if not months" for traffic
// to normalize. Iran reiterates army consent requirement — contradicts Trump's "no limitations."
// At least one US-sanctioned Iran-flagged tanker ("Tour 2") among transits.
export const HORMUZ_FLOW = [20.9,14.0,6.0,2.5,0.8,0.5,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.1,0.5,0.3,0.4,0.3,0.3,0.4,0.6,0.6,0.7,0.5,0.3,0.4];

// Net global supply offline (million barrels per day)
// = pre-crisis Hormuz exports (~20.9 mbpd) minus bypass pipeline ramp-up
// Bypass infrastructure (sources: Bloomberg, S&P Global, EIA):
//   Saudi Petroline (Abqaiq→Yanbu): 7 mbpd pipe capacity, ~4.5 mbpd Yanbu port
//     loading capacity; pre-crisis ~2.5 mbpd, ramped to ~5 mbpd crude + 0.8 mbpd
//     refined products by late March. Pipeline hit full capacity Mar 11 (Day 12).
//   UAE ADCOP (Habshan→Fujairah): 1.5 mbpd capacity, pre-crisis 71% utilization
//     (~1.06 mbpd); ramped to full 1.5 mbpd within days.
//   Iraq Kirkuk-Ceyhan: resumed Sep 2025 at ~200-250 kbpd, suspended during conflict.
// Day 29 uptick: Houthis threaten Bab al-Mandeb, some Red Sea route risk
// Day 36: Slightly improved with more Hormuz transits, but Mahshahr petrochemical strike offsets.
// Day 37: ~14.0. Kuwait KPC damage + 2 power units knocked out, but Hormuz transits holding.
// Day 38: ~13.8. Iraq added to Hormuz exemption helps marginally. IEA Birol: 12 mbpd lost (CNBC).
// Pipeline bypass at capacity (~5.5 mbpd). Iraq output collapsed 4.3→1.2 mbpd.
// Day 39: ~14.0. Kharg military strikes + deadline uncertainty = slightly higher risk.
// South Pars petrochemical complex struck. Yellowcake facility at Ardakan destroyed.
// Day 40: ~14.1. Ceasefire announced but IRGC halts traffic after Lebanon strikes. Saudi
// pipeline still at capacity. Kuwait KPC offline. No physical restart yet.
// Day 41: ~14.0. Lebanon escalation fractures ceasefire. Iran's permission regime functions
// as de facto closure. Bloomberg: "weeks, if not months" to normalize. War risk insurance
// still canceled by Gard/Skuld/NorthStandard.
export const SUPPLY_OFFLINE = [0.0,8.5,14.0,16.5,17.5,17.2,17.0,16.8,16.5,16.2,16.0,15.5,15.2,15.0,14.8,14.8,14.5,14.5,14.5,14.5,14.4,14.4,14.4,14.4,14.4,14.4,14.4,14.4,14.8,14.2,14.5,14.3,14.3,14.3,14.2,14.0,14.0,13.8,14.0,14.1,14.0];

// IEA emergency reserves released — cumulative (million barrels)
// IEA announced record 400M barrel release on Day 12 (Mar 11, 2026):
//   US: 172M over 120 days (~1.43M bbl/day, starting ~Day 19 per DOE lead time)
//   Japan: ~80M (immediate, starting Day 13; 470M total reserves = 254 days cover)
//   Other IEA Asia (Korea, Australia): ~23M starting Day 13
//   Europe (Germany, France, etc.): ~97M starting ~Day 28 ("end of March")
// Release rates: Asia ~1.1M/day, +US ~2.5M/day from Day 19, +Europe ~3.6M/day from Day 28
// Sources: IEA collective action decision Mar 11 2026, DOE SPR data, Nippon.com
// Day 35: ~3.6M/day release rate continues (US+Japan+Europe all contributing)
// Day 36: +3.6M = 61.8M cumulative. IEA considering second coordinated release (CNBC Apr 1).
// Day 37: +3.6M = 65.4M cumulative (~4.4% of IEA total 1,485M reserves deployed).
// Day 38: +3.6M = 69.0M cumulative. DOE issued additional 10M bbl exchange Apr 1. US release
// rate ~1.43M/day. IEA considering second coordinated release if war extends past April.
// Day 39: +3.6M = 72.6M cumulative (~4.9% of IEA total 1,485M reserves deployed).
// Day 40: +3.6M = 76.2M. Ceasefire doesn't halt drawdown — physical market still tight.
// Day 41: +3.6M = 79.8M. IEA still weighing second coordinated release given unresolved
// Hormuz situation and fragile ceasefire.
export const SPR_RELEASED = [0,0,0,0,0,0,0,0,0,0,0,0,1.1,2.2,3.3,4.4,5.5,6.6,9.1,11.7,14.2,16.7,19.2,21.8,24.3,26.8,29.4,33.0,36.6,40.2,43.8,47.4,51.0,54.6,58.2,61.8,65.4,69.0,72.6,76.2,79.8];

// Pre-crisis IEA total emergency reserves: ~1,485M barrels
// (US 415M + Japan 470M + other IEA ~600M; source: DOE, JOGMEC, IEA Oil Security)
export const IEA_RESERVES_TOTAL = 1485;

// Strait of Hormuz ship transits per day (non-Iranian AIS-visible)
// Pre-war: ~138/day (UANI data, validated). Kpler: 201 commodity carrier crossings Mar 1-31.
// Note: Lloyd's List reported 142 transits Mar 1-25 which includes Iranian-flagged vessels;
// our daily array tracks non-Iranian AIS-visible only, so totals will be lower.
// Day 2-3: Near zero (IRGC closure). Day 4-10: 0-2/day, 150+ tankers anchored outside
// Day 12-13: ~3/day, 21 attacks on ships by Day 13. Day 14-18: ~5/day (IRGC tollbooth)
// Day 19: 8 (Windward/MarineTraffic). Day 20+: 5-8/day, selective passage
// 5 nations approved: CN, RU, IN, PK, IQ. Additional: MY, TH (bilateral deals)
// 80%+ March transits are shadow fleet (up from 15% in Feb).
// IRGC claims up to $2M/transit (Iranian officials via IRIB, not independently verified)
// Sources: Lloyd's List, Windward, UANI, MarineTraffic, Kpler
// Day 35: ~12 transits (UANI Apr 2 data). French container ship exits — first Western European
// vessel since war began. Philippines added to selective passage list.
// Day 36: 13 transits (Bloomberg Apr 4: "weekly transits reach highest since war began").
// 10 exiting Gulf, 3 entering. Led by LPG carriers incl. India-bound + Iranian-affiliated.
// IRGC claims drone attack on MSC Ishyka (Liberia-flagged, allegedly Israel-linked) — unverified.
// Day 37: ~14 transits. Weekly trend highest since war began. ~150 total since Mar 1 (UANI).
// Still 90%+ below pre-war 138/day. CBS: most transits are Iranian-linked shadow fleet.
// Day 38: ~15 transits. Iraq added to exemption list (Al Jazeera). 53 transits last week =
// highest since war (up from 36 prior week). Turkish vessel Ocean Thunder crosses.
// 7 nations now exempt: CN, RU, IN, PK, MY, TH, IQ. ~80%+ shadow fleet.
// Day 39: ~8 transits. Deadline day — shipping cautious. Lloyd's List: 221 total since Mar 1.
// Weekend data: Fri 9, Sat 4, Sun 7. Monday deadline suppresses traffic.
// Day 40: ~4 transits. NBC: Hormuz traffic "effectively at a standstill" after ceasefire.
// IRGC halts all traffic after Israel strikes Lebanon. S&P Global: 9 across Apr 8-9 combined.
// Ceasefire announced ~6:32pm ET (~90 min before deadline) but no physical restart.
// Day 41: ~5 transits. Bloomberg: 3 ships left Gulf; only 5 bulk carriers across first 24hrs
// of deal per MarineTraffic/Kpler. One was US-sanctioned Iran-flagged tanker "Tour 2." Iran
// Deputy FM: army consent still required. White House: "unacceptable."
export const HORMUZ_TRANSITS = [138,0,0,1,0,1,1,1,2,1,2,3,3,5,5,5,5,5,8,6,5,7,5,5,6,5,6,7,5,6,7,9,7,6,12,13,14,15,8,4,5];

// EU aggregate gas storage (% full, AGSI data)
// Feb 28: ~42%. Mar 8: ~35%. Mar 17: 28.93% (AGSI exact). Mar 25: ~28.4%. Mar 30: ~27.5%
// EU regulation requires 90% full by Nov 1. Last year same date: 34.47%
// Netherlands critically low at ~5-6%. Refill season normally Mar-Apr but requires
// LNG imports now disrupted by QatarEnergy force majeure.
// TTF gas: ~€38/MWh pre-war → ~€55-56/MWh by Mar 30. Goldman Q2: €72, adverse €100+
// Interpolated linearly between AGSI data points.
// Day 35: Continuing decline ~0.2%/day. QatarEnergy FM extended to mid-June. No LNG restocking.
// Day 36: ~26.5%. TTF at €49.95/MWh (oilpriceapi.com). Injection season should have started
// by now but QatarEnergy FM + Hormuz closure prevents LNG restocking. EU 90% by Nov 1 target
// looks impossible. Netherlands critically low. Goldman Q2: €72, adverse: €100+.
// Day 37: ~26.3%. Continuing ~0.2%/day decline. Should be injecting by now — instead depleting.
// Day 38: ~26.1%. Lowest for this time of year since 2022 (10yr avg 58%). Netherlands critically
// low. QatarEnergy FM extended through mid-June = no LNG restocking. EU 90% by Nov 1 impossible.
// Day 39: ~25.9%. TTF surged >100% since Feb to above €61/MWh. EU energy commissioner admits
// rationing "being considered." Continued ~0.2%/day decline with no injection possible.
// Day 40: ~25.8%. TTF crashes to €46.64/MWh (oilpriceapi) on ceasefire. But QatarEnergy FM
// still in effect — injection physically impossible. AGSI shows only marginal slowdown in
// depletion; no restart of Gulf LNG flows. AGSI methodology reads different than our tracker
// (28.61% snapshot) but continuity model preserves depletion trajectory.
// Day 41: ~25.6%. Lebanon escalation + Hormuz re-closure ends any injection hopes. Still
// historic low for this time of year (10yr avg 58%). TTF holds ~€47/MWh.
export const EU_GAS_STORAGE = [42.0,41.1,40.3,39.4,38.5,37.6,36.8,35.9,35.0,34.3,33.7,33.0,32.3,31.6,31.0,30.3,29.6,28.9,28.8,28.8,28.7,28.7,28.6,28.5,28.5,28.4,28.2,28.0,27.9,27.7,27.5,27.3,27.1,26.9,26.7,26.5,26.3,26.1,25.9,25.8,25.6];

// Force majeure declarations (cumulative count)
// Day 3: QatarEnergy (all LNG, 20% global offline, ~90 cargoes)
// Day 5: Alba (aluminum). Day 6: KPC (Kuwait oil). Day 8: Shell (selected LNG)
// Day 10: Bapco (Bahrain refinery, 380K bpd). Day 11: Iraq SOMO (Basra)
// Day 13: OQ Trading Oman (LNG to Bangladesh). Day 15: India (domestic gas redirect)
// Day 19: Wave across Asian petrochemical firms (Gulf feedstock)
// Day 25: QatarEnergy extended through May
// Day 32: QatarEnergy extends existing force majeure through mid-June (not a new declaration)
// Day 36: No new force majeure declarations. Holding at 10.
// Day 37: Holding at 10. Kuwait KPC fire may trigger new FM but not declared yet.
// Day 38: Holding at 10. No new FM declarations confirmed. KPC HQ fire ongoing but no formal FM.
// Day 39: Holding at 10. South Pars petrochemical complex struck but no new FM declared yet.
// Day 40: Holding at 10. Ceasefire announced but no FMs lifted (reconstruction will take years).
// War risk insurance still canceled by Gard/Skuld/NorthStandard — effectively equivalent to FM.
// Day 41: Holding at 10. Lebanon escalation + Hormuz re-closure = no carriers resume FM'd routes.
export const FORCE_MAJEURES = [0,0,1,1,2,3,3,4,4,5,6,6,7,7,8,8,8,8,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10];

// Signal-action gap tracker (cumulative count)
// Countries simultaneously saying "remain calm / no shortage" while implementing
// emergency measures. The editorial core of this visualization.
// Day 7: India (Puri: "no cause of worry" → later imposed tax cuts + export levies)
// Day 10: +UK (Starmer: "not there yet" → reviewed National Emergency Plan)
// Day 12: +Japan ("no disruption" → largest-ever reserve release), +USA (SPR, prices rose 17%)
// Day 14: +Pakistan ("adequate supply" → later 4-day workweek + school closures)
// Day 23: +Slovenia ("no shortages" → army deployed), +Germany (downplays → warns of imminent crisis)
// Day 26: +Philippines (shift to national emergency after calm messaging)
// Day 28: +India (third "remain calm" amid visible pump lines)
// Day 30: +Australia ("supply secure" → 500+ stations ran dry)
// Day 31: +Japan ("remain calm" → emergency task force for medical supplies)
// Day 32: UK Ed.Sec. Phillipson "fill up as normal" while reviewing rationing powers
// Day 33: Albanese "enjoy Easter" (400+ stations dry) + Starmer "weather the storm" (diesel £100/tank)
//   + Peter Kyle "no supply chain issues at all" while last jet fuel tanker (Maetiga) en route
//   + Romania Energy Min. Ivan "rationing not being considered" while 3 of 4 refineries offline
// Day 34: Trump "nearing completion" + "stone ages" in same speech = gap 17
// Day 35: No major new signal-action gap identified today. Holding at 17.
// Day 36: Trump "48 hours to make a deal" while simultaneously searching for downed pilot
// and preparing strikes on nuclear/energy sites — gap between "deal" rhetoric and escalation.
// Iran rejects 48hr ceasefire while claiming to allow "essential goods" through Hormuz. +1 = 18.
// Day 37: Trump celebrates WSO rescue ("most daring in US history") while Apr 6 power grid
// strike deadline is 24hrs away. Framing victory while preparing massive civilian escalation.
// Holding at 18 — this is escalation rhetoric, not the classic "remain calm" pattern.
// Day 38: +India FM Sitharaman: "no lockdown, no fuel shortage" — calls rumors "irresponsible
// and harmful" while police deployed at fuel stations and Saudi cut India's April crude to 23M bbl
// (from 25-28M). Classic signal-action gap. +1 = 19.
// Day 39: Iran organizes "human chain for a bright tomorrow" around power plants (claiming
// grassroots youth initiative) while Pezeshkian claims 14M volunteer martyrs on X — using
// civilians as shields while rejecting ceasefire. Trump calls proposal "significant" while
// threatening "a whole civilization will die tonight." Both sides maximally contradictory. +1 = 20.
// Day 40: +2 = 22. (a) Netanyahu "supports Trump's decision" to suspend Iran strikes while
// simultaneously launching largest Lebanon strike of war (Operation Eternal Darkness: 160 bombs,
// 254 killed). (b) Iran Deputy FM "Hormuz is open" while imposing army-consent permission
// regime and briefly halting all traffic after Lebanon strikes.
// Day 41: +1 = 23. White House: "Reports of Iran closing Hormuz completely unacceptable" —
// while Iran's Deputy FM is publicly explaining the permission regime. US says peace talks
// "imminent" while Trump threatens to resume strikes if Iran "doesn't agree to peace terms."
export const SIGNAL_ACTION_GAPS = [0,0,0,0,0,0,1,1,1,2,2,4,4,5,5,5,5,5,5,5,5,5,7,7,7,8,8,9,9,10,11,12,16,17,17,18,18,19,20,22,23];

// Protest / unrest escalation index (1-5 scale)
// 1=isolated, 2=scattered protests, 3=organized demonstrations,
// 4=mass events, 5=critical (millions mobilized / government stability at risk)
// Day 1-7: Pakistan protests (26-35 killed). Day 8-14: India fuel protests, PH tensions.
// Day 15-21: PH transport strike, BD military at depots, EG restrictions.
// Day 22-25: Fuel queue confrontations TH/BD/PH, EU border fuel tourism tensions.
// Day 26-28: PH nationwide strike. US "No Kings Day" Mar 28: 8-9M, 3300 events, 50 states.
//   Tel Aviv anti-war protest (18 arrests). Day 29-31: Sustained. Trump 36% approval.
// Day 35: Sustained at 5. Evacuation of US troops/families from ME bases. Protests continue.
// Day 36: Sustained at 5. Easter weekend + Australia petrol shortages. Pakistan free transit.
// 78% of Jewish Israelis still support war (Al Jazeera). Iran 2,076 killed / 26,500 wounded.
// Day 37: Sustained at 5. Easter weekend + fuel shortages. US gas $4.10/gal (+37% since Feb 28).
// Day 38: Sustained at 5. Philippines transport strike (thousands over diesel prices). India
// nationwide protests resuming. Sri Lanka 15L/week cap. Myanmar alternate-day driving rule.
// Day 39: Sustained at 5. Iran human chains at power plants. 25th Amendment calls in US Congress.
// 14M Iranian "volunteers." Deadline day — global tension at peak.
// Day 40: Sustained at 5. Ceasefire announced but Israel's Lebanon strike (254 killed, 1,165
// wounded — largest of war) fractures it within hours. Hezbollah: "grave violation."
// Day 41: Sustained at 5. Hezbollah publicly resumes rocket fire (~70 rockets into Israel).
// Lebanon casualties + Hormuz ceasefire fracture keep global tension at peak.
export const UNREST_INDEX = [1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];

// Gold price ($/oz, approximate daily close)
// Pre-war: $5,278 (Feb 28, confirmed StatMuse/TradingEconomics/goldprice.org).
// Gold hit ATH $5,595 on Jan 28-29 2026.
// COUNTERINTUITIVELY FELL during Iran war (~-17%), not the expected safe-haven rally.
// Reasons: USD strength (DXY multi-year highs), forced liquidations from overleveraged
// Jan rally positions, rising yields from oil-driven inflation fears, profit-taking.
// Validated low: ~$4,348 on Mar 23 (pricegold.net daily close), NOT $4,150.
// Day 33: Gold UP to ~$4,700 even on risk-on day — smart money not buying peace story
// Day 34: Gold likely higher as escalation confirmed — safe haven bid returns
// Day 35: Gold ~$4,690 (Fortune Apr 2: $4,675, spot Apr 3: $4,690.53).
// Still below pre-war $5,278 — counterintuitive war discount persists (USD strength, liquidations).
// Day 36: Gold ~$4,680 (markets closed, carry from Apr 3 close of $4,677, USAGOLD).
// Confirmed Day 35: $4,677 (projected $4,690, delta -$13). Down 1.72% on Apr 3 as
// USD strengthened on Trump escalation + higher rate expectations from oil-driven inflation.
// JP Morgan year-end target $6,300. Deutsche Bank $6,000.
// Day 37: Gold ~$4,703 (TradingEconomics, +0.49% on weekend trading). Safe-haven bid returning
// as Apr 6 deadline looms. Still below pre-war $5,278 (-11%).
// Day 38: Gold $4,672 at 9:05AM ET (Fortune). Down from $5,097 a month ago. Up 56.7% YoY.
// Safe-haven bid weakened by USD strength + ceasefire talk — but still elevated vs baseline.
// JP Morgan year-end target $6,300. Still -11.5% below pre-war $5,278.
// Day 39: Gold ~$4,675 (Fortune range $4,576-$4,701). Deadline tension supports safe-haven bid
// but USD strength caps upside. Still -11.4% below pre-war.
// Day 40: Gold SURGES to ~$4,802 (+$127 d/d, Fortune). Safe-haven bid overwhelms ceasefire
// relief — inflation/geopolitical premium persisting even as equities rally. Smart money
// refusing to price peace. Still -9% below pre-war $5,278.
// Day 41: Gold ~$4,815. Elevated on Lebanon escalation + Hormuz re-closure. JP Morgan year-end
// target $6,300 unchanged. Deutsche Bank $6,000. Market treating ceasefire as fragile.
export const GOLD_PRICES = [5278,5400,5350,5250,5150,5050,4950,4900,4850,4780,4700,4650,4600,4550,4500,4480,4450,4380,4350,4300,4250,4200,4200,4350,4380,4400,4430,4450,4460,4470,4480,4560,4700,4750,4690,4680,4703,4672,4675,4802,4815];

// VIX (CBOE Volatility Index, approximate daily close)
// Pre-war: ~17 (Feb avg 16.1, Investing.com). Validated: highest close 31.05 on Mar 27.
// Monthly intraday high: 35.30 (Investing.com) — date uncertain, NOT Mar 18 (close was 25.09).
// Mar 18 close: 25.09. Monthly low close: 20.28.
// Sources: Investing.com historical, FinancialContent, CNBC, FRED VIXCLS.
// Day 33: VIX crashed to ~25 on hope rally (S&P +2.91%, best day since May)
// Day 34: VIX spikes back as hope rally reverses. Futures -1%+, Asian markets hammered.
// Day 35: VIX ~25. CBOE actual close 23.87 Apr 2. Not as elevated as expected — markets
// pricing in escalation as baseline rather than shock. Range 23.87-27.89 on Apr 2.
// Day 36: Markets closed (Good Friday + Saturday). VIX carry at ~24 (CBOE close 23.87 Apr 2).
// Confirmed Day 35 actual: VIX 23.87 (projected 25, delta -1.13). Markets less fearful than
// expected — treating war as baseline. Apr 6 deadline may spike VIX Monday.
// Day 37: VIX ~24 (markets closed Easter Saturday, carry from CBOE 23.87 close Apr 2).
// Day 38: VIX 24.54 (FinancialContent). Significant decline from mid-March >30 highs.
// "Muscat Protocol" Oman-brokered Green Channel agreement reduces volatility premium.
// Still ~40% above long-term 12-18 baseline. Tuesday deadline may spike VIX again.
// Day 39: VIX ~25 (Yahoo Finance 24.17 +1.26%). Deadline day tension. S&P +0.44% to 6,612
// on ceasefire hopes but futures cautious pre-market. Worst Q1 since 2022 (-4.6%).
// Day 40: VIX COLLAPSES to 20.18 (Bloomberg, Investing.com) — lowest since Feb 27 (pre-war),
// down 5+ points. Ceasefire announcement ~90 min before Trump's 8PM ET deadline triggers
// massive de-risking. S&P relief rally. But no unwind of physical oil dislocation.
// Day 41: VIX jumps back to ~21.6 (Zacks) — Lebanon "Operation Eternal Darkness" (254 killed,
// largest strike of Lebanon war) fractures ceasefire within hours. Iran de facto re-closes
// Hormuz. Markets re-price risk. Still well below mid-March 30+ highs.
export const VIX = [17,25,28,30,32,34,33,31,29,28,25,22,20,25,28,27,29,28,25,27,28,29,28,27,28,29,28,31,30,29,30,30,25,29,25,24,24,25,25,20,22];

// Severity levels for map coloring
export const SEVERITY_LEVELS = {
  0: { label: "Normal", color: "#151820" },
  1: { label: "Monitoring", color: "#1a2e1a" },
  2: { label: "Reassurance / price controls", color: "#3a3a1a" },
  3: { label: "Reserves / emergency measures", color: "#6a3a0a" },
  4: { label: "Rationing / shortages", color: "#8a1a1a" },
  5: { label: "Crisis / emergency", color: "#6a0a0a" },
} as const;

export type SeverityLevel = keyof typeof SEVERITY_LEVELS;

// Country status per day (31 values each, severity 0-5)
// Key = ISO 3166-1 alpha-3 code for react-simple-maps compatibility
export const COUNTRY_STATUS: Record<string, number[]> = {
  IRN: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  USA: [1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  GBR: [1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4],
  FRA: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ESP: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  DEU: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ITA: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  NLD: [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  NOR: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  AUT: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  SVN: [1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  SVK: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  HUN: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  HRV: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  POL: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  SAU: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  ARE: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],
  QAT: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  KWT: [3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5],
  // Iraq: 70% Basra production cut, oil port suspended, tanker attacks, fiscal collapse by mid-May
  IRQ: [3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5],
  EGY: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  YEM: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5],
  LBN: [1,1,1,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5],
  PAK: [1,1,1,1,1,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  IND: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  LKA: [1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  // Bangladesh: reserves ~9-14 days, pumps running dry, fuel violence, only 3 of 14 Apr shipments
  BGD: [1,1,1,1,1,1,1,1,1,2,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5],
  CHN: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  JPN: [1,1,1,1,1,1,1,1,1,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
  KOR: [1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4],
  VNM: [1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  THA: [1,1,1,1,1,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4],
  PHL: [1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
  AUS: [1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,5,5,5,5,5,5,5,5,5],
  // Russia: net beneficiary of crisis ($45-151B extra revenue), sanctions eased. Not in emergency.
  RUS: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  KEN: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4],
  // Nigeria: 65% price surge, station sales collapsed 90%, de facto supply breakdown
  NGA: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4],
  ETH: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4],
  // Romania: crisis declared Mar 23 (Day 24). Emergency ordinance Apr 1.
  // 3 of 4 refineries offline (Petromidia maintenance, Petrotel sanctions, Vega maintenance).
  // Structural diesel deficit. Pump protests. Fuel tourism to Bulgaria. 90 days reserves.
  ROU: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4],
  // Israel: primary combatant. 24+ killed, 6,239+ wounded as of Apr 1.
  // Day 39: Haifa residential missile strike — 4 killed. BMs at Tel Aviv, Beersheba.
  // Day 40-41: Multi-front. Iran ceasefire nominal; Israel launches "Operation Eternal Darkness"
  // on Lebanon (160 bombs, 254 killed) — largest strike of Lebanon war. Hezbollah resumes rockets.
  ISR: [5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
};

// Human-readable country names
export const COUNTRY_NAMES: Record<string, string> = {
  IRN: "Iran",
  USA: "United States",
  GBR: "United Kingdom",
  FRA: "France",
  ESP: "Spain",
  DEU: "Germany",
  ITA: "Italy",
  NLD: "Netherlands",
  NOR: "Norway",
  AUT: "Austria",
  SVN: "Slovenia",
  SVK: "Slovakia",
  HUN: "Hungary",
  HRV: "Croatia",
  SAU: "Saudi Arabia",
  ARE: "UAE",
  QAT: "Qatar",
  KWT: "Kuwait",
  IRQ: "Iraq",
  EGY: "Egypt",
  YEM: "Yemen",
  LBN: "Lebanon",
  PAK: "Pakistan",
  IND: "India",
  LKA: "Sri Lanka",
  BGD: "Bangladesh",
  CHN: "China",
  JPN: "Japan",
  KOR: "South Korea",
  VNM: "Vietnam",
  THA: "Thailand",
  PHL: "Philippines",
  AUS: "Australia",
  RUS: "Russia",
  POL: "Poland",
  KEN: "Kenya",
  NGA: "Nigeria",
  ETH: "Ethiopia",
  ROU: "Romania",
  ISR: "Israel",
  IDN: "Indonesia",
};

// Event types and their visual styles
export const EVENT_TYPES = {
  reassurance:     { label: "Reassurance",        bg: "bg-[#1a2a1a]", border: "border-[#3a6a3a]" },
  price_controls:  { label: "Price Controls",     bg: "bg-[#2a2a1a]", border: "border-[#6a6a2a]" },
  reserve_release: { label: "Reserve Release",    bg: "bg-[#1a2a3a]", border: "border-[#2a5a8a]" },
  rationing:       { label: "Rationing",          bg: "bg-[#3a1a1a]", border: "border-[#8a3a2a]" },
  emergency:       { label: "Emergency",          bg: "bg-[#3a0a0a]", border: "border-[#cc2a2a]" },
  warning:         { label: "Warning",            bg: "bg-[#2a1a0a]", border: "border-[#8a5a2a]" },
  diplomatic:      { label: "Diplomatic",         bg: "bg-[#1a1a2a]", border: "border-[#4a4a8a]" },
  military_fuel:   { label: "Military for Fuel",  bg: "bg-[#2a0a1a]", border: "border-[#8a2a4a]" },
  export_ban:      { label: "Export Ban",         bg: "bg-[#2a1a2a]", border: "border-[#6a3a6a]" },
  medical_warning: { label: "Medical/Food Warning", bg: "bg-[#1a0a2a]", border: "border-[#6a2a8a]" },
  political:       { label: "Political",          bg: "bg-[#1a1a1a]", border: "border-[#5a5a5a]" },
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export interface CrisisEvent {
  day: number;
  country: string;
  who: string;
  type: EventType;
  text: string;
  gap: string | null; // Government statement vs reality gap
}

export const EVENTS: CrisisEvent[] = [
  { day: 1, country: "Iran/Gulf", who: "US/Israel", type: "emergency", text: "Operation Epic Fury launched. Khamenei killed. Strait of Hormuz closed.", gap: null },
  { day: 2, country: "OPEC+", who: "Secretariat", type: "diplomatic", text: "Modest 206K bpd output boost for April.", gap: null },
  { day: 5, country: "Qatar", who: "QatarEnergy", type: "emergency", text: "Force majeure on all LNG after Ras Laffan strikes. 20% of global LNG offline.", gap: null },
  { day: 7, country: "India", who: "Min. H.S. Puri", type: "reassurance", text: "\"No shortage of energy in India. No cause of worry.\"", gap: "Later imposed tax cuts + export levies" },
  { day: 7, country: "China", who: "Foreign Ministry", type: "diplomatic", text: "\"Will do what is necessary to protect energy security.\"", gap: "Quietly banned diesel/gasoline exports" },
  { day: 10, country: "South Korea", who: "Pres. Lee Jae-myung", type: "price_controls", text: "Fuel price caps — first time in 30 years. 100 trillion won stabilization.", gap: null },
  { day: 10, country: "Hungary", who: "PM Orbán", type: "price_controls", text: "Fuel caps for Hungarian plates. Excise cuts. Fuel export ban.", gap: null },
  { day: 10, country: "UK / G7", who: "PM Starmer", type: "reassurance", text: "\"The longer this goes on, the more likely the impact. We're not there yet.\"", gap: "Later reviewed National Emergency Plan for Fuel" },
  { day: 12, country: "IEA", who: "Dir. Fatih Birol", type: "reserve_release", text: "Record 400M barrel release. \"Largest supply disruption in history.\"", gap: null },
  { day: 12, country: "USA", who: "President Trump", type: "reserve_release", text: "172M barrels from SPR. \"Will substantially reduce oil prices.\"", gap: "Prices rose 17% after announcement" },
  { day: 12, country: "Japan", who: "PM Takaichi", type: "reserve_release", text: "~80M barrel release — largest ever. \"Absolutely no disruption to gasoline.\"", gap: "'No disruption' while tapping largest-ever reserves" },
  { day: 13, country: "Australia", who: "Min. Bowen", type: "reserve_release", text: "Suspended fuel quality standards for 60 days to expand supply.", gap: null },
  { day: 14, country: "Austria", who: "OMV stations", type: "warning", text: "First Austrian stations exhaust fuel reserves amid panic buying.", gap: null },
  { day: 14, country: "Pakistan", who: "PM Sharif", type: "reassurance", text: "Held prices steady. \"Adequate crude oil available.\"", gap: "Later: 4-day workweek + school closures" },
  { day: 14, country: "Thailand", who: "Retailers", type: "rationing", text: "Station-level rationing begins. Major retailer caps purchases.", gap: null },
  { day: 17, country: "Sri Lanka", who: "Pres. Dissanayake", type: "rationing", text: "4-day workweek to preserve fuel. \"Prepare for worst, hope for best.\"", gap: null },
  { day: 17, country: "Egypt", who: "PM Madbouly", type: "rationing", text: "\"We need to begin to ration.\" Shops close 9pm. State vehicle fuel -30%.", gap: null },
  { day: 18, country: "WFP", who: "Dep.Dir. Skau", type: "medical_warning", text: "45M additional people could face acute hunger if war continues.", gap: null },
  { day: 19, country: "Slovakia", who: "Government", type: "rationing", text: "Stations authorized to limit diesel + higher prices for foreign plates.", gap: null },
  { day: 19, country: "Austria", who: "Government", type: "price_controls", text: "\"Fuel Price Brake\": 5c/L tax cut + margin caps announced.", gap: null },
  { day: 19, country: "Italy", who: "PM Meloni", type: "price_controls", text: "€417M for excise cuts ~25c/L on petrol and diesel.", gap: null },
  { day: 20, country: "IEA", who: "IEA", type: "warning", text: "Urged COVID-style measures: work from home, skip flights.", gap: null },
  { day: 20, country: "Spain", who: "PM Sánchez", type: "price_controls", text: "€5B package: energy VAT to 10%, 20c/L fuel subsidy.", gap: null },
  { day: 21, country: "Croatia", who: "PM Plenković", type: "price_controls", text: "Extended fuel price caps for tourism season.", gap: null },
  { day: 21, country: "United Airlines", who: "CEO Kirby", type: "warning", text: "Planning for $175/bbl. Cutting 5% capacity. May hike fares 20%.", gap: null },
  { day: 23, country: "Slovenia", who: "PM Golob", type: "military_fuel", text: "50L/day cap. Army deployed. \"Warehouses full, no shortages.\"", gap: "Army deployed while saying 'no shortages'" },
  { day: 24, country: "Germany", who: "Econ.Min. Reiche", type: "warning", text: "\"Not yet seeing shortages... expect end of April or May.\" BASF +30%.", gap: "Downplays while warning of imminent crisis" },
  { day: 24, country: "Chevron", who: "CEO Wirth", type: "warning", text: "\"Very real physical manifestations working around the world.\"", gap: null },
  { day: 25, country: "Shell", who: "CEO Sawan", type: "warning", text: "\"South Asia first... SE Asia... NE Asia... then Europe in April.\"", gap: null },
  { day: 25, country: "TotalEnergies", who: "CEO Pouyanné", type: "warning", text: "Market is \"dislocated.\" People \"very unhappy\" about fuel prices.", gap: null },
  { day: 25, country: "OMV", who: "CEO Stern", type: "warning", text: "Could reduce supply \"more than Ukraine\" — physical, not rerouting.", gap: null },
  { day: 26, country: "Philippines", who: "Pres. Marcos Jr.", type: "emergency", text: "National energy emergency: \"imminent danger of critically low supply.\"", gap: null },
  { day: 26, country: "Austria", who: "Parliament", type: "price_controls", text: "Fuel Price Brake passed into law. Effective April 1.", gap: null },
  { day: 26, country: "India", who: "PM Modi", type: "reassurance", text: "\"Economic fundamentals strong... ample petrol available.\"", gap: "Visible pump lines forming" },
  { day: 27, country: "Germany", who: "Econ.Min. Reiche", type: "warning", text: "Reiterated: fuel shortages expected by end of April.", gap: null },
  { day: 28, country: "Russia", who: "DPM Novak", type: "export_ban", text: "Gasoline export ban April 1 – July 31.", gap: null },
  { day: 28, country: "India", who: "Min. Puri + Shah", type: "reassurance", text: "\"No shortage. Rumours of lockdown false. Remain calm.\"", gap: "Repeated 'remain calm' amid tax cuts and levies" },
  { day: 29, country: "Yemen", who: "Houthi leadership", type: "emergency", text: "Houthis enter war. Missiles at Israel. Bab al-Mandeb threatened.", gap: null },
  { day: 29, country: "Thailand", who: "PM Anutin", type: "rationing", text: "PM Order No. 3/2026: emergency fuel measures citing depletion.", gap: null },
  { day: 30, country: "Pakistan", who: "Hosted talks", type: "diplomatic", text: "4-nation mediation. Iran allows 20 Pakistani ships through Hormuz.", gap: null },
  { day: 30, country: "Australia", who: "PM Albanese", type: "price_controls", text: "50% fuel excise cut. \"Supply secure.\" 500+ stations ran dry.", gap: "'Secure' while 500+ stations dry" },
  { day: 31, country: "Japan", who: "PM Takaichi", type: "medical_warning", text: "Dialysis tubing, surgical containers at risk. \"Remain calm.\"", gap: "Emergency task force while saying 'calm'" },
  { day: 31, country: "USA", who: "President Trump", type: "political", text: "Considering seizing Kharg Island. \"We have a lot of options.\"", gap: null },

  // ── Additional verified events (research round 2) ──

  // Day 2: Pakistan protests after Khamenei killing
  { day: 2, country: "Pakistan", who: "Shia communities", type: "emergency", text: "Nationwide protests; 26-35 killed, 120+ injured. US Consulate Karachi stormed; Marines open fire.", gap: null },

  // Day 3: Shipping insurance collapses
  { day: 3, country: "Global shipping", who: "Marine insurers", type: "warning", text: "War risk cover cancelled for Gulf. Premiums 0.2% → 1% of vessel value. Strait effectively uninsurable.", gap: null },
  { day: 3, country: "Maersk", who: "A.P. Moller-Maersk", type: "warning", text: "Emergency freight increase: +$1,800/20ft, +$3,000/40ft for all Gulf cargo.", gap: null },

  // Day 5: South Korea market crash
  { day: 5, country: "South Korea", who: "KOSPI", type: "warning", text: "Circuit breaker triggered. Biggest crash since 2008 — down up to 12%.", gap: null },

  // Day 6: China export ban + Bangladesh rationing
  { day: 6, country: "China", who: "NDRC", type: "export_ban", text: "Orders PetroChina, Sinopec, CNOOC to halt all diesel, gasoline, jet fuel exports immediately.", gap: "Deepened Asia's fuel crisis while calling for 'stable supply'" },
  { day: 6, country: "Bangladesh", who: "BPC", type: "rationing", text: "Fuel rationing: motorcycles 2L/day, cars 10L, SUVs 20L, trucks 200L. \"To prevent hoarding.\"", gap: null },

  // Day 7: Thailand export ban
  { day: 7, country: "Thailand", who: "PM Anutin", type: "export_ban", text: "PM Order 2/2026: bans exports of gasoline, diesel, Jet A1, LPG. Exceptions only for Myanmar/Laos.", gap: null },

  // Day 9: Bangladesh escalation + France inspections
  { day: 9, country: "Bangladesh", who: "Government", type: "emergency", text: "All universities closed. Military takes charge of oil depots. 4 of 5 fertilizer factories halted. Power cuts doubled to 5hr/day.", gap: null },
  { day: 9, country: "France", who: "PM Lecornu", type: "price_controls", text: "Orders 500 fuel station inspections for abusive pricing. Diesel +16% in one week.", gap: null },

  // Day 10: Pakistan austerity
  { day: 10, country: "Pakistan", who: "PM Sharif", type: "rationing", text: "Televised address: 4-day workweek, 50% WFH, schools closed, weddings capped at 200 guests. Navy deploys Operation Muhafiz-ul-Bahr.", gap: "'Adequate supply' while shutting down half the economy" },

  // Day 11: Croatia
  { day: 11, country: "Croatia", who: "PM Plenković", type: "price_controls", text: "Fuel price caps: Eurosuper €1.50/L, diesel €1.55/L. €450M support package.", gap: null },

  // Day 12: UNSC
  { day: 12, country: "UN Security Council", who: "Resolution 2817", type: "diplomatic", text: "Condemns Iran's attacks on Gulf states. 13-0-2 (China, Russia abstain). 135 co-sponsors.", gap: null },

  // Day 14: TotalEnergies France caps
  { day: 14, country: "France", who: "TotalEnergies", type: "price_controls", text: "Caps prices at 3,300 French stations: petrol €1.99/L, diesel €2.09/L through March 31.", gap: null },

  // Day 15: Sri Lanka QR rationing
  { day: 15, country: "Sri Lanka", who: "Government", type: "rationing", text: "QR-based National Fuel Pass reactivated. Motorcycles 8L/wk, cars 25L/wk, buses 100L/wk.", gap: null },

  // Day 19: ECB + BASF
  { day: 19, country: "ECB", who: "Governing Council", type: "warning", text: "Holds rates at 2.0%. Inflation forecast raised to 2.6%. Gas futures surge 30% to €74/MWh on same day.", gap: null },
  { day: 19, country: "Germany", who: "BASF SE", type: "warning", text: "Price increases up to 30% across European product portfolio citing energy costs.", gap: null },

  // Day 20: IMF
  { day: 20, country: "IMF", who: "Julie Kozack", type: "warning", text: "Every 10% sustained oil rise = +0.4pp global inflation, -0.1-0.2% output. Fertilizer disruptions \"substantial\" food price risk.", gap: null },

  // Day 22: Trump ultimatum + Taiwan nuclear
  { day: 22, country: "USA", who: "President Trump", type: "political", text: "48-hour ultimatum to Iran: reopen Hormuz or face escalation. Posted 23:44 GMT on Truth Social.", gap: null },
  { day: 23, country: "Taiwan", who: "President Lai", type: "warning", text: "Announces restart of 2 nuclear plants — reversing DPP's \"nuclear-free\" policy. 70% of crude from Middle East.", gap: null },

  // Day 24: IEA Birol
  { day: 24, country: "IEA", who: "Dir. Fatih Birol", type: "warning", text: "\"Worse than the 1970s oil shocks combined.\" 11 mbpd lost vs 10 mbpd in '73 + '79 together. 40+ energy assets damaged.", gap: null },

  // Day 25: Lagarde
  { day: 25, country: "ECB", who: "Pres. Lagarde", type: "warning", text: "\"We will not be paralyzed by hesitation.\" Warns firms/workers may pass costs faster than 2022.", gap: null },

  // Day 26: OECD
  { day: 26, country: "OECD", who: "Interim Outlook", type: "warning", text: "Global inflation to 4.0% (+1.2pp). Eurozone growth slashed to 0.8%. US inflation 4.2%.", gap: null },

  // Day 27: Malaysia + Vietnam + Japan
  { day: 27, country: "Malaysia", who: "PM Anwar", type: "diplomatic", text: "Secures Hormuz passage from Iran. \"Countries whose impacts are far worse than ours.\" Non-aligned policy pays off.", gap: null },
  { day: 27, country: "Vietnam", who: "Vietnam Airlines", type: "warning", text: "Suspends 23 weekly domestic flights from April 1. VietJet cuts 18%. Jet fuel only guaranteed through March.", gap: null },
  { day: 28, country: "Japan", who: "METI", type: "warning", text: "Orders wholesalers to switch from Dubai to Brent pricing. Dubai at $170 vs Brent $110 — Japanese firms paying $140-200/bbl.", gap: null },

  // Day 29: Thailand Hormuz deal + US protests
  { day: 29, country: "Thailand", who: "PM Anutin", type: "diplomatic", text: "Secures Hormuz transit deal with Iran. Thailand added to \"friendly\" list alongside CN, RU, IN, PK.", gap: null },
  { day: 29, country: "USA", who: "\"No Kings Day\"", type: "political", text: "8-9M protesters in 3,300 events across 50 states — largest single-day protest in US history. Trump at 36% approval.", gap: null },

  // Day 4: Poland PM dismisses concerns
  { day: 4, country: "Poland", who: "PM Tusk", type: "reassurance", text: "Accuses opposition of \"destabilising\" country with \"false fuel shortage claims.\"", gap: "Diesel hit all-time record 3 weeks later" },

  // Day 27: Poland record diesel + VAT slash
  { day: 27, country: "Poland", who: "PM Tusk", type: "price_controls", text: "Diesel hits all-time record 8.69 PLN/L (€2.04). VAT slashed 23% → 8%, excise to EU minimum. Fuel panic reported.", gap: null },

  // ── Round 3: human impact, IRGC tollbooth, Africa/global reach ──

  // IRGC tollbooth — first time a nation imposes unilateral transit tolls on an international strait
  { day: 14, country: "Iran", who: "IRGC Navy", type: "emergency", text: "First ships transit via IRGC \"tollbooth\" — pre-approved route through Iranian waters north of Larak Island. AIS disabled.", gap: null },
  { day: 25, country: "Iran", who: "MP Boroujerdi", type: "political", text: "Confirms $2M/transit toll on IRIB: \"Collecting fees reflects Iran's strength.\" Payments accepted in Chinese yuan. Parliament drafting legislation.", gap: null },

  // Nepal migrant worker — humanizes the Gulf crisis
  { day: 8, country: "Nepal/Qatar", who: "Kuna Khuntia, 25", type: "emergency", text: "Pipe fitter from Odisha dies of heart attack in Doha during missile sounds. Father: \"He came back in a coffin.\" 21M South Asian migrants in Gulf.", gap: null },

  // Thailand fishing industry collapse
  { day: 27, country: "Thailand", who: "Samut Sakhon port", type: "rationing", text: "~40% of 9,000 fishing vessels docked; industry warns 50% imminent. \"Worse than COVID-19.\" \"After April 1, there may be no fish sold.\" $7B export industry at risk.", gap: null },

  // Kenya / global fertilizer — Africa representation
  { day: 28, country: "Kenya/Global", who: "PBS / farmers", type: "medical_warning", text: "\"The planting season is now. The fertilizer isn't there.\" Ethiopia imports 90%+ of nitrogen from Gulf. Kenya's 25M smallholders at risk.", gap: null },

  // Qatar helium — unexpected cascading effect
  { day: 19, country: "Qatar", who: "Helium production", type: "emergency", text: "Iran strikes helium facility. Qatar produces 1/3 of global supply. MRI machines worldwide at risk — helium needed for superconducting magnets.", gap: null },

  // Nepal bodies stranded — the human cost of closed airspace
  { day: 21, country: "Nepal", who: "Families", type: "emergency", text: "21+ bodies of migrant workers stranded in Gulf — flights cancelled, repatriation impossible. 1.7M Nepalis work in the Gulf; remittances = 25% of GDP.", gap: null },

  // Day 31: G7 finance + energy ministers call
  { day: 31, country: "G7", who: "Finance + Energy ministers", type: "diplomatic", text: "\"Stand ready to take all necessary measures.\" Call on all countries to refrain from \"unjustified export restrictions on hydrocarbons.\"", gap: "Targeting CN/TH/RU/IN export bans but offering no enforcement" },
  { day: 31, country: "UK", who: "Chancellor Reeves", type: "diplomatic", text: "Warns G7 against \"unilateral trade moves\" — \"act together, not in ways that shift pressure onto partners.\" Protectionism would \"drive up costs.\"", gap: null },

  // Day 31: Ethiopia + South Korea
  { day: 31, country: "Ethiopia", who: "Government", type: "rationing", text: "Diesel \"all but disappeared\" in Addis Ababa. Civil servants sent on mandatory leave. Fuel prioritized for security and essential industries.", gap: null },
  { day: 31, country: "South Korea", who: "Pres. Lee Jae-myung", type: "warning", text: "\"So serious I can't fall asleep.\" \"Worse than you think.\" Weighing first driving restrictions in 35 years (odd/even plates) if oil stays above $120.", gap: null },

  // ── Day 32 (Mar 31) events ──

  // Military: Iran's missile capacity degrading but cluster bombs now in play
  { day: 32, country: "Israel", who: "IDF / Iran", type: "emergency", text: "Iran cluster bomb warhead hits Bnei Brak/Ramat Gan. 8 injured, fires. Missile rate down to 10-15/day (from ~90 at start) — infrastructure \"severely strained.\"", gap: null },

  // Escalation: Pentagon ground ops + UNIFIL casualties
  { day: 32, country: "Lebanon", who: "UNIFIL", type: "emergency", text: "3 Indonesian peacekeepers killed in 2 separate explosions. France and Italy condemn \"grave crisis.\" 1,200+ killed in Lebanon this month incl. 124 children.", gap: null },
  { day: 32, country: "USA", who: "Pentagon", type: "military_fuel", text: "Preparing ground raids on Kharg Island + Hormuz coastal sites. 7,700 troops arriving: Marines (USS Tripoli), 82nd Airborne. Iran fortifying Kharg.", gap: null },

  // Trump April 6 deadline — major escalation risk
  { day: 32, country: "USA", who: "President Trump", type: "political", text: "Extends deadline to April 6 for strikes on all Iranian power plants, oil wells, Kharg Island, and desalination plants. Says he's \"pretty sure\" of a deal.", gap: null },

  // Diplomacy: Pakistan mediation
  { day: 32, country: "Pakistan", who: "FM talks", type: "diplomatic", text: "Turkey, Saudi, Egypt, Pakistan FMs in Islamabad preparing \"meaningful talks.\" Iran rejected US 15-point plan; demands reparations + Hormuz sovereignty.", gap: null },

  // Hormuz: Cosco transit — first major Chinese company ships through
  { day: 32, country: "China", who: "Cosco Shipping", type: "diplomatic", text: "2 ultra-large container ships (CSCL Indian Ocean + Arctic Ocean) transit Hormuz outbound — first major Beijing-backed company vessels since war started.", gap: null },

  // UK signal-action gap
  { day: 32, country: "UK", who: "Ed.Sec. Phillipson", type: "reassurance", text: "\"Fill up as normal.\" \"Supply chains remain stable.\" Diesel up 27% to 181p/L.", gap: "Reviewing Energy Act 1976 rationing powers (£30/visit cap)" },

  // QatarEnergy FM extension (not new — extends existing Day 3 declaration)
  { day: 32, country: "Qatar", who: "QatarEnergy", type: "warning", text: "Extends existing force majeure through mid-June (was through May). Ras Laffan damage est. $20B/yr lost revenue, up to 5 years to repair.", gap: null },

  // Gulf market wipeout
  { day: 32, country: "UAE", who: "Dubai/Abu Dhabi markets", type: "warning", text: "$120 billion wiped from Dubai and Abu Dhabi stock markets since Feb 28.", gap: null },

  // Humanitarian: medical supplies stuck globally
  { day: 32, country: "Global", who: "IRC / NPR", type: "medical_warning", text: "Medical goods stuck worldwide. Somalia: 668 boxes of therapeutic food stranded in India. Sudan: $130K of pharmaceuticals stuck in Dubai. Kenya clinics cutting services.", gap: null },

  // HRW child recruitment
  { day: 32, country: "Iran", who: "HRW", type: "emergency", text: "IRGC recruiting children as young as 12 as \"Homeland Defending Combatants.\" HRW calls it potential war crime.", gap: null },

  // Australia escalation
  { day: 32, country: "Australia", who: "Min. Bowen", type: "rationing", text: "Considering petrol rationing. Only 26 days diesel, 29 days petrol remain — well below IEA 90-day minimum. Stage 2 of 4-point fuel security plan.", gap: null },

  // Kenya rationing
  { day: 32, country: "Kenya", who: "Government", type: "rationing", text: "Active fuel rationing. Nairobi stations along Langata Road ran dry. North Rift region in worse shape. Negotiating with Nigeria's Dangote refinery.", gap: null },

  // Houthis — Red Sea threat
  { day: 32, country: "Yemen", who: "Houthi leadership", type: "warning", text: "\"Closing Bab al-Mandeb is among our options.\" Would threaten Saudi Yanbu bypass — the main buffer keeping Brent below $150.", gap: null },

  // ── Day 33 (Apr 1) events ──

  // Iran missile hits QatarEnergy tanker — escalation: Iran now targeting Qatar directly
  { day: 33, country: "Qatar", who: "Iran / QatarEnergy", type: "emergency", text: "Iranian cruise missile hits Aqua 1 tanker 31km north of Ras Laffan. Qatar intercepted 2 of 3 missiles. No casualties. Damage above waterline.", gap: null },

  // IRGC threatens 18 US tech companies — unprecedented expansion of war to corporate targets
  { day: 33, country: "Iran", who: "IRGC", type: "emergency", text: "Threatens Apple, Microsoft, Google, Meta, Tesla, Boeing, Nvidia, JP Morgan + 10 others. Deadline 8PM Tehran time. Employees told to evacuate within 1km of Gulf offices.", gap: null },

  // Trump "go get your own oil" + war could end in 2-3 weeks
  { day: 33, country: "USA", who: "President Trump", type: "political", text: "\"Go get your own oil.\" Tells UK and allies to secure Hormuz themselves. Says war could end in 2-3 weeks, no deal necessary. US gas hits $4/gal.", gap: null },

  // Hope rally — S&P surges on peace signals (contrast with underlying escalation)
  { day: 33, country: "USA", who: "S&P 500", type: "warning", text: "S&P 500 surges 2.91% to 6,528 — best day since May. VIX crashes to 25. Triggered by unconfirmed report Pezeshkian open to peace with guarantees.", gap: "Markets rallying while Iran hits Qatar tanker and IRGC threatens tech cos" },

  // Iran FM: no negotiations happening
  { day: 33, country: "Iran", who: "FM Araghchi", type: "diplomatic", text: "\"No negotiations are going on with Washington.\" Iran prepared for \"at least six months\" of war. Rejects US 15-point plan.", gap: null },

  // China-Pakistan peace proposal
  { day: 33, country: "China/Pakistan", who: "Joint proposal", type: "diplomatic", text: "New initiative: immediate ceasefire + reopening Hormuz + safe passage for civilian ships. Presented to both sides.", gap: null },

  // Gold divergence — smart money signal
  { day: 33, country: "Global", who: "Gold market", type: "warning", text: "Gold rises to ~$4,700 even on risk-on day when equities surge. Bond market and gold not buying the peace narrative.", gap: null },

  // Russia gasoline export ban takes effect
  { day: 33, country: "Russia", who: "Government", type: "export_ban", text: "Gasoline export ban now in effect (Apr 1 – Jul 31). Tightens European product market further. Austria Fuel Price Brake also takes effect today.", gap: null },

  // Three national addresses in one day — unprecedented

  // Albanese COVID-style national address — signal-action gap
  { day: 33, country: "Australia", who: "PM Albanese", type: "reassurance", text: "Rare national address: \"Go about your business and your life, as normal. Enjoy your Easter.\" Halved fuel excise (26.3c/L). Asked public to use transit to save fuel.", gap: "400+ stations dry (247 NSW, 82 VIC, 77 QLD). Stage 2 of 4-point emergency." },

  // Starmer address — "not our war" but convenes 35-nation coalition + military planners
  { day: 33, country: "UK", who: "PM Starmer", type: "diplomatic", text: "National address: \"Impact of this war will affect the future of our country.\" Convenes 35-nation coalition via Cooper. Military planners tasked with Hormuz options. \"I have to level with people — this will not be easy.\"", gap: "Says 'not our war' in same speech as ordering military planners to draw up Hormuz options" },

  // Trump primetime address scheduled — 9pm ET
  { day: 33, country: "USA", who: "President Trump", type: "political", text: "Primetime address to nation at 9pm ET — \"important update on Iran.\" Earlier: \"When we feel they're put into the stone ages, we'll leave. Whether we have a deal or not.\"", gap: null },

  // Kuwait airport drone strike — Iran expanding attacks on Gulf civilian infrastructure
  { day: 33, country: "Kuwait", who: "Iran / KAFCO", type: "emergency", text: "Iranian drones hit fuel storage tanks at Kuwait International Airport. Large fire at KAFCO depot. No casualties. Part of escalating strikes on Gulf civilian infrastructure.", gap: null },

  // ── Day 33 additions (Apr 1, research round 4) ──

  // Iran's largest missile salvo on Israel — Passover eve, cluster warheads
  { day: 33, country: "Israel", who: "Iran → IDF", type: "emergency", text: "Iran's largest salvo of war: ~10 BMs at central Israel on Passover eve. Cluster warhead hits Bnei Brak/Rosh HaAyin. 15 wounded incl. 11-year-old girl (critical). 6,239+ total wounded since Feb 28.", gap: null },

  // Hezbollah rockets into central Israel during Passover seders
  { day: 33, country: "Israel/Lebanon", who: "Hezbollah", type: "emergency", text: "2 rockets from Lebanon into central Israel during Passover seders. No injuries. Israel kills Hezbollah southern front commander Haj Youssef in Beirut strike (7 dead).", gap: null },

  // UAE cumulative interceptions — most attacked non-combatant
  { day: 33, country: "UAE", who: "Air defense", type: "emergency", text: "Intercepted 5 BMs + 35 drones today. Cumulative since Feb 28: 433 ballistic missiles, 1,977 drones, 19 cruise missiles. Fuel prices up 30% for April.", gap: null },

  // UAE preparing to join war — first Gulf state
  { day: 33, country: "UAE", who: "Government", type: "military_fuel", text: "Poised to be first Gulf state to directly join US operations. Lobbying UN Security Council for Hormuz reopening by force. Floating US seizure of Abu Musa island. Froze Iranian-linked institutions in Dubai.", gap: null },

  // US/Israel strikes on Iranian steel + infrastructure
  { day: 33, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Isfahan Mobarakeh Steel hit 2nd time. Sefid Dasht Steel struck. Qeshm Island desalination plant destroyed. Explosions in Ahvaz, Shiraz, Karaj, Kermanshah, Bandar Abbas. Drug factory hit (fentanyl/CW claim).", gap: null },

  // Trump NATO withdrawal threat
  { day: 33, country: "USA", who: "President Trump", type: "diplomatic", text: "\"Strongly considering\" pulling US from NATO — calls it \"paper tiger\" after allies refused to join war. Threatens to stop Ukraine aid unless Europe joins Hormuz coalition.", gap: null },

  // Pakistan indirect talks — 15 US points, 5 Iran conditions
  { day: 33, country: "Pakistan", who: "FM mediation", type: "diplomatic", text: "Facilitating indirect US-Iran talks. 15-point US proposal being deliberated. Iran countered with 5 conditions: war reparations, Hormuz sovereignty. No direct negotiations.", gap: null },

  // Iran ceasefire denial — contradicts Trump
  { day: 33, country: "Iran", who: "Pres. Pezeshkian", type: "diplomatic", text: "Open letter to Americans: questions whether Washington is truly 'America First' or 'proxy for Israel.' Iran denies requesting ceasefire (contradicting Trump's Truth Social claim).", gap: null },

  // UK last jet fuel tanker — Maetiga
  { day: 33, country: "UK", who: "Fuel supply", type: "warning", text: "Tanker Maetiga (Libyan-flagged, Saudi-loaded) arriving ~Apr 3 — last known UK-bound ME jet fuel cargo. No other cargoes visible. Two ships departed New York → England (unprecedented reroute).", gap: null },

  // UK Peter Kyle signal-action gap
  { day: 33, country: "UK", who: "Bus.Sec. Peter Kyle", type: "reassurance", text: "\"We have no fuel supply chain issues at this moment at all.\" Airlines UK: \"not seeing disruption.\"", gap: "Last jet fuel tanker arriving Apr 3. Argus: 'most exposed in Europe.' Industry warns 'weeks from rationing.'" },

  // Romania emergency ordinance takes effect
  { day: 33, country: "Romania", who: "PM Bolojan", type: "price_controls", text: "Emergency ordinance effective today (Apr 1 – Jun 30): commercial margin caps, diesel/crude exports require ministry approval, biofuel content reduced 8%→2%. Diesel 9.99 RON/L.", gap: null },

  // Romania refinery crisis
  { day: 33, country: "Romania", who: "Energy sector", type: "warning", text: "3 of 4 refineries offline or just restarting. Petromidia (46% capacity) restarting after March overhaul. Petrotel-Lukoil (21%) shut by US sanctions. Only Petrobrazi running = 35% of national demand.", gap: null },

  // Romania signal-action gap
  { day: 33, country: "Romania", who: "Min. Bogdan Ivan", type: "reassurance", text: "\"Rationing is not being considered. Romania has sufficient reserves.\" Reserves secured only through June.", gap: "3 of 4 refineries offline. Structural diesel deficit. Pump protests. Fuel tourism to Bulgaria." },

  // Brent briefly below $100
  { day: 33, country: "Global", who: "Oil markets", type: "warning", text: "Brent plunged to $98.52 intraday — first time below $100 in a week. War premium deflated on Trump exit talk. But Dubai physical at $128 — $26 spread = paper vs physical disconnect.", gap: null },

  // Houthis — Bloomberg $140 warning
  { day: 33, country: "Yemen", who: "Houthis / Bloomberg", type: "warning", text: "Second missile at Eilat (intercepted). Al-Bukhaiti: considering naval blockade, will target 'aggressor country' vessels. Bloomberg Economics: Houthi Red Sea attacks could drive oil to $140/bbl.", gap: null },

  // UK Starmer — COBRA + Hormuz conference
  { day: 33, country: "UK", who: "PM Starmer", type: "diplomatic", text: "Chaired emergency COBRA meeting. Diesel hit 182.77p/L — £100 for a 55L fill (first time since Dec 2022). UK drivers paying £544M extra since war began. Hosting 35-nation Hormuz conference this week.", gap: null },

  // Casualty summary — Day 33
  { day: 33, country: "Global", who: "Cumulative", type: "emergency", text: "Iran ~1,900+ killed. Israel 24 killed / 6,239 wounded. Lebanon 1,318 killed (124 children). Iraq 106. US military 13. Gulf states 27. Hormuz transits: 6/day (down from 138).", gap: null },

  // ── Day 34 (Apr 2) events ──

  // Trump primetime address — "stone ages"
  { day: 34, country: "USA", who: "President Trump", type: "political", text: "Primetime address: \"We're going to bring them back to the stone ages.\" Threatens to hit every Iranian power plant simultaneously. Claims war \"nearing completion\" in 2-3 weeks. No deal terms. No exit plan.", gap: "Claims 'nearing completion' while threatening to destroy all civilian power infrastructure" },

  // Trump victory claims vs reality
  { day: 34, country: "USA", who: "President Trump", type: "political", text: "Claims Iran's navy \"destroyed,\" air force \"in ruins,\" IRGC \"decimated.\" Says regime change occurred. 13 US servicemembers killed acknowledged. Told allies to \"get your own oil.\"", gap: "Iran fired missiles at Israel, Dubai, and Bahrain during and immediately after the speech" },

  // Iran fires missiles during/after speech
  { day: 34, country: "Iran", who: "IRGC", type: "emergency", text: "Explosions in Dubai just before speech. Missiles at Israel within 30 min of speech ending. Sirens in Bahrain (US 5th Fleet HQ). Iran: \"Absolutely determined to continue defense... no choice but to fight back fiercely.\"", gap: null },

  // Market reaction — hope rally completely reversed
  { day: 34, country: "Global", who: "Markets", type: "warning", text: "Brent surges 7.4% to $108.62. WTI +6.9% to $107.05. Nikkei -2%, KOSPI -4%, Hang Seng -1%, US futures -1%+. Markets expected ceasefire or escalation — got escalation.", gap: null },

  // $200 oil warnings
  { day: 34, country: "Global", who: "Macquarie / analysts", type: "warning", text: "Macquarie: $200/bbl if war lasts to June (40% probability). Saudi energy leaders: $180 if conflict persists past late April. Bloomberg Economics: $140 from Houthi attacks alone. Inflation-adjusted ATH: ~$211.", gap: null },

  // Trump NATO threat formalized
  { day: 34, country: "USA", who: "Sec. Rubio", type: "diplomatic", text: "Rubio: US will \"re-examine\" relationship with NATO after allies refused to join war. Starmer defends NATO as \"most effective military alliance ever.\" Spain bars US aircraft from its airspace/bases.", gap: null },

  // Spain bars US aircraft — NATO fracturing
  { day: 34, country: "Spain", who: "Government", type: "diplomatic", text: "Bars US aircraft involved in Iran war from Spanish airspace and bases (except humanitarian). First NATO ally to formally restrict US military operations over its territory.", gap: null },

  // April 6 deadline confirmed — 4 days away
  { day: 34, country: "USA", who: "White House", type: "warning", text: "April 6 deadline (8PM ET) for strikes on Iran's entire power grid confirmed. Trump in speech: \"If there is no deal, we are going to hit each and every one of their electric generating plants.\"", gap: null },

  // ── Day 35 (Apr 3) events ──

  // Hormuz: first Western European vessel exits — symbolic breakthrough
  { day: 35, country: "Global shipping", who: "Bloomberg", type: "diplomatic", text: "French-owned container ship exits Strait of Hormuz — first Western European vessel since war began. Philippines added to Iran's selective passage list. Transits up to ~12/day (from 6).", gap: null },

  // US base evacuations — war entering new phase
  { day: 35, country: "USA", who: "Pentagon / NPR", type: "emergency", text: "US troops and families being evacuated from Middle East bases after sustained Iranian strikes on Al Udeid (Qatar), Ali Al Salem (Kuwait), Al Dhafra (UAE), and Fifth Fleet HQ (Bahrain).", gap: null },

  // EU sanctions extension
  { day: 35, country: "EU", who: "Council", type: "diplomatic", text: "EU extends Iran sanctions through April 2027, targeting 262 individuals and 53 entities. Trump imposes 25% tariffs on countries continuing to trade with Iran.", gap: null },

  // Maetiga arrives UK — last jet fuel lifeline
  { day: 35, country: "UK", who: "Fuel supply", type: "warning", text: "Tanker Maetiga arrives UK — last known Middle East jet fuel cargo. No replacement cargoes visible on AIS. Two emergency shipments from New York en route. UK weeks from jet fuel rationing.", gap: null },

  // April 6 countdown — 3 days
  { day: 35, country: "USA", who: "White House", type: "warning", text: "3 days until April 6 power grid strike deadline. No ceasefire channel visible. Iran FM: \"No negotiations with Washington.\" Pakistan mediation stalled after Iran rejected 15-point plan.", gap: null },

  // Cyber warfare escalation
  { day: 35, country: "Global", who: "Unit 42 / Palo Alto", type: "warning", text: "~5,800 cyberattacks tracked from ~50 Iran-linked groups since Feb 28. Targets: Israeli energy, Jordanian fuel systems, healthcare. Iran under 27+ day near-complete internet blackout.", gap: null },

  // 20,000 seafarers stranded
  { day: 35, country: "Global shipping", who: "IMO / UANI", type: "emergency", text: "Over 20,000 seafarers stranded in Gulf region. Hormuz traffic collapsed 90-95% (138 → 12 daily transits). IEA: \"largest supply disruption in the history of the global oil market.\"", gap: null },

  // Russia intelligence support — covert escalation
  { day: 35, country: "Russia", who: "Intelligence", type: "diplomatic", text: "Russia covertly providing satellite intelligence on US troop movements to Iran (CNN). Stands to gain $151B in additional oil revenue from crisis. Gasoline export ban in effect since Apr 1.", gap: null },

  // Humanitarian: 3.2M displaced, 45M at hunger risk
  { day: 35, country: "Iran/Global", who: "UN agencies", type: "medical_warning", text: "3.2M Iranians displaced. UN warns 45M across Middle East face acute hunger. WFP shipping costs up 18%. Medical supplies stranded globally — Somalia, Sudan, Kenya affected.", gap: null },

  // Oil market summary
  { day: 35, country: "Global", who: "Markets", type: "warning", text: "Brent ~$110, Dubai physical ~$138. Brent's 55% March surge = largest monthly gain since 1988. Goldman: $110 April avg. SocGen: $150 if disruptions persist. Macquarie: $200 if war lasts to June.", gap: null },

  // ── Day 36 (Apr 4) events ──
  // Sources: CNN, Al Jazeera, NPR, CNBC, Bloomberg, Washington Times, Irish Times, Tom's Hardware

  // Trump 48-hour ultimatum — deadline now April 6
  { day: 36, country: "USA", who: "President Trump", type: "political", text: "Truth Social: \"48 hours before all Hell will reign down on them.\" Threatens to strike every Iranian power plant, oil well, and desalination facility if Hormuz not reopened by April 6 8PM ET.", gap: "Offers 'deal' while simultaneously preparing strikes on civilian infrastructure" },

  // Bushehr nuclear plant strike — near-miss on nuclear facility
  { day: 36, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Auxiliary building at Bushehr Nuclear Power Plant struck — 1 security staff killed. Rosatom evacuating ~200 Russian staff. IAEA: no radiation increase. Iran FM Araghchi warns fallout could \"end life in GCC capitals.\"", gap: null },

  // Mahshahr petrochemical zone struck — widening industrial targeting
  { day: 36, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Mahshahr Special Petrochemical Zone hit. Growing range of Iranian industries targeted: steel plants, cement factories, petrochemical complexes. War entering 6th week.", gap: null },

  // F-15 search continues — US losses mounting
  { day: 36, country: "USA", who: "US military", type: "emergency", text: "Search continues for WSO from F-15E Strike Eagle downed Apr 3 over Kohgiluyeh province. Pilot rescued. A-10 Warthog also downed near Strait (pilot rescued). 2 Black Hawks hit by small arms fire during SAR.", gap: null },

  // Iran's new air defense claim — contradicts US claims
  { day: 36, country: "Iran", who: "Military officials", type: "military_fuel", text: "Iran claims \"new advanced defence system\" downed F-15 and A-10 — contradicts earlier US assertions that Iranian air defenses had been destroyed.", gap: null },

  // IRGC ship attack — Hormuz still contested
  { day: 36, country: "Iran", who: "IRGC Navy", type: "emergency", text: "IRGC claims drone attack on container ship MSC Ishyka (Liberia-flagged, allegedly Israel-linked) in Strait of Hormuz. Attack not independently verified.", gap: null },

  // Oracle Dubai drone debris — tech companies as targets
  { day: 36, country: "UAE", who: "Iran / IRGC", type: "emergency", text: "Intercepted drone debris hits Oracle office building facade in Dubai. No injuries. IRGC retaliation for strike that injured ex-FM Kharazi and killed his wife. UAE rejects Iran's claims of direct hit.", gap: null },

  // Regional strikes — Bahrain, Kuwait hit again
  { day: 36, country: "Kuwait", who: "Iran strikes", type: "emergency", text: "Oil refinery and desalination plant hit by missile and drone strikes. Ongoing pattern of Gulf civilian infrastructure targeting.", gap: null },
  { day: 36, country: "Israel", who: "Iran", type: "emergency", text: "Iranian missile strike sparks fire at Negev industrial site. Bahrain: 4 injured in Sitra from intercepted drone shrapnel. Abu Dhabi: 1 Egyptian worker killed at gas facility from debris.", gap: null },

  // Iran rejects ceasefire — diplomacy stalled
  { day: 36, country: "Iran", who: "Fars News / Pezeshkian", type: "diplomatic", text: "Iran rejects US 48-hour ceasefire proposal (unconfirmed by US). Pezeshkian: Trump's 'stone age' threat is admission of intent to commit \"massive war crime.\" No negotiations channel visible.", gap: null },

  // Pakistan free public transit — managing crisis
  { day: 36, country: "Pakistan", who: "Government", type: "price_controls", text: "Announces free public transit nationwide for one month to reduce fuel consumption. Schools still closed. 4-day workweek continues.", gap: null },

  // Hormuz weekly high — glimmer of trade resuming
  { day: 36, country: "Global shipping", who: "Bloomberg", type: "diplomatic", text: "13 ships transit Hormuz — weekly rolling average reaches highest since war began (Bloomberg). LPG carriers + Saudi/UAE crude tankers. Still 90%+ below pre-war 138/day.", gap: null },

  // Casualty and cost summary
  { day: 36, country: "Global", who: "Al Jazeera / UN", type: "emergency", text: "Iran: 2,076 killed, 26,500 wounded. UN Food Price Index +2.4% in March. Israel's multi-front war cost: est. $112B. 78% of Jewish Israelis still support war. Australia faces Easter petrol shortages.", gap: null },

  // ── Day 37 (Apr 5) events ──
  // Sources: Al Jazeera, CBS News, CNN, NPR, PBS, The National, Washington Examiner

  // WSO rescued — CIA commando raid inside Iran
  { day: 37, country: "USA", who: "President Trump", type: "political", text: "\"WE GOT HIM!\" — F-15E WSO rescued by CIA-led commando raid inside Iran. Dozens of special forces, several dozen warplanes/helicopters. 2 transport planes demolished to prevent capture. Extraction to Kuwait.", gap: null },

  // Iran rejects Trump ultimatum — "gates of hell"
  { day: 37, country: "Iran", who: "Gen. Abdollahi", type: "emergency", text: "Rejects Trump's 48hr ultimatum as \"helpless, nervous, unbalanced and stupid.\" Warns: \"The gates of hell will be opened upon you\" if infrastructure attacks continue. April 6 deadline now <24hrs away.", gap: null },

  // Kuwait — KPC HQ, Ministries Complex, power/desalination plants hit
  { day: 37, country: "Kuwait", who: "Iran / drones", type: "emergency", text: "Iranian drones hit Kuwait Petroleum Corp HQ (Shuwaikh complex, fire + evacuation), Ministries Complex (significant damage), 2 power/desalination plants (2 power units knocked out). Emergency plans activated.", gap: null },

  // UAE — massive interception day
  { day: 37, country: "UAE", who: "Air defense", type: "emergency", text: "UAE air defenses engaged 23 ballistic missiles and 56 drones in preceding 24 hours. Bahrain reports 8 drone attacks. Sustained barrage continues across Gulf states.", gap: null },

  // Mahshahr casualties confirmed
  { day: 37, country: "Iran", who: "Health Ministry", type: "emergency", text: "Mahshahr Petrochemical Zone attacks: 5 killed, 170 wounded confirmed. 30+ universities struck since war began, including Laser/Plasma Research Institute at Shahid Beheshti University.", gap: null },

  // US gas at $4.10 — confirmed CBS
  { day: 37, country: "USA", who: "CBS / AAA", type: "warning", text: "US gas national average $4.10/gallon — up 37% since Feb 28. 365 US service members wounded, 13 killed. Easter weekend travel disrupted by fuel costs and availability.", gap: null },

  // Pakistan free public transit
  { day: 37, country: "Pakistan", who: "Government", type: "price_controls", text: "Free public transit continues nationwide. Schools remain closed. 4-day workweek in effect. Managing fuel consumption through demand destruction rather than rationing.", gap: null },

  // April 6 deadline — final countdown
  { day: 37, country: "USA", who: "White House", type: "warning", text: "April 6 deadline (8PM ET) now <24 hours away. No ceasefire channel. Iran rejected 48hr ceasefire proposal. Trump: power grid strikes if Hormuz not reopened. Markets closed — volatility deferred to Monday.", gap: null },

  // ── Day 38 (Apr 6) events ──
  // Sources: Axios, CNBC, CNN, Al Jazeera, Fortune, FinancialContent, CFR, Time

  // Pakistan-brokered ceasefire proposal — 45-day ceasefire
  { day: 38, country: "Pakistan", who: "Army chief / FM", type: "diplomatic", text: "Pakistan army chief in contact \"all night\" with VP Vance, envoy Witkoff, and Iran FM Araghchi brokering 45-day ceasefire. Most significant mediation effort since war began.", gap: null },

  // Iran rejects ceasefire, sends 10-point counter-proposal
  { day: 38, country: "Iran", who: "Government", type: "diplomatic", text: "Rejects Pakistan-brokered 45-day ceasefire — says it would allow adversaries to regroup. Sends 10-point counter-proposal: safe passage protocol for Hormuz, reconstruction fund, sanctions lifting.", gap: null },

  // Trump shifts deadline to Tuesday — "Power Plant Day, and Bridge Day"
  { day: 38, country: "USA", who: "President Trump", type: "political", text: "Calls Pakistan proposal \"significant\" but \"not good enough.\" Sets new deadline: 8PM ET Tuesday April 7 for Iran to reopen Strait. Truth Social: \"Tuesday will be Power Plant Day, and Bridge Day.\"", gap: "Calls ceasefire proposal 'significant' while simultaneously threatening to destroy civilian power plants and bridges" },

  // Iran adds Iraq to Hormuz exemption list
  { day: 38, country: "Iran", who: "IRGC Navy", type: "diplomatic", text: "Iraq added to Hormuz selective passage exemption list. 7 nations now exempt: China, Russia, India, Pakistan, Malaysia, Thailand, Iraq. Turkish vessel Ocean Thunder also transits.", gap: null },

  // India signal-action gap — FM Sitharaman
  { day: 38, country: "India", who: "FM Sitharaman", type: "reassurance", text: "\"No lockdown, no fuel shortage\" — dismisses rumors as \"irresponsible and harmful.\" Urges public to \"remain calm.\"", gap: "Police deployed at fuel stations. Saudi cut India's April crude to 23M bbl (from 25-28M). Nationwide protests resuming." },

  // South Korea — "save every drop"
  { day: 38, country: "South Korea", who: "Pres. Lee Jae-myung", type: "warning", text: "Urges citizens to \"save every drop of fuel.\" Imposes fuel price cap + fuel tax cut. Delays coal plant shutdowns to preserve energy supply.", gap: null },

  // Philippines transport strike
  { day: 38, country: "Philippines", who: "Transport workers", type: "emergency", text: "Thousands of transport workers strike over diesel prices under declared energy emergency. DOE Sec. Garin: \"There is no crisis in terms of supply\" — while country under energy emergency.", gap: "'No crisis in terms of supply' while country is under a declared national energy emergency" },

  // Sri Lanka tightens rationing
  { day: 38, country: "Sri Lanka", who: "Government", type: "rationing", text: "Fuel rationing tightened: private motorists 15 litres/week, motorcyclists 5 litres. 4-day workweek continues. One of Asia's most restrictive fuel regimes.", gap: null },

  // Myanmar QR fuel rationing
  { day: 38, country: "Global", who: "Myanmar govt", type: "rationing", text: "Myanmar introduces alternate-day driving rule with QR code-monitored fuel rationing. Indonesia caps fuel at 50L/car/day, sends civil servants to WFH. Nepal only half-filling gas cylinders.", gap: null },

  // VIX retreats — Muscat Protocol
  { day: 38, country: "Global", who: "Markets", type: "warning", text: "VIX retreats to 24.54 — lowest since mid-March. \"Muscat Protocol\" (Oman-brokered Green Channel) reduces volatility premium. Brent $111.25. Markets pricing in war as baseline, not shock.", gap: null },

  // Iran internet blackout — 38 consecutive days
  { day: 38, country: "Iran", who: "NetBlocks", type: "emergency", text: "Iran's internet blackout reaches 38th consecutive day. Heavy water facility rendered inoperable. At least 2,076 killed since Feb 28 (Iranian Health Ministry). 30+ universities struck.", gap: null },

  // Saudi Arabia slashes April exports
  { day: 38, country: "Saudi Arabia", who: "Saudi Aramco", type: "warning", text: "Slashed April crude exports to fight domestic shortages. India allocation cut to 23M bbl (from 25-28M normal). Prioritizing domestic consumption and Yanbu bypass pipeline at full capacity.", gap: null },

  // ── Day 39 (Apr 7) events ──
  // Sources: CNN, Al Jazeera, NPR, NBC, Axios, WaPo, SCMP, Military.com, Time, Tom's Hardware

  // Trump — "A whole civilization will die tonight"
  { day: 39, country: "USA", who: "President Trump", type: "political", text: "\"A whole civilization will die tonight... I don't want that to happen, but it probably will.\" Called it \"one of the most important moments in the history of the world.\" 8PM ET Tuesday deadline for Iran to reopen Hormuz or face strikes on all power plants and bridges.", gap: "Called Iran's counter-proposal 'significant' while threatening to destroy an entire civilization's infrastructure in the same breath" },

  // Trump — "Open the F--kin' Strait" Easter post
  { day: 39, country: "USA", who: "President Trump", type: "political", text: "Easter Truth Social: \"Open the F--kin' Strait, you crazy b-stards, or you'll be living in Hell.\" Also: \"Every bridge in Iran will be decimated by 12 o'clock tomorrow night, and every power plant in Iran will be out of business.\"", gap: null },

  // 25th Amendment calls
  { day: 39, country: "USA", who: "Congress / Scaramucci", type: "political", text: "Rep. Ansari: \"The President is a deranged lunatic and a national security threat.\" Sen. Chris Murphy and ex-ally Scaramucci call for 25th Amendment. Removal unlikely — Republicans control Congress and Cabinet.", gap: null },

  // Iran human chain at power plants — civilians as shields
  { day: 39, country: "Iran", who: "Deputy Min. Rahimi", type: "emergency", text: "\"Iranian Youth's Human Chain for a Bright Tomorrow\" — civilians invited to gather beside power plants nationwide at 14:00 Tuesday. Message: \"Attacking public infrastructure is a war crime.\" Direct response to Trump's power plant threat.", gap: "Regime organizing civilians as human shields at military targets while claiming grassroots youth initiative" },

  // Pezeshkian — 14 million volunteers
  { day: 39, country: "Iran", who: "Pres. Pezeshkian", type: "political", text: "Claims on X that 14 million Iranians — including himself — have volunteered to sacrifice their lives. Double the 7M previously cited. Widely seen as propaganda aimed at deterring US strikes.", gap: null },

  // IRGC intelligence chief killed — No. 2 in IRGC
  { day: 39, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "IRGC intelligence chief Maj. Gen. Majid Khademi killed in dawn strike — effectively No. 2 in IRGC. Quds Force special ops commander Asghar Bagheri also killed. Major decapitation strike.", gap: null },

  // Kharg Island struck again — military targets
  { day: 39, country: "Iran", who: "US military", type: "emergency", text: "Kharg Island struck overnight — dozens of military targets. US official: strikes \"did not involve oil assets\" but hit bunkers, storage, air defense. Oil spiked 3% on reports. CENTCOM: 13,000+ targets struck since Feb 28.", gap: null },

  // IDF train warning — unprecedented
  { day: 39, country: "Iran", who: "IDF", type: "warning", text: "IDF posts on X: \"For the sake of your security, refrain from using and travelling by train throughout Iran\" until 21:00 Iran time. Train service to/from Mashhad suspended. Railway bridge near Kashan struck (2 killed).", gap: null },

  // Yellowcake + AI/GPU facilities destroyed
  { day: 39, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Yellowcake production facility at Ardakan, Yazd struck — IDF: \"only one of its kind.\" Sharif University GPU/AI computing center destroyed. Three Tehran airports hit. Karaj power infrastructure plunged city into darkness.", gap: null },

  // Alborz airstrike — civilian casualties
  { day: 39, country: "Iran", who: "US/Israel strikes", type: "emergency", text: "Alborz province airstrike kills 18 including 2 children, wounds 24. Residential areas hit. Casualty totals: Hengaw reports 7,300+ killed (890 civilians); HRANA reports 3,540 (1,616 civilians, 244 children).", gap: null },

  // IRGC Operation True Promise 4 — missiles at Israel
  { day: 39, country: "Iran", who: "IRGC", type: "emergency", text: "Wave 98 / Operation True Promise 4: ballistic missiles strike northern and southern Tel Aviv, Haifa, Beersheba. Haifa residential building hit — 4 killed. Israeli container ship SDN7 hit with cruise missile.", gap: null },

  // Ali al-Salem, Kuwait — 15 Americans wounded
  { day: 39, country: "Kuwait", who: "Iran / IRGC", type: "emergency", text: "Iranian drone strike on Ali al-Salem air base in Kuwait — 15 Americans wounded. USS Tripoli (LHA-7, 5,000+ aboard) reportedly forced to withdraw. Continued targeting of US military in Gulf.", gap: null },

  // IRGC threatens Stargate AI data center
  { day: 39, country: "UAE", who: "IRGC", type: "emergency", text: "IRGC threatens \"complete and utter annihilation\" of OpenAI's $30B Stargate AI data center in Abu Dhabi. Posts satellite imagery. Follows March 1 AWS data center strikes in UAE/Bahrain.", gap: null },

  // King Fahd Causeway closed
  { day: 39, country: "Saudi Arabia", who: "Government", type: "emergency", text: "King Fahd Causeway (only land link to Bahrain) closed indefinitely due to Iranian air raid threats. Saudi intercepted 18 drones and up to 7 ballistic missiles. Bahrain effectively isolated.", gap: null },

  // Istanbul consulate attack
  { day: 39, country: "Global", who: "Gunmen / ISIS-linked", type: "emergency", text: "3 gunmen opened fire near Israel's (unstaffed) consulate in Istanbul. 1 attacker killed, 2 captured. Suspected ISIS-linked. War spilling into NATO territory.", gap: null },

  // Lebanon — Israel expands beyond Litani
  { day: 39, country: "Lebanon", who: "IDF", type: "emergency", text: "Israel expanding ground invasion beyond Litani River into Christian suburbs (Ain Saadeh). 1,461 killed, 4,430 wounded, 1.1M displaced since war started.", gap: null },

  // US gas $4.14 — up 39% since war
  { day: 39, country: "USA", who: "AAA", type: "warning", text: "US gas national average $4.14/gallon — up 39% since Feb 28. Thailand diesel +69% (29.94→50.54 THB/L). EU energy commissioner admits rationing \"being considered.\"", gap: null },

  // ── Day 40 (Apr 8) events ──
  // Sources: CNN, NBC, CNBC, Bloomberg, Al Jazeera, Fortune, NPR, Axios, Wikipedia

  // Pakistan-brokered ceasefire — ~90 min before deadline
  { day: 40, country: "USA/Iran", who: "Trump / Pezeshkian", type: "diplomatic", text: "Two-week ceasefire announced ~6:32PM ET — roughly 90 minutes before Trump's 8PM ET \"civilization will die\" deadline. Pakistan-brokered. Contingent on Iran reopening Hormuz. US delegation (Vance, Witkoff, Kushner) and Iran delegation (Qalibaf, Araqchi) to meet in Islamabad Saturday Apr 11.", gap: null },

  // Iran Deputy FM — ships need army consent
  { day: 40, country: "Iran", who: "Deputy FM Khatibzadeh", type: "diplomatic", text: "\"The strait is open, but each tanker should make arrangements with Iranian authorities.\" Ships must \"coordinate with Iranian Armed Forces.\" De facto permission regime — not open passage. Contradicts White House demand for Hormuz reopening \"without limitation, including tolls.\"", gap: "'Hormuz is open' while imposing army-consent permission regime and briefly halting all traffic" },

  // Israel's Operation Eternal Darkness — largest Lebanon strike of war
  { day: 40, country: "Lebanon", who: "IDF", type: "emergency", text: "\"Operation Eternal Darkness\": 50 fighter jets drop 160 bombs on 100 targets in Lebanon in 10 minutes. 254 killed, 1,165 wounded (Lebanese Civil Defence) — largest single strike of Lebanon war. Targets: Hezbollah HQ, Radwan Force, missile infra, intel centers.", gap: null },

  // Netanyahu — ceasefire applies to Iran, not Lebanon
  { day: 40, country: "Israel", who: "PM Netanyahu", type: "political", text: "\"The Iran ceasefire is not the end of war. All goals will be achieved.\" Denies Lebanon covered by US-brokered deal. Supports Trump's Iran decision in same breath as launching largest Lebanon strike of war.", gap: "'Supports Trump's ceasefire' while simultaneously ordering Operation Eternal Darkness within hours" },

  // IRGC halts all Hormuz traffic after Lebanon strikes
  { day: 40, country: "Iran", who: "IRGC Navy", type: "emergency", text: "Briefly halts ALL ship traffic in Strait of Hormuz after Israel strikes Lebanon — effectively re-closing the strait hours into the ceasefire. Iranian state media confirmed closure. NBC: Hormuz \"effectively at a standstill.\"", gap: null },

  // Iranian missiles continue after ceasefire — decentralized command?
  { day: 40, country: "Gulf states", who: "Iran / IRGC", type: "emergency", text: "Iranian missiles and drones launched at Israel (3 children lightly injured in Negev) and at UAE, Saudi, Kuwait, Bahrain, Qatar within hours of ceasefire. Air defenses activated across Gulf. Either decentralized IRGC command or deliberate timing.", gap: null },

  // 2,000 ships stranded in Persian Gulf
  { day: 40, country: "Global shipping", who: "IMO", type: "emergency", text: "Estimated ~2,000 ships (tankers + LNG + containers) stranded in Persian Gulf. War risk insurance still canceled by Gard/Skuld/NorthStandard — ceasefire has not restored coverage. Bloomberg: 3 ships total left region today.", gap: null },

  // Brent collapse — biggest drop of war
  { day: 40, country: "Global", who: "Markets", type: "warning", text: "Brent plunges 11.93% to ~$96.24 settlement — steepest single-day drop of war. Intraday low ~$93.76. VIX collapses to 20.18 (lowest since Feb 27, pre-war). BUT Dated Brent physical at $124.68 — massive paper-vs-physical divergence.", gap: null },

  // Gold surges despite relief rally
  { day: 40, country: "Global", who: "Gold market", type: "warning", text: "Gold SURGES to ~$4,802 (+$127 d/d) despite equity relief rally. Safe-haven bid overwhelms ceasefire optics. Smart money refusing to price peace. JP Morgan year-end target $6,300 unchanged.", gap: null },

  // Russia + China reactions
  { day: 40, country: "Russia/China", who: "Lavrov / Mao Ning", type: "diplomatic", text: "Russia FM Lavrov condemns US/Israeli strikes as \"reckless\" and \"unprovoked armed aggression.\" China spokesperson Mao Ning announces \"balanced position\" and 5-point China-Pakistan joint initiative.", gap: null },

  // Lufthansa — biggest European carrier to cut
  { day: 40, country: "Germany", who: "Lufthansa / CEO Spohr", type: "warning", text: "Lufthansa Group suspends 8 Middle East destinations until Oct 24 (Abu Dhabi, Amman, Beirut, Dammam, Riyadh, Erbil, Muscat, Tehran); Dubai + Tel Aviv until May 31. CEO Spohr contingency scenarios: mild = 20 aircraft grounded (-2.5% capacity), severe = 40 aircraft (-5%). Europe-Asia detours via Egypt/Central Asia add 1-2hrs per flight.", gap: null },

  // UNSC Resolution 2817 (2026) — Iran's neighbors
  { day: 40, country: "UN Security Council", who: "Resolution 2817 (2026)", type: "diplomatic", text: "Condemns Iran's \"egregious attacks\" on its neighbors. Passes with China and Russia abstaining. Different from original Day 12 resolution.", gap: null },

  // Iran's 10-point proposal rejected
  { day: 40, country: "USA", who: "Press.Sec. Leavitt", type: "political", text: "Iran's 10-point proposal \"literally thrown in the garbage by President Trump.\" Says reports of Iran closing Hormuz \"completely unacceptable.\" Hormuz must reopen \"without limitation, including tolls.\"", gap: null },

  // ── Day 41 (Apr 9) events ──
  // Sources: CNN, NBC, NPR, CBS, Bloomberg, Al Jazeera, Haaretz, Times of Israel, Reuters

  // Hezbollah resumes rocket fire — ~70 rockets
  { day: 41, country: "Israel/Lebanon", who: "Hezbollah", type: "emergency", text: "~70 rockets fired from Lebanon into Israel in retaliation for \"Operation Eternal Darkness.\" ~30 since midnight per Times of Israel liveblog. Hezbollah publicly abandons ceasefire pledge. IDF kills Hezbollah chief's secretary in strike.", gap: null },

  // Iran accuses US of violating ceasefire
  { day: 41, country: "Iran", who: "Government", type: "diplomatic", text: "Iran accuses US of violating two-week ceasefire over Lebanon strikes (CBS News). Insists Lebanon IS covered by Pakistan-brokered deal. US + Israel insist it is NOT — central fracture of ceasefire.", gap: null },

  // Trump threatens to resume strikes
  { day: 41, country: "USA", who: "President Trump", type: "political", text: "Warns strikes will resume \"if Iran doesn't agree to peace terms\" at Islamabad talks. US publishes statement that Iran's proposed plan is \"not the one approved as basis for talks.\" Two-week window functioning as countdown ultimatum.", gap: "'Peace talks imminent' while threatening to resume bombing if Iran refuses US terms" },

  // Brent rebounds
  { day: 41, country: "Global", who: "Markets", type: "warning", text: "Brent rebounds to ~$101 (+5%) as Lebanon escalation + Iran's Hormuz re-closure reprice risk. VIX jumps to ~21.6. Relief rally fully reverses. Physical Dubai holding premium. CNBC: Hormuz normalization \"weeks, if not months.\"", gap: null },

  // Hormuz: only 5 bulk carriers in 24hrs
  { day: 41, country: "Global shipping", who: "MarineTraffic / Kpler", type: "warning", text: "Only 5 bulk carriers transit Hormuz in first 24 hours of deal. S&P Global: 9 total across Apr 8-9 combined. One was US-sanctioned Iran-flagged tanker \"Tour 2.\" Iran Deputy FM reiterates army-consent requirement.", gap: null },

  // Lebanon casualties update
  { day: 41, country: "Lebanon", who: "Lebanese Civil Defence", type: "emergency", text: "Cumulative Lebanon 2026 war: ~2,038 killed (1,784 + 254 Apr 8), 7,140+ wounded, 1.1M displaced. 400+ Hezbollah fighters per Hezbollah, ~1,000 per IDF. Israel kills Hezbollah chief's secretary in follow-up strike.", gap: null },

  // Iran delegation departs for Islamabad
  { day: 41, country: "Pakistan", who: "Islamabad talks", type: "diplomatic", text: "Iranian delegation led by parliament speaker Mohammad Baqer Qalibaf (ex-IRGC commander) and FM Araqchi departs for Islamabad. US delegation: VP Vance, Witkoff, Kushner. Talks begin Saturday Apr 11. Both sides publicly reject each other's terms.", gap: null },

  // Cumulative casualties
  { day: 41, country: "Global", who: "HRANA / IFRC", type: "emergency", text: "Iran: HRANA ~3,636 killed (1,701 civilians, 1,221 military, 714 unclassified); IFRC ~1,900 dead + 20,000 injured conservative. Israel: ~23 killed. Lebanon: ~2,038. Iraq: 106. US military: 13 killed / 380+ wounded.", gap: null },

  // Human stories — 2,000 ships, Gujarat LPG
  { day: 41, country: "Global", who: "Bloomberg / IMO", type: "emergency", text: "~2,000 ships stranded in Persian Gulf, crews concerned about food/water. Gujarat ceramics industry shutdown continues (LPG shortage). Mumbai restaurants/hotels closed from cooking gas shortage. Asia 2026 growth forecast cut up to -1.3pp.", gap: null },

  // White House — Hormuz "unacceptable"
  { day: 41, country: "USA", who: "Press.Sec. Leavitt", type: "political", text: "\"Reports of Iran closing Hormuz completely unacceptable.\" Simultaneously, Iran's Deputy FM is publicly explaining the permission regime. Two administrations talking past each other 24 hours into ceasefire.", gap: "White House calls Hormuz closure 'unacceptable' while Iran publicly explains the permission regime" },
];

// ── Fuel days remaining (strategic reserves / days of supply) ──
// How many days each country can sustain consumption from stored fuel.
// Pre-war baselines from IEA, DOE, JOGMEC, national energy agencies.
// Day 35 values from DropThe.org, parliamentary disclosures, S&P Global.
// Depletion modeled: linear drawdown + step-downs at SPR release points.
// SPR releases (Day 12-13) deplete strategic reserves while supplying the market.

export const FUEL_DAYS: Record<string, { preWar: number; days: number[] }> = {
  // Pakistan: pre-war ~26 days (sources report 24-28 days). No SPR. 4-day workweek from Day 10.
  // Hormuz deal Day 30 (20 ships through) improved supply. Not as dire as initially feared.
  // Verified: Dawn, Al Jazeera — 21 days diesel, 27 days petrol mid-March.
  PAK: { preWar: 26, days: [26,25,25,24,24,23,23,22,22,21,21,20,20,20,20,20,20,20,20,20,20,20,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21,21] },
  // Indonesia: pre-war ~24 days (govt data 20-28 range). Not IEA member. Heavy Gulf dependency.
  // Verified: govt target was 90 days ($22B cost) — far from achieved.
  IDN: { preWar: 24, days: [24,24,23,23,23,22,22,22,21,21,21,21,21,21,21,21,21,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,22,21,21,20] },
  // India: pre-war ~40 days. SPR release small (~3 days). Domestic production helps.
  IND: { preWar: 40, days: [40,39,39,38,38,37,37,36,36,35,35,34,33,33,32,32,31,31,30,30,29,29,28,28,28,27,27,27,26,26,26,25,25,25,25,24,24,23,22,22,21] },
  // Australia: pre-war ~53 days (already below IEA 90-day). Released ~800M litres Day 13.
  AUS: { preWar: 53, days: [53,52,51,50,49,48,47,46,45,44,43,42,38,37,37,36,36,35,35,34,34,33,33,32,32,31,31,30,30,29,29,28,28,27,27,26,25,24,23,22,22] },
  // UK: pre-war ~90 days. European SPR release Day 28. Jet fuel critical.
  GBR: { preWar: 90, days: [90,89,87,86,84,83,81,80,78,77,75,74,72,71,69,68,66,65,63,62,60,59,57,56,54,53,51,48,47,46,45,43,42,40,39,38,37,36,35,34,33] },
  // South Korea: pre-war ~208 days. Massive SPR release Day 12 (22.46M bbl).
  KOR: { preWar: 208, days: [208,205,202,199,196,193,190,187,184,181,178,175,82,80,78,76,74,72,70,68,66,65,63,61,60,58,57,55,54,53,52,51,50,49,49,48,47,46,45,44,43] },
  // Italy: pre-war ~90 days. European SPR release Day 28.
  ITA: { preWar: 90, days: [90,89,87,86,84,83,81,80,78,77,75,74,72,71,69,68,66,65,63,62,61,60,59,58,57,56,55,54,54,53,53,55,55,54,54,53,52,51,50,49,48] },
  // France: pre-war ~90 days. European SPR release Day 28. Some nuclear buffer.
  FRA: { preWar: 90, days: [90,89,88,87,86,85,84,83,82,81,80,79,78,78,77,76,75,75,74,73,73,72,72,71,71,70,70,70,70,70,70,70,70,70,70,69,69,68,67,66,66] },
  // Germany: pre-war ~90 days. Minister warns shortages end of April.
  DEU: { preWar: 90, days: [90,89,88,88,87,86,86,85,84,84,83,82,82,81,81,80,80,79,79,78,78,78,77,77,77,77,77,76,76,76,76,76,76,76,76,75,75,74,73,72,72] },
  // Japan: pre-war 254 days. Released 80M bbl Day 12 (record). Still above IEA 90-day.
  JPN: { preWar: 254, days: [254,252,249,247,244,242,239,237,234,232,229,227,142,140,139,137,136,134,133,131,130,129,128,127,126,126,125,125,125,124,124,124,124,124,124,123,122,121,120,119,118] },
  // USA: pre-war ~125 days (net imports basis, 415M bbl SPR / ~3.3M bbl/day net imports).
  // SPR drawdown of 172M bbl over 120 days started Day 19. Post-drawdown: ~243M bbl = ~73 days.
  // Verified: CBS, Axios. Note: 415M barrels ≠ 400 days.
  USA: { preWar: 125, days: [125,124,123,122,121,120,119,118,117,116,115,114,113,112,111,110,109,108,105,102,99,96,94,92,90,88,86,84,82,80,79,78,77,76,75,74,73,72,71,70,69] },
  // Philippines: pre-war ~57 days. National emergency declared Day 26.
  PHL: { preWar: 57, days: [57,56,56,55,54,54,53,52,52,51,50,50,49,49,48,48,47,47,46,46,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45,45] },
  // Austria: pre-war ~90 days. First stations ran dry Day 14. Fuel Price Brake law Day 26.
  // Price increase rule (3x/week Mon/Wed/Fri at noon) from Apr 1.
  AUT: { preWar: 90, days: [90,89,88,87,86,85,84,83,82,81,80,79,78,77,76,75,74,73,73,72,72,71,71,70,70,70,70,70,70,70,70,70,70,70,70,69,69,68,67,66,66] },
  // Spain: pre-war 92 days (legal obligation, CORES 42d + industry 50d). €5B energy package Day 20.
  // Net exporter of refined products. 56% renewables + 19% nuclear. Americas-heavy crude (36%+).
  // Best-positioned large EU economy. No reported shortages as of Apr 3.
  ESP: { preWar: 92, days: [92,91,90,90,89,88,88,87,86,86,85,84,84,83,83,82,82,81,81,80,80,80,79,79,79,79,79,78,78,78,78,78,78,78,78,78,78,77,76,75,75] },
};

// ── Pump prices (what people actually pay at the station) ──
// Pre-war baselines from GlobalPetrolPrices.com, EIA, EU Weekly Oil Bulletin.
// Current prices from AAA, ADAC, RAC, national fuel price trackers.
// Prices modeled: sharp initial spike (panic + supply shock), then gradual climb.

export interface PumpPriceData {
  label: string;
  currency: string;
  unit: string;
  preWar: number;
  prices: number[];
  painThreshold: number;   // price at which behavior changes significantly
  painNote: string;        // what happens at the pain threshold
}

export const PUMP_PRICES: Record<string, PumpPriceData> = {
  // Germany diesel: ADAC data. Pre-war €1.74/L. Record €2.33 surpassing Mar 2022.
  // New rule from Apr 1: stations may only raise prices once per day.
  DEU: { label: "Germany", currency: "€", unit: "/L diesel", preWar: 1.74,
    painThreshold: 2.00, painNote: "Commuters spend >15% of income on fuel",
    prices: [1.74,1.78,1.82,1.87,1.92,1.96,2.00,2.02,2.04,2.06,2.08,2.10,2.12,2.14,2.16,2.17,2.19,2.18,2.17,2.18,2.20,2.22,2.19,2.18,2.21,2.23,2.21,2.24,2.26,2.25,2.27,2.30,2.22,2.29,2.33,2.35,2.35,2.36,2.37,2.28,2.31] },
  // UK diesel: RAC/heycar data. Pre-war ~143p/L. Hit 186p/L.
  // £100 for a 55L fill = first time since Dec 2022.
  GBR: { label: "UK", currency: "p", unit: "/L diesel", preWar: 143,
    painThreshold: 170, painNote: "£100 fill-up; lowest-income drivers priced out",
    prices: [143,147,150,154,158,161,164,163,162,161,160,159,161,163,166,165,168,167,166,168,170,172,170,169,172,174,172,176,178,177,179,183,176,182,186,188,188,189,190,191,191] },
  // US regular: AAA/EIA. Pre-war $2.98/gal. $4.08 national avg.
  // AAA: $4/gal = 59% of Americans change driving habits. $5 = 75% adjust lifestyle.
  USA: { label: "US", currency: "$", unit: "/gal", preWar: 2.98,
    painThreshold: 4.00, painNote: "59% of Americans change driving habits (AAA)",
    prices: [2.98,3.08,3.18,3.30,3.42,3.50,3.58,3.56,3.54,3.52,3.48,3.46,3.50,3.54,3.58,3.56,3.60,3.58,3.56,3.58,3.62,3.68,3.62,3.60,3.66,3.70,3.66,3.72,3.78,3.76,3.80,3.88,3.76,3.92,4.08,4.12,4.10,4.12,4.14,4.16,4.15] },
  // Australia: AIP/Petrolmate. Pre-war A$1.77/L (AIP week ending Feb 22). Excise cut Day 33.
  // Verified: AIP national avg A$1.73-1.77 pre-war. Sydney avg A$2.38 Apr 3 (Petrolmate).
  AUS: { label: "Australia", currency: "A$", unit: "/L", preWar: 1.77,
    painThreshold: 2.20, painNote: "Regional/rural drivers can't afford to commute",
    prices: [1.77,1.82,1.88,1.94,2.00,2.04,2.08,2.07,2.06,2.04,2.02,2.01,2.04,2.07,2.10,2.09,2.12,2.11,2.10,2.12,2.16,2.20,2.17,2.16,2.20,2.24,2.20,2.27,2.32,2.30,2.34,2.42,2.32,2.36,2.38,2.40,2.42,2.44,2.46,2.40,2.42] },
  // France diesel: prix-carburant.eu. Pre-war €1.65/L. €2.26/L.
  // TotalEnergies voluntary cap at own stations through Apr 7.
  FRA: { label: "France", currency: "€", unit: "/L diesel", preWar: 1.65,
    painThreshold: 2.00, painNote: "Gilets jaunes threshold was €1.50 in 2018",
    prices: [1.65,1.69,1.73,1.78,1.83,1.87,1.91,1.90,1.89,1.88,1.86,1.85,1.88,1.90,1.93,1.92,1.95,1.94,1.93,1.95,1.98,2.01,1.98,1.97,2.00,2.03,2.00,2.05,2.10,2.08,2.12,2.20,2.10,2.20,2.26,2.28,2.28,2.30,2.31,2.24,2.26] },
  // India (Delhi): Goodreturns. Pre-war ₹87/L. ₹94.77/L. Government absorbing some.
  IND: { label: "India", currency: "₹", unit: "/L", preWar: 87.0,
    painThreshold: 100, painNote: "Auto-rickshaw drivers can't cover costs",
    prices: [87.0,87.5,88.0,88.5,89.0,89.5,90.0,90.0,90.0,90.0,90.5,90.5,91.0,91.0,91.5,91.5,92.0,92.0,92.0,92.5,92.5,93.0,93.0,93.0,93.5,93.5,93.5,94.0,94.0,94.0,94.0,94.5,94.77,94.77,94.77,94.77,94.77,94.77,94.77,94.77,94.77] },
  // Austria: Fuel Price Brake law (Day 26, ~10c/L relief). Prices restricted 3x/week from Apr 1.
  // Pre-war €1.65/L diesel. Stations ran dry Day 14. Peak ~€2.25 before brake, ~€2.18 after.
  // Verified: ÖAMTC data. Brake reduces margin + 5c/L tax cut, not an absolute cap.
  AUT: { label: "Austria", currency: "€", unit: "/L diesel", preWar: 1.65,
    painThreshold: 2.00, painNote: "Stations ran dry Day 14; panic buying",
    prices: [1.65,1.70,1.75,1.80,1.86,1.91,1.95,1.94,1.93,1.92,1.91,1.90,1.92,1.94,1.97,1.96,1.99,1.98,1.97,1.99,2.02,2.05,2.03,2.02,2.06,2.10,2.15,2.20,2.25,2.24,2.22,2.20,2.18,2.18,2.18,2.18,2.18,2.18,2.18,2.15,2.15] },
  // Spain: Infobae. Pre-war ~€1.41/L diesel. €1.81/L. Lowest of big-3 EU (lower taxes).
  // €5B package Day 20: VAT to 10%, 20c/L subsidy. 60% renewables = stable electricity.
  ESP: { label: "Spain", currency: "€", unit: "/L diesel", preWar: 1.41,
    painThreshold: 1.70, painNote: "Transport strikes threatened; rural areas hardest hit",
    prices: [1.41,1.44,1.47,1.50,1.54,1.57,1.60,1.59,1.58,1.57,1.56,1.55,1.57,1.58,1.60,1.59,1.62,1.61,1.60,1.62,1.65,1.68,1.66,1.65,1.69,1.72,1.70,1.75,1.80,1.78,1.82,1.86,1.80,1.85,1.88,1.89,1.89,1.90,1.91,1.86,1.87] },
};

// IEA 90-day minimum standard
export const IEA_90_DAY_STANDARD = 90;

// Helper: get stats for a given day index (0-based)
export function getDayStats(dayIndex: number) {
  let affected = 0;
  let rationing = 0;
  let emergencies = 0;

  for (const code in COUNTRY_STATUS) {
    const severity = COUNTRY_STATUS[code][dayIndex];
    if (severity >= 2) affected++;
    if (severity >= 4) rationing++;
    if (severity >= 5) emergencies++;
  }

  const brent = BRENT_PRICES[dayIndex];
  const dubai = DUBAI_PRICES[dayIndex];

  return {
    affected,
    rationing,
    emergencies,
    brent,
    dubai,
    spread: dubai - brent,
    jetFuel: JET_FUEL_PRICES[dayIndex],
    jetFuelChange: Math.round((JET_FUEL_PRICES[dayIndex] / JET_FUEL_PRICES[0] - 1) * 100),
    hormuzFlow: HORMUZ_FLOW[dayIndex],
    hormuzTransits: HORMUZ_TRANSITS[dayIndex],
    supplyOffline: SUPPLY_OFFLINE[dayIndex],
    sprReleased: SPR_RELEASED[dayIndex],
    sprRemaining: IEA_RESERVES_TOTAL - SPR_RELEASED[dayIndex],
    euGasStorage: EU_GAS_STORAGE[dayIndex],
    forceMajeures: FORCE_MAJEURES[dayIndex],
    signalGaps: SIGNAL_ACTION_GAPS[dayIndex],
    unrest: UNREST_INDEX[dayIndex],
    gold: GOLD_PRICES[dayIndex],
    vix: VIX[dayIndex],
  };
}

// Helper: get events for a given day (1-based)
export function getEventsForDay(day: number): CrisisEvent[] {
  return EVENTS.filter(e => e.day === day);
}

// Helper: get severity color for a value
export function getSeverityColor(level: number): string {
  return SEVERITY_LEVELS[level as SeverityLevel]?.color ?? SEVERITY_LEVELS[0].color;
}
