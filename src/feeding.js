// Placeholder until the feeding and endocytosis module lands.
export class Feeding {
  constructor(scene, hero, metabolism, camera) {
    this.state = { glucose: 0.5, oxygen: 1, engulfing: false, prompt: '', promptAnchor: null };
    this.anchors = [];
  }
  update() {}
}
