import k from "./kaplayCtx";
import combatScene from "./scenes/combatScene";

k.onLoad(() => {
  k.scene("combat-scene", combatScene);

  k.go("combat-scene");
});