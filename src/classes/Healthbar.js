
import k from "../kaplayCtx";

export default class Healthbar {
    constructor(characterSlot) {

        const fontSize = 24;
        const characterElemColors = characterSlot.character.typeColorRGB();

        this.characterSlot = characterSlot;
        this.healthBarBackground = k.add([k.area(), k.sprite("healthbar-bg"), k.pos(characterSlot.x() - 70, characterSlot.y() - 50)]);
        this.healthbar = k.add([k.rect(210, 41), k.color(0, 255, 0), k.pos(this.healthBarBackground.pos.x + 43, this.healthBarBackground.pos.y + 2)]);
        this.element = k.add([k.rect(38, 41), k.color(characterElemColors[0], characterElemColors[1], characterElemColors[2]), k.pos(this.healthBarBackground.pos.x + 2, this.healthBarBackground.pos.y + 2)]);
        this.level = k.add([k.text(characterSlot.level, { size: fontSize }), k.pos(this.healthBarBackground.pos.x + this.getLevelPadding(), this.healthBarBackground.pos.y + 12)]);
    }

    damage(damage) {
        this.characterSlot.remainingHp = this.characterSlot.remainingHp - (damage - this.characterSlot.armor());
        this.healthbar.width = (this.characterSlot.remainingHp * 210) / this.characterSlot.health();
    }

    destroy() {
        k.destroy(this.healthBarBackground);
        k.destroy(this.healthbar);
        k.destroy(this.element);
        k.destroy(this.level);
    }

    getLevelPadding() {
        return this.characterSlot.level > 9 ? 7 : 15
    }
}