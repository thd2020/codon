# Codon — gameplay design

**Status:** design spine, agreed. Supersedes the three competing proposals (Systems Depth, Splice Run, The Tangled Tree). Where they disagreed, this document is the decision.
**Owner:** design. **Biology owner:** needed — see §10.
**One line:** *A cell you can read. A genome you can wire. A drop that answers back.*

---

## 0. How to read this

### Honesty badges
Every node, card, boss and codex entry in the game carries exactly one badge, visible in game, plus one source link. This is a shipping rule, not a nicety: the genre's cautionary tale is Spore being sold as accurate and then graded as inaccurate by scientists, and its own developers saying the previews "built a fantasy in people's minds that was unachievable" ([PC Gamer](https://pcgamer.com/games/life-sim/spore-devs-say-the-evolution-games-previews-were-more-ambitious-than-what-they-were-actually-making-and-they-built-a-fantasy-in-peoples-minds-that-was-unachievable/)).

**One system for all three design documents.** The player sees five badges: Established, Debated, Hypothesis, Staging and Invention, the last two printed as *Codon staging* and *Codon invention* so the card says who did it. Designers write the seven codes below, which say *why* a card carries its badge. `story.md` and `research.md` use the same five names; this table is the mapping, and the last column lists their older labels so that nothing is badged two ways.

| In game (player-facing) | Designer code | Means | Older labels it replaces |
|---|---|---|---|
| **Established** | **R** | Real in *E. coli*-like cells — the hero's own family | story *Established*; research *[Established]*, *[real]*, and "Real" (research §2.5) |
| **Established** | **R+** | Real in another organism, as a gene or gene cluster that has really been moved between organisms; the hero acquires it by gene transfer | research *[real, by HGT]* |
| **Established** · laboratory | **RS** | Real, but so far only built in a laboratory (synthetic biology) | story *Established (laboratory)* |
| **Debated** | **H** | The phenomenon is real; its numbers, generality or meaning are contested, and the card says which | story *Debated*; research *[Established, details debated]* |
| **Hypothesis** | **H** | A published idea that is not settled, or an open question — stated as a question in the codex | story and research *Hypothesis* |
| **Codon staging** | **RX** | A real mechanism, exaggerated, idealised, time-compressed or placed by us; the card says what we changed | story *Codon staging* and *Convention*; research *[abstraction]* and "Real but exaggerated" (§2.5) |
| **Codon invention** · a road not taken | **RN** | A real road not taken: real in archaea, protists or rare bacteria, never seen in a cell like ours. The card names the organism where it is real | story's "invented: a road not taken" (story §3.5); research "Real road not taken" (§2.5) |
| **Codon invention** | **INV** | Codon's own, always printed next to the real analogue it is grounded in | story *Codon invention* and *Artistic*; research *[Codon invention]*, *[invented]* and "Invented" (§2.5) |

A node carries one code. Where a second code follows in brackets, as in *RN (theft RX)*, the card shows the first code's badge and the codex states the bracketed part. A **"Where we cheated"** page in the codex lists every Codon staging and Codon invention card (RX, RN and INV) in one place. It covers the world as well as the nodes: the wall-less motor's card heads it (§2.1), and the drop's layers — shadows for light, crowds for anoxia — have a card of their own (§4.1).

**Date stamps** (story §3.5). Every node also carries one date stamp, printed under its badge and listed in the *Date stamp* column of §3.7. The badge says how true the hero's version is; the stamp says how old the real thing is. A stamp is one of three kinds: a **real date** — *pre-LUCA*; *LUCA*, about 4.2 Ga, a date that is itself a hypothesis ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor)); a dated event such as the Great Oxidation Event; or *today*, when it is seen arising now, in L-forms, in patients, in the long-term evolution experiment or in a laboratory — ***age unknown***; or **no date**: *not taken* for an RN node, with the organism where it is real, and *invented* for an INV node. History never gates a node.

**R+ is narrow on purpose.** It applies only to a gene or gene cluster with a real transfer precedent, in nature or in a laboratory: the magnetosome cluster moved into another bacterium ([Kolinko et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24561353/)), proteorhodopsin given to *E. coli* ([Walter et al. 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC1838496)), the lux genes working in laboratory *E. coli* ([PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500)). A whole developmental program (endospores, cysts, fruiting bodies) or a cell-cycle state (polyploidy) is not a gene anyone can be handed. Those are badged **RN**, and where the game lets you steal one anyway, the node says that the theft is **RX**. The remaining R+ nodes still to be audited against this rule are listed in §10.

