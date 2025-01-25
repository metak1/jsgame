import characters from "../json/characters.json" assert { type: "json" };
import spells from "../json/spells.json" assert { type: "json" };
import Spell from "../classes/Spell.js";

export default class Character {

    constructor(id) {
        const char = characters.find(char => char.id == id);
        this.id = id
        this.name = char.name;
        this.type = char.type;
        this.baseHealth = char.baseHealth;
        this.baseAttack = char.baseAttack;
        this.baseArmor = char.baseArmor;
        this.baseSpeed = char.baseSpeed;
        this.icon = char.icon;
        this.spells = [];
        this.effects = [];


        for (let i in char.spells) {
            let spell = spells.find(s => s.id == char.spells[i]);
            this.spells.push(new Spell(spell));
        }
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