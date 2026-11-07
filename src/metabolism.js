// Placeholder until the energy route module lands: holds the state shape main.js and the HUD read.
export class Metabolism {
  constructor(hero) {
    this.hero = hero;
    this.state = { atp: 0.8, atpCount: 0, nadh: 0, protons: 0, pmf: -170, pmfFraction: 0.8, motorPower: 1, mode: 'aerobic', totals: {}, rates: {} };
    this.anchors = [];
    this.legend = [];
  }
  uptakeGlucose() { return false; }
  deliver() {}
  update() {}
}
