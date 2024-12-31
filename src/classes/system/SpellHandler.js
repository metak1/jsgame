class SpellHandler {

    // TYPES and AFFECT are not really relevant in code but are used to let developpers 
    // know what kind of spells they can create

    static TYPES = {
        attack: "attack",
        poison: "poison",
        heal: "heal",
        buff: {
            attack: "buff:attack",
            armor: "buff:armor",
            speed: "buff:speed",
            invulnerable: "buff:invulnerable"
        },
        debuff: {
            attack: "debuff:attack",
            armor: "debuff:armor",
            speed: "debuff:speed",
            enhancements: "debuff:enhancements"
        },
        cleanse: "cleanse"
    };

    static AFFECT = {
        mono: "mono",
        area: "area",
        self: "self"
    }

    activateSpell(spell, source, target, allCharacters) {
        let primaryType = spell.type.split(":")[0];
        switch (primaryType) {
            case SpellHandler.TYPES.attack:
                this.hit(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.poison:
                this.poison(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.heal:
                this.heal(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.buff:
                this.buff(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.debuff:
                this.debuff(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.cleanse:
                this.cleanse(spell, source, target, allCharacters);
                break;
        }

        allCharacters = allCharacters.filter(a => !a.isDead());
        return allCharacters;
    }

    hit(spell, source, target, allCharacters) {
        switch (spell.affect) {
            case SpellHandler.AFFECT.mono:
                let indexOfTarget = allCharacters.findIndex(e => e.teamNumber == target.teamNumber && e.position == target.position);
                allCharacters[indexOfTarget].hit(spell.basePower + source.attack() - target.armor());
                break;
            case SpellHandler.AFFECT.area:
                allCharacters.forEach(a => {
                    if (source.teamNumber != a.teamNumber)
                        a.hit(spell.basePower + source.attack() - a.armor())
                });
                break;
        }
    }

    heal(spell, source, target, allCharacters) {
        let indexOfTarget = null;
        switch (spell.affect) {
            case SpellHandler.AFFECT.mono:
                indexOfTarget = allCharacters.findIndex(e => e.teamNumber == target.teamNumber && e.position == target.position);
                allCharacters[indexOfTarget].heal(spell.basePower + source.attack() - target.armor());
                break;
            case SpellHandler.AFFECT.area:
                allCharacters.forEach(a => {
                    if (source.teamNumber == a.teamNumber)
                        a.heal(spell.basePower + source.healBonusStat(spell.healBonusStat));
                });
                break;
            case SpellHandler.AFFECT.self:
                indexOfTarget = allCharacters.findIndex(e => e.teamNumber == source.teamNumber && e.position == source.position);
                allCharacters[indexOfTarget].heal(spell.basePower + source.healBonusStat(spell.healBonusStat));
                break;
        }
    }

    poison(spell, source, target, allCharacters) {
        console.log(spell.type, spell.name, source, target, allCharacters);
    }

    buff(spell, source, target, allCharacters) {
        console.log(spell.type, spell.name, source, target, allCharacters);
    }

    debuff(spell, source, target, allCharacters) {
        console.log(spell.type, spell.name, source, target, allCharacters);
    }

    cleanse(spell, source, target, allCharacters) {
        console.log(spell.type, spell.name, source, target, allCharacters);
    }
}

export default SpellHandler; // Exporting the method