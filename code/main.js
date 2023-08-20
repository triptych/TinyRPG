import kaboom from "kaboom";
import { loadGameScene } from "./scenes/game.js";
import { loadSounds } from "./lib/sound.js";
import {
  baseStyles,
  SPEED,
  ENEMYSPEED
} from "./lib/constants.js";
import { loadSprites } from "./lib/sprites.js";
import { spin } from "./lib/helpers.js";

let swinging = false; // only hit enemies when swinging.


console.log("%cTinyRPG v0.03", baseStyles);

// main method
kaboom({
  scale: 4,
  background: [0, 0, 0, 1]
});



// settings

layers([
  "bg",
  "obj",
  "ui"
], "obj"); // obj is default layer



// Kaboom dependent constants 
const dirs = {
  "left": LEFT,
  "right": RIGHT,
  "up": UP,
  "down": DOWN,
};


// load sounds and music
loadSounds();

// play background music
const music = play("background", {
  volume: 0.5,
  loop: true
})


// load sprites
loadSprites();

// floor
addLevel([
  "xxxxxxxxxx",
  "          ",
  "          ",
  "          ",
  "          ",
  "          ",
  "          ",
  "          ",
  "          ",
  "          ",
], {
  width: 16,
  height: 16,
  " ": () => [
    sprite("floor", { frame: ~~rand(0, 8) }),
  ],
});

let map = loadGameScene();


// objects



const player = add([
  pos(map.getPos(2, 2)),
  sprite("hero", { anim: "idle" }),
  area({
    width: 12,
    height: 12,
    offset: vec2(0, 6)
  }),
  solid(),
  origin("center"),
]);

player.onUpdate(() => {
  camPos(player.pos);
});


const ogre = add([
  sprite("ogre", {
    anim: "idle"
  }),
  pos(map.getPos(4, 4)),
  origin("bot"),
  area({ scale: 0.5 }),
  solid(),
  "enemy"
])


const sword = add([
  pos(),
  sprite("sword"),
  origin("bot"),
  rotate(0),
  follow(player, vec2(-4, 9)),
  spin(swinging),
  area()
]);




sword.onCollide("enemy", (enemy) => {
  console.log("collision with enemy ")
  // TODO: this doesn't work yet because AREA doesn't rotate with object
  if (swinging) {
    destroy(enemy)
  }

})


// events

onKeyPress("space", () => {
  let interacted = false
  every("chest", (c) => {
    if (player.isTouching(c)) {
      if (c.opened) {
        c.play("close")
        c.opened = false
      } else {
        c.play("open")
        play("open");
        c.opened = true
      }
      interacted = true
    }
  })
  if (!interacted) {
    sword.spin()
  }
});



onKeyDown("right", () => {
  player.flipX(false)
  sword.flipX(false)
  player.move(SPEED, 0)
  sword.follow.offset = vec2(-4, 9)
})

onKeyDown("left", () => {
  player.flipX(true)
  sword.flipX(true)
  player.move(-SPEED, 0)
  sword.follow.offset = vec2(4, 9)
})

onKeyDown("up", () => {
  player.move(0, -SPEED)
})

onKeyDown("down", () => {
  player.move(0, SPEED)
})

stepping = false;
let sound_step = null;
onKeyPress(["left", "right", "up", "down"], () => {
  player.play("run")
  if (!stepping) {
    if (sound_step) {
      sound_step.pause()
    }
    sound_step = play("step", {
      loop: true,
      speed: .25
    })
  }

});

onKeyPress("m", () => {
  if (music) {
    if (music.isPaused()) {
      music.play()
    } else {
      music.pause()
    }

  }
})

onKeyRelease(["left", "right", "up", "down"], () => {
  if (
    !isKeyDown("left")
    && !isKeyDown("right")
    && !isKeyDown("up")
    && !isKeyDown("down")
  ) {
    player.play("idle");
    sound_step.pause()
  }
})

xDirection = 10;
yDirection = 10;

onUpdate('enemy', (enemy) => {
  enemy.move(xDirection, yDirection)
})


onUpdate(() => {
  avg = rand(0, 100);
  avg2 = rand(0, 100);
  if (avg > 98) {
    xDirection = -xDirection;
  }
  if (avg2 > 98) {
    yDirection = -yDirection;
  }

})



// add life meter
const scorebox = add([
  rect(100, 11),
  pos(1, 1),
  layer("ui"),
  color(0, 0, 0),
  fixed()
])

const score = add([
  text("Life: ****"),
  pos(2, 2),
  layer("ui"),
  color(255, 0, 255),
  scale(.125),
  fixed(),
  {
    label: "Life:",
    value: "****",
  },
]);

