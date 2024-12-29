import k from "../kaplayCtx";
import Character from "../classes/Character";
import missions from "../json/missions.json";
import CharacterSlot from "../classes/CharacterSlot";
import Position from "../classes/Position";
import Healthbar from "../classes/Healthbar";

export default function combatScene() {

    k.loadSprite("combat-bg", "assets/background.png");
    k.loadSprite("spell-slot", "assets/spell-slot.png");
    k.loadSprite("healthbar-bg", "assets/healthbar-background.png");
    loadMission("1-1");
}

function loadMission(stage) {
    let hasToFocus = false;
    let spellId = null;
    const mission = missions.find(mission => mission.stage == stage);

    k.add([k.sprite("combat-bg"), k.pos(0, 0)]);

    const spellSlots = [
        k.add([k.sprite("spell-slot"), k.pos(1290, 870), k.area(), "spell", "0"]),
        k.add([k.sprite("spell-slot"), k.pos(1500, 870), k.area(), "spell", "1"]),
        k.add([k.sprite("spell-slot"), k.pos(1710, 870), k.area(), "spell", "2"])
    ];

    const heroTeam = [
        new Character("Lancelot", 40, []),
        new Character("Rasky", 1, []),
        new Character("Rasky", 1, []),
        new Character("Rasky", 1, []),
    ];

    k.onClick("character-slot", (o) => {
        if (hasToFocus) {
            let target = null;
            let tag = o.tags.find(tag => tag.startsWith("ennemy-") || tag.startsWith("ally-"));
            if (tag.startsWith("ennemy-")) {
                target = ennemies.find(ennemy => ennemy.position == tag.substring(7));
                console.log(target);
            } else {
                target = allies.find(ally => ally.position == tag.substring(7));
            }
            damageEnnemy(team[0], spellId, target);
            hasToFocus = false;
            console.log(tag);
        }
    });

    k.onClick("spell", (o) => {
        hasToFocus = true;
        spellId = o.tags.find(tag => tag == "0" || tag == "1" || tag == "2");
        spellId = Number(spellId);
        console.log(spellId);
    });

    let team = spawnTeam(heroTeam);
    let ennemies = spawnWave(mission, 0);

};

function isClickingSpell(spellSlots, spellId) {
    return k.mousePos().x >= spellSlots[spellId].pos.x && k.mousePos().x <= spellSlots[spellId].pos.x + 200 && k.mousePos().y >= spellSlots[spellId].pos.y && k.mousePos().y <= spellSlots[spellId].pos.y + 200;
}

function spawnWave(mission, waveNumber) {
    const waveInfo = mission.waves[waveNumber];
    const waveEnnemies = [];

    for (let i = 0; i < waveInfo.wave.length; i++) {
        let char = new Character(waveInfo.wave[i], 1, []);
        let charSlot = new CharacterSlot(char, i, 2);
        waveEnnemies.push(charSlot);
    }

    return waveEnnemies;
}

function spawnTeam(heroTeam) {
    const team = [];

    for (let i = 0; i < heroTeam.length; i++) {
        let charSlot = new CharacterSlot(heroTeam[i], i, 1);
        team.push(charSlot);
    }

    return team;
}

function damageEnnemy(sourceChar, spellId, targetChar) {
    let damages = sourceChar.character.cast(spellId);
    targetChar.healthbar.damage(damages);

    if (targetChar.remainingHp <= 0) {
        targetChar.kill();
    }
}