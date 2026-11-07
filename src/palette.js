// Colours. Light theme: a sunlit drop, pale and airy, the cell a clear jelly with saturated living
// colour inside it. Biology has its own hues; interface uses Holarky's (paper, plum, mint).
// No outlines anywhere: forms are told apart by colour, translucency and light.

// The cell's structures. Each major structure has its own clear hue so it reads at a glance
// against a pale background.
export const ORGANELLE = {
  jelly: 0xe9fbf6, // outer envelope: almost clear sea-glass
  jellyDepth: 0x8fd8c8, // colour light takes on as it passes through the jelly
  jellyGlow: 0xffb89a, // warm light held inside the cell
  innerMembrane: 0x5cc9b5,
  cytosol: 0x6f9be8, // the few free proteins left as faint motes
  dna: 0xf0a51e,
  plasmid: 0xf2668b,
  ribosome: 0x9a6cf5,
  mrna: 0xb48cff,
  glycogen: 0xf5d77a,
  polyphosphate: 0x6a3fd0,
  receptor: 0x22b8d6,
  complexI: 0xf0644f, // NADH dehydrogenase I
  sdh: 0xf59a2c, // succinate dehydrogenase (complex II)
  bo3: 0xd9325f, // cytochrome bo3 oxidase
  atpSynthase: 0xe8b22a,
  atpRotor: 0x1fb595,
  pts: 0xe6c341, // glucose transporter (PTS)
  motor: 0x1fb595,
  flagellum: 0xa9d6c4,
  vesicle: 0xf59ac4,
};

// Metabolites and ions: the beads that travel the energy route. Saturated mid-tones read on a
// pale background; their cores are drawn brighter than their edges.
export const METABOLITE = {
  glucose: 0xf2c230,
  g6p: 0xf0a92a,
  triose: 0xf08c2a,
  pyruvate: 0xee6f24,
  acetylCoA: 0xe2452f,
  tca: 0xd8327a,
  nadh: 0x2f7cf0,
  qh2: 0x7a52f0,
  proton: 0x14b8d8,
  atp: 0xf5b800,
  oxygen: 0x5aa8f0,
  co2: 0x8a9aab,
  water: 0x9fd8ff,
  aminoAcid: 0x2fbf5a,
  ferment: 0x9aa63a,
  protein: 0xec7fb0, // food: protein clump
  glycogenFood: 0xf5d77a, // food: glycogen fragment
};

export const BRAND = {
  plum: 0x5e3a8c,
  mint: 0x2a9d84,
  paper: 0xf2efe9,
  mintOnPlum: 0x86dcc6,
  ink: 0x2b2340, // body text on light backgrounds
};

// The drop: pearly light from the surface above, a soft aqua body, a gentle teal deep below.
export const WATER = {
  surface: 0xfffaf0, // the bright meniscus overhead
  light: 0xe4f4f1,
  mid: 0xbfe3e3,
  deep: 0x7fb7c4,
  haze: 0xe9e2f4, // faint lilac haze in the distance
  sun: 0xfff3dc,
  fog: 0xd8eeec,
  dust: 0x6f8f98, // fine particles read slightly darker than the water
  glint: 0xffffff, // sparkles catch the light
  shaft: 0xffffff,
};
