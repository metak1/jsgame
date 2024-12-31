export default class Spell {
    constructor(spell) {
        this.name = spell.name;
        this.basePower = spell.basePower;
        this.cooldown = spell.cooldown;
        this.type = spell.type;
        this.affect = spell.affect;
    }
}