### Verification note
The shared web-search budget for this task ran out, so nothing below rests on a new search. Facts new to this document were checked by fetching the reference page directly in this session: [Nyerges et al. 2023, *Nature*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/) (swapped genetic code), [Tetrahymena](https://en.wikipedia.org/wiki/Tetrahymena) (microstome/macrostome sizes and the stomatin trigger), [Bdellovibrio](https://en.wikipedia.org/wiki/Bdellovibrio) (speed and attack route), [Coffee ring effect](https://en.wikipedia.org/wiki/Coffee_ring_effect) (capillary flow, "rush-hour", Marangoni), [Schuergers et al. 2016, *eLife*](https://elifesciences.org/articles/12620) (the cell as a microlens), [Integron](https://en.wikipedia.org/wiki/Integron) (cassette order, SOS-induced integrase), [Bienick et al. 2014, *PLoS ONE*](https://pmc.ncbi.nlm.nih.gov/articles/PMC4186888/) (growth burden of expression), [Transcription](https://en.wikipedia.org/wiki/Transcription_(biology)) and [Translation](https://en.wikipedia.org/wiki/Translation_(biology)) (real elongation rates), [Natural competence](https://en.wikipedia.org/wiki/Natural_competence) (DNA as food), [Kill the Winner](https://en.wikipedia.org/wiki/Kill_the_Winner_hypothesis), [Mechanosensitive channels](https://en.wikipedia.org/wiki/Mechanosensitive_channels), [Phage nucleus](https://en.wikipedia.org/wiki/Phage_nucleus), [R body](https://en.wikipedia.org/wiki/R_body), [L-form bacteria](https://en.wikipedia.org/wiki/L-form_bacteria). Everything else is cited to the source the research sweep supplied. Claims marked **†** could not be re-checked this session and must be confirmed before they reach the codex (§10).

**Critique pass.** A review round corrected the Rim, the Mouth, the R+ badges, the engulfment precedents, the prototype's state and the controls, and added group M and the graph columns of §3.7. The search budget was spent again, so the new facts rest on pages fetched directly: [Coffee ring effect](https://en.wikipedia.org/wiki/Coffee_ring_effect) (superhydrophobic drops), [Alchemilla](https://en.wikipedia.org/wiki/Alchemilla), [Tetrahymena](https://en.wikipedia.org/wiki/Tetrahymena) (macrostome diet), [Planctomycetota](https://en.wikipedia.org/wiki/Planctomycetota) and [*Uabimicrobium*](https://en.wikipedia.org/wiki/Uabimicrobium_amorphum), [Ribosomal RNA](https://en.wikipedia.org/wiki/Ribosomal_RNA), [Klappenbach et al. 2000](https://pmc.ncbi.nlm.nih.gov/articles/PMC91988/), the *E. coli* RMF entry at [UniProt](https://rest.uniprot.org/uniprotkb/P0AFW2.txt), [Codon usage bias](https://en.wikipedia.org/wiki/Codon_usage_bias), [ATP synthase](https://en.wikipedia.org/wiki/ATP_synthase) and [its c subunit](https://en.wikipedia.org/wiki/ATP_synthase_subunit_C), [Rifamycin](https://en.wikipedia.org/wiki/Rifamycin), [Origin of replication](https://en.wikipedia.org/wiki/Origin_of_replication), [Photolyase](https://en.wikipedia.org/wiki/Photolyase), [FtsZ](https://en.wikipedia.org/wiki/FtsZ), [MreB](https://en.wikipedia.org/wiki/MreB), [*Myxococcus xanthus*](https://en.wikipedia.org/wiki/Myxococcus_xanthus) and [Multicellular organism](https://en.wikipedia.org/wiki/Multicellular_organism). What those pages did not state carries a **†**.

**Second critique pass: flagella without a wall.** The search budget was spent again. The wall-less motor question (§2.1, #15, #148) rests on pages fetched directly: the *E. coli* MotB entry at [UniProt](https://rest.uniprot.org/uniprotkb/P0AF06.txt), the OmpA-like domain at [InterPro](https://www.ebi.ac.uk/interpro/api/entry/interpro/IPR006665), [Flagellum](https://en.wikipedia.org/wiki/Flagellum), [Sasajima & Miyata 2021](https://www.frontiersin.org/articles/10.3389/fmicb.2021.706426/full) (*Spiroplasma*), [*Mycoplasma mobile*](https://en.wikipedia.org/wiki/Mycoplasma_mobile) and [Liechti et al. 2016](https://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1005590) (*Chlamydia*'s partial wall). No primary paper on MotB's wall-binding domain could be opened, so that claim carries a **†**.

**Consistency pass: one badge system, one frame.** This pass reconciled the three design documents, with this document as the authority for systems and `story.md` for the frame (the badge mapping above, the date stamps of §3.7, the morning of §2.4, the exits, the node cap). The search budget was spent again, so the new facts rest on pages fetched directly: [*Planococcus citri*](https://en.wikipedia.org/wiki/Planococcus_citri) and [Endosymbiont](https://en.wikipedia.org/wiki/Endosymbiont) (a bacterium inside a bacterium, #85; later checked against [von Dohlen et al. 2001](https://doi.org/10.1038/35086563), by its abstract, and [Husnik & McCutcheon 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5027413/), for the guest's route in), [LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor), [Great Oxidation Event](https://en.wikipedia.org/wiki/Great_Oxidation_Event) and [Multicellular organism](https://en.wikipedia.org/wiki/Multicellular_organism) (date stamps). No source could be found for when dew dries on a leaf, so the morning is a frame, not a claim.

**Hot-spot pass: the bead burns, the loupe warms.** The watcher's glass no longer drives the UV → SOS → prophage chain. Pages fetched directly: [Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet) (soda–lime glass passes UVA but blocks "over 90% of the light below 300 nm"; UVA's DNA damage is indirect), [Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water) (water passes UV; glass is transparent in the near-infrared, where water absorbs), [Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage) (induction through DNA damage and RecA), [Ball lens](https://en.wikipedia.org/wiki/Ball_lens), [Heat shock response](https://en.wikipedia.org/wiki/Heat_shock_response) and [Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm) (hair-held drops focus sunlight). The hair-held bead is now the UV focuser and the loupe's hot spot is heat (§2.4, §3.2, §4.3, §4.4, #145).

**Strata pass: the drop does not layer by depth.** §4.1's "four strata, in every drop" (a sunlit top, a twilight middle, an anoxic floor) was staging presented as fact. Light is now driven by shadows and lenses, anoxia by crowding and respiration, and the layers are badged and listed on "Where we cheated". The search budget was spent again, so the new facts rest on pages fetched directly: [Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water) (attenuation lengths), [Stewart 2003](https://pmc.ncbi.nlm.nih.gov/articles/PMC148055/) (oxygen penetration depth and its worked example), [Mass diffusivity](https://en.wikipedia.org/wiki/Mass_diffusivity) and [Oxygen](https://en.wikipedia.org/wiki/Oxygen) (diffusion and solubility), [Aerotaxis](https://en.wikipedia.org/wiki/Aerotaxis) (bands at an air–liquid interface) and [Trichome](https://en.wikipedia.org/wiki/Trichome) (hairs reflect UV). The oxygen estimate is our arithmetic on those inputs; its weak points carry a **†** (§4.1, §10).

**Colossus pass: a giant amoeba, not a slug.** The Colossus (§4.3) had cited *Dictyostelium* as a millimetre-scale amoeba that eats bacteria; its millimetre stage is a multicellular slug and its feeding stage a single small amoeba. It is now *Chaos carolinense*, and #129 Fruiting Body rests on *Myxococcus* alone, with *Dictyostelium* as a eukaryote comparison. Pages fetched directly: [*Chaos*](https://en.wikipedia.org/wiki/Chaos_(genus)) (size, nuclei, diet), [*Dictyostelium discoideum*](https://en.wikipedia.org/wiki/Dictyostelium_discoideum) (slug size and cell count, diet, the 20%), [*Myxococcus xanthus*](https://en.wikipedia.org/wiki/Myxococcus_xanthus) (myxospores, peripheral rods, cheaters), [Endosymbiont](https://en.wikipedia.org/wiki/Endosymbiont) and [Jeon & Jeon 1976](https://pubmed.ncbi.nlm.nih.gov/972171/) (bacteria living undigested in an amoeba). The ~10 µm size of a feeding *Dictyostelium* amoeba is a typical figure that page does not give (**†**).

Nothing in this document contains sequences, strain-construction detail or anything protocol-shaped. Molecular detail is illustrative only, and stays that way in the game.

### The prototype's real state (re-checked)
Checked against `/home/user/cell/src` again in the critique pass:

- **The build works.** `src/metabolism.js` and `src/feeding.js` exist, `Hud.update(dt, camera, player, mState, fState)` matches the call in `src/main.js:128`, and `vite build` succeeds. The earlier milestone zero ("M-fix") is **done**. The energy route is drawn (`metabolism.js`), and a first engulf works (`feeding.js`): it is bound to **R**, with an in-water prompt reading "R · engulf" (`src/feeding.js:953`).
- `src/cellpass.js`: `MAX_CELLS = 12`, `MAX_GRANULES = 6`, `MAX_VESICLES = 2`, `MAX_RAFTS = 8`; `MAX_DENTS = 2` lives in `src/materials.js`. Per-cell proton glow already exists as `uTurnW[i].w`.
- Membrane complexes are the **`Complexes`** class (`src/bacterium.js:453`), one `InstancedMesh` per complex kind with per-site flash and rotor spin — not a `createComplex` function.
- `Tab` toggles inspect, which runs the frame at `dt * 0.25` (`src/main.js:112`). `F` tumbles (`src/player.js:39`). `maxSpeed` is 7 µm/s. Camera `maxDistance` is 18 units = 18 µm.
- **`Shift` is already bound to sink** alongside `C` (`src/player.js:72`), so Burst does not go on Shift.
- **The camera already owns left-drag.** `OrbitControls` (`src/main.js:58`) orbits on left-drag and zooms on the wheel; right-drag does nothing, because pan is disabled (`src/main.js:61`). The control table in §2.1 is built around this and around R.

---

## 1. The fantasy and the pillars

> **You are a bacterium that lost its armour. You win by understanding it: read the machine, steal its missing parts, rewire its logic, and out-think a drop of water that is alive, hungry, and learning your face.**

Store line: *A cell you can read. A genome you can wire. A drop that answers back.*

### Pillar 1 — Nothing is a number. Everything is a mechanism you can see.
The prototype already refuses a screen-space HUD: vitals ring, scale bar and inspect tags live in the water. That is the whole design, not a style choice. ATP is beads. Proton-motive force is the glow in the periplasm. A stalled pathway is a visible traffic jam and an audible one.

This attacks the genre's single commonest complaint. Primordialis has 51 logged "poorly explained" mentions and 14 "unclear deaths, no damage log" ([VaporLens](https://vaporlens.app/app/3011360/primordialis)); Thrive is criticised for "HUD panels full of numbers" ([Steam](https://steamcommunity.com/app/1779200/negativereviews/?browsefilter=toprated)); Niche has 56 "poor tutorial" mentions ([VaporLens](https://vaporlens.app/app/440650/niche_a_genetics_survival_game)).

**Shipping rule:** every node has a *visible installed form*. If we cannot show it, we do not ship it.

### Pillar 2 — The genome is a machine you build, not a shop you browse.
Owning a gene does nothing. Genes must be transcribed and translated, which costs ribosome capacity, amino acids and ATP, and takes time you can be killed in. Regulation decides *when*. The proteome is a hard budget with a real cost curve: each 1% of the proteome spent on protein the cell does not need costs roughly 3% of relative growth rate ([Bienick et al. 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4186888/) — their model predicts "for expression of every 1% of heterologous protein per dry cell weight, the relative growth rate is reduced by ∼3%"; fitted slopes 2.3–3.6).

So the same five genes make three different cells depending on promoter strength, cassette order and which stance is running. That is the answer to the genre's second failure: evolution that is really sliders (The Sapling's animals "only change in size and surface features", [Steam](https://steamcommunity.com/app/997380/negativereviews/?browsefilter=toprated)) or a free parts catalogue (Spore's "Mr. Potato Head simulator", [Game Developer](https://www.gamedeveloper.com/game-platforms/gdc-lessons-learned-from-i-spore-i-its-science-and-more)).

### Pillar 3 — Seconds-to-seconds play is honest *and* physical.
Fun comes first. At low Reynolds number there is no momentum, which we treat as a gift: zero input lag, twitch-tight controls, no wind-ups. Impact is not knockback; impact is **deformation**. The body dents, flow lines bend, the lens pass pulses, time dips 70 ms, and a wet pop lands. The full rulebook is §2.2.

### Pillar 4 — The drop is an economy with other players in it, and it adapts to you.
Every NPC lineage runs the player's rules: same proteome budget, same proton-motive force, same trade-offs. Nothing is hand-authored as a "monster". And the world **re-targets** you: rivals and phages adapt to your most-expressed surface proteins; phage pressure rises with your abundance ([Kill the Winner](https://en.wikipedia.org/wiki/Kill_the_Winner_hypothesis), Thingstad & Lignell 1997 — viruses "moderate the population size of 'winners'", letting slower defenders coexist); a streamlined genome only works while a neighbour still leaks the function you dropped ([Black Queen](https://en.wikipedia.org/wiki/Black_Queen_hypothesis)).

### The one sellable tension: **Express versus Expose**
Everything you express can be read by something else. The maltose porin that doubles your sugar intake is also the door phage lambda uses ([review](https://www.imrpress.com/journal/fbl/8/6/10.2741/1046)). The flagellum that makes you fast is what the plant smells before it shuts its pore ([Melotto et al. 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)). One sentence, learnable by looking, and it folds in surface re-targeting, Kill the Winner and the Red Queen. This is the line the game is sold on.

### What Codon is not
- A free editor where evolution is shopping (Spore).
- A simulation you only watch (Species: ALRE).
- A parasite bullet-hell — Pathogenic owns that lane, and a genome economy bolted under an action roguelite later collapses into stat cards.

---

## 2. Core loops at three time scales

### 2.1 Seconds — sense, steer, touch

**Controls.** Built on the prototype's bindings, and kept close to what the code already does: **R** engulfs (as `feeding.js` does today), the camera keeps left-drag orbit, Burst takes the right button (free, because pan is off), and Burst is deliberately *not* on Shift, which already sinks (`src/player.js:72`).

| Verb | Key / pad | What happens | Honest because |
|---|---|---|---|
| Swim | W A S D, Space rise, C (+Shift) sink / left stick | Speed follows motor thrust almost instantly | No coasting at Re ≈ 10⁻⁵ (already in the prototype) |
| Look | Left-drag orbits, wheel zooms / right stick | The camera; swimming steers by it, as now. Nothing else uses the left button, so a drag never fires a verb | `OrbitControls`, as in the prototype |
| Roll | Q / E | Body roll; the cell also counter-rotates against its motors | Real counter-rotation |
| **Tumble** | F / LB | Flagella splay, the cell flips to a new heading. Breaks a predator's lock. **No invulnerability frames.** Free, short cooldown | Clockwise motor reversal splays the bundle ([Chemotaxis](https://en.wikipedia.org/wiki/Chemotaxis)). That is a walled cell's motor; the naked hero's is our cheat (below) |
| **Burst** | Right mouse (hold) / RB | Directed sprint paid in H⁺; stops dead on release | The motor runs on the proton-motive force. What it braces against in a wall-less body is our cheat (below) |
| **Envelop** | **R** (hold to reach, release to close) / LT | The jelly body reaches and wraps. Releasing at the right moment is a **clean seal**: faster digestion, no leak plume. Today R engulfs on the press; hold-and-release is M0's first extension (§8.2) | Walled bacteria show the machinery can exist: protein uptake in [*Gemmata*](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973), which has a peptidoglycan wall ([Planctomycetota](https://en.wikipedia.org/wiki/Planctomycetota)), and whole-cell engulfment in [*Uabimicrobium*](https://en.wikipedia.org/wiki/Uabimicrobium_amorphum). Wall loss is Codon's route to it, so the hero's engulfment is **RN** |
| **Secrete** | X / RT | Fires the equipped secretion: enzyme cloud, toxin, surfactant, signal, decoy vesicles | Bacteria act on the world by secreting |
| **Grapple** | G (once evolved) / B | Type IV pilus hooks and reels a surface, debris or prey | Pilus retraction stalls near 110 pN ([Maier et al.](https://experts.arizona.edu/en/publications/single-pilus-motor-forces-exceed-100-pn/)) |
| **Form** | 1–4 / D-pad | Rod, Sphere, Sheet, Tendril (below) | No wall means no fixed shape |
| **Read / Inspect** | Tab tap = read target; Tab hold, or the wheel past the closest zoom = push further in | Slows time to 0.25×, names parts, and pushing in keeps going until you are inside the nucleoid reading the Atlas | Already in the prototype; **there is no evolution menu** |

**Why Envelop is on R.** The earlier plan put Envelop on left-mouse hold and Secrete on R. That fought the prototype twice: `feeding.js` already engulfs on R and says so in the water, and left-drag already orbits the camera, so every Envelop would have swung the view. The decision: keep both as built, move Secrete to X (unbound today), and keep the left button for the camera alone. Holding Burst while dragging to steer uses both buttons at once, a familiar pattern from mouse-steered cameras. If the Steam build later offers pointer-locked mouselook, the verbs stay where they are.

**The one cheat in the default verbs: a motor with nothing to brace on.** A flagellar motor turns because its stators push against something fixed, and in *E. coli* that something is the wall. MotB is "probably a linker that fastens the torque-generating machinery to the cell wall", through a domain that "probably functions to anchor the complex to the cell wall" ([UniProt MotB](https://rest.uniprot.org/uniprotkb/P0AF06.txt); "the MotA(4)-MotB(2) complex attaches to the cell wall via MotB", [InterPro](https://www.ebi.ac.uk/interpro/api/entry/interpro/IPR006665)). The stator is "anchored like a gear wheel to the cell wall", and the basal body's P ring "associates with peptidoglycan layer" ([Flagellum](https://en.wikipedia.org/wiki/Flagellum)). The hero has no wall. And the real wall-less movers in the catalogue have no flagellum at all: *Spiroplasma* swims by sending kinks down a helical body, using a system "unrelated to well-known bacterial motility systems such as flagella and pili" ([Sasajima & Miyata 2021](https://www.frontiersin.org/articles/10.3389/fmicb.2021.706426/full)), and *Mycoplasma mobile* glides on surface "legs" powered by "energy obtained from ATP hydrolysis" ([*Mycoplasma mobile*](https://en.wikipedia.org/wiki/Mycoplasma_mobile)). So the opening's run-and-tumble, Tumble and Burst all rest on a cheat, and the game says so:

- **#15 is badged RX for the naked hero**, and its card heads the "Where we cheated" page: *"A wall-less cell's stators have little to brace against; we let them grip anyway."* The card appears the first time you Read your own motor, never in the opening, which stays wordless.
- **The cheat has a price, so the honest builds pay off.** A naked motor runs a little below a braced one. Rebuild the Wall's +20% swim (#14) is the brace coming back, and **Polar Anchor** (#148) keeps a scrap of wall at the poles so the motors grip honestly, at the cost of rigid poles.
- **Gliding and Kink-Propagation Swimming (#22, #23) are the honest wall-less roads**, and the card names them. The Glider origin strain (§6.2) starts on one.

Whether any wall-less cell has been seen to turn a flagellum is **†** for the biology owner (§10). If none has, #15's badge for the naked hero becomes **INV**.

**Sensing is the skill, and there is no minimap.** You read the gradient *in time*: "better or worse than about four seconds ago", drawn as a shimmer in the water and as methylation state on the receptor array the prototype already renders. **A plume is drawn only if you own a receptor for its molecule** — so every new sense re-skins the same drop with a new layer of information, which is Gris's reveal with an epistemic payload.

**Forms** are the hero's signature verb and the thing no other cell game has. They are one body, redistributed.

| Form | Gains | Costs | Grounding |
|---|---|---|---|
| **Rod** (default) | Fastest swimming; flagella line up behind | Average at everything else | The prototype's shape |
| **Sphere** | Lowest surface-to-volume ratio, so the least osmotic load per unit volume; grabs slide off; gateway to the **microlens sense** | Slowest swimmer; smallest uptake area | A spherical cell really focuses "a high-resolution image of the light source… on the edge of the cell opposite to the source" ([Schuergers 2016](https://elifesciences.org/articles/12620)) |
| **Sheet** | Widest Envelop reach; most membrane area for uptake and light; rides currents | Highest drag; highest osmotic exposure | Surface-to-volume, honestly inverted |
| **Tendril** | Squeezes through gaps nothing rigid can pass; longest grapple and Envelop reach | Fragile: a hit costs more; cannot fight well | Wall-less cells really deform through constrictions |

Form change takes ~0.4 s and costs a little membrane. **Hopanoid Stiffener** slows the change and adds armour. **Rebuild the Wall** locks you to Rod and removes forms entirely.

**The second-to-second loop (10–30 s):** read a plume → close or dodge a telegraph → Envelop or strike → choose **Digest / Dissect / Keep** → express → watch the install land. Repeat with a new plume.

**One vitality.** The proton-motive force is the shared pool: swimming, uptake and ATP synthesis all bite it, and it is what the periplasmic glow already shows. Movement literally costs growth — Osmos's one great rule ([Osmos](https://en.wikipedia.org/wiki/Osmos)) made true instead of metaphorical.

### 2.2 The viscous-juice rulebook (game feel)
Steve Swink's definition of game feel is real-time control of virtual objects with interactions emphasised by polish ([Game feel](https://en.wikipedia.org/wiki/Game_feel)). We keep the intent of "Juice it or lose it" and replace every effect that implies inertia, because at this scale "time or inertia does not come into play" ([Scallop theorem, after Purcell 1977](https://en.wikipedia.org/wiki/Scallop_theorem)).

| Event | Feedback | Why honest |
|---|---|---|
| Envelop closes | 70 ms time dip (never a freeze), a ripple runs the membrane, a wet pop, prey glowing through the jelly | Impact is deformation |
| You take a hit | A dent at the contact point (the renderer's `MAX_DENTS` pockets), an iridescent flare, a chromatic pulse from `lens.js`, H⁺ beads visibly leaking, a low thud | Damage is a breached membrane and lost gradient |
| A kill (lysis) | The cell bursts into metabolite beads and DNA threads that drift to you along the flow field | Lysis really spills contents and DNA |
| Burst | Motor whine rises, bundle tightens, particles streak, everything stops on release | No coasting |
| Gene install | The DNA thread lights at that locus, a rising zip, ribosome clicks, the protein flies in and **snaps with a ring wave**, the silhouette changes | The real order of expression |
| Synergy live | The shared currency visibly flows between the parts involved (cyan H⁺ beads from a pump to a motor), and that pathway's instrument joins the score (the [Rez](https://en.wikipedia.org/wiki/Rez_(video_game)) idea, as feedback only) | Currencies really are shared |
| Threat telegraph | Particle streams bend toward the source; a rising tone; a motion cue that never depends on colour alone | Flow fields are real |

**Never:** camera translation shake, knockback slides, floating damage numbers (available as an accessibility toggle only), invulnerability frames.
**Protect:** instant input-to-motion response. No wind-up animations on movement.

### 2.3 Minutes — the expression loop (the heart)

```
acquire a gene → choose where it goes (cassette Array vs chromosome Atlas)
   → express it (ribosome capacity, proteome share, placement on the body)
   → it changes how the cell behaves, visibly
   → the drop notices and re-targets you
   → divide: draft the daughter that keeps the change
```

Three decisions make this the minute-to-minute game instead of a pause panel:

1. **The install is visible and short; the commitment is long.** A gene's visible build takes **3–8 s**, scaled by gene length. The real numbers are not far off per-molecule — prokaryotic transcription elongates at roughly 10–100 nt/s ([Transcription](https://en.wikipedia.org/wiki/Transcription_(biology))) and prokaryotic ribosomes add "up to 17–21 amino acid residues per second" ([Translation](https://en.wikipedia.org/wiki/Translation_(biology))), so a 1 kb gene really makes its first protein in tens of seconds and a working population of copies in minutes. We compress the *build* and keep the *commitment* real: the proteome share is locked while the protein is there, and turning it off means dilution and proteolysis, not a toggle, unless you evolved degradation tags. Badge **RX**, stated in the codex. Multi-minute latency is reserved for megaprojects (reaction centre, endospore, domestication).
2. **Placement matters.** Each protein goes *somewhere*: a membrane patch, a pole, free in the cytoplasm. The prototype already draws complexes as instanced meshes on membrane rafts, so "one node = N more visible pumps, at this pole" is an instance count and a position. Pathogenic's breakout feature was exactly this ([TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm)); Spore's famous failure was the opposite.
3. **Division is a draft, not a reward.** At each division you see three daughters with their mutations stated up front — Slay the Spire's intents principle, where playtesters asked for the numbers ([Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)). You continue as one; the others persist in the water as kin, cooperating, occasionally cheating.

### 2.4 One run = one bead's morning (18–25 min)
Dew forms by night-time radiative cooling on clear, calm nights ([Dew](https://en.wikipedia.org/wiki/Dew)), and one field study had leaves wet about 10 h ([AGRIS](https://agris.fao.org/search/en/records/65df5d446eef00c2cea280bf)), which compresses cleanly. The clock is the sun and the shrinking drop, never a timer UI. In the story a run is one bead's morning on the back step (story §3.1), so the five stages are named for one morning; what happens in each is set here.

| Phase | Clock | The drop | The player's problem | Divisions |
|---|---|---|---|---|
| **Dawn** | 0–3 | Cool, dilute, oxygen everywhere, quiet | Express an opening loadout, find a gradient, meet the neighbours | 1 (first install before 1:45) |
| **Early Morning** | 3–8 | Gradients sharpen, rivals grow, the first lysis events seed free DNA | Grow and steal; the first real build decisions | 2 |
| **Midmorning** | 8–14 | Evaporation concentrates salt, heat and UV rise, a hair-held bead's own UV focus sharpens on its underside, the watcher's lens hot spot crosses the drop with heat (§4.4), phage pressure follows whoever got abundant | Survive the crunch — your *regulation*, not your stats, saves you | 2 |
| **Late Morning** | 14–19 | Small, crowded, acidic from everyone's fermentation; anoxic pockets open beneath the thickest crowds (§4.1) | Commit: fight, ally, or prepare to leave | 2 |
| **Rim** | 19–23 | The last stage, shaped by how the drop holds the leaf: a pinned drop's capillary flow sweeps everything living to the drying edge, accelerating at the end; a hair-held bead shrinks as a sphere and crowds everything toward its centre | The Rim finale, then the exit choice | 1 |
| **Jar** | +3–5 | Hub: the leaf under the lens, and the child's jam jar on the windowsill (story §3.2–3.3) | Promote a cassette to the chromosome, read the Notebook, set standing conditions at the jar, pick the next drop | — |

**The Rim finale is real physics only where the drop is pinned, so its shape depends on the drop.** Badge **RX**: the physics is real, the tempo is ours, and which finale you get is set by how the drop holds the leaf. The leaf map's drop card says which one a drop will have.

- **Pinned drops — tooth-tip beads, vein runnels, the puddle.** In a drying drop whose edge is held, liquid lost at the edge is replaced from the interior, and "the resulting current can carry nearly all the dispersed material to the edge", with "a rapid acceleration of the flow towards the edge at the final stage of the drying process" — the *rush-hour* effect ([Coffee ring effect](https://en.wikipedia.org/wiki/Coffee_ring_effect)). The finale is a rush to the edge. (That a tooth-tip bead clings to the wet tooth that exuded it is Codon staging, as story's tooth-tip beads already are.)
- **Hair-held beads — the cup bead and the beads on the hairs**, most of Act I's leaf. Lady's mantle leaves "show a high degree of water-resistance" ([Alchemilla](https://en.wikipedia.org/wiki/Alchemilla)), and the same coffee-ring page says drops on superhydrophobic surfaces "are less likely to have a pinned contact line", which "will suppress ring formation". So there is no rush to the edge. The finale is a **shrinking sphere**: the contact line slides inward as the bead loses water, and life and salt concentrate toward the centre. The arena closes from every side at once, and the last water is the saltiest of the run, so compatible solutes and trehalose glass matter more here than grapple anchors. (How fast the line recedes, and the final concentration toward the centre, follow from an unpinned edge; **†** for the biology owner, §10.) Hair-held beads are also the leaf's burning glasses: a drop held up by hairs focuses sunlight onto the leaf below ([Egri et al. 2010](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)), and water passes UV, so these beads carry the run's UV focus on their underside (§4.4).

It is still a shrinking arena every drop shares, and now it is honest in both shapes.

**Marangoni Surf** is offered **only in pinned drops**, where there is an edgeward flow to push against; in a hair-held bead there is nothing to surf, so it never appears. It is a Secrete use of Swarm Slick's surfactant (#26), and it must be worded carefully: a strong surface-tension-driven flow "redistributes particles back to the center of the droplet", and a cited result is titled "Marangoni Effect Reverses Coffee-Ring Depositions" — but the same page says "Water has a weak Marangoni flow to begin with, which is then reduced significantly by natural surfactants." So it is badged **RX**, and the codex says plainly: a surfactant gradient can drive inward flow; simply dumping surfactant does not reliably do it.

**Density rule:** no empty swimming (Thrive's top complaint is "wandering vast voids"). At low Reynolds number travel is slow, so the world must be small and information-rich. **You are never more than ~6 s of swimming from a decision.**

**Exits are extraction.** What you keep depends on *how* you held it:

| Exit | Keeps | Loses | Next habitat |
|---|---|---|---|
| **Cyst** | Chromosome + plasmids | Clones, loose proteins | Leaf crust nearby |
| **Trehalose glass** | Chromosome + plasmids + **loose proteins** | Your ATP store | Same drop's dust |
| **Endospore** (acquired, irreversible) | Whole genome, survives anything | Clones, proteins; **the mother dies** | Anywhere |
| **Hitchhike** (insect foot, rotifer, splash, or the child's fingertip, story §3.2) | Chromosome + clones that hold on | Plasmids without partition genes | You do not choose where |
| **Stoma gate** | Everything, if you get through | — | Inside the leaf |

Rules, stated once and always true: **chromosome genes always carry over; plasmids carry over only with partition genes; loose proteins carry over only with trehalose glass.** That is what gives "promote a cassette to the Atlas" a real stake.

**Living clones are extra lives.** When you lyse, you continue as a surviving sister. You inherit her proteins, not yours. The run ends when the lineage ends. The Chorus build (many clones, each thinner) and the Solo build (one strong cell, one life) diverge right here.

### 2.5 Hours — the knowledge loop
What persists is understanding, in five channels (§6.1): the **Atlas** (your chromosome and everything it ever integrated), the **Codex** (real organisms and mechanisms, badged and sourced; knowledge *gates counters* — once you have observed that a phage clade adsorbs to a given porin, the porin-variant node appears), the **Instrument ladder** (microscopy as view modes), the **Tangled Tree** (your lineage, with gene transfers drawn as threads), and the **Jar** (the child's jam jar on the sill: biofilm, frozen lineages, standing conditions).

An **Expedition is three drops** (~50–60 min), one per morning of the campaign's summer (story §3.1), saved between drops. The **run map is the leaf itself**: dew drops are nodes, leaf hairs and vein runnels are the paths, read through the watcher's magnifier. Each drop advertises its parameters — size (= time), sun or shade (= light and UV), who lives there, its finale (a pinned rush to the edge or a shrinking sphere, §2.4), and specials (a stoma nearby, an insect visit, a lens hot spot).

**The score is relative fitness *w*** against your own ancestor, shown at each division with a faint **ancestor ghost** swimming beside you. That is the real metric of the long-term evolution experiment, whose populations grew about 70% faster than their ancestor by generation 20,000 ([LTEE](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment)).

### 2.6 How a 45-minute evening flows
1. **0:00** — The leaf at dawn, the watcher's lens hovering. The cursor *is* the lens. Pick a drop (5 s), dive (3 s, skippable after the first time).
2. **0:01–0:22** — Drop one. ~8 drafts, 2–4 visible power spikes, the midmorning crunch, the Rim finale, an exit.
3. **0:22** — A 20-second lineage card: the new branch, *w*, one auto-written caption.
4. **0:23–0:43** — Drop two, chosen by the exit you took. You die at 0:35 to a stalker, jump into a surviving sister, limp to a cyst.
5. **0:43** — Stop. The Expedition is saved. If the whole lineage had died: autopsy (10-second rewind, the named mechanism, the one gene from your seen pool that would have saved you), one Notebook page, one codex entry, and the leaf with the next drop already glinting.

---

## 3. Phase 1 — the evolution tree on everything

**The owner's pitch, mapped.** The original pitch named three organelle upgrades — mitochondria for energy, ribosomes for defence, flagella for mobility — plus evolution trees for the hero and the colony, and colony against colony. All of it survives, moved to where the biology puts it:

- **Mitochondria → energy, in the membrane.** A bacterium has no mitochondria; it is the kind of cell mitochondria came from. So the hero's energy lives in its own membrane: the respiration chain and the ATP synthase with its gear (groups C and M, #29, #141). The mitochondrion is the destination rather than a part: Keep-Not-Digest and the Symbiont Socket (#85, #133) are how a lineage starts keeping a partner, and the Seen ending's last image is a mitochondrion's ATP synthase turning like the hero's (§9.3).
- **Ribosomes → defence, by deciding who uses them.** Ribosomes are capacity first: the proteome budget (§3.4) and group M. They become defence because a phage wins by taking them over — the Bloom is watching your own ribosomes build capsids (§4.3) — and because Recode makes them read a dialect phages do not speak, with Codon Dialect as the first step toward it (#143, #138). Defence proper is group E.
- **Flagella → mobility.** Group B, plus the flagellum's real family: the injectisome union grows from its export apparatus (§3.9), and the Harpoon is our chimera (#136).
- **Super Cell, two trees, colony against colony.** The hero is the Super Cell. The hero's tree is the Atlas; the colony's tree is the Tangled Tree with groups J and K; colony against colony is later and asynchronous (§6.4).

**And the tree you asked for.** §3.1 proposes a Wheel instead of a tree as the primary view, for the reasons in its table. The tree is still there: the **organelle lens** (end of §3.1) shows the Atlas as one small tree per structure — flagellum, ribosome, ATP synthase, membrane, outer envelope, nucleoid — and the Tangled Tree is the lineage tree. If you would rather the tree be the first thing players see, the lens can be the default view and the Wheel the zoomed-out one; nothing else in the design changes (§10, question 7).

### 3.1 Structure: the Codon Wheel — three rings, one object
Not a tree. Not a constellation. **A genome, wrapped in a lineage.** One zoomable object with three concentric rings, moved between with the same focus/scroll verb as the opening dive, so scale stays continuous from leaf to genome. You reach it by pushing `Tab` inspect further in until you are inside the nucleoid. **There is no evolution menu; the tree is an organelle.**

```
┌─ INNER: THE GENOME RING ─── what you are now
│    your circular chromosome. 12 loci (arcs). Operons are arcs; plasmids orbit it.
│    Position on the ring is a mechanic: gene dosage near the origin.
│    Beside it: THE ARRAY — an integron, 6–10 cassette slots, order-sensitive.
├─ MIDDLE: THE ATLAS ─────── what you could become
│    13 sectors (groups A–M of §3.7) of 8–17 gene-stars, fogged until discovered.
│    Homology edges (you may drift along these) and keyword edges (synergy).
└─ OUTER: THE TANGLED TREE ─ what you were, and who you touched
     a radial phylogeny of your lineages, descent running outward,
     gene transfers drawn as plasmid-pink threads, grafted onto a faint real tree of life.
```

**Why this and not the alternatives:**

| Candidate | Rejected because |
|---|---|
| Branching tech tree | Implies one-way commitment, which produces Thrive's "point of no return"; and it lies — gene loss and lateral acquisition are not branches |
| Giant passive web (PoE) | Needs travel nodes and an external planner; PoE2 players count "more than 1,500 nodes but only 122 points… bloated and overwhelming" ([forum](https://www.pathofexile.com/forum/view-thread/3767066)) and a thread titled "WAY TOO MANY travel nodes" ([forum](https://www.pathofexile.com/forum/view-thread/3674817)) |
| Constellations (Grim Dawn) | Arbitrary, and high tiers read as "almost mandatory", forcing one low-tier path ([Crate forum](https://forums.crateentertainment.com/t/thoughts-on-devotion-setup-cold-caster-reaper/115365)) |
| **Genome ring + atlas + lineage** | **Chosen.** The layout itself carries real mechanics — dosage by position, operon adjacency, cassette order, visibly foreign acquired islands. Small enough to need no planner (a hard cap of 250 stars, §3.7). It is the literal subject of the game. And the outer ring is the share surface |

**The honest kernel of the inner ring: distance is dosage.** In fast growth, replication forks are still in transit when the next round starts, so genes near the replication origin exist in more copies than genes near the terminus. Putting your flagellar operon near the origin makes you fast when food is rich and slow when it is lean. A real trade-off produced by map geometry, with no invented currency. (Textbook Cooper–Helmstetter multifork replication; **†** — the page I could reach this session did not state the C and D periods, so the biology owner must confirm the figures before they are printed.)

**The Array — the integron — is the loadout.** This is the most important structural borrowing in the design, because it is a real biological object that is already an order-sensitive loadout: an integrase inserts promoterless gene cassettes at one site next to the Pc promoter, so "the cassette integrated last is then the one closest to the Pc promoter at the attI site", and "the level of gene expression of a cassette is then a function of the number and nature of the cassettes that precede it"; integrase expression is controlled by the SOS response ([Integron](https://en.wikipedia.org/wiki/Integron)). Translated with nothing invented:

- Found and stolen genes arrive as **cassettes**, not Atlas nodes. 6–10 slots.
- **Slot 1 is loud, slot 8 is a whisper.** Ordering *is* the build. You watch RNA polymerase run the array from the promoter outward and lose steam.
- **Reordering needs integrase, and stress raises it.** The moment the bead's focused UV is damaging your DNA or a toxin lands is also the moment you can re-architect. Risk and opportunity on one trigger.
- At the Jar, a cassette can be **promoted to the chromosome**, at a cost. That is how run loot becomes campaign identity.

This is Noita's wand ([wand mechanics](https://noita.wiki.gg/wiki/Guide:_Wand_Mechanics)) without Noita's documented opacity, because the rule is one sentence and visibly true on screen.

**Regulation** is the third layer, and it ships deliberately shallow. See §3.5.

**The organelle lens — the per-structure tree.** The Atlas can be filtered by structure. Pick a lens and every star that builds, tunes or replaces that structure lights up, laid out as a small tree along its "potentiated by" and homology edges (§3.7), with everything else fogged. It is the owner's "tree on every organelle", as a view of the same nodes. Six lenses at 1.0:

| Lens | Nodes (§3.7) |
|---|---|
| **Flagellum** | 15–19, 64, 136, 148; the unions Injectisome, Green-Light Swim and Magnetotaxis Dive (§3.9); the Keep/Shed pair (§3.11) |
| **Ribosome and expression** | 139, 140, 142, 143, 89–91, 95–97, 138 |
| **ATP synthase and the energy membrane** | 141, 29, 34, 36, 7, 37, 82 |
| **Membrane and body** | 1–6, 13, 14, 27, 101, 146, 147 |
| **Outer envelope** — outer membrane, periplasm, LPS | 8–12, 62, 63, 66 |
| **Nucleoid** | 57, 58, 67, 68, 98, 99, 106, 110, 111, 125, 131, 144, 145 |

The outer-envelope lens gathers the Gram-negative branch the catalogue spreads across groups A and E: porins and the maltose gate, the O-antigen at the outer tip of the LPS, the capsule, outer-membrane vesicles, receptor remix, phase variation and surface charge.

### 3.2 Node states, and how you move through the Atlas
Nodes are never bought with points. A node is a gene; its state says what you know and what you hold.

| State | Looks like | Reached by |
|---|---|---|
| **Unknown** | Dark sky | — |
| **Rumoured** | A faint outline | You *Read* it in another cell, a Notebook page hints at it, or an experiment points at it |
| **Held** | A star with a gene card | You own the DNA: a cassette, a plasmid, or silent on the chromosome |
| **Expressed** | A lit segment on the Genome Ring | Transcribed, translated, working, costing proteome |
| **Refined** | A brighter star | Heavily used genes are offered refinement mutations (real adaptive refinement, [eLife](https://elifesciences.org/content/4/e09696)) |
| **Authored** | A star carrying your strain's name | A curated union or INV structure you completed first |

Two rules of motion, and they are the thrill of the whole system:

- **Evolving is local.** Mutation only moves you along *homology edges* — duplicate a gene and let the spare diverge into a neighbouring star while the original keeps working. (A mutation can also wake or retune a gene your family already carries; it cannot reach a new star any other way. The edges are listed per node in §3.7.) Duplication rates in bacteria are estimated at 10⁻³–10⁻⁷ per gene per generation ([Gene duplication](https://en.wikipedia.org/wiki/Gene_duplication)).
- **Stealing leaps.** Gene transfer can land anywhere on the Atlas. That is why theft is exciting and why the outer ring is a net, not a tree: with extensive transfer "there would be a complex network with many ancestors, instead of a tree of life" ([HGT](https://en.wikipedia.org/wiki/Horizontal_gene_transfer), citing Gogarten and Doolittle).

### 3.3 How nodes are earned — nine routes, each with a cost
Nothing is bought with an abstract currency. There is no points shop.

| Route | In play | Real basis | Risk |
|---|---|---|---|
| **Division draft** | At each division, 1 of 3 daughters, mutations stated. Verbs: substitution, duplication, knockout, promoter capture, transposon hop, deletion. One option is always the unmutated daughter — the honest "skip", which banks a reroll | Real per-genome rate ~1×10⁻³ per generation, so the draft is framed at the *lineage* level: these are the few mutants among the thousands of sisters ([Lee et al. 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3478608)). Compression badged **RX** | Knockouts can be a gain or fatal; duplications cost replication time |
| **Read or Eat** (transformation) | Lysed cells spill glowing DNA threads. With competence running: **Read** for 1 of 2 genes from the dead cell, or **Eat** for nucleotides and energy | Both are real hypotheses for why competence exists; cells taking up DNA "inevitably acquire the nucleotides the DNA consists of", which may "make a significant contribution to the cell's energy budget" ([Natural competence](https://en.wikipedia.org/wiki/Natural_competence)); endocytosis-like DNA uptake by wall-less L-forms of the actinomycete *Kitasatospora viridifaciens*, not *E. coli* ([Kapteijn et al. 2022](https://doi.org/10.1038/s41467-022-33054-w)) | Competence costs energy, and your own restriction enzymes chew the DNA you wanted |
| **Conjugation** | *Read* a neighbour's plasmid ring before you bridge. Then trade, raid (hold contact ~3 s while it struggles), or gift to kin. Both cells end up donors | [Conjugation](https://en.wikipedia.org/wiki/Bacterial_conjugation) | Some plasmids are selfish; addiction modules kill daughters that lose them |
| **Transduction** | Accept an infection for a payload: a gift, a lodger, or death | [Lambda](https://en.wikipedia.org/wiki/Lambda_phage) | The gamble, and the Sleeper later |
| **Engulf → Digest / Dissect / Keep** | Swallow a cell, then choose: **Digest** (food plus random fragments), **Dissect** (a slow Inspect inside the vacuole: read the whole genome, pick one gene), **Keep** (domestication arc) | Protein uptake in [*Gemmata*](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973); whole-cell engulfment in [*Uabimicrobium*](https://en.wikipedia.org/wiki/Uabimicrobium_amorphum). Both are planctomycetes, and *G. obscuriglobus* at least has a peptidoglycan wall ([Planctomycetota](https://en.wikipedia.org/wiki/Planctomycetota); *Uabimicrobium*'s wall **†**), so they show the machinery can exist in walled cells; wall loss is Codon's route to it (**RN**). The only wall-less uptake precedent is small cargo (plasmid DNA, dextran, 150-nm lipid nanoparticles) taken in by L-forms of the actinomycete *Kitasatospora*, not *E. coli* (Kapteijn 2022, above). Dissect is **INV** | Digestion is slow and loud; prey with R bodies ruptures your vacuole; a hostage eats your food and may escape |
| **Live it** (trigger unlocks) | A node *appears* after you live the condition: hold 60 s on fermentation alone, survive pH 4, cross a toxin band, ride out a rain dilution. Progress bars and hints ship **from day one** | Factorio 2.0's trigger technologies ([FFF #376](https://direct.factorio.com/blog/post/fff-376)), validated in this genre by Thrive 0.6.5 ([devblog 40](https://revolutionarygamesstudio.com/devblog-40-unlocking-potential/)) | **Each environment yields once** — no Kerbal-style biome farming |
| **Knowledge gate** | Observing a mechanism reveals its counter. Watch a phage clade adsorb to a porin and the porin-variant stars appear | Outer Wilds' model, made biological | None. This is the reward for looking |
| **Potentiation** | Some stars are *latent*: visible, greyed, with the honest hint "something earlier is missing" (the "potentiated by" column of §3.7). After death the codex may say you were one mutation away | The real citrate chain: potentiating mutations around generation 20,000, innovation around 31,000, then refinement ([Blount 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2430337), [2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3461117)) | None — and it is the single strongest replay driver in the design |
| **Syntrophy contract** | Feed a partner species and receive one of its genes, plus metabolisms you can never own alone | Hydrogen syntrophy ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum)) | Slow; the partner must survive |

**Fail-forward rule:** if a draft would offer nothing you can use, it offers the **Blob** — a crude but viable mutation (more membrane, cruder division). No run ever dead-ends. (Digimon's Numemon, honestly.)

### 3.4 Transcription and translation *are* the interface
This is the hook, so it is the interaction, not a cutscene.

1. **Select.** A gene on the Atlas or a cassette in the Array. The DNA ring is the menu; the camera is already inside the nucleoid.
2. **Transcription.** RNA polymerase docks visibly at the promoter and runs. Promoter strength is *how many polymerases queue* — a strong promoter looks like traffic. In the Array, the polymerase literally meets the cassettes in order and loses steam.
3. **Translation.** mRNA spools into the cytoplasm; the prototype's magenta ribosomes latch on and form a polysome. **Here is the cost:** those ribosomes are not available for anything else, and the proteome ring shifts. The budget, felt.
4. **Placement.** The folded protein migrates and installs where you put it: a membrane raft, a pole, free in the cytoplasm. Instanced complexes already exist, so this is a count and a position.
5. **Effect.** The cell behaves differently, visibly, immediately. No pop-in.
6. **Decay.** Proteins dilute and degrade; each division halves the stock unless you keep expressing. Keeping a capability means keeping paying. Turning one off *fast* needs degradation tags you had to evolve.

**Four budgets replace a points budget:**

| Budget | Limits | Real basis |
|---|---|---|
| **Proteome share** | Ribosome capacity, drawn as notches on the vitals ring. Going over is allowed — the **overcharm** — and costs division speed on the real burden curve | ~3% relative growth per 1% of proteome as unneeded protein ([Bienick 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4186888/)); ribosome/metabolic allocation ([Scott 2010 via Physics Today](https://physicstoday.aip.org/news/cell-growth-gene-expression-and-their-interdependence)) |
| **Membrane area** | Every surface protein claims area. A bigger body has more area and more osmotic exposure | Form equals function |
| **Genome length** | Every gene adds replication time, so **deletion is a legitimate move** | Real genome streamlining; the Black Queen trap makes it dangerous |
| **Exposure** | Everything on your surface can be read by phages, plants, predators and rivals | Express versus Expose |

**The emergency release** is the stringent response: under starvation the cell throttles ribosome building and pauses the cycle ([Stringent response](https://en.wikipedia.org/wiki/Stringent_response)). Mechanically, a panic button that converts future growth into present survival.

**No flat "100 mutation points per generation."** Thrive players call that frustrating in their own *positive* reviews. Cost is always protein mass, ATP, membrane area, replication time or proteome share, shown in the units the player is already watching.

### 3.5 Regulation ships shallow, on purpose
This layer is where the design risks Oxygen Not Included's documented new-player overload. So the main game ships **two tiers only**:

- **Presets** (always): every cassette arrives with a sensible condition attached — "express when hungry", "express under stress", "express in light". Zero wiring, and it is *real* — the cheapest sensor in biology is a riboswitch, which costs no protein at all ([Riboswitch](https://en.wikipedia.org/wiki/Riboswitch)).
- **Patch** (mid-game): drag one sensor to one program. One cable, one consequence. Two-component rewiring is real: mutating a handful of interface residues switched partner specificity ([Skerker et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2453690)). Similar pairs cross-talk and misfire.
- **Sigma stances** (hotkeys, not wiring): Growth / Stress / Heat / Starvation, competing for one finite polymerase pool, so entering Stress visibly silences part of Growth. The real general stress factor governs roughly 10% of the genome ([review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10966952)).

**Cut from the main game:** the full Program tier — toggle switches, repressilator clocks, feed-forward filters, the logic curriculum. It becomes an **optional Regulation Lab** after the slice (§6.3), with Opus Magnum-style histograms (base pairs, response time, growth burden) and circuits that install into runs. Honesty note we display there: the lac operon's real input function is **graded**, not a clean Boolean gate ([Setty et al. 2003](https://pmc.ncbi.nlm.nih.gov/articles/PMC164651)), so our gates are badged **RX** — and the graded reality is the Lab's advanced difficulty.

### 3.6 Keywords: synergy through shared currencies
Balatro's rule, adopted verbatim: effects synergise with **general keywords and currencies, never with specific named partners**, because a named partner is "frustratingly rare" in a large pool ([LocalThunk](https://www.reddit.com/r/balatro/comments/1czo9g0/guidelines_for_joker_design/)). Each card is one effect plus at most one condition, three lines or fewer, power gated behind the condition.

Codon's keywords are not invented tags. They are the cell's real shared currencies, which is *why* synergy here is truthful:

**H⁺ (proton-motive force) · ATP · NADH/redox · O₂ · membrane area · surface-to-volume · surface charge · exposure (readable surface proteins) · iron · osmolarity · pH · temperature · proteome share · ribosome capacity · cassette position · signal · extracellular DNA · kin tag · light**

So a card reading *"anything powered by the proton gradient gains while H⁺ is high"* automatically couples flagella, transporters, efflux pumps and ATP synthase, with no bespoke pairing and no wiki. A card reading *"membrane proteins cost less proteome"* automatically rewards envelope builds. The coupling is the biology.

**Threshold rings** (3 / 5 / 7 cards sharing a currency) fill visibly around the vitals ring — but **every threshold effect must follow from the currency itself**. The arbitrary ones are cut ("every third Burst is free", "glow blinds grazers", "rain gives a speed buff", "panic roll refreshes cooldowns"). Replacements:

| Currency | 3 | 5 | 7 |
|---|---|---|---|
| **H⁺** | Higher sustainable gradient: the glow holds brighter, so Burst drains it more slowly | Reverse ATP synthase: you may burn ATP to hold the gradient when it collapses (**R**) | Pumps saturate later: top speed no longer falls as the pool empties |
| **ATP** | Installs cost less ATP | Overflow ATP banks as polyphosphate granules instead of being wasted (**R**) | Granules discharge fast enough to install instantly |
| **Membrane** | Envelop reach grows with area | Two Envelops can be open at once | Blebbing division comes earlier, so drafts come faster |
| **Proteome** | One more ribosome lane (parallel install) | The overexpression penalty curve flattens | Operon co-expression costs one share, not several |
| **Redox** | Anoxic damage halved | Electrons can be dumped outside the cell (nanowire route opens) | Cable chains with kin carry current across the oxygen boundary |
| **Exposure** | The Red Queen ledger is shown in full, naming what is adapting to what | Surface remodelling costs half | Phase variation runs free: your surface signature flips each division |
| **DNA** | +1 choice when Reading | You may Read *and* Eat the same thread | Every kill you cause drops readable eDNA |
| **Signal** | Clones follow from further away | The quorum threshold drops as your colony's density rises | Chorus abilities chain into each other |
| **Light** | Shade costs you nothing | Sphere focus sharpens (the microlens spot reads cleaner) | Pigment screen: UV in open sun and in a bead's focus stops hurting |
| **Iron** | Your chelate cannot be pirated | Chelate-mimicking toxins reach twice as far | Iron-costed structures (magnetosomes, cytochromes) cost none |
| **Osmolarity** | Valves vent without losing your metabolite pool | Compatible solutes hold through a full evaporation phase | A dilution event becomes survivable without valves at all |
### 3.7 The node catalogue — 148 nodes

This is not a menu to be trimmed later: **148 nodes is the 1.0 target** (about 150 cards, under a hard cap of 250 Atlas stars that leaves room for the "next summer" updates — Balatro's scale rather than Isaac's 700+, whose own creator calls the descriptionless pool his game's "biggest flaw", [GamesRadar](https://www.gamesradar.com/the-creator-of-one-of-the-most-popular-roguelikes-of-all-time-is-using-his-new-project-to-right-11-year-old-wrongs)). The **★** nodes — 44 of them — are the vertical slice (§8.3). "(start)" marks genes the hero begins with. Numbers are stable: group M was added as #139–147 so that every earlier reference still holds, and Polar Anchor, added in a later review, sits in group B as #148 for the same reason.

**Shipping rule, enforced at review:** every node changes a verb, a form, a sense, a placement or a rule. No node is a bare "+x%". Nodes that failed this rule in the proposals were cut or redesigned, and the redesigns are noted.

**Badge and date stamp.** The *Badge* column carries the designer code; §0 maps it to the badge the player sees. The *Date stamp* column carries story §3.5's stamp for the real thing (§0): a real date, *age unknown*, or no date (*not taken* for RN, *invented* for INV).

**The graph.** Three columns make the catalogue buildable as the Atlas (§3.1), the division draft and potentiation (§3.3). A node's **sector** is its group letter.
- **Homology neighbour(s)** — stars one duplication-and-divergence or point-mutation step away, on the same protein family or the same machine. Edges run both ways. A draft reaches a *new* star only along these (§3.2); "—" means no neighbour on the Atlas.
- **Potentiated by** — the history a *latent* star needs before it un-greys: something the lineage must hold or have expressed earlier. "—" means it is visible as soon as it is rumoured.
- **Reachable by** — **start**; **draft** (a mutation: it wakes or retunes a gene the hero's family already carries, which is what an **R** badge means, or steps one homology edge to a neighbouring star); **theft** (any gene-transfer route: Read, conjugation, transduction, or Dissect after an engulf); **engulf** (needs a captive kept alive); **trigger** (live the condition, or a knowledge gate); **union** (§3.9). An **R+** or **RN** node with no draft route can only be stolen or earned, never mutated into.

#### A. Membrane and envelope (14)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 1 ★ | **Naked Jelly** (start) | No wall: forms, Envelop, squeezing, immunity to wall-targeting attacks. Bursts in sudden dilution | R | today, within hours (L-form switching) | L-forms are "spheres or spheroids" grown in isotonic medium, which "prevents cell lysis by osmotic shock" ([L-form](https://en.wikipedia.org/wiki/L-form_bacteria)) | #2 Excess Membrane, #14 Rebuild the Wall, #148 Polar Anchor | — | start |
| 2 ★ | **Excess Membrane Synthesis** *(keystone)* | Pump membrane faster than volume and the body blebs: division without a septum, more area, more Envelop reach. Osmotic fragility rises with size | R | today (L-forms) | [Mercier et al. 2013/2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4244569) | #1 Naked Jelly, #12 Vesicle Decoys, #13 Tubulation, #101 Blebbing | #1 | draft, trigger |
| 3 ★ | **MscL / MscS Safety Valves** | Survive a dilution shock by venting — you lose your metabolite pool doing it, as a plume predators can smell | R | age unknown | "MscL being the last chance of survival during osmotic shock"; cells missing both "were lysed after exposure to osmotic downshocks" ([Mechanosensitive channels](https://en.wikipedia.org/wiki/Mechanosensitive_channels)) | #51 Mechanosense | — | draft, trigger (a dilution) |
| 4 | **Compatible-Solute Pumps** | Hold osmolytes and the drying phase stops hurting; costs carbon continuously, so you grow slower while stocked | R | age unknown | Textbook † | #88 ABC Suite, #122 Trehalose Glass | — | draft, trigger (the midmorning salt) |
| 5 | **Hopanoid Stiffener** | Stiffer, less permeable envelope: acid and heat tolerance. Form changes slow by half; uptake slows | R+ | age unknown | [Hopanoids](https://en.wikipedia.org/wiki/Hopanoids) | #6 Homeoviscous Tuning | — | theft |
| 6 | **Homeoviscous Tuning** | Retune fatty-acid saturation: no cold-dawn or hot-midmorning penalty, but you must switch as the morning warms | R | age unknown | [Homeoviscous adaptation](https://en.wikipedia.org/wiki/Homeoviscous_adaptation) | #5 Hopanoid Stiffener, #7 Cardiolipin Poles | — | draft, trigger (a cold dawn) |
| 7 | **Cardiolipin Poles** | Concentrate respiratory complexes at one pole: more H⁺ where you built it, and a fragile end that takes extra damage | RX | age unknown | Real pole localisation, exaggerated † | #6 Homeoviscous Tuning, #29 Respiration Chain | #29 | draft |
| 8 | **Porin Density** | More uptake, more toxin and phage entry. The cleanest two-sided node in the game | R | age unknown | Porin trade-off, textbook | #9 Maltose Gate, #62 Receptor Remix | — | draft |
| 9 ★ | **The Maltose Gate** | A porin that doubles sugar intake *and* is the door one phage clade uses | R | age unknown | LamB is both the maltose porin and the lambda receptor ([review](https://www.imrpress.com/journal/fbl/8/6/10.2741/1046)) | #8 Porin Density, #62 Receptor Remix | — | draft |
| 10 | **O-Antigen Remodel** | Change your surface signature: every learned targeting against you resets, phage and kin-recognition alike. The counter to the world's adaptation engine | R | age unknown | Surface variation, textbook † | #11 Capsule Cloak, #63 Phase Variation, #66 Surface Charge | — | draft, theft |
| 11 | **Capsule Cloak** | Blocks phage adsorption and grazer recognition; slows all your own uptake and shortens Envelop reach; expensive in sugar | R | age unknown | Capsule, textbook | #10 O-Antigen Remodel, #123 Cyst Coat, #127 Biofilm Matrix | — | draft, theft |
| 12 | **Vesicle Decoys** | Secrete: shed bubbles studded with your own receptors; phages and tailocins hit them first. Costs membrane | R | age unknown | Vesicles bound T4 "fast, irreversibly" and raised survival against antimicrobial peptides ([Manning & Kuehn 2011](https://pmc.ncbi.nlm.nih.gov/articles/PMC3248377/)) | #2 Excess Membrane | — | draft |
| 13 | **Tubulation** | Stretch a long thin tube and pass a gap nothing round can pass. Slow, fragile, and you cannot fight in it | R | age unknown | Wall-less deformation; the Tendril form's gate | #2 Excess Membrane, #27 Shape Program, #131 Proto-Nucleus | #1 | draft |
| 14 ★ | **Rebuild the Wall** *(keystone)* | Rigidity, osmotic safety, +20% swim (the motors' brace returns and #15's cheat card retires, §2.1), locked to Rod. **Loses forms, Envelop, squeezing and bleb division.** Reversible over one division, at a cost | R | after LUCA; age unknown | Unstable L-forms revert by regrowing a wall ([L-form](https://en.wikipedia.org/wiki/L-form_bacteria)); patient *E. coli* switch both ways, in urine and in zebrafish larvae ([Mickiewicz et al. 2019](https://doi.org/10.1038/s41467-019-12359-3)) | #1 Naked Jelly, #147 MreB Track, #148 Polar Anchor | #147 | draft, trigger |

#### B. Movement (14)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 15 ★ | **Flagellar Bundle** (start) | Run and tumble, powered by H⁺. While you are naked the motor is the cheat of §2.1: it works, a little below a braced motor's top speed, and its honesty card reads *"A wall-less cell's stators have little to brace against; we let them grip anyway."* Motor Count, Stator Load, the Sodium Motor and Reverse-and-Flick (#16–19) inherit the cheat; Rebuild the Wall (#14) or Polar Anchor (#148) retires it | RX (R once walled or anchored) **†** | age unknown | The prototype. The stator is "anchored like a gear wheel to the cell wall" ([Flagellum](https://en.wikipedia.org/wiki/Flagellum)); MotB's OmpA-like domain "probably functions to anchor the complex to the cell wall" ([UniProt MotB](https://rest.uniprot.org/uniprotkb/P0AF06.txt)) | #16 Motor Count, #64 Silent Flagellin, #136 Harpoon, export apparatus → Injectisome (§3.9) | — | start |
| 16 ★ | **Motor Count and Placement** | More motors, and you choose the poles: polar is a tight turning radius, lateral is thrust you can steer. Each motor is proteome and **exposed flagellin** | R | age unknown | Real motor number and placement | #15 Flagellar Bundle, #17 Stator Load, #19 Reverse-and-Flick | #15 | draft |
| 17 | **Stator Load** *(redesigned from a flat +30%)* | Swap stators for torque over speed: you keep moving through biofilm matrix, gel and crowds where others stall, and give up top speed in open water | R+ | age unknown | High-load stator variants † | #16 Motor Count, #18 Sodium Motor | #15 | theft |
| 18 | **Sodium-Driven Motor** | Runs on a sodium gradient, so you can still swim when the proton gradient collapses — and it gets *better* as the drop evaporates | R+ | age unknown | Sodium-driven motors in *Vibrio* † | #17 Stator Load | #17 | theft |
| 19 | **Reverse-and-Flick** | Tumble becomes an aimed ~90° turn instead of a random one, for less H⁺ | R+ | age unknown | Flagellar flick † | #16 Motor Count | #16 | theft |
| 20 ★ | **Methylation Gain Control** | Sensory memory from ~4 s to ~8 s: follow fainter gradients, react more slowly to sharp ones. The best skill upgrade in the game | R | age unknown | Receptor methylation adaptation ([Chemotaxis](https://en.wikipedia.org/wiki/Chemotaxis)) | #45 Chemoreceptor Array, #47 Array Cooperativity | #45 | draft |
| 21 | **Type IV Pili Grapple** | Hook a surface, debris or prey and reel. Enormous force for the scale; slow; lets you drag a catch somewhere safe | R | age unknown | Pilus retraction near 110 pN ([Maier](https://experts.arizona.edu/en/publications/single-pilus-motor-forces-exceed-100-pn/)) | #130 Hitchhike Grip, #136 Harpoon | — | draft, theft |
| 22 | **Gliding** | Surface movement with no flagellum, so nothing listening for flagellin hears you coming. Real at 2.0–4.5 µm/s on solid surfaces, and paid in ATP, not H⁺, so it keeps going while the glow is low. One of the two honest wall-less roads (§2.1) | RN (stealth consequence RX) | not taken (*Mycoplasma mobile*) | [*Mycoplasma mobile*](https://en.wikipedia.org/wiki/Mycoplasma_mobile) — itself wall-less ("its cells lack a peptidoglycan layer"); its legs run on "energy obtained from ATP hydrolysis" | — | — | theft (RX) |
| 23 | **Kink-Propagation Swimming** | A wall-less helical body that swims by running kinks along itself, with no flagellum at all; works in thick matrix where flagella stall. The other honest wall-less road (§2.1), and the only one that swims in open water | RN | not taken (*Spiroplasma*) | [*Spiroplasma*](https://en.wikipedia.org/wiki/Spiroplasma), also wall-less: "helical bacteria that lack a peptidoglycan layer", whose kinks "travel down along the cell axis"; they "swim up to 5 μm/s in viscous media" ([Sasajima & Miyata 2021](https://www.frontiersin.org/articles/10.3389/fmicb.2021.706426/full)) | #27 Shape Program | #1 | theft (RX) |
| 24 | **Gas Vesicles** | Hold any depth at no thrust cost. A pressure shock (a raindrop) pops them | R+ | age unknown | [Gas vesicle](https://en.wikipedia.org/wiki/Gas_vesicle) | — | — | theft |
| 25 | **Magnetosome Chain** | A bead-chain compass: the 3D hunt for anoxia collapses to a 1D dive to the floor, where crowds open their pockets first (§4.1); a pocket inside a mid-water clump it cannot point to. Costs iron, which is the drop's true scarcity | R+ | age unknown | ~30 magnetosome genes transferred into another bacterium made it magnetic ([Kolinko et al. 2014](https://pubmed.ncbi.nlm.nih.gov/24561353/)) | — | — | theft |
| 26 | **Swarm Slick** *(redesigned from a flat +25%)* | Secrete surfactant and the colony spreads as a film across surfaces you otherwise cannot cross — including out of the drop onto wet leaf. Everyone nearby can use the road you built, rivals included. In pinned drops the same surfactant powers **Marangoni Surf** at the Rim (§2.4, **RX**) | R+ | age unknown | Swarming on surfactant † | #76 NRPS | — | theft |
| 27 ★ | **Shape Program** (forms) | Rod / Sphere / Sheet / Tendril: drag, surface-to-volume, osmotic exposure and Envelop reach all move together | RX | age unknown | §2.1; surface-to-volume is real, the switching speed is ours | #13 Tubulation, #23 Kink Swimming, #147 MreB Track | #1 | draft, trigger |
| 148 | **Polar Anchor** *(added in review)* | Keep a scrap of wall at each pole for the stators to brace on. #15's cheat card retires and the motors run at a braced motor's full speed, with Stator Load (#17) at full torque. The price: the poles go rigid, so the body bends only between them; Tendril and Sheet lose reach at the ends, Envelop cannot close over a pole, motors can sit only at the poles (lateral placement, #16, closes), and wall-targeting attacks find you again, at the poles only. The half-step between Naked Jelly (#1) and Rebuild the Wall (#14) | INV (wall and anchoring R) | invented | The stator's OmpA-like domain "probably functions to anchor the complex to the cell wall" ([UniProt MotB](https://rest.uniprot.org/uniprotkb/P0AF06.txt)). A real cell keeps only a scrap of wall: pathogenic *Chlamydia* "do not assemble their peptidoglycan (PG) cell wall in a classical, mesh-like sacculus, but instead apparently confine it to the mid-cell", a ring "≤ 140 nm wide" ([Liechti et al. 2016](https://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1005590)). Theirs rings the middle for division; a scrap at the poles for motors is ours | #1 Naked Jelly, #14 Rebuild the Wall | #15 | draft (it wakes the wall genes #14 uses) |

#### C. Energy and metabolism (17)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 28 ★ | **PTS Uptake + Glycolysis** (start) | The visible sugar route the prototype already draws | R | LUCA (glycolysis; the PTS: age unknown) | The brief | #30 ED Shunt | — | start |
| 29 ★ | **Respiration Chain** (start) | NADH → complex I / cytochrome *bo₃* pumping H⁺ → ATP synthase. Your health bar is this glow | R | LUCA (the H⁺ gradient; the chain: age unknown) | The brief | #7 Cardiolipin Poles, #34 Low-O₂ Oxidase, #35 Nitrate Respiration, #141 ATP Synthase Gear | — | start |
| 30 ★ | **Glycolysis Variant Switch (ED shunt)** | Half the ATP per glucose, several-fold less enzyme: a pure proteome-versus-yield decision | R | age unknown | [Flamholz et al. 2013](https://pmc.ncbi.nlm.nih.gov/articles/PMC3683749) | #28 PTS + Glycolysis | #28 | draft |
| 31 ★ | **Mixed-Acid Fermentation** (start) | Survive anoxia at low ATP; you acidify your own neighbourhood, which hurts you and your acid-sensitive rivals | R | age unknown | The brief | #32 Overflow Metabolism | — | start |
| 32 ★ | **Overflow Metabolism** | Grow fast when sugar is rich and leak acetate. **Your leak is a scent trail** chemotactic predators climb | R | age unknown | [Overflow metabolism](https://en.wikipedia.org/wiki/Overflow_metabolism) | #31 Mixed-Acid Fermentation, #33 Acetate Scavenging | #28 | draft, trigger (a sugar-rich drop) |
| 33 | **Acetate Scavenging** | Eat waste — yours and everyone's. Slow, clean, and invisible to anything hunting plumes | R | age unknown | Glyoxylate shunt, textbook | #32 Overflow Metabolism | #32 | draft |
| 34 | **Low-O₂ Oxidase** | Keep respiring beneath a crowd and in the packed Rim, where the efficient oxidase stalls | R | age unknown | Cytochrome *bd*, textbook | #29 Respiration Chain, #35 Nitrate Respiration | #29 | draft, trigger (a low-O₂ pocket, §4.1) |
| 35 | **Nitrate Respiration** | Breathe something other than oxygen inside an anoxic pocket | R | age unknown | Textbook | #29 Respiration Chain, #34 Low-O₂ Oxidase | #29 | draft, trigger |
| 36 | **Reverse Synthase** | When H⁺ hits zero, burn ATP to refill it: you never fully stall, and you burn your reserve doing it | R | pre-LUCA (ATP synthase) | ATP synthase reversal, textbook | #82 Digestive Vacuole, #141 ATP Synthase Gear | #29 | draft |
| 37 | **Proteorhodopsin** | One gene plus a cofactor: light becomes a proton pump and the cell blushes faintly purple. No carbon fixation | R+ | age unknown | Cells given it swim faster under green light when respiration is blocked ([Walter et al. 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC1838496)); [Béjà 2000](https://hahana.soest.hawaii.edu/cmoreserver/summercourse/2014/documents/DeLong_2/beja_sci_rhodop.pdf) | — | — | theft |
| 38 | **Reaction Centre** *(megaproject, multi-minute)* | Real photosynthetic power — and the oxygen exhaust poisons your own nitrogenase and your anaerobic neighbours | R+ | ≥2.43 Ga (the Great Oxidation Event), probably ≥2.7 Ga | [GOE](https://en.wikipedia.org/wiki/Great_Oxidation_Event), [Heterocyst](https://en.wikipedia.org/wiki/Heterocyst) | — | #37 | theft, engulf (keep a phototroph) |
| 39 | **Carboxysome** | A protein shell concentrating CO₂ around the fixing enzyme. A real bacterial organelle, and gorgeous in a raymarcher | R+ | age unknown | [Bacterial microcompartment](https://en.wikipedia.org/wiki/Bacterial_microcompartment) | — | #38 | theft, union |
| 40 | **Encapsulin Compartment** | A 24–42 nm icosahedral protein shell: iron store and peroxide sink | R+ | age unknown | [Encapsulin](https://en.wikipedia.org/wiki/Encapsulin) | #137 Seed Pod | — | theft, union |
| 41 | **Sulfur Oxidation + Globules** | Eat sulfide at the edge of an anoxic pocket; store pearly sulfur as a visible battery | R+ | age unknown | [Beggiatoa](https://en.wikipedia.org/wiki/Beggiatoa) | — | #49 | theft |
| 42 | **Nanowire** | Dump electrons onto mineral grains: respire with no oxygen at all, and link to kin | R+ | age unknown | [Geobacter](https://en.wikipedia.org/wiki/Geobacter) | — | Redox ×5 (§3.6) | theft |
| 43 | **Storage Granules** (glycogen start, polyphosphate later) | A battery that costs mass and drag. Already rendered (`MAX_GRANULES`) | R | age unknown | The prototype | — | — | start (glycogen), draft (polyphosphate) |
| 44 | **Methanol Oxidation** | Eat the methanol leaves release — the leaf's own private food, and the diet of the pink bacteria that really live there | R+ | age unknown | [*Methylobacterium*](https://en.wikipedia.org/wiki/Methylobacterium) | — | — | theft |

#### D. Senses (12) — each sense draws a new layer of the drop

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 45 ★ | **Chemoreceptor Array** (start) | The "better or worse than ~4 s ago" sense; plumes within range become visible | R | age unknown | The prototype's receptor lattice; [Chemotaxis](https://en.wikipedia.org/wiki/Chemotaxis) | #20 Methylation Gain, #46 New Noses, #47 Array Cooperativity, #52 Thermosense | — | start |
| 46 ★ | **New Noses** (receptor types) | Each receptor type you own draws one more plume layer: amino acids, sugars, dipeptides, nitrate. **No receptor, no plume** | R | age unknown | Receptor repertoire, textbook | #45 Chemoreceptor Array, #48 Repellent Receptors, #49 Redox Sense, #50 pH Sense | #45 | draft, theft |
| 47 | **Array Cooperativity** | Detect vanishingly shallow gradients; the lattice visibly densifies | R | age unknown | Cooperative receptor arrays † | #20 Methylation Gain, #45 Chemoreceptor Array | #20 | draft |
| 48 | **Repellent Receptors** | Toxins, acids and lysis debris read as *danger* instead of food | R | age unknown | Repellent chemotaxis, textbook | #46 New Noses | #46 | draft |
| 49 ★ | **Redox / Oxygen Sense** | The oxic–anoxic boundary shimmers into view — which is where the best energy lives. It forms around crowds, not at a fixed depth (§4.1) | R | age unknown | Aerotaxis, textbook | #46 New Noses | #45 | draft, trigger |
| 50 | **pH Sense** | Other cells' fermentation becomes a map of who is where | R | age unknown | Textbook | #46 New Noses | #45 | draft |
| 51 | **Mechanosense** | Feel flow and your own turgor: the early warning for an osmotic event, and the trigger for settling | R | age unknown | Textbook † | #3 Safety Valves | — | draft |
| 52 | **Thermosense** | The lens hot spot's shimmer arrives ~2 s earlier | RX | age unknown | Chemoreceptors also sense temperature † | #45 Chemoreceptor Array | #45 | draft, trigger (a lens hot spot) |
| 53 ★ | **Spherical Focus (the microlens)** | Round up and your own body focuses light to a bright spot on the far side; the cell reads the spot and swims *away from it*, which is how it ends up moving toward the source. Deform to move or eat and the image blurs | RN | not taken (*Synechocystis*) | "A high-resolution image of the light source is focused on the edge of the cell opposite to the source"; positive phototaxis "is actually triggered as a negative response to the focused spot" ([Schuergers 2016](https://elifesciences.org/articles/12620)) | #134 Ocellus | #27 (Sphere) | trigger (hold still as a Sphere in sun) |
| 54 | **Osmo-Sense** | Forecast rain or drying from drifting osmolarity, a phase ahead | R | age unknown | [Skerker et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2453690) | #93 Patch Cable | #3 | draft |
| 55 | **Phage-Chatter Receptor** | Hear the peptide infected cells release and know a bloom is coming ~10 s early | R+ (eavesdropping RX) | age unknown | [Arbitrium](https://en.wikipedia.org/wiki/Arbitrium) | #114 Peptide Channel | — | theft, trigger (witness a burst) |
| 56 | **Quorum Eavesdropping** | Read rival autoinducers: you learn their density and intent before they act | R | age unknown | Cross-species signalling ([Quorum sensing](https://en.wikipedia.org/wiki/Quorum_sensing)) | #112 Autoinducer | #112 | draft |

#### E. Defence (13)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 57 ★ | **Restriction–Modification** | Shreds foreign DNA, so most infections bounce. **It also shreds the DNA you wanted to steal.** The defining tension between Fortress and Thief | R | age unknown | [R–M systems](https://en.wikipedia.org/wiki/Restriction_modification_system) | — | — | draft, theft |
| 58 ★ | **CRISPR Array** | Learned, inherited immunity. Each phage survived adds a luminous spacer bead to the DNA thread, newest first, exactly as the real array is ordered — a readable trophy wall. Spacers lose value as phages change | R | perhaps LUCA (Debated) | [CRISPR](https://en.wikipedia.org/wiki/CRISPR); [Barrangou et al. 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC2928866) | — | — | draft, theft |
| 59 | **Retron Tripwire** | A reverse-transcriptase sentinel that blocks infection with a partner effector | R | age unknown | [Retron](https://en.wikipedia.org/wiki/Retron) | #60 Abortive Infection | — | theft |
| 60 | **Abortive Infection** | An infected cell kills itself to save the colony. Your first truly altruistic node | R | age unknown | [Toxin–antitoxin](https://en.wikipedia.org/wiki/Toxin-antitoxin_system) | #59 Retron, #61 CBASS, #108 Addiction Module | — | draft, theft |
| 61 | **Self-Destruct Sentinel (CBASS)** | Dies fast enough to stop even a shelled phage. Codex: a distant relative of your own innate immune signalling | R+ | age unknown | Cohen et al. 2019, *Nature* **†** — unopened, confirm before shipping | #60 Abortive Infection | #60 | theft |
| 62 ★ | **Receptor Remix** | Mutate or drop the receptor a phage clade uses. Immunity bought with uptake | R | age unknown | Receptor loss, textbook; pairs with node 9 | #8 Porin Density, #9 Maltose Gate | #8 or #9 (a phage used it) | draft, trigger (watch a phage adsorb) |
| 63 | **Phase Variation Switch** | A recombinase inverts a promoter and your surface protein flips stochastically between two forms, so antibodies, predator receptors and tail fibres lose their lock | R | age unknown | [Phase variation](https://en.wikipedia.org/wiki/Phase_variation) | #10 O-Antigen Remodel, #135 Hypervariable Turret | — | draft, theft |
| 64 | **Silent Flagellin** | Alter the conserved part the plant detects and the stoma stays open. A phase flip alone does not hide you from the plant | R+ † | age unknown | [Melotto et al. 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/) | #15 Flagellar Bundle | #15 | draft (from #15), trigger (meet The Gate) |
| 65 | **Efflux Pumps** | Expel toxins; a permanent H⁺ drain, so your top speed drops while they run | R | age unknown | Efflux, textbook (kept illustrative) | #88 ABC Suite | — | draft |
| 66 | **Surface Charge Tuning** | Blunts cationic antimicrobial peptides; changes which surfaces you stick to | R | age unknown | Textbook † | #10 O-Antigen Remodel | — | draft |
| 67 | **Damage Response (SOS)** | Repair, hypermutate briefly, stop dividing: the comeback button — which may wake your prophage, and which raises integrase so you can reorder the Array mid-crisis | R | age unknown | [SOS response](https://en.wikipedia.org/wiki/SOS_response); [Integron](https://en.wikipedia.org/wiki/Integron) | #105 Filament Hold | — | draft, trigger (a first UV hit) |
| 68 | **Multiple Genome Copies** | Reassemble a shattered genome after a radiation hit; costs replication time always. A cell-cycle state, not a gene: earned by living it, never stolen | RN | not taken (*Deinococcus*) | [Deinococcus](https://www.scientificamerican.com/article/cheating-dna-death-how-an/) | #111 Polyploid Vault, #125 Shatter Repair | #106 | trigger |
| 69 | **Catalase / Superoxide Dismutase** | Survive peroxide — a plant's oxidative burst, and your own respiration's by-products | R | age unknown | Textbook | — | — | draft, trigger (an oxidative burst) |

#### F. Offence (9)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 70 | **Colicin + Immunity** | A ranged toxin that kills sensitive strains of your own kind. The real three-way cycle (producer beats sensitive, resistant beats producer, sensitive beats resistant) **only coexists when interactions stay local** — so the drop's mixing decides whether it works. Release kills the producing cell, and production is stress-controlled | R | age unknown | [Kerr et al. 2002, *Nature*](https://www.nature.com/articles/nature00823.pdf); [Colicin](https://en.wikipedia.org/wiki/Colicin) | #77 Chelate-Mimic | — | theft |
| 71 ★ | **Type VI Spear** | A contractile phage-tail-like spear injecting toxin on contact; matched immunity makes it kin-safe | R+ | age unknown | [T6SS](https://en.wikipedia.org/wiki/Type_VI_secretion_system) | #73 Tailocin, phage tails | — | theft |
| 72 | **Contact-Dependent Inhibition** | A filament touches a neighbour and delivers a toxin tip. The matching immunity gene **is your family's ID card**, so your family tree becomes a dog tag | R | age unknown | [CDI](https://en.wikipedia.org/wiki/Contact-dependent_growth_inhibition) (Aoki et al. 2005) | #116 Kin Discrimination | — | theft |
| 73 | **Tailocin Launcher** | A domesticated phage tail with no head: punctures a target and collapses its proton gradient | R+ | age unknown | R-type pyocins "lack the DNA-containing capsid head" and dissipate the target's proton-motive force ([Pyocin](https://en.wikipedia.org/wiki/Pyocin)) | #71 Type VI Spear, phage tails | a captured phage | union, theft |
| 74 ★ | **Secreted Hydrolases** | Digest prey too big to swallow, outside the cell. **A public good: everyone nearby eats** | R | age unknown | Exoenzymes, textbook | #75 Tethered Hydrolases, #115 Public Goods | — | draft, theft |
| 75 ★ | **Membrane-Tethered Hydrolases** | The same digestion, smaller reach, **cheater-proof** — the exclusive partner of node 74 | R | age unknown | Public goods and cheats ([Diggle et al. 2007](https://doi.org/10.1038/nature06279)) | #74 Secreted Hydrolases | #74 | draft |
| 76 | **Assembly-Line Synthetase (NRPS)** | Modules in order make the molecule; reorder them for a different toxin, siderophore or surfactant. Nature's own ordered wand | R+ | age unknown | [NRPS](https://en.wikipedia.org/wiki/Nonribosomal_peptide) | #26 Swarm Slick | — | theft |
| 77 | **Chelate-Mimic Toxin** | Rivals starving for iron swallow your poison with their iron | R | age unknown | Microcins mimicking siderophores ([Microcin](https://en.wikipedia.org/wiki/Microcin)) | #70 Colicin | — | theft |
| 78 | **Quorum Quenching** | An enzyme that destroys a rival colony's signal so their chorus never fires | R | age unknown | [Quorum quenching](https://en.wikipedia.org/wiki/Quorum_quenching) | — | #56 | theft |

*Cut from this group: using your own prophage as a weapon ("Lysogen Volley"). Superinfection immunity is real, but phage-as-a-weapon is not established, and the node was doing nothing a tailocin does not do better.*

#### G. Feeding and digestion (10)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 79 ★ | **Protein Uptake (Sip)** | Envelop tier I: swallow free protein clumps. The first rung, and real in a *walled* bacterium with a clathrin-like coat protein; wall loss is our route to it | RN | not taken (*Gemmata*) | [Lonhienne et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973); *Gemmata* has peptidoglycan ([Planctomycetota](https://en.wikipedia.org/wiki/Planctomycetota)) | #80 Gulp | #1 | trigger (your first Envelop) |
| 80 ★ | **Particle Engulfment (Gulp)** | Tier II: debris, vesicles, phage capsids — you can eat the bloom. Uses the renderer's membrane dents | RN | not taken | A step between two real precedents | #79 Sip, #81 Swallow | #79 | draft |
| 81 ★ | **Whole-Cell Engulfment (Swallow)** | Tier III: swallow a living cell. Real in a planctomycete, "the first known bacterium that can eat other microbes by the process called phagocytosis" — a Gram-negative cell, wall status **†**, and probably **not** homologous to eukaryotic phagocytosis. The codex says both | RN | not taken (*Uabimicrobium*) | [Uabimicrobium](https://en.wikipedia.org/wiki/Uabimicrobium_amorphum) | #80 Gulp, #82 Digestive Vacuole, #85 Keep-Not-Digest, #87 Selective Engulfment | #80 | draft, trigger |
| 82 | **Digestive Vacuole** | A compartment that acidifies: digestion is faster but slow and visible, so engulfing in the open is dangerous | INV (lysosome analogue; ATP synthase reversal †) | invented | Acidified compartments in protists | #36 Reverse Synthase, #81 Swallow, #132 Contractile Vacuole | #81 | draft |
| 83 | **Read, Don't Eat** | Dissect a catch for one chosen gene instead of food | RX | today (L-form DNA uptake) | Wall-less DNA uptake in *Kitasatospora* L-forms, not *E. coli* ([Kapteijn 2022](https://doi.org/10.1038/s41467-022-33054-w)) | #84 Competence | #81 | trigger |
| 84 ★ | **Competence (Read or Eat)** | Take up free DNA; choose genes or nucleotides | R (why cells do it: H, Debated) | age unknown | [Natural competence](https://en.wikipedia.org/wiki/Natural_competence) | #83 Read, Don't Eat | — | draft, trigger |
| 85 | **Keep-Not-Digest** *(keystone)* | Hold a captive alive. Opens the domestication arc; it eats your food and may escape | RN (pacing RX) | not taken (eukaryotes, before 1.6 Ga; a bacterium in a bacterium: the mealybug's *Tremblaya*, by invasion) | Real in protists: [Paulinella](https://en.wikipedia.org/wiki/Paulinella), [Nitroplast](https://en.wikipedia.org/wiki/Nitroplast), [Hatena](https://en.wikipedia.org/wiki/Hatena_arenicola). One bacterium is known to host another, in the citrus mealybug's "nested endosymbiosis" ([*Planococcus citri*](https://en.wikipedia.org/wiki/Planococcus_citri)): the gammaproteobacterium *Moranella* "lives in the cytoplasm of the β-proteobacterium *Tremblaya princeps*" ([von Dohlen et al. 2001](https://doi.org/10.1038/35086563); [Husnik & McCutcheon 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5027413/)). That is the RN analogue, but its route was not phagocytosis: *Tremblaya* cannot make its own envelope (the authors assume the insect makes it), and the guest, from a group "very good at establishing intracellular infections in insect cells", "invaded a membrane system that was perhaps more eukaryotic than bacterial in nature". No bacterium is known to keep a partner it engulfed **†**, so Swallow-then-Keep is ours. A road not taken, as story §3.5 dates it | #81 Swallow, #133 Symbiont Socket | #81 | engulf |
| 86 | **Vacuole Resistance** | Survive being eaten: the amoeba and the ciliate stop being deaths and become levels | R+ | age unknown | Intracellular survival, textbook † | — | — | theft, trigger (survive being eaten) |
| 87 | **Selective Engulfment** | Pick prey by surface marker, so you stop swallowing things that are armed | RX | age unknown | Receptor-mediated recognition | #81 Swallow | #81 | draft |
| 88 | **ABC Transporter Suite** | Cheap scavenging of amino acids and peptides: the lazy, safe, plume-free diet | R | age unknown | Textbook | #4 Compatible Solutes, #65 Efflux Pumps | — | draft |

#### H. Gene regulation (12)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 89 ★ | **Promoter Library** | Promoter strength is visible polymerase traffic; stronger means faster install and more proteome locked | R | age unknown | Real promoter strength; [Bienick 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4186888/) | #90 Operon Adjacency, #92 Operator + Repressor, #100 Noise Tuning | — | draft |
| 90 ★ | **Operon Adjacency** | Genes placed next to each other share one promoter and switch on together — one condition, one share, one hand | R | age unknown | Real operon structure | #89 Promoter Library | — | draft |
| 91 ★ | **Riboswitch Lock** | The cheapest sensor in the game: one metabolite folds the mRNA shut. **Costs no protein at all** | R | age unknown | [Riboswitch](https://en.wikipedia.org/wiki/Riboswitch) | #96 sRNA Silencer | — | draft, theft |
| 92 | **Operator + Repressor (preset)** | "Express when the food is there and glucose is not." The codex notes the real response is graded, not a clean gate | RX | age unknown | [Setty et al. 2003](https://pmc.ncbi.nlm.nih.gov/articles/PMC164651) | #89 Promoter Library, #93 Patch Cable | #89 | draft |
| 93 | **Two-Component Patch Cable** | Wire any sensor to any program. Too-similar pairs cross-talk and misfire | R | age unknown | [Skerker et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2453690) | #54 Osmo-Sense, #92 Operator + Repressor | #92 | draft |
| 94 | **Sigma Stances** | Growth / Stress / Heat / Starvation share one finite polymerase pool, so entering one visibly silences part of another | R | age unknown | [RpoS review](https://pmc.ncbi.nlm.nih.gov/articles/PMC10966952) | #142 Polymerase Armour | — | trigger (a first stress) |
| 95 | **Stringent Brake** | Convert your ribosome investment into survival; replication pauses, so no drafts while it runs | R | age unknown | [Stringent response](https://en.wikipedia.org/wiki/Stringent_response) | #140 Hibernation | — | trigger (a first starvation) |
| 96 | **Small-RNA Silencer** | Mute one gene's translation at once instead of waiting for dilution | R | age unknown | Small regulatory RNAs † | #91 Riboswitch | — | draft |
| 97 | **Degradation Tags** | Switch a protein *off* in seconds. Unglamorous and transformative | R | age unknown | Targeted proteolysis, textbook | — | — | draft |
| 98 ★ | **Integrase Reshuffle** | Reorder the Array. Stress raises integrase, so chaos is also opportunity | R | age unknown | [Integron](https://en.wikipedia.org/wiki/Integron) | — | — | trigger (the first stress raises integrase) |
| 99 | **Mutation Dial** | Mutator: one extra draft option and a constant deleterious load. Proofreader: fewer, safer | R | today (LTEE mutators) | 6 of 12 long-term populations became mutators ([LTEE](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment)) | — | — | draft |
| 100 | **Noise Tuning** | Bursty or steady expression: hedge at the level of individual daughters, adding a fourth "wild" draft card | R | age unknown | Pre-existing, drug-independent switching ([Balaban et al. 2004](https://perso.crans.org/frenoy/compbiol/articles/Balaban2004.pdf)) | #89 Promoter Library, #121 Persister Switch | #89 | draft |

#### I. Reproduction (11)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 101 ★ | **Blebbing Division** (start) *(keystone)* | No septum, no ring: overgrow membrane and **sculpt where it pinches**, which sets daughter sizes. Wall-free cells really divide by extruding protrusions that pinch off, with highly variable daughter sizes | R (player control INV) | today (L-forms); the first cells: Hypothesis | [L-form](https://en.wikipedia.org/wiki/L-form_bacteria): "the extension of thin protrusions… pinching off to form new cells", giving "a variety of cell sizes, from very tiny to very big" | #2 Excess Membrane, #103 Asymmetric Division, #104 Brood, #109 Don't-Let-Go, #146 FtsZ Ring | — | start |
| 102 | **Septation (walled only)** | Neat, fast, predictable halves — and only two of them | R | after LUCA; age unknown | Textbook | #146 FtsZ Ring | #14, #146 | draft |
| 103 ★ | **Asymmetric Division** | One tough daughter, one fast one; you choose which you continue as | RX | age unknown | Real asymmetry, exaggerated | #101 Blebbing, #104 Brood | #101 | draft |
| 104 | **Brood** | Four smaller daughters: a wider draft and more clones, each thinner | RX | today (L-forms) | L-form variable progeny | #101 Blebbing, #103 Asymmetric Division | #2 | draft |
| 105 | **Filament Hold** | Delay division: grow longer and stronger and bank one extra draft, at the cost of being a bigger target | R | age unknown | Division arrest under SOS ([SOS response](https://en.wikipedia.org/wiki/SOS_response)) | #67 SOS | #67 | draft, trigger |
| 106 | **Multifork Replication** | Divide faster than you can copy your genome: genes near the origin gain dosage. **This is what makes Atlas position matter** | R † | age unknown | Cooper–Helmstetter, textbook — confirm the figures (§10) | #144 Second Origin | #139 | trigger (grow fast in a rich drop) |
| 107 ★ | **Plasmid Partition** | Stop losing your relics at division — and at the exit | R | age unknown | Partition systems, textbook | — | a held plasmid | theft |
| 108 | **Addiction Module** | A cursed relic: daughters that lose the plasmid are killed by the lingering toxin. A real counter exists — a chromosomal antitoxin, with about 46% of plasmid-free cells escaping in one single-cell study | R | age unknown | Post-segregational killing ([NAR 2024](https://pmc.ncbi.nlm.nih.gov/articles/pmid/38224456)) | #60 Abortive Infection | a held plasmid | theft |
| 109 | **Don't-Let-Go** *(keystone)* | One knockout and daughters stay attached: clusters begin, and the solo-hero agility ends. The principle is real in yeast, a eukaryote; a wall-less bacterial version is ours | RX | today (yeast, by directed evolution) | The "snowflake" phenotype is "caused by the loss of a single transcription factor *Ace2*" ([Multicellular organism](https://en.wikipedia.org/wiki/Multicellular_organism)) | #101 Blebbing | #101 | draft |
| 110 | **Genome Streamlining (deletion)** | Cheaper, faster replication by dropping genes. Safe **only while a neighbour still leaks that function** — kill your leaker and your own build breaks | R | age unknown | [Black Queen](https://en.wikipedia.org/wiki/Black_Queen_hypothesis) (Morris, Lenski & Zinser 2012) | — | a leaky neighbour (§4.4) | draft |
| 111 | **Polyploid Vault** | Many genome copies: resilient to radiation and shattering, slow to change. A cell-cycle state, not a gene: earned by living it, never stolen | RN | not taken (*Epulopiscium*) | [*Epulopiscium*](https://en.wikipedia.org/wiki/Epulopiscium) carries hundreds of thousands of genome copies | #68 Genome Copies | #68 | trigger |

#### J. Communication (9)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 112 ★ | **Autoinducer + Receptor** | A positive-feedback loop that only fires above a density threshold; your signal haze becomes visible | R+ | age unknown | [Quorum sensing](https://en.wikipedia.org/wiki/Quorum_sensing) | #56 Quorum Eavesdropping, #114 Peptide Channel | — | theft |
| 113 ★ | **Chorus Abilities** | Powers that only work inside a thick enough haze: pack lysis, synchronised division, shared defence | R | age unknown | Quorum thresholds | — | #112 | trigger (reach quorum) |
| 114 | **Peptide Channel** | A private second channel rivals cannot read unless they evolve for it | R † | age unknown | Peptide signalling | #55 Phage-Chatter, #112 Autoinducer | #112 | draft, theft |
| 115 ★ | **Public-Good Secretion** | Shared enzymes, shared iron, shared matrix — and **cheaters arise inside your own clone colony**, documented in real systems | R | age unknown | [Diggle et al. 2007](https://doi.org/10.1038/nature06279) | #74 Secreted Hydrolases, #117 Cheater Policing | — | draft |
| 116 | **Kin Discrimination** | Your toxin/immunity pairs are the family password; relatives are safe, near-relatives are not | R | age unknown | [CDI](https://en.wikipedia.org/wiki/Contact-dependent_growth_inhibition) | #72 CDI | #72 | draft |
| 117 | **Cheater Policing** | Punish freeloaders in your own colony, at a cost to growth | R | age unknown | Social microbiology † | #115 Public Goods | #115 | draft, trigger |
| 118 | **Electrical Wave (K⁺)** | A biofilm heartbeat that time-shares food so the starving interior is fed, and whose pulses attract passing cells | R+ | age unknown | [Prindle et al. 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC4890463) | — | #127 | theft |
| 119 | **Gene Broadcast** | Sacrifice one cell to spray genome fragments to kin | R+ | age unknown | [Gene transfer agent](https://en.wikipedia.org/wiki/Gene_transfer_agent) | #137 Seed Pod | — | theft |
| 120 | **Chorus Light (lux)** | At quorum the colony glows: reveals the dark, feeds light builds, and is the campaign's climax beat. The genes really do work in laboratory *E. coli* | R+ | age unknown | [PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500) | — | #112 | theft only (§9.3) |

*Cut from this group: nanotube and cytoplasm bridges between cells. The finding is debated, and the node was a free resource transfer with no verb attached.*

#### K. Survival forms (10)

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 121 | **Persister Switch** | Set the fraction of daughters that go dormant **before** the catastrophe. Pre-existing and drug-independent; offspring are sensitive again | R | age unknown | [Balaban et al. 2004](https://perso.crans.org/frenoy/compbiol/articles/Balaban2004.pdf) | #100 Noise Tuning | #100 | draft, trigger |
| 122 ★ | **Trehalose Glass** | Vitrify as the drop dries: the only exit that carries **loose proteins** through. Costs your ATP store | RX | age unknown | Anhydrobiosis; bacterial trehalose † | #4 Compatible Solutes | #4 | draft, trigger (live through a drying) |
| 123 ★ | **Cyst Coat** | A lighter commitment than a spore: keeps plasmids, loses clones; roughly doubled UV resistance. A developmental program, so taking it whole by theft is our cheat | RN (theft RX) † | not taken (*Azotobacter*) | [Azotobacter](https://en.wikipedia.org/wiki/Azotobacter) | #11 Capsule Cloak | — | theft (RX), trigger |
| 124 | **Endospore** *(acquired, irreversible, multi-minute)* | Survive anything. The mother engulfs the forespore **and then dies** — about 8 hours in reality. Our lineage does not do this, and a whole developmental program under a master regulator is not one gene anyone can be handed. The game lets you steal it anyway, and the codex lists that as a cheat | RN (theft RX) | not taken (*Bacillus*) | [Riley et al. 2020](https://microbialcell.com/researcharticles/2020a-riley-microbial-cell/), [Sporulation](https://en.wikipedia.org/wiki/Sporulation_in_Bacillus_subtilis) | — | — | theft (RX: Dissect a spore-former) |
| 125 | **Shatter Repair** | Rebuild a UV-shattered genome from spare copies. It needs the copies (#68), so it is earned, not stolen | RN | not taken (*Deinococcus*) | [Deinococcus](https://www.scientificamerican.com/article/cheating-dna-death-how-an/) | #68 Genome Copies | #68 | trigger |
| 126 | **Sunscreen Pigments** | Carotenoids make open sun and a bead's UV focus survivable; you are also more visible | R+ † | age unknown | Carotenoid photoprotection | — | — | theft |
| 127 | **Biofilm Matrix** | Polysaccharide, protein and extracellular DNA with water channels; tolerance rises enormously, and you cannot swim | R | age unknown | [Biofilm](https://en.wikipedia.org/wiki/Biofilm) | #11 Capsule Cloak | #115 | draft, trigger |
| 128 | **Ice-Nucleation Protein** | Seed an ice crystal, ride an aerosol, fall as rain somewhere new. **This is the world map, post-1.0** | R+ | age unknown | [Christner et al. 2008 coverage](https://www.nationalgeographic.com/science/article/snow-making-bacteria-are-everywhere) | — | — | theft |
| 129 | **Fruiting Body** | Starve at quorum and the colony heaps itself into a fruiting body. The precedent is *Myxococcus*, a Gram-negative bacterium: "about 100,000 individual cells aggregate to form a structure called the fruiting body"; cells that join it "transform from rods into spherical, heat-resistant myxospores, while the peripheral cells remain rod-shaped". The choice is who goes in to become a spore and who stays out as a rod; the cost is policing, because cheater mutants end up "over-represented among spores relative to their initial frequency" (#117). A colony program, earned at quorum, never stolen. The stalk whose cells die (about 20% of them) is *Dictyostelium*'s, and that amoeba is a eukaryote: the codex shows it as convergence, never as a gene source | RN | not taken (*Myxococcus*) | [*Myxococcus xanthus*](https://en.wikipedia.org/wiki/Myxococcus_xanthus); comparison only: [*Dictyostelium*](https://en.wikipedia.org/wiki/Dictyostelium_discoideum) | — | #113 | trigger (starve at quorum) |
| 130 ★ | **Hitchhike Grip** | Latch onto an insect foot, a rotifer, a splash or the child's fingertip and leave the drop. You do not choose where you land | RX | age unknown | Dispersal, simplified | #21 Pili Grapple | — | draft, trigger (touch an insect foot) |

#### L. Invented and road-not-taken structures (8) — honestly labelled

| # | Node | Effect / trade-off | Badge | Date stamp | Grounded in | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 131 | **Proto-Nucleus** *(keystone)* | Wrap the DNA in membrane: phages, transposons and radiation struggle to reach it, and **every gene responds more slowly** | RN | not taken (*Thiomargarita*) | A giant bacterium keeps DNA in membrane-bound compartments ([*Thiomargarita magnifica*](https://en.wikipedia.org/wiki/Thiomargarita_magnifica)); in a cell like ours this is ours | #13 Tubulation | #2 | trigger |
| 132 | **Contractile Vacuole** | Bail water out: a dilution event stops being lethal, and it costs ATP every second | RN | not taken (protists) | Real in protists ([Contractile vacuole](https://en.wikipedia.org/wiki/Contractile_vacuole)); no bacterial example known | #82 Digestive Vacuole | #82 | trigger |
| 133 | **Symbiont Socket** | Import machinery plus synchronised division turns a kept captive into a permanent organelle slot | RN | not taken (the nitroplast; a bacterial host: the mealybug's *Tremblaya*) | The nitroplast's imported proteins and synchronised division ([Nitroplast](https://en.wikipedia.org/wiki/Nitroplast)). A bacterium as host is real once, *Moranella* inside *Tremblaya* ([von Dohlen et al. 2001](https://doi.org/10.1038/35086563)), but that guest invaded rather than being swallowed, and the insect is thought to make the envelope around it ([Husnik & McCutcheon 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5027413/); #85). A socket in a cell like ours is ours | #85 Keep-Not-Digest | #85 | engulf |
| 134 | **Ocellus** | Lens body + pigment screen + a domesticated partner = direction-sensing vision in one cell | RN | not taken (dinoflagellates) | A real structure with lens-, cornea- and retina-like parts exists in a dinoflagellate ([Ocelloid](https://en.wikipedia.org/wiki/Ocelloid)); a bacterial version is ours | #53 Spherical Focus | #53, #126, a kept partner | union |
| 135 | **Hypervariable Turret** | Deliberately hypermutate your own surface adhesin so nothing keeps a lock on it | INV (mechanism R) | invented | Diversity-generating retroelements hypervariate a target protein, first found in a phage tail fibre ([DGR](https://en.wikipedia.org/wiki/Diversity-generating_retroelement)); turning it on your own receptors as armour is our extrapolation | #63 Phase Variation | a captured phage | theft |
| 136 | **Harpoon** | A flagellum that latches and reels: grapple at swimming range, and it cannot push while it holds | INV | invented | A chimera of two real machines (flagellum + retractile pilus) | #15 Flagellar Bundle, #21 Pili Grapple | #15, #21 | draft (fusion, once both are held) |
| 137 | **Seed Pod** | Pack your own genes into a shell and fire it at kin, or into the next drop | INV | invented | Gene transfer agents + encapsulin shells, combined by us | #40 Encapsulin, #119 Gene Broadcast | #40, #119 | draft (fusion, once both are held) |
| 138 | **Recode** *(keystone, the namesake)* | See §3.8. One door of Act III's fork: close the code, or stay open | RS | today, in a laboratory (2023) | [Nyerges et al. 2023, *Nature*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/) | #143 Codon Dialect | #143 | trigger (Act III fork) |

*Also cut: the "Codon Firewall" as an invention. It is not invented — see §3.8 — and it was mislabelled in the source proposal. The "Membrane Capacitor", "Sloppy Ribosomes" and "Heirloom Locus" are cut for 1.0: the first two changed numbers rather than verbs, and the third is a narrative device that the Notebook already carries better. Story's amber heirloom glow (story §3.3) stays as display only: it locks nothing, and deleting an heirloom gene follows the genome rules of §3.4, #110 and #139.*

#### M. Expression and genome machinery (9)

The cell's own organelles, as nodes: the ribosome and its genes, the polymerase, the tRNA pool, ATP synthase, the replication origin, DNA repair and the cytoskeleton. Story §3.5 already dates the ribosome, the genetic code and ATP synthase as Phase-1 tree nodes; this group gives them homes, and the organelle lens (§3.1) draws them as their own small trees. Hooks marked **†** are for the biology owner (§10).

| # | Node | Effect / trade-off | Badge | Date stamp | Source | Homology neighbour(s) | Potentiated by | Reachable by |
|---|---|---|---|---|---|---|---|---|
| 139 ★ | **Ribosome Fleet** (start: seven rRNA operons) | Each rRNA operon is a lane that builds ribosomes. Duplicate one and you ramp up fast when food arrives — more installs in a feast; delete one and you idle cheaply through famine but answer slowly. Every copy is genome length (§3.4) | R | pre-LUCA (the ribosome) | *E. coli* "has seven" ([Ribosomal RNA](https://en.wikipedia.org/wiki/Ribosomal_RNA)); copy number "correlates with the rate at which" bacteria respond to resources: soil bacteria that formed colonies fast averaged about 5.5 copies, slow responders 1.4 ([Klappenbach et al. 2000](https://pmc.ncbi.nlm.nih.gov/articles/PMC91988/)) | #140 Hibernation | — | start; draft (duplicate or delete an operon) |
| 140 | **Ribosome Hibernation** | When starving, pair idle ribosomes into inactive dimers instead of running them. Nothing installs while they sleep, but they are kept for the next feast, so the first install after a famine lands fast (the speed-up **†**). The partner of the Stringent Brake | R | age unknown | In stationary phase, *E. coli*'s RMF "converts 70S ribosomes to an immature dimeric form (90S ribosomes)", which HPF turns into "inactive 100S ribosomes (a process called ribosomal hibernation)" ([UniProt P0AFW2](https://rest.uniprot.org/uniprotkb/P0AFW2.txt)) | #95 Stringent Brake, #139 Ribosome Fleet | #95 | draft, trigger (live through a famine) |
| 141 ★ | **ATP Synthase Gear** (start: a ten-subunit ring) | Choose the rotor ring's size, one ring at a time. Three ATP per turn means your ring of ten pays about 3.3 H⁺ per ATP. A smaller ring makes more ATP per proton but needs a strong gradient to turn; a bigger ring pays more protons per ATP but keeps turning when the gradient is weak — in an oxygen-poor, crowded or dim drop. The installed form is the rotor the prototype already spins | R (one-step ring swap RX) | pre-LUCA | Ring size varies: "the actual number of subunits vary greatly among specific enzymes" ([ATP synthase subunit C](https://en.wikipedia.org/wiki/ATP_synthase_subunit_C)). *E. coli* c10 against c8 in animal mitochondria, and the low-gradient trade-off: **†** (Watt et al. 2010, *PNAS*, could not be fetched) | #29 Respiration Chain, #36 Reverse Synthase, flagellar export apparatus (§3.9) | — | start; draft (a change in the ring subunit) |
| 142 | **Polymerase Armour** | One changed amino acid in your RNA polymerase, and a polymerase-jamming antibiotic made by soil bacteria stops silencing your installs: antibiotic bands (an opt-in stressor, §5) and the Apothecary's waves lose their grip. The changed polymerase reads the genome a little differently, so your stance balance shifts (**†**) | R | today (one mutation) | Rifamycins act by "selectively inhibiting bacterial DNA-dependent RNA polymerase"; resistance takes "a single amino acid change"; the natural producer was isolated from soil ([Rifamycin](https://en.wikipedia.org/wiki/Rifamycin)) | #94 Sigma Stances | — | draft, trigger (live through an antibiotic band) |
| 143 | **Codon Dialect** (tRNA pools) | Your tRNA genes decide which codons read fast, and every stolen gene arrives in its donor's dialect: a foreign one installs slowly and stalls ribosomes. This node makes the dialect readable on every cassette, so you see which steals will install cleanly, and opens two fixes: polish a gene codon by codon, or duplicate a matching tRNA gene. The bridge to Recode | R | pre-LUCA (the code) | Optimal codons in *E. coli* "reflect the composition of their respective genomic transfer RNA (tRNA) pool", and "the presence of rare codons along the transcript can lead to inefficient use and depletion of ribosomes" ([Codon usage bias](https://en.wikipedia.org/wiki/Codon_usage_bias)); phages and mobile elements carry translation parts of their own ([Nyerges et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/)) | #138 Recode | a first stolen install | draft, theft (tRNA genes ride on phages and mobile elements) |
| 144 | **Second Origin** | A second start site for copying the chromosome. A long genome copies in about half the time, so a big Atlas stops slowing division, and the dosage map (§3.1) gains a second hot spot near the new origin. Genes you parked near the terminus for low dosage may not stay low | RN | not taken (archaea) | Most bacterial chromosomes have "a single origin"; archaea "often initiate replication from multiple origins per chromosome", three in *Sulfolobus solfataricus* ([Origin of replication](https://en.wikipedia.org/wiki/Origin_of_replication)). A laboratory *E. coli* with two origins is reported **†** | #106 Multifork | #106 | trigger (carry a long genome through a drop) |
| 145 | **Photolyase** | Light mends what light breaks. Blue-violet light powers an enzyme that unpicks UV-welded DNA letters, so damage from open sun and a bead's UV focus heals while you sit in visible light, with fewer trips into SOS — and so fewer wake-ups for the prophage (**RX**). Useless in the dark | R | age unknown | Photolyases "convert pyrimidine dimers into a normal pair of pyrimidine bases" using "visible light (from the violet/blue end of the spectrum)"; *E. coli* has one; "the photolyase mechanism is no longer working in humans and other placental mammals" ([Photolyase](https://en.wikipedia.org/wiki/Photolyase)) | — | — | draft, trigger (a UV hit in a bead's focus) |
| 146 | **FtsZ Ring** | Re-arm the division ring. In a walled cell FtsZ rings the middle and the septum follows; wall-less cells divide without it, so in jelly it is an investment. It potentiates Septation (#102), and while it is expressed your blebs pinch nearer the middle — more even daughters, steadier drafts (**RX**). Codex: the protein that rings a bacterium's middle is a cousin of the tubulin in your own cells | R (even pinch RX) | age unknown | "FtsZ is a prokaryotic homologue of the eukaryotic protein tubulin" and "assembles into a ring at the future site of bacterial cell division"; cells without a wall divide without it ([FtsZ](https://en.wikipedia.org/wiki/FtsZ), citing Leaver et al. 2009) | #101 Blebbing, #102 Septation | — | draft |
| 147 ★ | **MreB Track** | Actin-like filaments that steer new wall into a rod. Without a wall they cannot shape you alone, but Rebuild the Wall (#14) gives you back a *rod* only through them, and while they run the Rod form is cheaper to hold (**RX**). Deleting the gene is also a move: the Sphere form then costs nothing to hold (**RX**), as naturally round bacteria mostly lack it | R | age unknown | MreB is "a major determinant of rod shape" with a structure "strikingly similar" to actin's; geometric control "can restore rod-like growth in wall-deficient L-form bacteria in an MreB-dependent manner"; "most bacteria that are naturally spherical lack the mreB gene altogether" ([MreB](https://en.wikipedia.org/wiki/MreB)) | #14 Rebuild the Wall, #27 Shape Program | — | draft |

### 3.8 The keystone the game is named after: Recode
Badge **RS — lab-real, not invented.** This was mislabelled as an invention in review; the correction matters, because the game is called Codon and this is the one place we must be exactly right.

**The real two-step history**, as published ([Nyerges et al. 2023, *Nature*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/), fetched and read this session):

1. **Step one failed, and it failed for a beautiful reason.** A laboratory *E. coli* strain had two serine codons removed genome-wide, along with the matching tRNA genes. It was still infected, because **phages and mobile elements carry their own translation parts** — the paper notes that "numerous viruses and mobile genetic elements encode parts of the translational apparatus", and every one of twelve lytic phages isolated from environmental samples carried a serine tRNA able to read those codons.
2. **Step two worked differently.** Instead of merely deleting a codon's meaning, the strain **reassigned** it: the same two serine codons were read as leucine. Viral proteins then came out mistranslated, and the authors also showed that plasmids written for one dialect did not function in the other — so the same change closed gene transfer in both directions. The authors state plainly that they cannot rule out phages that could still infect it. The strain also grows markedly slower than its parent (about 69 vs 44 minutes' doubling).

**In play, as two stages of one keystone:**

- **Stage 1 — Free a codon.** A sudoku-like pass over the Genome Ring, swapping synonymous codons locus by locus; overlapping genes create conflicts you must solve. It is satisfying, it is cheap, and **it summons its own counter**: phage elites that carry their own tRNAs. The game teaches the real refutation by making you live it.
- **Stage 2 — The Swap.** Reassign the freed codon. Now you are a true firewall — and **your own theft closes with it**: Read, conjugation and Dissect all stop working, because stolen genes are written in the other dialect until you polish them one at a time. And your division time rises, exactly as the real strain's did.

That is one door of Act III's fork (the Stranger is the other; §9.3, story §3.4), and it is a *mechanic*, not a cutscene: **close the code, or stay open.** The fork resolves when Stage 1's tRNA-carrying phages arrive: make the Swap, or survive them open. Both roads are earned and both end somewhere real. A closed lineage that reaches the last morning of summer without the glow earns **Armour**, a launch ending that absorbs the earlier "Fortress" ending. Staying open keeps the true ending, **Seen**, in easy reach, because its lux genes arrive only by transfer; a recoded lineage can still get there, but only by polishing stolen lux into its own dialect one codon at a time. The earlier "Partnership" ending splits in two: the open road now ends in Seen, and the partnership itself becomes **Taken In**, the Stranger's ending, in a later summer (story §4.4). Honesty card: *"People did this in a laboratory. No wild cell is known to have done it from scratch, and the people who did it say phages may yet get through."*

### 3.9 Unions and "Nature got here first"
Named unions exist — Vampire Survivors' shape — but **only where real homology or real history justifies them.** The open-ended domain-fusion Bench with fold-check odds is **cut for 1.0**: it is a combinatorial content explosion, its recipes would feel arbitrary in exactly the way Subnautica and Cultist Simulator were criticised for, it is a second game competing with the run, and "design a new protein" reads badly. What ships is a fixed, curated set:

| Inputs | Union | Truth |
|---|---|---|
| Flagellar export apparatus + effector genes | **Injectisome** — inject an effector into a cell | The flagellum and the type III injectisome share a core export apparatus, and the injectisome is thought to derive from the flagellum ([Cornelis 2006](https://doi.org/10.1038/nrmicro1526)) — **R** |
| Captured phage + sheath genes | **Tailocin** — a headless phage tail as a weapon | Real: R-type pyocins are exactly this ([Pyocin](https://en.wikipedia.org/wiki/Pyocin)) — **R+** |
| Protein shell + iron store | **Encapsulin** | Real ([Encapsulin](https://en.wikipedia.org/wiki/Encapsulin)) — **R+** |
| Protein shell + enzyme | **Microcompartment** | Real ([BMC](https://en.wikipedia.org/wiki/Bacterial_microcompartment)) — **R+** |
| Proteorhodopsin + flagellum | **Green-Light Swim** — Burst costs nothing in sunlight | Real: cells given rhodopsin swim under green light when respiration is blocked ([Walter 2007](https://pmc.ncbi.nlm.nih.gov/articles/PMC1838496)) — **R+** |
| Magnetosome chain + flagellum | **Magnetotaxis Dive** — an unblockable straight dive | Real gene-transfer result ([Kolinko 2014](https://pubmed.ncbi.nlm.nih.gov/24561353/)) — **R+** |
| Filament + nanowire + kin | **Cable** — a chain of your cells spans the redox boundary and powers all of them | Real analogue ([Cable bacteria](https://en.wikipedia.org/wiki/Cable_bacteria)) — **RN**: a whole multicellular filament, not a gene anyone can be given |
| Hopanoid + nitrogenase | **Vesicle Vault** — fix nitrogen with oxygen around | Real hypothesis ([Hopanoids](https://en.wikipedia.org/wiki/Hopanoids)) — **H** |
| Sphere focus + pigment + domesticated partner | **Ocellus** | Structure real elsewhere, bacterial version ours — **RN** |
| Swallow + Keep held N divisions | **Domesticated Organelle** | The process is real in eukaryotes and happened more than once, but no cell like ours is known to have done it, and our pacing is staged. One bacterium does host another, *Moranella* inside the mealybug's *Tremblaya* ([von Dohlen et al. 2001](https://doi.org/10.1038/35086563)), but its guest invaded and was never swallowed (#85), so the Swallow input is the invented step — **RN** (pacing RX), the same badge as Keep-Not-Digest (#85) and the Symbiont Socket (#133) |
| Autoinducer + receptor + lux | **Dusk Chorus** | Real genes, and the campaign's climax — **R+** |

When a union completes, the codex interrupts with the reveal: **"Nature got here first. You have reinvented the type III injectisome."** Then the real story, one paragraph, with its source. It is the game's best running joke and its best teaching moment at once — and it only fires for the homology-backed unions above, never for an arbitrary combination.

### 3.10 Build archetypes
Ten identities the budget forces you to choose between. Slay the Spire's team built archetypes "in batches" and accepted that single-player builds need not be equal ([Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)); so do we.

| Archetype | Core stack | Wins by | Loses to |
|---|---|---|---|
| **The Engine** | Cardiolipin poles · complex I · ATP synthase gear · sodium motor · reverse synthase | Raw gradient: outrunning and outworking everything | Uncouplers, efflux drain, anoxia |
| **The Thief** | Competence · wide porins · integrase · Dissect · **no restriction enzymes** | The fastest-growing Atlas in the game | Phages walk straight in |
| **The Jelly** | Tubulation · engulf ladder · microlens · valves · blebbing | Going where nothing else fits; eating rivals whole | Osmotic swings, and its own slowness |
| **The Fortress** | Wall · capsule · R–M + CRISPR · biofilm | Attrition; never dying | Starvation; cannot steal, cannot engulf |
| **The Phototroph** | Rhodopsin → reaction centre · gas vesicles · carboxysome · pigments | Free energy, and holding station in a sunlit patch without thrust | Night, shadows (hairs, the glass, the child's head), and its own oxygen exhaust |
| **The Assassin** | T6SS · CDI · colicin + immunity · kin tags | Local dominance in structured water | A well-mixed drop; a resistant neighbour cycle |
| **The Ghost** | Gliding or kink-swimming · shed flagellum · low leakage · phase variation · persisters | Never being targeted at all | Slow; weak in open water; low damage |
| **The Commune** | Quorum · public goods · matrix · K⁺ wave · division of labour | Things one cell physically cannot do | Cheaters and quenching enzymes |
| **The Host** | Keep-not-digest · symbiont socket · synchronised division | The long game: organelles | Anything fast, during the long game |
| **The Programmer** | Thin hardware · riboswitches · patch cables · stances · degradation tags | Timing: arriving already in the right state | Anything that does not telegraph |

### 3.11 Exclusive pairs — real trade-offs, not arbitrary locks
| Pair | What you gain | What you give up |
|---|---|---|
| **Stay Naked / Rebuild the Wall** | Forms, Envelop, squeezing, the lens | Osmotic safety, rigidity, swim speed. Polar Anchor (#148) is the half-step: honest motors, paid for with rigid poles |
| **Public / Tethered enzymes** | Public: bigger reach, feeds everyone, scales with colony | Tethered: smaller reach, **cheater-proof** ([Diggle 2007](https://doi.org/10.1038/nature06279)) |
| **Keep the Flagellum / Shed it** | Keep: Burst, speed | Shed: invisible to the plant's flagellin sensor and to grazers' recognition, +proteome, and gliding or kink-swimming cost half — **but no Burst** |
| **Restriction–Modification / Thief** | Allowed together, and **they work against each other**: the same enzymes that stop phages chew the DNA you are trying to read | — |
| **Mutator / Proofreader** | Mutator: an extra draft card, potentiation odds rise | Proofreader: fewer, cleaner options |
| **Obligate Anaerobe** | Nitrogenase and anoxic-pocket metabolisms run free; immune to the midmorning oxidative burst | Oxygen becomes poison; the surface is closed; every drop starts oxic, so you live in other cells' crowds until yours is thick enough to make its own pocket (§4.1) |
| **Giant / Brood** | One large resilient cell | Many small ones: more drafts, more lives, each thinner |
| **Open genome / Recode** | Open: theft, Dissect, conjugation | Recode: a true firewall, slower division, and theft closes |
---

## 4. Encounters, ecology and threats

### 4.1 Drops are generated from parameters, not from a biome palette
Every drop is a real parameter set: temperature curve, evaporation rate, starting osmolarity, pH, a light map (sun or shade, and what casts shadows across the drop), iron availability, carbon sources (sugars, methanol, acetate, sulfide), surface area and roughness, mixing regime, and a resident species list. Oxygen is not on the list: every drop starts air-saturated, and its residents spend it (below). Variety therefore *means* something instead of being an asset shuffle — No Man's Sky's "procedural oatmeal". Hand-authored set pieces sit on top.

**The drop's layers: one real, three staged.** An earlier draft promised four strata in every drop — the meniscus film, sunlit water, a twilight middle and an anoxic floor — and presented them as fact. A dew drop is a few millimetres of nearly clear water. Pure water absorbs least at 418 nm, an attenuation length of about 227 m, and even at 200 nm, deep in the UV-C, the attenuation length is 14.5 cm ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)), so 4 mm of it loses under 3% of the light at any wavelength from 200 nm through the visible. There is no twilight middle and no UV-scorched top. How much UV the leaf's leachate absorbs in real dew is unmeasured (**†**), but nothing suggests a dark layer. Oxygen does fall with distance from the air, but only where cells crowd thickly enough to use it up faster than it diffuses in (the estimate below; research §4.6). So:

| Layer | What is real | What the game does | Badge |
|---|---|---|---|
| **The meniscus skin** | Oxygen enters through the air–water surface. Aerotactic bacteria pile up in a band at an air–liquid interface, and in a closed setup the band shrinks toward the air as the oxygen is used up ([Aerotaxis](https://en.wikipedia.org/wiki/Aerotaxis), citing Stricker et al. 2020) | The one place oxygen is always on offer, so the crowd gathers there, and so does whatever hunts the crowd | **R** |
| **Light and UV** | Not a layer. Light is the same at every depth; what changes it is whatever stands between the drop and the sun | A **shadow map**, driven by real geometry: leaf hairs (dense hairs "reflect ozone and UV radiation from sunlight", [Trichome](https://en.wikipedia.org/wiki/Trichome)), the magnifier's rim and handle, the warm spot it focuses (heat more than UV, §4.4), the child's head when they lean in, and the caustics the drop's own curved surface throws, sharpest where a bead held up on hairs focuses sunlight like a magnifier ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)). Hair shadows creep with the sun; the glass and the head move on the watcher's schedule (§4.4). Shade is a place you swim to sideways, not down | **RX**: the geometry is real; the timing and contrast are ours |
| **Anoxic pockets** | Not a stratum. Oxygen runs out where respiring cells crowd far from the air: a thick drop's floor under a dense crowd, inside a clump, in the packed Rim | Oxygen is a field computed from **local crowding × respiration × distance to the nearest air surface**. Every drop is oxic at Dawn. Pockets open beneath the thickest crowds as populations grow, and the thin water near the contact line stays oxic longest. Your own success can make the niche your anaerobic rivals need | **RX**: real physics, time-compressed and placed by us |
| **The cuticle floor** | Settled grains rest on it, the stoma opens through it, and leachate seeps up from it, so dissolved food is plausibly richest near the leaf (how strongly is **†**) | Terrain and chemistry, not darkness: leachate, mineral grains for nanowires, the stoma | **RX** |

**Depth is still a difficulty and economy choice the player makes continuously** — flOw's best idea — now with honest reasons: oxygen at the skin, food on the floor, a moving shadow map across both, and anoxia wherever the drop's life has crowded in. Its card on the "Where we cheated" page: *"Four millimetres of water barely dims the sun. The light and shade you swim through are shadows: hairs, the glass, the child leaning in. Oxygen runs out only where cells crowd, and here it runs out faster than in life."*

**The oxygen estimate.** The codex states it only once the biology owner signs it (§10). For oxygen consumed at a steady rate *k* below a surface held at saturation *S*, the penetration depth is *a* = √(2*DS*/*k*). Stewart's worked case, a growing *P. aeruginosa* biofilm packed at 12 mg cm⁻³ and consuming 3.1 mg O₂ L⁻¹ s⁻¹, runs out of oxygen 77 µm in ([Stewart 2003](https://pmc.ncbi.nlm.nih.gov/articles/PMC148055/)). In a dew drop, *D* is 2.1 × 10⁻⁵ cm² s⁻¹ for oxygen in water at 25 °C ([Mass diffusivity](https://en.wikipedia.org/wiki/Mass_diffusivity)), and air-saturated fresh water holds about 6 mL of oxygen per litre at 25 °C ([Oxygen](https://en.wikipedia.org/wiki/Oxygen)), roughly 8 mg/L. Our arithmetic from those inputs:
- The floor of a **2 mm-deep** drop goes anoxic once its cells consume about **0.008 mg O₂ L⁻¹ s⁻¹**: cells respiring as hard as Stewart's biofilm, at about **1/370 of its packing**. The threshold scales as 1/depth², so a 1 mm-deep drop needs four times the crowd.
- A clump packed like a biofilm runs dry about **0.1 mm** in, wherever it floats.
- At the 2 mm threshold, the drop's dissolved oxygen would last about **16 minutes** with no resupply, and diffusion across 2 mm takes about **30 minutes** (*L*²/*D*). Real pockets open and close over tens of minutes; a run compresses that into its 18–25 minutes (**RX**).
- In cells, 1/370 of Stewart's packing is of order **10⁸ per mL** (**†**: it depends on whether his 12 mg cm⁻³ is dry or wet mass). A leaf's 10⁶–10⁷ bacteria per cm² ([BioNumbers](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368)), all swimming in 2 mm of water over that square centimetre, would be 5 × 10⁶–5 × 10⁷ per mL: below the threshold, though not by much. So a dew drop goes anoxic only where its life gathers and grows — crowds, kills, clumps, biofilms, the Rim. Whether any real dew drop gets there is unmeasured (**†**).

**1.0 ships three habitats, one stage deep:** the **dew drop**, the **leaf veins with the stoma**, and a **puddle**. Soil pore, cloud, salt crust, insect gut and the oxygen-catastrophe ocean move to updates. This is the Spore lesson applied: one stage deep, not five shallow. The stage is microbial life: the cell, the colony and its partners (the campaign's Phases 1–3, §9.3). **Multicellularity as a stage of its own (Phase 4) is not in 1.0**; it ships as the first "next summer" update (story §3.7). Its doorway nodes (Don't-Let-Go, the Cable union, the Fruiting Body) do ship, as colony tricks inside the one stage.

**Offers lean toward the habitat.** A sunny drop offers more light genes; a salty one more sodium and osmolyte genes. Variety with a reason.

### 4.2 The cast
Everything here runs the player's rules. No hit-point sponges.

| Encounter | Behaviour | Counterplay |
|---|---|---|
| **Leaf natives** (pink methanol eaters) | Peaceful, abundant, metabolically generous. They leak | Trade, farm their leaks, or kill them and discover the Black Queen trap the hard way. Leaves can carry 10⁶–10⁷ bacteria per cm² ([BioNumbers](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368)) |
| **The competitor triad** | Three strains in the real colicin rock-paper-scissors. Who wins depends on **how mixed the drop is** | Structure is the weapon: fragment the space or stir it ([Kerr 2002](https://www.nature.com/articles/nature00823.pdf)) |
| **Plasmid carriers** | Rivals whose plasmid rings you can *read* before you bridge | Raid, trade, or leave them alone |
| **Lytic phage clades** | Adsorb to a *specific* surface protein you are expressing, replicate on your ribosomes, burst. You watch your own ribosomes building capsids — that is the horror, not a health bar | Shed or remodel the receptor, vesicle decoys, CRISPR, abortive infection, eat the capsids |
| **Temperate phage** | Offers a pact: immunity plus cargo. Likelier to go dormant in a starving host, as the real one is | Starving yourself becomes a defensive gambit |
| **The grazer** (ciliate) | Filters indiscriminately. Its oral groove turning toward you is the "?", the lunge is the "!" | Size, capsule, gliding, stillness, R-body-style rupture from inside — or turn its own kind against it with iron and nucleobase leachate (the Mouth's flip, §4.3) |
| **The stalker** | A tiny, extremely fast predator — real cells "can swim as fast as 160 μm/s", over 100 body lengths per second — that attaches to a prey cell's **outer membrane and peptidoglycan**, enters the periplasm, rounds the host and consumes it from inside, forming a bdelloplast ([Bdellovibrio](https://en.wikipedia.org/wiki/Bdellovibrio)) | **Honesty rule, absolute:** we never present "losing your wall protects you" as a fact. The real attack begins at the outer membrane and peptidoglycan; how it treats a wall-less cell is **not established**. It ships as a codex entry badged **H**, written as an open question, and in play the stalker simply has to re-solve its grip on a deforming body — a readable, telegraphed window, not an immunity |
| **The archaeal syntroph** | Cannot make energy alone; trades hydrogen; reaches out with long branching protrusions | One door of Act III's fork (§9.3), where the story calls it the Stranger (story §3.4, §4.1): be taken in, the real road, or take it in, the road not taken. Recode (§3.8) is the other door. A cultured archaeon of this kind took about 12 years to grow ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum)) |
| **The plant itself** | Not a creature: a weather system with opinions. Pores close when the plant senses flagellin; a real pathogen reopens them with a toxin within about 3 hours | Shed or alter your flagellin (stealth), or steal the reopening trick (force) ([Melotto et al. 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)). **Your motility node is read by the environment** — the deepest validation of Express versus Expose |
| **The watcher** | A hand, a lens, a shadow. Cools, heats (its glass focuses heat, not UV: §4.4), moves water, concentrates light. Never controlled, never hostile, always on its own schedule | Nothing. You schedule around it |

### 4.3 Bosses — real organisms, real physics, real telegraphs
Each has a tell in **shape, motion and sound**, never colour alone. Four ship in 1.0's three habitats; the rest arrive with their habitats.

| Boss | Real basis | The fight | Counters | Ships |
|---|---|---|---|---|
| **The Mouth** | *Tetrahymena vorax*: "a bacterivorous microstome around 60 μm in length" that can switch to "a carnivorous macrostome around 200 μm in length that can feed on larger competitors". The switch "are triggered by an abundance of stomatin in the environment", and the page names the actual molecules: "ferrous iron, hypoxanthine, and uracil"; inducers peak "after microstomal ciliates have grazed down bacterial populations" ([Tetrahymena](https://en.wikipedia.org/wiki/Tetrahymena)) | **Phase 1 — the microstome:** read and dodge the feeding current. **If swallowed, an inside level:** escape the acidifying food vacuole in ~45 s. **Phase 2 — the flip, which you cause.** The trigger is the drop's own leak chemistry, so the plume system *is* the boss trigger. Fill the water with iron and nucleobase leachate (the spill from your kills, your own leaks) and some grazers become 200 µm macrostomes: carnivores built for "larger competitors", which turn on the microstome grazers instead of you. For a 1 µm cell that is **relief, not escalation**, and summoning it is a strategy for clearing grazers — the real ecology, where cells transform when grazing has emptied the water and then prey on their former competitors. The price is ecological: the grazers were also keeping your rivals down, the big feeding current stirs the drop (which reshuffles the colicin triad, §4.2), and your leak is still a plume that hunters climb. Stay clean and phase 2 never comes. Badge **RX**: the transformation is time-compressed, and that the macrostome ignores a 1 µm cell is our reading of its diet — the page does not say whether macrostomes still take bacteria (**†**, §10), and the codex says so | Phase 1: Tumble, Sphere form, turgor vents, decoy vesicles, and the R-body route — real R bodies "extend" in an acidic food vacuole, "distending and rupturing the membrane", and can even rupture *E. coli* spheroplasts ([R body](https://en.wikipedia.org/wiki/R_body)). Phase 2 is itself the counter: leak iron and nucleobases on purpose | **1.0** (dew) |
| **The Bloom** | A lytic phage swarm: adsorption to a named porin, replication on your ribosomes, burst | A bullet-heaven with visible tail-fibre intents; if you are infected, a race against your own capsid factory | Receptor remix, CRISPR, abortive infection, decoys, and eating the capsids | **1.0** (midmorning) |
| **The Sleeper** | Your own prophage, woken by the damage response: "the classic induction of a lysogen involved irradiating the infected cells with UV light", and any DNA damage that sets off SOS does it, through RecA ([Lambda](https://en.wikipedia.org/wiki/Lambda_phage)) | An event boss *inside you*, triggered when UV damage pushes you into SOS. The UV comes from **the drop, not the child**: a hair-held bead focuses sunlight ([Egri et al. 2010](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)) and, being water, passes UV almost untouched, while the watcher's glass blocks most of it, so the loupe's hot spot is heat (§4.4). The causal chain is still hidden in the owner's magnifier image: the burning glass is the bead the child is looking into. Repress it, purge it, or let it out. Badge **R** for UV → SOS → induction; a loupe that wakes it would be **RX**, and 1.0 has none | Photolyase (#145), Sunscreen Pigments (#126), proto-nucleus, shatter repair, keeping out of a bead's focus and out of SOS | **1.0** (any) |
| **The Rim** | The drop's shape decides (§2.4). Pinned drops (tooth tips, vein runnels, the puddle) dry by the coffee-ring effect: capillary flow that "can carry nearly all the dispersed material to the edge", with a "rapid acceleration… at the final stage". Hair-held beads on a water-resistant leaf "are less likely to have a pinned contact line", which "will suppress ring formation" ([Coffee ring effect](https://en.wikipedia.org/wiki/Coffee_ring_effect)), so they shrink as a sphere instead. Badge **RX** | The finale of **every drop**, in one of two shapes: a rush to the edge (pinned), or a closing sphere that concentrates life and salt toward the centre (hair-held). Either way a shrinking arena with everything still alive crowded into it | Pinned: Marangoni Surf (pinned drops only), grapple anchors. Hair-held: compatible solutes, trehalose glass. Both: exits | **1.0** (every drop) |
| **The Gate** | The stoma: plants sense flagellin and close their pores; a real pathogen reopens them with a toxin ([Melotto 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)) | A stealth pass, not a fight. Get through unseen, or steal the key | Shed/silence flagellin, gliding, Tendril squeeze, or a stolen reopening trick | **1.0** (leaf veins) |
| **The Crown** | A bdelloid rotifer: eats suspended bacteria, and up to ~10% of its genes arrived by horizontal transfer ([Bdelloidea](https://en.wikipedia.org/wiki/Bdelloidea)) | Unkillable. Escape its corona current — or **ride it out of the drop**. Codex: "a fellow gene thief" | Hitchhike grip, grapple, Marangoni Surf (pinned drops only) | **1.0** (rim, rare) |
| **The Colossus** | A giant amoeba. *Chaos carolinense* can "reach lengths up to 5 mm, although most specimens fall between 1 and 3 mm", carries "as many as a thousand" nuclei, and is "able to feed on bacteria, algae, other protists, and even small multicellular invertebrates", taking them in "by phagocytosis, encircling food particles with their pseudopodia" ([*Chaos*](https://en.wikipedia.org/wiki/Chaos_(genus))). Not *Dictyostelium*: its 2–4 mm stage is the slug, "composed of up to 100,000 cells", and the stage that eats bacteria is a single amoeba of about 10 µm **†** ([*Dictyostelium*](https://en.wikipedia.org/wiki/Dictyostelium_discoideum)) | Being swallowed is **a level, not a death**: digest your way out. Codex: in a strain of large, free-living amoeba (*Amoeba proteus*), bacteria that arrived as parasites first "killed almost all of the infected protists" ([Endosymbiont](https://en.wikipedia.org/wiki/Endosymbiont)); later they "are not digested by the host amoebae", and the hosts "require the presence of live endosymbionts for their survival" ([Jeon & Jeon 1976](https://pubmed.ncbi.nlm.nih.gov/972171/)). Staying in the vacuole is a real road, and it runs the domestication arc backwards | Vacuole resistance, then your own engulf tree used in reverse | 1.1 (puddle) |
| **The Shelled Phage** | A jumbo phage that builds a protein nucleus inside you, which "protects phage DNA from host defenses", including restriction enzymes and type I CRISPR ([Phage nucleus](https://en.wikipedia.org/wiki/Phage_nucleus)) | A fight inside your own cytoplasm (reuses the inspect camera). A boss that **invalidates one whole defence family** and teaches why diversity matters | Membrane-level and self-destruct strategies only | 1.1 (puddle) |
| **The Ancestor** | A real competition assay against a frozen ancestor ([LTEE](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment)) | A mirror duel against your own frozen past lineage, offline | Whatever beats you | **1.0** (Jar) |
| **The Pack** · **The Apothecary** · **The Whirlpool** | *Myxococcus* wolf packs; a *Streptomyces* colony's antibiotic waves as a fluid front; *Vorticella*'s feeding current and snapping stalk | Soil and vein set pieces | Quenching, biofilm, efflux, persisters, the stepped climb | With their habitats, post-1.0 |

**Scale flip, done honestly.** A 1 µm cell cannot credibly eat a 60 µm ciliate alone. In Codon the flip is **collective**: a chorus pack lyses a grazer together, as real wolf-pack predators do. The solo Giant path exists as a late exception, grounded in genuinely giant bacteria ([*Thiomargarita*](https://en.wikipedia.org/wiki/Thiomargarita_magnifica)).

**Rendering bosses (this is also the performance answer).** A ciliate is 30+ hero-lengths long, far beyond the camera's 18 µm maximum distance, so bosses are **never drawn as whole cells**. They are **near-field terrain**: a large signed-distance surface plus instanced cilia rows, with the feeding current as a flow field in the water shader. Phages are **instanced meshes** (a T4-like particle is ~90 × 200 nm). That is how a boss fight coexists with `MAX_CELLS = 12`.

### 4.4 Four engines by which the world reacts
1. **Surface re-targeting (frequency-dependent selection).** Rival lineages and phage clades adapt to your *most-expressed surface proteins*. Whatever you lean on becomes the thing the drop learns to attack. The **Red Queen ledger is shown openly** — "the rods are evolving against your maltose porin" — so it is a strategic dial, not hidden punishment. This is the Evolution board game's best property, where a trait's value shifts with what else is on the table ([Opinionated Gamers](https://opinionatedgamers.com/2015/05/20/dale-yu-review-of-evolution-northstar-games/)), and it means no build stays dominant without the player continuing to think.
2. **Kill the Winner.** Phage pressure scales with your lineage's abundance, because that is what really happens ([Thingstad & Lignell 1997](https://en.wikipedia.org/wiki/Kill_the_Winner_hypothesis)). Snowballing summons plagues. **The anti-snowball is ecological, not a difficulty slider.**
3. **Mass balance.** The drop has a budget. Your waste is someone's food; their waste is yours; iron is the hard limit; if you lyse everything you starve in your own graveyard. Factorio's pollution-draws-attackers loop, with real chemistry: leaked acetate and protons are chemotactic attractants, and leaked iron and nucleobases turn grazers into the macrostome that hunts them (§4.3) — pollution that summons an ally, at an ecological price.
4. **The schedule, run by two storytellers** (RimWorld's model): **the Leaf**, calm and cyclical — day, weather, rain that dilutes and is lethal to a wall-less cell without valves, insects, runoff, and the sun itself, which a hair-held bead focuses into a UV spot on its own underside; and **the Lens**, a chaos agent whose focused light brings **heat**, which calls the heat-shock response (σ32 in *E. coli*, [Heat shock response](https://en.wikipedia.org/wiki/Heat_shock_response)), so it is answered by the Heat stance (#94) and read early by Thermosense (#52).
   - **Why the split is optics, not taste.** The loupe's soda–lime glass passes UVA but blocks "over 90% of the light below 300 nm" ([Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet)); glass is transparent in the near-infrared, where liquid water absorbs ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)), so its spot warms the bead. Water absorbs about as little at 200 nm as at 900 nm, an attenuation length of 14.5 cm (same page), so a 4 mm bead absorbs about 3% of the UV it focuses even at 200 nm (*estimate*). For water's index the ball-lens formulas put the focus about half a diameter beyond the bead ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)), which is why a hair-held bead burns the leaf under it (Egri et al. 2010): inside the bead the light converges toward its underside.
   - **So the prophage chain runs on the Leaf's clock, through the drop**, and is **R**: UV damages DNA, RecA reads the damage, and a prophage's exit "is determined solely by the activation of RecA in the SOS response" ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)). Heat alone is not that trigger. Drawing the bead's focus as a spot that crawls through the water at game tempo is **RX**. Any loupe → SOS link is **RX** too, and 1.0 ships none: UVA does damage DNA, but indirectly, through reactive oxygen (Ultraviolet, above).
   - **The two storytellers still meet.** The child's head and lens shadow switch a bead's focus off, and the loupe's heat speeds the evaporation that shrinks the bead (§2.4).

### 4.5 Autopsy — the single most important feature in the game
Primordialis shipped with no damage log; 14 reviews name "unclear deaths" and 15 name "punishing experimentation" ([VaporLens](https://vaporlens.app/app/3011360/primordialis)). This is the gap we walk into.

**On every death, Codon replays the last ten seconds and names the mechanism**, with a flux diagram of the moment it failed: ATP collapse, osmotic rupture at the valve threshold, phage entry at a named porin, toxin crossing the membrane, pH, starvation, digestion. Then **the one gene from your seen pool that would have saved you**, one line of real biology, and a codex link. Optional deduction mode: work out from the remains what killed a *neighbour*, confirmed in batches so you cannot brute-force it (Obra Dinn).

Failure must also be **spectacular and funny**. Lysis is Codon's "rapid unplanned disassembly", in Kerbal's spirit. Beautiful death is how a systems game earns experimentation.

**Non-negotiable: the autopsy ships in the vertical slice, not after it.**

### 4.6 The readability contract
- Every threat is shown three ways at once: **shape, motion, sound**. Never colour alone. That rules out Pathogenic's "everything is red" boss problem.
- Telegraph timings: tail fibres bind ~1.5 s before injection; a grazer's groove turns before it pulls; the stalker shimmers before it strikes; geosmin precedes an antibiotic wave.
- The depth-of-field focus plane keeps the hero crisp in a crowd (the bullet-heaven clutter problem).
- Flash limiting on lysis bursts; a speed slider; damage numbers as an opt-in.

---

## 5. The mechanics catalogue
Everything that lives inside this design, each tied to a Codon system. Layers: **S** seconds · **M** minutes · **H** hours/meta · **L** optional lab/mode · **P** post-1.0.

| # | Mechanic | Borrowed from | Codon form | Layer |
|---|---|---|---|---|
| 1 | Temporal-gradient sensing, no minimap | Real chemotaxis | "Better or worse than ~4 s ago", in the water and on the receptor array | S |
| 2 | Tumble dodge | Gungeon/Hades dash | Free random reorient; breaks a lock; **no i-frames** | S |
| 3 | Thrust that costs growth | Osmos | Burst drains H⁺, which is also your ATP source | S |
| 4 | No coasting | Low Reynolds number | Already in `src/player.js` | S |
| 5 | Body forms as a combat verb | Everything is Crab's morphs | Rod / Sphere / Sheet / Tendril | S |
| 6 | Deformation instead of knockback | — (Codon's own) | The viscous-juice rulebook (§2.2) | S |
| 7 | Timed grab | Fighting-game just-frames | Envelop's **clean seal** bonus | S |
| 8 | Scent plumes as noise rings | Mark of the Ninja | Every leak is a diffusing plume predators climb; it fades seconds after you stop | S |
| 9 | Enemy intents | Slay the Spire | Tail fibres, oral grooves, cocked spears, geosmin | S |
| 10 | Grapple and carry | Pikmin / grapple hooks | Pili drag a catch somewhere safe to digest | S |
| 11 | Depth axis as chosen difficulty | flOw | Oxygen at the skin, leachate on the floor, anoxic pockets wherever crowds form; light set by shadows, not depth (§4.1, **RX**) | S |
| 12 | One vitality pool | Peak's stamina | H⁺: swimming, uptake and synthesis all bite it | S |
| 13 | Squeeze through gaps | Metroidvania gating | Tendril passes biofilm pores, hair gaps, the stoma | S |
| 14 | Synesthetic diagnostics | Rez | Each running pathway is an instrument; you *hear* a stall. **Feedback only — no rhythm mechanic** | S |
| 15 | Visible install, not pop-in | — (the Sapling's failure) | DNA → mRNA → ribosome → fold → snap, 3–8 s | M |
| 16 | Order-sensitive loadout | Noita wands | **The integron Array**: slot 1 loud, slot 8 a whisper | M |
| 17 | Adjacency packing | Backpack Battles | Operons: neighbours share one promoter | M |
| 18 | Pick-1-of-3 | Slay the Spire / Hades boons | Division draft and every DNA read; skip banks a reroll | M |
| 19 | Keyword synergy | Balatro | The cell's real shared currencies as the keyword set | M |
| 20 | Budget with an overcharm | Hollow Knight notches | Proteome share; over the line, division slows on the real burden curve | M |
| 21 | Alternate recipes | Satisfactory hard drives | Two real glycolysis routes: yield versus enzyme cost | M |
| 22 | Visible production chains | Factorio | The energy route jams visibly at its bottleneck | M |
| 23 | Public goods and cheaters | Real sociomicrobiology | Secreted enzymes and iron feed freeloaders, **including your own clones** | M |
| 24 | Rock-paper-scissors with geography | Evolution (board game) | Colicin triad; mixing versus patchiness decides it | M |
| 25 | Kin tags | CDI / T6SS immunity | Your immunity genes are the family password | M |
| 26 | Threshold abilities | Quorum sensing | Powers that only fire inside a thick enough haze | M |
| 27 | Signal jamming | Quorum quenching | Kill a rival chorus before it fires | M |
| 28 | Insurance slider | Persisters | Pre-commit a dormant fraction *before* the catastrophe | M |
| 29 | Irreversible channel | Sporulation | Past the commitment point you cannot cancel; the mother dies | M |
| 30 | Cursed relics | Roguelite curses | Addiction plasmids you cannot drop without killing daughters | M |
| 31 | Double-edged lodger | Roguelite pacts | Prophage: immunity and cargo, and a bomb | M |
| 32 | Learned immunity as a trophy | Subnautica scanning | CRISPR spacer beads, inherited, newest first, decaying in value | M |
| 33 | Read the enemy's build | Inspect systems | Read a rival's surface proteins and plasmid genes before committing | M |
| 34 | Choice after the kill | Choice rewards | **Digest / Dissect / Keep** | M |
| 35 | Extraction | Extraction shooters | Exits with carry-over rules (§2.4) | M |
| 36 | Sacrificial extra lives | Rogue Legacy heirs | Living clones; you continue as a sister | M |
| 37 | Shrinking arena | Battle royale | The drying drop: a coffee-ring rush to the edge in pinned drops, a closing sphere in hair-held beads (**RX**, §2.4) | M |
| 38 | Lethal cycle forces shelter | Rain World | Rain dilution and the dry-out, both forecast by osmo-sense | M |
| 39 | Pollution changes who hunts | Factorio biters | Acetate plumes draw grazers; iron and nucleobase plumes flip grazers into the macrostome that eats them (the Mouth, §4.3) | M |
| 40 | Fluid enemy | Creeper World | Antibiotic and bacteriocin fronts: repelled, not killed | M/P |
| 41 | Disguise | Stealth games | Phase variation, silent flagellin, shed flagellum | M |
| 42 | Loadout before the level | PvZ seed packets | Pre-run cassette loadout with an expression "recharge" | M |
| 43 | Fail-forward option | Digimon's Numemon | The **Blob** draft: no run dead-ends | M |
| 44 | Rising marginal cost | Plague Inc DNA points | Each deepened locus raises the next one's proteome cost | M |
| 45 | Devolution as a move | Plague Inc / real gene loss | Deleting genes is legitimate, refunds proteome, and risks the Black Queen trap | M |
| 46 | Autopsy replay | The Primordialis gap | 10-second rewind naming the mechanism | M |
| 47 | Knowledge gates | Outer Wilds | Observing a mechanism reveals its counter on the Atlas | H |
| 48 | Trigger unlocks | Factorio 2.0 | Live the condition; each environment yields **once** | H |
| 49 | Potentiation chains | The real citrate chain | Latent nodes gated by earlier neutral history | H |
| 50 | Rumour web | Outer Wilds ship log | The Notebook points at the next mystery | H |
| 51 | Senses as world layers | Gris's colour reveal | No receptor, no plume | S/H |
| 52 | Imaging modes as information | Nikon Small World / Pokémon Snap | Phase contrast, stain, fluorescence, structure, sequence | H |
| 53 | Behaviour catalogue | Pokédex / Snap's rarity | Rare events to witness: a conjugation bridge, a burst, a fruiting body | H |
| 54 | Transparent photo rubric | Snap's failure | Originality, information, technique, impact — stated openly | L |
| 55 | Frozen fossil record | The LTEE freezer | A sample every N divisions; revive and replay any branch | H |
| 56 | Lineage chronicle | RimWorld / CK3 legends | Auto-captioned phylogeny with a sortable browser **in game** (the Mewgenics-spreadsheet lesson) | H |
| 57 | Relative fitness as score | The LTEE's own metric | *w* against your ancestor, with an ancestor ghost | H |
| 58 | Opt-in stressors | Hades' Pact | UV index, phage titre, antibiotic bands, lean medium, fast evaporation, grazer density, salt, Red Queen rate, cheater rate, mutational load | H |
| 59 | Paired refundable talents | Hades' Mirror | Standing culture conditions, swapped free between runs | H |
| 60 | Meta that adds options, not power | Dead Cells blueprints | Discovered genes join the draft pool | H |
| 61 | Starting characters | Brotato | Origin strains, each with ≥2 viable routes | H |
| 62 | Domestication arc | Monster taming / Stellaris | Hostage → partner → integrated → organelle, with real loss modes | H |
| 63 | Asymmetric inheritance | *Hatena* | Only one daughter keeps the symbiont; the other must hunt one | H |
| 64 | Division of labour | Heterocysts / Volvox | Oxygen and nitrogen fixation **cannot share a compartment**: solve by time, space or organelle | H |
| 65 | Base defence with the hero inside | Thronefall | Biofilm nights: build by day, fight in it at dusk | H/P |
| 66 | Single-breach cascade | They Are Billions | One phage inside the matrix chain-lyses a sector | H/P |
| 67 | Sacrificial lawnmower | Plants vs. Zombies | Abortive infection: one cell per sector dies to stop a bloom | H/P |
| 68 | Reverse tower defence | The MEGA-plate experiment | The stepped-gradient climb: a direct jump to the top concentration fails, intermediate steps succeed ([Baym et al. 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5534434/)) | L |
| 69 | Rule-tile logic puzzles | Baba Is You | Promoter / operator / repressor tiles, in the **Regulation Lab only** | L |
| 70 | Optimisation histograms | Opus Magnum | Circuits scored on base pairs, response time, growth burden | L |
| 71 | Specimen identification | Obra Dinn batches | Identify a mystery cell from stain and behaviour, confirmed in threes | L |
| 72 | GIF / loop export | Opus Magnum's marketing | One-click export of your cell and your circuits | H |
| 73 | Sandbox with god tools | Kerbal / WorldBox | The Petri Lab: set O₂, pH, osmolarity, nutrients, mutagens | L |
| 74 | Daily shared seed | Wordle / StS daily | The Daily Drop, with a spoiler-free codon-colour share card. **No backend needed** | H |
| 75 | Creation codes | Spore's shared creatures | Strain codes written as literal DNA (§6.5) | H |
| 76 | Assist mode without judgement | Celeste / Hades | "Lab Conditions": rich, osmotically safe medium. Diegetic, never "cheat" | all |
| 77 | Speed slider and freeze | Accessibility guidelines | Microbe timescales make this natural; inspect already slows time | all |
| 78 | Redundant encoding | Accessibility guidelines | Every colour signal also has shape, motion and sound | all |
| 79 | Honesty badges | Kerbal's documented compromises | A badge and one source on every node and codex entry, plus "Where we cheated" | all |
| 80 | Async traces | Dark Souls bloodstains | A dead player's cassette as eDNA in a same-seed drop | P |
| 81 | Fight saved builds | Backpack Battles / Super Auto Pets | Ghost colonies; async colicin rock-paper-scissors (the owner's colony-versus-colony idea, honestly) | P |
| 82 | Community order | Helldivers 2 | The weekly Jar: a global generation count unlocking a world event | P |
| 83 | Anonymous stranger | Journey | Another player's cell, signalling only in chemistry | P |
| 84 | One global creation tree | Scratch's remix trees | The Commons Tree: forking a strain grows your branch from theirs | P |
| 85 | Citizen science | Foldit / Eterna / Borderlands Science | An optional real puzzle with a lab partner; cosmetic rewards | P |

**Cut outright, and why:** all rhythm mechanics — the on-beat efficiency bonus, signal-pulse commands, the rhythm boss. Off-genre, no biological basis, and an accessibility cost. The Rez-style audio stays as feedback.

---

## 6. Meta progression, modes and replay

### 6.1 Five channels, all of which add options rather than power
Dead Cells' blueprints add weapons to the pool, each "providing a new way to play"; Rogue Legacy's rising upgrade costs read as "padding masquerading as difficulty" ([summary](https://vaporlens.app/app/241600/rogue_legacy.md)). So:

1. **The gene pool.** Genes you have ever expressed enter the drafting pool. Your *library* grows; your *power* does not.
2. **The Atlas.** Promoted cassettes become permanent — but the proteome budget means a bigger Atlas is not a stronger cell, only a cell with more choices.
3. **The codex, and knowledge gates.** The most valuable currency in the game is what you know, because knowing literally unlocks counters.
4. **The instrument ladder.** Information, never damage: magnifier → drop-lens → bead lens → brightfield (today's look) → phase contrast (membranes) → stain (envelope types) → fluorescence (**which genes any cell is expressing right now**) → structure view → sequencer (the full Genome Ring of any specimen). Each is a variation on `lens.js` plus one shader.
5. **Standing conditions.** Paired, exclusive, **refundable** choices made at the Jar, the child's jam jar of drop water on the sill (Hades' Mirror shape): rich medium or lean (lean gives a reroll), stable osmolarity or variable, high mutagen or proofreading, long dawn or late rim. Free swaps between runs, because permanent-mistake anxiety suppresses the experimentation this design needs.

**No currency. No rising costs. No stat padding.**

**Death advances everything:** an autopsy, a Notebook page, eDNA left in the drop that a later lineage can take up — which is both Inscryption's death card and a real phenomenon for wall-less cells (shown in *Kitasatospora* L-forms).

### 6.2 Origin strains — the replay spine
Each starts at a different arc of the ring with a rule constraint, and each has **at least two viable routes**, because Brotato's documented failure is characters "shoehorned" into one build.

| Strain | Starts with | Constraint |
|---|---|---|
| **The Shed** (default) | The naked wall-less cell | Fragile, flexible, can engulf |
| **The Anaerobe** | Anoxic-pocket metabolisms | No oxygen respiration at all, and every drop starts oxic: it rides other cells' crowds until it grows its own pocket (§4.1); the oxygen epoch is its apocalypse |
| **The Streamliner** | A tiny genome, half the loci, huge replication speed | A Black Queen dependant from turn one |
| **The Hypermutator** | Three draft offers | Constant deleterious load |
| **The Lodger** | A prophage: immunity plus cargo | And a bomb |
| **The Phototroph** | Rhodopsin | No sugar transporter |
| **The Glider** | Gliding, no flagellum: the honest wall-less start, with no motor cheat to carry (§2.1) | No Burst; invisible to the plant |

### 6.3 Modes

| Mode | Shape | Why |
|---|---|---|
| **Campaign: One Summer** | Four acts (Dew, Film, Storm, Dusk) across one summer of about 40–50 mornings (story §3.4), played as Expeditions of three drops, with a persistent lineage, the Jar, the instrument ladder and the Notebook, *What I saw — for G.* Acts I–III are Phases 1–3 (the cell, the colony, partners and the wider world); Act IV is a finale on those systems. Act III's fork has two doors: the Stranger and Recode. Three endings at launch: **Seen** (the quorum glow in full dark, then the pull-out into G.'s eye), **Armour** (a closed lineage) and **Stop**. Phase 4, multicellularity, is the first post-1.0 "next summer" (§4.1) | Ship **one stage deep** |
| **Endless Drift** | Keep moving drop to drop with stressor ranks rising | Roguelite longevity |
| **Experiments** (~40 at 1.0, ~60 later) | Curated puzzles, each unlocking one real gene: survive anoxia on fermentation alone; cross the stepped toxin gradient; out-compete a rival on half your ribosomes; hold 60 s under a dilution shock | Cell Lab's 66 challenges are the closest precedent for genome-as-program |
| **Petri Lab** (sandbox) | God controls on every drop parameter, any species, unlimited genes, time controls, spectacular instructive failures | Kerbal's sandbox — and **never shipped as the main game** |
| **Regulation Lab** (optional, post-slice) | The cut Program tier lives here: gates, memory, clocks, filters, with histograms and GIF export; circuits install into runs | Zachtronics' separation of tools from challenges |
| **Daily Drop** | One shared seed, one attempt, a spoiler-free share card | Wordle's grid; **needs no backend** |
| **Micrograph** | Freeze, choose a modality, frame a shot, against an open rubric | Nikon Small World |
| **Streamer** | Long decision windows; chat may choose the draft mutation (honest: mutation is random with respect to need) or drop a stressor | Twitch Plays Pokémon's throttle lesson. **No chat-as-mutagen before 1.0** |
| **Async** (deferred, in this order) | eDNA from other players' dead lineages → ghost-colony raids → the weekly Jar → the anonymous stranger → the Commons Tree | No real-time netcode, **no real-time PvP**, no free-text chat, no forced accounts (the Helldivers 2 backlash), and explicitly no patented Nemesis-style hierarchy |

### 6.4 Everything networked is deferred past 1.0
Cut from 1.0 and stated plainly so no one plans around it: the Commons Tree, ghost-colony raids, the anonymous stranger, the community Jar order, chat-as-mutagen, citizen science. (An earlier draft's "Phage Maker" is struck from the list rather than deferred: it was never specified, and a player-built phage would meet the same objections as the fusion bench, §3.9, and the dual-use rule, §8.5.) **1.0 ships offline strain codes and a seed-based Daily Drop**, which need no server. The owner's colony-versus-colony idea survives as **later async** colicin rock-paper-scissors ([Kerr 2002](https://www.nature.com/articles/nature00823.pdf)); real-time PvP is cut.

### 6.5 Sharing
- **Strain codes are literal DNA.** A build is packed at 2 bits per base and shown as a glowing strip with `ATG…TAA` as delimiters. Pasting one "transforms" a cell in the Lab. The codex notes that people really do store data in DNA ([DNA data storage](https://en.wikipedia.org/wiki/DNA_digital_data_storage)).
- **Generated Latin binomials** instead of free text (*Codonella rorida*), built from curated syllables — no free-text abuse surface, no moderation bill.
- **Exports:** a one-click loop of your cell working, a Tree poster, the Daily Drop's codon-colour card.
- **Post-1.0, the Commons Tree:** forking a strain makes your branch grow from theirs, so **attribution is ancestry**.

### 6.6 Telemetry, from the first playable
Slay the Spire's team logged every decision from the prototype and grew from three graphs to at least 90, tracking pick rate, presence in winning runs, what a card was picked *over*, and damage taken while holding it; a card nobody picks "is basically not a card in our game at that point" ([Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder)).

We log from the first playable: per-node pick rate, pick-over, win-presence, time to first control, time to first install, death cause per node, autopsy dwell time, reinventions per hour, and **codex entries opened** — the clearest signal that understanding is landing. Balance changes stage on a beta branch with notes; Slay the Spire 2's first balance patch drew thousands of negative reviews in a day.

---

## 7. What each choice absorbs, and which drawback it avoids

| Take | From | Drawback it avoids | Evidence |
|---|---|---|---|
| Parts attach physically; placement changes behaviour | Pathogenic | Spore's parts with fixed summed stats, so shape had no gameplay effect | [Designer Notes](https://www.designer-notes.com/spore-my-view-of-the-elephant/); [TechTimes](https://www.techtimes.com/articles/321705/20260727/pathogenic-sold-100000-copies-week-playing-disease-not-cure.htm) |
| One small tree per structure; keystones that change rules | Last Epoch | PoE2's weak +x% nodes, travel filler and planner dependence | [PC Gamer](https://www.pcgamer.com/last-epoch-puts-a-brilliant-new-twist-on-the-diablo-and-path-of-exile-skill-systems); [PoE forum](https://www.pathofexile.com/forum/view-thread/3674817) |
| Multiple starting regions on one readable map | Path of Exile | A tree so large it needs Path of Building | [Maxroll](https://maxroll.gg/poe/getting-started/passive-skill-tree-for-beginners) |
| Synergy via general keywords; one effect + one condition; ≤3 lines | Balatro | Bespoke item-to-item pairs that are wiki-dependent and rare in big pools | [LocalThunk](https://www.reddit.com/r/balatro/comments/1czo9g0/guidelines_for_joker_design/) |
| Pick-1-of-3 at every milestone; archetypes in batches; telemetry from day one | Slay the Spire | Untested dead options; cards nobody picks; post-launch balance shocks | [Game Developer](https://gamedeveloper.com/design/how-i-slay-the-spire-i-s-devs-use-data-to-balance-their-roguelike-deck-builder) |
| Order-sensitive program with modifiers | Noita | Noita's own opacity: rules that need a wiki. Ours is one sentence and visibly true on screen | [Noita wiki](https://noita.wiki.gg/wiki/Guide:_Wand_Mechanics) |
| Paired, exclusive, **refundable** meta-talents; opt-in stressors; death advances the story | Hades | Meta as stat padding; permanent-mistake anxiety; button-mashing | [Mirror](https://hades.wiki.fextralife.com/Mirror+of+the+Night); [Kasavin](https://inlander.com/culture/hades-writer-greg-kasavin-on-how-he-made-video-game-deaths-drive-a-feel-good-story-22725237) |
| Meta unlocks that add to the pool | Dead Cells | Meta that trivialises runs | [TV Tropes](https://www.tvtropes.org/pmwiki/pmwiki.php/VideoGame/DeadCells) |
| A small loadout budget plus an over-budget risk | Hollow Knight | "Take everything" trees with no identity | [Overcharmed](https://hollowknight.wiki/w/Overcharmed) |
| Unlock by doing, with progress bars shipped from day one | Factorio 2.0, Thrive 0.6.5 | Researching things you have never encountered; Thrive's own late tooltips; Kerbal's farmable biomes | [FFF #376](https://direct.factorio.com/blog/post/fff-376); [devblog 40](https://revolutionarygamesstudio.com/devblog-40-unlocking-potential/) |
| Alternate recipes found in the world, choose 1 of 2 | Satisfactory | Arbitrary recipes chemistry cannot explain (Subnautica's complaint) | [wiki](https://satisfactory.wiki.gg/wiki/Hard_Drive) |
| Visible chains whose bottlenecks are jams | Factorio | Lifecraft's factory menus instead of in-world visuals | [VaporLens](https://vaporlens.app/app/1839930/lifecraft.md) |
| ATP as a survival clock; engulfment as the route to organelles; a phylogeny view | Thrive | Empty voids, number-panel HUD, flat 100 MP per edit, irreversible over-specialisation | [Steam](https://steamcommunity.com/app/1779200/negativereviews/?browsefilter=toprated) |
| Movement that costs the resource you are growing | Osmos | Osmos' single mechanic with no build layer | [Osmos](https://en.wikipedia.org/wiki/Osmos) |
| Depth as player-chosen difficulty; a self-teaching world; no HUD | flOw | flOw's thinness: beautiful, no stakes | [flOw](https://en.wikipedia.org/wiki/Flow_(video_game)) |
| Knowledge as the only true progression; a rumour web; a world on its own clock | Outer Wilds | Unguided wandering with no breadcrumbs | [Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system) |
| Mystery on first encounter, clarity afterwards | Isaac Repentance+ | Isaac's years without item descriptions, which its creator calls its biggest flaw | [GamesRadar](https://www.gamesradar.com/the-creator-of-one-of-the-most-popular-roguelikes-of-all-time-is-using-his-new-project-to-right-11-year-old-wrongs) |
| The joy of combining, **with a clue layer and fixed recipes** | Cultist Simulator, Potion Craft | Cultist Sim's opacity; and a combinatorial fusion bench (cut, §3.9) | [retrospective](https://www.gamedeveloper.com/business/cultist-simulator-the-retrospective) |
| Trait value depends on rivals | Evolution (board game) | A single dominant strategy | [Opinionated Gamers](https://opinionatedgamers.com/2015/05/20/dale-yu-review-of-evolution-northstar-games/) |
| Real inheritance as strategy, with an **in-game** lineage browser | Niche; Mewgenics' failure | Breeding chores, poor tutorials, players resorting to spreadsheets | [VaporLens](https://vaporlens.app/app/440650/niche_a_genetics_survival_game); [Game Informer](https://www.gameinformer.com/review/mewgenics/a-tale-of-two-kitties) |
| Biochemistry drives behaviour; a kit that grows a community | Creatures | "A place to visit rather than a game"; and its suffering controversy — show hardship thoughtfully | [MIT Tech Review](https://www.technologyreview.com/2014/09/18/171315/a-grand-quest-to-create-virtual-life/) |
| The genome as a program; challenges that unlock genes | Cell Lab | A toolbox with no world or character | [Cell Lab](https://namu.wiki/w/%EC%85%80%EB%9E%A9) |
| Clade diagrams and catastrophes as tools | Species: ALRE | Observer-only agency; a CPU-bound sim capped near 500 creatures; silent abandonment | [Steam](https://steamcommunity.com/app/774541/negativereviews/?browsefilter=toprated) |
| Scenario packs, a Workshop, data as drama | Plague Inc | Early losses decided by luck (the Greenland problem); a repetitive loop | [VaporLens](https://vaporlens.app/app/246620/plague_inc_evolved) |
| One readable tension to sell the game on | Plague Inc's infectivity-versus-visibility | A systems game nobody can summarise | Express versus Expose (§1) |
| A story that explains the unlock order | CellCraft | Its interface and pacing problems | [Game Developer](https://gamedeveloper.com/game-platforms/analysis-golgi-bodies---storytelling-in-i-cellcraft-i-) |
| A legible map of progress with a fact on each unlock | Cell to Singularity | Linear unlocks with "no real choices"; F2P pressure | [Steam](https://steamcommunity.com/app/977400/negativereviews/?browsefilter=toprated) |
| Visible transformation on every pick; a codex; a convergent-evolution joke | Everything is Crab | Parts that are only stat sticks; grind-to-afford loops | [GamingOnLinux](https://gamingonlinux.com/2026/05/everything-is-crab-is-a-genius-and-silly-roguelite-about-creating-a-total-abomination) |
| Body logic and a build-testing sandbox | Primordialis | **No autopsy or damage log**; penalties that discourage experimenting | [VaporLens](https://vaporlens.app/app/3011360/primordialis) |
| Roguelite runs plus a meta tree, with a pre-launch demo | Pathogenic | RNG-decided builds, meta that slows sharply, environmental deaths, red-on-red bosses | [Steam](https://steamcommunity.com/app/3808690/negativereviews/?browsefilter=toprated) |
| Documented compromises and thrilling failure | Kerbal | Farmable discovery turning exploration into grind | [KSP forum](https://forum.kerbalspaceprogram.com/topic/108851-cutting-down-early-game-science-grind) |
| Interlocking systems that affect one another | Oxygen Not Included | ONI's overwhelming start — so we introduce **one new currency per drop**, and the Program tier is opt-in | [summary](https://vaporlens.app/app/457140/oxygen_not_included) |
| A calm watching mode | Equilinox, Abzu | Running out of content and going inactive | [VaporLens](https://vaporlens.app/app/853550/equilinox) |
| Real sequences and real puzzles as prestige | Foldit, Eterna | Puzzle UIs only experts can read | [ScienceDaily](https://www.sciencedaily.com/releases/2011/09/110918144955.htm) |
| Honesty as a feature | Spore's cautionary tale | Being marketed as accurate and then graded as inaccurate | [Game Developer](https://www.gamedeveloper.com/game-platforms/gdc-lessons-learned-from-i-spore-i-its-science-and-more) |
| Visible, regular updates with a published cadence | Species, Equilinox | "Last update over four years ago"; 38 "abandoned" mentions | [Steam](https://store.steampowered.com/app/774541/) |

---

## 8. Build order from the current prototype

### 8.1 What exists, and what it becomes
| In the code today | Becomes |
|---|---|
| `src/cellpass.js` — every cell raymarched as one volume, with nucleoid, **plasmid**, granules, TCA swirl, glycolysis strand, receptor lattice, periplasmic proton glow, endocytic vesicles | The entire diegetic UI. The plasmid is the transfer loot; the proton glow is the health bar; the glycolysis strand already runs a wave of light |
| `MAX_DENTS = 2` membrane pockets pushed inward along the normal, with meshes riding the same warp (`src/materials.js`) | Envelop and hit dents. Needs ~6 for the digestion tier; the mechanism is done |
| `MAX_GRANULES = 6`, `MAX_VESICLES = 2`, `MAX_RAFTS = 8` | Storage nodes, digestive vacuoles, membrane patches where complexes gather |
| `uTurnW[i].w` — a per-cell proton glow | H⁺, already a renderable per-cell quantity |
| The **`Complexes`** class (`src/bacterium.js:463`): one `InstancedMesh` per complex kind, per-site flash, rotor spin | **The single most valuable asset.** "One node = N more visible pumps, placed here" is an instance count and a position, so the expression pipeline's payoff is nearly free |
| `src/hud.js` — no screen-space HUD: vitals ring, scale bar, inspect tags in the water | Pillar 1, already shipped |
| `Tab` inspect: slows time to 0.25×, moves in close, labels parts | **The Atlas entry point.** Keep pushing in and you are reading the chromosome. No evolution menu, ever |
| `src/water.js` — light from above, caustics, particles with depth of field, light shafts, a 1 µm scale bar | The dew clock (sun angle and warmth are uniforms), the lens hot spot (heat) and a hair-held bead's own UV focus as travelling caustics, the shadow map (leaf hairs, the glass's rim, the child's head) and the crowd-driven oxygen field of §4.1, plumes |
| `src/lens.js` — fringing, vignette, grain | The instrument ladder: each instrument is this pass plus one shader |
| `src/palette.js` — Goodsell biology, Holarky interface | Colours already exist for plasmid, glycogen, polyphosphate, receptor, vesicle, complex I, *bo₃*, ATP synthase, metabolites |
| `src/neighbours.js` — rods that run and tumble, drifting cocci | The ecology's first rung: kin, rivals, the Red Queen |
| `src/metabolism.js` — the energy route drawn and running: glucose → pyruvate, TCA, NADH, QH₂, H⁺, ATP, O₂ and fermentation, with motor power gated by it | The brief's visible energy route; the installed form of the start nodes in groups C and M (#28, #29, #31, #141) |
| `src/feeding.js` — food particles, a membrane pocket, engulf on **R** with an in-water "R · engulf" prompt | Envelop tier I (#79). The clean-seal hold-and-release (§2.1) is its first extension |
| `src/player.js` — run/tumble, no coasting, `motorPower` gated by metabolism | The seconds layer. **Note:** remove `ShiftLeft/ShiftRight` from the sink binding (line 72) only if we later want Shift; Burst is on right mouse either way |

### 8.2 Milestone zero is done; two milestones in parallel

**M-fix — done.** The earlier milestone zero was "make the tree build". It has landed: `src/metabolism.js` and `src/feeding.js` exist, `Hud.update(dt, camera, player, mState, fState)` matches the call in `src/main.js`, and `vite build` succeeds (re-checked in the critique pass, §0). The energy route is drawn and a first engulf works on R, so the next milestones start from a running prototype.

**M0 and M1 run in parallel**, because the two biggest risks are independent and both must be answered early.

**M0 — Feel (2–3 weeks).** Forms, Envelop with the full viscous-juice kit (extending `feeding.js`'s engulf on R to hold-to-reach, release-to-seal), tumble and Burst feel, lens pulses, the wet pop, the ring wave on install. **The gate: does swallowing a coccus feel good fifty times in a row?** If not, nothing else matters.

**M1 — The expression pipeline, end to end (3 weeks).** One gene: a second flagellar motor. Select it on the Atlas (inspect, pushed further in) → polymerase runs → mRNA spools → ribosomes queue and the proteome ring shifts → the protein installs at a pole you chose → the cell visibly swims differently → it dilutes and you must re-express. **The gate: is this thrilling on its own?** If it is not, the whole design is wrong, and we learn that in week six rather than year two.

### 8.3 The vertical slice — "Dawn to Rim in One Drop" (~18 min)
1. **The expression pipeline** (M1), generalised to 44 genes across twelve groups (A–K and M), at least three per group (the ★ nodes in §3.7). Group M's three are the ribosome fleet and the ATP synthase the pipeline already draws, plus MreB, which Rebuild the Wall needs.
2. **The seconds layer tuned** (M0): chemotaxis on a real gradient with the temporal readout, three forms (Rod, Sphere, Sheet), Envelop tiers I–III, Secrete, the H⁺ cost of Burst.
3. **The Array**: six cassettes, order-sensitive expression, visible polymerase run-down, one integrase reshuffle under stress.
4. **One Atlas locus in full — Membrane and Envelope** — because it is the hero's identity and the renderer already draws it: valves, osmolytes, porin density, the maltose gate, capsule, decoy vesicles, tubulation, and the **Rebuild the Wall** keystone. The rest of the Atlas is fogged.
5. **Division as a draft**: blebbing you sculpt, three daughters with stated mutations, the unmutated option, the Blob fallback, and the unchosen daughters persisting as kin — **and as your extra lives**.
6. **Seven currencies live:** H⁺, ATP, membrane, proteome, osmolarity, DNA, exposure. One new currency introduced per phase of the morning.
7. **Three threats and two bosses:** a chemotactic grazer that climbs your leak plume; one lytic phage clade that adsorbs to the porin you have been leaning on; a plasmid-carrying rival you can read and raid. Bosses: **The Mouth** (with the food-vacuole escape and the macrostome flip) and **The Rim** finale with three exits, in its hair-held shape — the shrinking sphere — because the opening's bead rests on hairs (story §5.2). The pinned rush arrives after the slice, with the tooth-tip beads.
8. **The osmotic dew clock**: evaporation concentrates, a rain event dilutes, the valve node is the answer. The slice's mid-point climax.
9. **Autopsy** — ten-second replay, named mechanism, flux diagram, the one gene that would have saved you, one codex line. **Non-negotiable.**
10. **Codex stub** (15 entries with badges and sources), the **Notebook's first corrected sketch**, and **one** unlockable instrument (fluorescence), so progression-as-revelation is proven early.
11. **Telemetry and the accessibility baseline**: pick rates and death causes logged; speed slider; no colour-only information; flash limiting.
12. **A greybox opening**: the 90-second dive using the existing renderer and scale bar.

**Acceptance targets, measured in playtest:**

| Target | Why |
|---|---|
| Control within **10 s** of launch | The refund clock and the opening's job |
| First Envelop within **30 s**; first install spike before **1:45** | Pathogenic/Spore-style immediacy |
| ≥5 visible morphology changes per run | Pillar 1 |
| Median run **16–20 min** | Session shape |
| **≥85%** of testers can name their cause of death after the autopsy | The Primordialis gap, closed and measured |
| **No gene picked in more than 60%** of the drafts it appears in | No dominant build |
| ≥70% of new players notice the wall-less cell is different without being told | The opening works |
| At least one "I discovered something" moment every **5 minutes** (self-report plus first-Read events) | Pillar 1 and discovery |
| **60 fps** on a mid-range GPU at the slice's peak crowd | The genre's most reliable failure mode |
| A new player can **name their own build's identity** after one run | The Atlas is not a planner game |

### 8.4 Order after the slice
1. Trigger unlocks and potentiation, with visible progress bars and hints.
2. A second Atlas locus (Movement) plus sigma stances; the Red Queen ledger shown openly.
3. Gene transfer in full: eDNA Read/Eat, conjugation and raiding, transduction and prophage pacts, Dissect, integrase reshuffle.
4. Habitat two — **leaf veins and the stoma** — plus The Gate and The Sleeper; the pinned Rim (tooth-tip beads, vein runnels) with Marangoni Surf; the leaf as the run map; Expeditions of three drops; relative fitness *w* and the ancestor ghost.
5. The instrument ladder (phase contrast, stain, structure, sequencer) and the Tangled Tree outer ring with transfer threads.
6. Strain codes, the Daily Drop, the Petri Lab — cheap, and they drive word of mouth with no backend.
7. Habitat three — **the puddle** — plus The Colossus and The Shelled Phage; the engulf ladder's top tier; the domestication arc; biofilm and the chorus.
8. Campaign Acts II–IV (Film, Storm, Dusk; Act I rides on the slice) with their hubs and watcher events, and the Act-closing Notebook spreads for G. Then **Recode** and the Act III fork, and the three launch endings: Armour and Stop first, because they need no new technology, and the Seen pull-out last (story §6.5).
9. The Regulation Lab, Experiments with histograms, Micrograph mode.
10. Post-1.0, each update shipped as "a new summer": first Phase 4, multicellularity (story §3.7); then more habitats (soil, cloud, salt crust), the oxygen epoch, async features in the §6.3 order, the Commons Tree, Workshop.

### 8.5 Scope risks, honestly
| Risk | Severity | Mitigation |
|---|---|---|
| **Raymarched cell count.** `MAX_CELLS = 12` against an ecology of dozens of lineages. Performance at scale is the genre's most reliable failure: Thrive drops an hour in, The Sapling hits single-digit fps, Species is capped near 500 creatures, Pathogenic has 20 logged "lag" mentions | **High** | A three-tier LOD decided **now**: raymarched volumes for the nearest ~12; cheap instanced impostors for the mid field; a **non-rendered statistical layer** for colonies and rival populations — which is also where the four ecology engines actually run. Bosses as near-field terrain, phages as instanced meshes (§4.3). A performance pass per milestone, with published internal frame-time targets |
| **Regulation overwhelms players** — ONI's documented problem | **High** | Two tiers only in the main game (presets, one-cable patch, stances). The Program tier is an optional Lab. One new currency per drop. Hint-writing budgeted from the start, which is the explicit Cultist Simulator lesson |
| **The Atlas becomes a planner game** — PoE's fate | Medium | Hard caps: <250 stars (§3.7), ≤20 per locus, **no travel nodes**, every node changes behaviour, the ring comprehensible at one screen's zoom. Gate: a new player names their build after one run |
| **The install reads as waiting** | Medium | 3–8 s, never minutes; something is always happening *during* it; inspect/slow-time always available; multi-minute latency reserved for megaprojects. Gate: players describe the wait as "committed", not "stalled" |
| **148 nodes and 85 mechanics is more content than a small team can finish** | **High** | The node list *is* the 1.0 target, not a menu: 44 in the slice, ~150 cards and <250 stars at 1.0, three habitats, **one** coherent stage. Keyword design keeps synergy work linear instead of quadratic. Thrive's own Steam page estimating "roughly 120 months" to completion is the artefact to pin on the wall |
| **Honesty debt.** Mislabelling invention as fact is the one reputational risk this project cannot absorb | Medium | A badge and one source on every node, reviewed by a named biology owner before it enters the build; a visible "Where we cheated" page; the **†** list in §10 cleared before those claims reach the codex |
| **Dual-use caution** | Low but real | No sequences, no construction detail, nothing protocol-shaped. Resistance, virulence and the Recode keystone stay at the level of published, citable outcomes. Already observed throughout this document |
| **Early Access silence** | Medium | A published update cadence; balance staged on a beta branch with notes; under-promise in marketing (Spore's previews) |

---

## 9. The opening and the grand storyline framework
*The story track owns the full treatment (`docs/design/story.md`). This is the frame the gameplay needs, and the two must agree on it. §9.2–9.3 follow story §3–4; where the two word the opening differently, story §5.1 gives the build values.*

### 9.1 The opening (~90–120 s, interactive throughout)
The owner's seed image — a child with a magnifier over a dew drop on a leaf — is kept, and made load-bearing: **the watcher is an instrument, and instruments are this game's progression.** The opening teaches the three things the whole game is made of, with no words.

1. **Black, pre-dawn birdsong, one drip.** A hairy leaf beaded with dew. A hand brings in a round reading glass, and **the cursor is the glass.** Control inside ~8 seconds.
2. **Focus is the first verb.** Hovering a drop shows it in sharp magnification, with the watcher's own tiny inverted reflection inside it. Clicking chooses the drop — **and seeds the run.** Scrolling pushes in at a steady ~3 s per power of ten, with the prototype's in-world scale bar ticking from 1 cm to 1 µm (Powers of Ten's pacing).
3. **The optics are honest, and the honesty is the hook.** The glass gives up: as the frame shrinks toward 0.2 mm the magnifier's image goes soft, because a magnifier genuinely cannot resolve a bacterium. The naked eye resolves about 0.1 mm at reading distance ([Naked eye](https://en.wikipedia.org/wiki/Naked_eye)), and a magnifier only enlarges the angle an object fills ([Magnifying glass](https://en.wikipedia.org/wiki/Magnifying_glass)), so the 10× loupe that story §5.1 builds resolves about 10 µm (the eye's 0.1 mm divided by 10; story shot 5): still five to ten times too coarse for a 1 × 2 µm cell. The rim slides away and **the drop itself becomes the lens**, which is real history: a water-globule microscope was published in 1696 ([Gray 1696a](https://doi.org/10.1098/rstl.1695.0040), [1696b](https://doi.org/10.1098/rstl.1695.0058)), and the first human report of "little animals" in rain, well, sea and snow water came in 1676 ([Leeuwenhoek, *Phil. Trans.*](https://doi.org/10.1098/rstl.1677.0003)). **The limit of the instrument becomes the promise of the campaign.**
4. **The hero is noticed, not labelled.** Among neat walled rods, one cell wobbles like jelly. Nothing names it. Resting your view on it hands over control.
5. One glucose bead, one swim, the ATP ring filling, and the title floating in the water to swim through — which the prototype already does. Skippable on every replay.

### 9.2 Two devices that bind the watcher to progression
- **The Notebook: *What I saw — for G.*** (story §4.2). The child writes it for G., an old person whose sight is failing, and it is the game's only text register: the codex and the manual at once.
  - **The First Sketch.** At the end of run 1 the Notebook opens on its first page, a drawing of a falling tear, which plays *The first morning* (story §5.1). The child's early drawings are charming wrong guesses — castles, monsters, a smiling blob. **Every codex discovery corrects a sketch**, so the pages visibly grow up from guesswork to science: microbiology's own path, retraced by the player's own findings.
  - **Genes give words back.** Where the child did not know a word, the page shows a gap written as codon triplets; the first time you express the gene, the gap retranslates into the word.
  - **Each act closes on a spread the child writes for G.**, assembled from *your* findings. The spreads are the save summaries and the share cards. The handwriting grows bigger week by week, because G.'s eyes are going. Cheap to produce, and they make the frame pay rent.
- **Sightings: being seen** (story §3.2). A rare behaviour that happens while the lens shadow lies over the meniscus — a first division, a conjugation bridge, a phage burst, a biofilm sheen, a pigment — becomes a Sighting: a Notebook page and a knowledge gate that opens Atlas stars (§3.3). The plumes, signals and pigments that catch the child's eye also draw predators and phages: ***be seen by the large; hide from the small*** — Express versus Expose, at the scale of the frame.

### 9.3 Three clocks, four acts, one line
**One bead's morning · one summer · deep time** (story §3.1). And in one line: *a cell that lost its armour starts down the road that once led to complex life, watched by someone made of what that road became.*

| Act (story §3.4) | Phase | Habitats (§4.1) | Atlas sectors it opens (§3.7) | The question |
|---|---|---|---|---|
| **I — Dew** (early summer) | 1: the cell — the evolution tree on everything | Dew beads: cup, hair-held, tooth-tip | Every single-cell sector: membrane and envelope, movement, energy, senses, defence, feeding, gene regulation, reproduction, expression and genome machinery (A–E, G–I, M); Read and Eat | Why is this one cell soft, and why is it alive? One cause, the tear, answers both, and the player works it out |
| **II — Film** (high summer, heat) | 2: the colony | The same beads, drying faster | Communication, survival forms, offence (J, K, F); conjugation | What can many of you do that one cannot? The colicin rivals, and a sheen the child can really see |
| **III — Storm** (late summer) | 3: partners and the wider world | Adds the leaf veins behind the stoma (The Gate), and the puddle in the pot's saucer | The engulf ladder's top tier and Keep; syntrophy; transduction and the phage arms race; invented and road-not-taken structures (L), Recode among them | Stay open, or close? And how did a gut-type rod reach a leaf? (A soil splash; Codon staging) |
| **IV — Dusk** (the last week) | A finale on Phase 1–3 systems; no new phase | All three, at dusk and on into the dark | None new: lux (#120) arrives by gene transfer | Can the smallest thing in the garden become visible? |

**Act III's fork has two doors** (story §3.4): **the Stranger**, the archaeal syntroph of §4.2 (be taken in, or take it in), and **Recode** (§3.8: close the code, or stay open). Either door clears the act, and a player may go through both.

**The climax is a mechanic, not a cutscene.** The colony crosses **Visible** — about 0.1 mm, the naked eye's limit, read off the scale bar — takes lux by gene transfer, reaches quorum, and carries the glow on into full dark. **The thematic choice is a gameplay choice**: Recode.

**Three endings at launch**, all lineage outcomes and never dialogue choices (story §4.4). If more than one is earned, Seen wins.

| Ending | Reached by | Last image |
|---|---|---|
| **Seen** (the true ending) | The glow in full dark, above | The child guides G.'s hand to cup the leaf. The camera pulls out of the colony along the light into G.'s eye, through the clouded lens and into a rod cell, where one mitochondrion's ATP synthase turns like the hero's — the same machine in a smaller gear, a ring of eight against the hero's ten (#141, **†**), and the codex says so. The UGA card reads *stop* in the hero's code and tryptophan in the vertebrate mitochondrial code. An honesty card says plainly that the hero's arc **rhymes** with the origin of complex cells and does not re-enact it: the real host was archaeal, not a bacterium like ours ([Eme et al. 2023](https://doi.org/10.1038/s41586-023-06186-2)). Closing line: ***Your eyes are full of them too. Once bacteria. Kept.*** |
| **Armour** | A closed lineage alive on the last morning: Recode's Swap made, or the wall rebuilt and kept. It absorbs the earlier "Fortress" ending | The jar on the sill, and *"I can't find the soft one anymore. Maybe that's good."* The UCA card: serine in every other cell, leucine in yours |
| **Stop** | The summer runs out on an open lineage, or every lineage, jar included, ends | Morning light through the jar; UGA stays *stop*. New Game+ is offered from the jar |

Later summers add **Taken In** (where the earlier "Partnership" ending's partner story went), **Rain** and **Last**.

**Scope: Phase 4, multicellularity, is not in 1.0** (§4.1). It ships as the first "next summer" (story §3.7).

**Death advances all of it.** A lysed lineage leaves DNA in the water that a later lineage can take up — an Inscryption-style death card that is also a real phenomenon for wall-less cells: L-forms of the actinomycete *Kitasatospora viridifaciens*, not *E. coli*, take up external DNA ([Kapteijn et al. 2022](https://doi.org/10.1038/s41467-022-33054-w)).

***Rewrite life.*** stays the store line and the title the player swims through at the end of the opening (story §5.2, shot 8). The game's last words belong to Seen.

**The watcher across summers.** One child of about nine, ungendered and never named, shown only through hands, a sleeve that changes with the season, breath and shadow. Each New Game+ summer the child is a year older; after several summers the grown child hands the lens to another child (story §3.7, §4.1).

---

## 10. Open questions and the claims to clear before shipping

### Claims marked † — confirm before they reach the codex
Multifork replication figures and origin-proximal gene dosage (the C and D periods); compatible solutes and trehalose in bacteria; cardiolipin pole localisation; high-load and sodium stator variants; the flagellar flick; cooperative receptor arrays; thermosensing by chemoreceptors; surface-charge tuning against cationic peptides; small regulatory RNA silencing; peptide signalling as a private channel; cheater policing; carotenoid photoprotection in open sun on a leaf; *Azotobacter* cyst UV figures; intracellular survival of a food vacuole; the self-destruct sentinel paper (Cohen et al. 2019) and its relation to animal innate immunity; vesicles as phage decoys beyond the one paper cited; ATP synthase reversal as a vacuole acidifier; silent flagellin as a route past the plant's sensor.

Added in the critique pass: the receding contact line of a hair-held bead and the concentration of cells and salt toward its centre (§2.4), and that a tooth-tip bead stays pinned (staging); whether the *Tetrahymena* macrostome still takes bacteria, and how long the transformation takes (§4.3); *Uabimicrobium*'s wall; the c-ring figures (*E. coli* c10, animal mitochondria c8; Watt et al. 2010) and the claim that a bigger ring keeps turning at a lower gradient (#141); that hibernating ribosomes speed the first install after a famine (#140); the growth cost of rifamycin resistance (#142); the laboratory *E. coli* with a second origin (#144). The biology owner should also confirm group M's framing as a whole, since its hooks were checked against reference pages rather than primary papers.

Added in the second critique pass: **whether a wall-less cell can power a flagellum at all** (§2.1, #15). The hero's default movement and the opening's run-and-tumble assume it can. UniProt and InterPro say MotB anchors the stator to the wall, but UniProt says "probably", and no primary paper on MotB's peptidoglycan-binding domain could be opened. The biology owner must read one, and look for any L-form or spheroplast seen to turn a flagellum. If none has, #15 is **INV** for the naked hero rather than RX, and the honesty card stays. Polar Anchor (#148) is INV either way; that its trade-offs (rigid poles, motors fixed to the poles) follow from a polar scrap of wall is ours.

Added in the consistency pass: that no bacterium is known to keep a partner it engulfed (#85, §3.9, story §3.5). The one known bacterium-in-a-bacterium, *Moranella* inside the mealybug's *Tremblaya*, now rests on the primary papers: von Dohlen et al. 2001 by its abstract (the paper itself could not be opened) and Husnik & McCutcheon 2016, fetched. That its guest invaded rather than being engulfed, and that the insect makes *Tremblaya*'s envelope, are those authors' inferences; the biology owner should confirm the codex words them as such.

Added in the hot-spot pass: how strongly a hair-held bead concentrates sunlight inside itself, toward its underside, rather than only at its focus on the leaf below (§4.4). Egri et al. 2010 is cited through a press summary that does not mention UV, so the biology owner should read the paper and set the in-drop UV dose the Sleeper's trigger is tuned to.

Added in the strata pass (§4.1): the **oxygen estimate as a whole** — the codex may not state it until the biology owner has checked the formula's use for a drop (Stewart's is for a flat slab of biofilm), the inputs and the arithmetic; its conversion to cells per mL, which hangs on whether Stewart's 12 mg cm⁻³ is dry or wet mass; whether any real dew drop gets crowded enough to go anoxic (research §8 lists dew's own microbiology as unresearched); how much UV leaf leachate absorbs in dew; and how strong a nutrient gradient leachate makes above the cuticle.

Added in the Colossus pass (§4.3, #129): the ~10 µm size of a feeding *Dictyostelium* amoeba (a typical figure the reference page does not give); whether *Chaos* turns up in puddles (the reference page names no habitat); and how *Chaos*'s vacuole treats a swallowed bacterium (the Jeon precedent is from *Amoeba proteus*, a different large amoeba).

**R+ audit.** §0 now limits R+ to genes or clusters with a real transfer precedent. Endospore, Cyst Coat, Fruiting Body, Polyploid Vault, Multiple Genome Copies, Shatter Repair and the Cable union were re-badged RN, and Don't-Let-Go RX. Still to check against the rule: Hopanoid Stiffener, Stator Load, Sodium-Driven Motor, Reverse-and-Flick (a mechanical property of a polar flagellum as much as a gene), Gas Vesicles, Swarm Slick, Reaction Centre, Carboxysome, Encapsulin, Sulfur Oxidation, Nanowire, Methanol Oxidation, CBASS, Silent Flagellin, Type VI Spear, Tailocin, NRPS, Vacuole Resistance, Autoinducer + Receptor, Electrical Wave, Gene Broadcast, Sunscreen Pigments and Ice-Nucleation Protein. Each needs a named transfer precedent or a new badge.

### Design questions for the owner
1. **Is "Express versus Expose" the line we sell the game on?** The alternative is "size versus osmotic fragility". This document assumes the first.
2. **Colony versus colony:** confirmed as later async ghost colonies with colicin rock-paper-scissors, not real-time PvP. Is that acceptable?
3. **The watcher:** story.md has chosen hands, shadow and reflection only: an ungendered child of about nine, never named, no face (story §1, §4.1). If the owner prefers a boy, nothing breaks. Confirm.
4. **Invented structures:** is the small curated set (Harpoon, Seed Pod, Digestive Vacuole, Hypervariable Turret) the right ceiling, now that the open fusion bench is cut?
5. **Biology owner:** who signs off on badges? Nothing with a † ships until someone does.
6. **The 1.0 campaign:** four acts; Phase 4 (multicellularity) held back as the first "next summer"; three launch endings (Seen, Armour, Stop). Both documents now assume this. Confirm.
7. **The tree:** you asked for an evolution tree; §3.1 makes the Wheel the primary view and gives the per-organelle trees as the organelle lens. Confirm, or make the lens the default view.
8. **Controls:** Envelop stays on R as built, Secrete moves to X, the camera keeps left-drag and Burst takes the right button (§2.1). Confirm before M0 tunes the feel.

### Standing rules this document commits us to
- Every node has a visible installed form, changes a verb, carries one badge and one source.
- The autopsy ships in the slice.
- No points shop, no abstract currency, no flat mutation-point budget.
- No real-time PvP, no free-text chat, no forced accounts, no Nemesis-style hierarchy.
- No sequences, no construction detail, nothing protocol-shaped — ever.
- Under-promise the roadmap; ship the slice deep.
