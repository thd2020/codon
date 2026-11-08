# Codon research digest

*Codon design docs (Holarky). Compiled 7 November 2026 from five research sweeps; Steam figures were read in November 2026.*

**What this is.** One place for the team to find what peer games, adjacent genres, film and real biology teach Codon. Each of the five sweeps has its own section. Section 6 merges them into one table of what Codon takes and avoids, with the source game for every row. Section 7 lists the strongest opportunities nobody in the genre has taken; section 8 lists open questions. Every source link from the sweeps is kept inline.

**How to read it.** Start with *At a glance*, then sections 6 and 7. Game entries end with **Take** and **Avoid**. Biology claims carry status tags (see section 4). Design proposals are marked as proposals, not facts.

**Caveats.** The shared web-search budget ran out partway through sweeps 3 and 4 and before sweep 5; later sources were fetched directly from known primary pages, as were those of a later revision pass (older, tabletop, immune and phage peers; scoped novelty claims) and of the strata correction (4.6, *The drop's layers*: light and oxygen in a dew drop) and the colossus correction (4.7, 5.3, 5.20: a giant amoeba, *Chaos*, not the *Dictyostelium* slug). Unit-sale estimates from review counts are rough. Anything marked *unverified* or *DOI not opened* must be checked before it appears in the game.

**Superseded proposals.** This digest records what the sweeps proposed. Where the design documents later decided otherwise, `gameplay.md` is the authority for systems and `story.md` for the frame, and the passages below are marked *superseded* where they appear:
- **Honesty tags.** The four status tags of section 4, the labels of 5.20 and the tags of 2.5 are replaced by gameplay §0's five player-facing badges (Established, Debated, Hypothesis, Codon staging, Codon invention) and its designer codes. Mapping: *[Established]*, *[real]* and *[real, by HGT]* → Established (codes R, R+, RS); *[Established, details debated]* → Debated; *[Hypothesis]* → Hypothesis (code H for both); *[abstraction]* and "Real but exaggerated" → Codon staging (RX); *[Codon invention]*, *[invented]* and "Real road not taken" → Codon invention (INV, or RN printed as *a road not taken*).
- **Node budget.** "Fewer than 200 nodes" (At a glance, 2.6, 6.2) is replaced by gameplay §3.7's catalogue of about 150 nodes under a hard cap of 250 Atlas stars.
- **The lost wall as a defence against *Bdellovibrio*** (4.7, 5.3, 5.20) is forbidden by gameplay §4.2: how the stalker treats a wall-less cell is not established, so it ships as an open question badged Hypothesis, and in play the stalker must re-solve its grip on a deforming body.
- **The frame of 3.8** (three acts; a run as "one drop's day"; exits by fingertip or insect) is replaced by story §3.1–3.4: four Acts, a run as one bead's morning, and gameplay §2.4's five exits.
- **Division heirs with one sister** (5.20) are replaced by gameplay §2.3's draft of three daughters.
- **The Lens as the UV source that wakes prophages** (3.6, 3.7, 5.15, 5.20) is corrected in gameplay §4.3–4.4 and story §3.2: a glass magnifier blocks most UV below 300 nm, so its hot spot is heat (the heat-shock response); the UV focus is the hair-held water bead's own, and UV → SOS → prophage induction runs through it. Any loupe → SOS link is Codon staging (RX).

## Contents

- [At a glance](#at-a-glance)
- [1. Direct peers: cell, microbe and evolution games](#1-direct-peers-cell-microbe-and-evolution-games)
- [2. Progression, build-crafting and tree design across genres](#2-progression-build-crafting-and-tree-design-across-genres)
- [3. Openings, storytelling and the art of scale](#3-openings-storytelling-and-the-art-of-scale)
- [4. Real biology as mechanics](#4-real-biology-as-mechanics)
- [5. Wild breadth: mechanics from anywhere](#5-wild-breadth-mechanics-from-anywhere)
- [6. What Codon takes / what it avoids](#6-what-codon-takes--what-it-avoids)
- [7. The strongest opportunities nobody in the genre has taken](#7-the-strongest-opportunities-nobody-in-the-genre-has-taken)
- [8. Open questions and research gaps](#8-open-questions-and-research-gaps)

## At a glance

**The market**
- Cell-stage roguelites are selling now. Pathogenic sold about 100,000 copies in its first week (July 2026); Everything is Crab reached 100,000 players in two days; Spore is still 92% positive. Thrive shows that scientific depth alone does not draw players (all-time peak 235 concurrent). (1.1)
- The genre's most common complaints are unexplained systems and deaths, empty space, slider-like evolution, poor performance and abandoned Early Access. (1.4)
- $9.99–$19.99 with a strong demo is the proven price band, and Slug Disco is a natural publisher. (1.1, 1.4)

**The gameplay to start with**
- All five sweeps converge on a **15–25 minute action roguelite inside one drop of water**: one drop is one run, the dew's evaporation is the clock, and a lineage carries over between runs. (1.7, 3.8, 5.1)
- Core verbs: run-and-tumble swimming (a free tumble-dodge and a flagellar burst that costs proton motive force), eat and engulf, divide, and steal genes. One clear tension per biome, such as growth vs detection. (1.7, 5.3)
- Death continues through a sister lineage, knowledge persists in a codex and field notebook, and the colony or biofilm is the hub between runs. (2.5, 5.1)

**Phase 1: an evolution tree on everything**
- The organising idea: **genome as deck, regulation as rules, environment as opponent.** (4.13)
- A division draft (pick 1 of 3, or skip); gene cards keyed to the cell's shared currencies (PMF, ATP, NADH, membrane area); 8–10 per-structure trees with behaviour-changing keystones; a proteome budget; real-biology "evolutions"; unlocks triggered by living a condition; honesty tags on every node. Targets: about 150 cards and fewer than 200 nodes. (2.5, 2.6) *Superseded:* gameplay §3.7 sets about 150 nodes under a hard cap of 250 Atlas stars, and gameplay §0 sets the badges.
- Section 4 supplies real mechanics for every branch (mutation, gene theft, phages, regulation, social microbiology, senses, metabolism, endosymbiosis, multicellularity). Section 5.20 maps 40 modules from other genres onto tree branches, with scope.

**Opening and storyline**
- **"Dew"**, an interactive 120-second opening. The cursor is a magnifying glass over a dew-beaded leaf. You choose a drop and push in at about 3 seconds per power of ten. The glass blurs at its honest limit, and the drop itself becomes the lens (as in Stephen Gray's 1696 water microscope). You notice the one wobbling, wall-less cell, take control, and swim through the title. (3.7)
- **"The Drop and the Eye"**: three nested clocks (a drop's day, one summer, deep time), three acts (Dawn, The Leaf, Dusk; *superseded* by story §3.1 and §3.4: a run is one bead's morning, and the summer has four Acts) and an epilogue that pulls out into the watcher's eye and its mitochondria. The watcher's improving instruments are the view-mode meta-progression. (3.8)
- The owner's magnifier seed is strong and historically grounded (Leeuwenhoek 1676, Andersen 1848). Section 3.6 fixes its pitfalls: a magnifier cannot show bacteria, "boy plus magnifier plus sun" reads as burning ants, and human characters are costly.

**The hook no video game has taken**
- Genes and their expression as the interface, gene theft through the real transfer routes as the loot economy, metabolism you can read in the world, and a shape-fluid hero whose body is the mechanic. The claim holds for video games only: the board game Cytosis already makes translation an action. (1.1, 7)

---

## 1. Direct peers: cell, microbe and evolution games

**Scope.** Every peer named in the brief, plus the 2024–2026 wave of Spore-inspired indies; a revision pass added immune and phage strategy games and older and tabletop peers (1.3, after *Other recent and adjacent titles*). Steam numbers were read in November 2026. Unit estimates use the review-multiplier rule of thumb, units ≈ reviews × 20–60 ([Game Developer](https://gamedeveloper.com/business/how-to-estimate-steam-video-game-sales-in-2021-)). Treat them as rough.

### 1.1 Headline findings

1. **Steam is rewarding cell-stage games built as roguelites.** *Pathogenic* (July 2026, $9.99) sold about 100,000 copies in week one and peaked above 5,800 concurrent players ([TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm)). It sits at 95% positive of 3,489 reviews ([Steam](https://store.steampowered.com/app/3808690/Pathogenic/)). *Everything is Crab* (May 2026) reached 100,000 players in two days ([Mein-MMO](https://mein-mmo.de/en/in-a-new-roguelite-on-steam-you-combine-creatures-already-attracting-100000-players-after-2-days,1566777/)). PC Gamer: "everyone's suddenly making games inspired by Spore" ([PC Gamer](https://www.pcgamer.com/games/roguelike/i-dont-know-why-everyones-suddenly-making-games-inspired-by-spore-but-this-roguelike-twin-stick-shooter-might-be-the-best-attempt-yet-at-realising-the-lost-potential-of-the-cell-stage/)).
2. **Demand for Spore has not gone away.** Spore (2008) is 92% positive of 38,711 reviews ([Steam](https://store.steampowered.com/app/17390/SPORE/)) and averaged about 480–730 concurrent players a month in 2026 ([SteamCharts](https://steamcharts.com/app/17390)).
3. **Scientific depth alone does not draw players.** Thrive is 92% positive of 1,726 reviews ([Steam](https://store.steampowered.com/app/1779200/Thrive/)), but its all-time Steam peak is 235 concurrent and it averaged about 23 in October 2026 ([SteamCharts](https://steamcharts.com/app/1779200)). It is also free on GitHub, which explains part of this. Reviewers still call the loop "very repetitive", with "minutes at a time of wandering vast voids" ([negative reviews](https://steamcommunity.com/app/1779200/negativereviews/?browsefilter=toprated)).
4. **Placing parts on the body has to matter.** Soren Johnson: Spore's cell editor affected play, but creature parts carried fixed stats whatever their shape, and that gap hurt the whole game ([Designer Notes](https://www.designer-notes.com/spore-my-view-of-the-elephant/)). Pathogenic's breakout feature is the reverse: organelles attach to a deformable body and placement changes movement ([TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm)).
5. **The genre's most common complaint is unexplained systems.** Primordialis: 51 "poorly explained" and 14 "unclear deaths, no damage log" mentions ([VaporLens](https://vaporlens.app/app/3011360/primordialis)). Niche: 56 "poor tutorial" ([VaporLens](https://vaporlens.app/app/440650/niche_a_genetics_survival_game)). Lifecraft's top complaint is a clunky UI ([VaporLens](https://vaporlens.app/app/1839930/lifecraft.md)); Thrive draws "UI messy" complaints. Codon's visible energy route can *be* the explanation.
6. **Simulation-first sandboxes hit performance limits and shallow evolution.** Species runs on one CPU core and caps near 500 creatures ([reviews](https://steamcommunity.com/app/774541/negativereviews/?browsefilter=toprated)). The Sapling has memory blow-ups and evolution that only changes size and surface features ([reviews](https://steamcommunity.com/app/997380/negativereviews/?browsefilter=toprated)). Ecosystem has 47 "frustrating editor" and 33 "shallow evolution" mentions ([VaporLens](https://vaporlens.app/app/1133120/ecosystem)).
7. **One clear tension between two goals drives replays.** Plague Inc's core play is keeping lethality and visibility low while infectivity rises ([Escapist](https://escapistmagazine.com/?p=55942)). It has 170M+ players ([Ndemic](https://cdn.ndemiccreations.com/en/20-media)) and is 93% positive of 27,320 reviews ([Steam](https://store.steampowered.com/app/246620/Plague_Inc_Evolved/)).
8. **No video game we found makes genes or gene expression the interface.** The claim is scoped to video games: the board game *Cytosis* already makes "translating mRNA into Proteins" a worker-placement action (1.3, *Older and tabletop peers*), and other tabletop biology titles are unchecked. Gene theft has loose analogues: Pathogenic grafts organelles from kills, Strange Seed collects DNA from kills, Stellaris' Evolutionary Predators absorb the traits of prey (2.2), and Thrive already ships endosymbiosis ([Steam](https://store.steampowered.com/app/1779200/Thrive/)). But no microbe game models the real transfer routes (transformation, conjugation, transduction). No video game we found shows metabolism as something you read in the world; Thrive, Lifecraft and CellCraft show compounds and ATP as numbers or menus. Pathogenic's "plasmid" tree is plasmid in name only; it is meta-progression ([Steam](https://store.steampowered.com/app/3808690/Pathogenic/)). Among video games, Codon's hook is unclaimed.
9. **Early Access abandonment is punished.** Species shows "last update over four years ago" and recent reviews call it abandoned ([Steam](https://store.steampowered.com/app/774541/)). Equilinox has 38 "abandoned" mentions ([VaporLens](https://vaporlens.app/app/853550/equilinox)).
10. **There is a natural publisher.** Slug Disco (Empires of the Undergrowth) publishes Ecosystem, Pathogenic, Strange Seed and the evolution survival game Adapt, sells a "Slug Disco Evolution" bundle and takes submissions ([Slug Disco](https://slugdisco.com/about/), [Game Developer](https://gamedeveloper.com/press-release/spore-like-creature-evolution-game-strange-seed-joins-slug-disco)).

### 1.2 Snapshot table

| Game | Year / status | Core loop | How evolution works | Steam reception | Scale signal |
|---|---|---|---|---|---|
| Spore (cell + creature) | 2008 | eat, grow, call a mate, edit | DNA points buy parts | 92% of 38,711 | 2M copies in 3 weeks ([Wiki](https://en.wikipedia.org/wiki/Spore_(2008_video_game))) |
| Thrive | EA 2021; Microbe Stage 1.0 Dec 2025 | gather compounds, reproduce, edit | 100 MP per generation; auto-evo for rivals | 92% of 1,726 | peak 235 CCU |
| Pathogenic | Jul 2026 | twin-stick runs inside a host | graft organelles from kills; plasmid meta-tree | 95% of 3,489 | ~100k in week 1 |
| Primordialis | EA Jul 2025 | physics roguelike, build from cells | 60+ cell types, logic modules | 93% of 1,024 | ~20–60k est. |
| Everything is Crab | May 2026 | action roguelite in a living ecosystem | 125+ abilities picked per run | 87% of 3,532 | 100k players in 2 days |
| Strange Seed | Nov 2025 | action RPG blob | DNA from kills unlocks parts, 7 slots | 85% of 454 | ~9–27k est. |
| Planetary Life | EA Aug 2025 | planet sandbox, cell to creature | combine cell types | 94% of 947 | ~19–57k est. |
| Cell to Singularity | F2P, 2018/2021 | idle clicker | linear tree-of-life unlocks | 85% of 11,437 | ~33M mobile installs (est.) |
| Plague Inc: Evolved | 2016 (mobile 2012) | race against a cure | DNA points on transmission, symptoms, abilities | 93% of 27,320 | 170M+ players |
| Bio Inc. Redemption | 2018 | kill or cure one patient | spend on symptoms or treatments | ~88% of ~2,800 | — |
| Species: ALRE | EA 2018, stalled | watch and steer natural selection | true mutation and selection | 73% of 975 | abandoned |
| Ecosystem | EA 2021, 1.0 Nov 2024 | ocean god-game | DNA encodes body + neural brain | 76% of 610 | — |
| The Sapling | EA 2019 | design plants and animals | optional random mutation | 88% of 1,978 | ~40–120k est. |
| Equilinox | 2018 | cozy ecosystem garden | points buy genetic modification | 93% of 2,109 | — |
| Niche | 2016 | turn-based breeding survival | 100+ Mendelian genes | 90% of 3,790 | ~75–225k est. |
| Microcosmum | 2015 | RTS, capture neutral cells | upgrades per level | 80% of 1,119 | 5 paid campaign DLCs |
| Evolution (digital) | 2019 | card drafting, feed species | traits, body size, population | 81% of 349 | — |
| Lifecraft | EA 2024 | factory inside the cell | build pathways | 80% of 142 | — |
| flOw | 2006/07 | eat, grow, dive | grow by eating | Metacritic ~71 | most-downloaded PSN game of 2007 |
| Osmos | 2009 | absorb, propel by ejecting mass | none (mass only) | Very Positive (692) | ~110k est. |
| agar.io | 2015 | eat, split, eject | mass only | — | 113M mobile downloads by Dec 2016 |

### 1.3 Game by game

#### Spore (2008): Cell and Creature stages
- **What it is.** A meteor crashes into an ocean and reveals a single cell. You eat meat or plants on a 2D plane, avoid predators, collect parts from meteor bits or kills, then call a mate to open an editor and spend DNA points. Diet carries into the Creature Stage, and each stage ends with one of three consequence traits ([Wikipedia](https://en.wikipedia.org/wiki/Spore_(2008_video_game))). One writer finished the Cell Stage in about 15 minutes ([Earth Magazine](https://www.earthmagazine.org/article/games-spore-cells-divide-and-conquer)).
- **Praise.** "Charming", "doesn't outlive its welcome". The scale flip works: you nibble frond tips, later swallow whole plants. Being hunted creates tension ([Andrew Doull](https://roguelikedeveloper.blogspot.com/2008/09/hard-core-spore-tide-pool-creature.html?m=0)). Maxis "knew that nobody would want to play as a cell for very long" and kept the stage short on purpose ([bit-tech](https://bit-tech.net/features/gaming/pc/10-years-on-spore/1/)). User creations passed 100 million by May 2009 ([Wikipedia](https://en.wikipedia.org/wiki/Spore_(2008_video_game))).
- **Complaints.** "Individual gameplay elements are extremely simple" (GameSpot). Science magazine's team failed it on mutation, selection and genetics (both via [Wikipedia](https://en.wikipedia.org/wiki/Spore_(2008_video_game))). Movement has no directional bias; eyes add little, so every direction is equally good ([Doull](https://roguelikedeveloper.blogspot.com/2008/09/hard-core-spore-tide-pool-creature.html?m=0)). Margaret Robertson called it "a Mr. Potato Head simulator" ([Game Developer](https://www.gamedeveloper.com/game-platforms/gdc-lessons-learned-from-i-spore-i-its-science-and-more)). The developers admit the previews "built a fantasy in people's minds that was unachievable" ([PC Gamer](https://pcgamer.com/games/life-sim/spore-devs-say-the-evolution-games-previews-were-more-ambitious-than-what-they-were-actually-making-and-they-built-a-fantasy-in-peoples-minds-that-was-unachievable/)). Soren Johnson's diagnosis: five stages were five games with their own rules, made by a team split between "cute" and "science" camps ([Designer Notes](https://www.designer-notes.com/spore-my-view-of-the-elephant/)).
- **Numbers.** About 2M copies in three weeks, Metacritic 84. Steam: 92% of 38,711, monthly peaks of 900–1,500 concurrent in 2026 ([SteamCharts](https://steamcharts.com/app/17390)).
- **Take:** the eat-and-grow-under-threat feel; the scale flip where threats become food; editor choices that carry forward; sharing creations.
- **Avoid:** stages that are separate games; parts with fixed stats; a cell phase that ends before it gets deep; directionless swimming; marketing that promises more than ships.

#### Thrive (Revolutionary Games; EA Nov 2021; Microbe Stage 1.0 Dec 2025)
- **What it is.** An open-source "scientifically accurate Spore": the first cell on an alien planet, 3D seen top-down ([wiki](https://wiki.revolutionarygamesstudio.com/wiki/What_is_Thrive)). The Microbe Stage is the first of nine planned stages ([devblog](https://www.revolutionarygamesstudio.com/devblog-50-microbe-stage-complete)); the Steam page lists 25+ parts and estimates "roughly 120 months" to completion ([Steam](https://store.steampowered.com/app/1779200/Thrive/)).
- **Loop** ([Microbe Stage GDD](https://wiki.revolutionarygamesstudio.com/wiki/Microbe_Stage_GDD)):
  - Collect compounds: phosphate and ammonia to reproduce, glucose for ATP.
  - The membrane pays a constant osmoregulation cost in ATP; running out kills the cell by osmolysis.
  - Reproduction doubles each organelle, then opens the editor with 100 mutation points (MP).
  - Membrane-bound organelles unlock when a nucleated cell engulfs a suitable bacterium, or for a large MP sum. Prokaryotes get a −50% size modifier.
  - You leave the stage by evolving binding agents and forming a colony.
  - Rivals evolve by "auto-evo", which the developers say "isn't completely Darwinian" ([devblog 5](https://revolutionarygamesstudio.com/devblog-5-thrive-vs-species)).
- **Praise.** "Very hardcore in terms of biology"; resource clouds that "spread out and dissipate"; "the evolutionary tree and respective clades are really fun to observe"; cheap and open source ([positive reviews](https://steamcommunity.com/app/1779200/positivereviews/?browsefilter=toprated)).
- **Complaints** ([negative reviews](https://steamcommunity.com/app/1779200/negativereviews/?browsefilter=toprated), [positive reviews](https://steamcommunity.com/app/1779200/positivereviews/?browsefilter=toprated)): repetitive play in empty space; over-specialization ("you hit a 'point of no return'"), with one reviewer asking to continue as another surviving species after extinction; unclear tutorials, a messy UI of hard-to-scan numbers, "abysmal" controls; performance drops after an hour; phosphate costs, the flat 100 MP and slow big cells all feel wrong. A Steam thread asks "is it a game or a cell simulator?"; the developer replies that the real terms could be swapped for sci-fi words without changing play ([discussion](https://steamcommunity.com/app/1779200/discussions/0/597386372524905670)).
- **Numbers.** $4.99; 92% of 1,726; all-time peak 235 CCU (Feb 2025) ([SteamCharts](https://steamcharts.com/app/1779200)).
- **Take:** compounds and ATP as a survival clock; osmotic cost of a bigger membrane (directly relevant to a wall-less L-form); engulfment as the route to new organelles; phylogeny views players enjoy.
- **Avoid:** empty arenas; number-heavy HUD panels; a flat MP budget that ignores context; irreversible specialization; an editor-between-generations rhythm that pulls you out of the world.

#### Pathogenic (Aberrant Labs / Slug Disco, 16 July 2026): the new benchmark
- **What it is.** A 2D roguelike twin-stick shooter: a parasite infects a human host and fights its immune system. You rip organelles out of enemy cells and graft them on (flagella for movement, mitochondria for power, secretors for ranged attacks, spikes for melee), and effects chain into synergies. Enemies include macrophages, T cells, rival tapeworms and protozoa; bosses sit in the lungs, heart and brain. Plasmid fragments upgrade a per-parasite meta-tree between runs, and soft-body physics gives the organic feel ([Steam](https://store.steampowered.com/app/3808690/Pathogenic/), [Godot showcase](https://godotengine.org/showcase/pathogenic/)). Organelles attach to a deformable node-based body, and placement changes movement. The solo developer pitched it as "a deeper first stage of Spore, as a roguelike", citing Isaac and Hades ([TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm)).
- **Praise** ([positive reviews](https://steamcommunity.com/app/3808690/positivereviews/?browsefilter=toprated), [VaporLens](https://vaporlens.app/app/3808690/pathogenic)): addictive (25 mentions), soundtrack (23), roguelite design (22), visuals (20); "tight, responsive" controls; evolutions that visibly reshape the cell; microbiology jokes; "the first level of Spore, but much longer". PC Gamer: possibly "the best attempt yet at realising the lost potential of the cell stage" ([PC Gamer](https://www.pcgamer.com/games/roguelike/i-dont-know-why-everyones-suddenly-making-games-inspired-by-spore-but-this-roguelike-twin-stick-shooter-might-be-the-best-attempt-yet-at-realising-the-lost-potential-of-the-cell-stage/)).
- **Complaints** ([negative reviews](https://steamcommunity.com/app/3808690/negativereviews/?browsefilter=toprated), [VaporLens](https://vaporlens.app/app/3808690/pathogenic)): build randomness (22), steep learning curve (21), lag (20), limited replayability or variety (19/18); environmental hazards cause most deaths; the Heart boss is unreadable ("literally everything is red"); meta-progression "gets super slow VERY quick"; local co-op shares one organism, which buyers felt misled them.
- **Take:** run-based structure; loot that physically becomes your body; real cell biology as mechanics; a ~$10 price.
- **Avoid:** threats the same colour as the world; deaths caused by the environment rather than choices; RNG that decides builds; a meta-grind that slows down.
- **Differentiate.** Pathogenic owns "parasite twin-stick shooter in a human host". Codon should lead with genes, expression and free-living ecology, not bullet-hell.

#### Primordialis (EA 2 July 2025)
- **What it is.** A "physics-based roguelike fish builder": bodies from 60+ cell types (venomous tentacles, electric shocks, "exploding children"), 5 biomes, a final boss and a sandbox ([Steam](https://store.steampowered.com/app/3011360/Primordialis)). $19.99, 93% of 1,024.
- **Praise** ([VaporLens](https://vaporlens.app/app/3011360/primordialis)): addictive and innovative (99), creative freedom (65), Noita and Spore comparisons (45), deep logic modules (34), liquid and cell physics. **Complaints:** poorly explained (51), steep curve (43), simpler builds are safer (17), experimentation punished (15), abrupt deaths with no damage log (14).
- **Take:** body logic (sensor → actuator wiring) as an advanced layer; a build-testing sandbox; physics-driven bodies.
- **Avoid:** no autopsy or damage log; penalties so harsh that players stop experimenting.

#### Everything is Crab (May 2026), Strange Seed (Nov 2025), E.V.O.: Search for Eden (1992)
- **Everything is Crab:** action roguelite with 125+ evolution abilities, starting "Genetics", four biomes with climate events, day/night and a Codex. The joke is convergent evolution: life always becomes crab, and you try to avoid it ([Steam](https://store.steampowered.com/app/3526710)). Each pick changes your appearance; one reviewer called it among the most replayable games they had played ([GamingOnLinux](https://gamingonlinux.com/2026/05/everything-is-crab-is-a-genius-and-silly-roguelite-about-creating-a-total-abomination)). $9.99, 87% of 3,532.
- **Strange Seed:** a blob collects DNA from kills to unlock parts; 7 part slots, 40+ creatures, Soulslike bosses; cites E.V.O. and Spore's creature stage. $14.99, 85% of 454 ([Steam](https://store.steampowered.com/app/2463690/)).
- **E.V.O.:** eat meat for evolution points, buy jaws, fins or scales, move through eras to a rhino-like mammal, bird or human. Praised for ambition and the satisfaction of farming for an upgrade; criticised for no invincibility frames and tedious repeat fights ([GamesBeat](https://gamesbeat.com/the-retrobeat-e-v-o-search-for-eden-is-an-snes-curiosity-worth-your-time/)).
- **Take:** a funny, true-to-science hook for marketing (carcinization is real convergent evolution); visible transformation on every pick; a Codex that rewards discovery.
- **Avoid:** grind-to-afford evolution; parts that are only stat sticks.

#### flOw (Jenova Chen; Flash 2006, PS3 2007)
- **What it is.** A worm-like microorganism eats and grows across stacked planes. No menus or instructions; you dive by eating special organisms, eating is optional, and "death" floats you up a layer. Built to test Chen's thesis on dynamic difficulty and Csikszentmihalyi's flow; Austin Wintory's dynamic score won an audio award ([Wikipedia](https://en.wikipedia.org/wiki/Flow_(video_game))).
- **Numbers.** 650,000 Flash downloads by July 2006; most downloaded PSN game of 2007; 2008 GDC Award for Best Downloadable Game; Metacritic ~71. **Complaints:** no challenge since you cannot die; feels like an art piece or "tech demo"; a few hours long.
- **Take:** no HUD; a world that teaches itself; depth as difficulty the player chooses; music that responds to play. **Avoid:** aesthetics with no stakes or longevity.

#### Osmos (Hemisphere Games, 2009)
- **What it is.** Absorb smaller motes; propel yourself by ejecting mass, which shrinks you. Level types: Sentient (hunters), Ambient, Force (orbital attractors with an optional trajectory preview). Ambient score with Gas, Biosphere and Loscil. IndieCade 2009 Best in Show; Metacritic 80 (PC) and 90 (iPhone) ([Wikipedia](https://en.wikipedia.org/wiki/Osmos)). SteamSpy estimates 200,000–500,000 owners on Steam alone ([SteamSpy](https://steamspy.com/app/29180)).
- **Take:** movement that costs what you are trying to gain. In Codon every flagellar sprint spends proton motive force and ATP needed for growth: real physics and real tension. Calm ambient audio suits a pale, sunlit drop.
- **Avoid:** a single mechanic with no build layer.

#### agar.io (2015) and the .io genre, including mope.io
- **agar.io:** eat pellets and smaller players; mass decays, heavier cells are slower; split into up to 16 pieces to attack or escape; eject mass to feed allies; viruses split big cells. 10M+ mobile downloads in week one, 113M by Dec 2016; 2B YouTube views by March 2016; Google's most-searched game of 2015. Critics: repetitive, "floaty" mobile controls; the genre was criticised for undisclosed bots ([Wikipedia](https://en.wikipedia.org/wiki/Agar.io)).
- **mope.io:** a ladder of about 17 animal tiers ([fandom](https://mopeio.fandom.com/wiki/Tiers/Tier_1)); each biome adds a need (land animals need water, aquatic ones suffocate on land) ([guide](https://dinogame.gg/blog/mastering-mope-io/)).
- **Take:** size-based threat readable at a glance; splitting (binary fission) as an escape or attack verb; feeding others as a social signal (cross-feeding, public goods).
- **Avoid:** mass-grinding with no build; hidden bots in any online mode.

#### Tasty Planet (Dingo Games) and Feeding Frenzy (PopCap)
- **Tasty Planet:** a scientist trying to invent bathroom cleaner creates grey goo, which starts by eating red blood cells inside his assistant and grows through dirt, aphids, pets, trees and cars until it eats the galaxy. 60 timed levels, 3 modes. "Fun, fast and hard to stop"; criticised for crude 2D art and being derivative ([Gamezebo](https://www.gamezebo.com/reviews/tasty-planet-review/)).
- **Feeding Frenzy:** eat smaller fish, avoid larger ones; growth lets you eat what once hunted you ([Gamezebo](https://www.gamezebo.com/reviews/feeding-frenzy-2-review/)).
- **Take:** a comic "powers of ten" frame with a human-scale story around the micro world (close to the owner's magnifier seed); predator-prey reversal as a reward. **Avoid:** timed levels with no growth beyond size.

#### Plague Inc: Evolved (Ndemic, 2016; mobile 2012) and Bio Inc. Redemption (2018)
- **Plague Inc.** 10 disease types, 23 scenarios, real-world data, co-op and versus, a level editor with 10,000+ Workshop scenarios; 93% of 27,320 ([Steam](https://store.steampowered.com/app/246620/Plague_Inc_Evolved/)).
  - James Vaughan built it from Pandemic 2, adding narrative, more strategic choice, "graphs and data lists" and a more realistic world. He tuned hundreds of variables in Excel, then judged feel by playing ([PocketGamer.biz](https://www.pocketgamer.biz/plague-vs-pandemic-qanda-with-james-vaughan-founder-of-ndemic-studios/)).
  - Pre-run "genes" come in DNA, Travel, Evolution, Mutation and Environment categories ([wiki](https://plagueinc.wiki.gg/wiki/Gene)).
  - The reverse mode puts you in charge of humanity's response: every action costs public order, overreaction is punished, "There are no black-and-white answers, only shades of gray" ([Game Developer](https://www.gamedeveloper.com/design/why-the-makers-of-i-plague-inc-i-are-building-a-mode-where-you-destroy-the-virus)).
  - Complaints: Greenland closes its port before you infect it (52), limited replayability (41), luck (33), repetitive loop (29) ([VaporLens](https://vaporlens.app/app/246620/plague_inc_evolved)).
  - 170M+ players ([Ndemic media](https://cdn.ndemiccreations.com/en/20-media)); Evolved sold 2M+ copies ([Ndemic](https://cdn.ndemiccreations.com/en/news/140-plague-inc-evolved-goes-double-platinum-with-2-million-copies-sold)).
- **Bio Inc. Redemption.** One campaign kills a patient, the other saves one, across 600+ diseases, symptoms and treatments ([Steam](https://store.steampowered.com/app/612470)). Praised for detailed disease mechanics (49) and educational value (48); criticised as unrealistic (38), for its interface (32), repetition (23) and treatments with no consequences (12) ([VaporLens](https://vaporlens.app/app/612470/bio_inc_redemption)). "Fun in short bursts", with a mobile-port feel ([GameSkinny](https://www.gameskinny.com/reviews/bio-inc-redemption-review-a-fun-look-into-unhealthy-lifestyles-and-diseases/)).
- **Take:** one clear trade-off between two dials; real data as drama; pre-run gene loadouts; scenario packs and a Workshop editor; a reverse mode (immune system or phage side).
- **Avoid:** early failures decided by luck (the Greenland problem); treatments with no cost; a single dominant strategy.

#### Cell to Singularity (Computer Lunch; F2P, 2018 EA, 2021 1.0)
- **What it is.** An idle clicker: Entropy unlocks a tree of life, Ideas drive a tech tree, and the singularity triggers a prestige "Reality Engine" reboot narrated by an AI called Semblance; expansions cover dinosaurs and astronomy ([Wikipedia](https://en.wikipedia.org/wiki/Cell_to_Singularity)).
- **Numbers.** 85% of 11,437 ([Steam](https://store.steampowered.com/app/977400/)); about 33M mobile installs (third-party estimate, [AppGoblin](https://appgoblin.info/apps/com.computerlunch.evolution/trends)). Praised for educational value (40 mentions) ([VaporLens](https://vaporlens.app/app/977400/cell_to_singularity_evolution_never_ends)). Complaints: "predatory" monetization, "watching ads 95% of my playtime", paywalled events, "no real choices at any point" ([negative reviews](https://steamcommunity.com/app/977400/negativereviews/?browsefilter=toprated)).
- **Take:** the tree of life as a beautiful, legible progress map; bite-size facts. **Avoid:** linear unlocks without choice; F2P pressure; save-sync failures.

#### Evolution (North Star Games board game, 2014; digital 2019)
- **Board game.** Each species has body-size and population tracks (1–6). Trait cards go on species (up to 3) or are discarded to found a species or raise size or population. Food goes to a shared Watering Hole; carnivores must attack smaller, undefended species; starving species shrink or go extinct. Traits feel balanced because "their value shifts with the other species on the table". Critics: abundant food weakens carnivores, and 2-player feels repetitive ([Opinionated Gamers](https://opinionatedgamers.com/2015/05/20/dale-yu-review-of-evolution-northstar-games/)). Designed by Dominic Crapuchettes with Dmitry Knorre and Sergey Machin ([Wikipedia](https://en.wikipedia.org/wiki/Evolution_(board_game))).
- **Digital.** 24-level campaign, AI personalities, 12,000+ trait combinations, cross-platform PvP; 81% of 349 ([Steam](https://store.steampowered.com/app/469800)); VGChartz 7/10, faithful but feature-light ([VGChartz](https://www.vgchartz.com/article/436144/evolution-the-video-game-pc/)).
- **Take:** trait value that depends on rivals (frequency-dependent selection); the size-versus-population trade-off; a shared food pool. A ready template for colony-vs-colony. **Avoid:** food abundance that removes predation pressure.

#### Species: Artificial Life, Real Evolution (Quasar; EA Sept 2018, stalled)
- **What it is.** Real-time mutation, selection and speciation, with a clade diagram, satellite range map, "web of life", rovers for artificial selection and catastrophes. You act on the world, not inside it ([Steam](https://store.steampowered.com/app/774541/), [devblog](https://revolutionarygamesstudio.com/devblog-5-thrive-vs-species)). $19.99, 73% of 975, "last update over four years ago". Complaints: abandonment, crashes, the XNA engine on one core, a ~500-creature cap that causes extinctions ([negative reviews](https://steamcommunity.com/app/774541/negativereviews/?browsefilter=toprated)).
- **Take:** clade and range views; catastrophes as player tools. **Avoid:** observer-only agency; CPU-bound simulation; silent Early Access.

#### Ecosystem (Tom Johnson / Slug Disco; EA 2021, 1.0 Nov 2024)
- **What it is.** Synthetic DNA encodes each creature's skeleton, neural brain (sense → neuron → muscle) and combat traits; creatures learn to swim "after about ten generations"; terrain sculpting, god tools and Workshop sharing ([Steam](https://store.steampowered.com/app/1133120/Ecosystem/)). $19.99, 76% of 610. Praised as a relaxing sandbox (96); criticised for a frustrating editor (47), shallow evolution (33), performance (29) ([VaporLens](https://vaporlens.app/app/1133120/ecosystem)).
- **Take:** emergent locomotion as a showpiece ("watch it learn" works in trailers). **Avoid:** long waits before anything happens; a weak direct-control layer.

#### The Sapling (Wessel Stoop, solo; EA Dec 2019)
- **What it is.** Design plants, algae, fungi and animals; switch on mutation and species fill open niches. Scenarios teach the systems; the sandbox adds planet generation and seasons. $17.99, 88% of 1,978 ([Steam](https://store.steampowered.com/app/997380/The_Sapling/)). Complaints: memory blow-ups and single-digit FPS; animals "only change in size and surface features", "bounce between a few different body parts", and new parts "just kinda pop up" ([negative reviews](https://steamcommunity.com/app/997380/negativereviews/?browsefilter=toprated)).
- **Take:** scenarios that each ask for one ecosystem goal. **Avoid:** slider-only evolution; parts that pop in. Codon's translation-to-protein visual solves this directly.

#### Equilinox (ThinMatrix, 2018)
- A cozy diorama where species earn points that buy genetic modifications and new species ([Steam](https://store.steampowered.com/app/853550/Equilinox/)). $9.99, 93% of 2,109. Praised as relaxing (65), cute (63), soundtrack (49); criticised for limited content (37), species not spreading (32), abandonment (38), shortness (31) ([VaporLens](https://vaporlens.app/app/853550/equilinox)).
- **Take:** a calm, low-stress mode that suits pale sunlit water. **Avoid:** running out of content, then going quiet.

#### Niche: a genetics survival game (Stray Fawn, 2016)
- Turn-based breeding with 100+ genes and dominant, recessive and co-dominant inheritance; teaches drift, gene flow, mutation, natural and sexual selection; extinction ends the run ([Steam](https://store.steampowered.com/app/440650)). $17.99, 90% of 3,790. Praised for its concept (80) and breeding (72); criticised for a repetitive, shallow loop (86), poor tutorial (56) and RNG (50) ([VaporLens](https://vaporlens.app/app/440650/niche_a_genetics_survival_game)). One critic: "pretty nifty" as a science lesson, but they didn't care for it as a game ([OpenCritic](https://opencritic.com/game/10099/niche-a-genetics-survival-game)).
- **Take:** real, playable inheritance rules; population genetics as strategy. **Avoid:** chores like hand-pairing individuals; a loop that never escalates.

#### Creatures (Steve Grand, 1996)
- Norns have a genome, simulated biochemistry (a bloodstream of chemicals, with reward and punishment chemicals driving learning) and a neural brain of about 952 neurons in 9 lobes. Players teach them, breeding passes traits on, and a Genetics Kit let players edit genomes ([Alan Zucconi](https://www.alanzucconi.com/2020/07/27/the-ai-of-creatures/)). 500,000 copies from 1996 to mid-1998 ([Wikipedia](https://en.wikipedia.org/wiki/Creatures_(video_game_series))). Players formed "Norn Genome Projects", breeding experiments and adoption agencies ([MIT Technology Review](https://www.technologyreview.com/2014/09/18/171315/a-grand-quest-to-create-virtual-life/)).
- **Take:** biochemistry as the engine of behaviour (matches Codon's visible metabolism); a pet bond with your cell; genome editing as a power-user layer that grows a community.
- **Avoid:** heavy simulation without goals. Grand's later Grandroids is described as "a place to visit rather than a game" (same source).

#### Cell Lab: Evolution Sandbox (Petter Säterskog, Android)
- You program a genome that grows a multicellular organism: division size and angle, adhesion, colour, neural signalling. 18 cell types (photocytes, phagocytes, flagellocytes, keratinocytes, neurons and others), 4 tutorials, 66 challenges, an experiment lab (nutrients, light, gravity, radiation-driven mutation) and a "gene fridge" for sharing genomes. The Google Play listing is gone; the APK is distributed through the forum ([Namu Wiki](https://namu.wiki/w/%EC%85%80%EB%9E%A9)). Players describe it as focused on designing species, with radiation mutation at each division ([r/EvoLife thread](https://www.reddit.com/r/EvoLife/comments/1e24ydz/how_similar_is_evolife_to_cell_lab/)).
- **Take:** the genome as a program, the closest precedent for "real genes as the interface"; challenges that unlock genes. **Avoid:** a toolbox with no world or character; tying the game to one platform.

#### Microcosmum: survival of cells (Satur Entertainment, 2015)
- A relaxing RTS: capture neutral cells, send "antibodies" to attack. 72 levels, $7.99, five paid campaign DLCs, 80% of 1,119 ([Steam](https://store.steampowered.com/app/386260)). Praised for short sessions, compared to Eufloria ([positive reviews](https://steamcommunity.com/app/386260/positivereviews/?browsefilter=toprated)); criticised as a "press- and clickfest" with ignored commands, a game that "doesn't tell you jack squat", and recycled levels ([negative reviews](https://steamcommunity.com/app/386260/negativereviews/?browsefilter=toprated)).
- **Take:** colony-capture RTS for the later colony mode. **Avoid:** click-heavy micromanagement; unclear capture thresholds.

#### Inside-the-cell management: Lifecraft (EA 2024) and CellCraft (2010)
- **Lifecraft:** make ATP by glycolysis and mitochondrial respiration, assemble proteins, with planned growth into a multicellular organism. $22.99, 80% of 142 ([Steam](https://store.steampowered.com/app/1839930)). Praised for biology-based automation; complaints lead with a clunky UI, poor tutorial and no clear goals ([VaporLens](https://vaporlens.app/app/1839930/lifecraft.md)).
- **CellCraft:** a Flash RTS from Wake Forest (lead programmer Lars Doucet) about building a cell, making ATP and fighting viruses. About 2.5M plays in three months; students improved on a quiz after 30 minutes ([Science Game Center](https://www.sciencegamecenter.org/games/cellcraft)). Its silly story (platypus aliens send their DNA to Earth) justified unlocking parts piece by piece and explained the hazards; one analysis faults its interface and pacing ([Game Developer](https://gamedeveloper.com/game-platforms/analysis-golgi-bodies---storytelling-in-i-cellcraft-i-)).
- **Take:** a story that explains why tools unlock; pathways players can read. **Avoid:** factory menus instead of in-world visuals; costs shown far from the resources they use.

#### Emergent artificial-life sims: EvoLife, The Bibites, ALIEN, Intelligent Design
- **EvoLife** (solo, EA 2022, $9.99): GPU simulation of hundreds of thousands of cells; only about 1% of random DNA is viable; cells grow organelles, stick together after dividing and build stromatolite-like deposits; 83% of 30 ([Steam](https://store.steampowered.com/app/2102770)).
- **The Bibites** (EA March 2025): evolving neural-network brains and speciation; Very Positive on about 200 reviews; Patreon-backed solo developer ([Steam](https://store.steampowered.com/app/2736860/The_Bibites_Digital_Life), [GamePressure](https://www.gamepressure.com/games/the-bibites-digital-life/z56c6f)).
- **ALIEN:** open source, CUDA, millions of particles, genome-encoded organisms with no hard-coded behaviour; won the ALIFE 2024 Virtual Creatures Competition ([GitHub](https://github.com/chrxh/alien)).
- **Intelligent Design:** an ecosystem with fully simulated genetics; 3.4/5 from 81 ratings ([itch](https://pillbuginteractive.itch.io/intelligent-design)).
- **Take:** emergent rival lineages in the background; GPU simulation for population scale. **Avoid:** no player character and no goals.

#### Other recent and adjacent titles
- **Planetary Life** (EA Aug 2025, $11.99): shape a planet, then evolve life from cell to creature; 94% of 947 ([Steam](https://store.steampowered.com/app/2471970/Planetary_Life/)).
- **Sipho** (1.0 Sept 2023): build a colonial creature from functional zooids; bosses unlock parts, New Game Plus adds mutations; 83% of 342 ([Steam](https://store.steampowered.com/app/809310/)).
- **Elysian Eclipse** (unreleased): parts come from microfossils, larger microbes hunt you, seven stages planned ([devlog](https://wauzmons.itch.io/elysian-eclipse/devlog/341580/elysian-log-1-the-beginning)).
- **Petri** (itch incremental): culture biomass and use a Gene Lab while the vessel scales from Petri dish to flask, bioreactor, greenhouse, lake and biosphere ([itch](https://hawke-nz.itch.io/petri)).
- **Petri Panic:** a 2026 physics merge puzzler in a petri dish ([Steam](https://store.steampowered.com/app/4896230)).
- **Biotix: Phage Genesis:** see *Immune-system and phage strategy* below.
- **Take:** the habitat scale ladder (Petri) as a progression spine; colony-organism building (Sipho) for a later phase.

#### Immune-system and phage strategy: Immune Defense and Biotix: Phage Genesis
- **Immune Defense** (Molecular Jig Games; pay-what-you-want demo, December 2014, shown at expos in 2015). Lead designer Melanie Stegman, Ph.D., funded by an NIAID grant, with science advice from Howard Young of the National Cancer Institute ([credits](https://www.molecularjig.com/immune-defense-game/immune-defense-2/credits-for-immune-defense/)). You "buy" white blood cells, change their surface molecules and drag inflammatory cytokines to activate cells and steer them at "real pathogens, using real surface molecules and signaling molecules"; neutrophils eat bacteria, and you can zoom in like a microscope. The developers call it "a tower defense game with moving towers". It grew out of an NIAID-funded study of their earlier *Immune Attack*. They admit the core loop "kept happening offscreen", that players "will likely need a walk through for Level 4", and that the demo is "not the whole game" ([Molecular Jig](https://www.molecularjig.com/immune-defense-game/immune-defense-2/)). A 2023 version for tablets and PCs is announced as coming soon ([Molecular Jig](https://www.molecularjig.com/)).
- **Biotix: Phage Genesis** (Ten Percent Red, free, 16 April 2018). You guide "the smallest of beings" in a "deadly viral fight": replicate and conquer hosts across four host-cell types (Normal, Regeneration, Defense, Speed), with an upgrade tree of 5 stats × 10 levels sold as "100.000 upgrade combinations", randomized enemies, challenge levels and cross-platform multiplayer. Mostly Positive, 73% of 38 ([Steam](https://store.steampowered.com/app/799060)).
- **Take:** real surface proteins as the pieces players read and swap (for Codon: receptors, porins, LPS); signal molecules you drag to steer cells (the autoinducer plume in 5.6); the immune and phage sides as ready reverse modes (1.7); host-cell types as terrain.
- **Avoid:** the core action happening off-screen; a difficulty wall that needs a walkthrough; stat-level upgrade trees that count combinations rather than change behaviour (2.4).

#### Older and tabletop peers: SimEarth, SimLife, the Fantastic Voyage lineage, Cytosis
- **SimEarth: The Living Planet** (Maxis, 1990). Will Wright with Fred Haslam; James Lovelock advised, and the game builds in his Gaia hypothesis plus a simplified Daisyworld option. You set atmosphere, temperature and landmasses, place life and watch it evolve over a planet's ten-billion-year life; prokaryotes and eukaryotes get special treatment, all multicellular taxa are equal (sapient molluscs are possible), and when the one sentient species dies out another can take its place. *Computer Gaming World* found it "absolutely fascinating" but wanted more SimCity-like visual feedback; *Entertainment Weekly* said it "has more variables (temperature, precipitation, etc.) than a polynomial equation"; Lovelock granted "a degree of realism" while calling it "little more than a game". It won the SPA's 1991 Best Simulation and Best Secondary Education awards ([Wikipedia](https://en.wikipedia.org/wiki/SimEarth)).
- **SimLife: The Genetic Playground** (Maxis, 1992; designer Ken Karakotsios). You modify the genetics of plants and animals, design environments and simulate evolution, aiming at a self-sustaining ecosystem. *Computer Gaming World* praised it for "neatly bridging the gap between entertainment and education", and it won a 1993 SPA CODiE for Best Simulation. The article cites no criticism and is flagged as under-sourced, so its reception is *not re-verified* beyond that ([Wikipedia](https://en.wikipedia.org/wiki/SimLife)).
- **The inside-the-body lineage: Fantastic Voyage and Microcosm.** In Richard Fleischer's film *Fantastic Voyage* (1966), a shrunken submarine crew is injected into a comatose scientist and has 60 minutes to clear a brain clot before regrowing; it won Oscars for art direction and special effects ([Wikipedia](https://en.wikipedia.org/wiki/Fantastic_Voyage)). The 1982 Atari 2600 game (Sirius Software for Fox Video Games) is a vertical shooter through the bloodstream: shoot enzymes, dodge antibodies, never shoot blood cells. Reviews were mixed and often compared it unfavourably with *River Raid*; Taito made a Japan-only arcade version, *Bio-Attack* (1983) ([Wikipedia](https://en.wikipedia.org/wiki/Fantastic_Voyage_(video_game))). Psygnosis' *Microcosm* (1993; FM Towns, then Sega CD, 3DO, CD32 and DOS) is a rail shooter with shrunken submarines inside a corporate president's body. Critics praised the visuals and panned the play: "a decidedly average *Space Harrier* clone that certainly looks great, but plays horribly" (*Amiga Format*); Psygnosis "forgot to make a game" (*Computer Gaming World*). Psygnosis said it sold well anyway ([Wikipedia](https://en.wikipedia.org/wiki/Microcosm_(video_game))). Pathogenic's in-host shooting belongs to this lineage.
- **Cytosis: A Cell Biology Game** (Genius Games; first edition 2017, *year not re-verified*). For 2–5 players, 60–90 minutes, ages 10+: worker placement, resource management and set collection. Players place workers on organelles (nucleus, free ribosomes, rough and smooth ER, Golgi), gather resources such as carbohydrates and ATP, and score health points by building enzymes, hormones and hormone receptors; "translating mRNA into Proteins" is one of the actions. Endorsed by the *Journal of Cell Science*; Dice Tower Seal of Approval ([Genius Games](https://www.geniusgames.org/products/cytosis-a-cell-biology-game-a-science-accurate-strategy-board-game-about-building-proteins-carbohydrates-enzymes-organelles-membranes)). A plant-cell sibling, *Cellulose* (1–5 players), is about photosynthesis, carbohydrates and building the cell wall ([Genius Games](https://www.geniusgames.org/products/cellulose-a-plant-cell-biology-game-mensa-recommended-strategic-board-game-about-photosynthesis-dna-biochemistry)). Other tabletop biology games were not checked.
- **What this changes.** Tabletop has already made gene expression a turn-by-turn action, so Codon's "genes as the interface" claim is scoped to video games (1.1 #8, 7). Maxis already sold genetics and planet-scale evolution as sandboxes in the early 1990s; Codon's difference is a player character, a run and a goal.
- **Take:** life and atmosphere that reshape each other (SimEarth's Gaia model) for the oxygen-fuse world event (4.12); "any lineage can take the lead after an extinction" for sister-lineage continuation; "Genetic Playground" as the spirit of the Lab sandbox (5.17); Fantastic Voyage's 60-minute deadline as a model for the dew clock, and "never shoot the host's own cells" as a friendly-fire rule players already understand; Cytosis' organelle worker spots as a template for a colony or expression view, and its science-journal endorsement as a credential worth seeking.
- **Avoid:** a variables-first interface with little visual feedback (SimEarth); "build a self-sustaining ecosystem" as the only goal (keep it for the Lab, 6.2); spectacle over play (Microcosm); a piloted vehicle that keeps the player outside the biology (Codon's hero *is* the cell); a eukaryotic textbook tour (ER, Golgi) as a bacterium's board, since a bacterium's equivalent spots are the ribosomes, the membrane and the nucleoid.

#### Citizen science: Foldit and Eterna
- Foldit players produced a model of the M-PMV retroviral protease good enough to solve its structure in about ten days of a three-week puzzle, after it had stumped scientists for over a decade ([ScienceDaily](https://www.sciencedaily.com/releases/2011/09/110918144955.htm); [Foldit](https://en.wikipedia.org/wiki/Foldit); [Khatib et al. 2011](https://doi.org/10.1038/nsmb.2119)). Eterna has about 100,000 registered players; in one study players solved all 100 RNA design challenges where algorithms fell short ([FierceBiotech](https://www.fiercebiotech.com/r-d/gamers-crush-algorithms-rna-structure-design-challenge)).
- **Take:** real sequences carry prestige; an optional "real protein" puzzle layer or post-game would be honest and on-brand. **Avoid:** puzzle UIs only experts can read.

### 1.4 Cross-cutting patterns

**What wins**
- **Short runs with a carried-over lineage.** Pathogenic, Everything is Crab and Primordialis grew where Spore's 15-minute stage stopped.
- **Building the body physically**, where placement and shape change behaviour (Spore cell stage, Pathogenic, Primordialis).
- **Visible transformation on every choice** (Everything is Crab, Pathogenic).
- **One legible tension** (Plague Inc's infectivity vs visibility; Osmos's thrust vs mass).
- **Trait value that depends on the surroundings** (Evolution board game).
- **Calm beauty and music** (flOw, Osmos, Equilinox).
- **User content** (Sporepedia's 100M creations, Plague Inc's 10k scenarios, Cell Lab's gene fridge, Ecosystem's Workshop).
- **$9.99–$19.99 plus a demo.** Pathogenic launched at $9.99 after a free demo whose progress carried over into the full game ([TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm)); the demo's player count is unverified.

**What fails**
| Failure | Seen in |
|---|---|
| Unexplained mechanics and deaths | Primordialis, Niche, Lifecraft, Thrive, Microcosmum, CellCraft |
| Performance at scale | Thrive, The Sapling, Species, Ecosystem, Pathogenic |
| Evolution that feels shallow or slider-like | The Sapling, Ecosystem, Niche, Thrive, Spore |
| Empty space and waiting | Thrive, Ecosystem |
| No agency | Species, Cell to Singularity |
| RNG deciding outcomes | Pathogenic builds, Plague Inc's Greenland, Niche |
| Abandonment | Species, Equilinox |
| Predatory F2P | Cell to Singularity |
| Misleading scope or modes | Spore previews, Pathogenic co-op |
| Science sold as accurate when it isn't | Spore ("Flunking Spore", [Game Developer](https://www.gamedeveloper.com/game-platforms/gdc-lessons-learned-from-i-spore-i-its-science-and-more)) |

### 1.5 The open gap Codon can own

None of these games:
1. uses **genes and their expression** (DNA → mRNA → protein you can watch) as the progression interface;
2. plays a **bacterium as a bacterium**, with the real horizontal-gene-transfer routes (plasmids, conjugation, transformation, transduction) as the main loot source (loot-from-kills in Pathogenic and Strange Seed, and Thrive's endosymbiosis, are the nearest analogues);
3. makes **metabolism readable in the world** rather than in panels;
4. renders cells as **raymarched volumes**. No peer we found does: Thrive is 3D seen from above; Species, Ecosystem, Equilinox and The Sapling are 3D; Spore's cell stage plays on a 2D plane; Pathogenic and Everything is Crab are 2D ([Steam](https://store.steampowered.com/app/3526710));
5. models **chemotaxis on real gradients** (run-and-tumble), which fixes Spore's directionless swimming;
6. gives the hero a **wall-less, flowing L-form body** whose shape is a mechanic.

Real biology supports the hook:
- L-form bacteria divide by blebbing and tubulation without FtsZ; excess membrane synthesis is enough to drive it (Mercier, Kawai and Errington 2013, [Harvard Origins](https://origins.harvard.edu/event/cell-wall-deficient-l-form-bacteria-mechanism-proliferation-and-implications-emergence.md)), and the mechanism is conserved across bacterial lineages ([eLife 2014](https://elifesciences.org/articles/04629.pdf)).
- *Gemmata obscuriglobus* takes up whole proteins by an energy-dependent, endocytosis-like process ([PNAS 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973)).
- Genes carry real trade-offs. E. coli's LamB is both the maltose porin and the receptor phage lambda uses to infect ([IMR Press review](https://www.imrpress.com/journal/fbl/8/6/10.2741/1046)).

### 1.6 Story framings in peers

- **Spore:** a meteor delivers life ([Wikipedia](https://en.wikipedia.org/wiki/Spore_(2008_video_game))).
- **Tasty Planet:** a scientist's accident starts inside a human body and ends in the galaxy ([Gamezebo](https://www.gamezebo.com/reviews/tasty-planet-review/)).
- **CellCraft:** aliens seed DNA, and the story justifies the unlock order ([Game Developer](https://gamedeveloper.com/game-platforms/analysis-golgi-bodies---storytelling-in-i-cellcraft-i-)).
- **Cell to Singularity:** an AI narrator reboots a simulation ([Wikipedia](https://en.wikipedia.org/wiki/Cell_to_Singularity)).
- **flOw:** wordless descent ([Wikipedia](https://en.wikipedia.org/wiki/Flow_(video_game))).
- **Fantastic Voyage and Microcosm:** humans shrunk and injected into a body on a deadline; the micro world is a place visited in a vehicle, not lived in ([Wikipedia](https://en.wikipedia.org/wiki/Fantastic_Voyage), [Wikipedia](https://en.wikipedia.org/wiki/Microcosm_(video_game))).
- **SimEarth:** a planet's whole ten-billion-year life seen from above, with life and atmosphere shaping each other ([Wikipedia](https://en.wikipedia.org/wiki/SimEarth)).
- **A real anchor for the magnifier seed.** Leeuwenhoek's letter of 9 October 1676 to the Royal Society reported "little animals" in rain, well, sea and snow water and in pepper water, seen through a single-lens microscope ([Leeuwenhoek 1677, *Phil. Trans.*](https://doi.org/10.1098/rstl.1677.0003)). He first noticed them in standing rainwater in 1675; Hooke confirmed the pepper-water results in 1677–78 ([McCrone](https://www.mccrone.com/mm/vintage-visits-leeuwenhoek-peppercorn-observations/)). A person with a lens over a drop of water is how microbiology really began.

### 1.7 What this means for Codon's first playable loop

Synthesized suggestions, not facts.
- **One drop is one run.** Each habitat (dew bead, rain puddle, pond film, gut) is a biome with a natural clock. A dew drop evaporates at sunrise, ending the run and forcing dispersal (encyst, hitchhike on an aphid, ride a splash). The magnifier opening can show the first drop.
- **Loot is genes.** Lysed rivals spill DNA (transformation); willing partners pass plasmids (conjugation, a social choice); phages are a gamble of new genes, lysogeny or death (transduction). Each pickup is a named real protein with one or two trade-offs, e.g. LamB = more maltose, but a lambda receptor.
- **Expression is the economy.** A gene does nothing until transcribed and translated. Ribosome time, amino acids and ATP are the build budget; the protein visibly arrives and installs itself (no pop-in). Operons and promoters let power users switch genes on and off, a Cell Lab-style programming layer.
- **Placement and shape matter.** Flagella, receptor patches and porins sit on a flowing membrane. Membrane-synthesis rate shapes blebbing division; osmotic stress grows with size because there is no wall. Re-evolving a wall is a tree node with a real cost (protection, but no engulfment).
- **An endocytosis ladder grounded in Gemmata:** protein uptake, then particles, then whole cells; keeping an engulfed cell alive opens endosymbiosis. Thrive already ships endosymbiosis ([Steam](https://store.steampowered.com/app/1779200/Thrive/)), so Codon's difference is the staged, failure-prone domestication arc (4.10), not the feature itself.
- **One core tension per biome, Plague-style**, e.g. growth vs detection (secreted enzymes feed you but leave a trail predators and phages follow), or size vs osmotic fragility.
- **Readability first.** A diegetic HUD (the energy route is the health bar); a post-mortem autopsy that replays which pathway failed (ATP crash, osmotic lysis, phage entry, toxin) with a one-line biology note; a threat palette that contrasts with the pale world.
- **A lineage tree as meta-progression.** Each run adds a branch; resume from any surviving branch (fixes Thrive's point of no return). Background rivals evolve (auto-evo-lite) and respond to your most expressed surface proteins (frequency-dependent value, from the Evolution board game).
- **Scale ladder, price and scope.** Biomes step up in scale (dew, puddle, pond, soil, gut) with prey-predator flips (Feeding Frenzy, Tasty Planet, mope.io). Target $9.99–$19.99 with a demo built around one perfect dew-drop run for Steam Next Fest. Ship one coherent stage deep rather than many shallow ones. Post visible regular updates. Plan performance from day one.
- **Later:** reverse modes (play the phage, the ciliate or an immune cell; Biotix and Immune Defense already play the phage and immune sides, 1.3); a Gene Fridge and Workshop with daily seeded drops; a Cell Lab-style challenge lab whose puzzles unlock real genes; a Codex of real organisms and proteins that states honestly where the game invents; a comic convergent-evolution running gag for marketing (every lineage drifts toward becoming a eukaryote).

---

## 2. Progression, build-crafting and tree design across genres

**Scope.** What makes an "evolution tree on everything" exciting rather than a chore; how trees create build identity, discovery and replay; and which biology facts keep Codon's versions honest.

### 2.1 Twelve lessons

1. **Nodes should change verbs, not only numbers.** Players praise Last Epoch's per-skill trees and Path of Exile's keystones, and criticise PoE2's small "+x%" and travel nodes ([PC Gamer](https://www.pcgamer.com/last-epoch-puts-a-brilliant-new-twist-on-the-diablo-and-path-of-exile-skill-systems), [PoE forum](https://www.pathofexile.com/forum/view-thread/3649980)).
2. **Synergy should come from shared keywords, not hand-made pairs.** Balatro's developer: Jokers "should synergize with general keywords/stats, NOT specific Jokers" ([LocalThunk on r/balatro](https://www.reddit.com/r/balatro/comments/1czo9g0/guidelines_for_joker_design/)). A cell already works this way: proton motive force, ATP, NADH, membrane area, pH and redox couple everything.
3. **Combinations should be discoverable, then readable.** Vampire Survivors evolutions need a max-level weapon, its matching passive and a chest ([wiki](https://vampire.survivors.wiki/w/Evolution)). Isaac's creator now calls the missing item descriptions the game's "biggest flaw" ([GamesRadar](https://www.gamesradar.com/the-creator-of-one-of-the-most-popular-roguelikes-of-all-time-is-using-his-new-project-to-right-11-year-old-wrongs)).
4. **Form must matter.** Spore's creature parts carried fixed stats, so "the player's creativity in designing the creature's shape has no impact on actual gameplay" ([Designer Notes](https://www.designer-notes.com/spore-my-view-of-the-elephant/)). Codon's shape-fluid hero should make morphology part of the build.
5. **Unlock by doing, not only by spending.** Factorio 2.0's "trigger technologies" complete by crafting or mining ([FFF #376](https://direct.factorio.com/blog/post/fff-376)); Civ VI has Eurekas, Kerbal earns science from biomes, Thrive has organelle unlock conditions. Codon can tie gene unlocks to living in real environments.
6. **Use a budget, not an endless list.** Hollow Knight gives 3–11 charm notches ([wiki](https://hollowknight.wiki/w/Charm_Notches)); Last Epoch gives 5 specialization slots ([Maxroll](https://maxroll.gg/last-epoch/resources/passives-and-skills)). Biology supplies a real budget: proteome allocation and the metabolic burden of expressing proteins ([Scott et al. 2010 via Physics Today](https://physicstoday.aip.org/news/cell-growth-gene-expression-and-their-interdependence), [PLoS ONE 2014](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4186888/)).
7. **Offer real, ideally exclusive, trade-offs:** Hades' paired Mirror talents ([wiki](https://hades.wiki.fextralife.com/Mirror+of+the+Night)), PoE keystones, Pokémon's B-button evolution cancel ([Bulbapedia](https://bulbapedia.bulbagarden.net:443/wiki/Evolution_prevention)), Hollow Knight's overcharm, which doubles damage taken ([wiki](https://hollowknight.wiki/w/Overcharmed)).
8. **Meta-progression should add options more than power, and death should move the story.** In Hades, "The story would advance when you died" ([Inlander](https://inlander.com/culture/hades-writer-greg-kasavin-on-how-he-made-video-game-deaths-drive-a-feel-good-story-22725237)). Rogue Legacy's rising-cost grind is the counter-example ([user-review summary](https://vaporlens.app/app/241600/rogue_legacy.md)).
9. **Difficulty should be opt-in, tunable and rewarding.** Hades' Pact of Punishment came from Slay the Spire's Ascension ([Supergiant AMA](https://www.reddit.com/r/NintendoSwitch/comments/ixri6b/we_are_supergiant_games_creators_of_hades_pyre/g68pi3o/)). Codon's levers would be real stressors: antibiotics, phage, pH, temperature, starvation.
10. **Programming-as-play works when tools and challenges are designed separately and solutions are shared.** Opus Magnum compares solutions in histograms and its marketing was GIFs ([PCGamesInsider](https://www.pcgamesinsider.biz/success-story/66636/our-marketing-was-making-the-game-shit-out-gifs-that-everyone-would-put-on-twitter-zach-barth-takes-us-behind-the-scenes-on-opus-magnum/)). Gene regulation really is programmable logic: the 2000 toggle switch and repressilator, and Cello's Verilog-to-DNA compiler ([PubMed](https://pubmed.ncbi.nlm.nih.gov/27034378/)).
11. **Track pick rates from the prototype on.** Slay the Spire's team: a card nobody picks is "basically not a card in our game at that point" ([Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)).
12. **Biology already has "alternate recipes" and "potentiated unlocks".** Two real glycolysis variants trade ATP yield against enzyme cost ([Flamholz 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3683749)). Lenski's E. coli evolved citrate use only after an earlier potentiating mutation ([Blount 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2430337)). Codon can stage what biology already did.

### 2.2 Game by game

#### Path of Exile 1 and 2: the sprawling passive web
- **What it does.** One shared tree of about 1,325 passives, with each class starting in a different region ([official tree](https://pathofexile.com/passive-skill-tree)). Node types: small passives, notables, keystones, masteries (PoE1) and jewel sockets ([poe-vault guide](https://www.poe-vault.com/guides/path-of-exile-beginner-guide-learning-the-passive-tree)). Keystones are large rule changes you "have to mold your build around" ([Mobalytics PoE2 guide](https://mobalytics.gg/poe-2/guides/passive-skill-tree)). Guides send new players to planners such as Path of Building ([Maxroll](https://maxroll.gg/poe/getting-started/passive-skill-tree-for-beginners)).
- **PoE2 complaints.** More than 1,500 nodes but 122 points (about 8%), "bloated and overwhelming" ([forum](https://www.pathofexile.com/forum/view-thread/3767066)); the redesign "significantly killed the variety and viability of many builds", and small nodes are so weak that players fill the tree with jewel sockets ([forum](https://www.pathofexile.com/forum/view-thread/3649980)); "The passive tree has WAY TOO MANY travel nodes" ([forum](https://www.pathofexile.com/forum/view-thread/3674817)).
- **Take:** one readable map of where your lineage has been; keystones as rule changes with a cost; several starting points (one per origin species or environment); sockets that accept found genes.
- **Avoid:** a tree that needs an external planner; filler and travel nodes; small nodes too weak to feel.

#### Last Epoch: a tree per skill (the model for "a tree for every organelle")
- Every skill has its own specialization tree that changes how it behaves; Smoke Bomb alone has 30 nodes ([GodisaGeek](https://godisageek.com/reviews/last-epoch-review/)). Players get 5 specialization slots ([Maxroll](https://maxroll.gg/last-epoch/resources/passives-and-skills)). PC Gamer: "a brilliant evolution of Path of Exile's labyrinthine web of upgrades and Diablo 3's rune modifications" ([PC Gamer](https://www.pcgamer.com/last-epoch-puts-a-brilliant-new-twist-on-the-diablo-and-path-of-exile-skill-systems)); the same skill "can vary dramatically" between builds ([Invenglobal](https://www.invenglobal.com/articles/26283/what-makes-last-epoch-different-unique-systems-overview)).
- **Take:** a small tree per structure (flagellum, membrane, transporters, ATP synthase, ribosomes, nucleoid, secretion systems, sensors), 10–30 nodes each, mostly behaviour-changing, with a proteome budget capping how many go deep. **Avoid:** trees made of percentages.

#### Grim Dawn: constellations, affinities and powers that grow with use
- Devotion points come from restoring shrines (up to 55 with the expansion). Constellations need Affinity in five types (Ascendant, Chaos, Eldritch, Order, Primordial), earned by completing other constellations. Celestial Powers bind to skills and gain XP only while used, up to level 20, 15 or 10 by tier; a respec keeps the XP ([official guide](https://www.grimdawn.com/guide/character/devotion)). 79 constellations, 3–8 stars each, 425 total ([Grim Misadventure #82](https://forums.crateentertainment.com/t/grim-misadventure-82-how-devoted-are-you/29152)).
- Reviewers report "literally hundreds of builds" ([GameBanshee review](https://gamebanshee.com/kxh6h)). Complaint: "Higher tier constellations are almost mandatory for a build, then you are almost forced to pick a set of lower ones" ([Crate forum](https://forums.crateentertainment.com/t/thoughts-on-devotion-setup-cold-caster-reaper/115365)); new players find it hard to parse ([RAWG reviews](https://rawg.io/games/grim-dawn/reviews)).
- **Take:** affinity currencies as lifestyle chemistry (redox, light, sulfur, nitrogen, predation) that gate exotic lifestyles; genes that level with use (adaptive refinement is real, see 2.3); respecs that keep progress.
- **Avoid:** gates that force everyone through the same nodes; dense maps without a "what this does for my cell" preview.

#### Slay the Spire (and Slay the Spire 2): data-driven synergy drafting
- Pick one of a few card rewards after fights, build archetypes, climb difficulty tiers. The team logged every decision from the prototype on: pick rate, presence in winning decks, what a card was picked over, damage taken against each enemy while holding it. Dashboards grew from "three graphs" to "at least 90"; archetypes were built "in batches"; single-player decks need not be equal ([Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder), [GDC 2019 talk](https://www.gdcvault.com/play/1025731/Slay-the-Spire-Metrics-Driven)).
- **StS2 warning.** Early access began 5 March 2026 with 94%+ positive reviews and a peak above 570,000 concurrent ([Notebookcheck](https://www.notebookcheck.net/Indie-roguelike-game-tops-Steam-charts-with-over-574-000-players-94-positive-reviews.1249048.0.html)). The first big balance patch drew thousands of negative reviews within a day ([GamesRadar](https://www.gamesradar.com/games/roguelike/slay-the-spire-2-devs-respond-to-a-flurry-of-bad-steam-reviews-aimed-at-its-first-balance-patch-this-progress-will-not-be-linear-and-no-change-is-necessarily-permanent/)).
- **Take:** a mutation draft at each division (pick 1 of 3, skip allowed); pick-rate logging from day one; archetypes built in batches ("phototroph", "predator", "biofilm builder").
- **Avoid:** big nerfs to loved archetypes after launch without a beta branch and clear communication.

#### Balatro: keyword synergy and multiplicative scaling
- Poker hands scored through a pool of 150 Jokers ([Journal du Geek](https://www.journaldugeek.com/2025/03/15/game-design-pourquoi-balatro-est-le-jeu-le-plus-addictif-de-sa-generation/)). LocalThunk's rules ([r/balatro](https://www.reddit.com/r/balatro/comments/1czo9g0/guidelines_for_joker_design/)): synergise with general keywords, never named Jokers (a named partner is "frustratingly rare" in a large pool); at most two parts, an effect plus an optional condition; three lines of text or fewer; powerful effects are conditional. 5 million copies within 11 months of the February 2024 launch ([Game Developer](https://gamedeveloper.com/business/balatro-sells-5-million-copies-after-end-of-year-spike)).
- **Take:** these rules port directly to gene cards. Each gene acts on a biological keyword (H+ gradient, ATP, NADH, membrane area, ROS, osmolarity, temperature, a metabolite family, "anything that rotates"), so synergy emerges and is truthful because cells are coupled through shared currencies.
- **Avoid:** bespoke gene-to-gene pairings as the main synergy source; they do not scale and become wiki lookups.

#### Hades: meta-progression where death advances the story
- The Mirror of Night has 12 talent pairs; only one of each pair is active (e.g. extra Death Defiance vs a weaker one that refreshes every chamber) ([wiki](https://hades.wiki.fextralife.com/Mirror+of+the+Night)), and upgrades "can be rescinded" ([Source Gaming](https://sourcegaming.info/2025/11/05/holism-why-hades-mattered/)). The Pact of Punishment has 15 stackable conditions ([TrueAchievements](https://www.trueachievements.com/game/Hades/walkthrough/7)); Hard Labor alone goes from +20% to +100% enemy damage ([RPG Site](https://www.rpgsite.net/feature/10287-hades-pact-of-punishment-heat-modifiers-and-how-to-maximize-your-rewards)); Heat is tracked per weapon ([Kotaku](https://kotaku.com/everything-you-need-to-know-about-hades-endgame-1845239105)). Kasavin: "The story would advance when you died" ([Inlander](https://inlander.com/culture/hades-writer-greg-kasavin-on-how-he-made-video-game-deaths-drive-a-feel-good-story-22725237)). Many channels of permanent progression ([Game Developer](https://gamedeveloper.com/design/how-supergiant-weaves-narrative-rewards-into-i-hades-i-cycle-of-perpetual-death)).
- **Take:** paired, refundable meta-talents (no "permanent mistake" anxiety); stressors as Heat (antibiotics, phage, UV, osmotic shock, starvation), each opt-in, better rewarded, and tied to a real resistance gene; every lysis reveals something to the observer, narrator or codex.
- **Avoid:** meta-progression that is only stat padding.

#### Rogue Legacy: heirs with traits, plus a grind warning
- On death you choose an heir with random traits: colour blindness (grayscale world), gigantism (50% larger), dwarfism (hidden passages) ([Haywire](https://haywiremag.com/columns/off-the-grid-rogue-legacy)). Permanent upgrades "steadily increase in cost", felt as "padding masquerading as difficulty" ([user-review summary](https://vaporlens.app/app/241600/rogue_legacy.md), [GameSpot user review](https://www.gamespot.com/rogue-legacy/user-reviews/2200-186341/)). PC Gamer says the sequel's traits "make light of genuine medical conditions" ([PC Gamer](https://www.pcgamer.com/rogue-legacy-2s-brutal-platforming-drags-down-the-action)).
- **Take:** binary fission is a natural heir picker; on death, continue as one of several sister lineages with visible random mutations.
- **Avoid:** exponential upgrade costs; disease as a joke.

#### Vampire Survivors and Brotato: evolutions and the shop-between-waves loop
- **Vampire Survivors.** A weapon evolves when fully levelled, paired with its passive item, and a chest is opened; most evolution chests come from bosses at or after 10 minutes (Whip + Hollow Heart = Bloody Tear). "Unions" merge two or more max-level weapons and free slots ([wiki](https://vampire.survivors.wiki/w/Evolution)). BAFTA Best Game and Game Design 2023 ([PC Gamer](https://pcgamer.com/vampire-survivors-beats-out-elden-ring-and-god-of-war-to-score-best-game-win-at-baftas)).
- **Brotato.** Characters are "calibrated slightly differently, to encourage a distinct play-style"; six weapon slots ([Rogueliker](https://rogueliker.com/brotato-review/)). Praised for variety ([Niche Gamer](https://nichegamer.com/reviews/brotato-review)); criticised for uneven builds, characters "shoehorned" into one build, and repetition ([review summary](https://vaporlens.app/app/1942280/brotato)).
- **Take:** real-biology evolutions (2.5); unions modelled on real homologous machines such as the flagellar export apparatus and the type III injectisome ([Cornelis 2006](https://doi.org/10.1038/nrmicro1526)); starting "strains" with rule constraints (obligate anaerobe, wall-less L-form).
- **Avoid:** starting strains with only one viable route.

#### The Binding of Isaac: hundreds of items and the description debt
- Repentance brought the total to 716 items, v1.7.5 to 719 ([wiki](https://bindingofisaacrebirth.wiki.gg/wiki/Items)). McMillen says Magic: The Gathering "totally changed my view on game design" and designed Repentance by "finding holes in item cycles or mechanics that weren't fully explored" ([GameGrin](https://gamegrin.com/articles/edmund-mcmillen-interview)). He calls missing on-screen descriptions the biggest flaw: "700+ items later, this idea simply doesn't work at all" ([GamesRadar](https://www.gamesradar.com/the-creator-of-one-of-the-most-popular-roguelikes-of-all-time-is-using-his-new-project-to-right-11-year-old-wrongs)). Repentance+ shows a description after an item's first pickup ([report](https://gamersocialclub.ca/2025/09/10/binding-of-isaac-gets-item-descriptions-in-new-patch)).
- **Take:** mystery on first encounter, clarity afterwards: the first time a protein is expressed the player watches what it does, then the codex shows its real function. Audit gene "cycles" for holes. **Avoid:** permanent opacity at scale.

#### Noita: the wand as a program (the model for operon editing)
- A wand has shuffle, spells per cast, cast delay, recharge, mana, capacity and spread. Spells read left to right; modifiers attach to the next projectile, multicasts group the following spells, triggers cast the next spell on impact, timers after a delay ([wiki](https://noita.wiki.gg/wiki/Guide:_Wand_Mechanics)). The expert guide calls it a card game with deck, hand and discard, where "modifiers modify projectiles", not spells ([wiki](https://noita.wiki.gg/wiki/Deck)). PC Gamer (81): it "trusts you to experiment… without guaranteeing that any of them will be effective" ([PC Gamer](https://www.pcgamer.com/noita-review/)); "your greatest enemy is always yourself" ([bit-tech](https://bit-tech.net/reviews/gaming/pc/noita-review/1)).
- **Take:** an operon editor that works like a wand: promoter, operator slots, an ordered gene list, terminator. Regulatory parts as modifiers, two-component sensors as triggers, noisy expression as shuffle. Self-destructive builds (runaway toxin expression) should be possible and funny.
- **Avoid:** wand-like rules only a wiki explains. Show the expression "draw order"; Codon already plans to show transcription and translation.

#### Spore: the editor-versus-gameplay lesson
- Johnson: "making five different games at once is a bad idea"; creature parts summed fixed stats so shape had no gameplay effect, while cell-stage placement did; the dilemma was "an interactive art museum or a customizable video game" ([Designer Notes](https://www.designer-notes.com/spore-my-view-of-the-elephant/)). Players still uploaded more than 100 million creations, over 31 million of them creatures, by May 2009, counting the free Creature Creator ([EA, archived](https://web.archive.org/web/20260103031624/https://www.ea.com/news/100-million-creatures-take-over-spore-universe); [Wired](https://www.wired.com/2009/05/spore-universe-tops-100-million-creations/)), against an estimated 2.8 million sales ([GamesBeat](https://gamesbeat.com/spores-creature-count-hits-100-million-what-does-it-portend/)). Its procedural animation was a major technical contribution ([Wikipedia: Chris Hecker](https://en.wikipedia.org/wiki/Chris_Hecker)).
- **Take:** the editor as a creative and sharing engine; physics as the stat (membrane area-to-volume, flagellum anchor points, porin density, the raymarched body's volume). **Avoid:** cosmetic parts with summed stats; many unrelated stages.

#### Pokémon, Digimon and Monster Rancher: conditional evolution and creature seeds
- **Pokémon.** Branching follows conditions: Eevee becomes Espeon or Umbreon by friendship by day or night, Leafeon or Glaceon near Moss or Ice rocks, with set priorities ([Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Eeveelution)). B cancels a level-up evolution (it triggers again later); the Everstone blocks it ([Bulbapedia](https://bulbapedia.bulbagarden.net:443/wiki/Evolution_prevention), [Everstone](https://bulbapedia.bulbagarden.net/wiki/Everstone)).
- **Digimon World.** Evolutions need 3 of 4 requirement groups (stats, weight, care mistakes, bonus); care mistakes reset at each evolution ([fan guide](https://docs.google.com/document/d/1aHHXZXjZNDabFTWUdF055M0oshyC57kff5NVc2BTYGE/mobilebasic)); meeting none gives Numemon ([Wikimon](https://wikimon.net/Evolution/Video_Games/Digimon_World_series)). Next Order reviews call digivolution grindy and unintuitive ([Nintendo Life](https://www.nintendolife.com/reviews/nintendo-switch/digimon-world-next-order), [Destructoid](https://destructoid.com/?p=197709)).
- **Monster Rancher.** Monsters generated from real music CDs; the DX re-release replaced the disc drive with a searchable database of CD titles ([CogConnected](https://cogconnected.com/review/monster-rancher-1-2-dx-review/), [Digital Chumps](https://digitalchumps.com/monster-rancher-1-2-dx-review-pc-steam)).
- **Take:** habitat-conditional branches (the same protein family takes different forms by pH, light or temperature); an "Everstone" choice to stay unevolved and keep a perk; a fail-forward "Blob" form (funny but viable) when no requirement is met; a "Gene Shrine" that seeds a gene from a real protein name in a curated database.
- **Avoid:** hidden requirements plus grind.

#### Creatures (1996), Mewgenics (2026) and Plague Inc: genetics as gameplay
- **Creatures.** A variable-length genome specifies both the neural network and the biochemistry ([Sussex tech report](https://www.sussex.ac.uk/informatics/cogslib/reports/csrp/csrp434.pdf)). Haploid genetics; faulty genomes gave Norns that could not see or hear, or were immortal; players engineered and swapped breeds; a Norn lives about 40 hours; about 500,000 copies by mid-1998; Dawkins praised it. A Creatures 2 creature was found to be in constant pain by design, which caused uproar ([Wikipedia](https://en.wikipedia.org/wiki/Creatures_(video_game_series))).
- **Mewgenics** (10 February 2026). Cats are bred between runs "to combine their stats"; the reviewer wanted "a menu to organize them by stats or age" and found culling turned into "cat eugenics" ([Game Informer, 8/10](https://www.gameinformer.com/review/mewgenics/a-tale-of-two-kitties)). Players report needing spreadsheets ([summary](https://vaporlens.app/app/686060/mewgenics.md)).
- **Plague Inc.** Each trait evolved or devolved raises the cost of the others; devolving refunds DNA points ([wiki](https://plagueinc.wiki.gg/wiki/DNA_Point)).
- **Take:** a true genotype-to-phenotype pipeline where weird breakage is allowed and shareable; a built-in lineage browser; rising marginal costs as anti-snowball; gene loss as a legitimate move (real bacteria do it).
- **Avoid:** bookkeeping that needs spreadsheets; selection framing that makes players feel bad.

#### Thrive: organelle unlock conditions
- In 0.6.5 Thrive locked organelles behind four condition types: a compound level in your patch, keeping an organelle for several generations, engulfing a number of cells, or excess ATP, for "a greater sense of progression and achievement" ([devblog](https://revolutionarygamesstudio.com/devblog-40-unlocking-potential/)). It can be turned off ([GamingOnLinux](https://www.gamingonlinux.com/2024/02/free-and-open-source-evolution-sim-thrive-gets-big-new-gameplay-features-in-v065)). v0.8 lowered the gas thresholds and added a tooltip naming endosymbiosis as an alternative route ([GamingOnLinux](https://gamingonlinux.com/2024/12/open-source-evolution-sim-thrive-v08-brings-more-graphics-improvements-and-new-game-mechanics)).
- **Take:** condition-based unlocks with endosymbiosis as an alternate route. **Avoid:** shipping thresholds and hints late; show unlock hints and progress bars from the start.

#### Factorio, Shapez 2, Satisfactory and Oxygen Not Included: the cell as a factory
- **Factorio 2.0** trigger technologies complete by mining an entity, crafting an item or launching a rocket, which fixed researching nuclear power without finding uranium. Wube: progression "always feels much better… when your progression starts as low as possible" ([FFF #376](https://direct.factorio.com/blog/post/fff-376)).
- **Satisfactory.** Hard drives from 118 crash sites offer a choice of alternate recipes; the wiki lists 106 alternates ([wiki](https://satisfactory.wiki.gg/wiki/Hard_Drive)).
- **Shapez 2.** About 97% positive of roughly 13,500 reviews at its April 2026 1.0 ([GameMeca](https://www.gamemeca.com/en/mv.php?gid=1774505)); praised as "relaxing" pure automation, criticised for slow speed and repetition ([summary](https://vaporlens.app/app/2162800/shapez_2)).
- **Oxygen Not Included.** Temperature, oxygen, food, stress and germs "all impact one another" ([Gamereactor](https://msn.gamereactor.eu/oxygen-not-included-review/)); the learning curve is the common complaint ([summary](https://vaporlens.app/app/457140/oxygen_not_included)). Critter morphs drift with diet and temperature: a Hatch fed sedimentary rock reaches about a 77% chance of Stone Hatch eggs after 30 cycles; the Shine Bug line chains seven diet-tied morphs ([wiki](https://oxygennotincluded.wiki.gg/wiki/Critter_Morphs)).
- **Take:** the energy route as a production chain (PTS uptake, glycolysis, TCA, ETC, ATP synthase) with bottlenecks as visible jams; lysed-cell DNA as Satisfactory hard drives (absorb it, choose 1 of 2 genes); real alternate pathways (EMP vs ED); ONI-style morph drift toward diet and habitat.
- **Avoid:** opaque, overwhelming coupling at the start; introduce one system at a time.

#### Opus Magnum, Zachtronics and Turing Complete: programming as play
- Opus Magnum shows histograms of every player's cost, cycles and area ([Engadget](https://www.engadget.com/2018-07-09-opus-magnum-zachtronics-irl.html)). Barth: "The tools and the challenges are specifically designed separately so you can apply the tools in any number of ways"; the GIFs were "the closest thing to our elevator pitch" ([PCGamesInsider](https://www.pcgamesinsider.biz/success-story/66636/our-marketing-was-making-the-game-shit-out-gifs-that-everyone-would-put-on-twitter-zach-barth-takes-us-behind-the-scenes-on-opus-magnum/)); "People see themselves at the wrong end of the graph and say… 'I can do better'" ([Game Developer](https://gamedeveloper.com/business/building-an-i-infinifactory-i-how-to-turn-science-into-a-successful-game)). Turing Complete climbs from NAND gates to a CPU and your own assembly language; 94% of 3,106, in Early Access since 2021 ([Steam](https://store.steampowered.com/app/1444480/Turing_Complete)).
- **Take:** a Regulation Lab scoring real circuits on DNA length (bp), response time and growth burden, with GIF export; a Turing Complete-style climb from promoter to repressor (NOT), AND, memory (toggle) and clock (repressilator).
- **Avoid:** making the action loop depend on puzzles; keep the lab optional and let its circuits plug into runs.

#### Kerbal Space Program: engineering by trial
- Science comes from experiments in different biomes and situations, counts only once returned, and unlocks part nodes; the full tree costs 18,468 science ([KSP wiki: science](https://wiki.kerbalspaceprogram.com/wiki/Science_points), [tech tree](https://wiki.kerbalspaceprogram.com/wiki/Tech_tree)). The Space Center's 33 biomes get farmed ([KSP forum](https://forum.kerbalspaceprogram.com/topic/108851-cutting-down-early-game-science-grind)). Failure is designed as a "thrill" ([Film Stories](https://filmstories.co.uk/features/fly-me-to-the-mun-the-past-and-future-of-kerbal-space-program/), [Alist Daily](https://www.alistdaily.com/news/one-giant-leap/)).
- **Take:** discovery by sampling environments; a petri-dish sandbox where lysis and osmotic burst are spectacular, informative failures. **Avoid:** farmable discovery; each environment yields once or diminishes.

#### Civilization VI and VII: boosts and resets
- Almost every Civ VI tech has a quest-like "Eureka" boost; Ed Beach wanted no "standard playbook" ([Game Informer](https://gameinformer.com/b/features/archive/2016/05/11/civilization-vi-coming-october-21-big-changes-to-core-gameplay), [Game Developer](https://gamedeveloper.com/design/-i-civilization-vi-i-s-lead-designer-wants-to-shake-up-players)). Civ VII splits trees by Age; reception is Mixed (about 48% on Steam), focused on abrupt ages and the "premature end of the technology tree" ([ScalaCube](https://scalacube.com/blog/news/civilization-7-receiving-mixed-reviews-on-steam), [WikiMili](https://wikimili.com/en/Civilization_VII)).
- **Take:** Eurekas: using a structure in context speeds its tree (surviving osmotic shocks boosts mechanosensitive-channel nodes). **Avoid:** resets that wipe a build's identity between eras; carry lineage history from prokaryote into endosymbiosis.

#### Stellaris: ascension paths and gene modding
- The genetic ascension path edits species traits; later reworks folded ascension paths into tradition trees ([dev diary 270](https://forum.paradoxplaza.com/forum/developer-diary/stellaris-dev-diary-270-traditional-results-of-summer-experiments.1545411/page-15)). BioGenesis (2025) added 16 traits and a "mutable tradition tree". Its Evolutionary Predators origin "allows a species to absorb the genetic advantages of its prey in the form of traits", and its Malleable Genes trait "will automatically select new traits to apply to workers" ([CGM](https://www.cgmagonline.com/review/game/stellaris-biogenesis-dlc-review)); one reviewer sums the predator play up as "go out and eat stuff and absorb its genes" ([DBLTAP](https://www.dbltap.com/reviews/stellaris-biogenesis-review)). Steam reviews dropped, which PCGamesN attributes to the 4.0 update rather than the DLC ([PCGamesN](https://www.pcgamesn.com/stellaris/steam-reviews-dlc)).
- **Take:** late-run lifestyle commitments, each a mutable tree (phototroph, phagotroph or predator, symbiont, biofilm or colony); Evolutionary Predators is a strategy-game analogue of the pitch's "genetic theft" (traits absorbed by eating, not a real transfer route), and the origin DBLTAP's reviewer would "heartily recommend" to Zerg and Tyranid fans. **Avoid:** shipping a systemic rework together with content.

#### Cultist Simulator: discovery-first design
- Kennedy wanted players to discover the strategy ([Wikipedia](https://en.wikipedia.org/wiki/Cultist_Simulator)). The team later admitted "we should have seen and addressed the issue earlier", wrote clues "obscure enough" yet "apparent enough" late, and reached a mass audience it was not designed for, at about 73% on Steam ([retrospective](https://www.gamedeveloper.com/business/cultist-simulator-the-retrospective)). RPGFan: "trial and error-based gameplay sans tutorial" ([RPGFan](https://www.rpgfan.com/review/cultist-simulator/)). Academics study such "inscrutable games" ([Kirman et al. 2022](https://eprints.whiterose.ac.uk/192953/1/Mindtrek_2022_Inscrutable_Games_and_NLFS_2_AuthorsVer.pdf)).
- **Take:** the joy of combining things to see what happens. **Avoid:** opacity with no clue layer; budget for hint-writing early.

#### Hollow Knight and Dead Cells: budgets, and meta that adds options
- Hollow Knight: 3 notches growing to 11, charms swapped only at benches ([wiki](https://hollowknight.wiki/w/Charm_Notches)); overcharming exceeds the budget but doubles damage taken ([wiki](https://hollowknight.wiki/w/Overcharmed)).
- Dead Cells: blueprints add weapons to the drop pool, each "providing a new way to play" ([TV Tropes](https://www.tvtropes.org/pmwiki/pmwiki.php/VideoGame/DeadCells)); "unlock variety… not power" ([note](https://saschb2b.github.io/game-mechanics/concepts/meta-as-variety-not-power)).
- **Take:** the budget plus an overcharm risk; meta unlocks that grow the gene pool.

#### Design theory
- Sid Meier's GDC 2012 "Interesting Decisions": trade-offs, customization, long-term vs short-term benefit; "something that's interesting you do once doesn't mean it's something interesting to do ten times" ([Game Developer](https://gamedeveloper.com/design/gdc-2012-sid-meier-on-how-to-see-games-as-sets-of-interesting-decisions)).

### 2.3 Biology that maps onto these systems

To be checked against the biology sweep (section 4).
- **The proteome budget is real (the notch system).** Ribosomal and metabolic proteins compete for a fixed proteome share, and ribosome content rises linearly with growth rate (Scott et al., Science 2010, [Physics Today](https://physicstoday.aip.org/news/cell-growth-gene-expression-and-their-interdependence)). Foreign protein costs about 3% relative growth per 1% of the proteome ([PLoS ONE 2014](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4186888/)). A plasmid's main cost is expressing its genes, not replicating it ([review](https://pmc.ncbi.nlm.nih.gov/articles/PMC11687550)). This gives an honest "overcharm": expressing more raises power and slows division.
- **Real alternate recipes.** Entner-Doudoroff yields 1 ATP per glucose and EMP 2, but ED needs several-fold less enzyme ([Flamholz 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3683749)).
- **Potentiation and unlock chains.** In Lenski's experiment citrate use (Cit+) appeared around generation 31,500 and depended on potentiating mutations from about generation 20,000 ([Blount 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2430337)); a later refinement mutation improved it ([eLife](https://elifesciences.org/content/4/e09696)).
- **Regulation as logic.** The lac operon behaves roughly as "lactose AND NOT glucose", though the real input function is more graded than a gate, an honest caveat to show ([Setty et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC164651)). The 2000 toggle switch ([Gardner et al.](https://sites.ecse.rpi.edu/~agung/ese680files/gardner00.pdf)) and repressilator ([overview](https://Www.Wikipedia.org/wiki/Synthetic_biological_circuit)) were built in E. coli. Cello compiled Verilog into 60 E. coli circuits ([PubMed](https://pubmed.ncbi.nlm.nih.gov/27034378/)), though about a quarter reportedly failed ([Scientific American](https://www.scientificamerican.com/podcast/episode/cellular-circuit-computes-with-dna/)): honest puzzle friction.
- **Real gene theft.** E. coli given proteorhodopsin swims under green light when respiration is blocked, up to 70% faster ([Walter 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC1838496), [Berkeley Lab](https://www2.lbl.gov/Science-Articles/Archive/PBD-proteorhodopsin.html)). About 30 magnetosome genes moved into another bacterium made it magnetic ([Kolinko 2014](https://pubmed.ncbi.nlm.nih.gov/24561353/)).
- **Real "union" lineages.** The flagellum and the type III injectisome share a core export apparatus; the injectisome is thought to derive from the flagellum ([Cornelis 2006](https://doi.org/10.1038/nrmicro1526), [Annual Review 2023](https://www.pubmed.gov/37713458/)).
- **The hero's body.** L-forms divide by excess membrane synthesis that raises surface area relative to volume ([Mercier 2013](https://pmc.ncbi.nlm.nih.gov/articles/3603455)), so a membrane tree can literally drive reproduction.

### 2.4 Exciting versus a chore

| Exciting | Chore |
|---|---|
| Nodes change behaviour (Last Epoch, keystones, Noita) | +x% filler and travel nodes (PoE2) |
| Exclusive trade-offs (Hades pairs, overcharm) | Mandatory paths (Grim Dawn) |
| Keyword synergy (Balatro) | Bespoke pairs that need a wiki |
| Discovery, then legibility (Isaac Repentance+) | Permanent opacity (early Isaac, Cultist Simulator) |
| Unlock by doing (Factorio, Eurekas, Thrive) | Grind with rising costs (Rogue Legacy, Digimon) |
| Form equals function (Spore cell stage) | Cosmetic parts with summed stats (Spore creatures) |
| Meta adds options and advances the story (Hades, Dead Cells) | Meta as stat padding |
| Budgets force identity (Hollow Knight) | "Take everything" trees |
| Shareable outputs (Opus Magnum GIFs, Sporepedia) | Builds nobody can show |
| Data-tuned pick rates (Slay the Spire) | Untested dead options |

### 2.5 Proposed architecture: the "Tree of Everything"

1. **Run layer.** One lineage lives through a habitat. Each division is a draft: pick 1 of 3 from a point mutation, gene duplication, horizontal-transfer fragment or regulatory tweak; skipping banks a reroll. Gene cards follow Balatro's rules (one effect plus one condition, three lines or fewer, keyed to biological keywords, e.g. "anything powered by PMF gains X").
2. **Structure trees.** About 8–10 Last Epoch-style trees: membrane and envelope, motility, uptake and transport, energy (ETC and ATP synthase), expression machinery, nucleoid and DNA repair, secretion and defence, sensing, and later endomembranes. Each has 10–20 nodes and 1–3 keystones that visibly change morphology. Keystone examples: "Shed the Wall" (the hero's origin: engulfment, but no osmotic protection), "Obligate Anaerobe", "Drop the Flagellum" (save proteome and energy, lose motility), "Hypermutator" (more draft options, more harmful mutations). A proteome budget limits how many trees go deep; overexpression slows growth along the real burden curve.
3. **Regulation layer.** A Noita-style operon "wand" (promoter, operator slots, ordered genes). An optional Lab turns it into Zachtronics puzzles whose circuits install into runs.
4. **Metabolic layer.** A Factorio-style flux view with real alternate pathways (EMP vs ED, fermentation branches) and bottlenecks as glowing jams.
5. **Meta layer: the Tree of Life codex.** A phylogeny of the forms you have found. Genes enter the pool by trigger (environment lived in, prey engulfed, stress survived) or by potentiation chains, with the codex revealing "you were one mutation away" after death. Hades-style paired, refundable talents (e.g. faster division vs larger daughters); opt-in stressors as Heat; each death reveals a story beat; on death, continue as one of 2–3 sister lineages.
6. **Honesty tags on every node:** "Real", "Real but exaggerated", "Real road not taken" or "Invented", with a flip-side "why this is true" card. *Superseded* by gameplay §0's five badges; the mapping is at the top of this digest.

**Example evolutions (Vampire Survivors-style):**
- Max flagellum + full chemoreceptor array → swarming.
- Flagellar export + effector genes → type III injectisome (real homology).
- Proteorhodopsin + PMF-coupled motility → green-light swimming (real).
- Magnetosome gene cluster + flagellum → magnetotaxis (real cluster transfer).
- Engulfed photosynthetic prey kept N generations → proto-plastid (invented pacing for a real process; tag it).

### 2.6 Build order and targets

1. **Vertical slice.** One habitat (the dew drop), about 40 gene cards on 8 keywords, 4 structure trees of about 8 nodes, 3 evolutions, the division draft, telemetry, and death leading to sister-lineage continuation.
2. **Codex and triggers.** Tree of Life, trigger unlocks with visible progress, first-pickup reveal of protein function.
3. **Stressor Heat plus a second habitat.**
4. **Horizontal transfer:** debris DNA, plasmids, phage, conjugation.
5. **Operon wand,** then the Lab puzzle mode with histograms and GIF export.
6. **Flux view with alternate pathways.**
7. **Endosymbiosis and lifestyle ascension trees.**
8. **Sharing:** genome seed codes and daily seeds.

Targets: about 150 gene cards by 1.0 (Balatro scale, not Isaac's 700+), fewer than 200 tree nodes in total, never an external planner. *Superseded:* gameplay §3.7 sets about 150 nodes at 1.0 under a hard cap of 250 Atlas stars.

---

## 3. Openings, storytelling and the art of scale

**Scope.** Films, visualizations, books and games that stage scale, open unforgettably, or tell stories without words, read for Codon's opening animation and grand storyline. The owner's seed (a child with a magnifier watching a dew drop on a leaf) gets its own section. The sweep ends with a proposed 120-second opening, a storyline framework and a build order.

**Method note.** Primary pages (Wikipedia film and game articles, the Royal Society, PubMed and PMC, developer interviews) and reviews. The shared search budget ran out near the end; after that only known primary pages were fetched. Details that could not be confirmed are marked *unverified*.

**Prototype fit.** The prototype README (`/home/user/cell/README.md`) already has features that suit this opening: the title floats in the water and you swim past it; an in-world scale bar is exactly 1 µm; a final lens pass adds colour fringing, vignette and grain; Tab "inspect" slows time; the interior uses Goodsell colours.

### 3.1 Key findings

1. **Every great scale journey is anchored on a living human-scale subject and moves at a steady logarithmic pace.** *Powers of Ten* opens on a Chicago picnic and zooms out one power of ten every 10 s, back in at one every 2 s ([Wikipedia](https://en.wikipedia.org/wiki/Powers_of_Ten_(film))). *Cosmic Zoom* opens on a boy rowing with his dog and dives into a mosquito on his hand ([Wikipedia](https://en.wikipedia.org/wiki/Cosmic_Zoom)). Boeke's *Cosmic View* opens on a girl holding a cat ([Wikipedia](https://en.wikipedia.org/wiki/Cosmic_View)). *Contact*'s pull-out ends in a young girl's eye ([Art of the Title](https://www.artofthetitle.com/title/contact/)). The owner's seed sits in this proven tradition; the risk is that the image is familiar.
2. **The seed has a 178-year-old literary twin.** In Andersen's "The Drop of Water" an old man looks at puddle water through a glass that makes things "a hundred times bigger", sees creatures tearing each other apart, and dyes them so they "may be seen more plainly"; a rival guesses the drop is "Paris, or some other great city" ([Wikisource text](https://en.wikisource.org/wiki/The_Drop_of_Water); first published 1848 per [visithcandersen.dk](https://visithcandersen.dk/eng-the-drop-water.htm)). Observer, lens, colony-as-city and staining are all there, rhyming with Codon's colony-vs-colony pitch.
3. **A drop of water is literally a lens.** In 1696 Stephen Gray published in the *Philosophical Transactions* a microscope whose lens was a globule of water ([Gray 1696](https://doi.org/10.1098/rstl.1695.0040); ["a further account of his water microscope"](https://doi.org/10.1098/rstl.1695.0058)). Leeuwenhoek first reported "little animals" in rain, well, sea and snow water on 9 October 1676 ([Lens on Leeuwenhoek](https://lensonleeuwenhoek.net/content/observations-communicated-publisher-mr-antony-van-leewenhoeck-dutch-letter-9th-oct-1676-here)). The dew drop can be both the world and the instrument.
4. **The seed has an honesty problem: a magnifying glass cannot show a bacterium.** The naked eye resolves about 0.1 mm at reading distance ([Naked eye](https://en.wikipedia.org/wiki/Naked_eye)), and a 10× loupe about a tenth of that, 10 µm; E. coli is about 1 × 2 µm; Leeuwenhoek's best surviving bead lens magnifies about 266× to roughly one-micron resolution ([Lens on Leeuwenhoek](https://lensonleeuwenhoek.net/content/tiny-lenses)). The opening must either pass "beyond the glass" knowingly or let the observer's instruments improve over the game. Recommended: an **instrument ladder** that is also meta-progression and view modes.
5. **The leaf is a real microbial world with real "gates".** Leaf surfaces may host up to about 10^26 bacteria globally, at 10^6–10^7 per cm² ([BioNumbers after Vorholt 2012](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368)). Stomata close when they sense bacterial flagellin through the FLS2 receptor and stay closed against E. coli O157:H7; *Pseudomonas syringae* reopens them within about 3 hours with the toxin coronatine ([Melotto et al. 2006, Cell](https://pubmed.ncbi.nlm.nih.gov/16959575/); [ScienceDaily](https://sciencedaily.com/releases/2006/09/060911105147.htm)). That is a faithful gate, stealth and gene-theft puzzle for a hero whose flagella the plant can detect.
6. **Fast-hooking openings give control in seconds, pose a goal or question within about 30 s, and show the title after the first meaningful act.** *Journey* shows controls only as pictures and reveals the mountain with the title over it after the first dune ([Wikipedia](https://en.wikipedia.org/wiki/Journey_(2012_video_game)); [GDC narrative review](https://media.gdcvault.com/gdc2024/GNR/Papers/DeanGoodson-GameNarrativeReview2024.pdf)). Steam refunds any game played under 2 hours within 14 days ([Steam](https://store.steampowered.com/steam_refunds)), so a long unskippable cinematic is a commercial risk.
7. **The frame should change what the mechanics mean, never replace them.** *Inscryption*'s frame turns losses into "death cards", but critics felt the later acts, which left the first act's loop, lost grip ([Wikipedia](https://en.wikipedia.org/wiki/Inscryption)). *Flower*'s frame is its menu, a windowsill whose city view brightens as you progress ([Wikipedia](https://en.wikipedia.org/wiki/Flower_(video_game))). *Outer Wilds* makes knowledge the only progression and runs the world on its own clock ([Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system)).
8. **Wordless, meditative games are loved for feeling and attacked for shallowness.** *Everything*: "not as clever as it seems to think it is" ([Wikipedia](https://en.wikipedia.org/wiki/Everything_(video_game)); [OpenCritic](https://opencritic.com/game/4091/everything/reviews?sort=date)). *Mountain*: likened to a screensaver ([Wikipedia](https://en.wikipedia.org/wiki/Mountain_(video_game))). *Abzu*: "lacking in variety" ([Wikipedia](https://en.wikipedia.org/wiki/Abz%C3%BB)). *Gris*: IGN 6.5 for "a simple, at times confusing, platformer" ([PC Gamer](https://www.pcgamer.com/uk/gris-review); [Metacritic](https://legacy.prod.metacritic.com/game/switch/gris/critic-reviews)). Codon should borrow their openings and moods and keep Thrive-depth systems underneath.

### 3.2 Films, books and visualizations of scale

#### Powers of Ten (Charles and Ray Eames, 1977; prototype 1968)
- A 1-metre overhead view of a couple picnicking on the Chicago lakefront zooms out one power of ten every 10 s to "100 million light years across", then dives back at one power every 2 s to quarks in a carbon proton (10^-16 m). 9 minutes, narrated by Philip Morrison; the 1968 "rough sketch" began in Miami with two clocks comparing viewer time and Earth time; National Film Registry 1998 ([Wikipedia](https://en.wikipedia.org/wiki/Powers_of_Ten_(film))). Adapted from Kees Boeke's 1957 *Cosmic View: The Universe in 40 Jumps* ([Cooper Hewitt](https://collection.cooperhewitt.org/objects/35457285); [Wikipedia](https://en.wikipedia.org/wiki/Powers_of_Ten_(film_series))). Will Wright named it as an inspiration for *Spore* ([Designer Notes](https://www.designer-notes.com/?p=654); [Gaming Nexus](https://gamingnexus.com/Article/1970/Spore)).
- **Why it works:** a constant log rate makes every decade feel equal; a small human ritual anchors the abstraction; a readout says where you are; the return is faster than the outward trip.
- **Take:** a steady log-zoom (2–4 s per decade) from the leaf (10^-1 m) to the hero (10^-6 m), about 5 decades in 10–20 s, with the prototype's 1-µm scale bar ticking through 1 cm, 1 mm, 100 µm, 10 µm and 1 µm; slow on the first dive, fast on returns. **Avoid:** a lecture voice-over during the zoom.

#### Cosmic View (Kees Boeke, 1957) and Cosmic Zoom (NFB, 1968)
- Boeke's book opens on a photo of a Dutch girl holding a cat and ends at a sodium nucleus ([Wikipedia](https://en.wikipedia.org/wiki/Cosmic_View)). *Cosmic Zoom* (National Film Board of Canada; directed by Robert Verrall, drawings by Eva Szasz; about 8 minutes) has no words ([NFB](https://nfb.ca/film/cosmic_zoom)). It opens on a boy rowing with his dog on the Ottawa River, zooms out to the edge of the known universe, back to the boy, then into a mosquito on his hand, through the proboscis and down to a nucleus ([Wikipedia](https://en.wikipedia.org/wiki/Cosmic_Zoom)).
- **Take:** no words in the opening; a child plus a small companion detail (an ant crossing the leaf, a ladybird); enter through something alive. **Avoid:** the out-then-in shape. Only go in; save the pull-out for the ending.

#### Contact (1997) opening
- One continuous effects shot pulls back from Earth through the solar system and galaxy while broadcast audio grows older and fainter, ending in the iris of young Ellie at her ham radio. It was planned the other way; Carl Sagan suggested reversing it ([AFI Catalog](https://catalog.afi.com/Catalog/moviedetails/60697); [Art of the Title](https://www.artofthetitle.com/title/contact/)). Reported as the longest all-effects shot of its time ([WhatCulture](https://whatculture.com/amp/film/10-best-opening-shots-in-cinema-history?page=2); length unverified).
- **Take:** end in an eye (Codon's finale can pull out of the drop into the watcher's eye, then into its cells); zoom direction carries meaning: inward is discovery, outward is revelation. **Avoid:** spending the most expensive shot first.

#### Microcosmos (Nuridsany and Pérennou, 1996)
- Descends from the clouds into a meadow at early morning ([The Solute](https://www.the-solute.com/?p=9603)). Only two brief narrated passages in 80 minutes; in English Kristin Scott Thomas says "to observe this world we must fall silent now… and listen to its murmurs" ([Wikipedia](https://en.wikipedia.org/wiki/Microcosmos_(film)); [The Solute](https://www.the-solute.com/?p=9603)). Rain arrives like a disaster film; an ant drinks from a bead of water, "strangely foreign in scale". Reported production: 15 years of research, 2 years of equipment design, 3 years of shooting ([Wikipedia, citing Pathé International](https://en.wikipedia.org/wiki/List_of_films_with_longest_production_time)). Five Césars including Music (Bruno Coulais) and Sound; about $52.8M gross on $3.8M ([Wikipedia](https://en.wikipedia.org/wiki/Microcosmos_(film))).
- **Take:** open from above with near silence and nature sound; weather as micro-scale catastrophe (rain dilutes the drop, which is dangerous for a wall-less cell; confirm the osmotic detail with section 4); a sound budget as big as the visual one. **Avoid:** plotlessness (a 3-hour game needs a spine); copying its signature opening line.

#### Drew Berry (WEHI), The Inner Life of the Cell (XVIVO/Harvard, 2006), David Goodsell
- **Berry** builds molecular animation from crystallography, cryo-EM, live-cell microscopy and molecular-dynamics data, "accurate to scale, accurate to speed" ([WEHI](https://www.wehi.edu.au/news/new-animations-breathe-life-complex-scientific-concepts/)). 2004 BAFTA, 2005 Emmy for *DNA*, 2010 MacArthur Fellowship; he made Björk's "Hollow" video, which she called accurate with "some artistic license for poetic effect" ([Wikipedia](https://en.wikipedia.org/wiki/Drew_Berry)). His TED talk frames the subject as "astonishing molecular machines" ([TED](https://www.ted.com/talks/drew_berry_animations_of_unseeable_biology)); Fellow of the Royal Society of Victoria, May 2026 ([WEHI](https://www.wehi.edu.au/news/royal-society-of-victoria-honours-for-wehi-biomedical-animator/)).
- **The Inner Life of the Cell** is beloved but was criticised: no water, too little random noise, self-assembly "a little too choreographed", stiff motor proteins ([Slashdot discussion](https://science.slashdot.org/story/06/09/02/153223/life-inside-a-cell)). The studio said it sometimes "subtly change[d] the way things work" for visual effect, with Harvard's support ([Studio Daily, archived](https://web.archive.org/web/20250906135122/https://www.studiodaily.com/2006/07/cellular-visions-the-inner-life-of-a-cell/)).
- **Goodsell**'s watercolour E. coli cross-sections use invented colours chosen for readability and to mark compartments ([Jon Cohen interview](https://joncohen.org/2019/04/11/meet-the-scientist-painter-who-turns-deadly-viruses-into-beautiful-works-of-art/); [PMC9377704](https://pmc.ncbi.nlm.nih.gov/articles/PMC9377704)); his PDB-101 images are CC-BY-4.0 ([RCSB](https://RCSB.org/news/621fb94352988f064bf8c4a7)).
- **Take:** real structures; crowding and Brownian jitter as truth, with focus, light and slow-motion inspect for readability; Goodsell's honest invented colours, stated in the codex ("colours are invented; proteins have none"); Berry's dark fluorescent look only as an unlockable view mode (Codon is a light theme).
- **Avoid:** choreographed molecules walking like actors (show random walks that happen to succeed, with honest time-lapse); assuming educational licences cover commercial use (commission or recreate).

#### Kurzgesagt and Journey to the Microcosmos
- **Kurzgesagt:** Munich studio founded in 2013 by Philipp Dettmer, about 25.6M subscribers in October 2026, "minimalistic, flat" animation, published sources. It has been criticised for emotive language and oversimplification, pulled two 2015 videos and re-cut a 2024 video after expert feedback ([Wikipedia](https://en.wikipedia.org/wiki/Kurzgesagt)).
- **Journey to the Microcosmos** (Hank Green with microscopist James Weiss, June 2019) shows real brightfield and DIC footage of protists with contemplative narration ([Tubefilter](https://tubefilter.com/2019/06/24/hank-green-journey-to-the-microcosmos/)). It is the closest real reference for Codon's pale, sunlit look, which is essentially brightfield microscopy.
- **Take:** a one-click "What's real here" source panel; brightfield/DIC footage as the art target for water; calm, wondering narration as an optional codex voice. **Avoid:** faces and mascots on microbes; stating contested science as fact.

#### Andersen, "The Drop of Water" (1848)
- Kribble-Krabble looks at puddle water through "one of those round spectacle-glasses that make everything look a hundred times bigger", sees "thousands of little creatures" that "tear off each other's legs and arms and bodies", and dyes them pink with "witches' blood": "I must give them color, that they may be seen more plainly". The rival guesses "That's Paris, or some other great city, for they're all alike". Punchline: "It's a drop of puddle water!" ([Wikisource](https://en.wikisource.org/wiki/The_Drop_of_Water)). The dye anticipates staining; Gram staining came decades later.
- **Take:** an Andersen easter egg ("witch's blood" stain view mode); "drop as a city" to frame colony-vs-colony satirically. **Avoid:** its cynicism as the main tone; Codon's frame is wonder, with Andersen as a wink.

#### Horton Hears a Who! (1954)
- Horton protects a talking speck on a clover; at the climax the Whos must be loud enough to be heard, and tiny Jo-Jo's "Yopp!" tips it. "A person's a person, no matter how small" has been adopted by anti-abortion campaigners, which the Geisel estate opposes ([Wikipedia](https://en.wikipedia.org/wiki/Horton_Hears_a_Who!)). Do not quote it.
- **Take:** the climax structure, *the small world makes itself perceptible to the large one*. Bacteria have a literal "we are many" signal, quorum sensing, and the lux genes behind *Vibrio fischeri*'s glow work in lab E. coli ([PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500)). A colony that steals lux genes and glows at dusk, so the watcher finally sees it, is a grounded "Yopp". **Avoid:** saviour framing for the giant; the observer is curious or indifferent.

#### The Incredible Shrinking Man (1957) and Honey, I Shrunk the Kids (1989)
- *The Incredible Shrinking Man* ends with Scott Carey accepting endless shrinking, sure he still matters. Universal wanted a happy ending (a test card read "should've grown again"); the director's ending was kept. First Hugo for dramatic presentation; National Film Registry 2009 ([Wikipedia](https://en.wikipedia.org/wiki/The_Incredible_Shrinking_Man)). The "infinitesimal and the infinite" monologue's exact text is unverified.
- *Honey, I Shrunk the Kids* turns the familiar into terrain (riding an ant lured with a crumb, a bee, sprinkler floods, a night in a Lego brick, a spoon of Cheerios), with practical effects and forced perspective; about $222.7M gross ([Wikipedia](https://en.wikipedia.org/wiki/Honey,_I_Shrunk_the_Kids)).
- **Take:** an ending that embraces smallness; human traces in the drop as landmarks (sleeve fibre as a fallen trunk, pollen, a skin flake, a soap film; sizes approximate, verify). **Avoid:** "return to normal size" as the goal.

### 3.3 Games: scale, openings, wordless story, frames

Peers already covered in section 1 are summarized only for their opening or frame.

| Game | What it does with opening, frame or scale | Codon takes | Codon avoids |
|---|---|---|---|
| **Spore** | Panspermia opening: a meteor breaks up in the ocean, revealing your cell ([Wikipedia](https://en.wikipedia.org/wiki/Spore_(2008_video_game)); [Fandom](https://gaming.fandom.com/wiki/Spore)); Wright cited *Powers of Ten* ([Designer Notes](https://www.designer-notes.com/?p=654)); early stages "too fleeting" (Eurogamer); editors universally praised | The joy of editing and seeing the edit live, made real by gene → protein → body | The meteor-from-space opening (come *down from a human*, not from space); scale transitions as a substitute for depth |
| **Cell to Singularity** | Prestige framed as rebooting a simulated universe overseen by the AI "Semblance" ([Wikipedia](https://en.wikipedia.org/wiki/Cell_to_Singularity)); Very Positive, criticised for late grind ([Gamebrain summary](https://gamebrain.co/game/cell-to-singularity)) | A diegetic reason for meta-resets; a fact per unlock; a branching tree as the map | Idle grind; an impersonal AI-narrator frame |
| **flOw** | Began as Chen's USC thesis on dynamic difficulty; you set difficulty by eating and choosing when to descend ([Wikipedia](https://en.wikipedia.org/wiki/Flow_(video_game)); [Game Developer](https://www.gamedeveloper.com/design/go-with-the-i-fl0w-i-jenova-chen-on-console-independence)) | Depth in the drop as a chosen difficulty/biome axis: bright, oxygen-rich near the surface; dim and anoxic deep, where fermentation takes over (design proposal; check the biology) | Few verbs, little to learn |
| **Osmos** | Move by ejecting mass; ambient score; Metacritic 80; IndieCade 2009 Best in Show ([Wikipedia](https://en.wikipedia.org/wiki/Osmos); [Destructoid](https://www.destructoid.com/review-osmos/)); late levels lean on luck ([Metacritic](https://legacy.prod.metacritic.com/game/pc/osmos/critic-reviews)) | One honest physical rule with a visible cost: every flagellar turn spends PMF, shown on the cell | Luck-driven spikes |

#### Everything (David OReilly, 2017) and Mountain (2014)
- **Everything:** become anything from sub-atomic to galactic with seamless scale shifts; Alan Watts lectures as collectibles; its 11-minute trailer was the first game trailer eligible for an Oscar; Metacritic 80 (PS4), 71 (Switch) ([Wikipedia](https://en.wikipedia.org/wiki/Everything_(video_game))). Polygon: a "magical playpen of being, rather than doing"; detractors: "empty", "not as clever as it seems to think it is" ([OpenCritic](https://opencritic.com/game/4091/everything/reviews?sort=date)).
- **Mountain:** opens by asking you to *draw* answers to personal prompts and grows a mountain from them; it runs idly through seasons and ends after about 50 hours when a star hits it; many likened it to a screensaver ([Wikipedia](https://en.wikipedia.org/wiki/Mountain_(video_game))).
- **Take:** personal seeding (let the player choose which dew drop, and where on the leaf, to seed the run); narration as collectible codex entries. **Avoid:** "being rather than doing"; every scale shift must lead to a decision.

#### Journey (2012)
- Starts beside a small dune; from its top a mountain with a glowing crevice appears, with the title over it ([Wikipedia](https://en.wikipedia.org/wiki/Journey_(2012_video_game)); [GDC narrative review](https://media.gdcvault.com/gdc2024/GNR/Papers/DeanGoodson-GameNarrativeReview2024.pdf)). Pictorial controls, no words outside title and credits, Campbell's monomyth. The designers wanted players to feel "small" and awed; Chen wanted it genderless and ageless and prototyped with music first ("music is the most effective and powerful medium that can create emotion") ([Game Developer](https://gamedeveloper.com/audio/video-designing-a-new-emotional-experience-in-i-journey-i-)). Austin Wintory's score was the first game score nominated in its Grammy category; criticism focused on length and pacing.
- **Take:** control within seconds; a visible goal or question within about 30 s; the title after the first meaningful act (the prototype already floats the title in the water); pictorial hints; score first; an ungendered, ageless watcher. **Avoid:** a two-hour, one-path identity.

#### Flower (2009) and Abzu (2016)
- **Flower:** each level is a potted flower on a city windowsill; choosing one enters its "dream"; the city outside brightens as you progress, and secret completion replaces it with fields and mountains. About 1 hour, no fail state, "closer to art than a game" for some ([Wikipedia](https://en.wikipedia.org/wiki/Flower_(video_game))).
- **Abzu:** a diver wakes on the surface; wordless; "tens of thousands" of fish; deliberate stylization to avoid "visual noise"; a meditation mode for watching. Praised visuals, criticised as lacking variety and too close to Journey ([Wikipedia](https://en.wikipedia.org/wiki/Abz%C3%BB); [GamesRadar](https://www.gamesradar.com/abzu-review/)).
- **Take:** the frame as hub or menu (the leaf, garden and watcher's desk change as the colony spreads); stylization against visual noise (critical at micro scale, where Thrive's clutter is a known weakness); a watch mode (Codon's inspect is close). **Avoid:** no stakes; reading as "another Journey".

#### Gris (2018)
- A grieving girl restores colour to a grey world; each new colour brings abilities. 3M sold by September 2024 ([Wikipedia](https://en.wikipedia.org/wiki/Gris_(video_game))). "A painting that moves" ([TechRaptor](https://techraptor.net/content/gris-review)); IGN 6.5 for a simple, sometimes confusing platformer, with no death mechanic ([Medium critique](https://medium.com/@shanemarkmoosa/a-measured-critique-of-gris-d5eec19ef527)).
- **Take:** progression as revealing new layers of the same world (Codon's stain, phase-contrast and fluorescence view modes). **Avoid:** thin mechanics under beautiful art.

#### Ori and the Blind Forest (2015) prologue
- The Spirit Tree narrates; Ori falls in a storm, is adopted by Naru, and Naru starves as the forest withers ([Wikipedia](https://en.wikipedia.org/wiki/Ori_and_the_Blind_Forest)). Short narrated verses, partial control alternating between Ori and Naru ([GMA](https://www.gmanetwork.com/news/scitech/content/453981/game-review-ori-and-the-blind-forest-spellbinds-as-it-tests-your-limits/story)); players report tears within seven minutes ([GameSkinny](https://gameskinny.com/?p=64988)).
- **Take:** bond first, stakes second; make the hero's fragility felt early (a wall-less cell that wobbles, leaks and can burst). **Avoid:** a parent's-death hook; about 7 minutes of mostly passive prologue.

#### The Gardens Between (2018) and Gorogoa (2017)
- **The Gardens Between:** two friends in a treehouse on a rainy night drift to islands of shared memory; you scrub time rather than steer; no dialogue. Loved for wordless characterization, but "sweet but shallow", no conflict, easy late puzzles ([Wikipedia](https://en.wikipedia.org/wiki/The_Gardens_Between)).
- **Gorogoa:** hand-drawn panels you zoom into and align so a child can cross between worlds; praised art and puzzles; short ([Game Informer](https://www.gameinformer.com/games/gorogoa/b/pc/archive/2017/12/12/gorogoa-review-game-informer.aspx); [Slant](https://www.slantmagazine.com/games/gorogoa/)).
- **Take:** one unusual verb in the opening, *focus* (a focus ring or scroll that is also the zoom); zoom as an action, not a camera. **Avoid:** a story with no conflict.

#### Outer Wilds (2019)
- You wake under the stars beside a campfire; the first interaction is roasting a marshmallow ([Boing Boing](https://boingboing.net/2015/03/18/outer-wilds.html); [GamesRadar](https://www.gamesradar.com/youll-never-stop-outer-wilds-sci-fi-apocalypse-so-you-might-as-well-roast-marshmallows)). The sun goes supernova every 22 minutes; only knowledge in the ship log carries over. Beachum: "never… the sense that the world revolved around the player"; "everything is on its own clock"; an early version failed because "players weren't familiar with the village yet" ([Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system)). BAFTA Best Game, IGF Grand Prize, 2M+ sold by August 2021; criticised for getting lost and unfair-feeling deaths ([Wikipedia](https://en.wikipedia.org/wiki/Outer_Wilds)).
- **Take:** the dew clock (each run is one drop's day, dawn to evaporation or rain, on its own schedule); a field notebook as the only thing besides genes carried between runs; make the drop "home" in the first 2 minutes before posing the mystery. **Avoid:** unguided wandering; give a gentle rumour web.

#### Inscryption (2021)
- Found-footage frame: YouTuber Luke Carder plays a floppy disk containing Leshy's cabin card game; acts change genre; a lost run becomes a returning "death card". 1M+ by January 2022; IGF Grand Prize and GDCA Game of the Year. Critics: the mystery "fades long before it ends"; nothing "gripped me as firmly" as Act 1 ([Wikipedia](https://en.wikipedia.org/wiki/Inscryption); [GameSpot](https://gamespot.com/reviews/inscryption-review-house-of-cards/1900-6417788/); [PC Gamer](https://www.pcgamer.com/au/inscryption-review)).
- **Take:** failure leaves something real. Lysed cells spill DNA, and wall-less L-forms take up external DNA by an endocytosis-like process: shown in the actinomycete *Kitasatospora viridifaciens*, not *E. coli* ([Kapteijn et al. 2022, Nat. Commun.](https://doi.org/10.1038/s41467-022-33054-w)), so a dead lineage's genes can float in the next drop as recoverable eDNA. **Avoid:** a frame twist that abandons the loop players fell for.

#### Tunic (2022)
- Pages of an in-world manual, mostly in a constructed script, are found out of order and explain mechanics, inspired by unreadable NES manuals, to make players "strangers in a strange land" ([Wikipedia](https://en.wikipedia.org/wiki/Tunic_(video_game)); [Game Developer](https://www.gamedeveloper.com/road-to-igf-2023/how-tunic-weaves-wondrous-unknowable-worlds-inspired-by-inscrutable-nes-manuals)). BAFTAs for Artistic Achievement and Debut Game; criticised for late puzzles that leave players stuck.
- **Take:** the watcher's field notebook (or Leeuwenhoek-style letters) filling in as you discover, with sketches you recognise later. **Avoid:** gating progress behind cryptography.

#### Little Nightmares (2017)
- Tiny Six against a giant world; Tarsier: "the scale difference… helps us to create challenging gameplay experiences that also feel natural" ([GamingBolt](https://gamingbolt.com/little-nightmares-interview-into-the-maw)). A "dollhouse" camera; 2M+ by May 2020; criticised as patience-testing and "mechanically clumsy" ([Wikipedia](https://en.wikipedia.org/wiki/Little_Nightmares)).
- **Take:** scale as vulnerability; a dollhouse cutaway of the drop as map or overview. **Avoid:** trial-and-error deaths.

#### Grounded (2020/2022) and Grounded 2 (2025)
- Teens shrunk to insect size in a backyard; recordings from Dr. Tully reveal the corporation Ominent; the yard is designed like a "theme park" of landmarks ([Wikipedia](https://en.wikipedia.org/wiki/Grounded_(video_game))). Director Adam Brennecke called it the 30-years-late *Honey, I Shrunk the Kids* tie-in ([PC Gamer](https://www.pcgamer.com/au/in-grounded-an-adorable-survival-game-from-obsidian-youre-a-shrunken-kid-in-a-giant-backyard/)); players search grass for dew to drink ([Twinfinite](https://twinfinite.net/xbox-one/grounded-review-honey-i-shrunk-the-teenagers/)). 20M+ players by February 2024; Grounded 2 entered early access on 29 July 2025, reached 3M players in about two weeks and peaked near 50k concurrent on Steam ([Windows Central](https://www.windowscentral.com/gaming/xbox/im-surprised-xboxs-grounded-2-just-hit-this-player-count-milestone); [VGChartz](https://www.vgchartz.com/article/465460/grounded-2-tops-3-million-players-in-2-weeks/)).
- **Take:** proof that "the familiar made giant" sells on Steam; dense, recognisable landmarks as a map. **Avoid:** the corporate-conspiracy and robot-guide frame.

### 3.4 What makes the first 60–120 seconds unforgettable

1. **Sound before image.** Chen prototyped *Journey* from music; *Microcosmos* asks you to "fall silent… and listen". Start in darkness with pre-dawn birdsong and one drip.
2. **A living, small, human-scale anchor** (a picnic, a boy and dog, a girl and cat, Ellie's eye). Show a hand, a sleeve and breath on the glass rather than a full character.
3. **Control in under 10 s, with one verb**: move the glass and focus (mouse plus scroll).
4. **One scale move done with conviction**: constant log rate, in-world readout, no cuts.
5. **A question by 30–60 s.** Among neat walled rods, one cell wobbles like jelly: *why is this one different?*
6. **"2+2", not "4".** Pixar's Andrew Stanton: "make me care" and let the audience add it up ([TED](https://www.ted.com/talks/andrew_stanton_the_clues_to_a_great_story)). Do not label the hero; let the player notice it.
7. **Title after the first meaningful act.**
8. **Familiar before mysterious** (Beachum's village lesson).
9. **Respect the refund clock.** Skippable on replays; returning players start at the drop choice.

### 3.5 Rules for staging scale transitions

- **Logarithmic and steady**: about 3 s per decade on the first dive, about 1 s on later returns. These rates are Codon's own; *Powers of Ten* lends only the steadiness, at 10 s per decade outward and 2 s back in (3.2).
- **Readout always visible**, in-world (the scale bar), not in a HUD.
- **Honest hand-offs between optical regimes**: naked eye → magnifier → the drop's own lens (Gray 1696) → microscope. A magnifier only enlarges the angle an object fills ([Magnifying glass](https://en.wikipedia.org/wiki/Magnifying_glass)), so it divides the eye's 0.1 mm limit by its power: about 10 µm for a 10× loupe. When the frame shrinks toward that limit, *show it blur*, then pass through.
- **An anchor object per decade**: leaf veins at 1 cm; a dew bead and a leaf hair (trichome) at 1 mm; a pollen grain or cotton fibre at 100 µm; a ciliate or diatom at 10 µm; the hero at 1 µm.
- **Direction means something**: in for discovery and the start, out for revelation and the end.
- **A transition never replaces depth or a decision** (the Spore and Everything critiques).

### 3.6 The owner's seed: a child, a magnifier, a dew drop

**Precedents.** Andersen (1848); Leeuwenhoek's 1676 letter, whose single bead lenses reached about 300× against 40–50× for Hooke's compound microscope ([Hektoen International](https://hekint.org/2018/10/23/van-leeuwenhoeks-discovery-of-animalcules/)); Gray's water-globule microscope (1696); Boeke's girl and cat (1957); *Cosmic Zoom*'s boy and dog (1968); the *Powers of Ten* picnic (1977); *Contact*'s eye (1997); *Microcosmos*'s dew-drinking ant (1996); *Flower*'s windowsill (2009); the Gardens Between treehouse (2018); Grounded's dew (2020).

**Strengths**
- **Universal memory.** Nearly everyone has peered at a dew bead.
- **Real habitat.** Leaves host a vast microbial world ([BioNumbers](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368); [Vorholt 2012](https://research-collection.ethz.ch/bitstream/20.500.11850/59727/2/Microbial_life_in_phyllosphere.pdf)).
- **A natural clock.** Dew forms by night-time radiative cooling and dries by day; in one field study leaves stayed wet about 10 h ([AGRIS](https://agris.fao.org/search/en/records/65df5d446eef00c2cea280bf)). One drop's life is a perfect run.
- **The drop as lens** (Gray), a rhyme no competitor has.
- **Built-in gates**: stomata, flagellin sensing and coronatine theft ([Melotto 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)).
- **A road to the sky.** *Pseudomonas syringae* ice-nucleation proteins seed snow; biological ice nucleators were the most active found in snowfall from Antarctica to Montana ([Christner et al. 2008 via National Geographic](https://www.nationalgeographic.com/science/article/snow-making-bacteria-are-everywhere)). The water cycle can be the world map.
- **The light theme fits**: sunlit dew is a brightfield world.

**Pitfalls and fixes**
1. **The optics lie** (eye limit about 0.1 mm; a 10× loupe about 10 µm; E. coli about 1 × 2 µm). *Fix:* blur honestly at the glass's 10 µm limit, pass "beyond the glass", and make better instruments a meta-progression.
2. **"Boy + magnifier + sun" reads as burning ants.** *Fix:* an ungendered child, mostly hands; or turn the trope into an honest hazard, a focused hot spot crossing the drop. Water drops rarely burn smooth leaves, but drops held up by leaf hairs can focus sunlight onto tissue ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)), so use a hairy leaf for an honest burning-lens beat, in which the drop is the burning glass. Keep the two hot spots apart. Common soda–lime glass passes UVA but blocks "over 90% of the light below 300 nm" ([Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet)), so the magnifier's spot is heat. Water absorbs about as little at 200 nm as at 900 nm, an attenuation length of 14.5 cm ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)), so the DNA-damaging UV focus is the bead's own.
3. **It reads as a children's game.** *Fix:* the tone of *Microcosmos* and *Journey* (serious score, awe, no cartoon face); "genderless and ageless".
4. **Human characters are costly** and risk the uncanny valley. *Fix:* hands, a sleeve, a shadow, and the child's inverted reflection inside the drop (real optics, almost free with the raymarcher).
5. **Cinematic before play.** *Fix:* the dive is player-driven and skippable after the first time.
6. **Ecological plausibility.** Plants recognise and exclude E. coli O157:H7 at the stomata ([ScienceDaily](https://sciencedaily.com/releases/2006/09/060911105147.htm)). Make "*how did a gut bacterium get here?*" an early mystery, answered mid-campaign (a splash, an animal, a fingertip). A naturally occurring leaf L-form is an invention; label it in the codex.
7. **Familiarity.** The twists below (drop as lens, instrument ladder, eye bookend) make it Codon's own.

### 3.7 Proposal: "Dew", the opening (about 120 s, interactive)

| Beat | Time | What happens |
|---|---|---|
| 0 | 0–6 s | Black. Pre-dawn birds, a far-off dog, one drip. A blue-hour gradient fades up. No text; no logo animation longer than 2 s. |
| 1 | 6–20 s | A broad, slightly hairy leaf beaded with dew; garden bokeh. A child's hand (cuff, a plaster on one knuckle) brings in a round reading glass. **The cursor is the glass**; under it, drops pop into crisp magnification (shader inset). Control at about 8 s; the only hint is a faint pictorial circle. |
| 2 | 20–35 s | Hovering a drop shows its inverted miniature of the sky and the child's silhouette. **Click to choose a drop**, which seeds the run (position sets light, hairs, neighbours, nearby stomata). First sun touches the leaf edge: the dew clock starts. |
| 3 | 35–55 s | Scroll to push in at about 3 s per decade, scale bar ticking. As the frame shrinks below a millimetre the glass smears, because its honest detail limit is about 10 µm (3.5); the rim slides away and the drop becomes the lens (Gray 1696); the image flips and resolves into pale brightfield water with the prototype's caustics. Anchors drift past: a sleeve fibre like a fallen trunk, a ciliate like a whale, a diatom like a cathedral window. |
| 4 | 55–75 s | Walled rods run and tumble. One round-ish cell trembles, membrane rippling: the hero. Nothing points at it. When the view rests on it, the camera settles behind it and **control passes to the cell**. |
| 5 | 75–95 s | A glucose bead drifts past. First swim; the ATP ring fills; the energy route flickers. The title **CODON** hangs ahead and you swim through it. |
| 6 | 95–120 s | Overhead, the meniscus warms. A vast soft shadow sweeps across (the hand moving the glass), then a bright, warm focused spot crawls through the drop (heat, not UV: see 3.6); neighbours caught in it slow. Nothing is explained. The player now knows the world above is alive, indifferent, and on a clock. |

**Cheaper variant (no human):** the *Microcosmos* descent from cloud to garden to leaf to dew, with the human only as a shadow and a lens glint; keep beats 2–6.

**Sound:** orchestration thins from acoustic garden sounds to granular, liquid textures as you shrink, and swells again on the final pull-out.

### 3.8 Grand storyline framework: "The Drop and the Eye"

*Superseded as a frame by `story.md`, which owns it: four Acts (story §3.4), a run as one bead's morning (story §3.1) and gameplay §2.4's five exits. Kept here as the sweep's proposal.*

**Logline.** A bacterium that has lost its armour starts down the road that once led to complex life, watched by someone made of what that road became.

**Three nested clocks**
1. **Run: one drop's day.** Dawn dew, then evaporation, rain, runoff, an insect's foot or a fingertip. The exit you reach decides the next biome. Roguelite runs with persistent genes.
2. **Campaign: one summer.** The hub is the leaf and windowsill (Flower). As the colony spreads, the garden at dusk glows more each time. The watcher's field notebook fills in (Outer Wilds' log plus Tunic's manual), and the watcher's instruments improve. Each instrument is a view mode: magnifier; drop lens (Gray); Leeuwenhoek bead; brightfield (the current look); phase contrast; "witch's blood" stain (Andersen; Gram stain); fluorescence (reporter genes show which proteins are being made); structural (cryo-EM) view; sequencer (genome view).
3. **Deep time: the meaning.** Losing the wall echoes the first cells: L-forms divide by blebbing and have been proposed as models of primitive cells ([Errington 2013, Open Biology](https://doi.org/10.1098/rsob.120143)). Engulfment points toward the eukaryotic road: *Gemmata obscuriglobus* takes up proteins in an energy-dependent, endocytosis-like way ([Lonhienne et al. 2010, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973)), and wall-less L-forms of the actinomycete *Kitasatospora viridifaciens* (not *E. coli*) take up DNA, dextran and 150-nm lipid nanoparticles this way ([Kapteijn et al. 2022, Nat. Commun.](https://doi.org/10.1038/s41467-022-33054-w)).

**Acts**
- **I. Dawn (exile).** Body, energy, genes; the mystery of the hero's origin and wall-lessness; weather as catastrophe (rain dilutes, drying concentrates).
- **II. The Leaf (worlds within worlds).** Stomata are gates guarded by plant immunity (FLS2 detects flagellin): choose stealth (hide or modify flagellin) or steal a coronatine-like trick from *P. syringae* ([Melotto 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)). Insects are ferries. Ice-nucleation genes let you ride a cloud ([Christner 2008](https://www.nationalgeographic.com/science/article/snow-making-bacteria-are-everywhere)). Rival colonies are Andersen's "city" (colony vs colony, asynchronously, later).
- **III. Dusk (to be seen).** Quorum sensing. Steal the lux genes, which work in lab E. coli ([PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500)); the colony glows and the watcher finally sees it. Horton's "Yopp!" as real biology.
- **Epilogue: the Eye.** A fast pull-out, at about the 2 s per decade of *Powers of Ten*'s inward return rather than its 10 s outward pace, from the drop into the watcher's eye, then into the eye's cells and their mitochondria. Mitochondria descend from an engulfed alphaproteobacterium ([Wikipedia](https://en.wikipedia.org/wiki/Mitochondrion)) inside a host that branched from Asgard archaea ([Eme et al. 2023, Nature](https://doi.org/10.1038/s41586-023-06186-2)). Last line, or none: *Rewrite life.*

**Honesty cards for the codex.** A magnifier cannot show bacteria. E. coli is not naturally luminous. E. coli is neither the mitochondrial ancestor (an alphaproteobacterium) nor the host (archaeal); the hero's arc *rhymes* with eukaryogenesis rather than re-enacting it. Naturally occurring leaf L-forms are an invention.

**Optional layer: the watcher ages.** Across the campaign the hands change (a child's, a student's with gloves, an old scientist's): a wordless generational arc that costs only hand models.

### 3.9 Build order and playtest targets

1. **Sound and score sketch first**, then a greyboxed dive with the existing renderer, scale bar and lens pass.
2. **The macro leaf** as a 2.5D painted plate plus raymarched drops (drops are spheres, so the drop shader is reusable). Hands as a painted or silhouette layer; the reflected child as a cheap shader inset.
3. **Drop choice and hand-off to the cell**, using the existing camera.
4. **Dew-clock lighting**: sun-angle and warmth uniforms in `src/water.js`; the magnifier's warm hot spot and the bead's own UV focus as moving caustics.
5. **View modes, one at a time**, as post passes: phase-contrast halo, stain recolour, fluorescence emissive tags.
6. **Notebook and codex** with a sources panel.
7. **Finale pull-out last** (the most expensive shot).

**Playtest targets:** first control under 10 s; hero control under 75 s; under 5% of first-time players abandon during the opening; over 70% notice the "different" cell unaided.

---

## 4. Real biology as mechanics

**Method.** About 35 web searches (reviews, primary-paper records, PMC full texts), then direct fetches of reference pages once the shared search budget ran out. Nature and Science pages blocked direct fetch; claims resting on a DOI that could not be opened are marked *(DOI not opened)*.

**Status tags used below** (proposed as in-game codex badges; *superseded* by gameplay §0's five badges, which map them as listed at the top of this digest):
- **[Established]** textbook or repeatedly replicated.
- **[Established, details debated]** the phenomenon is real; numbers or interpretation are contested.
- **[Hypothesis]** published idea, not settled.
- **[Codon invention]** no direct real counterpart; grounded in a real analogue and labelled as invention in-game.

The lens throughout is the brief's promise: real genes as the evolution interface, faithful but fun. Each topic gives the real phenomenon, a mechanic, and what to take or avoid.

### 4.1 Mutation: rates, types, stress mutagenesis, potentiation

- **Rate [Established].** Wild-type *E. coli* mutates at about 2.2 × 10⁻¹⁰ per nucleotide per generation, about 1 × 10⁻³ per genome ([Lee et al. 2012, PNAS](https://pmc.ncbi.nlm.nih.gov/articles/PMC3478608)). Most daughters are identical; variation comes from population size, not individual luck.
  - *Mechanic: "Mutation is a population event, not a menu."* Each division has a small, honest mutation chance. The rate is a dial on the polymerase and mismatch-repair genes (mutator up, proofreading down). The colony view shows the lineage fanning out; selection (environment plus player choices) is what the player steers.
- **Types as distinct verbs**, each a card with its own risk profile:
  - *Point substitution*: nudges one protein stat (e.g. transporter affinity vs speed).
  - *Frameshift or nonsense*: a knockout. Knockouts are often beneficial: losing the transcription factor Ace2 alone turns yeast into fast-sinking "snowflake" clusters ([Multicellular organism, Wikipedia](https://en.wikipedia.org/wiki/Multicellular_organism)).
  - *Duplication*: a spare copy free to diverge; higher dosage.
  - *Rearrangement or promoter capture*: a silent gene moves under a new switch.
  - *Transposon insertion*: knocks out or switches on a neighbour.
  - *Deletion*: genome streamlining that saves replication cost.
- **Cit+ [Established].** In Lenski's long-term experiment one population evolved aerobic citrate use around generation 31,000: a tandem duplication fused *rnk* to *citG* and put the silent transporter *citT* under an oxygen-active promoter ([Blount et al. 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3461117)). It needed earlier potentiating mutations, then actualization, then refinement, including later regulatory mutations such as *dctA* activation ([later work on the lineage](https://elifesciences.org/articles/09696.pdf)).
  - *Mechanic: "Hidden potentiators."* Some branches open only if an earlier, seemingly neutral mutation is already in the lineage. Replays differ and history matters. Achievement: "Promoter capture".
- **SOS response [Established].** DNA damage activates RecA, which cleaves the LexA repressor; error-prone polymerases (Pol II, IV, V) raise the mutation rate, SulA halts division (the cell filaments), and resident prophages can be induced ([SOS response](https://en.wikipedia.org/wiki/SOS_response)).
  - *Mechanic: "Panic roll."* Under heavy damage (UV at the drop surface, antibiotics) the cell repairs, mutates faster for a while and stops dividing; any latent prophage may wake and lyse you (4.3).
- **Take:** differentiated mutation verbs; knockouts as sometimes-good; potentiation as hidden history; SOS as a high-risk comeback. **Avoid:** uniformly random mutations that frustrate; fake "always beneficial" upgrades. Every gene costs replication time and ATP.

### 4.2 Horizontal gene transfer ("genetic theft"), plasmids, toxin-antitoxin addiction

- **Three classic routes [Established].** *Transformation*: uptake of free DNA by competent cells, first seen in *S. pneumoniae* in 1928; some routes take up double-stranded DNA ([Sun 2018](https://www.frontiersin.org/articles/10.3389/fmicb.2018.02154/full)). *Transduction*: DNA carried by a phage (generalized moves any gene; specialized moves genes next to the prophage). *Conjugation*: transfer through a pilus between adjacent cells ([Thomas & Nielsen 2005](https://www.nature.com/articles/nrmicro1234.pdf)), discovered by Tatum and Lederberg in 1946 and able to move up to whole chromosomes ([review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7690428)).
  - *Mechanics, three theft verbs with their own risks:*
    - **Transformation = scavenging.** Lysed cells release glowing DNA threads. With your competence program on (a regulated, energy-costing state) you can take them up. A random fragment of the dead cell's genome, which may or may not recombine.
    - **Conjugation = trade or raid.** Extend a pilus to a neighbour. Plasmids are visible rings in NPC cells, so you can *read* their genes before mating, and *donate* plasmids to allies in colony play.
    - **Transduction = Trojan horse.** A temperate phage may carry a gene from a species it infected before: a gift or a killer.
- **Gene transfer agents [Established].** Some bacteria (first *Rhodobacter capsulatus*, 1974) make phage-like particles packed with about 4–14 kb of random host DNA, released by lysing the producer ([Gene transfer agent](https://en.wikipedia.org/wiki/Gene_transfer_agent)). *Colony mechanic:* sacrifice one cell to broadcast your genome to kin. Why anything pays this cost is a real open puzzle, good flavour text.
- **Plasmids and toxin-antitoxin "addiction" [Established].** Many plasmids carry a stable toxin and an unstable antitoxin; daughters that lose the plasmid lose the antitoxin first and die ("post-segregational killing"). *ccdAB* was found on an F plasmid in 1983; *hok/sok* (plasmid R1) uses an antisense RNA, and Hok is a membrane pore ([TA overview](https://www.wikiwand.com/en/articles/Toxin-antitoxin_system); [Addgene](https://blog.addgene.org/plasmid-addiction-systems-from-bacterial-toxins-to-molecular-biology-tools)). A 2024 single-cell study found about 46% of plasmid-free cells escape *ccd* killing through SOS-dependent repair ([NAR 2024](https://pmc.ncbi.nlm.nih.gov/articles/pmid/38224456)). Chromosomal TA homologues may act as "anti-addiction" modules.
  - *Mechanics:* plasmids as equipment slots (cheap to swap, lost on division unless partition genes are good); TA plasmids as **cursed relics** with a real counter-curse (an anti-addiction chromosomal antitoxin); **plasmid politics** (selfish plasmids that carry nothing useful but spread, which you may choose to purge).
- **Take:** theft that is legible (inspect before stealing), risky (Trojan phages, cursed plasmids) and social (donate to kin). **Avoid:** HGT as a free shop; it always carries a fitness cost, recombination failure or parasite risk. **Avoid (dual-use):** real resistance or virulence sequences, or anything that reads as a lab protocol; keep molecular detail illustrative.

### 4.3 Phages, CRISPR and the arms race

- **Lytic vs temperate; the λ switch [Established].** Starved hosts (stable cII) and high multiplicity of infection favour lysogeny; CI and Cro form a mutually exclusive switch; host DNA damage activates RecA, which cleaves CI, and the prophage wakes and lyses the cell; a lysogen is immune to superinfection by the same phage ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)).
  - *Mechanics:* **prophage as a pact** (immunity to its swarm, maybe bonus genes, but it may betray you if you enter SOS); **phage AI that reads the host** (phages go dormant more often in a starving player, so starving is a real defensive gambit).
- **Phage communication: arbitrium [Established; ecological generality debated].** *Bacillus* phage phi3T releases a six-amino-acid peptide (AimP); as it accumulates, receptor AimR shifts later infections toward lysogeny so phages do not exhaust their hosts (Sorek lab, Nature 2017; [Arbitrium](https://en.wikipedia.org/wiki/Arbitrium)).
  - *Mechanic: "Eavesdrop and spoof."* Evolve a sensor that hears phage chatter as early warning. Synthesizing a decoy peptide to lull phages is **[Codon invention]**.
- **CRISPR adaptive immunity [Established].** After surviving phage challenge, *S. thermophilus* added new spacers from phage DNA at the leader end of its CRISPR array; adding or removing spacers changed resistance (Barrangou et al. 2007; [review](https://pmc.ncbi.nlm.nih.gov/articles/PMC2928866)).
  - *Mechanic: "The trophy wall."* Each phage you survive adds a visible spacer bead to your array, inherited by daughters: a luminous barcode of your history. Phages mutate the matching sequence to escape, so old spacers decay: an endless co-evolution loop.
- **Anti-CRISPR [Established].** Phages encode Acr proteins, first found in *Pseudomonas* prophages (Bondy-Denomy 2013), that block Cascade DNA binding, Cas3 recruitment or Cas9 loading ([Anti-CRISPR](https://en.wikipedia.org/wiki/Anti-CRISPR)). *Mechanic:* elite phages with shields that disable your CRISPR, forcing diversified defence.
- **Phage nucleus [Established].** Jumbo phages (*Phikzlikevirus*) build a protein-shelled nucleus around their DNA and replication machinery, shielding it from restriction enzymes and type I CRISPR, positioned by a tubulin-like spindle (PhuZ) ([Phage nucleus](https://en.wikipedia.org/wiki/Phage_nucleus)). *Mechanic:* a **boss phage** that builds a fortress inside you, immune to DNA-cutting defences; you need membrane-level or abortive defences.
- **Defense islands [Established].** A systematic survey found many unknown anti-phage systems clustered in "defense islands" ([Doron et al. 2018, Science](https://doi.org/10.1126/science.aar4120), *DOI not opened*). *Mechanic: "immune loadout"* with a few slots: restriction-modification (tags your own DNA), CRISPR (learned), abortive infection (the infected cell suicides to save the colony), TA-based defences. Each counters different phage archetypes.
- **Take:** phages as the main procedural antagonist and as gene carriers; every defence a real system with a real counter. **Avoid:** phages as hit-point sponges. Their threat is information (they hijack your ribosomes), so show your ribosomes starting to build capsids.

### 4.4 Gene regulation as gameplay (the circuit board under the genes)

- **lac operon, a living AND/NOT gate [Established; bistability on natural lactose debated].** LacI repression is relieved by an inducer; CRP-cAMP activation is lowered by glucose (catabolite repression, inducer exclusion), giving diauxie. Ozbudak et al. 2004 showed bistability with an artificial inducer ([Ozbudak 2004](https://www.rpgroup.caltech.edu/cshl_pboc_2023/assets/pdfs/ozbudak2004.pdf)); whether it occurs on lactose itself is disputed ([Narang & Pilyugin](https://people.clas.ufl.edu/pilyugin/files/bmb2008.pdf)).
  - *Mechanic:* each gene sits behind a promoter with operator sites, and the player wires conditions (lactose present AND glucose absent → express). Visible diauxic lag while the cell retools, rendered as transcription lighting up the DNA; mistimed wiring wastes ATP.
- **Sigma factors: stances sharing one RNA polymerase pool [Established].** Alternative sigma factors compete for the same core polymerase. RpoS (general stress) controls about 500 genes, about 10% of the genome, and displaces housekeeping σ70 in stationary phase ([review 2024](https://pmc.ncbi.nlm.nih.gov/articles/PMC10966952); [Battesti et al.](https://pmc.ncbi.nlm.nih.gov/articles/PMC7356644)); RpoH is the heat-shock sigma.
  - *Mechanic: "Stances"* (Growth, Stress, Heat shock, Starvation). RNA polymerase is a finite pool of glowing machines on the DNA, so entering Stress silences part of Growth. Reactive playstyles without micromanagement.
- **Riboswitches [Established].** mRNA segments bind metabolites (TPP, FMN, B12) directly and switch their own translation, reported in 2002 ([Riboswitch](https://en.wikipedia.org/wiki/Riboswitch); [Winkler et al. 2002](https://doi.org/10.1038/NATURE01145)).
  - *Mechanic:* the cheapest regulator (no protein, one molecule sensed). Ideal early game; teaches that RNA computes. Visual: an mRNA ribbon folds shut when a metabolite bead docks.
- **Two-component systems: rewirable patch cables [Established].** A membrane histidine kinase senses and phosphorylates its response regulator. Mutating a handful of coevolving interface residues completely switched EnvZ's partner specificity ([Skerker et al. 2008, Cell](https://pmc.ncbi.nlm.nih.gov/articles/PMC2453690)).
  - *Mechanic: "Patch cables."* Any sensor can be rewired to any output (light sensor → flagella, osmotic sensor → spore program) by a few targeted mutations, with real cross-talk risk if pairs are too similar. The main programming toy.
- **Persisters and bet-hedging [Established; adaptive interpretation debated].** A small subpopulation switches stochastically into slow-growing persisters that survive antibiotics; switching pre-exists the drug ([Balaban et al. 2004](https://perso.crans.org/frenoy/compbiol/articles/Balaban2004.pdf); [commentary on terminology](https://genomebiology.biomedcentral.com/articles/10.1186/gb-spotlight-20040813-01)).
  - *Mechanic: "Insurance slider."* Set the fraction of daughters that sleep before unpredictable catastrophes (antibiotic floods, drying). You cannot react in time, so you diversify.
- **Sporulation, a point of no return [Established].** *B. subtilis* sporulates under starvation through a Spo0A-governed decision with a commitment step, taking about 8 h; the mother cell engulfs the forespore in a phagocytosis-like step, then dies ([Riley et al. 2020](https://microbialcell.com/researcharticles/2020a-riley-microbial-cell/); [Sporulation in B. subtilis](https://en.wikipedia.org/wiki/Sporulation_in_Bacillus_subtilis)). *E. coli* does not sporulate, so for the hero this is an acquired trait and must be labelled.
  - *Mechanic: "Last will."* A long, irreversible channelled action; the spore is a checkpoint that survives evaporation; the engulfment step echoes the hero's own tree.
- **Take:** regulation makes the same genes play differently, with visuals unique to Codon. **Avoid:** raw Boolean editors on day one; start with presets ("eat lactose only when hungry") and reveal wiring gradually.

### 4.5 Social microbiology: quorum sensing, biofilms, bacteriocins, contact weapons

- **Quorum sensing [Established].** *Vibrio fischeri* (bobtail squid light organ) makes an AHL autoinducer; LuxR bound to it boosts *luxI*, a positive-feedback loop that lights up only above a threshold density ([Bassler review](https://www.citedrive.com/en/discovery/bacterial-quorum-sensing-network-architectures)). Cheaters that skip the cost can spread ([Diggle et al. 2007](https://doi.org/10.1038/nature06279), *DOI not opened*). Quorum quenching enzymes such as lactonases destroy AHLs; some hosts modify the signal ([Quorum quenching](https://en.wikipedia.org/wiki/Quorum_quenching)).
  - *Mechanic: "Chorus abilities."* Some powers (bioluminescence, collective digestive enzymes, the biofilm switch) fire only when your clones' signal haze is thick enough. Enemies jam it with lactonase, you spoof theirs, and your own cheater mutants freeload, so the colony needs policing.
- **Biofilms with electrical signalling [Established].** In *B. subtilis* biofilms, starving interior cells open potassium channels and send K⁺ depolarization waves; the periphery pauses glutamate uptake so the interior gets fed, and the film grows in oscillations ([Prindle et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4890463)). The signals even attract motile cells of other species ([Humphries et al. 2017 coverage](https://www.sciencedaily.com/releases/2017/01/170112141216.htm)).
  - *Mechanic: "Biofilm base."* Secrete matrix, assign periphery and interior, tune the K⁺ heartbeat so the core does not starve, and use the pulses to lure passing cells. Rhythmic ripples of light through the film.
- **Bacteriocins: real rock-paper-scissors [Established].** Three *E. coli* strains cycle: colicin producer beats sensitive, resistant beats producer, sensitive beats resistant. All three coexist only when interactions are local (static plate); mixing destroys diversity ([Kerr et al. 2002, Nature](https://www.nature.com/articles/nature00823.pdf)).
  - *Mechanic:* a science-true core for colony-vs-colony. Each archetype is a real cost-benefit trade, and arena structure (mixed vs patchy) changes who wins: a built-in map-design lever.
- **Type VI secretion: contact spear guns with personalities [Established].** A contractile, phage-tail-like spear injects toxins into neighbours. *P. aeruginosa* fires back when attacked ("tit-for-tat", Basler 2013). Models suggest pure tit-for-tat loses to first strikers and repeated retaliation does better ([Smith et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7589516)).
  - *Mechanic:* a melee weapon plus AI temperaments (pre-emptive, retaliatory, pacifist) the player can read from an enemy's genes.
- **Take:** real game-theory dilemmas (public goods, cheaters, cycles, spatial structure) that are both science and good multiplayer design. **Avoid:** colony fights decided by bigger numbers.

### 4.6 Movement and senses

- **Chemotaxis [Established].** *E. coli* runs about 1 s and tumbles about 0.1 s, extends runs when things improve, and compares now with a few seconds ago using receptor methylation as short memory ([Princeton lecture notes](https://swh.princeton.edu/~akosmrlj/MAE545_S2018/lecture19_slides.pdf); [Somers explainer](https://jsomers.net/e-coli-chemotaxis/)).
  - *Mechanic: "No minimap; you have a nose and a 4-second memory."* The HUD shows "better / worse than a few seconds ago", not an arrow. Upgrades: more receptor types (new smells), denser arrays (sensitivity), longer memory, repellent sensing.
- **Magnetotaxis [Established].** Chains of membrane-bound magnetite (or greigite) crystals make a permanent compass, organized by proteins like MamK and MamJ ([Ben-Shimon et al. 2021](https://pmc.ncbi.nlm.nih.gov/articles/PMC8536778); [Pósfai et al. 2013](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2013.00344/pdf)).
  - *Mechanic:* a real bacterial organelle that locks swimming to one axis: dive straight to the floor, where a crowd's anoxic pockets open first (see *The drop's layers* below), or rise to the oxygen at the meniscus without wasted tumbles. Costs iron. A dark bead chain inside the jelly.
- **Phototaxis: the cell is a lens [Established].** Spherical *Synechocystis* cells act as microlenses: light focuses to a spot on the far side, the cell senses direction directly, and type IV pili pull it toward the light ([Schuergers et al. 2016, eLife](https://elifesciences.org/articles/12620)).
  - *Mechanic, made for the L-form:* **round your body into a sphere to see.** A visible caustic inside points at the light; deforming to move or eat blurs vision. A trade-off unique to a wall-less hero.
- **Twitching via type IV pili [Established].** Pili extend, adhere and retract; a single *Neisseria* PilT retraction motor stalls at about 110 pN, called the strongest known molecular motor in 2002 ([Maier et al.](https://experts.arizona.edu/en/publications/single-pilus-motor-forces-exceed-100-pn/); [JCB commentary](https://rupress.org/jcb/article/159/6/912/33270/PilT-a-motor-on-steroids)).
  - *Mechanic:* a grappling hook for the leaf cuticle, debris or prey; no coasting at low Reynolds number, so movement is pure tug; drag a catch somewhere safe to digest.
- **Gliding and swarming [Established].** *Myxococcus* A-motility uses an Agl-Glt motor anchored at focal-adhesion sites; S-motility is collective, pili-driven movement ([Contreras-Moreno et al. 2024](https://frontiersin.org/articles/10.3389/fmicb.2024.1339696/full)).
  - *Mechanic:* silent, flagellum-free surface movement with stealth from flagellin-sensing enemies (stealth part is **[Codon invention]**); swarms move faster together.
- **Gas vesicles [Established].** All-protein, gas-filled compartments (GvpA ribs) let cyanobacteria and haloarchaea set their depth; larger vesicles are more buoyant but collapse at lower pressure ([Gas vesicle](https://en.wikipedia.org/wiki/Gas_vesicle)).
  - *Mechanic:* hold any depth without swimming cost: up at the meniscus with the oxygen and the aerotactic crowd, or down on the cuticle floor with the leachate and grains; pressure events (raindrop impact, a shockwave boss) pop them. An earlier draft gave this a sunlit, UV-scorched top and a dim, anoxic bottom; that axis is withdrawn (next entry).
- **The drop's layers: what is real [Established physics; the layering is Codon staging].** *Correction:* earlier drafts (the entry above and gameplay §4.1) gave every drop a sunlit, oxygenated, UV-scorched top, a twilight middle and a dim, anoxic, nutrient-rich bottom. Most of that was staging presented as fact.
  - *Light does not layer.* Pure water absorbs least at 418 nm, an attenuation length of about 227 m, and even at 200 nm, deep in the UV-C, the attenuation length is 14.5 cm ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)). A 4 mm drop of clear water therefore loses under 3% of the light at any wavelength from 200 nm through the visible: no twilight middle, no UV-scorched top. How much UV the leaf's leachate absorbs in real dew is *unverified*; nothing suggests a dark layer.
  - *Oxygen layers only under a crowd.* Oxygen enters at the air surface, and respiring cells can use it up faster than it diffuses in. For steady consumption at rate *k* below a surface held at saturation *S*, oxygen reaches a depth *a* = √(2*DS*/*k*); Stewart's worked example, a growing *P. aeruginosa* biofilm packed at 12 mg cm⁻³ and consuming 3.1 mg O₂ L⁻¹ s⁻¹, runs out of oxygen 77 µm in ([Stewart 2003](https://pmc.ncbi.nlm.nih.gov/articles/PMC148055/)). With *D* = 2.1 × 10⁻⁵ cm² s⁻¹ for O₂ in water at 25 °C ([Mass diffusivity](https://en.wikipedia.org/wiki/Mass_diffusivity)) and about 6 mL of O₂ per litre of air-saturated fresh water at 25 °C, roughly 8 mg/L ([Oxygen](https://en.wikipedia.org/wiki/Oxygen)), our arithmetic gives: the floor of a 2 mm-deep drop goes anoxic only once its cells consume about 0.008 mg O₂ L⁻¹ s⁻¹, about 1/370 of that biofilm's rate, and the threshold rises as 1/depth². In cells, that is of order 10⁸ per mL respiring as hard as a fast-growing biofilm (the conversion is *unverified*: it depends on whether Stewart's density is dry or wet mass). A leaf's 10⁶–10⁷ bacteria per cm² ([BioNumbers](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368)), all swimming in 2 mm of water over that square centimetre, would be 5 × 10⁶–5 × 10⁷ per mL: below the threshold, though not by much. Real aerotactic bacteria do pile up in a band at an air–liquid interface, and in a closed setup the band shrinks toward the air as the oxygen is used up ([Aerotaxis](https://en.wikipedia.org/wiki/Aerotaxis), citing Stricker et al. 2020). Whether any real dew drop goes anoxic is *unverified* (section 8).
  - *Mechanic (gameplay §4.1):* light is set by **shadows**, not depth: leaf hairs (dense hairs "reflect ozone and UV radiation from sunlight", [Trichome](https://en.wikipedia.org/wiki/Trichome)), the magnifier's rim and the warm spot it focuses, the child's head leaning in, and the focus of a bead held up on hairs, which can burn a leaf ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)). **Anoxia is emergent**, computed from local crowding, respiration and distance to the nearest air surface: every drop starts oxic, and pockets open under crowds, inside clumps and in the packed Rim. Depth keeps honest reasons to choose it: oxygen at the skin, leachate and grains on the floor. **[Codon staging]**: the physics is real; the tempo and placement are ours.
- **Take:** senses that are the cell's own physics (memory, lens, compass). **Avoid:** omniscient information; diegetic sensing is the differentiator from Thrive's cluttered HUD.

### 4.7 Predation and engulfment (precedents for the hero)

- ***Bdellovibrio*, the bullet predator [Established].** Swims into Gram-negative prey's periplasm (possibly using type IV pili), seals the hole, rounds the prey into a bdelloplast, grows, divides and bursts out, usually in 3–4 h ([Frontiers 2020 review](https://www.frontiersin.org/journals/microbiology/articles/10.3389/fmicb.2020.00662/pdf); [review](https://pmc.ncbi.nlm.nih.gov/articles/PMC7174725)). A terrifying enemy archetype. How it treats a wall-less L-form (no periplasm in the usual sense) is an open question: an "immune by accident" twist, flagged **[Codon invention]**. *Superseded:* gameplay §4.2 forbids presenting wall loss as protection. The question ships as a codex entry badged Hypothesis, and in play the stalker must re-solve its grip on a deforming body, a telegraphed window rather than an immunity. Also an alternate burrow-and-burst lifestyle.
- ***Myxococcus*, wolf packs and fruiting bodies [Established].** Packs lyse prey with shared secretions ([predation strategy review](https://pmc.ncbi.nlm.nih.gov/articles/PMC6971385)); starving cells aggregate into fruiting bodies where some become myxospores ([2024 update](https://frontiersin.org/articles/10.3389/fmicb.2024.1339696/full)). *Mechanic:* pack-hunting colony mode (shared enzymes are a public good) and a fruiting-body set piece with a commitment choice: cells that join "transform from rods into spherical, heat-resistant myxospores, while the peripheral cells remain rod-shaped" ([Myxococcus](https://en.wikipedia.org/wiki/Myxococcus_xanthus)). *Corrected:* an earlier draft offered "who becomes stalk, who becomes spore"; the dying stalk is the amoeba *Dictyostelium*'s, a eukaryote's, so it is a comparison and not this bacterium's program (gameplay #129).
- **Engulfing bacteria [Established].** The planctomycete *Gemmata obscuriglobus* takes up whole proteins by an energy-dependent, endocytosis-like process with a clathrin-like coat protein ([Lonhienne et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973); [Fuerst & Sagulenko](https://pmc.ncbi.nlm.nih.gov/articles/PMC3038067)). *Candidatus* Uabimicrobium amorphum engulfs bacteria and small eukaryotes and digests them in compartments, probably not homologous to eukaryotic phagocytosis ([Shiratori et al. 2019, Nat. Commun.](https://ideas.repec.org/a/nat/natcom/v10y2019i1d10.1038_s41467-019-13499-2.html); [Wikipedia](https://en.wikipedia.org/wiki/Uabimicrobium_amorphum)).
  - *Mechanic: an honest phagocytosis ladder:* protein uptake (Gemmata) → particle engulfment → whole-cell engulfment (Uabimicrobium) → digestive compartments → keep-not-digest (endosymbiosis, 4.10). Codex line: "Bacteria have done this at least twice. None went all the way. You might."

### 4.8 Metabolism variants: new ways to make the proton motive force

Codon already renders the PMF route, the ideal spine: every new metabolism is a new pump, electron donor or acceptor plugged into the same visible machinery.

- **Rhodopsin vs chlorophyll [Established].** Proteorhodopsin, found by metagenomics of marine bacterioplankton in 2000, is a single retinal protein that pumps protons when lit ([Béjà et al. 2000](https://hahana.soest.hawaii.edu/cmoreserver/summercourse/2014/documents/DeLong_2/beja_sci_rhodop.pdf)). Bacteriorhodopsin (*Halobacterium*) forms purple membrane, absorbs mostly green light and moves one proton per photon with no electron-transport chain ([Bacteriorhodopsin](https://en.wikipedia.org/wiki/Bacteriorhodopsin)). Chlorophyll photosynthesis is far more complex but also fixes carbon and, in cyanobacteria, releases O₂.
  - *Mechanic:* rhodopsin is the early-game solar panel (one gene plus retinal; the cell turns faintly purple; a direct H⁺ pump feeding your ATP synthase; no carbon fixation). Chlorophyll is the late megaproject whose O₂ exhaust poisons your nitrogenase, anaerobic neighbours and eventually the world (4.12).
- **Chemolithotrophy [Established].** Winogradsky (1887–88) showed *Beggiatoa* gains energy by oxidizing H₂S and stores sulfur globules, the first known lithotrophy ([Winogradsky](https://en.wikipedia.org/wiki/Sergei_Winogradsky); [Beggiatoa](https://en.wikipedia.org/wiki/Beggiatoa)). *Mechanic:* mineral grains and dissolved gases become food; sulfur globules are a visible pearly battery.
- **Nitrogen fixation vs oxygen [Established].** Nitrogenase is extremely O₂-labile. Filamentous cyanobacteria use heterocysts (thick glycolipid envelopes, no photosystem II, high respiration) that fix N₂ and trade it for sugar through intercellular channels; NtcA triggers them under nitrogen limitation ([Heterocyst](https://en.wikipedia.org/wiki/Heterocyst)). *Mechanic:* a hard **incompatibility rule** (no oxygenic photosynthesis and nitrogenase in one compartment), solved by day/night time-sharing, division of labour, or an organelle.
- **Methanogenesis and syntrophy [Established; deep-origin details debated].** Methanogenesis is essentially archaeal and coupled to the ancient Wood-Ljungdahl pathway; hydrogenotrophic methanogenesis is probably the oldest form; some bacteria with Fe-only nitrogenase make traces of methane ([Adam et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC4943185); [2018 study](https://read.qxmd.com/read/30612264/methanogenesis-on-early-stages-of-life-ancient-but-not-primordial)). *Mechanic:* the bacterial hero cannot evolve it alone, which honestly motivates H₂-trading partnerships with archaea (4.10).
- **Electricity: nanowires and cable bacteria [Established].** *Geobacter* exports electrons to iron oxides and electrodes through conductive cytochrome filaments, once thought to be pili ([Geobacter](https://en.wikipedia.org/wiki/Geobacter)). Cable bacteria are centimetre-long filaments with 15–60 insulated, nickel-rich fibres in a shared periplasm, coupling sulfide oxidation deep in sediment to O₂ reduction at the surface ([Cable bacteria](https://en.wikipedia.org/wiki/Cable_bacteria)). *Mechanic: "Power lines."* A chain of your cells spans the drop's oxic/anoxic boundary, wherever a crowd has made one (4.6, *The drop's layers*); bottom cells eat sulfide, top cells breathe O₂, electrons glow up the wire.
- **Protein microcompartments [Established].** 40–200 nm protein shells: carboxysomes concentrate CO₂ around RuBisCO; metabolosomes trap toxic aldehyde intermediates; found in at least 45 phyla ([Bacterial microcompartment](https://en.wikipedia.org/wiki/Bacterial_microcompartment)). *Mechanic: "Crafting chambers"*: dangerous or high-yield pathways run only inside a shell; icosahedral, gem-like shells suit the renderer.
- **Take:** one PMF spine with swappable donors, acceptors and pumps, so complexity stays legible. **Avoid:** abstract "energy points".

### 4.9 Extremophiles: biome modifiers and gene donors

- **Radiation [Established].** *Deinococcus radiodurans* survives about 5,000 Gy with little loss, reassembling a shattered genome from multiple copies about 3 h after a 1-megarad dose ([Scientific American](https://www.scientificamerican.com/article/cheating-dna-death-how-an/)). *Mechanic:* at the UV-blasted drop surface, extra genome copies let you watch fragments re-zip after a hit.
- **Heat [Established].** *Methanopyrus kandleri* strain 116 grew at 122 °C under high pressure; 116 °C at low pressure ([JAMSTEC](https://www.jamstec.go.jp/e/about/press_release/20080729/index.html); [Takai et al. 2008](https://ui.adsabs.harvard.edu/abs/2008PNAS..10510949T/abstract)).
- **Acid, salt, cold, pressure [Established].** *Picrophilus* grows around pH 0.06–1; halophiles thrive at about 5% salt and above ([Polyextremophile](https://en.wikipedia.org/wiki/Polyextremophile)).
- *Mechanic: "The drop's day is the clock."* The drop warms, concentrates salt as it evaporates and takes rising UV toward midday, opening extremophile branches and timing the run. The stress schedule is **[Codon invention]** grounded in evaporation physics; leaf-surface data was not researched here. Extremophile genes arrive mainly by HGT from rare NPC species, a reason to hunt them.

### 4.10 The hero's own biology: L-forms, endosymbiosis, eukaryogenesis

- **L-forms [Established for the phenomenon; origin-of-life link is Hypothesis].** Blocking peptidoglycan precursor synthesis yields L-forms in Gram-positive and Gram-negative bacteria; wall-free cells divide without FtsZ or MreB, by blebbing, tubulation and vesiculation driven simply by excess membrane synthesis ([Mercier et al. 2014, eLife](https://pmc.ncbi.nlm.nih.gov/articles/PMC4244569)). L-forms were found in fresh urine of 29 of 30 older recurrent-UTI patients; patient *E. coli* switched to L-form under cell-wall antibiotics, reverted after withdrawal, and switched in zebrafish larvae ([Mickiewicz et al. 2019, Nat. Commun.](https://doi.org/10.1038/s41467-019-12359-3)); press coverage reports wall rebuilding within about 5 h ([News-Medical](https://www.news-medical.net/news/20190926/Mechanisms-behind-antibiotic-resistance-captured-on-video-for-the-first-time.aspx)). Errington argues L-form division may resemble how primitive cells proliferated ([Harvard Origins talk](https://origins.harvard.edu/event/cell-wall-deficient-l-form-bacteria-mechanism-proliferation-and-implications-emergence.md)), **[Hypothesis]**.
  - *Mechanic: "Wall toggle" (science-true).* Rebuild the wall for rigidity, osmotic safety and a better swimming shape; stay jelly for engulfment, squeezing through gaps, immunity to wall-targeting antibiotics, the lens trick (4.6) and blob division, at the price of osmotic shock and lysis (ties to evaporation and salt).
  - *Mechanic: "Overgrow to divide."* Division is not a button: pump membrane synthesis until the body blebs, then guide where it pinches. A tactile sculpting moment unique to Codon.
- **Endosymbiosis [Established core; specific cases vary].** Mitochondria derive from alphaproteobacteria and plastids from cyanobacteria (double membranes, own DNA, 70S ribosomes, binary fission, formyl-methionine; Mereschkowski 1905, Margulis 1967) ([Symbiogenesis](https://en.wikipedia.org/wiki/Symbiogenesis)). Recent or ongoing cases:
  - ***Paulinella***: an independent cyanobacterial primary endosymbiosis about 90–140 Mya; its genome shrank to about a third, with genes moved to the host ([Paulinella](https://en.wikipedia.org/wiki/Paulinella)).
  - **The nitroplast (2024)**: a nitrogen-fixing organelle from cyanobacterium UCYN-A in the alga *Braarudosphaera bigelowii*; host proteins are imported via targeting sequences and its division is synchronized with the host's ([Nitroplast](https://en.wikipedia.org/wiki/Nitroplast); Coale et al. 2024, *Science*).
  - ***Hatena arenicola***: only one daughter keeps the algal symbiont; the other regrows a feeding apparatus and must hunt for a new one ([Hatena](https://en.wikipedia.org/wiki/Hatena_arenicola)), "a secondary symbiosis in progress?"
  - *Mechanic: "Domestication arc"* for any engulfed-but-undigested cell: **Hostage** (lives in a vacuole, may escape or rot, eats your food) → **Partner** (shares ATP, sugar or fixed N₂; division unsynchronized, so like *Hatena* one daughter loses it) → **Integration** (move its genes to your chromosome, risking breakage; build import machinery with targeting tags) → **Organelle** (synchronized division, reduced genome, permanent slot). A captured respirer becomes a mitochondrion-like power plant, a cyanobacterium a plastid, an N-fixer a nitroplast. Paulinella and the nitroplast are the honesty anchors: it happened more than once.
  - *Not new as a feature:* Thrive already ships endosymbiosis ("Use endosymbiosis to turn other species into a part of yourself", [Steam](https://store.steampowered.com/app/1779200/Thrive/)) and offers it as an alternative route to organelle unlocks (2.2). What Codon adds is the staged arc with real failure modes (the *Hatena* split, gene transfer that can break things, import tags) and a bacterial host, a road real history did not take (see the Asgard entry below).
- **Eukaryogenesis and Asgard archaea [Established that Asgard archaea are the closest archaeal relatives; branch and mechanism Hypothesis].** Asgard archaea (named from Lokiarchaeota, 2015) encode eukaryote-like actin regulators, ESCRT, small GTPases and ubiquitin systems. Eme et al. 2023 placed eukaryotes as sister to Hodarchaeales within Heimdallarchaeia ([doi](https://doi.org/10.1038/s41586-023-06186-2)); a 2025 *Nature* study proposes a deeper origin within Asgardarchaeota ([Asgard, Wikipedia](https://en.wikipedia.org/wiki/Asgard_archaea)). Imachi et al. took about 12 years to culture *Promethearchaeum syntrophicum*, a 550 nm cell with long branching protrusions that cannot make energy alone and trades H₂ with a sulfate reducer and a methanogen; they proposed the entangle-engulf-endogenize (E3) model ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum); [Imachi 2020](https://doi.org/10.1038/s41586-019-1916-6)).
  - *Implication:* in real history the host was an archaeon and an alphaproteobacterium became the mitochondrion. An *E. coli*-like hero becoming the host is a **road not taken**, made plausible by Gemmata and Uabimicrobium. Say so plainly; the honesty becomes drama.
  - *Mechanic: "The Tentacled Stranger" story fork.* An Asgard-like archaeon's protrusions entangle you.
    - **Path A (Hypothesis · E3 model):** let its protrusions entangle you and, over generations, wrap you; become its power plant, and play on as the organelle lineage. Only the roles are history's: an archaeal host and an alphaproteobacterial guest. The way in is a model. Imachi et al. offer E3 as "one of several conceivable scenarios", "probably independent of phagocytosis", and their cells "contain no visible organelle-like inclusions" ([Imachi 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015854/)). No one has seen the archaeon engulf a cell, the protrusions' function is "yet unknown", and "archaea are not efficient cell eaters" ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum)).
    - *Scale:* a 0.55 µm cell cannot swallow a 1 × 2 µm hero. Draw the Stranger at its real size and stage Path A as wrapping, not a swallow. A Stranger line grown big enough to wrap the hero is **Codon invention**, and so is an *E. coli*-like guest: *E. coli* is a gammaproteobacterium ([Gammaproteobacteria](https://en.wikipedia.org/wiki/Gammaproteobacteria)), and the real guest was an alphaproteobacterium.
    - **Path B (road not taken):** engulf *it*; at 0.55 µm it fits inside the hero.
    - The codex marks which part is real (story §3.4, §7).
- **Bacterial "organelles" few players know.** *Thiomargarita magnifica* [Established] is a 1–2 cm bacterium whose DNA sits in membrane-bound "pepins", pearly with sulfur granules ([Volland et al. 2022](https://en.wikipedia.org/wiki/Thiomargarita_magnifica)): a real precedent for a proto-nucleus upgrade (phage protection at the cost of slower response) and a giant-cell path. The **ocelloid** [Established structure; function inferred] of warnowiid dinoflagellates is a single-celled eye with a lens (hyalosome), a cornea-like layer of mitochondria and a retina-like body from plastid membranes ([Ocelloid](https://en.wikipedia.org/wiki/Ocelloid); Gavelis et al. 2015): the ultimate composite-organelle recipe and an endgame aspiration.

### 4.11 Multicellularity

- **Real [Established].** Multicellularity evolved independently at least 25 times in eukaryotes, plus in cyanobacteria and myxobacteria. Snowflake yeast clusters arise from losing one gene (*ace2*); under selection for settling, after 3,000+ generations they became millimetre-scale, but only in anaerobic lines (Bozdag et al. 2023; [Multicellular organism](https://en.wikipedia.org/wiki/Multicellular_organism)). *Volvox* has up to thousands of cells with only a few reproducing (germ/soma). The choanoflagellate *Salpingoeca rosetta* forms rosettes when a prey bacterium's sulfonolipid (RIF-1) is present at femtomolar levels ([Alegado et al. 2012, eLife](https://elifesciences.org/articles/00013)).
- *Mechanic: "Don't let go."* One knockout ("daughters stay attached") turns the run from one hero into a cluster. Then division of labour (heterocyst-like N₂ cells, germ/soma, stalk/spore) and cheater policing. Two routes with different problems: clonal (snowflake) and aggregative (*Myxococcus*, *Dictyostelium*). Story beat: bacteria triggered multicellularity in animals' relatives, so the player's chemistry can spark the next era. Oxygen limits size, which links to the Great Oxidation Event.

### 4.12 Planet-scale epochs: the Great Oxidation Event and LUCA

- **Great Oxidation Event [Established that it happened; timing and extinction scale debated].** About 2.46–2.06 Ga, cyanobacterial O₂ accumulated; it likely oxidized greenhouse methane (possibly triggering the Huronian glaciation), precipitated iron as banded iron formations, and may have caused a large anaerobe die-off (one proxy suggests over 80% biosphere decline, contested). At least about 400 Myr separated cyanobacteria and atmospheric O₂, attributed to sinks such as reduced iron and gases ([Great Oxidation Event](https://en.wikipedia.org/wiki/Great_Oxidation_Event)).
  - *Mechanic: "The oxygen fuse."* Cyanobacteria (possibly your own lineage) pump O₂; dissolved iron soaks it up as rust snowing through the drop; when the sinks are spent, anaerobes suffocate, methane collapses and the world freezes. O₂ breathers inherit the richest energy source. A moral mirror: your success poisoned your world.
- **LUCA [Hypothesis-heavy].** Moody et al. 2024 estimate LUCA at about 4.2 Ga with about 2,600 proteins, perhaps an anaerobic acetogen, perhaps with an early CRISPR-like defence (hedged), already in an ecosystem; Weiss et al. 2016 proposed a hydrothermal-vent, Wood-Ljungdahl lifestyle; critics dispute thermophily, habitat and dating, and "the nature of LUCA remains disputed" ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor); [Moody et al. 2024](https://doi.org/10.1038/s41559-024-02461-1)).
  - *Mechanic / story:* "ancestral memories". The hero's oldest genes (ribosome, ATP synthase, the genetic code) are an heirloom; unlockable interludes replay key transitions, labelled as hypothesis.

### 4.13 Synthesis for designers

**The central loop: "Genome as deck, regulation as rules, environment as opponent."**
1. **Genes are cards** with real costs (ATP, amino acids, replication time), from mutation (4.1), theft (4.2), domestication (4.10) or ancestral memory (4.12).
2. **Regulation decides when cards play** (4.4): stances, operators, riboswitches, rewirable two-component systems.
3. **Phages are the procedural opponent** that co-evolves with you (4.3).
4. **The drop is the arena and the clock** (4.6, 4.9): a vertical O₂/light gradient, evaporation raising salt and UV, spatial structure deciding social contests (4.5).
5. **Big transitions are acts:** wall loss → engulfment (4.7, 4.10) → domestication → the Asgard fork → multicellularity (4.11) → the oxygen fuse (4.12).

**Build tiers for a small team**
- **Tier 1 (fits the current prototype):** chemotaxis memory HUD; mutation-type cards on real genes; lac-style operator wiring with presets; DNA-fragment scavenging and plasmid slots; lytic phage plus CRISPR spacers; wall toggle and membrane-overgrowth division; the phagocytosis ladder; rhodopsin solar pump.
- **Tier 2:** sigma-factor stances; persister slider and spores; temperate phages with the SOS betrayal; conjugation trade; quorum chorus and quenching; bacteriocin rock-paper-scissors arena; pili grapple, gas vesicles, magnetosomes; nitrogenase-vs-O₂ rule; chemolithotrophy.
- **Tier 3:** domestication arc and organelles; Asgard story fork; biofilm base with K⁺ heartbeat; multicellularity and cable-bacteria power lines; Great Oxidation world event; LUCA interludes; ocelloid endgame.

**Honesty layer.** Each codex entry carries a badge (Established / Debated / Hypothesis / Codon invention) and one source.

**Research gaps not covered (search budget ran out):** phyllosphere microbiology of dew, UV and desiccation (a strong candidate for the opening setting); *P. syringae* ice-nucleation proteins as a "frost" event (partly covered in section 3); primary pages for Doron 2018, Rodrigues-Oliveira 2023 (*Lokiarchaeum ossiferum* actin) and the 2025 Asgard papers; quantitative mutator-strain rates.

---

## 5. Wild breadth: mechanics from anywhere

**Method note.** The shared search budget was used up before this sweep began, so every source was fetched directly from a known primary or reference page (Wikipedia, Steam, official sites, PubMed Central). Details not re-checked are marked *(not re-verified)*. Two biology titles, *Biotix: Phage Genesis* and *Immune Defense*, could not be reached without search during this sweep; a later revision pass fetched their primary pages, and both are now covered in section 1.3 (*Immune-system and phage strategy*). A follow-up pass should add fresher 2026 Steam data.

### 5.1 The answer in one paragraph

Start Codon as a **short-session action roguelite inside one drop of water: a "Drop Run" of 15–25 minutes.** Four layers hang off it:
- **Build-crafting is the genome itself**, a synergy engine like Balatro or Vampire Survivors but with real genes, operons and regulation.
- **Death and continuity work through lineage**: like Rogue Legacy's heirs and Mewgenics' cats, every division offers daughters with real mutations.
- **Long-term progression is knowledge plus a codex** (Outer Wilds, Subnautica), with real microscopy unlocked the way Never Alone unlocks documentary clips.
- **The hub between runs is the colony or biofilm** (Hades' House, Cult of the Lamb's cult, Thronefall's day/night split).

Multiplayer, when it comes, should be **asynchronous and gene-based**, not real-time Clash Royale: Dark Souls-style bloodstains become DNA left by other players' dead cells (natural transformation); Backpack Battles-style ghosts become colony raids; Helldivers 2-style Major Orders become a community "Lenski flask". Every other mechanic here plugs into that spine as a drop type, boss, mode, event or tree branch.

### 5.2 What the biggest indie genre fusions on Steam have in common

| Game | Fusion | Evidence of success | What players and critics disliked | Codon takes |
|---|---|---|---|---|
| [Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors) | Shoot 'em up with automated shooting + roguelike | [$4.99, 98% of 128,546 reviews positive](https://store.steampowered.com/app/1794680/); 70,000+ concurrent by Feb 2022; BAFTA Best Game 2023 | Clones that don't separate the player from clutter ([RPS via Wikipedia](https://en.wikipedia.org/wiki/Bullet_heaven)) | Evolutions from a maxed gene plus a matching partner (2.5) |
| [Balatro](https://en.wikipedia.org/wiki/Balatro) | Poker + roguelike deckbuilder | 1M+ in month one; 5M+ by Jan 2025, about half after mobile launch | PEGI controversy over gambling imagery | Keyword synergy and chips × mult for gene cards and operon hands (2.2, 5.8) |
| [Slay the Spire](https://en.wikipedia.org/wiki/Slay_the_Spire) | Deckbuilder + roguelike map | 1M by Jun 2018; a large Chinese streamer caused a sales jump | Balancing randomness against permadeath was hard (developers) | The pick-1-of-3 division draft, telegraphed intents, pick-rate telemetry (2.2, 5.8) |
| [Hades](https://en.wikipedia.org/wiki/Hades_(video_game)) | Action roguelite + story across deaths | 700k in early access; 1M+; Metacritic 93; Hugo Award | Can slide into button-mashing (Game Informer) | A story beat per lysis; gene offers on engulfment; God Mode as an assist (5.3) |
| [Stardew Valley](https://en.wikipedia.org/wiki/Stardew_Valley) | Farming + RPG + social + dungeon | 50M+ by Feb 2026 | Repetitive early farming, slow travel, thin tutorial | A familiar substrate plus one twist; a long tail of free updates (patterns 1, 7) |
| [Cult of the Lamb](https://en.wikipedia.org/wiki/Cult_of_the_Lamb) | Roguelite crusades + colony management | 1M in week one; 7M by Apr 2026 | Little time to manage the cult; muddled 2.5D combat | The colony hub between runs, kept low-upkeep (5.1, 5.6) |
| [Dave the Diver](https://en.wikipedia.org/wiki/Dave_the_Diver) | Diving by day feeds a restaurant by night | 5M by Nov 2024; Metacritic 90 | Steam reviewers: a repetitive, grindy loop (42 mentions), gimmicky bosses (35), an overwhelming amount of content with little guidance (31) ([VaporLens](https://vaporlens.app/app/1868140)) | Two loops sharing one currency: Drop Runs feed the colony with genes (6.1) |
| [Against the Storm](https://en.wikipedia.org/wiki/Against_the_Storm_(video_game)) | City builder + roguelite (settlement = run) | 1M+ by May 2024; Metacritic 91 | Steam reviewers: unintuitive design (22), a repetitive loop (20), frustrating RNG (18), small, hard-to-read text (17) ([VaporLens](https://vaporlens.app/app/1336490)) | The run-as-settlement with an impatience clock: the drying drop (5.6) |
| [Dome Keeper](https://en.wikipedia.org/wiki/Dome_Keeper) | Mining + tower defence | Metacritic 76 | Eurogamer: the split weakened both halves; short | The warning: run and hub must share one currency (6.2) |
| [Thronefall](https://en.wikipedia.org/wiki/Thronefall) | Minimal builder by day + defence by night | Just under 1M in year one | Steam reviewers: no group selection of units (21), a sharp late-game difficulty spike (20), too little content in a 20-level campaign (20) ([VaporLens](https://vaporlens.app/app/2239150)) | The hero fights inside its own defences, i.e. inside the biofilm (5.5) |
| [Loop Hero](https://en.wikipedia.org/wiki/Loop_Hero) | Idle auto-hero + tile placing + deckbuilding | TGA Best Independent Game nominee | Few new cards late on | A placement risk meter: the more you feed, the more you smell (5.8) |
| [Palworld](https://en.wikipedia.org/wiki/Palworld) | Creature collection + survival crafting + base automation | 2,101,867 concurrent on Steam (Jan 2024); 32M players by Feb 2025 | Derivative; patent suit from Nintendo and The Pokémon Company over capture mechanics | Familiar substrate plus a twist (pattern 1); clear the IP on any borrowed mechanic, as with the Nemesis patent (5.7) |
| [Lethal Company](https://en.wikipedia.org/wiki/Lethal_Company) | Co-op scavenging + horror + proximity voice | Est. 10M+ by Jan 2024; Streamer Awards Stream Game of the Year | Limited content | Chaos that reads on stream: big, readable spectacles such as phage bursts (5.18) |
| [Peak](https://en.wikipedia.org/wiki/Peak_(video_game)) | Co-op climbing; one stamina bar; daily mountain | 10M+ by mid-Aug 2025, from a one-month jam | Steam reviewers: optimization and performance (30), servers and connections (23), physics and mechanics (20), no saves (15) ([VaporLens](https://vaporlens.app/app/3527290)) | One PMF vitality bar every stressor bites; the Daily Drop (5.13, 5.16) |
| [Content Warning](https://en.wikipedia.org/wiki/Content_Warning_(video_game)) | Co-op horror + filming monsters for in-game views | 6.2M claimed during the free launch; 200k+ concurrent | Steam reviewers: repetitive quickly (30), seen as abandoned (27), bugs (25), dull solo (19) ([VaporLens](https://vaporlens.app/app/2881650)) | Captured footage as progress: Micrograph Mode feeding the codex (5.10); its weak solo play is a warning for a single-player-first game |
| [Megabonk](https://en.wikipedia.org/wiki/Megabonk) | 3D survivors-like | 1M in two weeks; 117,336 concurrent | Repetitive challenges; two maps | 3D verticality: the drop's vertical light and oxygen axis (4.6, 5.3) |
| [Blue Prince](https://en.wikipedia.org/wiki/Blue_Prince) | Puzzle + roguelite room drafting | Highest-rated 2025 game on Metacritic at release | No colourblind support at launch | Knowledge that carries between runs; never colour alone (5.11, 5.19) |
| [Mewgenics](https://en.wikipedia.org/wiki/Mewgenics) | Genetic breeding + tactical roguelike | 1M in week one (Feb 2026); Metacritic 88 | Unfair randomness at times; repetition | Division as heir choice with visible mutations (5.8) |
| [Backpack Battles](https://en.wikipedia.org/wiki/Backpack_Battles) | Inventory adjacency + async PvP auto-battles | 640k in month one | Too few items to keep runs fresh (IGN 6/10) | Async ghost colonies built from saved genomes (5.7) |
| [Dredge](https://en.wikipedia.org/wiki/Dredge_(video_game)) | Fishing + Lovecraftian horror + inventory Tetris | 1M by Oct 2023 | Repetitive fishing; short days | Calm days, rising tension, aberrant mutants worth codex points (5.13) |
| [Dwarf Fortress](https://en.wikipedia.org/wiki/Dwarf_Fortress) | Colony sim + history generator | Steam edition ~$7.2M in Jan 2023, vs ~$15k a month before | The old interface was the main barrier | A usable UI from day one; Legends-style histories as the Lineage Chronicle (5.15) |

**Patterns to copy**
1. **A familiar substrate plus one twist.** Balatro is built on the 52-card deck, a tool its developer says "has evolved over hundreds of years" ([source](https://en.wikipedia.org/wiki/Balatro)); Stardew began as a better *Harvest Moon*; Palworld is Pokémon plus survival. Codon's substrate is the genetic code (4 letters, 64 codons) plus the most familiar cell-game rule, "eat smaller, flee bigger" ([agar.io](https://en.wikipedia.org/wiki/Agar.io), [Osmos](https://en.wikipedia.org/wiki/Osmos), [Spore's cell stage](https://en.wikipedia.org/wiki/Spore_(2008_video_game))).
2. **Two loops that feed each other** (Dave the Diver, Cult of the Lamb, Thronefall, Loop Hero). Counter-example: Dome Keeper. Run and hub must share one currency (genes and DNA).
3. **Short sessions, large build variety** (Vampire Survivors' 15/20/30-minute soft limits).
4. **Chaos that reads on stream** (Lethal Company, Peak, Content Warning, Super Auto Pets, Slay the Spire; see 5.18).
5. **Knowledge as progression** (Outer Wilds, Blue Prince).
6. **An approachable interface widens the audience.** Dwarf Fortress went from about $15k a month to $7.2M in a month once it had a usable UI. UI clutter is among Thrive's most-cited complaints (5.14).
7. **A long tail through updates.** No Man's Sky's redemption, Stardew's 1.6, Rain World's Downpour DLC (182k copies at release).

### 5.3 Action: dodge, dash, combos, bosses

- **Sources.** [Hades](https://en.wikipedia.org/wiki/Hades_(video_game)): a dash with momentary intangibility, pick-of-three god-themed boons, story between runs, God Mode that strengthens you after each failure; can slide into button-mashing. [Enter the Gungeon](https://en.wikipedia.org/wiki/Enter_the_Gungeon): invulnerable dodge roll; 3M+ sold; frustrating bosses, many guns alike. [Shadow of the Colossus](https://en.wikipedia.org/wiki/Shadow_of_the_Colossus): 16 colossi are the only enemies, each a climbable weak-point puzzle ("inverted Zelda dungeons"); camera and frame-rate complaints. Survivors-likes automate attacks so attention goes to movement and builds ([Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors)); [Megabonk](https://en.wikipedia.org/wiki/Megabonk) added 3D verticality. Cell games: [agar.io](https://en.wikipedia.org/wiki/Agar.io) (split up to 16 ways, eject mass; about 5M daily players at peak); [Osmos](https://en.wikipedia.org/wiki/Osmos) (steer by ejecting mass, a physics-honest cost of thrust); [Flow](https://en.wikipedia.org/wiki/Flow_(video_game)) (no menus, dynamic difficulty, losing sends you up a layer; shallow); [Spore's cell stage](https://en.wikipedia.org/wiki/Spore_(2008_video_game)) ("too fleeting").
- **Biology that makes action honest.**
  - *Dodge is a tumble.* In E. coli, counterclockwise flagellar rotation bundles the flagella for a run; clockwise splits the bundle and the cell tumbles and reorients ([Chemotaxis](https://en.wikipedia.org/wiki/Chemotaxis)): an instant random reorientation with no momentum, true to low Reynolds number.
  - *Phages are bullet hell, not colossi.* T4 is about 90 × 200 nm, binds OmpC porin and LPS, contracts its tail and injects DNA; the lytic cycle takes about 30 minutes and releases 100–150 phages ([T4](https://en.wikipedia.org/wiki/Escherichia_virus_T4)). A "phage boss" is honestly a swarm that bursts out after a timer.
  - *The real colossus is a giant amoeba.* *Chaos carolinense* can "reach lengths up to 5 mm, although most specimens fall between 1 and 3 mm", has up to a thousand nuclei, and is "able to feed on bacteria, algae, other protists, and even small multicellular invertebrates" by phagocytosis into a vacuole ([Chaos](https://en.wikipedia.org/wiki/Chaos_(genus))). Bacteria can live through the vacuole: in a large free-living amoeba (*Amoeba proteus*), bacteria that arrived as parasites killed almost all the hosts at first ([Endosymbiont](https://en.wikipedia.org/wiki/Endosymbiont)), then "are not digested by the host amoebae", which came to "require the presence of live endosymbionts for their survival" ([Jeon & Jeon 1976](https://pubmed.ncbi.nlm.nih.gov/972171/)). *Corrected:* an earlier draft named *Dictyostelium* here. It eats bacteria ("feed primarily on E. coli") only as single amoebae of about 10 µm (a typical figure; the page gives none); its 2–4 mm stage is the slug of up to 100,000 cells, which crawls toward light and heat ([Dictyostelium](https://en.wikipedia.org/wiki/Dictyostelium_discoideum)).
  - *Speed boss.* *Bdellovibrio* swims about 160 µm/s (over 100 body lengths a second), bores into Gram-negative periplasm, rounds the host into a bdelloplast and bursts out within about 3–4 hours ([Bdellovibrio](https://en.wikipedia.org/wiki/Bdellovibrio)). It normally bores through the wall, so whether it can prey on a wall-less L-form is unknown; say so, or make the lost wall a defence. *The second option is superseded:* gameplay §4.2 says so, and never makes the lost wall a defence.
  - *Melee spear.* The type VI secretion system fires toxins from a phage-tail-like tubule up to 600 nm long; matching immunity proteins protect kin ([T6SS](https://en.wikipedia.org/wiki/Type_VI_secretion_system)), so friendly-fire immunity is built in.
  - *Pack enemy.* *Myxococcus* "wolf packs" swarm and release digestive enzymes onto prey ([Myxococcus](https://en.wikipedia.org/wiki/Myxococcus_xanthus)).
- **Take:** a **tumble-dodge** (free, random facing) and a **flagellar burst** that spends PMF, Osmos-style (thrust always costs because the cell never coasts); pick-of-three gene offers on engulfment or DNA uptake; God Mode as an assist; an amoeba as a Shadow of the Colossus level (escape from its food vacuole using your own endocytosis tree); bullet-heaven phage bursts.
- **Avoid:** momentum dodges; survivor-clone clutter; button-mashing; "too fleeting" stages; bosses that are only bigger health bars.

### 5.4 Stealth

- [Mark of the Ninja](https://en.wikipedia.org/wiki/Mark_of_the_Ninja) (Metacritic 90/91) made stealth legible: noise as expanding rings, light and shadow decide visibility, enemies show "?" when suspicious and "!" when startled, non-lethal play scores well. Complaints: close-quarters controls; no face-to-face fighting.
- **Real stealth rules from biology.** Predators track concentration over time: E. coli remembers the last few seconds through receptor methylation ([Chemotaxis](https://en.wikipedia.org/wiki/Chemotaxis)), so a chemotactic predator really "loses the scent" seconds after you stop leaking. *P. aeruginosa* grows harmlessly until a threshold, then turns aggressive ([Quorum sensing](https://en.wikipedia.org/wiki/Quorum_sensing)). Quorum quenching blocks other cells' signals (same source). Persisters are dormant cells that survive drugs without being resistant mutants ([Persister cells](https://en.wikipedia.org/wiki/Persister_cells)).
- **Take:** every leak and secretion as a visible diffusing plume (Mark of the Ninja's rings as chemistry); predator states shown biologically (a ciliate's mouth groove turning toward you = "?", a lunge = "!"); stealth verbs: stop secreting, go dormant, quench the enemy's quorum; a quorum ambush (a hidden colony turns aggressive at threshold).
- **Avoid:** hidden detection rules; instant-fail sections; stealth as a mandatory mode (keep it a branch of the Senses and Secretion trees).

### 5.5 Tower defence and base defence

- **Sources.** [Plants vs. Zombies](https://en.wikipedia.org/wiki/Plants_vs._Zombies_(video_game)): sun falls or comes from Sunflowers; a pre-level seed-packet loadout with per-packet recharge; a single-use lawnmower per lane; usually a new plant per level; George Fan halved the Sunflower's cost to teach the economy and fires tutorial messages only on the player's actual mistakes. [Bloons TD 6](https://en.wikipedia.org/wiki/Bloons_TD_6): bloons resist specific effects; boss events every 20 rounds from round 40; praised CHIMPS mode; freemium feel. [Creeper World](https://en.wikipedia.org/wiki/Creeper_World): the enemy is a fluid that can be repelled but never destroyed, flooding low ground first; IXE (2024) added falling-sand physics. [They Are Billions](https://en.wikipedia.org/wiki/They_Are_Billions): one breach can cascade; pause any time. [Thronefall](https://en.wikipedia.org/wiki/Thronefall): the monarch fights beside the defences. [Pikmin 4](https://en.wikipedia.org/wiki/Pikmin_4): Night Expeditions play as nest defence. [Dome Keeper](https://en.wikipedia.org/wiki/Dome_Keeper): the warning that a split weakens both halves.
- **Biology.** The biofilm is the base: a matrix of polysaccharides, proteins and eDNA, water channels for nutrients and signals, antibiotic resistance up to 5,000× higher, and dispersal at the end of the cycle ([Biofilm](https://en.wikipedia.org/wiki/Biofilm)). Abortive infection is a real lawnmower: toxin-antitoxin systems can kill an infected cell to protect the population ([Toxin-antitoxin](https://en.wikipedia.org/wiki/Toxin-antitoxin_system)). The **MEGA-plate** is a ready-made level ([Baym et al., *Science* 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5534434/)): a 120 × 60 cm plate with antibiotic bands rising about tenfold per step (0, 3, 30, 300, 3000× wild-type MIC for trimethoprim; up to 20,000× for ciprofloxacin); E. coli adapted in about 10–12 days; a direct jump from zero to the top failed, but an intermediate step made it possible; "evolution is not always led by the most resistant mutants".
- **Take:** ATP as "sun"; a pre-run gene loadout with expression "recharge"; diffusing antibiotics and bacteriocins as Creeper World fluids; single-breach chain lysis inside the biofilm; the hero fighting inside its defences (Thronefall); a signature **MEGA-plate "reverse tower defence"** where you are the creep climbing antibiotic steps with stepping-stone mutations.
- **Avoid:** two half-games; freemium power; unexplained resistances (show the mechanism, as BTD6 shows "lead" or "camo").

### 5.6 RTS and colony

- **Sources.** [Pikmin 4](https://en.wikipedia.org/wiki/Pikmin_4): typed squads with affinities; cap from 20 to 100; 3.48M sold by March 2024; no mini-map made groups tedious. [Clash Royale](https://en.wikipedia.org/wiki/Clash_Royale): 8-card deck, 4 in hand, elixir regenerating to 10 and doubling in the final minute, matches up to 3 minutes; about $4.9B player spending by March 2026; pay-to-win criticism; chest timers removed in April 2025. [Against the Storm](https://en.wikipedia.org/wiki/Against_the_Storm_(video_game)): each settlement is a run; Reputation races "Queen's Impatience"; only 3 of 7 species per village. [Cult of the Lamb](https://en.wikipedia.org/wiki/Cult_of_the_Lamb): followers need food, shelter and sermons; hard to find time to manage. [Patapon](https://en.wikipedia.org/wiki/Patapon): an army commanded by rhythm (5.9).
- **Biology: colonies cannot be mind-controlled, only signalled.** Quorum sensing works by thresholds; *Aliivibrio* glows only at about 10^11 cells/ml ([Quorum sensing](https://en.wikipedia.org/wiki/Quorum_sensing)). *Myxococcus* fruiting bodies hold about 100,000 cells, and cheaters are over-represented among spores ([Myxococcus](https://en.wikipedia.org/wiki/Myxococcus_xanthus)). In *Dictyostelium*, about 20% of cells die to form the stalk ([Dictyostelium](https://en.wikipedia.org/wiki/Dictyostelium_discoideum)).
- **Take:** "signal, don't select" (the hero leads clones by secreting autoinducers; they follow the plume like Pikmin follow the whistle and switch jobs at thresholds); squad types as clones produced by bistable switches (scouts, matrix builders, T6SS soldiers, persisters); division of labour with real sacrifice; cheaters as an emergent problem; Against the Storm's run-as-settlement with an impatience clock (the drop drying); Clash Royale tempo with ATP as elixir, played asynchronously (5.7).
- **Avoid:** pay-to-win, timers and card scarcity; micromanagement without an overview map; chore overload.

### 5.7 Asynchronous and social multiplayer

- **Sources.** [Death Stranding](https://en.wikipedia.org/wiki/Death_Stranding): players leave supplies, structures and messages, recover each other's cargo, give "likes", never meet; Polygon felt part of a community but called it "composed entirely of fetch quests"; 20M+ players by Apr 2025. [Dark Souls](https://en.wikipedia.org/wiki/Dark_Souls_(video_game)): preset-phrase messages, bloodstains showing others' deaths, ghosts, covenants; IGN praised its "strong emphasis on online features". [Journey](https://en.wikipedia.org/wiki/Journey_(2012_video_game)): anonymous strangers who can only sing; names after the credits; Peabody. [Super Auto Pets](https://en.wikipedia.org/wiki/Super_Auto_Pets): async battles with AI teams filling gaps; took off after Northernlion and Ludwig streamed it. [Backpack Battles](https://en.wikipedia.org/wiki/Backpack_Battles): fight others' saved builds; a run ends after 10 wins or 5 losses. [Clash of Clans](https://en.wikipedia.org/wiki/Clash_of_Clans): three-star raids, clan wars; gem-purchase pressure. [Helldivers 2](https://en.wikipedia.org/wiki/Helldivers_2): Major Orders drive the Galactic War; in June 2024 players chose to rescue children on Vernen Wells, unexpected by the developers; 20M+ copies; a forced PSN account dropped reviews to about 53% until Sony reversed it.
- **Patent warning.** The [Nemesis System](https://en.wikipedia.org/wiki/Middle-earth:_Shadow_of_Mordor) is patented (US10926179B2, granted Feb 2021) and appears in no game but its own sequel.
- **Biology: horizontal gene transfer is literally async multiplayer.** In [conjugation](https://en.wikipedia.org/wiki/Bacterial_conjugation) the ~100 kb F plasmid passes along a pilus and both cells become donors; it spreads antibiotic resistance; an Hfr cell can transfer its whole chromosome in about 100 minutes (Lederberg and Tatum, 1946). Plasmid addiction: the toxin outlives the antitoxin, so a daughter that loses the plasmid dies (ccdAB on the F plasmid; [TA systems](https://en.wikipedia.org/wiki/Toxin-antitoxin_system)). CRISPR spacers are added next to the leader, forming a chronological record of infections ([CRISPR](https://en.wikipedia.org/wiki/CRISPR)).
- **Take:** **DNA bloodstains** (a lysed player's gene cassette seeded into other players' same-seed drops, taken up by transformation); **cursed gifts** (other players' plasmids carry TA addiction); **ghost colonies** (biofilm layout plus genome raided asynchronously); a **Journey-style stranger** (another player's anonymous cell, signalling only with molecules, able to conjugate); a community **Lenski flask** (5.16).
- **Avoid:** Nemesis-like systems (patent); forced accounts; free-text chat (agar.io showed the abuse; use preset "chemical phrases"); fetch-quest chores.

### 5.8 Roguelite structure and build-crafting

- **Sources.** [Rogue Legacy](https://en.wikipedia.org/wiki/Rogue_Legacy): choose among three random heirs (six with an upgrade) with traits like colourblindness, ADHD, dwarfism; 100k in week one; short lifespans; "insanely hard for the unprepared". [Mewgenics](https://en.wikipedia.org/wiki/Mewgenics): cats breed and inherit traits, inbreeding causes defects, each cat has a daily chance to mutate (usually trading one stat for another) and ages; 1M in week one. [Balatro](https://en.wikipedia.org/wiki/Balatro): score = chips × mult; conditional Jokers in foil, holographic, polychrome and negative variants; a boss blind each ante. [Slay the Spire](https://en.wikipedia.org/wiki/Slay_the_Spire): enemy intents with exact numbers (playtesters wanted the numbers); telemetry for balancing; daily fixed seed, one attempt; Ascension 20. [Vampire Survivors](https://en.wikipedia.org/wiki/Vampire_Survivors): a maxed weapon plus a specific passive evolves. [Noita](https://en.wikipedia.org/wiki/Noita_(video_game)): wand spells modify the following spells; players coined "Noita'd" for unfair deaths. [Loop Hero](https://en.wikipedia.org/wiki/Loop_Hero): tile adjacency synergies that also fill a boss meter. [Blue Prince](https://en.wikipedia.org/wiki/Blue_Prince): draft one room of three, 50 steps a day, knowledge carries over.
- **Biology.** The [E. coli long-term evolution experiment](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment): 12 populations, 80,000+ generations by Aug 2024, frozen every 500 generations and revivable; Cit+ around generation 31,000–31,500, re-evolving in replays only from clones after generation 20,000 (potentiating mutations); six of 12 populations became mutators; about 70% faster growth than the ancestor by 20,000 generations. [Nonribosomal peptide synthetases](https://en.wikipedia.org/wiki/Nonribosomal_peptide) are Noita wands in nature: each module adds one monomer so order sets the product; the A-domain picks the amino acid, an E-domain flips it to a D-amino acid; they make antibiotics such as vancomycin and daptomycin.
- **Take:** the **genome as the deck** (operon genes co-express as a "hand", promoter strength as mult, regulators as conditional jokers, epistasis as combos); **division as heir choice** (mutations shown up front like intents; the other daughter joins the colony); the **mutator gamble** (more choices, more junk); **potentiating genes** as Balatro-style late scaling; **NRPS "wands"** for weapons and siderophores; antibiotic tiers as Ascension; a **Loop Hero risk meter** (the more you feed, the more you smell, and a predator arrives).
- **Avoid:** unfair randomness (telegraph threats; never one-shot from off-screen); lifespans too short to matter; grinding scarce meta-currency.

### 5.9 Puzzle and citizen science; rhythm and synesthesia

- **Puzzle sources.** [Opus Magnum](https://en.wikipedia.org/wiki/Opus_Magnum): machines ranked by cycles, cost and area against other players; solutions export as looping GIFs needing little context; IGF Excellence in Design. [Baba Is You](https://en.wikipedia.org/wiki/Baba_Is_You): rules are word tiles you push; some operators "infuriatingly obscure". [Return of the Obra Dinn](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn): deductions confirmed in batches of three to stop guessing. [Foldit](https://en.wikipedia.org/wiki/Foldit): players produced a usable model of a retroviral protease, open for 15 years, in about ten days of a three-week puzzle (2011; [Khatib et al. 2011](https://doi.org/10.1038/nsmb.2119)), and raised a designed enzyme's activity more than 18-fold. [EteRNA](https://en.wikipedia.org/wiki/EteRNA): top-voted player RNA designs are synthesised in a Stanford lab; it contributed to OpenVaccine's mRNA-stability work. [Borderlands Science](https://en.wikipedia.org/wiki/Borderlands_Science): a tile puzzle built from gut-microbe DNA sequences inside Borderlands 3 (2020); a 2024 *Nature Biotechnology* paper reports it beat state-of-the-art methods; rewards are skins and loot boosters. [Potion Craft](https://en.wikipedia.org/wiki/Potion_Craft:_Alchemist_Simulator): each ingredient moves your potion across a hidden map; RPS: "the best crafting system ever concocted".
- **Rhythm sources.** [Patapon](https://en.wikipedia.org/wiki/Patapon): drum sequences command the army, on-beat play triggers "Fever"; Metacritic 86; no pause, grind, random drops. [Crypt of the NecroDancer](https://en.wikipedia.org/wiki/Crypt_of_the_NecroDancer): move only on the beat, but a miss usually only resets the coin multiplier; wider timing window, auto-calibration, custom music. [Rez](https://en.wikipedia.org/wiki/Rez_(video_game)): each hit adds a musical layer aiming for synesthesia (Kandinsky-inspired; early versions drew on evolutionary history); a commercial failure at first, thin content.
- **Biology.** The [repressilator](https://en.wikipedia.org/wiki/Repressilator) (Elowitz and Leibler, 2000): three repressors in a loop in E. coli, read out with GFP, oscillating. Lambda's lysis-or-lysogeny choice is a CI/Cro switch with cooperative binding at OR1 and OR2 ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)). The cyanobacterial KaiABC clock runs in a test tube from three proteins plus ATP with about a 24-hour rhythm and no genetic feedback ([Circadian clock](https://en.wikipedia.org/wiki/Circadian_clock); Nakajima et al. 2005). *Dictyostelium* coordinates by cAMP signalling; *Myxococcus* shows "rippling" waves ([Myxococcus](https://en.wikipedia.org/wiki/Myxococcus_xanthus)).
- **Take:** **regulon puzzles** (promoter, operator and repressor tiles as Baba-style rules; solving the repressilator makes your cell blink); **metabolic machines** scored on Opus Magnum histograms (ATP yield, time, membrane area, protein cost) with GIF export; **autopsy deduction** (work out what killed a neighbour from its remains, confirmed in batches of three); later a **real citizen-science mode** with a lab partner; a **Rez-style metabolic score** (glycolysis as percussion, the TCA cycle as bass, ATP synthase as arpeggio, so you *hear* a stalled pathway); an optional on-beat efficiency bonus with calibration; **Patapon-style colony commands** as rhythmic autoinducer pulses; a **"stolen clock"** (KaiABC taken from a cyanobacterium to anticipate dawn; the genes are real, their working in E. coli is invented and should be labelled).
- **Avoid:** obscure operators; arbitrary recipes; puzzles that block the action spine (keep them optional lab rooms or drop types); mandatory rhythm; thin content behind a strong aesthetic.

### 5.10 Photography and observation

- **Sources.** [New Pokémon Snap](https://en.wikipedia.org/wiki/New_Pok%C3%A9mon_Snap): 1–4 stars by behaviour rarity plus a composition score; research levels unlock behaviours; orbs, fruit and a music box provoke them; 2.4M sold by March 2022; criticised for repetitive replays, vague hints, a rating that feels "judgmental or inconsistent", and no freedom to get closer. [Content Warning](https://en.wikipedia.org/wiki/Content_Warning_(video_game)): footage uploaded in-game earns views that fund upgrades. [Nikon Small World](https://en.wikipedia.org/wiki/Nikon_Small_World): a real light-microscopy photo contest since 1975 (phase contrast, fluorescence, confocal and more), judged on originality, informational content, technical skill and visual impact; video category since 2011; a 2026 winner was rescinded for using generative AI. [Abzû](https://en.wikipedia.org/wiki/Abz%C3%BB): meditation pedestals for watching sea life. [Tiny Glade](https://en.wikipedia.org/wiki/Tiny_Glade): 800k wishlists for a cosy builder with a photo mode.
- **Take:** a **Micrograph Mode** where each real imaging modality reveals different information (fluorescence shows a tagged protein, phase contrast shows membranes, darkfield shows flagella); a behaviour catalogue of rare events (conjugation bridges, phage bursts, T6SS firing, *Dictyostelium* aggregation, *Bdellovibrio* entry); a transparent rubric on Small World's four criteria; GIF export; a weekly in-game contest; micrographs that feed the codex.
- **Avoid:** opaque, judgmental ratings; on-rails restrictions; AI-generated "micrographs" presented as real.

### 5.11 Codex, collection and knowledge progression

- **Sources.** [Subnautica](https://en.wikipedia.org/wiki/Subnautica): blueprints from exploration; players scan tech fragments and fauna into a databank *(scanner details not re-verified)*; 5.23M by Jan 2020; some recipes felt arbitrary. [Outer Wilds](https://en.wikipedia.org/wiki/Outer_Wilds): nothing carries over except the ship log, viewable as a web of connections; players get stuck without direction. [Animal Crossing: New Horizons](https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons): Blathers' museum displays your catches; 50.29M sold. [Everything](https://en.wikipedia.org/wiki/Everything_(video_game)): the encyclopedia of things you have "been" is the goal. [Never Alone](https://en.wikipedia.org/wiki/Never_Alone_(video_game)): unlockable documentary "cultural insights", which Wired called the best part.
- **Take:** a **diegetic codex**: phages live in your CRISPR array (scan, store a spacer, gain immunity, all real), chemicals in a receptor library, and **real species** get field-guide entries (E. coli, *Bdellovibrio*, *Myxococcus*, *Dictyostelium*, *Aliivibrio*, *Gemmata*), which Thrive lacks; **real lab footage** per entry through microscopy-lab partnerships; **knowledge-gated counters** (once you observe that T4 binds OmpC, OmpC variants appear on the tree); a hypothesis board of real experiments ("Replay the LTEE: can Cit+ re-evolve?").
- **Avoid:** arbitrary recipes; dead ends with no hints.

### 5.12 Crafting and automation

- [Factorio](https://en.wikipedia.org/wiki/Factorio): pollution attracts increasingly aggressive biters, so output and threat are one loop; 3.5M by Dec 2022; Space Age 400k in week one. [Potion Craft](https://en.wikipedia.org/wiki/Potion_Craft:_Alchemist_Simulator): crafting as navigation. [Noita](https://en.wikipedia.org/wiki/Noita_(video_game)): pixel alchemy (lava plus water makes rock and steam).
- **Take:** **your waste is your pollution** (leaked acetate, protons and amino acids are signals predators climb, real chemotaxis); a Potion Craft-style **metabolic map** where each enzyme moves a molecule across chemical space (oxidation state × carbon count), labelled as an abstraction; NRPS assembly-line benches. **Avoid:** spreadsheet crafting; recipes chemistry does not explain.

### 5.13 Survival

- [Rain World](https://en.wikipedia.org/wiki/Rain_World): creatures hunt independently, procedural animation, rain kills you unless you shelter by cycle's end, minimal UI; Metacritic 66 (PC), 43% recommended on OpenCritic, criticised for harsh difficulty and imprecise controls, yet a cult hit (Downpour sold 182k at release). [Dredge](https://en.wikipedia.org/wiki/Dredge_(video_game)): calm days, a rising panic meter at night, mutated "aberrant" fish worth more. [Peak](https://en.wikipedia.org/wiki/Peak_(video_game)): one stamina bar that hunger, injury, poison, weight and temperature all shrink; teammates revive.
- **Biology.** L-forms have no wall; they are grown in media matching cytosol osmolarity to avoid lysis by osmotic shock, and divide by extruding protrusions that pinch off ([L-form bacteria](https://en.wikipedia.org/wiki/L-form_bacteria)).
- **Take:** **the drop cycle as Rain World's rain** (evaporation makes the drop hypertonic, fresh dew or rain hypotonic; sudden dilution is lethal to the wall-less hero unless it shelters in biofilm matrix or evolves osmoprotection, a hazard grown from its defining trait); **one Peak-style vitality pool**, the proton motive force, that every stressor bites (the brief's energy route worn as a health bar); Dredge-style aberrant mutants worth codex points. **Avoid:** hidden rules and imprecise controls; hunger micromanagement.

### 5.14 Ecology and evolution sims (closest neighbours)

- **Thrive** ([Steam](https://store.steampowered.com/app/1779200/Thrive/)), restated for this sweep: its most-helpful negative reviews cite repetitive swims through "massive empty areas", progression dead ends, cluttered menus, "abysmal" controls and late-session performance ([source](https://steamcommunity.com/app/1779200/negativereviews/?browsefilter=toprated)); even positive reviews call the flat 100-point edit cost "very frustrating", phosphorus too costly and big cells too slow, while praising "a high school level of understanding of cell/microbiology" ([source](https://steamcommunity.com/app/1779200/positivereviews/?browsefilter=toprated)). See section 1.

| Game | What it does | Numbers and reception |
|---|---|---|
| [Spore](https://en.wikipedia.org/wiki/Spore_(2008_video_game)) | Creatures auto-upload to the Sporepedia | 100M+ creations by May 2009; early stages called thin; DRM backlash |
| [Niche](https://store.steampowered.com/app/440650/) | 100+ genes; dominant, recessive, co-dominant; drift, gene flow, mutation, natural and sexual selection | 90% of 3,790 |
| [Equilinox](https://store.steampowered.com/app/853550/) | Evolve species by spending points; sandbox | 93% of 2,109 |
| [Creatures](https://en.wikipedia.org/wiki/Creatures_(1996_video_game)) | Neural-network creatures; every copy ships unique starting eggs | About 400k sold by Feb 1998 |
| [Eco](https://en.wikipedia.org/wiki/Eco_(2018_video_game)) | Players cooperate to stop a meteor without wrecking the ecosystem; player-made laws | Began as an educational tool with $1M+ from the US Department of Education |
| [WorldBox](https://en.wikipedia.org/wiki/WorldBox) | God-power sandbox | RPS: "a happy four hours" |
| [Plague Inc.](https://en.wikipedia.org/wiki/Plague_Inc.) | Evolve a pathogen against a cure | 160M downloads by May 2021; CDC praise |

- **Take:** transparent population genetics for rival lineages (Niche-style, with HGT counted as gene flow); a unique starting genome per save (Creatures-style neutral SNPs give your strain identity); a god-hand "Lab" sandbox (WorldBox).
- **Avoid Thrive's top complaints by design:** no empty swimming (low-Re travel is slow, so drops must be dense); no flat per-edit costs (cost comes from protein mass, ATP, membrane area); no menu-heavy editing (evolution happens in the world, at division and uptake).

### 5.15 Emergent storytelling and social systems

- [RimWorld](https://en.wikipedia.org/wiki/RimWorld): a "story generator" with three storytellers, Cassandra (rising and falling tension), Phoebe (more downtime) and Randy (randomness); $100M+ revenue by Aug 2020. [Dwarf Fortress](https://en.wikipedia.org/wiki/Dwarf_Fortress): Legends mode for generated histories; *Boatmurdered*, a fortress passed between players, spread as a shared story. [Crusader Kings III](https://en.wikipedia.org/wiki/Crusader_Kings_III): inherited traits (gigantism, albinism) shape a dynasty; 4M by Apr 2025; actions feel "rote" when the story engine idles. [Wildermyth](https://en.wikipedia.org/wiki/Wildermyth): "alternates layers of handcrafted and procedural content" in comic panels.
- **Take:** a **Lineage Chronicle** (a living phylogeny with auto-written captions: "Great-grandmother survived the T4 bloom by going dormant"); **frozen-fossil saves** (the LTEE freezer: revive and replay any past lineage); rivalries that remember through CRISPR spacers and enemy immunity to your T6SS effectors; and **two storytellers tied to the setting**: *the Leaf* (weather and day cycle, calm like Phoebe) and *the Lens*, the child's magnifier as a Randy-style chaos agent whose focused sunlight brings heat. Heat calls the heat-shock response (σ32 in *E. coli*, [Heat shock response](https://en.wikipedia.org/wiki/Heat_shock_response)), not SOS, and glass blocks most UV below 300 nm ([Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet)). The UV that triggers the SOS response and **induces lambda prophages** ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)) comes from the drop itself, on the Leaf's clock: a bead held on leaf hairs focuses sunlight (Egri et al. 2010, 3.6), and water passes UV. That is the real event chain hidden in the owner's seed, because the burning glass is the drop. A loupe that triggers SOS would be [abstraction] (Codon staging, RX).
- **Avoid:** Nemesis-style systems; idle stretches; Dwarf Fortress's old UI.

### 5.16 Daily, weekly and seasonal play

- [Wordle](https://en.wikipedia.org/wiki/Wordle): one puzzle a day for everyone plus a spoiler-free emoji grid; from 90 players to 2M+ in about ten weeks, 1.2M results shared on Twitter between 1 and 13 Jan 2022, played 4.8B times in 2023. [Peak](https://en.wikipedia.org/wiki/Peak_(video_game)): levels rotate every 24 hours at 17:00 UTC. [Slay the Spire](https://en.wikipedia.org/wiki/Slay_the_Spire): fixed-seed daily, one attempt. [Animal Crossing: NH](https://en.wikipedia.org/wiki/Animal_Crossing:_New_Horizons): real-time hemispheric seasons; time gating and burnout after about six weeks. [Helldivers 2](https://en.wikipedia.org/wiki/Helldivers_2): community Major Orders.
- **Take:** a **Daily Drop** (one seed for everyone; a spoiler-free share card of codon-coloured squares or a lineage glyph); a weekly **Lenski Flask** order (e.g. all players log 31,500 generations on citrate together to unlock a global Cit+ event; real numbers from the [LTEE](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment)); seasons that follow the leaf (spring dew, autumn leaf-fall) as content, not gates.
- **Avoid:** time gating and FOMO; share cards that spoil solutions.

### 5.17 Procedural worlds, sandboxes and sharing

- **Procedural.** [No Man's Sky](https://en.wikipedia.org/wiki/No_Man%27s_Sky): "over 18 quintillion" planets; Kate Compton's "procedural oatmeal"; about 212k concurrent on day one, about 2,100 by end of September 2016; redeemed by years of free updates. [Noita](https://en.wikipedia.org/wiki/Noita_(video_game)): variety from interacting systems. [Dwarf Fortress](https://en.wikipedia.org/wiki/Dwarf_Fortress): worlds from elevation, rainfall, drainage and temperature.
- **Sharing.** [Spore](https://en.wikipedia.org/wiki/Spore_(2008_video_game)): automatic uploads made 100M+ creations. [Super Mario Maker 2](https://en.wikipedia.org/wiki/Super_Mario_Maker_2): 8.42M sold; criticised for deleting levels with vague reasons. [Opus Magnum](https://en.wikipedia.org/wiki/Opus_Magnum): GIFs as marketing. [Tiny Glade](https://en.wikipedia.org/wiki/Tiny_Glade): a goal-less sandbox with mixed reviews (Metacritic 74) for limited content.
- **Take:** generate drops from real parameters (O₂, pH, osmolarity, temperature, nutrient mix, resident species) so variety means something, with hand-authored set pieces on top (Wildermyth); under-promise; share a cell as its actual DNA sequence (a compact "plasmid code" others paste in); a Sporepedia-style gallery; a "Lab" sandbox with chemostat controls and god powers; Steam Workshop (Thrive already has it).
- **Avoid:** asset-shuffle variety; hype ahead of what ships; opaque moderation; a goal-less sandbox as the main game; DRM.

### 5.18 Streamer-friendly moments

- [Twitch Plays Pokémon](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon): 1.16M participants, 121k at peak, 55M views; chat alternated between "anarchy" and "democracy"; lore grew around the useless Helix Fossil; turn-based design tolerated the lag, and throttles were needed. [Crowd Control](https://crowdcontrol.live/): viewers spend Bits or Channel Points on effects in 250+ games (company claims). Proven streamer hits: [Lethal Company](https://en.wikipedia.org/wiki/Lethal_Company), [Peak](https://en.wikipedia.org/wiki/Peak_(video_game)), [Super Auto Pets](https://en.wikipedia.org/wiki/Super_Auto_Pets), [Slay the Spire](https://en.wikipedia.org/wiki/Slay_the_Spire); Polygon on Vampire Survivors: "no one streamer I've watched played entirely the same"; [agar.io](https://en.wikipedia.org/wiki/Agar.io) spread from a 4chan post through YouTubers.
- **Take:** **chat is the mutagen** (viewers vote on or submit the random mutation at each division, which is honest because mutation is random with respect to need); **chat is the environment** (drop an antibiotic pulse, a phage bloom or a Lens sunbeam); decision windows sized for stream delay; big readable spectacles (phage bursts, conjugation bridges, *Bdellovibrio* entry, being swallowed by an amoeba, a quorum ambush). **Avoid:** real-time chat control; free-text names.

### 5.19 Accessibility, and faithful science that is also fun

- **Accessibility.** [Celeste](https://en.wikipedia.org/wiki/Celeste_(video_game)) Assist Mode (slower speed, unlimited dashes, invincibility) was renamed from "Cheat Mode", which the designer felt was "too judgmental", and took "a couple of days' work". [Hades](https://en.wikipedia.org/wiki/Hades_(video_game)) God Mode. [The Last of Us Part II](https://en.wikipedia.org/wiki/The_Last_of_Us_Part_II) worked with accessibility advocates and won Innovation in Accessibility at The Game Awards 2020. [Blue Prince](https://en.wikipedia.org/wiki/Blue_Prince): Polygon called colour-reliant puzzles without colourblind support "a big problem" (later fixed). [NecroDancer](https://en.wikipedia.org/wiki/Crypt_of_the_NecroDancer): beat auto-calibration. [Game Accessibility Guidelines](https://gameaccessibilityguidelines.com/basic/) (basic): never convey essential information by colour alone; adjustable speed; remappable controls; subtitles; avoid flicker; a wide difficulty range.
- **Faithful science.** [Kerbal Space Program](https://en.wikipedia.org/wiki/Kerbal_Space_Program): Edge called it a puzzle "set by *reality*", PC Gamer a "perfect blend of science and slapstick"; science mode limits starting parts; openly documented compromises (Kerbin is scaled down and over ten times as dense as Earth); praised by NASA and ESA. [Foldit](https://en.wikipedia.org/wiki/Foldit), [EteRNA](https://en.wikipedia.org/wiki/EteRNA) and [Borderlands Science](https://en.wikipedia.org/wiki/Borderlands_Science) show players will do real biology when it is a good puzzle. [Plague Inc.](https://en.wikipedia.org/wiki/Plague_Inc.) earned CDC praise.
- **Take:** shape, motion and sound redundancy for every colour-coded signal; a game-speed slider (suits microbe timescales); a pause/microscope freeze; flash limiting (lysis and bioluminescence flash); a judgement-free **"Lab Conditions" assist** (a rich, osmotically safe medium) with Hades-style resistance that grows with failures; **slapstick failure** (lysis as Codon's "rapid unplanned disassembly", funny and beautiful); a **"Where we cheated"** codex page; partner labs for footage and, later, real puzzles.
- **Avoid:** colour-only puzzles; shaming labels like "Cheat Mode"; colourblindness as a joke trait if the game relies on colour.

### 5.20 Mechanic catalogue: how each module plugs into the Phase-1 tree

Biology labels: **[real]** happens in nature; **[real, by HGT]** real in another organism, stolen by gene transfer; **[abstraction]** a game representation of something real; **[invented]** the game's own. Scope: S/M/L (rough). *These labels are superseded* by gameplay §0's five badges: [real] and [real, by HGT] → Established, [abstraction] → Codon staging, [invented] → Codon invention.

| Mechanic | Borrowed from | Biology | Codon form | Tree branch | Scope |
|---|---|---|---|---|---|
| Tumble-dodge | Gungeon, Hades | CW flagellar rotation [real] | Free random reorientation | Movement | S |
| Flagellar burst | Hades dash, Osmos thrust cost | PMF-driven motor [real] | Dash that drains PMF | Movement / Energy | S |
| Pick-of-3 gene offers | Hades boons | DNA uptake [real] | Choice on engulfing or transforming | HGT | S |
| Operon hands, chips × mult | Balatro | Operons, promoter strength [real/abstraction] | Combo scoring of the genome | Gene regulation | M |
| Division heirs | Rogue Legacy, Mewgenics | Mutation at replication [real] | Pick a daughter; the other joins the colony (*superseded*: three daughters, gameplay §2.3) | Reproduction | M |
| Mutator gamble | LTEE | DNA-repair loss [real] | More offers, more junk | Genome | S |
| Potentiating genes | Balatro scaling | Cit+ contingency [real] | Genes that pay off later | Genome | M |
| Telegraphed threats | Slay the Spire intents | Tail-fibre binding, ciliate feeding [real] | Visible "next move" | Senses | S |
| Scent plumes and stealth | Mark of the Ninja | Chemotaxis memory of a few seconds [real] | Leaks visible; predators lose the trail | Senses / Secretion | M |
| Quorum ambush | — | Quorum threshold [real] | Hidden colony triggers at once | Colony / Signals | M |
| Persister play-dead | Hades Death Defiance | Persisters [real] | Dormancy that survives a lethal pulse | Defence | S |
| T6SS spear | Melee weapon | T6SS plus immunity proteins [real, by HGT] | Kin-safe melee toxins | Offence | M |
| NRPS wands | Noita | NRPS modules [real, by HGT] | Module order = weapon | Offence / Crafting | L |
| Phage burst boss | Bullet heaven | T4: ~30 min, 100–150 per burst [real] | Survive the burst; evolve the receptor | Defence | M |
| Amoeba colossus | Shadow of the Colossus | *Chaos*, a 1–3 mm amoeba, eats bacteria; bacteria have lived undigested in *Amoeba proteus* vacuoles [real] (not *Dictyostelium*, whose bacteria-eaters are single small amoebae, 5.3) | Escape from inside the food vacuole | Endocytosis | L |
| *Bdellovibrio* hunter | Horror / speed boss | 160 µm/s, periplasm entry [real] | Stalker boss; wall-less hero's odd defence [abstraction] (*superseded*: no defence; an open question, gameplay §4.2) | Membrane | M |
| Biofilm base | PvZ, Thronefall, They Are Billions | Matrix, channels, up to 5,000× tolerance [real] | Hub that is also the base | Colony / Matrix | L |
| Abortive-infection lawnmower | PvZ | TA abortive infection [real] | One-shot sacrificial defence | Defence | S |
| MEGA-plate climb | Reverse tower defence | Baym 2016 [real] | Climb antibiotic steps via stepping-stone mutations | Resistance | M |
| Regulon puzzles | Baba Is You | lac operon, repressilator [real] | Rule tiles; your cell blinks | Gene regulation | M |
| Metabolic machines | Opus Magnum | Pathways [abstraction] | Histograms plus GIF export | Metabolism | M |
| Synesthetic score | Rez | Pathway activity [abstraction] | Each pathway is an instrument | Metabolism | M |
| Stolen clock | — | KaiABC [real, by HGT; working in E. coli invented] | Anticipate the day | Regulation | S |
| Micrograph Mode | Pokémon Snap, Nikon Small World | Real imaging modalities [real] | Lenses reveal information; open scoring | Codex | M |
| CRISPR codex | Subnautica, Outer Wilds | Spacers, newest first [real] | Scan a phage to gain immunity | Defence / Codex | M |
| DNA bloodstains | Dark Souls | Transformation [real] | Dead players' genes in your daily drop | HGT (async) | M |
| Cursed plasmids | Roguelite curses | Plasmid addiction [real] | Gifts you cannot drop | HGT | S |
| Ghost colonies | Backpack Battles, Clash of Clans | — | Async biofilm raids | Colony | L |
| Lenski Flask | Helldivers 2 | LTEE [real] | Weekly community goal | Meta | M |
| Frozen-fossil saves | Rogue Legacy | LTEE freezer [real] | Revive any past lineage | Meta | S |
| Lineage Chronicle | RimWorld, CK3, Dwarf Fortress | Phylogeny [real] | Auto-captioned family tree | Meta | M |
| The Lens storyteller | RimWorld | Bead focus: UV → SOS → prophage induction [real]; magnifier: heat → heat shock (σ32) [real]; any magnifier → SOS link [abstraction] | The magnifier as chaos agent (heat); the hair-held bead as the burning glass (UV) | Story | M |
| Osmotic drop cycle | Rain World | L-form fragility [real] | Shelter before dilution | Membrane | M |
| Single PMF vitality | Peak | PMF [real] | One bar every stressor bites | Energy | S |
| Chat as mutagen | Twitch Plays Pokémon, Crowd Control | Random mutation [real] | Viewers pick or submit mutations | Streamer | M |
| Daily Drop share card | Wordle, Peak | — | Same seed for all; spoiler-free card | Meta | S |
| Genome share codes | Spore | DNA [real] | Paste a sequence to load a cell | Sharing | S |
| Lab Conditions assist | Celeste, Hades | Rich medium [real] | Diegetic difficulty | Accessibility | S |
| Magnetotaxis | Navigation aid | Magnetosomes turn a 3D search into 1D [real, by HGT] ([source](https://en.wikipedia.org/wiki/Magnetotactic_bacteria)) | Compass toward the floor, where crowd-made anoxic pockets open first (4.6) | Senses | S |
| Prophage relic | Double-edged relic | Lambda superinfection immunity; stress induction [real] | Immune to its kin; can blow up in a bead's UV focus | Genome | M |

### 5.21 Build order for a small team

1. **Vertical slice of the spine:** one ~15-minute Drop Run with tumble-dodge and flagellar burst, scent plumes, engulfment with pick-of-three gene offers, division as heir choice, the osmotic drop cycle, one boss (a T4 burst), a Lineage Chronicle stub, and basic accessibility (speed slider, no colour-only information).
2. **The Phase-1 evolution tree as the genome deck:** operon combos and potentiating genes.
3. **Codex with knowledge gates** (CRISPR, OmpC) and Micrograph Mode.
4. **Colony and biofilm hub:** abortive-infection defences, quorum ambush, division of labour.
5. **Daily Drop and share card**, plus genome share codes (cheap, drives virality).
6. **Second-ring modules:** MEGA-plate climb, amoeba colossus, regulon puzzles, Rez score.
7. **Asynchronous multiplayer:** DNA bloodstains, then ghost colonies, then the Lenski Flask.
8. **Streamer mode, Lab sandbox, Workshop;** citizen-science partnership last.

---

## 6. What Codon takes / what it avoids

One row per lesson, merged across the five sweeps. Sources for every row are in the section listed.

### 6.1 Takes

**Core loop and structure**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Short runs with big build variety and a lineage carried between runs | Pathogenic | The 15–25 minute Drop Run; one drop is one run | 1.3, 5.1 |
| Eat and grow under threat, with prey-predator flips as you grow | Spore (cell stage) | A scale ladder of biomes (dew, puddle, pond, soil, gut) | 1.3, 1.7 |
| One legible tension between two dials | Plague Inc | One tension per biome, e.g. growth vs detection | 1.3 |
| Movement that spends the thing you are growing | Osmos | Flagellar burst drains PMF and ATP; no coasting | 1.3, 5.3 |
| A lethal environmental cycle you must shelter from | Rain World | The osmotic drop cycle (drying concentrates, rain dilutes) | 5.13 |
| One vitality bar that every stressor shrinks | Peak | Proton motive force as the health bar | 5.13 |
| Each settlement is a run with an impatience clock | Against the Storm | The dew clock: dawn to evaporation | 5.6, 3.8 |
| Two loops sharing one currency | Dave the Diver | Runs feed the colony hub through genes and DNA | 5.2 |
| Output and threat as one loop | Factorio (pollution) | Leaked metabolites attract predators | 5.12 |
| A shrink-and-enter premise on a deadline | Fantastic Voyage (film, 1966) | The dew clock, with the hero as the cell rather than a visiting vehicle | 1.3 |

**Body and build**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Loot physically becomes the body; placement changes movement | Pathogenic | Proteins install on a flowing membrane; flagellum and receptor placement matter | 1.3 |
| Visible transformation on every pick | Everything is Crab | Every expressed gene changes the cell's look | 1.3 |
| A small behaviour-changing tree per skill | Last Epoch | 8–10 structure trees (membrane, motility, uptake, energy, expression, nucleoid, secretion, sensing) | 2.2, 2.5 |
| Rule-changing keystones with a cost | Path of Exile | "Shed the Wall", "Drop the Flagellum", "Hypermutator" | 2.2, 2.5 |
| Synergy through shared keywords; effect plus condition; three lines or fewer | Balatro | Gene cards keyed to PMF, ATP, NADH, membrane area, pH, osmolarity | 2.2 |
| Evolutions from a maxed base plus a matching partner; unions | Vampire Survivors | Injectisome, green-light swimming, magnetotaxis, proto-plastid | 2.5 |
| A small loadout budget with an overcharm risk | Hollow Knight | The proteome budget; overexpression slows division | 2.2, 2.3 |
| An ordered program of modifiers and triggers | Noita | The operon "wand"; NRPS weapon assembly | 2.2, 5.8 |
| Sensor-to-actuator body logic | Primordialis | Two-component "patch cables" | 1.3, 4.4 |
| The genome as a program; challenges that unlock genes; a gene fridge | Cell Lab | Regulation layer, challenge lab, genome sharing | 1.3 |
| Real surface molecules as the pieces you read and swap | Immune Defense | Receptors, porins and LPS as visible, swappable surface proteins | 1.3 |

**Evolution tree and progression**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Pick 1 of 3 at each milestone, with pick-rate telemetry from day one | Slay the Spire | The division draft | 2.2 |
| Unlock by doing | Factorio 2.0 (trigger technologies) | Genes enter the pool by living the condition (survive pH 4, engulf a cyanobacterium) | 2.2 |
| Condition-based organelle unlocks, endosymbiosis as an alternate route | Thrive | Same, with hints and progress bars from launch | 2.2 |
| Using a thing in context speeds its tree | Civilization VI (Eurekas) | Surviving osmotic shocks discounts mechanosensitive-channel nodes | 2.2 |
| Habitat-conditional branches; the choice to block an evolution | Pokémon | Protein families branch by pH, light, temperature; an "Everstone" perk | 2.2 |
| A funny but viable default form when no requirement is met | Digimon World (Numemon) | The fail-forward "Blob" L-form | 2.2 |
| Alternate recipes found in the world, choose 1 of 2 | Satisfactory | Lysed-cell DNA offers a gene choice; EMP vs ED glycolysis | 2.2, 2.3 |
| Forms that drift with diet and temperature | Oxygen Not Included | Lineage morph drift | 2.2 |
| Rising marginal trait costs; devolve for a refund | Plague Inc | Anti-snowball costs; gene loss as a legal move | 2.2 |
| Trait value that depends on rivals | Evolution (board game) | Rival lineages adapt to your most expressed surface proteins | 1.3 |
| Mystery on first pickup, a description afterwards | Binding of Isaac (Repentance+) | Watch a protein's first expression, then the codex explains it | 2.2 |

**Meta-progression, death and knowledge**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Paired, refundable meta-talents; opt-in Heat; story advances on death | Hades | Refundable talents; real stressors (antibiotics, phage, UV) as Heat; a story beat per lysis | 2.2 |
| An heir with visible traits on death | Rogue Legacy | Continue as a sister lineage from a recent division | 2.2, 5.8 |
| Knowledge as the progression; a world on its own clock | Outer Wilds | Field notebook, knowledge-gated counters, the dew clock | 3.3, 5.11 |
| Clade and range views players enjoy watching | Species / Thrive | A living phylogeny; resume from any surviving branch | 1.3 |
| Storytellers and auto-written histories | RimWorld | The Lineage Chronicle; the Leaf and the Lens as storytellers | 5.15 |
| Meta unlocks that add variety, not power | Dead Cells | New genes enter the pool rather than raw stat boosts | 2.2 |
| Failure that leaves something behind | Inscryption | Dead lineages' DNA floats in later drops as eDNA | 3.3 |

**Readability and accessibility**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| No HUD; a world that teaches itself | flOw | The visible energy route is the interface | 1.3 |
| Detection made visible | Mark of the Ninja | Secretions as diffusing scent plumes; predator "?" and "!" states shown biologically | 5.4 |
| Enemy intent telegraphed with exact numbers | Slay the Spire | Visible tail-fibre binding, ciliate feeding grooves | 5.8 |
| Teach by tuning costs; help only after the player's own mistake | Plants vs. Zombies | Contextual hints, generous early economy | 5.5 |
| Stylization that cuts visual noise | Abzu | Crisp, uncluttered volumetric cells | 3.3 |
| A judgement-free assist mode | Celeste | "Lab Conditions" (rich, osmotically safe medium), speed slider | 5.19 |

**Programming and puzzles**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Tools separate from challenges; histograms; GIF export | Opus Magnum | The Regulation Lab and metabolic machines | 2.2, 5.9 |
| Rules as pushable tiles | Baba Is You | Regulon puzzles (promoter, operator, repressor) | 5.9 |
| A climb from NAND gates to a CPU | Turing Complete | Promoter → NOT → AND → toggle memory → repressilator clock | 2.2 |
| Deductions confirmed in batches | Return of the Obra Dinn | Autopsy deduction of how a neighbour died | 5.9 |

**Opening, story and art**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| A steady logarithmic zoom anchored on a human scene, with a readout | Powers of Ten | The "Dew" dive at ~3 s per decade with the 1-µm scale bar | 3.2, 3.7 |
| A wordless dive through a living thing on a child | Cosmic Zoom | No words in the opening; enter through the drop's life | 3.2 |
| End in an eye; outward zoom as revelation | Contact | The Eye epilogue | 3.2, 3.8 |
| Near-silence and weather as catastrophe at small scale | Microcosmos | Pre-dawn sound opening; rain and drying as events | 3.2 |
| Control in seconds, title after the first act, music first, an ageless hero | Journey | Control at ~8 s; swim through the floating title | 3.3 |
| The frame world is the hub and changes as you progress | Flower | The leaf and windowsill hub glowing at dusk | 3.3 |
| Progression that reveals new layers of the same world | Gris | The instrument ladder of view modes | 3.3, 3.8 |
| Personal seeding of the world | Mountain | Choose your dew drop | 3.3 |
| An in-world manual found piece by piece | Tunic | The watcher's field notebook | 3.3 |
| The small world finally makes itself perceptible | Horton Hears a Who! | The quorum-glow climax with stolen lux genes | 3.2, 3.8 |
| Observer, lens, drop as a city, dye to see better | Andersen, "The Drop of Water" | "Witch's blood" stain mode; colony-as-city satire | 3.2 |
| A story that explains why tools unlock | CellCraft | The watcher's improving instruments justify unlocks | 1.3 |
| Honest invented colour coding | David Goodsell | Codex note: "colours are invented" | 3.2 |
| Each pathway as an instrument | Rez | The synesthetic metabolic score | 5.9 |
| Life and atmosphere that reshape each other (Gaia, Daisyworld) | SimEarth | The oxygen-fuse world event | 1.3, 4.12 |
| Science and slapstick; openly documented compromises | Kerbal Space Program | Funny, beautiful lysis; a "Where we cheated" page | 5.19 |

**Social, sharing and launch**

| Codon takes | Source game | Lands in Codon as | See |
|---|---|---|---|
| Traces of other players' deaths | Dark Souls | DNA bloodstains in same-seed drops | 5.7 |
| Fighting other players' saved builds | Backpack Battles | Async ghost colonies | 5.7 |
| Community orders that change the world | Helldivers 2 | The weekly Lenski Flask | 5.7, 5.16 |
| One daily seed with a spoiler-free share card | Wordle | The Daily Drop | 5.16 |
| Creations shared at scale | Spore (Sporepedia) | Genome share codes as literal DNA strings | 2.2, 5.17 |
| Audience input with throttles and long windows | Twitch Plays Pokémon | Chat as the mutagen | 5.18 |
| A reverse mode where every intervention has a cost | Plague Inc (Biotix and Immune Defense already play the phage and immune sides) | Play the phage, ciliate or immune cell | 1.3 |
| Real lab science inside a game | Foldit / EteRNA / Borderlands Science | A later citizen-science mode | 1.3, 5.9 |
| A ~$10–20 price and a pre-launch demo whose progress carries over | Pathogenic | A one-drop demo for Steam Next Fest | 1.3, 1.7 |
| A funny, true-science marketing hook | Everything is Crab | A convergent-evolution running gag | 1.3 |

### 6.2 Avoids

**Structure and depth**

| Codon avoids | Source game | Instead | See |
|---|---|---|---|
| Stages that are separate, shallow games; a cell phase over in ~15 minutes | Spore | One coherent stage, deep | 1.3 |
| Empty space and long wandering between resources | Thrive | Dense drops (low-Re travel is slow) | 1.3, 5.14 |
| Two half-games competing for attention | Dome Keeper | Run and hub share one currency | 5.2 |
| Beauty without stakes or decisions | flOw / Everything | Every scale shift leads to a decision | 1.3, 3.3 |
| Deep simulation without goals ("a place to visit rather than a game") | Creatures (Grandroids) | Goals and a player character first; sandbox later | 1.3 |
| Observer-only agency | Species | The player is the cell | 1.3 |
| A goal-less sandbox as the main game | Tiny Glade | The Lab is a side mode | 5.17 |
| Spectacle over play | Microcosm | Every visual layer carries play information | 1.3 |

**Evolution and build systems**

| Codon avoids | Source game | Instead | See |
|---|---|---|---|
| Parts with fixed summed stats, so shape does nothing | Spore (creature stage) | Physics is the stat | 1.3, 2.2 |
| Slider-only evolution and parts that pop in | The Sapling | Watch translation build and install each protein | 1.3 |
| A free pick-any editor that turns evolution into shopping | Spore | Mutation draft plus selection | 4.1 |
| A flat cost per edit; irreversible specialization | Thrive | Costs from protein mass, ATP and membrane; resume any branch | 1.3, 5.14 |
| Filler "+x%" and travel nodes; a tree that needs a planner | Path of Exile 2 | <200 nodes (*superseded*: a 250-star cap, gameplay §3.7), behaviour-changing, never an external planner | 2.2, 2.6 |
| Mandatory gates through the same nodes | Grim Dawn | Several routes per lifestyle | 2.2 |
| Bespoke item-to-item pairings as the main synergy | Balatro (LocalThunk's rule) | Keyword synergy | 2.2 |
| Hidden requirements plus grind | Digimon World Next Order | Visible conditions and progress | 2.2 |
| Upgrade costs that rise as padding | Rogue Legacy | Meta adds options | 2.2 |
| RNG-decided builds and a meta that slows sharply | Pathogenic | Choices with skip and reroll; flat meta pacing | 1.3 |
| Linear unlocks with "no real choices" | Cell to Singularity | Branching, exclusive trade-offs | 1.3 |
| Genetics that need spreadsheets | Mewgenics | A built-in lineage browser | 2.2 |
| Unlock thresholds and hints tuned only after launch | Thrive | Hints and progress bars from the start | 2.2 |

**Readability and fairness**

| Codon avoids | Source game | Instead | See |
|---|---|---|---|
| Unexplained mechanics and deaths with no damage log | Primordialis | Autopsy replay naming the failed pathway | 1.3, 1.7 |
| Number-heavy HUD panels and factory menus | Thrive / Lifecraft | Diegetic, in-world readouts | 1.3 |
| Threats the same colour as the world | Pathogenic (Heart boss) | A threat palette that contrasts with pale water | 1.3 |
| Essential information carried by colour alone | Blue Prince (at launch) | Shape, motion and sound redundancy | 5.19 |
| Opacity with no clue layer; permanent missing descriptions | Cultist Simulator / Binding of Isaac | Mystery first, clarity after | 2.2 |
| Interlocking systems all at once | Oxygen Not Included | Introduce coupling one system at a time; presets before raw circuit editors | 2.2, 4.4 |
| Early failures decided by luck | Plague Inc (Greenland) | Telegraphed threats; no off-screen one-shots | 1.3, 5.8 |
| Deaths from environmental pushback rather than choices; trial-and-error deaths | Pathogenic / Little Nightmares | Readable hazards with warning | 1.3, 3.3 |
| Opaque, judgmental scoring | New Pokémon Snap | Nikon Small World's four open criteria | 5.10 |
| The core action happening off-screen; a level that needs a walkthrough | Immune Defense (demo) | Keep fights on-screen near the hero; hint before any difficulty wall | 1.3 |
| Recipes chemistry does not explain | Subnautica | Every recipe is real chemistry or labelled abstraction | 5.11 |

**Operations and business**

| Codon avoids | Source game | Instead | See |
|---|---|---|---|
| CPU-bound simulation capped near 500 creatures | Species | Plan performance from day one | 1.3 |
| Memory blow-ups and single-digit FPS | The Sapling | Budgets and profiling in every milestone | 1.3 |
| Silent Early Access abandonment | Species / Equilinox | Visible, regular updates | 1.3 |
| A big balance patch without a beta branch | Slay the Spire 2 | Staged changes, clear communication | 2.2 |
| Shipping a systemic rework together with content | Stellaris 4.0 | Separate releases | 2.2 |
| Previews that promise more than ships; "procedural oatmeal" | Spore / No Man's Sky | Under-promise; variety from real parameters | 1.3, 5.17 |
| A mode that misleads buyers | Pathogenic (co-op) | Describe modes exactly | 1.3 |
| Ads, paywalled events, pay-to-win, timers | Cell to Singularity / Clash Royale | Premium price, no timers | 1.3, 5.6 |
| Forced platform accounts | Helldivers 2 | No account requirement | 5.7 |
| Hidden bots and free-text chat | agar.io | Disclosed AI, preset "chemical phrases" | 1.3, 5.7 |
| The patented Nemesis promotion system | Shadow of Mordor | Biology-native memory (CRISPR, rival immunity) | 5.7, 5.15 |
| Time gating and FOMO | Animal Crossing: New Horizons | Seasons as content, not gates | 5.16 |
| DRM | Spore | None | 5.17 |

**Story, tone and honesty**

| Codon avoids | Source game | Instead | See |
|---|---|---|---|
| A meteor-from-space opening | Spore | Come down from a human, not from space | 3.3 |
| A long passive prologue built on a parent's death | Ori and the Blind Forest | Control in ~8 s; fragility felt through play | 3.3 |
| A frame twist that abandons the core loop | Inscryption | The frame changes what mechanics mean | 3.3 |
| Progress gated behind cryptography | Tunic | Mystery decorates, never blocks | 3.3 |
| "Get back to normal size" as the goal | Honey, I Shrunk the Kids | An ending that embraces smallness | 3.2 |
| A lecture voice-over during the zoom | Powers of Ten | Wordless dive, optional codex voice | 3.2 |
| Cute faces on microbes; contested science stated as fact | Kurzgesagt | Crisp surreal style; honesty badges | 3.2 |
| Choreographed molecules in an empty cell | The Inner Life of the Cell | Crowding, water and random walks | 3.2 |
| Quoting "a person's a person, no matter how small" | Horton Hears a Who! | Borrow the structure, not the line | 3.2 |
| Medical conditions as jokes; suffering by design | Rogue Legacy 2 / Creatures 2 | Respectful framing; think through how harm is shown | 2.2 |
| Science sold as accurate when it isn't | Spore ("Flunking Spore") | Badges: Established / Debated / Hypothesis / Codon staging / Codon invention (gameplay §0) | 1.4, 4 |

## 7. The strongest opportunities nobody in the genre has taken

"The genre" means cell, microbe and evolution video games. Tabletop is noted where it was checked (1.3); other tabletop titles are an open gap (8).

1. **Gene expression as the interface.** No video game we found lets you watch DNA → mRNA → protein and see the protein change the cell. The claim is scoped to video games: the board game Cytosis already makes translating mRNA a worker-placement action, though not the evolution interface (1.3). Owning a gene does nothing until it is expressed; ribosome time, amino acids and ATP are the build budget (1.5, 1.7, 2.3).
2. **Horizontal gene transfer as the loot economy.** Transformation, conjugation and transduction as three theft verbs, each with real risk: Trojan phages, cursed toxin-antitoxin plasmids, recombination failure. Pathogenic and Strange Seed take parts or DNA from kills and Stellaris' Evolutionary Predators absorb prey traits, but no microbe game models the real transfer routes; Pathogenic's "plasmids" are a name only (1.1, 2.2, 4.2).
3. **Metabolism you can read in the world.** One proton-motive-force spine is the health bar, the stamina and the build: every new metabolism is a new pump or electron donor plugged into it, and each pathway can be heard as an instrument (4.8, 5.9, 5.13).
4. **A shape-fluid L-form hero whose body is the mechanic.** Overgrow-to-divide by blebbing, the wall toggle as an identity choice, round up into a lens to see light, an honest engulfment ladder grounded in Gemmata and Uabimicrobium. Thrive already ships endosymbiosis, so the new part is the staged, failure-prone domestication arc with a bacterial host (4.6, 4.7, 4.10).
5. **Senses that are the cell's own physics.** Chemotaxis with a few-second memory ("better or worse than before", no minimap), scent-plume stealth, a magnetosome compass. This fixes Spore's directionless swimming and Thrive's cluttered HUD at once (4.6, 5.4).
6. **Phages as a co-evolving procedural opponent with a visible memory.** Each survived phage becomes a luminous CRISPR spacer, escape mutants erode old immunity, and boss phages (anti-CRISPR shields, phage nuclei) force new defences (4.3).
7. **Gene regulation as a programmable layer with real circuits.** lac logic, toggle switches and the repressilator as a Zachtronics-style lab whose circuits install into runs. No video game we found has made real regulation playable (2.2, 4.4, 5.9).
8. **Asynchronous multiplayer that is literally gene transfer.** DNA bloodstains from dead players, ghost colonies, a community Lenski Flask, genomes shared as DNA strings, and a bacteriocin rock-paper-scissors arena where spatial structure decides who wins (4.5, 5.7, 5.16).
9. **Honesty as a feature.** Every node and codex entry badged Established, Debated, Hypothesis, Codon staging or Codon invention (gameplay §0), including "real roads not taken" such as the Asgard fork, where real history made the archaeon the host (4.10, 2.5). No cell or microbe game we found labels its inventions.
10. **A frame that is also the clock and the progression.** The dew drop is the run's clock, the drop is literally a lens (Gray 1696), and the watcher's improving instruments are the view-mode meta-progression, rendered as 3D raymarched volumes no peer uses (3.1, 3.6, 3.8, 1.5).

## 8. Open questions and research gaps

- **Not yet researched:** phyllosphere microbiology of dew, UV and desiccation (the opening's setting); *P. syringae* ice nucleation as a frost event (partly covered in 3.6); tabletop biology games beyond Cytosis and Cellulose, which the "no video game" scoping in 1.1 #8 and 7 #1 depends on; primary pages for Doron 2018, Rodrigues-Oliveira 2023 and the 2025 Asgard papers; quantitative mutator-strain rates; fresher 2026 Steam player data.
- **Unverified details:** Pathogenic's demo player count; Cytosis' first-edition year; SimLife's reception beyond Wikipedia; whether the 2023 Immune Defense has shipped; Contact's opening shot length; the exact text of The Incredible Shrinking Man's final monologue; Subnautica's scanner details; typical sizes of human-trace landmarks (fibres, pollen, skin flakes) at micro scale; osmotic-shock timing for an L-form. The drop's oxygen profile is now *estimated*, not measured (4.6, *The drop's layers*): the estimate's cells-per-mL conversion, whether any real dew drop gets crowded enough to go anoxic, how much UV leaf leachate absorbs in dew, and how strong a nutrient gradient leachate makes above the cuticle are all unverified.
- **Inventions to label in-game:** the drop's layering (light set by shadows, anoxia by crowding, both Codon staging; 4.6); naturally occurring leaf L-forms; *Bdellovibrio*'s behaviour toward a wall-less cell (now an open question badged Hypothesis, never a defence: gameplay §4.2); arbitrium decoy spoofing; KaiABC working in E. coli; flagellum-free stealth from flagellin sensing; the drop's day as a stress schedule; the hero becoming a eukaryotic host.
