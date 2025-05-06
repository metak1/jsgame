import k from "../kaplayCtx";

export default class Effect {

    constructor(effectsBox, primaryType, secondaryType, power, duration) {
        this.primaryType = primaryType;
        this.secondaryType = secondaryType;
        this.power = power;
        this.duration = duration;
        this.leftDuration = duration;

        this.gameObject = effectsBox.add([
            k.area(),
            k.rect(32,32),
            k.pos(0,0),
            k.color(255,0,0)
        ])

        this.durationText = this.gameObject.add([
            k.text("3", { size: 24 }),
            k.pos(14,9)
        ])
    }

    x() {
        return this.gameObject.pos.x;
    }

    y() {
        return this.gameObject.pos.y;
    }
}