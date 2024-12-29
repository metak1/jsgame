import characters from "../json/characters.json" assert { type: "json" };
import Spell from "../classes/Spell.js";

export default class Character {

    constructor(name, level, equipments) {
        const char = characters.find(char => char.name == name);
        this.level = level;
        this.type = char.type;
        this.baseHealth = char.baseHealth;
        this.baseAttack = char.baseAttack;
        this.baseArmor = char.baseArmor;
        this.baseSpeed = char.baseSpeed;
        this.equipments = equipments;
        this.spells = [];

        for (let spell in char.spells) {
            this.spells.push(new Spell(char.spells[spell]));
        }
    }

    health() {
        return this.baseHealth + 0;
    }

    attack() {
        return this.baseAttack + 0;
    }

    armor() {
        return this.baseArmor + 0;
    }

    speed() {
        return this.baseSpeed + 0;
    }

    spells() {
        return this.spells();
    }


    cast(spellId) {
        this.spells[spellId].remainingCooldown = this.spells[spellId].cooldown;
        return this.spells[spellId].basePower + this.attack();
    }

    typeColorRGB() {
        switch (this.type) {
            case "fire":
                return [255, 0, 0];
            case "nature":
                return [0, 255, 0];
            case "water":
                return [0, 0, 255];
        }
    }

}