import ennemiesPos from "../json/system/ennemies-pos.json";
import alliesPos from "../json/system/allies-pos.json";
import Healthbar from "./Healthbar";
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
        this.healthbar = this.createHealthBar(this);
        this.gameObject = this.createGameObject(this, this.teamNumber);

        this.spellCooldowns = [0, 0, 0];

        k.loadSprite("char-icon", "assets/" + this.character.icon);
        this.turnGameObject = k.add([k.sprite("char-icon"), k.scale(0.3), k.pos(30, ((720 * this.speedSum) / 1000) + 140)]);
        this.turnTeamCircle = k.add([k.pos(52, ((720 * this.speedSum) / 1000) + 162), k.circle(23, { fill: false }), k.outline(4, teamNumber == 1 ? k.RED : k.BLUE)]);

        this.playedOnce = false;
    }

    health() {
        return this.character.baseHealth + 0;
    }

    attack() {
        return this.character.baseAttack + 0;
    }

    armor() {
        return this.character.baseArmor + 0;
    }

    speed() {
        return this.character.baseSpeed + 0;
    }

    spells() {
        return this.character.spells;
    }

    healBonusStat(healStat) {
        switch (healStat) {
            case "attack":
                return this.attack();
            case "health":
                return this.health();
            case "armor":
                return this.armor();
        }
    }

    hit(power) {
        this.remainingHp -= power;
        this.healthbar.setBarWidth(this.remainingHp, this.health());

        if (this.isDead()) this.kill();
    }

    heal(power) {
        if (this.remainingHp + power <= this.health()) this.remainingHp += power;
        else this.remainingHp = this.health();

        this.healthbar.setBarWidth(this.remainingHp, this.health());
    }

    setSpellOnCD(spellSlot) {
        this.spellCooldowns[spellSlot] = this.spells()[spellSlot].cooldown;
    }

    isSpellOnCD(spellSlot) {
        return this.spellCooldowns[spellSlot] > 0;
    }

    x() {
        switch (this.teamNumber) {
            case 1:
                return alliesPos[this.position].x;
            case 2:
                return ennemiesPos[this.position].x;
            default:
                break;
        }
    }

    y() {
        switch (this.teamNumber) {
            case 1:
                return alliesPos[this.position].y;
            case 2:
                return ennemiesPos[this.position].y;
            default:
                break;
        }
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
        let tag = this.teamNumber == 1 ? "ally-" + this.position : "ennemy-" + this.position;
        let gameObject = k.add([k.area(), k.rect(this.slotWidth, this.slotHeight), k.pos(this.x(), this.y())]);
        gameObject.tag(tag);
        gameObject.tag("character-slot");
        return gameObject;
    }

    createHealthBar() {
        return new Healthbar(this);
    }

    setTimelineIconPos() {
        let y = ((720 * this.speedSum) / 1000) + 140
        this.setTlIconPos(y);
    }

    setTlIconPos(y) {
        this.turnGameObject.pos = k.vec2(30, y);
        this.turnTeamCircle.pos = k.vec2(52, y + 22);
    }
}