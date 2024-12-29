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
    k.loadSprite("timeline-bg", "assets/turn-timeline.png");
    loadMission("1-1");
}

function loadMission(stage) {
    let currentPlayingCharacterSlot = null;
    let target = null;
    let turn = 1;
    let hasToFocus = false;
    let spellId = null;
    const mission = missions.find(mission => mission.stage == stage);

    k.add([k.sprite("combat-bg"), k.pos(0, 0)]);
    k.add([k.sprite("timeline-bg"), k.pos(50, 120)]);
    let turnBg = k.add([k.rect(200, 50), k.color(40, 40, 40)]);
    let turnText = k.add([k.text("Turn " + turn, { size: 24 }), k.pos(10, 15)]);

    const spellSlots = [
        k.add([k.sprite("spell-slot"), k.pos(1290, 870), k.area(), "spell", "0"]),
        k.add([k.sprite("spell-slot"), k.pos(1500, 870), k.area(), "spell", "1"]),
        k.add([k.sprite("spell-slot"), k.pos(1710, 870), k.area(), "spell", "2"])
    ];

    const heroTeam = [
        new Character("Lancelot", 40, []),
        new Character("Rasky", 1, []),
        new Character("Okumat", 1, []),
        new Character("Rasky", 1, []),
    ];

    k.onClick("character-slot", (o) => {
        if (!hasToFocus) return;

        const tag = o.tags.find(t => t.startsWith("ennemy-") || t.startsWith("ally-"));
        const position = tag.substring(tag.indexOf("-") + 1);
        console.log(tag, position);
        target = tag.startsWith("ennemy-")
            ? ennemies.find(e => e.position == position)
            : team.find(a => a.position == position);
        console.log(target);
        activateSpell(team[0], spellId, target);
        hasToFocus = false;
    });

    k.onClick("spell", (o) => {
        hasToFocus = true;
        spellId = Number(o.tags.find(tag => ["0", "1", "2"].includes(tag)));
        target = null;
    });

    let team = spawnTeam(heroTeam);
    let ennemies = spawnWave(mission, 0);

    let [charPos, charTeam] = setTurnPositionTeam(team, ennemies);

    currentPlayingCharacterSlot = charTeam == 1
        ? team.find(t => t.position == charPos)
        : ennemies.find(e => e.position == charPos);
    console.log(currentPlayingCharacterSlot);
};

function spawnWave(mission, waveNumber) {
    return mission.waves[waveNumber].wave.map((info, index) =>
        new CharacterSlot(new Character(info, 1, []), index, 2)
    );
}

function spawnTeam(heroTeam) {
    return heroTeam.map((hero, index) => new CharacterSlot(hero, index, 1));
}

function activateSpell(sourceChar, spellId, targetChar) {
    const damages = sourceChar.character.cast(spellId);
    targetChar.healthbar.damage(damages);
    if (targetChar.remainingHp <= 0) targetChar.kill();
}

function setTurnPositionTeam(team, ennemies) {
    let allChars = team.concat(ennemies);
    let currentSpeedChart = allChars.sort((a, b) => b.speedSum - a.speedSum);
    console.log(currentSpeedChart[0].turnGameObject);
    /*for (let i in currentSpeedChart) {
        currentSpeedChart[i].turnGameObject.height = ((720 * currentSpeedChart[i].speedSum) / 1000) + 140;
    }
    console.log(currentSpeedChart[0].turnGameObject.height);*/
    currentSpeedChart[0].setTurnIconHeight(840);
    //console.log(currentSpeedChart[0].turnGameObject.height);
    return [currentSpeedChart[0].position, currentSpeedChart[0].teamNumber];
}