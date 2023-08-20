export const spin = (swinging) => {
  let spinning = false
  swinging = false;
  return {
    id: "spin",
    update() {
      if (spinning) {
        this.angle += 1200 * dt()
        if (this.angle >= 360) {
          this.angle = 0
          spinning = false;
          swinging = false;
        }
      }
    },
    spin() {
      spinning = true;
      swinging = true;
      play("swoosh");
    },
  }
}