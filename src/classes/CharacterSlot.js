import ennemiesPos from "../json/system/ennemies-pos.json";
import alliesPos from "../json/system/allies-pos.json";
import Healthbar from "./Healthbar";
import Effect from "./Effect";
import k from "../kaplayCtx";
import spells from "../json/spells.json";

export default class CharacterSlot {
    constructor(character, level, equipments, position, teamNumber) {
        this.slotWidth = 125;
        this.slotHeight = 250;

        this.character = character;
        this.level = level;
        this.equipments = equipments;
        this.position = position;
        this.teamNumber = teamNumber;
        this.remainingHp = this.health();
        this.speedSum = 0;
        this.spellCooldowns = [0, 0, 0];
        this.effects = [];
        this.playedOnce = false;

        this.healthbar = this.createHealthBar();
        this.effectsBox = this.createEffectsBox();
        this.gameObject = this.createGameObject();

        k.loadSprite("char-icon", `assets/${this.character.icon}`);
        this.turnGameObject = k.add([
            k.sprite("char-icon"),
            k.scale(0.3),
            k.pos(30, this.calculateTimelineY())
        ]);
        this.turnTeamCircle = k.add([
            k.pos(52, this.calculateTimelineY() + 22),
            k.circle(23, { fill: false }),
            k.outline(4, teamNumber === 1 ? k.RED : k.BLUE)
        ]);
    }

    health() {
        return this.character.baseHealth;
    }

    attack() {
        return this.character.baseAttack;
    }

    armor() {
        return this.character.baseArmor;
    }

    speed() {
        return this.character.baseSpeed;
    }

    spells() {
        return this.character.spells;
    }

    healBonusStat(healStat) {
        switch (healStat) {
            case "attack": return this.attack();
            case "health": return this.health();
            case "armor": return this.armor();
            default: return 0;
        }
    }

    hit(power) {
        this.remainingHp = Math.max(this.remainingHp - power, 0);
        this.healthbar.setBarWidth(this.remainingHp, this.health());
        if (this.isDead()) this.kill();
    }

    heal(power) {
        this.remainingHp = Math.min(this.remainingHp + power, this.health());
        this.healthbar.setBarWidth(this.remainingHp, this.health());
    }

    affect(primaryType, secondaryType, power, duration) {
        console.log("affecting " + this.character.name, primaryType, secondaryType, power, duration);
        this.createEffect(primaryType, secondaryType, power, duration)
    }

    setSpellOnCD(spellSlot) {
        this.spellCooldowns[spellSlot] = this.spells()[spellSlot].cooldown;
    }

    isSpellOnCD(spellSlot) {
        return this.spellCooldowns[spellSlot] > 0;
    }

    x() {
        return this.teamNumber === 1
            ? alliesPos[this.position].x
            : ennemiesPos[this.position].x;
    }

    y() {
        return this.teamNumber === 1
            ? alliesPos[this.position].y
            : ennemiesPos[this.position].y;
    }

    isDead() {
        return this.remainingHp <= 0;
    }

    kill() {
        this.healthbar.destroy();
        this.gameObject.destroy();
        this.turnGameObject.destroy();
        this.turnTeamCircle.destroy();
    }

    createGameObject() {
        const tag = this.teamNumber === 1
            ? `ally-${this.position}`
            : `ennemy-${this.position}`;
        const gameObject = k.add([
            k.area(),
            k.rect(this.slotWidth, this.slotHeight),
            k.pos(this.x(), this.y())
        ]);
        gameObject.tag(tag);
        gameObject.tag("character-slot");
        return gameObject;
    }

    createHealthBar() {
        return new Healthbar(this);
    }

    createEffect(primaryType, secondaryType, power, duration) {
        this.effects = [...this.effects, new Effect(this.effectsBox, primaryType, secondaryType, power, duration)];
    }

    createEffectsBox() {
        console.log(this.healthbar.x(), this.healthbar.y())
        const effectsBox = k.add([
            k.area(),
            k.rect(this.healthbar.width(), 32),
            k.pos(this.healthbar.x(), this.healthbar.y() - 37)
        ]);

        return effectsBox;
    }

    calculateTimelineY() {
        return (720 * this.speedSum) / 1000 + 140;
    }

    setTimelineIconPos() {
        const y = this.calculateTimelineY();
        this.setTlIconPos(y);
    }

    setTlIconPos(y) {
        this.turnGameObject.pos = k.vec2(30, y);
        this.turnTeamCircle.pos = k.vec2(52, y + 22);
    }
}
