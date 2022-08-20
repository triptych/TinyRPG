import kaboom from "kaboom"
import { loadGameScene } from "./scenes/game.js"

let baseStyles = [
  "color: red",
  "background-color: #444",
  "padding: 2px 4px",
  "border-radius: 4px",
  "border: 1px solid white",
  "font-size: 3em",
  "box-shadow: 4px 4px 4px tan"
].join(";");

console.log("%cTinyRPG v0.03", baseStyles);




kaboom({
  scale: 4,
  background: [0, 0, 0, 1]
});




// constants
const SPEED = 120;
const ENEMYSPEED = 0;

// settings

layers([
  "bg",
  "obj",
  "ui"
], "obj");

const dirs = {
  "left": LEFT,
  "right": RIGHT,
  "up": UP,
  "down": DOWN,
};

// load sprites
loadSpriteAtlas("sprites/dungeon.png", {
  "hero": {
    x: 128,
    y: 68,
    width: 144,
    height: 28,
    sliceX: 9,
    anims: {
      idle: {
        from: 0,
        to: 3,
        speed: 3,
        loop: true
      },
      run: {
        from: 4,
        to: 7,
        speed: 10,
        loop: true
      },
      hit: 8,
    },
  },
  "ogre": {
    "x": 16,
    "y": 320,
    "width": 256,
    "height": 32,
    "sliceX": 8,
    "anims": {
      "idle": {
        "from": 0,
        "to": 3,
        "speed": 3.5,
        "loop": true
      },
      "run": {
        "from": 4,
        "to": 7,
        "speed": 10,
        "loop": true
      }
    }
  },
  "sword": {
    "x": 322,
    "y": 81,
    "width": 12,
    "height": 30
  },
  "floor": {
    "x": 16,
    "y": 64,
    "width": 48,
    "height": 48,
    "sliceX": 3,
    "sliceY": 3
  },
  "wall": {
    "x": 16,
    "y": 16,
    "width": 16,
    "height": 16
  },
  "wall_top": {
    "x": 16,
    "y": 0,
    "width": 16,
    "height": 16
  },
  "wall_left": {
    "x": 16,
    "y": 128,
    "width": 16,
    "height": 16
  },
  "wall_right": {
    "x": 0,
    "y": 128,
    "width": 16,
    "height": 16
  },
  "wall_topleft": {
    "x": 32,
    "y": 128,
    "width": 16,
    "height": 16
  },
  "wall_topright": {
    "x": 48,
    "y": 128,
    "width": 16,
    "height": 16
  },
  "wall_botleft": {
    "x": 32,
    "y": 144,
    "width": 16,
    "height": 16
  },
  "wall_botright": {
    "x": 48,
    "y": 144,
    "width": 16,
    "height": 16
  },
  "chest": {
    "x": 304,
    "y": 304,
    "width": 48,
    "height": 16,
    "sliceX": 3,
    "anims": {
      "open": {
        "from": 0,
        "to": 2,
        "speed": 20,
        "loop": false
      },
      "close": {
        "from": 2,
        "to": 0,
        "speed": 20,
        "loop": false
      }
    }
  },
})

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
  area({ width: 12, height: 12, offset: vec2(0, 6) }),
  solid(),
  origin("center"),
]);

// player.onUpdate(() => {
//   camPos(player.pos)
// });

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
  spin(),
])


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

onKeyPress(["left", "right", "up", "down"], () => {
  player.play("run")
});

onKeyRelease(["left", "right", "up", "down"], () => {
  if (
    !isKeyDown("left")
    && !isKeyDown("right")
    && !isKeyDown("up")
    && !isKeyDown("down")
  ) {
    player.play("idle")
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



// methods
function spin() {
  let spinning = false
  return {
    id: "spin",
    update() {
      if (spinning) {
        this.angle += 1200 * dt()
        if (this.angle >= 360) {
          this.angle = 0
          spinning = false
        }
      }
    },
    spin() {
      spinning = true
    },
  }
}


// life meter

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




// const player = add([
//   sprite("hero"),
// ])

/**
// initialize context
kaboom()

// load assets
loadSprite("bean", "sprites/bean.png")

// add a character to screen
add([
  // list of components
  sprite("bean"),
  pos(80, 40),
  area(),
])

// add a kaboom on mouse click
onClick(() => {
  addKaboom(mousePos())
})

// burp on "b"
onKeyPress("b", burp)

**/