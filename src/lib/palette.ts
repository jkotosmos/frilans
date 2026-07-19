import { hashSeed } from "./utils";

/** Duotone pairs drawn from the brand palette, used for generated
 * avatars/covers so the whole site feels illustrated rather than stocky. */
export const DUOTONES = [
  { from: "#DD7233", to: "#A33F24", tint: "#FADFD2" }, // rust
  { from: "#3B6B51", to: "#254432", tint: "#D2E0D6" }, // pine
  { from: "#C68A2E", to: "#A66F20", tint: "#F3EBDC" }, // gold
  { from: "#5F594E", to: "#332E27", tint: "#E4E0D9" }, // ink
  { from: "#7DA98B", to: "#2F5641", tint: "#EEF3EF" }, // sage
  { from: "#E8935F", to: "#82331E", tint: "#FDF1EC" }, // terracotta
] as const;

export function duotoneFor(seed: string) {
  const idx = hashSeed(seed) % DUOTONES.length;
  return DUOTONES[idx]!;
}

/** A handful of hand-picked soft blob outlines (viewBox 0 0 200 200),
 * chosen instead of photography so covers read as one designed system. */
export const BLOB_PATHS = [
  "M45,-58C58,-49,67,-33,71,-15C75,3,73,23,62,38C51,53,32,63,11,67C-10,71,-31,68,-47,56C-63,44,-74,23,-75,1C-76,-21,-67,-42,-52,-55C-37,-68,-18,-73,1,-74C21,-75,32,-67,45,-58Z",
  "M39,-49C51,-40,60,-25,64,-8C68,9,67,29,57,43C47,57,29,65,10,68C-9,71,-29,68,-44,57C-59,46,-70,27,-71,8C-73,-11,-64,-32,-50,-46C-35,-59,-17,-66,0,-66C17,-65,27,-59,39,-49Z",
  "M32,-42C40,-33,44,-21,49,-8C53,5,56,19,50,30C44,42,29,50,13,55C-3,60,-21,61,-35,53C-49,45,-59,29,-62,12C-65,-6,-61,-25,-49,-38C-38,-51,-19,-58,-1,-57C17,-57,25,-51,32,-42Z",
];

export function blobFor(seed: string) {
  const idx = hashSeed(seed + "blob") % BLOB_PATHS.length;
  return BLOB_PATHS[idx]!;
}
