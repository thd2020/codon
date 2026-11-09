# Codon: storyline framework and opening animation

*Design document, v1 scope. The spine is "The Lens and the Tear". Grafts come from "The Unbroken Line" (lineage systems, deep time) and "The Kept" (key images, the ending's eye, build discipline). The judged cuts are applied and listed in section 8.*

> **How this was checked.** This document builds on `docs/design/research.md` and the three judged proposals. The workflow's shared web-search budget had run out, so each fact new to this document was checked by opening a primary or reference page directly. Every claim carries its source inline. Where a source could not be found, the text says so, and the in-game badge reads **Codon staging** or **Codon invention**. Numbers marked *estimate* are worked out here from the cited values.

## Contents
0. [The whole thing on one page](#0-the-whole-thing-on-one-page)
1. [The owner's seed, and what became of it](#1-the-owners-seed-and-what-became-of-it)
2. [Logline, theme and emotional promise](#2-logline-theme-and-emotional-promise)
3. [The grand arc](#3-the-grand-arc)
4. [Presences, voice, motifs and endings](#4-presences-voice-motifs-and-endings)
5. [The opening animation: shot list](#5-the-opening-animation-shot-list)
6. [How to build it in three.js (`src/intro.js`)](#6-how-to-build-it-in-threejs-srcintrojs)
7. [Honesty cards](#7-honesty-cards)
8. [Cuts applied, and what waits for polish](#8-cuts-applied-and-what-waits-for-polish)
9. [As built (prototype)](#9-as-built-prototype)

---

## 0. The whole thing on one page

- **The image.** It is the first morning of summer, at dawn. A child sits on the back step beside a potted lady's mantle. In their lap is a brass hand lens that belonged to someone else. A tear falls into a bead of dew on a leaf.
- **The science under it.** Tears contain lysozyme and lactoferrin and are about as salty as blood plasma ([Tears](https://en.wikipedia.org/wiki/Tears)). Lactoferrin and lysozyme together kill *E. coli*. The killing works through osmotic damage: cells swelled at 40 mOsm, and higher osmolarity blocked it ([Ellison & Giehl 1991, *J Clin Invest* 88:1080](https://doi.org/10.1172/jci115407)). The mixed bead is mostly dilute dew, so it is hostile. The only shelter is the **salt front**: a broad band of tear water, about half a millimetre across, that has not yet mixed. Real stirring would erase it in seconds to minutes; Codon stretches it (**Codon staging**, §3.1). One rod sits in the front's gradient. Its wall gives way, it squeezes out, and it lives, while the walled rods out in the mixed water swell and fade. **You are that cell.**
- **Two mysteries, one cause.** The hero has two puzzles: why it is soft, and why it is alive. One cause explains both. The player works it out through play and is never told.
- **The frame.**
  - The child's habits are weather on a schedule you can learn.
  - Being seen by the child is the meta currency.
  - The child's instruments are the game's view modes.
  - A jam jar on the sill is the lineage freezer and the hub between drops.
  - Act III's fork asks the theme's question twice: the **Stranger** (be taken in, or take it in) and **Recode**, the keystone the game is named after (close your code, or stay open).
  - Endings come from what your lineage became.
- **Launch scope.**
  - One summer, four Acts. Acts I–III map to gameplay Phases 1–3 (the cell, the colony, partners and the wider world). Act IV, Dusk, is the finale, built from those same systems.
  - **Phase 4, multicellularity, is not in 1.0.** It ships as the first "next summer" (§3.7), which keeps gameplay's "one stage deep" rule (gameplay §4.1).
  - Three endings at launch: **Seen**, **Armour** and **Stop**.
  - Three more endings ship as "next summer" updates.
- **The opening.**
  - One continuous shot with no cuts, about 70 s long.
  - The mouse gives parallax from 0:05, the player holds the lens at **0:08**, and the hero is under control at **0:46** at the authored pace. These are the numbers gameplay §8.3 and §9.1 and research §3.4 and §6.1 already use: control within 10 s, at about 8 s.
  - The tear is not shown on first launch. It reaches the player at the end of run 1, on the notebook's first page, as **The first morning** (shots 1–3, §5.1).
  - Its last frame is the prototype's own first frame: `camera (5.6, 1.8, 2.1)`, `FOV 42`, `OrbitControls` target on the hero (`src/main.js`).

---

## 1. The owner's seed, and what became of it

The owner offered this idea modestly: *a boy using a magnifier to watch a dew drop on a leaf.*

**What we kept, as written.** The game's first living image is the seed exactly: a leaf, a dew drop, a child and a magnifier. Every run starts from that same image too. The run-select hub (shot 4 of the opening) is a hand holding a magnifier over a leaf beaded with dew. The magnifier is the cursor, and choosing a drop chooses the run. The seed belongs to a proven tradition of scale stories anchored on a living, human-scale subject:
- *Powers of Ten* opens on a picnic.
- *Cosmic Zoom* opens on a boy and his dog.
- Boeke's *Cosmic View* opens on a girl holding a cat.

([Powers of Ten](https://en.wikipedia.org/wiki/Powers_of_Ten_(film)); [Cosmic Zoom](https://en.wikipedia.org/wiki/Cosmic_Zoom); [Cosmic View](https://en.wikipedia.org/wiki/Cosmic_View)). We did not replace the seed. We gave it a cause and consequences.

**What we changed, and why.**

| Seed | Codon | Why |
|---|---|---|
| A boy | An ungendered child of about nine. We see only hands, breath, a shadow, and an upside-down silhouette inside the drops. | Journey aimed for a figure that is "genderless and ageless" ([Game Developer](https://gamedeveloper.com/audio/video-designing-a-new-emotional-experience-in-i-journey-i-)). This also defuses the "boy + magnifier + sun = burning ants" reading flagged in research §3.6, and it avoids the cost of faces. If the owner prefers a boy, nothing breaks. The rules that matter are **no face and no cruelty.** |
| Watching | Watching, **plus one tear** | One gesture ties the watcher to the watched. It explains the hero's defining trait with real biology (lactoferrin, lysozyme, salt) and tells a story without a word. |
| A magnifier | A worn brass 10× loupe, an heirloom scratched "G." | It belonged to G., an old person whose sight is failing. This brings in the theme of inheritance, and it makes the codex a set of letters written for someone who can no longer see small things. |
| Seeing bacteria through it | **It cannot.** The naked eye resolves about 0.1 mm ([BBC Science Focus](https://www.sciencefocus.com/the-human-body/how-small-can-the-naked-eye-see)), and a 10× loupe about a tenth of that. | The opening shows the glass giving up, and the dive goes on without it. Real seeing comes later: the child's instruments improve over the summer and become view modes. |
| A leaf | Lady's mantle (*Alchemilla*) | Its leaves are softly hairy and strongly water-resistant, with small teeth at the tips ([Alchemilla](https://en.wikipedia.org/wiki/Alchemilla)). Alchemists took the beads for the purest water and used it in their quest to turn base metal into gold, which gave the plant its name ([Alchemilla mollis](https://en.wikipedia.org/wiki/Alchemilla_mollis)). That quietly rhymes with *Rewrite life.* Drops held up by hairs can focus sunlight onto a leaf ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)), so a bead's own burning-glass focus is honest on this plant, and being water it passes UV too (§3.2). |
| A dew drop | The dew drop as a world, a lens and a clock | A water sphere is a ball lens ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)). Stephen Gray published a microscope whose lens was a globule of water in 1696 ([Gray 1696a](https://doi.org/10.1098/rstl.1695.0040), [1696b](https://doi.org/10.1098/rstl.1695.0058)). One drop's morning is one run. |
| (Implied: the child is outside the story) | The child is weather, never a god or a saviour. At the end the gaze turns round: the colony's light travels into an old eye. | The world runs on its own clock, as in Outer Wilds ([Game Developer](https://www.gamedeveloper.com/design/live-die-repeat-how-i-outer-wilds-i-piques-curiosity-in-an-ambivalent-solar-system)), and we avoid Horton's saviour giant. *Contact* showed that an outward move can be a revelation ([Art of the Title](https://www.artofthetitle.com/title/contact/)). |

The credit line for the team: **Codon's opening image is the owner's. We added one tear, one old lens, and the honest physics between a child's eye and a cell.**

---

## 2. Logline, theme and emotional promise

**Logline.** *On the first morning of summer, a child's tear falls into a bead of dew, and one bacterium inside it loses its wall. You are that soft, unarmoured cell. Over one summer of mornings you rewrite it, gene by gene, into a lineage, a colony, a partnership and finally a light. On the other side of the glass, a child is learning to see for someone whose eyes are going dim.*

**Store line.** *A tear fell into a dew drop. Something inside lost its armour. Rewrite life.*

**Theme: openness is how life gets rewritten.**
- **The hero.** Losing the wall lets the cell take things in: food, DNA and partners. Wall-less L-forms divide by making excess membrane ([Mercier et al. 2014](https://pmc.ncbi.nlm.nih.gov/articles/PMC4244569)) and, in the actinomycete *Kitasatospora* (not *E. coli*), take up DNA by an endocytosis-like route ([Kapteijn et al. 2022](https://doi.org/10.1038/s41467-022-33054-w)). The planctomycete *Gemmata* engulfs proteins ([Lonhienne et al. 2010](https://pmc.ncbi.nlm.nih.gov/articles/PMC2919973)).
- **The child.** The child is closed up in an unexplained sadness and opens up by looking, then by writing down what they see for someone else.
- **G.** G. is losing their sight and opens their hand to pass the lens on.
- **Inheritance.**
  - The lens is an heirloom.
  - The hero's ribosome, ATP synthase and proton gradient are heirlooms too. ATP synthase "is present in all organisms studied", and its conserved gene order implies it predates the last universal common ancestor ([ATP synthase](https://en.wikipedia.org/wiki/ATP_synthase)).
  - The watcher's own mitochondria came only from their mother ([Human mitochondrial genetics](https://en.wikipedia.org/wiki/Human_mitochondrial_genetics)), and long before that from a bacterium that was taken in ([Symbiogenesis](https://en.wikipedia.org/wiki/Symbiogenesis)).
- **The counter-theme: openness has a cost.** A wall-less cell bursts in fresh water. A cell that takes in DNA takes in parasites too. Every run weighs this, and Act III makes it a choice: **Recode** closes your genetic code so that phages and stolen genes can no longer read you, and it closes your own theft with it (§3.4; gameplay §3.8).

**Emotional promise: three feelings, in this order.**
1. **Wonder at scale**, in the first minute. A leaf hair is a glass tower; a pollen grain is a planet. Later, on the notebook's first page, a tear is a meteor.
2. **Tender attention, with no rescue.** Someone huge is watching. They mean well and are clumsy, and they cannot save you.
3. **Light you earned.** At the end of summer, the smallest thing in the garden becomes visible because of what you built.

Underneath all three is a quieter one taken from The Unbroken Line: *every ancestor made it; don't be the one who breaks the line.* Team line: ***You will feel how small you are, then how much small things carry.***

**Tone guardrails.**
- No faces on anything.
- No spoken words.
- The child's sadness is never explained.
- No person dies.
- No swelling strings on the tear.

This is Pixar's "2+2, not 4": make the audience care, then let them add it up ([Stanton, TED](https://www.ted.com/talks/andrew_stanton_the_clues_to_a_great_story)).

---

## 3. The grand arc

### 3.1 Three clocks

| Clock | Length | In play | In story |
|---|---|---|---|
| **Run** | One bead's morning, 18–25 min | A roguelite run inside one drop on the **dew clock**: dawn light warms, then the drop evaporates and concentrates, through gameplay's five stages (Dawn, Early Morning, Midmorning, Late Morning, Rim; gameplay §2.4). The exits are gameplay's five: a cyst, trehalose glass, an endospore, a hitchhike (an insect's foot, a rotifer, a splash, or the child's fingertip) or the stoma gate. Between drops, the jar. | One morning on the step |
| **Campaign** | One summer, about 40–50 mornings in four Acts | Phases 1–3 and the Dusk finale, played as Expeditions of three drops (gameplay §2.5); a hub that changes, the instrument ladder, and the lineage tree | The child's summer with G. |
| **Deep time** | About 4 billion years | Ancestral Memories (§3.6) and dated tree nodes (§3.5). The time ruler stands in for the scale bar. | G.'s childhood notebook, and the ending's journey into an eye |

Dew forms on clear, calm nights by radiative cooling ([Dew](https://en.wikipedia.org/wiki/Dew)), and one field study measured about 10 hours of leaf wetness ([AGRIS](https://agris.fao.org/search/en/records/65df5d446eef00c2cea280bf)). That makes "one drop, one morning" a natural length for a run.

The salt front gives the first run a second, shorter clock, and that clock is **staged**. Small solutes diffuse through water at about 10⁻⁹ m²/s ([Mass diffusivity](https://en.wikipedia.org/wiki/Mass_diffusivity)). In perfectly still water, salt would even out across a 4 mm bead in roughly half an hour to an hour (*estimate*: t ≈ L²/2D, with L = 2 mm). This bead is not still:
- **The impact stirs it.** The tear lands at about 1.5 m/s (§6.3). Its Weber number ρv²d/σ, the ratio of impact energy to surface energy ([Weber number](https://en.wikipedia.org/wiki/Weber_number)), is about 1000 · 1.5² · 0.0025 / 0.072 ≈ 80 (*estimate*). That is a violent merge, and it churns the bead within seconds. Shot 2's own schlieren curls show it.
- **Surface tension pulls it apart.** Tears carry lipids and proteins, so their surface tension is lower than that of nearly pure dew (pure water is about 72 mN/m, [Surface tension](https://en.wikipedia.org/wiki/Surface_tension)). Liquid flows away from regions of low surface tension ([Marangoni effect](https://en.wikipedia.org/wiki/Marangoni_effect)), so the tear water is also dragged out across the bead's skin.
- **Thin things vanish fast.** Stirring stretches the tear water into sheets. Once they are 10–100 µm thick, diffusion evens them out in about 0.05–5 s (*estimate*, same formula). A strip a few micrometres wide would be gone almost at once: at L ≈ 5 µm, t ≈ 10 ms.

So real mixing takes seconds to minutes. **Codon stretches it** (**Codon staging**, §7). The shelter is drawn as a broad salinity front, 0.3–1 mm across, and it fades over the first few minutes of run 1 (a tuning value). Even with no stirring at all, a front that wide would blur in about 45 s to 8 min (*estimate*, L = 0.3–1 mm). The hero does not sit inside a strip. It sits in the front's gradient, with salty tear water on one side and the mixed bead on the other. The shelter really does fade; we only slow it down.

### 3.2 Six rules that tie the frame to play

1. **The watcher is weather on a schedule, never a god.** The child's habits act on the drop and follow a timetable you can learn. The timetable shifts as the summer goes on, because the child is learning too.

   | The child's action | Effect in the drop |
   |---|---|
   | Head and lens shadow (also **the blink**, §4.3) | Cools the drop and dims the light: phototrophs starve, predators slow |
   | Lens held still in sunlight | A focused hot spot of **heat**, not UV. It warms the bead and calls the heat-shock response (σ32 in *E. coli*, [Heat shock response](https://en.wikipedia.org/wiki/Heat_shock_response)): gameplay's Heat stance. Glass passes UVA but blocks "over 90% of the light below 300 nm" ([Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet)), and it is transparent in the near-infrared, where water absorbs ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)). It does not wake a prophage; any loupe → SOS link would be **Codon staging**, and launch has none |
   | Breath | Humidity that slows evaporation |
   | Fingertip | A ride out: one of the Hitchhike exit's carriers (gameplay §2.4, #130). The child, not you, chooses the next bead |

   **The bead is the other lens, and the one that burns.** A drop held up by hairs focuses sunlight onto the leaf below it ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)). Water barely absorbs ultraviolet: about as little at 200 nm as at 900 nm, an attenuation length of 14.5 cm (Electromagnetic absorption by water, above), so a 4 mm bead absorbs about 3% even at 200 nm (*estimate*). For water's index the ball-lens formulas put the focus about half a diameter beyond the bead ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)), so inside it the light converges toward the underside. UV damages DNA, the damage sets off the SOS response, and "the classic induction of a lysogen involved irradiating the infected cells with UV light" ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)). That is the real chain that can wake a prophage (the Sleeper, gameplay §4.3–4.4). It runs on the sun's clock, not the child's, and the child's shadow switches it off. The owner's image still holds it: the burning glass is the bead the child is looking into. Drawing the focus as a spot that crawls through the water at game tempo is **Codon staging**.

2. **Being seen is the meta currency.** A rare behaviour that happens while the lens shadow lies over the meniscus becomes a **Sighting**: a first division, a conjugation bridge, a phage burst, a biofilm sheen, a pigment. Each Sighting becomes a notebook page and unlocks knowledge-gated tree nodes. The tension is Codon's own: ***be seen by the large; hide from the small.*** The plumes, signals and pigments that catch the child's eye also draw predators and phages.

3. **The instruments are the view modes.**
   - The child's first drawings are charming wrong guesses (castles, monsters, a smiling blob). Honesty cards correct them.
   - The instruments improve: loupe, then bead microscope, then toy microscope with stains, then a borrowed fluorescence microscope. As they do, the drawings become accurate. The player always sees the cell; the instruments change what the *child* can see, and they add view modes.
   - Art rule: **only the human draws lines.** The micro world has no outlines. The notebook is the only place outlines exist.

4. **Death moves the story forward**, as in Hades ([Inlander](https://inlander.com/culture/hades-writer-greg-kasavin-on-how-he-made-video-game-deaths-drive-a-feel-good-story-22725237)). The lineage systems in §3.3 carry this.

5. **The hub is the frame**, as in Flower's windowsill ([Flower](https://en.wikipedia.org/wiki/Flower_(video_game))).
   - The hub is opening shot 4, reused: you move the lens over a leaf, focus, and dive into the bead you choose.
   - Choosing a bead chooses the biome:
     - **Cup beads:** large and dilute, and dangerous for a soft cell.
     - **Hair-held beads:** bright, and burning glasses themselves: the bead's own UV focus (rule 1) as well as the loupe's heat.
     - **Tooth-tip beads:** sweet. Hydathodes at leaf teeth and tips push out sap carrying "mineral ions, amino acids, sugars" ([Hydathode](https://en.wikipedia.org/wiki/Hydathode); [Guttation, de.wikipedia](https://de.wikipedia.org/wiki/Guttation)). No source found says lady's mantle in particular does this, so tooth-tip beads carry a **Codon staging** badge.
   - The lineage tree is drawn as the leaf's veins lighting up, one vein per run.
   - Between drops the same hub is where you promote a cassette to the chromosome, read the notebook and set standing conditions at the jar (gameplay §2.4, §6.1).

6. **Only two authored sequences: the opening and the ending pull-out.** The opening's tear scene, **The first morning**, is held back for the notebook's first page (§5.1). Everything else happens through play, hub changes, notebook pages and the blink.

### 3.3 Lineage systems in the interface

- **The generations counter.**
  - It sits beside the prototype's 1 µm scale bar: `1 µm · 3.4 µm/s · 1,284 generations` (extending `hud.barLabel`).
  - It appears at run 1's first division and never resets.
  - Milestones reuse real numbers from the *E. coli* long-term evolution experiment (LTEE) ([LTEE](https://en.wikipedia.org/wiki/E._coli_long-term_evolution_experiment)).
- **"This branch ends."** Never "You died".
  - A stop-codon sting plays: UAA, UAG or UGA, chosen by cause, each opening on the breath note (§4.3).
  - Then comes the blink.
  - The lineage's DNA stays in later drops as eDNA that can be taken up again, as wall-less *Kitasatospora* L-forms do ([Kapteijn 2022](https://doi.org/10.1038/s41467-022-33054-w)). This is Inscryption's death cards, made honest.
- **The jam jar.**
  - The child keeps water from old drops in a jar on the sill.
  - Lineages can be revived from it. This is the LTEE's frozen fossil record made into an object in the story.
  - The jar's water is where gameplay's refundable standing conditions live: rich water or lean, steady saltiness or swinging, and so on (gameplay §6.1). The Ancestor boss, a duel against a frozen past lineage, is fought from it.
  - A branch is lost for good only in an opt-in hard mode.
- **Heirloom genes.** The ribosome, ATP synthase and the membrane's proton gradient glow faintly amber (`ORGANELLE.dna`, `0xf0a51e`, at low alpha) in the genome view. Inspecting one shows a single honesty-register line: *"Every ancestor carried this."* The glow is display only and locks nothing: deletion follows gameplay's genome rules (gameplay §3.4, Genome Streamlining #110, and the rRNA operons of Ribosome Fleet #139, one of which can be deleted), and the draft states up front when a knockout would be fatal (gameplay §3.3). Gameplay cut a separate "Heirloom Locus" node for the same reason (gameplay §3.7, group L).
- **Division heirs.** **Run 1's first division** teaches the game's first real choice: which daughter continues. It is gameplay's division draft (gameplay §2.3, §3.3): three daughters with their mutations stated, one of them always unmutated. You continue as one; the other two stay in the drop as sister branches you can switch to, and as your extra lives (gameplay §2.4). The opening has no Bacteria/Archaea fork, and the player never chooses that split.

### 3.4 Acts mapped onto gameplay phases

| | **Act I: Dew** | **Act II: Film** | **Act III: Storm** | **Act IV: Dusk** |
|---|---|---|---|---|
| **Summer** | Early | High summer, heat | Late, storms | Last week; the evenings grow longer |
| **Gameplay phase** | **Phase 1: an evolution tree on everything:** envelope and the wall toggle, membrane, motility, uptake, energy, expression, senses, defence, overgrow-to-divide, regulation. Every node is dated (§3.5). | **Phase 2: colony:** division heirs, the quorum chorus, a biofilm base, persisters, spores as a "last will", colicin rock-paper-scissors rivals | **Phase 3: symbiosis and the wider world:** the engulfment ladder up to domestication, syntrophy, the phage arms race with a CRISPR trophy wall, and **the Act III fork** (the Stranger and Recode, below); the leaf as the world map, from its surface down through the stoma | **The finale, with no new phase:** lux by gene transfer, the quorum chorus carried into full dark, and **Visible**, all on Phase 1–3 systems. Phase 4, multicellularity, is the first "next summer" (§3.7) |
| **Habitats** (gameplay §4.1) | Dew beads: cup, hair-held and tooth-tip | The same beads, drying faster in the heat | Adds the **leaf veins** behind the stoma, and the **puddle** in the pot's saucer, full of rain run-off and splashed soil | All three, at dusk and on into the dark |
| **Hub** | The back step at dawn; the notebook lies open | The kitchen table: G.'s old hands and the child's build a bead microscope; G.'s childhood notebook lies beside the child's | The windowsill in the rain; the pot has been brought indoors | The garden at dusk; the child is allowed out late |
| **Instrument and view mode** | 10× loupe; the drop as a lens | A Leeuwenhoek-style bead lens (the [Foldscope](https://en.wikipedia.org/wiki/Foldscope) reaches 140× with a card and a ball lens); brightfield, the current look | Toy microscope: phase contrast; stains (Andersen's "witch's blood" as an easter egg, [Wikisource](https://en.wikisource.org/wiki/The_Drop_of_Water); Gram) | A borrowed school fluorescence microscope: reporter genes show which proteins are being made |
| **Watcher events in runs** | Lens shadow, hot spot (heat), breath, fingertip | **The spray bottle**: kind misting delivers a hypotonic shock. Pipette sampling into the jar. Faster drying. | Raindrops hitting; aphid and ladybird ferries; soil splash; the leaf carried indoors (a biome change); a drop of stain | Darkness (phototrophs idle); a torch beam; G. arrives |
| **Story told through play** | "Why am I soft?" The first osmotic-burst autopsy sits next to the notebook's drawing of a falling tear (the page that plays The first morning, §5.1), and the player puts tear, salt and shelter together. The first division is drawn as *"it had a baby??"* | The colony becomes a sheen the child can really see. Once it passes about **0.1 mm**, the naked eye's resolving limit in daylight ([BBC Science Focus](https://www.sciencefocus.com/the-human-body/how-small-can-the-naked-eye-see)), the scale bar marks it and the Sighting needs no lens. It gives the first accurate drawing. After a spray-bottle death the next page reads *"G. says they like salt. No more spraying."* | The child's **handwriting grows bigger week by week**, because they are writing for G. Stomata act as gates: plants detect flagellin and close them, and *P. syringae* reopens them ([Melotto 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)). Ice-nucleation genes ([Christner 2008](https://www.nationalgeographic.com/science/article/snow-making-bacteria-are-everywhere)) hint at a road off the leaf, riding a cloud; that road and its Rain ending open in a later summer (§3.7, §4.4). A soil splash answers how a gut-type rod reached a leaf (Codon staging; plants do respond to *E. coli* at their stomata, Melotto 2006). | Lux genes, which work when moved into *E. coli* ([PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500)), come by gene transfer from a luminous donor such as *Photorhabdus* ([Photorhabdus](https://en.wikipedia.org/wiki/Photorhabdus)). **Visible** is a light budget, not a size. In the dark a point of light is seen if it is bright enough, whatever its size: the largest-looking star spans about 0.06″, a thousandth of the eye's 1′ resolution ([Angular diameter](https://en.wikipedia.org/wiki/Angular_diameter)). The scale bar gains a **brightness meter**: lit cells × lux output per cell × the share of light that reaches the child's pupil, against a dark-adapted threshold whose line sinks as the dusk deepens (§4.4). When the meter crosses that line in full dark, the child sees the glow *without a lens*. |
| **Act gate** | A lineage survives three mornings in a row, one whole Expedition (gameplay §2.5; three is the launch value, to be tuned), and one division is seen | A biofilm is established and quorum reached once | The Act III fork resolved through either door, or one endosymbiont domesticated | **Visible**: the brightness meter crosses the dark-adapted line in full dark (Seen). If the summer runs out first: Armour for a closed lineage, Stop for an open one |

**The Act III fork: two doors, one question.** Late summer brings storms, and storms bring phage blooms and strangers. Both doors ask the theme's question, *stay open, or close?* Both are mechanics, not cutscenes.
- **The Stranger** (§4.1; gameplay §4.2, the archaeal syntroph). It trades hydrogen and reaches out with long protrusions. It is smaller than you: about 0.55 µm across, with arms about 5 µm long ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum)).
  - **Be taken in** (*Hypothesis · E3 model*). The roles are history's: an archaeal host and an alphaproteobacterial guest ([Eme et al. 2023](https://doi.org/10.1038/s41586-023-06186-2)). How the guest got in is not known. The entangle–engulf–endogenize (E3) model is "one of several conceivable scenarios", and its authors think the step was "probably independent of phagocytosis" ([Imachi et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015854/)). So there is no swallow. The Stranger's arms entangle you, and over generations its line wraps you, until the wrap closes. A Stranger line that grows big enough to close round you is **Codon invention** (§4.1, §7).
  - **Take it in**, the road not taken. The Stranger is small enough to fit inside you.
- **Recode**, the keystone the game is named after (gameplay §3.8). It is real, in a laboratory. A lab *E. coli* with three codons removed, two serine codons and the amber stop codon, was still infected, because "numerous viruses and mobile genetic elements encode parts of the translational apparatus". A later strain read those codons as leucine instead; it blocked "incoming and outgoing HGT with natural organisms", and it doubled in about 69 minutes against its parent's 44 ([Nyerges et al. 2023, *Nature*](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/)).
  - In play, Stage 1 frees the codon and summons phages that carry their own tRNAs. The fork resolves when they arrive.
  - **Make the Swap,** and the lineage becomes a fortress that phages and stolen genes cannot read. It divides more slowly, and its own theft closes.
  - **Stay open,** survive them another way, and keep stealing.
- **What the doors lead to.** Either door clears the Act gate, and a player may go through both. At launch both play as run arcs. A closed lineage can end in **Armour**, which ships at launch. Being taken in leads to **Taken In**, in a later summer. Only an open lineage reaches **Seen** easily, because its lux genes arrive by gene transfer (§4.4).

### 3.5 Phase 1's tree, dated

Every node on the Phase-1 tree carries a date stamp, so the tree becomes a museum of deep time that the player builds. The stamps live in the *Date stamp* column of gameplay §3.7, one per node, and each is one of three kinds (gameplay §0):
- a **real** date: pre-LUCA, LUCA (about 4.2 Ga, a date that is itself a hypothesis), a dated event, or **today** when it is seen arising now (in L-forms, in patients, in the long-term evolution experiment, in a laboratory);
- **age unknown**;
- **no date**: ***not taken*** for a road not taken (designer code RN), with the organism where it is real, or ***invented*** for Codon's own structures (INV). Neither ever happened in a cell like ours, so neither has a date of its own.

The stamp sits under the node's honesty badge, and the two answer different questions: the badge says how true the hero's version is, the stamp says how old the real thing is. The table gives samples, with the node numbers and badges of gameplay §0 and §3.7. All of them stay unlocked as normal; history does not gate the tree. Aerobic respiration stays on the prototype's visible bo3/TCA route from the start.

| Node (gameplay §3.7) | Stamp | Badge | Source |
|---|---|---|---|
| Ribosome; the genetic code (#139, #143) | Older than LUCA, which lived about 4.2 Ga (interval 4.33–4.09) | Established; the date is a Hypothesis | LUCA "certainly had genes and a genetic code"; "a 2024 study suggested" the date ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor)) |
| Membrane proton gradient (#29) | As old as LUCA, about 4.2 Ga | Established | LUCA "used chemiosmosis" ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor)) |
| ATP synthase (#141) | Before LUCA | Established | Conserved gene order implies it predates LUCA ([ATP synthase](https://en.wikipedia.org/wiki/ATP_synthase)) |
| Cell wall (#14) | After LUCA; exact age unknown | Established | "Cell walls, too, would have evolved later" ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor)) |
| Shed the wall (#1, the envelope keystone) | Today, within hours | Established | Patient *E. coli* switch to L-form under cell-wall antibiotics and switch back afterwards ([Mickiewicz et al. 2019](https://doi.org/10.1038/s41467-019-12359-3)) |
| Overgrow-to-divide (#2, #101) | Today in L-forms; as the way the first cells divided, a **Hypothesis** | Established (the player's sculpting is Codon invention) | Mercier et al. 2014; Errington ([Harvard Origins](https://origins.harvard.edu/event/cell-wall-deficient-l-form-bacteria-mechanism-proliferation-and-implications-emergence.md)) |
| CRISPR-Cas (#58) | Perhaps as old as LUCA | Established; the date is Debated | LUCA "may have had an early CAS-based anti-viral immune system" ([LUCA](https://en.wikipedia.org/wiki/Last_universal_common_ancestor)) |
| Flagellum (#15) | Age unknown | Codon staging while the hero is naked; Established once walled or anchored (gameplay §2.1) | — |
| Oxygenic photosynthesis (#38, via a stolen partner) | At least as old as the Great Oxidation Event, which began about 2.46–2.43 Ga; probably 2.7 Ga or earlier | Established | [Great Oxidation Event](https://en.wikipedia.org/wiki/Great_Oxidation_Event) |
| Lux operon (#120) | Age unknown | Established | — |
| Protein engulfment (#79) | Not taken: real today in *Gemmata*, age unknown; never seen in a cell like ours | Codon invention · a road not taken | Lonhienne 2010 |
| Keep a partner inside you (#85, #133) | Not taken: in eukaryotes before 1.6 Ga and perhaps about 2.2 Ga; a bacterium inside a bacterium is real today in a mealybug, but it got in by invasion, not by being swallowed | Codon invention · a road not taken | [Symbiogenesis](https://en.wikipedia.org/wiki/Symbiogenesis). With a bacterium as host, the road-not-taken analogue is the citrus mealybug's nested symbiosis, "a bacterium inside a bacterium inside an insect" ([*Planococcus citri*](https://en.wikipedia.org/wiki/Planococcus_citri)): the gammaproteobacterium *Moranella* "lives in the cytoplasm of the β-proteobacterium *Tremblaya princeps*" ([von Dohlen et al. 2001](https://doi.org/10.1038/35086563); [Husnik & McCutcheon 2016](https://pmc.ncbi.nlm.nih.gov/articles/PMC5027413/)). It was not engulfed. *Tremblaya* cannot make its own envelope, so its authors assume the insect makes it; the guest's relatives are "very good at establishing intracellular infections in insect cells", and in their reading it "invaded a membrane system that was perhaps more eukaryotic than bacterial in nature" (Husnik & McCutcheon 2016). Taking a partner in by swallowing it is the invented part: no bacterium is known to keep a partner it engulfed (**†**, gameplay §10) |

### 3.6 Ancestral Memories

- **Where they come from.** At the end of Act I, G. leaves their own childhood notebook on the kitchen table. Its pages hold a child's wonderings about deep time, written decades ago. They use the same notebook register in older ink, and each is badged **Hypothesis** where that applies.
- **How they play.** Each page is a **Memory**: a 3–5 minute level on the run engine, with an era palette (the palette lerp from §6.2) and one rule twist.
- **The time ruler.** During a Memory the scale bar becomes a time ruler. On the way back it morphs into "1 µm".
- **The reward.** Each Memory gives **one remembered gene**, so it is never homework.
- **At launch:**
  - **"Warm Little Pond."** Darwin's "big if" ([Darwin Correspondence Project](https://www.darwinproject.ac.uk/letter/DCP-LETT-7471.xml)). It teaches overgrow-to-divide properly: grow membrane until a vesicle blebs, then steer where it pinches. Reward: a membrane-synthesis boost, the real driver of L-form division (Mercier 2014).
  - **"Rust Snow."** The oxygen crisis, about 2.46–2.06 Ga ([GOE](https://en.wikipedia.org/wiki/Great_Oxidation_Event)). Iron rusts into flakes that snow down through the water. Reward: an oxygen-tolerance gene such as catalase.
- **Later summers:** "The Web" (gene trading), "Stromatolite", "Snowball".

### 3.7 Next summer (epilogue and New Game+)

- **Autumn.** The leaf falls and the jar stays on the sill.
- **New Game+.** It is a new summer on a new leaf species (nasturtium, strawberry), and the lineage tree carries over. The child is a year older; their hands and sleeves change. After several summers the grown child hands the lens to another child.
- **Early Access cadence.** Each major update ships as "a new summer". The rhythm guards against the abandonment problem seen in Species and Equilinox.
- **The first new summer: Phase 4, multicellularity.** It is deliberately not in 1.0, because gameplay ships one stage deep (gameplay §4.1).
  - What it adds: daughters that never let go become the body you play, with germ and soma, heterocyst-like specialists, and cable-bacteria power lines running through a whole body.
  - The 1.0 doorway nodes already exist as colony tricks inside Phase 2: Don't-Let-Go clusters, the Cable union and the Fruiting Body (gameplay §3.7, §3.9). The new summer turns the cluster into the avatar.
- **Later summers: the water cycle as the world map.** Cloud, rain and soil open as habitats (gameplay §4.1), with the Rain ending (§4.4).
- **NG+ origin variant: "the sick summer"** (from The Kept).
  - On the sill stand a pink antibiotic bottle and a spoon, and a fingertip touches the leaf.
  - The soft cell is born from cell-wall antibiotic switching, which is real in *E. coli* (Mickiewicz 2019). The route to the leaf is **Codon invention**.
  - The tone stays light: only objects, and the child is well by the third morning.
- **Later, asynchronous play.** Friends' ghost colonies arrive as "a leaf a friend brought from their garden".

---

## 4. Presences, voice, motifs and endings

### 4.1 Presences

| Presence | How it appears | Rules |
|---|---|---|
| **The hero** | The soft cell. The player can name it once, at the end of run 1, through the notebook. | No face. Its "expressions" are membrane physics: it wobbles under stress and rounds up when it "looks" (the lens-body trick, [Schuergers 2016](https://elifesciences.org/articles/12620)). |
| **The child** | Hands only: bitten nails, ink on the fingers, a plaster on one knuckle. A sleeve that changes with the season, breath, a shadow, an upside-down silhouette in drops. | About nine, ungendered, never named, the face never shown. Kind, curious and clumsy, and learning. |
| **G.** | Old hands with a ring, thick glasses, a large-print book; the initial scratched on the lens | Present in the hub and never speaks. Failing sight is told only through objects and the child's growing handwriting. A cataract is a clouding of the eye's lens, most often from ageing ([Cataract](https://en.wikipedia.org/wiki/Cataract)). |
| **The lens** | A worn brass 10× loupe engraved "HOLARKY · 10×" (the studio credit, made part of the world) and scratched "G." | Cursor in the hub, the first optical instrument, the object at the centre of the hub |
| **The garden** | Light, weather, insects | The calm storyteller; it sets the rhythm of runs |
| **The Stranger** | An Asgard-like archaeon at its real scale: a coccus about 0.55 µm across, smaller than the hero's 1 × 2 µm, with long, often branching protrusions about 5 µm long ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum); [Imachi et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015854/)). Its arms reach you long before its body does. | One door of the Act III fork (§3.4): be taken in (*Hypothesis · E3 model*) or take it in (the road not taken). It never swallows you; a 0.55 µm cell cannot. Being taken in is entanglement, then wrapping over generations while the Stranger's line grows big enough to close round you. That growth is **Codon invention**. Recode is the other door. |
| **Rivals** | Species whose temperaments show in their genes | No faces, and no names beyond the species |

### 4.2 Voice: one text register

- **The micro world is wordless.** There is no narration and no voice-over, following *Cosmic Zoom*, *Journey* and *Microcosmos* (two narrated passages in 80 minutes, [Microcosmos](https://en.wikipedia.org/wiki/Microcosmos_(film))).
- **All text lives in one register: the notebook, plus the honesty cards attached to it.**
  - The child's notebook is titled ***What I saw — for G.*** It is handwritten, short and full of wonder. It is the codex and the manual (Tunic, and Outer Wilds' ship log). G.'s childhood pages belong to the same register in an older hand. A clean-font option is provided.
  - **Honesty cards** use a neutral typeface. Each carries one of the five badges of gameplay §0 (*Established / Debated / Hypothesis / Codon staging / Codon invention*), a date stamp where it describes a node (§3.5), and one source. Gameplay §0's table maps its designer codes (R, R+, RS, RX, RN, H, INV) onto these five, so the two documents badge the same thing the same way.
  - **How a card reveals itself.** A thread in mRNA violet (`ORGANELLE.mrna`) drifts in, made of codon triplets. A ribosome-violet bead (`ORGANELLE.ribosome`) runs along it, and each triplet resolves into a word.
- **Genes return words to the notebook (gene-to-word).**
  - The first time a gene is expressed in any run, the notebook gains a named sketch or word.
  - Where the child did not know a word, older pages show a gap written as codon triplets: the game's way of saying *not yet known*. When the word arrives, those gaps retranslate, Tunic-style.
  - Example: *"it grew [AUG UUC …] and swam off!!"* becomes *"it grew **flagella** and swam off!!"* after the player first expresses *fliC*.
- **Each Act closes on a spread the child writes for G.**, assembled from *your* findings: the lineage, the best Sighting, the newest corrected drawing. The spreads are the save summaries and the share cards (gameplay §9.2).
- **Heirlooms** speak only as a few inspection lines in the honesty register (§3.3).
- **No voice-over.** This keeps localisation small and respects Steam's refund window ([Steam](https://store.steampowered.com/steam_refunds)). Every sound that is not speech has an optional caption.

### 4.3 Motifs

- **Circles that see.** Lens, drop, cell and pupil: every circle is an instrument. A ball lens flips the image on both axes beyond its focus ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)).
- **Inversion.** The drop shows the child upside down. The ending turns the gaze round.
- **Salt.** Tear, sweat and sea are both shelter and danger: dew dilutes a soft cell to bursting, and evaporation over-concentrates it.
- **Breath as tide.** The child's breath, time-stretched as we shrink, becomes the drop's slow swell. *Artistic, and labelled.*
- **Hands.** Hands are weather, hands give care, hands pass the lens on.
- **Light through skin.** Backlit fingers glow warm, in the same material language as the hero's inner glow (`ORGANELLE.jellyGlow`, `0xffb89a`).
- **The blink** (from The Kept). It is the game's only "cut": a soft shadow sweeps across the meniscus and the light dips. It marks run ends, deaths and time skips. In the world it is what the drop's light does when the watcher leans over. It reuses the lens-shadow occlusion term (§6.2, `water.js uShade`).
- **The codon motif.**
  - The theme is three "letters" played on singing glass. G. entertains the child by running a wet finger round a glass rim; Franklin made that sound into the glass armonica in 1761 ([Glass harmonica](https://en.wikipedia.org/wiki/Glass_harmonica)).
  - **U is an unpitched breath**, because U is not a note name.
  - The opening plays **A–U–G**, the start codon: glass A in the dark, the child's breath as the glass settles, and glass G when the player dives. The first morning (§5.1) plays it again around the tear.
  - Every stop codon opens on a breath: UAA (breath–A–A), UAG (breath–A–G), UGA (breath–G–A).
  - The **final card is UGA**: breath–G–A, a clean rotation of A–breath–G. Armour's code road ends on **UCA** instead: breath–C–A (§4.4).
  - The tune **mutates with your genome**. A point substitution changes a note, a duplication repeats one, an inversion flips the motif. Each lineage ends up with its own tune, and its share card plays it.

### 4.4 Endings

Endings are lineage outcomes, never dialogue choices. **Three ship at launch: Seen, Armour and Stop.** If more than one is earned, Seen wins.

**Seen (the true ending, launch).**
- **To reach it:** acquire lux by gene transfer, reach quorum on a dusk run that carries on into **full dark**, and hold the glow until the brightness meter crosses the child's dark-adapted line: **Visible**. An open lineage has the easy road. A lineage that made Recode's Swap can still get here, but only by polishing stolen lux into its own dialect one codon at a time (gameplay §3.8): the hardest road to the light.
- **The light budget** (the brightness meter on the scale bar, `1 µm · 3.4 µm/s · 1,284 generations · glow 0.7`). It reads N × φ × a / T, where 1.0 is the line.
  - **N** is the number of lit cells. Bacterial light is switched on by quorum sensing ([Bioluminescent bacteria](https://en.wikipedia.org/wiki/Bioluminescent_bacteria)), so a scattered colony stays dark.
  - **a** is the share of the light that reaches the child's pupil. A pupil opens to 3–8 mm in the dark ([Pupil](https://en.wikipedia.org/wiki/Pupil)); a 7 mm pupil 20 cm from the leaf catches about 10⁻⁴ of the light (*estimate*: pupil area over 4πr²).
  - **T** is the eye's threshold. A fully dark-adapted eye can register a flash of a handful of photons, 5–14 in Hecht, Shlaer and Pirenne's 1942 experiment ([Absolute threshold](https://en.wikipedia.org/wiki/Absolute_threshold)). The eye's rods take 30–45 minutes to reach full sensitivity ([Adaptation (eye)](https://en.wikipedia.org/wiki/Adaptation_(eye))), so on a dusk run the line sinks as the light goes. A glow that was invisible at sunset can cross it in full dark.
  - **φ** is the light per cell. We found no checked source for photons per cell, so φ is a tuned value for each lux variant. Better genes raise it, and so do FMNH₂ and oxygen, which the reaction needs ([Luciferase](https://en.wikipedia.org/wiki/Luciferase)); the light is paid for out of the cell's energy budget. The meter shows the product, never a claim about real cells.
  - **There is no size threshold.** Size enters only through N: a colony well below 0.1 mm can cross the line if it is bright enough, as stars do. The 0.1 mm mark belongs to Act II's daylight sheen (§3.4).
- **Last scene.**
  - The child leads G. out into the dark garden. There is no lens.
  - The child takes G.'s hand and guides it to cup the leaf, close to G.'s face.
  - The camera pulls out of the glowing colony, through the drop's skin, and along the light's path into G.'s eye.
  - It passes the wide-open pupil and the clouded lens (cataract scatter shown as a milky veil; the light still gets through). It crosses the vitreous to the retinal mosaic and enters a rod. The rod's inner segment is "full of mitochondria" ([Photoreceptor cell](https://en.wikipedia.org/wiki/Photoreceptor_cell)).
  - One mitochondrion's ATP synthase turns like the hero's, with *eight teeth where yours has ten*. The rotor ring of the vertebrate enzyme has eight c-subunits ([Watt et al. 2010](https://doi.org/10.1073/pnas.1011099107)); *E. coli*'s has ten ([Jiang, Hermolin & Fillingame 2001](https://doi.org/10.1073/pnas.081424898)). Same machine, different gearing: G.'s makes each ATP from about 2.7 protons (Watt 2010), the hero's from about 3.3.
  - The scale bar morphs into the time ruler: *kept since before 1.6 billion years ago* ([Symbiogenesis](https://en.wikipedia.org/wiki/Symbiogenesis)).
  - Whether G. perceives the glow is never stated. G.'s hand closes on the child's, and that is all.
- **The UGA card** (from The Kept).
  - The codon UGA is read twice. In the hero's standard code it means **stop**. In the vertebrate mitochondrial code, the code of the eye we are in, it means **W, tryptophan** ([NCBI genetic codes, table 2](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi)).
  - The music plays breath–G–A, then silence.
  - One closing line, to the player: ***Your eyes are full of them too. Once bacteria. Kept.***
- **Easter eggs.**
  - Rods use about 10⁸ ATP per second in darkness, and light cuts total use by more than 75% ([Okawa et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2615811/)). So G.'s mitochondria are working hardest at the very moment G. looks at the glow in the dark.
  - Human mtDNA carries 37 genes: 13 coding proteins, 22 tRNAs and 2 rRNAs ([Human mitochondrial genetics](https://en.wikipedia.org/wiki/Human_mitochondrial_genetics)).
- **Badges.**
  - The light budget is ordinary physics: in the dark, brightness decides whether a point of light is seen, not size ([Angular diameter](https://en.wikipedia.org/wiki/Angular_diameter); [Absolute threshold](https://en.wikipedia.org/wiki/Absolute_threshold)). φ is **Codon staging** (a tuned value).
  - The child actually perceiving a glowing leaf colony: **Codon invention**. Luminous bacteria can light seas, as in "milky seas" ([Bioluminescence](https://en.wikipedia.org/wiki/Bioluminescence)), but a glow this small on a leaf has never been reported seen this way.
  - Mitochondria descend from an alphaproteobacterium inside an archaeal host ([Eme et al. 2023](https://doi.org/10.1038/s41586-023-06186-2)). The hero's arc **rhymes** with that history; it does not replay it.

**Armour (launch).** It absorbs gameplay's old "Fortress" ending, so that Recode, the keystone the game is named after, pays off in the story.
- **To reach it:** close the lineage and carry it alive to the last morning of summer without the glow. There are two roads, one for each kind of wall:
  - **A wall in the code:** make Recode's Swap at the Act III fork (§3.4).
  - **A wall of peptidoglycan:** rebuild the cell wall and keep it to the end. This is real: *E. coli* from patients switch to L-form under cell-wall antibiotics and switch back afterwards ([Mickiewicz et al. 2019](https://doi.org/10.1038/s41467-019-12359-3)).
- **Last image:** the windowsill in morning light, and the jam jar. The child's last page is a careful, accurate drawing of a neat walled rod: *"I can't find the soft one anymore. Maybe that's good."*
- **The UCA card** (the code road).
  - The codon UCA is read twice. In every other cell in the drop it means **S, serine**. In yours it now means **L, leucine**. This is the real swap, which "reassigns two of the six serine codons to leucine" ([Nyerges et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/)).
  - The music plays breath–C–A, then silence: a word that now means something only to your line.
  - On the wall road, Stop's UGA card plays instead and reads **stop**.
- **Honesty card:** *"People did this in a laboratory. No wild cell is known to have done it from scratch, and the people who did it say phages may yet get through."* The authors write that they "cannot rule out" phages able to infect the strain (Nyerges 2023).
- **Then:** New Game+ ("next summer") is offered from the jar.

**Stop (launch).**
- **To reach it:** the last morning of summer passes without the glow while the lineage is still open (a closed lineage earns Armour), or every lineage, jar included, ends.
- **Last image:** morning light through the jam jar on the sill. The UGA card reads **stop**. Its footnote, on the honesty card: *not always, even in you.* *E. coli* reads UGA as selenocysteine in a few genes, its formate dehydrogenases, where a hairpin in the message just after the codon tells the ribosome to read on ([Zinoni et al. 1987](https://doi.org/10.1073/pnas.84.10.3156); [Selenoprotein](https://en.wikipedia.org/wiki/Selenoprotein); [Selenocysteine](https://en.wikipedia.org/wiki/Selenocysteine)). UGA does not mean stop everywhere, which hints at Seen.
- **Then:** New Game+ ("next summer") is offered from the jar.

**"Next summer" updates (after launch).**

| Ending | How you reach it | Last image |
|---|---|---|
| **Taken In** | At the Stranger's door of the Act III fork (§3.4), let its arms entangle you and its line wrap you over generations, then finish the domestication arc as the guest. It carries the partner story of gameplay's old "Partnership" ending. Badged *Hypothesis · E3 model*; the real guest was an alphaproteobacterium, so an *E. coli*-like guest is **Codon invention** (§7). | The same pull-out, starting inside the host |
| **Rain** | The lineage leaves on an ice-nucleated cloud, once the water cycle opens as the world map (§3.7) | An empty leaf; the last page is a drawing of a cloud |
| **Last** (from The Unbroken Line) | In a later summer, the line stays simple and survives everything | A forward time-lapse: multicellular life may end in about 800 million years; the oceans are lost in about 1–1.5 billion; prokaryotes hold on until about 1.6–2.8 billion, in high, wet refuges ([Future of Earth](https://en.wikipedia.org/wiki/Future_of_Earth)). Badged as model projections. *We were first. We will be last.* |

---

## 5. The opening animation: shot list

### 5.1 At a glance

The opening has two parts, built from one set of shots.
- **The first-launch opening** is shots 0 → 4 → 5 → 6 → 7 → 8. It is one continuous shot with no cuts, about 70 s from black to the first blink.
- **The first morning** is shots 0 → 1 → 2 → 3: the leaf, the tear and the rise into the child's gaze, 33 s on its own clock. It plays once at the end of run 1, when the notebook opens on its first page, a drawing of a falling tear, and it can be replayed from that page. Its last frame is the hub's first frame, so it ends with the lens in the player's hand at the run select for run 2.

**Why the tear waits.** Played first, the tear put the lens in the player's hand at 0:33 and the hero at 1:11. Gameplay §8.3 asks for control within 10 s of launch, research §3.4 for control in under 10 s, and research §6.1 and gameplay §9.1 put it at about 8 s. Respecting the refund clock (research §3.4 rule 9) outranks the tear's place in the first minute. The first launch still opens on the tear's consequences: a child crying quietly in the dark (shot 0), and a bead whose water is still streaked with salt (shot 4). The player arrives with a question, and the notebook answers it with a picture.

Frame sizes below are frame **heights**; at 16:9 the width is 1.78× the height. The prototype's start frame is 4.8 µm tall and 8.5 µm wide. Times from shot 5 on assume the authored pace, with no input in the hub. A player who explores the hub moves them later, by up to 21 s.

**The first-launch opening**

| # | Shot | Time | Stage | Frame | Player |
|---|---|---|---|---|---|
| 0 | Before light | 0:00–0:04 | — | — | none |
| 4 | The glass (the hub) | 0:04–0:17 (player-paced, up to 0:38) | Garden | 90 mm | mouse parallax ±2° from **0:05**; from **0:08** **the cursor steers the lens; scroll focuses; click dives** |
| 5 | Beyond the glass | 0:17–0:30 | Garden → Micro | 90 mm → 0.2 mm → 40 µm | W or scroll speeds it up (never faster than the 3 s replay dive, §5.3) |
| 6 | The soft one | 0:30–0:44 | Micro | 40 → 10 µm | drag to look around (±10°, springs back); resting the view on the soft cell hands over |
| 7 | Handoff | 0:44–0:46 | Micro | 4.8 µm | **full control from 0:46** |
| 8 | Codon (first play) | 0:46–about 1:10 | Micro | gameplay | gameplay |

**The first morning** (the notebook's first page)

| # | Shot | Time | Stage | Frame | Player |
|---|---|---|---|---|---|
| 0 | Before light | 0:00–0:04 | — | — | none |
| 1 | The leaf | 0:04–0:16 | Garden | 42 → 20 mm | mouse parallax ±3° from 0:05 |
| 2 | The tear | 0:16–0:26 | Garden | 20 → 23 mm | parallax |
| 3 | Into their gaze | 0:26–0:33 | Garden | 23 → 90 mm (rising) | parallax; ends in the hub, lens in hand |

**Targets.**
- Something answers input by 0:05.
- The lens is in hand by **0:08** (gameplay §8.3: control within 10 s of launch).
- The hero is under control at **0:46** at the authored pace, and by 1:07 at the latest (research §3.9: 75 s or less).
- If the player does nothing, the opening plays itself at the authored pace.

**Agreement with gameplay.md and research.md.** The three documents word the opening differently in places. Build to this column.

| | Build value (this document) | gameplay.md and research.md |
|---|---|---|
| Lens in hand | **0:08** on first launch | gameplay §9.1 "inside ~8 seconds" and §8.3 "within 10 s"; research §3.7 "about 8 s" and §6.1 "~8 s". These agree. |
| Hero handoff | When the player rests the view on the soft cell (shot 6), otherwise at 0:44; full control by 0:46 | gameplay §9.1 and research §3.7 (beat 4): resting the view on the cell hands over control. These agree. |
| The instrument | A round brass 10× loupe, G.'s heirloom (§1, §4.1) | gameplay §9.1 and research §3.7 say "a round reading glass". Same role and verb; build the loupe, whose 10× sets the honest 10 µm limit in shot 5. |
| Replay dive | **3 s** (§5.3) | gameplay §2.6 "dive (3 s)"; research §3.5 "about 1 s" per decade on later returns. |
| Length | About 70 s on first launch; The first morning (33 s) at the end of run 1 | gameplay §9.1 "~90–120 s" and research §3.7 "about 120 s" describe a longer cut. |

### 5.2 The shots

Directions are given in Garden space, where the child and the house lie toward **−z** and the camera starts on the **+z** side of the leaf.

---

**Shot 0. Before light** · 0:00–0:04 · 4 s
- **Camera:** none. A fade up from black, not a cut.
- **Seen:** black for 1.5 s, then a blue-lilac dawn gradient. At 2.8 s a single point of light appears at the centre: the central bead catching the brightest part of the sky.
- **Sound:** sound arrives before the image (Journey was prototyped from music, [Game Developer](https://gamedeveloper.com/audio/video-designing-a-new-emotional-experience-in-i-journey-i-)).
  - 1.0 s of silence.
  - A distant blackbird phrase.
  - Close and binaural: a child's unsteady breathing and one sniff, at 2.6 s.
  - A wet-glass **A**, barely audible, at 3.2 s.
- **Text:** none. Optional captions: *[a bird]* *[someone crying quietly]*.
- **Transition:** on first launch the point of light is the tear bead seen from the child's eye, and the hub (shot 4) fades up around it. In The first morning it is the bead of shot 1.

---

*Shots 1–3 are **The first morning**, played from the notebook's first page (§5.1). Their times run on its own clock.*

---

**Shot 1. The leaf** · 0:04–0:16 · 12 s
- **Camera:** low macro on the +z side, looking back toward the house. Relative to the bead it pushes in from 55 mm to 26 mm away, at 7–9° elevation, drifting 4° sideways. From 0:05 the mouse adds ±3° of parallax, with no prompt.
- **Seen:**
  - A lady's mantle in a pot by the back step: a pleated, scalloped fan with small teeth, its silver hairs catching the sky, and beads balanced on the hairs. There is one large bead in the central cup and small ones at the tooth tips.
  - Behind, in soft bokeh: a lit window and the edge of the step.
  - Palette: celadon leaf, pearl beads, lilac shadow.
  - By 0:10 the bead fills a fifth of the frame. **Inside it the world hangs upside down and sharp:** sky at the bottom, the house, and a child on the step, knees up, head down. Someone has been there all along, just above the frame, and only the drop shows them.
  - At 0:12 the silhouette's shoulders shake once, and something brass glints in its lap.
- **Sound:** the birds thicken. Breath. A breeze. A glassy *tick* as the beads tremble.
- **Text:** none.
- **Transition:** continuous. Inside the bead the silhouette leans forward and raises a hand to its face.

---

**Shot 2. The tear** · 0:16–0:26 · 10 s
- **Camera:** holds the bead, eases back to 30 mm and tilts up 18° into the space above it. The top of the frame darkens softly: the child, leaning over, too close and too far out of focus to be anything but shadow.
- **Seen:**
  - At 0:19 a bright point drops from the darkness. Time slows to the look of a high-speed camera, at about **1/500 speed at contact**.
  - The tear (about 2.5 mm, backlit, colour-fringed at its edge) touches the bead. A neck bridges them (about 2.5 s on screen for a few real milliseconds), the merged bead rings in its first two shape modes, and a tiny satellite drop pinches off, hops, and falls back.
  - Time eases back to normal by 0:25. The bead is visibly bigger.
  - Inside it, **schlieren** (refractive streaks, [Schlieren](https://en.wikipedia.org/wiki/Schlieren)) curl through the water: salty tear meeting fresh dew. The upside-down world inside wavers.
- **Sound:**
  - No splash. A soft, deep, pitched-down *dumm* at contact.
  - Then the middle letter, **U, a breath** (the child exhaling).
  - Then glass **G**. **A–U–G: start.**
  - The birds return.
- **Text:** none.
- **Transition:** the camera begins to rise.

---

**Shot 3. Into their gaze** · 0:26–0:33 · 7 s
- **Camera:** a slow spiral up the tear's path.
  - Relative to the bead it climbs from 30 mm to 117 mm, its elevation from 18° to 88°, and swings 180° round, with smootherstep easing.
  - It ends looking straight down from where the child's eyes are, with the top of the frame pointing away from the child.
  - The first three shots watched the child; now we look with them.
- **Seen:**
  - The leaf turns slowly below. The light dims about 15% as the child leans in and blocks the sky.
  - At 0:30 the loupe slides in from the bottom edge, held by warm, backlit fingertips with a plaster on one knuckle, softly out of focus, and settles over the bead.
  - The engraving glints: **HOLARKY · 10×**, and a scratched **G.** that is not the child's.
- **Sound:**
  - A fingernail clicks on brass.
  - **The child's breathing steadies: looking calms them.** This is the opening's one emotional statement, made without words. The first launch plays the same beat in shot 4's arrival.
  - The glass settles into a held drone on A.
- **Text:** the engraving only.
- **Transition:** this is the hub's first frame. Control passes to the player and the cursor becomes the lens, now the run select for the next morning.

---

**Shot 4. The glass (this is the hub)** · 0:04–0:17 · player-paced from 0:08, up to 30 s
- **Camera:** fixed overhead. From 0:05 the cursor adds ±2° of parallax, with no prompt.
- **Arrival (first launch only), 0:04–0:08.** This borrows shot 3's last seconds.
  - **0:04.** The overhead view fades up around the point of light: the leaf below, beaded with dew, the central bead larger than the rest. Its water is still streaked with **schlieren**, salt meeting dew. That is all the first launch shows of the tear.
  - **0:05–0:07.** The loupe slides in from the bottom edge, held by warm, backlit fingertips with a plaster on one knuckle, softly out of focus, and settles over the bead. A fingernail clicks on brass. The light dims about 15% as the child leans in. The engraving glints: **HOLARKY · 10×**, and a scratched **G.** that is not the child's.
  - **0:07.** **The child's breathing steadies: looking calms them.** The exhale is the motif's **U**. This is the opening's one emotional statement, made without words.
  - **0:08.** The cursor becomes the lens.
- **Player:**
  - **The cursor steers the loupe** across the leaf. Scroll, or the triggers, raise and lower it. This is **focus**, the first real verb.
  - The image through the glass is honest. It is sharp only near the loupe's focal distance. Pull the glass past its focal length and the image swells and smears into one colour; pull further and the world turns **upside down**. Beyond its focal length a lens forms a real, inverted image ([Lens](https://en.wikipedia.org/wiki/Lens)), and the flip shows once that image has passed the child's eye, with the glass about 36 mm above the bead (§6.3). Bring it back and it rights itself.
  - Holding a bead centred and sharp for 0.8 s lines up eye, glass and drop on one axis. A soft **ting** sounds and the bead's rim brightens.
  - On later launches the same interaction is the run select.
- **Seen:**
  - Inside the disc the bead is magnified about 4× by angle (a 10× loupe at a child's working distance), with the schlieren large and a dust speck drifting.
  - At 0:12, if nothing has happened, a faint pictogram (a circle and a scroll arrow) appears beside the rim.
  - At 0:17, still with no input, the glass drifts to the tear bead, focuses itself, and the dive begins.
  - **Click, hold W or pull a trigger** to dive at any time. On first launch the glass glides to the tear bead first (0.6 s) if it is over another one: the child's hand goes back to it.
  - A player who keeps exploring keeps the hub until 0:38, 30 s after the lens arrived. Then the child's hand takes the glass back to the tear bead and the dive begins.
- **Sound:** a felt *thock* as the glass moves; a focus whisper (filtered noise that clears as the image sharpens); the ting; a quiet room; slow breath. On first launch the dive itself sounds glass **G**: **A–U–G, start.**
- **Text:** none beyond the engraving and the pictogram.
- **Transition:** the camera sinks toward the glass.

---

**Shot 5. Beyond the glass** · 0:17–0:30 · 13 s
- **Camera:** a steady logarithmic push, about 3 s per decade. The steadiness comes from *Powers of Ten*; the number is ours. The film travels out at one power of ten per 10 s and back in at one per 2 s ([Powers of Ten](https://en.wikipedia.org/wiki/Powers_of_Ten_(film))), and our 3 s sits between the two.
  - **0:17–0:20.** The camera sinks along the eye–glass–drop axis until the disc fills the frame. The bead fills half the view.
  - **0:20–0:25.** The push goes on, from about 6 mm to 0.2 mm across. **The glass gives up honestly.** Its detail limit is about 10 µm (the eye's 0.1 mm divided by 10), so its image goes soft as the frame shrinks. The rim has long since left the frame. *What follows is what the child cannot see yet.* Through the bead the leaf below swims up **upright and about six times larger**: veins, and the feet of hairs. The leaf lies inside the bead's focal length, so the drop is itself a magnifier, Stephen Gray's water microscope again (§1). For this bead the effective focal length nD/4(n−1) is about 4.3 mm, measured from the centre, and the leaf lies about 3.5 mm below the centre ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens); *estimate*). An object inside the focal length gives an upright, magnified virtual image ([Lens](https://en.wikipedia.org/wiki/Lens)), so nothing flips on this overhead path. The upside-down world belongs to side-on views of distant things (shot 1).
  - **0:25–0:26.** We are pressed against the skin: a curved mirror of sky holding the child's small dark reflection, with the drop's insides behind it, bright and upright.
  - **0:26–0:27.** The crossing: a soft white flash, ramped over 0.35 s and capped.
  - **0:27–0:30.** Under the meniscus the frame goes from 200 µm to 40 µm, steeply downward at first.
- **Seen inside:**
  - The water goes on further than seems possible.
  - Below, a leaf hair rises like a fluted glass tower. There is no floor. The bead rests on hairs, and its lower skin is pierced by them.
  - A pollen grain hangs like a planet.
  - A faint crowd of resident bacteria: leaves carry 10⁶–10⁷ per cm² ([BioNumbers](https://bionumbers.hms.harvard.edu/bionumber.aspx?id=115368)).
  - The tear's **salt front** hangs across our path: a broad band of brighter, faintly warm water, layered like heat haze and wider than the frame. We sink into its edge.
- **Sound:** shrinking is played as time-stretch.
  - Birdsong slows and darkens into long, whale-like moans.
  - **The child's breath stretches into a tide**, one swell about every 8 s, which carries on as the drop's ambience.
  - A fine, granular Brownian hiss rises.
  - The glass drone dissolves into shimmer.
- **Text:** the stepping scale bar only. It reads **1 cm** at 0:18, **1 mm** at 0:21, **100 µm** at 0:24 and again at 0:27, and **10 µm** at 0:31.
- **Transition:** the tower and the crowd sink into the haze, and the motes take over.

---

**Shot 6. The soft one** · 0:30–0:44 · 14 s
- **Camera:** it keeps descending, passes level with the cells, and slides **below** one rod at the salt front's edge. From there it looks up at the rod against the bright meniscus, with the frame about 17 µm tall. From 0:39 it begins to rise behind the rod.
- **Seen:**
  - **0:30–0:33.** Beyond that rod, out in the mixed water, about six **walled rods** run and tumble, with crisp, satin-edged outlines: the prototype's neighbours, now visibly walled. Among them a long rod pinches at its waist and parts in two, neat binary fission. (Walled cells divide like that. The soft one will have to overgrow.)
  - **0:33–0:39, an honest time-lapse.**
    - The caustic net races and the light warms from dawn-lilac to the prototype's morning. The first light rays slant into the drop, and the swimmers become quick streaks.
    - **Out in the mixed water the walled rods slow, swell and round up, then pale and thin** like breath on glass: tear proteins reach them there, with too little salt to save them. *E. coli* exposed to lactoferrin and lysozyme at 40 mOsm "become enlarged and hypodense" ([Ellison & Giehl 1991](http://www.jci.org/articles/view/115407)). The two new daughters go with them.
    - **The rod at the front's edge slows. Its wall splits along one side. A soft cell squeezes out sideways**, rounds up and trembles. Its interior blooms into the hero's colours: amber DNA, violet ribosomes, the warm glow.
    - Beside it the **empty wall turns slowly**, a glassy husk with a faint woven mesh. This is *Utsusemi*, "cicada shell", who in *Genji* slips away "discarding her outer robe like a cicada discards its shell" ([Utsusemi](https://en.wikipedia.org/wiki/Utsusemi)).
    - It also matches how L-form birth has been filmed: the soft protoplast has to escape its wall sacculus ([Domínguez-Cuevas et al. 2012](https://doi.org/10.1111/j.1365-2958.2011.07920.x)).
  - **0:39–0:44.** Normal time returns. Pale, swollen ghosts drift in the mixed water and thin to nothing. The soft cell trembles in the salt, alive. **Nothing points at it.** It is noticed, not labelled, and the question *why am I alive?* is already in the frame.
- **Player: resting the view hands over.** This is gameplay §9.1's rule. From 0:39, a player who has looked around and then holds the soft cell in the centre of the frame for 0.8 s (the hub's alignment test) starts shot 7 at once. The test needs a look-around first, so a player who never touches the mouse sees the whole shot, and shot 7 starts at 0:44.
- **Sound:** the walled rods' thin, high glass harmonics drop out one by one as they fade. The rod at the front's edge keeps its harmonic until its wall splits; then it breaks into a warmer, slightly detuned wobble: the hero's timbre, wet glass that sounds soft. The tide goes on.
- **Text:** none.
- **Transition:** continuous; the camera rises behind the soft cell.

---

**Shot 7. Handoff** · 0:44–0:46 · 2 s, then open-ended
- **Camera:** glides to **exactly the prototype's start pose** relative to the hero: `camera = hero + (5.6, 1.8, 2.1)`, `FOV 42`, `OrbitControls` target on the hero. The glide ends at zero velocity, so damping has nothing to undo.
- **Seen:**
  - The in-world interface fades in: the vitals ring (ATP in mint, envelope in paper) and the scale bar, now reading **1 µm** exactly.
  - The flagella stiffen and bundle, and the membrane breathes.
  - Floating control pictograms appear in the water, and a glucose bead drifts close.
  - The hero has been eased to the origin, at `rotation.y = −0.35`. The frame is the prototype's own first frame (`docs/start.jpg`).
- **Player:** input unlocks at 0:46, or earlier when the view came to rest on the cell (shot 6), as soon as the 2 s glide ends. If the player waits, nothing is forced: the cell idles, wobbles and breathes with the tide.
- **Sound:** the motif resolves into a held chord. A soft click-ripple marks the ring appearing.
- **Text:** the control pictograms only.
- **Transition:** none. This is the game.

---

**Shot 8. Codon (first play)** · 0:46–about 1:10
- **Seen:**
  - The first swim. Engulfing the glucose bead makes the energy route flicker along its whole length.
  - Then **CODON — Rewrite life.** floats in the water along the player's first heading. It appears after the first meaningful act, as Journey places its title ([Journey](https://en.wikipedia.org/wiki/Journey_(2012_video_game))). Swimming through it ripples it.
  - About 12 s later a vast soft shadow sweeps across the caustic net overhead and the light dips: the child leaning closer. This is the first blink. The watcher is here, and on a schedule.
- **Sound:** A–U–G restated over the title, thinning into ambient gameplay music. The tide stays.

### 5.3 Replays, skipping, accessibility and targets

- **Replays.**
  - From the second launch on, the game opens on the hub (shot 4) with the run select.
  - The dive takes **3 s**, as in gameplay §2.6. It follows the same path, from the hub's 90 mm frame to the 4.8 µm handoff (4.3 decades), at about 0.7 s per decade (*estimate*). That is quicker than *Powers of Ten*'s 2 s return ([Powers of Ten](https://en.wikipedia.org/wiki/Powers_of_Ten_(film))) and close to research §3.5's "about 1 s". The crossing flash keeps its 0.3 s minimum ramp.
  - Shot 6's transformation is skipped, because your lineage's current cell is already soft.
  - The first morning stays on its notebook page and never replays on launch.
- **Skip.**
  - Holding Esc or B for 1 s skips, even on first launch. A ring fills on the loupe rim in the Garden, or around the hero in the drop.
  - The skip plays one blink and lands in shot 7's end state with the morning palette.
  - Skipping The first morning lands in the hub with the lens in hand.
- **Accessibility.**
  - Captions for every sound that is not speech.
  - **Reduced motion:** the logarithmic push is replaced by three crossfades (hub → skin close-up → 40 µm → handoff).
  - **Flash limit:** the crossing flash ramps over at least 0.3 s, peaks at no more than 0.9 of display white, and never occurs more than once a second.
  - Colour never carries meaning alone: the soft cell reads by motion and shape.
  - No input is ever required.
- **Playtest targets.**
  - First input response at 5 s or sooner.
  - Lens control at 10 s or sooner (gameplay §8.3); 0:08 as authored.
  - Hero control at 75 s or sooner; 0:46 as authored, 1:07 at the latest.
  - Fewer than 5% of first-time players quit during the opening.
  - More than 70% notice the soft cell without help.
  - More than 40% connect "tear → soft" before the tear's honesty card (§7) spells it out.
  - More than 60% discover the focus flip unprompted.

---

## 6. How to build it in three.js (`src/intro.js`)

### 6.1 Architecture

**Two stages, one composer, one lens.**

| Stage | Units | What it is |
|---|---|---|
| **Garden** | **millimetres** | A new, light `THREE.Scene` in `src/garden.js`: sky dome, backdrop cards, ground card, leaf, beads, tear, child card, loupe, fingers, stepping scale bar. Its own `PerspectiveCamera` at FOV 42. |
| **Micro** | **micrometres** | The **existing** prototype scene from `src/main.js`: `Water`, `CellPass`, `Bacterium`, `Neighbours`, `Hud`. |

There is no third "bead interior" layer. The 200 µm → 5 µm descent happens inside the existing Micro scene by **scaling haze and caustics with camera distance**: fog density follows the zoom, so the drop looks equally deep at every scale. This replaces The Lens and the Tear's 10 µm layer and costs a few uniforms.

**One composer.** `composeLook()` (`src/lens.js`) already returns its passes. The intro swaps what the first pass draws:

```js
// intro.js
enterGarden() {
  const { scenePass, front } = this.look;
  scenePass.scene = this.garden.scene;   // RenderPass keeps .scene / .camera
  scenePass.camera = this.garden.camera;
  this.cellPass.enabled = false;         // no cells at garden scale
  front.enabled = false;                 // no water particles in front
  this.glass.enabled = true;             // GlassPass, see shot 4
}
enterMicro() {
  const { scenePass, front } = this.look;
  scenePass.scene = this.scene;
  scenePass.camera = this.camera;
  this.cellPass.enabled = true;
  front.enabled = true;
  this.glass.enabled = false;
}
```

Bloom, `OutputPass` (Neutral tone mapping) and the lens grade keep running, so the **Garden gets the same look**. All Garden colours are picked as display colours through `sceneColor()`, exactly like `water.js`.

**One lens.** FOV is 42° in every shot, in both stages. Scale changes come from moving the camera, never from zooming, except inside the loupe, where magnification is optics.

**Three times.**
- `real`: wall-clock delta. It drives the camera paths and the cue timeline.
- `world`: `real × intro.timeScale`. It feeds `clock.uTime`, neighbour AI and every shader. This gives slow motion in shot 2 (down to 1/500) and the time-lapse in shot 6 (×8).
- `cue`: the authored timeline, in real seconds since 0:00. The audio animatic exports it as a cue sheet (`intro.cues = [{ at, until, fn }]`). From the dive on, cues count from the moment the dive starts (`intro.diveAt`, 0:17 at the authored pace), so a player who lingers in the hub shifts everything after it intact. The first morning has its own cue sheet.

**`main.js` integration (sketch).**

```js
const intro = Intro.shouldPlay(params) // first launch, or ?intro
  ? new Intro({ renderer, composer, look, scene, camera, controls, cellPass, water, hero, neighbours, player, hud })
  : null;

function frame(now) {
  timer.update(now);
  const real = maxFrames < Infinity ? 1 / 60 : Math.min(timer.getDelta(), 1 / 20);
  const k = intro?.active ? intro.timeScale : 1;
  const dt = real * k * (player.inspect ? 0.25 : 1);
  t += dt; clock.uTime.value = t;
  if (intro?.active) intro.update(real, dt);   // drives camera, hero, stage switches
  else { /* the existing player → metabolism → hero → feeding → follow → controls block */ }
  if (!intro?.inGarden) {
    neighbours.update(dt);
    water.update(camera, intro?.focus ?? camera.position.distanceTo(hero.group.position));
    hud.update(real, camera, player, metabolism.state, feeding.state);
  }
  composer.render();
  labels.render(scene, camera);
}
```

`look` is the object `composeLook()` already returns; `main.js` already holds it as `look`, so pass it in whole.

**Audio needs a gesture on the web, not on Steam.** Shot 0 is audio first. A browser creates an `AudioContext` in the "suspended" state until the page receives a user gesture, and `resume()` must be called after one ([Chrome autoplay policy](https://developer.chrome.com/blog/autoplay)). Only a key press, a click or a touch counts; mouse moves and the scroll wheel do not ([MDN: user activation](https://developer.mozilla.org/en-US/docs/Web/Security/User_activation)). So the hub's parallax cannot unlock sound.
- **Steam build.** Electron's `autoplayPolicy` defaults to `no-user-gesture-required` ([Electron `webPreferences`](https://www.electronjs.org/docs/latest/api/structures/web-preferences)), so the opening starts at launch with no pre-roll. Any other wrapper must allow autoplay the same way. This is the build the refund clock applies to, and the §5.1 times hold from launch.
- **Web build.** A black pre-roll shows the Holarky mark and *click or press any key*. That gesture resumes the `AudioContext` and starts 0:00 at once, so it is itself the first response. On the web the §5.1 times are measured from it.

### 6.2 Changes to existing files

| File | Change | Reused later for |
|---|---|---|
| `cellpass.js` | **Per-cell `uniform vec4 uCellX[MAXC]` = (wall, pinch, husk, split or ghost)**, filled in `updateUniforms()` (around line 1217) from `cell.wall ?? (cell.kind === CELL_KIND.rod ? 1 : 0)`, `cell.pinch ?? 0`, `cell.husk ? 1 : 0` and `cell.husk ? (cell.split ?? 0) : (cell.ghost ?? 0)`. Shader changes are listed below the table. | The wall toggle node; overgrow-to-divide; division heirs; osmotic deaths (`ghost`) |
| `water.js` | Dome uniforms `uScale` (caustic net size), `uShade` (vec4: direction, strength) and `uShadeR` (vec2: inner and outer cosine), and `uFlash`. Methods `setPalette(drop, sunDir)`, `setFogDensity(d)` and `setSun(dir)`, which recomputes `_rayUp` for the light shafts. | The watcher's shadow, the blink, the dew clock, Memories' era palettes, the loupe's hot spot and the bead's UV focus |
| `lens.js` | `export const DAWN` (display colours, below) and `lerpDrop(a, b, s)`. The lens grade's `uLift` and `uWarmth` are lerped from it. | The **Era / time-of-day palette lerp**: dawn → morning in the opening, then the in-run dew clock, Memories and dusk in Act IV |
| `hud.js` | An `introFade` (0..1) multiplier on the ring, labels and plaque. The plaque splits into **hints** (shown at handoff) and **title** (placed along the predicted heading after the first meaningful act). A `stepBar(label, length)` for the intro's stepping scale bar. Later, the generations counter in `barLabel`. | The lineage interface |
| `bacterium.js` | An `H` option for neighbour rods (the hero stays at 0.5), so a 4 µm rod can divide into two standard rods. Each cell gets `wall`, `pinch` and `husk` fields that CellPass reads. | Division in runs |
| `neighbours.js` | A constructor option `{ rods: 6, cocci: 1 }` for the intro, and a `spawnAt(transform)` used for the division swap | Dense drops |
| `src/crowd.js` (new) | **Far-crowd impostors** beyond `MAX_CELLS = 12`: an `InstancedMesh` of about 2,000 camera-facing quads, each a tiny SDF capsule with a thin-film rim tint. It uses scene fog (`#include <fog_fragment>`) and fades in past 25 µm. | Busy run drops: Thrive's "empty void" complaint answered |
| `src/garden.js` (new) | The Garden stage | The run-select hub; Act hubs; the ending's reverse dive |
| `src/intro.js` (new) | The director: cues, camera paths, the stage swap, skip, handoff | Ending pull-out; Memory intros |

**`cellpass.js` shader changes, all small and local.**

1. **The wall.** `bodySd()` (around line 298) scales wobble by `(1.0 − 0.85·wall)`. In `filmLook()` (around line 345), the outer film (`f == 0`) blends toward a calm satin sacculus band as `wall` → 1:
   ```glsl
   body *= 1.0 + 0.8 * X.x;
   shine *= mix(1.0, 0.55, X.x);
   thick = mix(thick, 520.0, 0.5 * X.x);
   tintMix = mix(tintMix, 0.6, 0.5 * X.x);
   ```
   For the hero, `heroInterior()` scales its density and emission by `mix(1.0, 0.35, wall)` and desaturates toward the tint by `0.6·wall`. A walled hero therefore looks like a plain rod, and the interior "blooms" as the wall goes.
2. **The husk.** In `field()` (around line 708), when `husk > 0.5`:
   - set `gFd[1] = 1e3` (no inner membrane);
   - skip the periplasm and the interior;
   - cut the shell with a slit: `gFd[0] = max(sd, splitW·split − abs(p.x))` where `p.y > 0`;
   - add a faint hoop-wise weave to the film thickness, `thick += 120·smoothstep(0.82, 1.0, abs(sin(atan(p.y, p.x)·18.0)))·smoothstep(0.7, 1.0, abs(sin(p.z·22.0)))`. Peptidoglycan's glycan strands run roughly round the rod.
3. **Division** (`pinch`). Two lobes and a furrow. This extends the pocket "pinching neck" code at lines 250–289:
   ```glsl
   // pinch 0..1: a furrow at z = 0 that deepens until the halves are two cells
   float divideSd(vec3 p, float R, float H, float pinch) {
     float zc = 0.5 * (H + R), hd = max(0.5 * (H - R), 0.0); // daughter centre, core half-length
     float a = capsuleSdH(p - vec3(0.0, 0.0, zc), R, hd);
     float b = capsuleSdH(p + vec3(0.0, 0.0, zc), R, hd);
     return smin(a, b, (1.0 - pinch) * 1.2 * R);               // wide blend = one cell
   }
   ```
   The two daughter capsules tile the parent exactly, so at `pinch = 1` a rod with `H = 1.5` becomes two standard rods (`H = 0.5`, centred at ±1.0 µm). That is why the intro can swap in two real neighbours with no pop. The furrow gets the same bright iridescent collar as a pocket's neck: `collar = pinch·exp(−z²/(0.2R)²)`; `shine *= 1 + 2·collar`; `thick += 240·collar`. Note that `flowWarpC()` assumes H = 0.5. Pass H through `uGeom` so that long cells flow correctly.

**The dawn palette** (display sRGB, morning = the prototype's `DROP`):

```js
export const DAWN = {
  meniscus: 0xd3d9ec, sky: 0xd6deee, horizon: 0xcad3e6, haze: 0xe0d6ef,
  deep: 0x9fb8d2, abyss: 0xaca6d6, sun: 0xffd9bd,
  sunDir: [0.35, 0.12, 0.45],          // the morning sun's azimuth, about 12° up
  lens: { lift: [0.5, 0.47, 0.66], liftAmount: 0.08, warmth: 0.0 },
};
// s: 0 dawn .. 1 morning. Lerp display colours, then sceneColor() each; push to the dome,
// FogExp2 colour, cellPass.setEnvironment({ sky, deep, fogColor, sunColor, sunDir }) and the
// lens grade. Rebake scene.environment (PMREM) twice: at dawn and at morning, swapping at s = 0.5.
// Shafts: uFade *= smoothstep(0.35, 0.8, s), so rays appear as the sun climbs.
```

### 6.3 Shot by shot

**Garden coordinates.**
- The leaf is centred at the origin, with its blade around `y = 0`.
- The central bead sits at `B = (0, 3.4, 0)`, radius 2.0 mm, held on hairs. After the merge its radius is 2.15 mm and its centre 3.55 mm.
- The child card sits toward −z.
- Camera poses are given relative to B as (distance, elevation, azimuth from +z).
- `near = max(0.02, 0.05·distance)` and `far = 10000`.

---

**Shot 0. Before light.**
- `enterGarden()` with the camera at its shot 4 pose on first launch, or at its shot 1 pose in The first morning.
- A sky-dome uniform `uDawn` runs 0 → 0.15 and a full-screen fade runs from black.
- The single point of light is the bead's sky-window highlight, with its exposure ramped on its own for 1 s before the rest of the frame.
- Audio: see §6.4. The breath runs through an HRTF `PannerNode` at near-field distance.

---

**Shot 1. The leaf.**
- **Sky and backdrop.**
  - The sky is an inverted sphere with a dawn gradient: zenith `0xb9c4e4`, horizon glow `0xf3dccd`.
  - Backdrop cards are big quads with procedural SDF shapes: the house at `z = −3500` (a warm window `0xffd9a8`), and the step edge at `z = −450`.
- **The child card.**
  - A quad carrying a **2D SDF silhouette**: a circle head, a rounded-box torso, capsule limbs.
  - Three key poses are blended by lerping capsule endpoints: P0 sitting with head down; P1 a two-cycle shoulder shake; P2 leaning forward with a hand to the face.
  - A brass glint is a small bright disc in the lap.
  - The card moves in 3D between poses, from the step at about `(0, 520, −430)` to about `(0, 150, −40)` when leaning.
  - **It is never in frame in shots 1–2.** From shot 1's camera (55 mm from B at 8°), the card sits about 54° above the view axis, and the frame's half-height is 21°. The child reaches the shot only through the bead's refraction, which sees the whole sky. That is the reveal the shot wants, so do not move the card into frame.
- **Analytic defocus.** No depth-of-field pass is used.
  - Every procedural edge in the Garden is drawn with `smoothstep` width `max(1px, CoC(z))`.
  - CoC uses the same thin-lens form as the `water.js` particles: `coc = A · S · |1/z − 1/zf|`, where `S = H_px / (2 tan 21°)`, `zf` is the distance to B and `A ≈ 3 mm` in shots 1–2.
  - For example, the step edge about 500 mm away gives about 68 px of blur at 1080p, with the focus on B at 55 mm. That is real bokeh at no cost.
- **The leaf.**
  - One polar-grid mesh (96 × 192) bent in the vertex shader:
    - a cup, `y += c·r²`;
    - pleats with the veins in the valleys, `y += a·r·|sin(nθ/2)|`, with n = 9;
    - a margin `r ≤ R(θ)·(1 + 0.05 cos 9θ)` with small sawtooth teeth.
  - Veins are drawn from the distance to the radial primaries plus domain-warped Voronoi areoles.
  - Shading uses a backlit translucency term and a waxy sheen.
- **The hairs** use six **alpha shells** (the leaf mesh redrawn, each offset 0.2 mm along the normal, with a hashed hair mask and a simple anisotropic glint). About 40 instanced tapered cones under each large bead show it resting on hairs in close-up.
- **The beads.**
  - About 25 sphere proxies: the central bead, roughly 16 tooth-tip beads of 0.4–0.7 mm, and about 8 more on hairs.
  - Each uses **analytic ray–sphere refraction** into one shared `WebGLCubeRenderTarget(128, HalfFloat)` taken by a `CubeCamera` at B.
  - The cube renders an `envScene`: the same sky, cards and leaf, but drawn **sharp** (CoC = 0).
  - Refresh the cube only when the child pose changes, at most 15 times a second.
  - Fragment, in scene-linear (refraction is done three times with n = 1.331, 1.333 and 1.336 for faint dispersion):

    ```glsl
    vec3 N1 = normalize(P - C);
    vec3 T1 = refract(D, N1, 1.0 / n);
    T1 = normalize(T1 + uSchlieren * gradS(P, uTime)); // shot 2: the salt field bends the ray
    float L = -2.0 * dot(T1, N1) * r;                  // chord length through the sphere
    vec3 P2 = P + T1 * L;
    vec3 N2 = normalize(P2 - C);
    vec3 T2 = refract(T1, -N2, n);
    if (dot(T2, T2) < 1e-4) T2 = reflect(T1, -N2);     // total internal reflection
    vec3 behind = textureCube(uEnv, T2).rgb;            // far field: sky, house, child
    if (T2.y < -0.05) {                                 // near field: the exit ray meets the leaf
      vec3 Q = P2 + T2 * ((uLeafY - P2.y) / T2.y);     // uLeafY: the blade's height under this bead
      behind = mix(behind, leafColor(Q.xz), leafMask(Q.xz)); // the leaf shader's own SDF and colour, drawn sharp
    }
    vec3 col = mix(behind, textureCube(uEnv, reflect(D, N1)).rgb, fresnel(dot(-D, N1), 0.02));
    ```

  - **Far field.** The upside-down child appears without extra work. The child, the house and the sky lie far beyond the bead's focus, which is exactly what a cube map assumes, and a ball lens inverts what lies beyond its focus ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)).
  - **Near field.** The leaf does not. It lies about 3.4 mm below the bead's centre (3.55 mm after the merge), inside the effective focal length nD/4(n−1) of about 4.0 mm (4.3 mm after the merge), measured from the centre (*estimate*). So a real bead shows the leaf **upright and magnified**, about 6×, from any distance above it (paraxial *estimate*, m = f/(f − s)), as a magnifying glass does ([Lens](https://en.wikipedia.org/wiki/Lens)). A cube map taken at B treats the leaf as infinitely far away and would draw it inverted. That is why the shader intersects the exit ray with the leaf plane. `leafColor` and `leafMask` are a GLSL chunk shared with the leaf material.
  - Tooth-tip beads reuse the central cube for the far field (the parallax error does not show) and do their own leaf-plane intersection with their own `uLeafY`.

---

**Shot 2. The tear.**
- **Time.** `timeScale` ramps:
  - from 1 to 1/300 as the tear enters the frame;
  - to 1/500 at contact, held for about 2.5 s on screen;
  - eased to 1/30 while the bead rings;
  - back to 1 by 0:25.
- **The fall.** The tear (radius 1.25 mm) falls from about 120 mm under gravity (about 1.5 m/s at impact). It is a sphere proxy with the bead shader.
- **Contact.** For the 1.2 s of contact on screen, draw the pair inside one box mesh with a **raymarched SDF**:
  - `smin(sphere(B, 2.0), sphere(T, 1.25), k)`, with k growing as the neck widens;
  - at most 48 steps;
  - central-difference normals;
  - refraction at entry into the cube map, then exit through the merged bounding sphere.

  Only this one pair is raymarched, and only for these seconds.
- **The ringing.** After the merge, a sphere proxy of radius 2.15 mm with vertex displacement:

  ```
  δr = r·[0.12·e^(−t/τ₂)·cos(ω₂t)·P₂(cosθ) + 0.05·e^(−t/τ₃)·cos(ω₃t)·P₃(cosθ)],   τ₂ ≈ 0.9 s, τ₃ ≈ 0.33 s
  ```

  θ is measured from the vertical. Rayleigh's free-drop formula, ω_l² = l(l−1)(l+2)·σ/(ρR³), gives ω₂ ≈ 240 rad/s and ω₃ ≈ 466 rad/s for R = 2.15 mm. Lamb's viscous decay time for a free drop, τ_l = R²/((l−1)(2l+1)ν), gives τ₂ ≈ 0.9 s and τ₃ ≈ 0.33 s with ν ≈ 1 mm²/s (Lamb, *Hydrodynamics*; *estimate*). So the real bead rings for dozens of cycles, not one or two. The hairs it rests on drain some energy at the contact points, by an amount we have no source for, so use Lamb's values. This is in *world* time; `timeScale` makes it watchable. As `timeScale` climbs back toward 1, multiply δr by `1 − smoothstep(0.1, 0.33, timeScale)`. At full speed the modes run at about 38 and 74 Hz, which a 60 fps frame cannot show without aliasing and the eye would see only as a shimmer (**Codon staging**).
- **The satellite** is a 0.3 mm sphere on a scripted ballistic arc.
- **Schlieren.**
  - Salt field `S(x, t)`: curl noise advected inside the bead.
  - `uSchlieren` bends the internal ray (above). Saline changes n only slightly, so keep it subtle.
  - Add ±2% luminance along |∇S| so the streaks read.
- **The tilt-up** is a target lerp from B to `B + (0, 10, −3)` and back. The child card in pose P2 is out of frame here too, more than 50° above the view axis (shot 1), so the "darkness above" is a soft top-of-frame shade: shot 3's `uSkyOcc` dimming plus a vertical gradient on the sky dome, both driven by the lean.

---

**Shot 3. Into their gaze.**
- **The camera** follows a spherical path around B, from (30, 18°, 0°) to (117, 88°, 180°), with smootherstep easing.
- **Orientation:** `lookAt(B)`, with `camera.up` blended from (0, 1, 0) toward (0, 0, 1) once elevation passes 60°. The top of the frame then points away from the child (+z).
- **Ground:** a ground card (soil, the pot rim, two more leaves, procedural and blurred) covers everything seen beyond the leaf.
- Hide the child card once it is behind the camera.
- `uSkyOcc` on the leaf and bead shaders dims them 15% as the child leans in.
- **The loupe.**
  - The rim is a `LatheGeometry` torus with a short ring handle, a brass `MeshPhysicalMaterial` (metalness 1, roughness 0.35) and procedural scratches from line noise.
  - The engraving and the scratched "G." are drawn into a `CanvasTexture` at start-up, as `hud.makePlaque` does. No image assets.
- **The fingers.**
  - Procedural `CapsuleGeometry` segments (about 2k triangles), attached to the loupe, so they sit at its depth and share its mild defocus.
  - A warm transmission shader: wrap lighting, plus back-light through thickness, `exp(−k·radius)` tinted `ORGANELLE.jellyGlow`.
  - The plaster is a rounded paper-coloured patch.

---

**Shot 4. The glass, the hub.**
- **Arrival (first launch), 0:04–0:08.** Reuse shot 3's loupe and fingers. They slide in from below the frame on a 2 s eased path to the resting height `d = 23 mm`, and `uSkyOcc` dips 15% over the same 2 s. The central bead starts at its merged size (radius 2.15 mm) with shot 2's salt field already running, `uSchlieren` at about half strength. Seconds after the tear, the bead is still churning from the impact and the Marangoni pull (§3.1), so the streaks are honest here. Hide the child card; the camera is at the child's eye.
- **Loupe placement.**
  - Raycast the cursor onto the plane `y = B.y`; ease the loupe's x/z there with a critically damped spring (0.25 s).
  - The loupe sits at height `d` above the bead (scroll range 6–45 mm; focal length `f = 25 mm`, since 10× = 250 mm / f; lens radius 15 mm), tilted 8° toward the eye.
- **Optics (thin lens, approximate, tuned by eye).**
  - With the camera height above the bead `H`, the magnification `m = f/(f − d)`, and the angular magnification seen from the eye is `M = m·H / (H + (m − 1)·d)`.
  - At `H = 117 mm` and `d = 23 mm`, that gives about 4×. As d → 0, M → 1; as d → f, M → H/f.
  - **Where it flips.** Nothing inverts at f. For d > f the loupe forms a real, inverted image f·d/(d − f) above itself ([Lens](https://en.wikipedia.org/wiki/Lens)), but the eye sees it inverted only once that image lies between the loupe and the eye. Setting f·d/(d − f) = H − d gives **d_flip ≈ 36 mm** at H = 117 mm, which is exactly where M's denominator `H + (m − 1)·d` crosses zero. From f to d_flip, M stays positive and grows without limit: the view is upright, swelling and badly smeared. Beyond d_flip, M is negative: inverted.
- **The portal.**
  - Each frame, render the Garden (with the loupe and fingers on a hidden layer) into `loupeRT` (512², HalfFloat) from a `loupeCam` at the eye, aimed at the loupe centre, with `fov = 2·atan(tan(α)/|M|)`, where α is the disc's angular radius. Clamp |M| at about 30 near d_flip, where the disc fills with one smeared colour, as a real loupe's does. The disc's UVs then map straight onto the target.
  - The disc shader adds barrel distortion `uv' = c + (uv − c)(1 + 0.08 r²)` and rim colour fringing in the style of `lens.js` (R, G and B sampled at slightly different radii near the edge).
- **Focus blur.**
  - A 12-tap Poisson blur in the disc shader with radius `blurPx = 14·smoothstep(0.03f, 0.25f, |d − 0.92f|)`.
  - Do not mirror at f. Keep the blur heavy from f to d_flip ≈ 36 mm: the formula above reaches its 14 px ceiling by about 29 mm, so hold it there. Mirror the UVs only where M < 0, beyond d_flip, and ease the blur to about 6 px by the top of the scroll range (45 mm). That last easing is a mercy, so the inverted world reads: the real image there sits only 10–16 mm from the child's eye, far too close to focus (*estimate*).
- **Alignment.** If the bead's screen centre is within 0.15 of the disc radius and `blurPx < 1.5` for 0.8 s, play the ting and brighten the bead's rim (+20% on its Fresnel term).
- **Dive input.** Click, `KeyW` or a trigger. On first launch the target is forced to the tear bead. In later runs, the bead under the loupe seeds the run (its kind sets the biome).

---

**Shot 5. Beyond the glass.**
- **(a) Sinking to the glass, 0:17–0:20.** The camera moves along the eye–loupe axis. About 13 mm above the loupe the disc fills even the corners of the 16:9 frame (its 49° half-angle is larger than the frame's 38° corner half-angle).
- **(b) The swap, at 0:20.**
  - Replace the eye-plus-loupe view with an **equivalent camera**: same axis, FOV 42, at the distance from B that gives the same framing of the bead.
  - From now on, `GlassPass` draws the loupe's barrel distortion, fringe and blur over the whole frame.
  - `GlassPass` is a `ShaderPass` inserted right after the scene pass (`composer.insertPass(glass, 1)`), working in scene-linear. It is enabled only in shots 4–5.
  - The swap is invisible because the framing matches and the image is already soft.
- **(c) The push, 0:20–0:25.**
  - `(D − r) = 8 mm · 10^(−0.3t)`, with t in seconds from 0:20: 1.5 decades in the 5 s, about 3.3 s per decade, ending near 0.25 mm.
  - On replays the whole path, (a) to (e), runs at about 0.7 s per decade and takes 3 s (§5.3).
  - The **honest limit**: `blurPx = 0.5 · 10 µm / (h / H_px)`, capped at 40, where h is the object frame height at the skin. That works out to about 3 px at 2 mm, 11 px at 0.5 mm and 27 px at 0.2 mm.
  - Nothing flips here. Seen from above, the bead shows the leaf upright and about 6× larger at every distance, through the leaf-plane intersection (shot 1); the honest blur softens it with everything else.
- **(d) The crossing, 0:26.**
  - Ramp `GlassPass.uFlash` 0 → 1 over 0.35 s. At its peak, call `enterMicro()` with `water.dome.uFlash = 1`, then decay it over 0.35 s.
- **(e) Micro descent, 0:27–0:30, in µm.**
  - **Camera offset from its target:** (distance D, elevation e, azimuth a), with a measured in the xz-plane from +x toward +z. The prototype's pose is (6.25, 16.7°, 20.6°).
  - **Keyframes**, smootherstep between them, with D interpolated in log space:
    - 0:27: (260, +65°, 20.6°)
    - 0:30: (52, +25°, 20.6°)
    - 0:33: (22, −25°, 20.6°), so the camera passes level with the target and slides below it
    - hold until 0:39
    - 0:44: (13, +5°, 20.6°)
    - 0:46: (6.25, 16.7°, 20.6°)
  - **Target:** it starts on the hero's isohaline (below) about 70 µm upstream and arrives on the hero by 0:33.
  - **Scale-invariant haze**, each frame: `fog = 0.02 · min(1, 12/D)` through `water.setFogDensity()`. This updates `scene.fog.density`, every particle layer's `uFog`, each shaft's `uFog` (× 0.6) and `cellPass.setEnvironment({ fogDensity })`. It gives 0.0009 at 260 µm and 0.02 at the handoff.
  - **Caustics:** `dome.uScale = clamp(D / 6.25, 1, 40)`. The net is fine and tiny at the top of the descent and swells as we sink; the `far` fade already in `caustic()` keeps it from aliasing.
  - `camera.near = max(0.02, 0.004·D)`.
  - The existing mote and glint layers are sub-pixel above about 30 µm, so they are culled, and they appear by themselves as the camera arrives ("the motes take over").
  - **Props.**
    - Two **hair towers**: tapered `CylinderGeometry`, radius 9 → 5 µm, about 900 µm long, rising from below. Fluting comes from a normal perturbation `sin(12θ)`; the glass shader uses a Fresnel rim and `scene.environment` reflection.
    - One **pollen grain**: a 13 µm sphere with reticulate Voronoi ridges in pale amber.
    - The dome's `deep` is tinted toward celadon at dawn: the leaf seen through the lower skin.
  - **The salt front.** Not a strip: a broad band, 0.3–1 mm across (build it at w = 500 µm), whose gradient the hero sits in (§3.1).
    - **A salt field.** Let x be the signed distance into the front from its mixed edge, measured along `n` and bent by `warp(p)` so the band curves gently. Then `S = smoothstep(0, e, x)·(1 − smoothstep(w − 150, w, x))`, with w = 500 µm and an edge width e = 20 µm. Put `x0`, `n`, `w` and `e` in a `uFront` uniform.
    - **The edge is drawn steeper than diffusion would leave it** (half a minute after the tear it would be about 250 µm wide, *estimate*: √(2Dt), §3.1), so that the dying rods and the soft cell share one frame (shot 6). The salt-front card covers it (§7).
    - Draw the band as a stack of 7 large translucent sheets (each about 900 × 600 µm, Catmull-Rom-curved), spaced evenly across it, the first just inside the mixed edge.
    - **The hero's isohaline** (S ≈ 0.7, about 10 µm inside the mixed edge, in the steep part of the gradient) passes **through the origin**. Orient `n` so that the mixed side lies beyond the hero as the shot 6 camera looks up at it.
    - Sheet shader: the schlieren striations `1 + a·sin(40v + 6·noise(p·0.2 + 0.05t))` with `a = 0.03·S`, applied premultiplied so they slightly lighten or darken the water, plus a warm tint `sceneColor(0xfff1e4)` at `4%·S`. `depthWrite false`, `renderOrder 3`, fog on.
    - Pass `uFront` to the mote layer too, so mote glints warm with S where no sheet is in view.
    - At 260 µm the stack reads as one broad, shimmering band. At the handoff the hero hangs just inside the first sheet, with brighter, warmer water behind it and plain mixed water ahead.
    - Real refraction through it waits for polish.
  - **The crowd.** `crowd.js` places impostors in loose clusters along the towers and in the water, 25–300 µm from the path.
  - **The stepping scale bar.** The label is the largest power of ten no bigger than 0.3 × the frame width. In the Garden it is a line mesh plus a canvas label beside B; in Micro it is `hud.stepBar`.

---

**Shot 6. The soft one.**
- **CellPass budget.** Run the intro with `Neighbours({ rods: 6, cocci: 1 })`: hero + husk + 6 rods + 1 coccus = **9** volumetric cells, and 10 once the dividing rod's second daughter appears, still under `MAX_CELLS = 12`.
- **The rods in the mixed water.** Place the six walled rods 25–60 µm from the hero, outside the front (S = 0) and beyond the hero as the camera looks up, so that they share the frame.
  - Over the time-lapse each one slows (thrust → 0), swells and rounds up (`R` 0.5 → 0.7 and `H` 0.5 → 0.25, through the existing `uGeom`), then goes **hypodense**.
  - `split` is read only on husks, so on every other cell the same `uCellX.w` slot carries `ghost` (0..1). It scales interior density and emission by `1 − ghost` and thins the film toward the water colour.
  - Stagger them by 0.5–1.5 s, and drop each from the draw list at `ghost = 1`, which frees CellPass budget.
- **The dividing rod.** One of those six, built with `H: 1.5` (4 µm long) about 25 µm from the hero, with `pinch` 0 → 1 over 0:30–0:34. At `pinch = 1`, replace it with two standard rods at ±1.0 µm along its axis via `neighbours.spawnAt()`. The shapes match exactly, so only the flagella shift, at 25 µm away and in time-lapse. The two daughters then swell and fade with the rest.
- **The hero before the escape.**
  - The hero is the real `Bacterium({ hero: true })` from the start, with `hero.wall = 1`.
  - An `IntroDriver` gives it the neighbours' run-and-tumble (`{ thrust, bundle, omega }` into `hero.update()`), tethered to within 1.5 µm of its isohaline at the front's mixed edge (shot 5e).
  - From 0:33 its thrust eases to 0.1.
- **The time-lapse.**
  - `timeScale` ramps 1 → 8 → 1 over 0:33–0:39, using 0.8 s smoothstep ends.
  - `lerpDrop(DAWN, LOOK.drop, s)` runs `s` 0 → 1 over the same window, and the sun climbs from 12° to the morning `sunDir`.
- **The escape** runs on real-time keyframes, not on `timeScale`.
  - **0:35.** Create the husk: a CellPass descriptor `{ body, shape: createCellShape({ amp: 0, wobble: 0 }), kind: CELL_KIND.rod, R: 0.5, H: 0.5, tint, husk: true, split: 0 }`, whose `body` copies the hero's world matrix. Then crossfade the wall onto it: over 0.6 s the husk's opacity goes up (through `wall`) while the hero's `wall` goes 1 → 0.
  - **0:35–0:36.** `split` 0 → 1 opens the slit.
  - **0:36–0:38.** The hero translates 1.3 µm sideways out through the slit, with wobble boosted 3× for 1.5 s, `bundle = 0` (limp flagella) and `omega` low.
  - While they overlap, CellPass composites the two volumes in entry order. That is not exact, but over 2 s and a faint shell it reads fine.
  - **0:38 onward.** The husk drifts and turns at 0.15 rad/s. It stays in the world as the first run's first landmark.
- **Ease to the start pose.** Over 0:39–0:44 the `IntroDriver` eases the hero's position to `(0, 0, 0)` and its quaternion to `Euler(0, −0.35, 0)`. Author the whole choreography in hero-relative coordinates, with the hero's isohaline passing through the origin, so the last frame is the prototype's.
- **Look-around.** Mouse drag adds a ±10° yaw/pitch offset that springs back with a 0.6 s time constant.
- **Resting the view.** From 0:39, once any drag has happened, run the hub's alignment test on the hero: its screen centre within 0.15 of the frame height of the centre, with no drag, for 0.8 s. A pass starts shot 7 early, and the rest of the ease to the start pose folds into shot 7's 2 s glide.

---

**Shot 7. Handoff.**
- **Final glide.** From 0:44 to 0:46 (or for the 2 s after the view came to rest), a cubic Hermite spline with zero end velocity arrives at `hero.position + (5.6, 1.8, 2.1)`. Set `controls.target.copy(hero.position)` and call `controls.update()` once.
- **Then, in the same frame:**
  - `controls.enabled = true`;
  - `player.enabled = true` (a new flag; `Player.update` returns idle drive while false);
  - `intro.active = false`, and `main.js` falls through to the normal loop.
- **No jolt.** OrbitControls damping builds up only from user input, so a stop at zero velocity hands over cleanly.
- **The interface.**
  - `hud.introFade` 0 → 1 over 0.8 s, starting 0.6 s into the glide (0:44.6).
  - The stepping bar becomes `hud.bar`, which is exactly 1 µm.
  - The hints plaque fades in.
  - When `Feeding` lands, spawn one glucose bead 3 µm ahead of the hero 1 s into the glide (0:45).

---

**Shot 8. First play.**
- **The title.** On the first meaningful act (engulfing the bead, or 3 s of swimming), place the title plaque **9 µm along the hero's current heading**, using the same offsets as `placePlaque()` but measured along the heading. It fades in over 1 s.
- **The first blink.** About 12 s later, animate `dome.uShade`:
  - the direction sweeps across the sky over 2.5 s, at strength 0.5, with `uShadeR` making a soft edge about 25° wide;
  - in the dome, `col *= 1 − 0.22·shade`, and the caustics are cut by `0.8·shade`;
  - mirror it on cells with `cellPass.uniforms.uLight.value *= 1 − 0.12·shade`.

  The same call with strength 1 over 0.5 s is **the blink** used for deaths and run ends.
- **Pose check.** The intro's final camera pose must match `docs/start.jpg`'s framing.

### 6.4 Audio

**Stems.** About 3 MB of OGG:
- a garden bed (birds, breeze);
- close breath, in three states (unsteady, held, steady), plus the "U" exhale;
- glass A and G (glass-armonica-like);
- a drone;
- the tear's *dumm*;
- the ting;
- a granular water bed and a Brownian hiss;
- the rod and hero timbres;
- the title chord.

**WebAudio graph.**
- `garden bed → BiquadFilter(lowpass) → gain`. As the frame height `h` shrinks, the playback rate falls about 0.12 octave per decade and the cutoff goes from 18 kHz at 1 cm to 400 Hz at 10 µm (`scaleExp = log10(h in m)`).
- `breath → HRTF PannerNode (0.3 m) → ConvolverNode`. From 0:25 (the skin, shot 5) the breath crossfades to a looped, slowed copy (rate 0.35, one swell every 8 s): **the tide**.
- Glass notes are one-shots scheduled from the cue sheet. On first launch the G fires on the dive input instead.

**Score first.** The audio animatic is built before any shot. Its timeline *is* `intro.cues`.

### 6.5 Build order, the graceful cut, budget and effort

**Build order** (The Kept's discipline):
1. **Score and audio animatic first.** Breath, tear, A–U–G, the shrink sweep. Export the cue sheet.
2. **The handoff shot first** (shots 6 and 7): the `wall` and `husk` uniforms, the `IntroDriver`, the glide and the interface fade. It is the smallest piece, and it proves the "no cut" promise against the prototype.
3. **Micro descent** (shot 5e): fog scaling, `uScale`, `uShade`/`uFlash`, the palette lerp, props, salt front, crowd.
4. **The hub** (shot 4): leaf, shells, beads with cube refraction, cards, loupe, fingers, focus optics, and the first-launch arrival. **Build it early: it is also the permanent run select.**
5. **Dive through the glass** (shots 5a–d): `GlassPass`, the equivalent-camera swap, honest blur, the crossing flash.
   - **This completes the first-launch opening:** shots 0 → 4 → 5 → 6 → 7 → 8, about 70 s, with the lens in hand at 0:08. It is the default from the first build, not a fallback.
6. **The first morning:** **leaf and child** (shot 1), **tear** (shot 2), **rise** (shot 3), and the notebook page that plays it.
7. **Division** on a neighbour (shot 6), then polish (§8).

**The ending pull-out comes last.** It reuses the dive in reverse plus one eye stage built once for **Seen**:
- an iris shader (polar fbm fibres `fbm(θ·60, r·4)`, crypt cut-outs, `pupilRadius` wide in the dark);
- a lens-flip portal (`uv = mix(1 − uv, uv, t)` across the lens plane);
- a cataract veil (forward-scatter haze);
- the photoreceptor mosaic (about 5k instanced glassy capsules, with outer-segment discs as a stripe term);
- a **mitochondrion CellPass preset**: capsule R ≈ 0.4 µm, H ≈ 0.8 µm, outer and inner slabs, cristae as a folded slab `sin(z·k + noise)` clipped to the inner membrane, and up to 8 full volumes plus impostors.

**Armour and Stop need no new technology:** the jar on the sill in morning light (the hub's Garden stage), one notebook page and one codon card each.

**Frame budget.** 60 fps at 1080p on GTX 1060-class hardware.
- The Garden is light: a 37k-vertex leaf × 7 (shells), about 25 analytic spheres, cards, one 512² loupe render (a Garden redraw), and a 6 × 128² cube at most 15 times a second.
- The raymarched tear runs only inside one box for about 1.2 s.
- Micro adds 2k impostor quads, two props and seven salt-front sheets to the existing frame.

**Effort.** Planning guesses, not quotes.

| Piece | Weeks |
|---|---|
| Director, cues, camera paths, skip, handoff | 1 |
| Micro additions (fog scaling, `uScale`, shade and flash, palette lerp, props, salt front, crowd) | 1.5 |
| CellPass `wall`, husk, division | 1 |
| Garden hub (leaf, shells, beads with cube, cards, ground) | 2 |
| Loupe, fingers, focus optics, `GlassPass` | 1 |
| Tear, schlieren, child card poses | 1 |
| Performance, accessibility, polish | 1 |
| **Total** | **≈ 8.5 engineer-weeks, plus about 3 weeks of audio.** The first-launch opening is about 5 weeks of that. |

---

## 7. Honesty cards

The opening and the frame must ship with these cards. Each carries one of gameplay §0's five badges and one source; a qualifier in brackets says which part the badge covers.

| Card | Badge |
|---|---|
| **A magnifier cannot show a bacterium.** The eye resolves about 0.1 mm and a 10× loupe about 10 µm; *E. coli* is about 1 × 2 µm ([BBC Science Focus](https://www.sciencefocus.com/the-human-body/how-small-can-the-naked-eye-see)). | Established |
| **The tear.** Tears carry lysozyme and lactoferrin and are as salty as blood plasma, about 275–299 mOsm/kg ([Tears](https://en.wikipedia.org/wiki/Tears); [Plasma osmolality](https://en.wikipedia.org/wiki/Plasma_osmolality)). Together the two kill *E. coli* through osmotic damage, less so in saltier water ([Ellison & Giehl 1991](https://doi.org/10.1172/jci115407)). Lysozyme helps wall-less L-forms emerge, shown in Gram-positive bacteria under β-lactams ([Kawai, Mickiewicz & Errington 2018](https://doi.org/10.1016/j.cell.2018.01.021)), and *E. coli* switches to L-form under cell-wall antibiotics ([Mickiewicz 2019](https://doi.org/10.1038/s41467-019-12359-3)). **A tear making a living L-form on a leaf within a minute is Codon's pacing.** | **Codon invention** (grounded in the cited biology) |
| **The mixed bead is hostile.** Dew is condensed vapour, so it is nearly pure water. One part tear (about 8 µL) to four parts dew (about 33 µL) leaves the bead near 60 mOsm/kg (*estimate*), close to the 40 mOsm at which *E. coli* exposed to lactoferrin and lysozyme "become enlarged and hypodense" ([Ellison & Giehl 1991](http://www.jci.org/articles/view/115407)). That is why the walled rods in the mixed water swell and fade in shot 6. L-forms need water as concentrated as their cytosol ([L-form bacteria](https://en.wikipedia.org/wiki/L-form_bacteria)). | Established (the numbers are an *estimate*) |
| **The salt front.** Real mixing takes seconds to minutes. The tear lands at about 1.5 m/s, a Weber number near 80 ([Weber number](https://en.wikipedia.org/wiki/Weber_number)), and its lower surface tension drags it across the bead's skin (the [Marangoni effect](https://en.wikipedia.org/wiki/Marangoni_effect)). Codon draws the unmixed tear water as a broad front, 0.3–1 mm across, with a steeper edge than diffusion would leave, and makes it last the first minutes of run 1 (§3.1). | **Codon staging** (real mixing takes seconds to minutes; we stretch it) |
| **The empty wall.** Filmed L-form birth requires the soft protoplast to escape its wall sacculus ([Domínguez-Cuevas et al. 2012](https://doi.org/10.1111/j.1365-2958.2011.07920.x), in *B. subtilis*). Shown here for *E. coli*. | Codon staging (real in *B. subtilis*; shown for *E. coli*) |
| **Time-lapse.** The switch takes hours, not seconds. Division takes tens of minutes. | Codon staging (film convention) |
| **High-speed camera.** Real drop coalescence takes milliseconds; it is shown about 500× slower. | Codon staging (film convention) |
| **No rainbow on water.** A clean water surface has no rainbow film. The iridescence belongs to the cell's membranes. | Established |
| **The upside-down child in the drop** is real optics, for distant things: a ball lens inverts what lies beyond its focus ([Ball lens](https://en.wikipedia.org/wiki/Ball_lens)). The leaf under the bead lies inside the focus, so from above the bead shows it upright and magnified, as a magnifying glass does ([Lens](https://en.wikipedia.org/wiki/Lens)). | Established |
| **Two hot spots.** The loupe's is heat: glass passes UVA but blocks "over 90% of the light below 300 nm" ([Ultraviolet](https://en.wikipedia.org/wiki/Ultraviolet)), so it calls the heat-shock response, not SOS. The bead's is UV: a drop held up by hairs focuses sunlight ([Egri et al. 2010 via ScienceDaily](https://www.sciencedaily.com/releases/2010/01/100111091226.htm)) and water barely absorbs UV ([Electromagnetic absorption by water](https://en.wikipedia.org/wiki/Electromagnetic_absorption_by_water)). UV damage, through RecA and SOS, is what wakes a prophage ([Lambda phage](https://en.wikipedia.org/wiki/Lambda_phage)). | Established / Codon staging (the bead's focus drawn as a spot crawling through the water, at game tempo) |
| **Breath as tide** | Codon invention (an artistic device, not a claim) |
| **A gut-type rod on a leaf.** It happens: plants detect *E. coli* at their stomata ([Melotto 2006](https://pubmed.ncbi.nlm.nih.gov/16959575/)). Wild L-forms living on leaves are an invention. | Debated (how well a gut-type rod lives on leaves) / Codon invention (leaf L-forms) |
| **Tooth-tip beads as sweet guttation.** Hydathodes at leaf teeth and tips do exude sap with sugars and amino acids ([Hydathode](https://en.wikipedia.org/wiki/Hydathode)). No source found for lady's mantle in particular. | Codon staging |
| **The alchemists' dew** ([Alchemilla mollis](https://en.wikipedia.org/wiki/Alchemilla_mollis)) | Established (history) |
| **The hero rhymes with eukaryogenesis**; it does not replay it. The mitochondrial ancestor was an alphaproteobacterium and the host an archaeon ([Eme et al. 2023](https://doi.org/10.1038/s41586-023-06186-2)). | Established (an alphaproteobacterium inside an archaeal host) / Hypothesis (how the partnership began) |
| **The Stranger, and being taken in.** The real guest was an alphaproteobacterium, inside an archaeal host ([Eme et al. 2023](https://doi.org/10.1038/s41586-023-06186-2)). The hero is *E. coli*-like, a gammaproteobacterium ([Gammaproteobacteria](https://en.wikipedia.org/wiki/Gammaproteobacteria)), so it stands in for that guest; it is not that guest. How the guest got in is a model, entangle–engulf–endogenize (E3), "one of several conceivable scenarios"; the cultured archaeon's cells "contain no visible organelle-like inclusions" ([Imachi et al. 2020](https://pmc.ncbi.nlm.nih.gov/articles/PMC7015854/)). It is about 0.55 µm across. The function of its 5 µm protrusions is "yet unknown", no one has seen it engulf a cell, and "archaea are not efficient cell eaters" ([Promethearchaeum](https://en.wikipedia.org/wiki/Promethearchaeum)). A Stranger line that grows big enough to wrap a 1 × 2 µm cell is invented. | Established (an alphaproteobacterial guest in an archaeal host) / **Hypothesis · E3 model** (entangling and wrapping) / Codon invention (an *E. coli*-like guest; a Stranger big enough to wrap it) |
| **Lux in *E. coli*** works when the genes are transferred ([PMC2944500](https://pmc.ncbi.nlm.nih.gov/articles/PMC2944500)). Seeing a glowing leaf colony with the naked eye is invented. | Established (lux in *E. coli*) / Codon invention (seeing it) |
| **In the dark, brightness counts, not size.** The largest-looking star spans about 0.06″, a thousandth of the eye's 1′ resolution, and is still seen ([Angular diameter](https://en.wikipedia.org/wiki/Angular_diameter)). So Visible is a light budget on a brightness meter, not the 0.1 mm mark (§4.4). The light per cell is a tuned value; we found no checked source for it. | Established / Codon staging (light per cell) |
| **One machine, two gearings.** G.'s mitochondria and the hero turn the same ATP synthase, but the vertebrate rotor ring has eight c-subunits ([Watt et al. 2010](https://doi.org/10.1073/pnas.1011099107)) and *E. coli*'s has ten ([Jiang, Hermolin & Fillingame 2001](https://doi.org/10.1073/pnas.081424898)): *eight teeth where yours has ten.* | Established |
| **UGA is not always stop.** In the standard code UGA is a stop; in the vertebrate mitochondrial code it is tryptophan ([NCBI genetic codes](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi)); and *E. coli* itself reads it as selenocysteine in a few genes, its formate dehydrogenases ([Zinoni et al. 1987](https://doi.org/10.1073/pnas.84.10.3156); [Selenoprotein](https://en.wikipedia.org/wiki/Selenoprotein)). | Established |
| **Recode is real, in a laboratory.** A lab *E. coli* reads two of its six serine codons as leucine; it blocks gene transfer to and from natural organisms and doubles in about 69 minutes against its parent's 44. Its makers "cannot rule out" phages that could still infect it ([Nyerges et al. 2023](https://pmc.ncbi.nlm.nih.gov/articles/PMC10151025/)). A wild cell doing this, on a leaf, in one summer, is invented. | Established · laboratory (designer code RS) / Codon invention (a wild cell, on a leaf, in one summer) |

---

## 8. Cuts applied, and what waits for polish

**Cut from the proposals, and why.**
- **The Lens and the Tear.**
  - *Lysozyme alone strips walls*: replaced by the lactoferrin-plus-lysozyme pair, with salt as the shelter.
  - *Lady's-mantle guttation stated as fact*: now badged as staging.
  - *A cataract-clouded G. seeing a faint dusk glow through a loupe*: the climax is now in full dark, hand in hand, with no lens, badged as invention.
  - *Five or six endings at launch*: cut to three. Armour came back to launch so that Recode, the namesake keystone, pays off in the story.
  - *The UAG stop*: replaced by UGA.
  - For v1, *the 150° crane, 3–5k instanced hairs and raymarched refraction on every bead*: replaced by the 180° spiral rise, alpha shells, and cube-map refraction.
- **The Unbroken Line.**
  - *The 108 s deep-time montage as the opening*: it moves into Memories and the codex.
  - *Tiers unlocking in history's order*: cut. Dates are stamps, not gates.
  - *The player-chosen Bacteria/Archaea fork*, *"the watcher is the daughter you let go"* and *"your line came off the watcher's hand"*: cut.
  - *The plural "Line" narrator*: cut; heirloom lines only.
  - *Mapping U to the note B*: cut; U is a breath.
  - *Clicking cells through `CellPass.pick()`*: cut. That function is the draw-list culler (around line 1187); the only gaze test here is the hub's screen-space check, and real pointer picking needs a budgeted raycast.
- **The Kept.**
  - *Mitochondria as the narrator with a 37-word lexicon*: cut. 37 survives as an easter egg; gene-to-word lives in the notebook.
  - *The retina fly-out as the cold open*: cut. Its technology serves the ending only.
  - *The sick child as the main frame*: cut; it is a New Game+ variant.

**Reconciled with `gameplay.md`.** The two documents once described different campaigns. Story owns the frame (gameplay §9), so gameplay §6.3, §8.4 and §9.2–9.3 now follow this document, and this document took in what gameplay needed:
- *Three Acts (Dawn, The Leaf, Dusk)*: replaced by the four Acts of §3.4.
- *Phase 4, multicellularity, at launch*: moved to the first "next summer" (§3.7), to keep gameplay's "one stage deep" rule. Act IV is now a finale built on Phase 1–3 systems.
- *Recode missing from the story*: it is now one door of the Act III fork, beside the Stranger (§3.4).
- *The Fortress and Partnership endings*: Fortress is folded into **Armour**, now a launch ending. Partnership splits: its open road now ends in **Seen**, and its partner story becomes **Taken In**, a later summer.
- *"The Flask" hub*: renamed; it is the jar on the sill (§3.2–3.3).
- *Leeuwenhoek-style letters to "the Society"*: replaced by Act-closing spreads in *What I saw — for G.* (§4.2).
- *A watcher who ages from child to student to old scientist*: replaced by one child of about nine, who is a year older each New Game+ summer and later hands the lens on (§3.7).
- *"Rewrite life." as the closing line*: it stays the store line and the opening's title card; Seen closes on *"Your eyes are full of them too. Once bacteria. Kept."*
- *This document's tear-first opening*, with the lens in hand at 0:33 and the hero at 1:11: the first launch is now shots 0 → 4 → 5 → 6 → 7 → 8, with the lens at 0:08 and the hero at 0:46, which meets gameplay §8.3 and §9.1 and research §3.4 and §6.1. The tear scene is **The first morning**, played from the notebook at the end of run 1 (§5.1).
- *This document's automatic handoff*: the view resting on the soft cell now hands over, as in gameplay §9.1, with the authored time as the fallback (shot 6).
- *This document's 6 s replay dive*: now 3 s, as in gameplay §2.6 (§5.3).
- *Gameplay's "round reading glass"*: the brass 10× loupe stays, because its 10× sets the honest limit and it carries G. (§5.1).

**Reconciled in the consistency pass.** Gameplay is the authority for systems and this document for the frame:
- *Three badge vocabularies across the three documents*: one set of five player-facing badges, mapped to gameplay's designer codes in gameplay §0 (§4.2, §7). Date stamps now have a column in gameplay §3.7, and "keep a partner inside you" is badged the same way everywhere: a road not taken (RN, its pacing RX), printed *Codon invention · a road not taken* (§3.5).
- *Two daughters at the first division*: three, as in gameplay's draft (§3.3).
- *Undeletable heirloom genes*: the amber glow stays as display; deletion follows gameplay's genome rules (§3.3).
- *A run as one morning against gameplay's Noon and Afternoon*: the frame wins, so gameplay's five stages are now named for one morning (Dawn, Early Morning, Midmorning, Late Morning, Rim) with their systems unchanged (gameplay §2.4), and the run length is gameplay's 18–25 min (§3.1).
- *Two lists of exits*: the systems are gameplay's five; the child's fingertip is now one of the Hitchhike exit's carriers, and the jar is the hub between drops, not an exit (§3.1, §3.2).
- *"Survives N mornings"*: N is three, one Expedition (§3.4).

**Corrected after review.** Science and staging fixes, each checked against the sources cited where it now lives.
- *A 6–10 µm salt ribbon that faded "within about an hour", badged Established physics*: a strip that thin evens out in about 10 ms, and the tear's impact (Weber number about 80) and Marangoni flow stir the bead within seconds. It is now a broad **salt front**, 0.3–1 mm across, with the hero in its gradient, badged **Codon staging** (§3.1, §6.3 shot 5e, §7).
- *Walled rods thriving outside the shelter*: lactoferrin and lysozyme kill *E. coli* at low osmolarity, so in shot 6 they swell, pale and fade, as Ellison & Giehl's cells did. That sharpens *why am I alive?* at no extra cost.
- *Visible as a 0.1 mm colony*: 0.1 mm is a daylight resolving limit, so it now marks Act II's sheen. Act IV's Visible is a light budget on a brightness meter (§3.4, §4.4). Actually perceiving the glow keeps its **Codon invention** badge.
- *The bead's "turn upright" in shot 5*: seen from above, the leaf lies inside the bead's focal length and is always upright. The beat is cut, the bead shader samples the leaf plane for near-field content, and the inversion card is scoped to distant things (§6.3 shot 1, §7). The loupe now flips at d ≈ 36 mm, where its real image passes the eye, not at f (§6.3 shot 4).
- *The child as a "soft lilac shape" in shot 1's bokeh*: the card sits about 54° above the view axis, outside the frame. Only the drop shows the child, which is what the shot wanted. Shot 2's "darkness above" is now a shade term for the same reason.
- *The loupe's "hot spot of heat and UV" triggering SOS*: ordinary glass blocks over 90% of the light below 300 nm, and a prophage wakes on DNA damage through RecA, not on heat. The loupe's spot is now heat (the heat-shock response, gameplay's Heat stance), and the UV focus is the hair-held bead's own, since water passes UV. The chain to the Sleeper keeps its **Established** badge through the bead; any loupe → SOS link would be **Codon staging** (§3.2, §7).
- *Being taken in by the Stranger as "the real road"*: only the roles are history's, an archaeal host and an alphaproteobacterial guest. How the guest got in is the E3 model, a hypothesis, and the cultured archaeon, 0.55 µm across, has never been seen engulfing a cell. That door is now badged **Hypothesis · E3 model** and played as entanglement and wrapping over generations, not a swallow. The Stranger is drawn at its real size, and its line's growth to wrapping size is **Codon invention**. The new card names the real guest (§3.4, §4.1, §4.4, §7).
- *Small slips*: *Powers of Ten* lends the steady pace, not the 3 s number (it runs 10 s per decade out and 2 s back in). Shot 5(c)'s push now reaches its 0.25 mm in the 5 s it has. The intro's cell count is hero + husk + 6 rods + 1 coccus = 9. The bead's ringing decays on Lamb's viscous times (about 0.9 s and 0.33 s), not 40 ms. The eye's ATP synthase has eight teeth where the hero's has ten, and Stop's UGA card notes that *E. coli* itself reads UGA as selenocysteine in a few genes. Recode's first step removed three codons, two for serine and the amber stop (§3.4, §4.4, §5.2, §6.3, §7).

**Waiting for polish.** These were cut for v1, not for good.
- The full 150° crane over the child in silhouette.
- Instanced hairs.
- Raymarched refraction on the central bead.
- True refraction through the salt front.
- Compositing the Micro stage inside the bead before the crossing, a real portal in place of the flash swap.
- More Memories.
- The three "next summer" endings (Taken In, Rain, Last), and Phase 4, multicellularity.

---

## 9. As built (prototype)

The first launch (`src/intro.js`, `src/garden.js`, `src/intro-micro.js`) and The First Morning (`src/morning.js`) are built. Where the build departs from the text above, this is what it does and why. The text above is unchanged; read it with these notes.

**First launch (§5.1, shots 0 → 4 → 5 → 6 → 7 → 8)**
- Timing holds: the lens is in hand at 0:08, the dive starts by itself at 0:17 (sooner on click, W or a trigger), the crossing is at about 0:27 and the game has the cell at about 0:46. The last frame is the game's first: camera, hero, fog, palette, lens and passes all match a fresh start, plus the shed wall left behind in the water.
- No cube map: the beads refract an analytic dawn sky with the child as a dark silhouette. Dawn has no sun disc yet; the warm glow on the sun's azimuth is the key light.
- The glass sinks with the eye during the dive, so the swap from the lens view to the eye's view is invisible. The push ends 0.27 mm from the skin (a 0.2 mm frame), where the micro descent begins, and eases out at the push's own pace, so about one second, not two, is spent pressed against the skin.
- The stepping scale bar is drawn on the page, at its true length on the subject plane; in the glide it settles onto the game's own 1 µm bar.
- Shot 6: the salt front runs across the view, tear water on the right with the hero 4 µm inside its edge, the mixed water and the walled rods on the left. With the mixed side beyond the hero (as the text has it) the camera would sit inside the band and no gradient would show.
- The walled rods of shot 6 are ordinary E. coli; every rod in the game is now drawn walled, only the hero is soft.
- Captions are off by default (C or `?captions` turns them on); every non-speech sound has one. Holding Esc (or B) skips from anywhere, with one blink; reduced motion replaces moves with crossfaded holds.
- Keys pressed during the opening never reach the game. It plays once; with storage blocked it does not play (it could never remember having played).

**The First Morning (§5.1, shots 0 → 1 → 2 → 3, then the hub)**
- 33 s on its own clock, then the hub with the lens in hand, as the first launch at 0:08. Skipping lands in the hub.
- The child sits on the top step framed by a lit glass door, 74 mm below the bead, so the drop shows them dark on warm. The yard is restaged for that (the house 3 m away).
- Honest optics: the drop and the eye look the same way, so the background blur shows the child too, as a soft dark shape that the drop resolves sharp and upside down. §7's Established card ("the upside-down child in the drop is real optics") holds in that form. Placing the child "just above the frame" would put their image at the edge of the ball lens, tiny and squashed.
- The push starts at 42 mm (at 55 mm the camera would be outside the 40 mm leaf) and ends at 11 mm. Shot 2's shade is the child's body hiding the yard and the door, not a full-frame darkening, so the tear drops from the dark against the door.
- Run 2 and later dive from the hub with the 3 s replay dive (§5.3); shot 6's birth is not replayed.
- The tear's fall, the merge and the ringing use clean water's surface tension; a tear's is a little lower.

**Staging the build adds (to go on the "Where we cheated" page)**
- The shed wall: in E. coli the wall lies under the outer membrane, so a cell could not leave it behind and keep that membrane. The filmed escape is Bacillus subtilis, which has none. A real E. coli L-form loses its wall in place.
- The opening's time-lapse runs at ×8 on screen, but the events it shows (rods killed, an L-form born) take hours: about 1000× compressed.
- The caustic net overhead is ours; a still dew drop has no ripples, and its curved skin focuses the sun to one region.
- Oxygen falls with depth in the game's drop; a real dew drop stays oxic much deeper and runs short only where cells crowd.
- The "where we cheated" page itself is not built yet; the cards of §7 do not ship in this prototype.

