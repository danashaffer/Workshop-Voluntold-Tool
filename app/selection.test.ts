import assert from "node:assert/strict";
import test from "node:test";
import { selectRandomIndex } from "./selection";

test("wheel selection is deterministic with an injected random source", () => {
  assert.equal(selectRandomIndex(10, () => 0), 0);
  assert.equal(selectRandomIndex(10, () => 0.42), 4);
  assert.equal(selectRandomIndex(10, () => 0.999999), 9);
});
