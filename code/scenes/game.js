/** imports here **/

export const loadGameScene = () => {
  console.log("loadGameScene called!");

  const map = addLevel([
    "tttttttttt",
    "cwwwwwwwwd",
    "l        r",
    "l        r",
    "l        r",
    "l      $ r",
    "l        r",
    "l $      r",
    "attttttttb",
    "wwwwwwwwww",
  ], {
    width: 16,
    height: 16,
    "$": () => [
      sprite("chest"),
      area(),
      solid(),
      { opened: false, },
      "chest",
    ],
    "a": () => [
      sprite("wall_botleft"),
      area({ width: 4 }),
      solid(),
      "wall"
    ],
    "b": () => [
      sprite("wall_botright"),
      area({ width: 4, offset: vec2(12, 0) }),
      solid(),
      "wall"
    ],
    "c": () => [
      sprite("wall_topleft"),
      area(),
      solid(),
      "wall"
    ],
    "d": () => [
      sprite("wall_topright"),
      area(),
      solid(),
      "wall"
    ],
    "w": () => [
      sprite("wall"),
      area(),
      solid(),
      "wall"
    ],
    "t": () => [
      sprite("wall_top"),
      area({ height: 4, offset: vec2(0, 12) }),
      solid(),
      "wall"
    ],
    "l": () => [
      sprite("wall_left"),
      area({ width: 4, }),
      solid(),
      "wall"
    ],
    "r": () => [
      sprite("wall_right"),
      area({ width: 4, offset: vec2(12, 0) }),
      solid(),
      "wall"
    ],
  })


  return map;
}

