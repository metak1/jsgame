class SpellHandler {
    static TYPES = {
        attack: "attack",
        poison: "poison",
        heal: "heal",
        buff: "buff",
        debuff: "debuff",
        cleanse: "cleanse"
    };

    static HEAL_TYPES = {
        instant: "instant",
        duration: "duration"
    };

    static BUFF_TYPES = {
        attack: "attack",
        armor: "armor",
        speed: "speed",
        invulnerable: "invulnerable"
    };

    static DEBUFF_TYPES = {
        attack: "attack",
        armor: "armor",
        speed: "speed",
        enhancements: "enhancements"
    };

    static AFFECT = {
        mono: "mono",
        area: "area",
        self: "self"
    };

    activateSpell(spell, source, target, allCharacters) {
        switch (spell.primaryType) {
            case SpellHandler.TYPES.attack:
                this.hit(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.poison:
                this.poison(spell, source, target, allCharacters);
                break;
            case SpellHandler.TYPES.heal:
                if (spell.secondaryType === SpellHandler.HEAL_TYPES.duration) {
                    this.buff(spell, source, target, allCharacters);
                } else {
                    this.heal(spell, source, target, allCharacters);
                }
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

        return allCharacters.filter(a => !a.isDead());
    }

    hit(spell, source, target, allCharacters) {
        if (spell.affect === SpellHandler.AFFECT.mono) {
            const targetIndex = allCharacters.findIndex(
                e => e.teamNumber === target.teamNumber && e.position === target.position
            );
            allCharacters[targetIndex].hit(spell.basePower + source.attack() - target.armor());
        } else if (spell.affect === SpellHandler.AFFECT.area) {
            allCharacters.forEach(a => {
                if (source.teamNumber !== a.teamNumber) {
                    a.hit(spell.basePower + source.attack() - a.armor());
                }
            });
        }
    }

    heal(spell, source, target, allCharacters) {
        if (spell.affect === SpellHandler.AFFECT.mono) {
            const targetIndex = allCharacters.findIndex(
                e => e.teamNumber === target.teamNumber && e.position === target.position
            );
            allCharacters[targetIndex].heal(spell.basePower + source.attack() - target.armor());
        } else if (spell.affect === SpellHandler.AFFECT.area) {
            allCharacters.forEach(a => {
                if (source.teamNumber === a.teamNumber) {
                    a.heal(spell.basePower + source.healBonusStat(spell.healBonusStat));
                }
            });
        } else if (spell.affect === SpellHandler.AFFECT.self) {
            const sourceIndex = allCharacters.findIndex(
                e => e.teamNumber === source.teamNumber && e.position === source.position
            );
            allCharacters[sourceIndex].heal(spell.basePower + source.healBonusStat(spell.healBonusStat));
        }
    }

    poison(spell, source, target, allCharacters) {
        this.applyEffect(spell, source, target, allCharacters);
    }

    buff(spell, source, target, allCharacters) {
        this.applyEffect(spell, source, target, allCharacters);
    }

    debuff(spell, source, target, allCharacters) {
        this.applyEffect(spell, source, target, allCharacters);
    }

    cleanse(spell, source, target, allCharacters) {
        // Implement cleanse logic here if needed
    }

    applyEffect(spell, source, target, allCharacters) {
        if (spell.affect === SpellHandler.AFFECT.mono) {
            const targetIndex = allCharacters.findIndex(
                e => e.teamNumber === target.teamNumber && e.position === target.position
            );
            allCharacters[targetIndex].affect(spell.primaryType, spell.secondaryType, spell.basePower + source.attack());
        } else if (spell.affect === SpellHandler.AFFECT.area) {
            allCharacters.forEach(a => {
                if (source.teamNumber === a.teamNumber) {
                    a.affect(spell.primaryType, spell.secondaryType, spell.basePower + source.attack());
                }
            });
        } else if (spell.affect === SpellHandler.AFFECT.self) {
            const sourceIndex = allCharacters.findIndex(
                e => e.teamNumber === source.teamNumber && e.position === source.position
            );
            allCharacters[sourceIndex].affect(spell.primaryType, spell.secondaryType, spell.basePower);
        }
    }
}

export default SpellHandler;
