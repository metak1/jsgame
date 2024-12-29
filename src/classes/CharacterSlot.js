import ennemiesPos from "../json/system/ennemies-pos.json";
import alliesPos from "../json/system/allies-pos.json";
import Healthbar from "./Healthbar";
import k from "../kaplayCtx";

export default class CharacterSlot {

    constructor(character, position, teamNumber) {
        this.slotWidth = 125;
        this.slotHeight = 250;

        this.character = character;
        this.position = position;
        this.teamNumber = teamNumber;
        this.remainingHp = this.character.health();
        this.speedSum = this.character.speed();
        this.healthbar = this.createHealthBar(this);
        this.gameObject = this.createGameObject(this, this.teamNumber);

        k.loadSprite("char-icon", "assets/" + this.character.icon);
        this.turnGameObject = k.add([k.sprite("char-icon"), k.scale(0.3), k.pos(30, ((720 * this.speedSum) / 1000) + 140)]);
        this.turnTeamCircle = k.add([k.pos(52, ((720 * this.speedSum) / 1000) + 162), k.circle(23, { fill: false }), k.outline(4, teamNumber == 1 ? k.RED : k.BLUE)]);

        this.playedOnce = false;
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

    setCharacterActionIconPos(height) {
        this.turnGameObject.pos = k.vec2(30, height);
        this.turnTeamCircle.pos = k.vec2(52, height + 22);
    }
}