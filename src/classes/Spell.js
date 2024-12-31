export default class Spell {
    constructor(spell) {
        this.name = spell.name;
        this.basePower = spell.basePower;
        this.baseCooldown = spell.basePower;
        this.type = spell.type;
        this.remainingCooldown = 0;
    }
}