export default class Spell {
    constructor(spell) {
        let [primaryType, secondaryType] = spell.type.split(":");
        this.name = spell.name;
        this.basePower = spell.basePower;
        this.cooldown = spell.cooldown;
        this.primaryType = primaryType;
        this.secondaryType = secondaryType;
        this.affect = spell.affect;
    }
}