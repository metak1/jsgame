import k from "../kaplayCtx";
import Character from "../classes/Character";
import missions from "../json/missions.json";
import CharacterSlot from "../classes/CharacterSlot";
import Position from "../classes/Position";
import Healthbar from "../classes/Healthbar";


let currentPlayingCharacterSlot = null;
let target = null;
let turn = 1;
let wave = 0;
let hasToFocus = false;
let spellId = null;
let charPos = null;
let charTeam = null;
let turnCharIcon = null;
let turnCharName = null;
let turnCharHp = null;
let team = null;
let ennemies = null;
let allChars = null;
let mission = null;
let turnText = null;
let waveText = null;
let spellSlots = null;
let spellSlotsText = [];
let combatStart = true;

export default function combatScene() {

    k.loadSprite("combat-bg", "assets/background.png");
    k.loadSprite("spell-slot", "assets/spell-slot.png");
    k.loadSprite("healthbar-bg", "assets/healthbar-background.png");
    k.loadSprite("timeline-bg", "assets/turn-timeline.png");
    loadMission("1-1");
}

function loadMission(stage) {

    mission = missions.find(mission => mission.stage == stage);

    k.add([k.sprite("combat-bg"), k.pos(0, 0)]);
    k.add([k.sprite("timeline-bg"), k.pos(50, 120)]);
    turnCharIcon = k.add([k.pos(200, 900)]);
    turnCharName = k.add([k.pos(380, 950), k.text("")]);
    turnCharHp = k.add([k.pos(380, 990), k.text("")]);

    let turnBg = k.add([k.rect(200, 50), k.color(40, 40, 40)]);
    turnText = k.add([k.text("Turn " + turn, { size: 24 }), k.pos(10, 15)]);

    let waveBg = k.add([k.rect(200, 50), k.color(40, 40, 40), k.pos(1720, 0)]);
    waveText = k.add([k.text("Wave " + (wave + 1) + " / " + mission.waves.length, { size: 24 }), k.pos(1730, 15)]);

    spellSlots = [
        k.add([k.sprite("spell-slot"), k.pos(1290, 870), k.area({ width: 200, height: 200 }), "spell", "0"]),
        k.add([k.sprite("spell-slot"), k.pos(1500, 870), k.area({ width: 200, height: 200 }), "spell", "1"]),
        k.add([k.sprite("spell-slot"), k.pos(1710, 870), k.area({ width: 200, height: 200 }), "spell", "2"])
    ];

    const heroTeam = [
        new Character(1, 40, []),
        new Character(2, 23, []),
        new Character(4, 5, []),
    ];

    k.onClick("character-slot", (o) => {
        if (!hasToFocus) return;

        const tag = o.tags.find(t => t.startsWith("ennemy-") || t.startsWith("ally-"));
        const position = tag.substring(tag.indexOf("-") + 1);
        target = tag.startsWith("ennemy-")
            ? ennemies.find(e => e.position == position)
            : team.find(a => a.position == position);
        activateSpell(currentPlayingCharacterSlot, spellId, target);
        currentPlayingCharacterSlot.playedOnce = true;
        hasToFocus = false;
        if (ennemies.length == 0) {
            wave++;

            if (wave < mission.waves.length) {
                ennemies = spawnWave(wave);
                waveText.text = "Wave " + (wave + 1) + " / " + mission.waves.length;
                nextCharacterAction();
            } else {
                setWin();
            }
        } else if (team.length == 0) {
            setLose();
        } else {
            nextCharacterAction();
        }
    });

    k.onClick("spell", (o) => {
        hasToFocus = true;
        spellId = Number(o.tags.find(tag => ["0", "1", "2"].includes(tag)));
        target = null;
    });

    team = spawnTeam(heroTeam);
    ennemies = spawnWave(wave);
    allChars = team.concat(ennemies);


    setCharacterActionPositionTeam();

    startCharacterAction();
};

function incrementTurn() {
    turn++
    turnText.text = "Turn " + turn;
}

function spawnWave(waveNumber) {
    return mission.waves[waveNumber].wave.map((id, index) => {
        console.log(id, index);
        return new CharacterSlot(new Character(id), 1, [], index, 2);
    }
    );
}

function spawnTeam(heroTeam) {
    return heroTeam.map((hero, index) => new CharacterSlot(hero, 1, [], index, 1));
}

function activateSpell(sourceChar, spellId, targetChar) {
    const damages = sourceChar.cast(spellId);
    targetChar.healthbar.damage(damages);
    if (targetChar.remainingHp <= 0) {
        refreshTeamsData(targetChar);
        targetChar.kill();
    }
}

function setCharacterActionPositionTeam() {

    let currentSpeedChart = allChars.sort((a, b) => b.speedSum - a.speedSum);
    console.log(currentSpeedChart);
    for (let i in currentSpeedChart) {
        currentSpeedChart[i].setCharacterActionIconPos(((720 * currentSpeedChart[i].speedSum) / 1000) + 140);
    }
    currentSpeedChart[0].setCharacterActionIconPos(840);
    charPos = currentSpeedChart[0].position;
    charTeam = currentSpeedChart[0].teamNumber;
    console.log(charPos, charTeam);
}

function updateCharacterActionUI() {
    let spriteName = "char-icon-" + turnCharName;
    k.loadSprite(spriteName, "assets/" + currentPlayingCharacterSlot.character.icon);

    turnCharIcon.use(k.sprite(spriteName));
    turnCharName.text = currentPlayingCharacterSlot.character.name;
    turnCharHp.text = currentPlayingCharacterSlot.remainingHp + " / " + currentPlayingCharacterSlot.health();

    for (let i in spellSlots) {
        const spriteSize = spellSlots[i].frameSize || { x: 200, y: 200 };
        spellSlotsText[i].text = currentPlayingCharacterSlot.character.spells[i].name;
    }
}

function startCharacterAction() {
    currentPlayingCharacterSlot = charTeam == 1
        ? team.find(t => t.position == charPos)
        : ennemies.find(e => e.position == charPos);

    if (combatStart) {
        for (let i in spellSlots) {
            const spriteSize = spellSlots[i].frameSize || { x: 200, y: 200 };
            spellSlotsText[i] = k.add([k.text(currentPlayingCharacterSlot.character.spells[i].name), k.pos(spellSlots[i].pos.x + 10, spellSlots[i].pos.y + (spriteSize.y) / 2), k.color(0, 0, 0)]);
        }
        combatStart = false;
    }

    updateCharacterActionUI();

    // TO REMOVE ennemies pass their turn auto
    if (currentPlayingCharacterSlot.teamNumber == 2) {
        currentPlayingCharacterSlot.playedOnce = true;
        nextCharacterAction();
    }
}

function nextCharacterAction() {
    let changeTurn = true;

    currentPlayingCharacterSlot.speedSum = 0;
    for (let i in allChars) {
        if (changeTurn) {
            changeTurn = allChars[i].playedOnce;
        }
        allChars[i].speedSum += allChars[i].speed();
    }

    if (changeTurn) {
        incrementTurn();
    }
    setCharacterActionPositionTeam();

    startCharacterAction();
}

function refreshTeamsData(target) {
    if (target.teamNumber == 1) {
        let index = team.indexOf();
        team = team.filter(t => t.position != target.position);
    } else {
        ennemies = ennemies.filter(e => e.position != target.position);
    }
    allChars = allChars.filter(a => !(a.position == target.position && a.teamNumber == target.teamNumber));
}

function setWin() {
    console.log("WIN !!!");
}

function setLose() {
    console.log("LOSE !!!");
}