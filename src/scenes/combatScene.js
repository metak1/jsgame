import k from "../kaplayCtx";
import Character from "../classes/Character";
import missions from "../json/missions.json";
import CharacterSlot from "../classes/CharacterSlot";
import SpellHandler from "../classes/system/SpellHandler";

let state = {
    spellHandler: new SpellHandler(),
    currentCharacter: null,
    target: null,
    turn: 1,
    wave: 0,
    focus: false,
    spellSlot: null,
    spell: null,
    charPos: null,
    charTeam: null,
    team: null,
    enemies: null,
    allCharacters: null,
    mission: null,
    combatStart: true,

    // REMOVE HARD CODED HERO TEAM
    heroTeam: [
        new Character(1, 40, []),
        new Character(2, 23, []),
        new Character(4, 5, []),
    ]
};

let ui = {
    turnBg: null,
    waveBg: null,
    turnText: null,
    turnCharIcon: null,
    turnCharName: null,
    turnCharHp: null,
    waveText: null,
    spellSlots: [],
    spellSlotsText: [],
};

export default function combatScene() {
    k.loadSprite("combat-bg", "assets/background.png");
    k.loadSprite("spell-slot", "assets/spell-slot.png");
    k.loadSprite("healthbar-bg", "assets/healthbar-background.png");
    k.loadSprite("timeline-bg", "assets/turn-timeline.png");
    loadMission("1-1");
}

function loadMission(stage) {
    state.mission = missions.find(m => m.stage == stage);

    k.add([k.sprite("combat-bg"), k.pos(0, 0)]);
    k.add([k.sprite("timeline-bg"), k.pos(50, 120)]);
    ui.turnText = k.add([k.text(`Turn ${state.turn}`, { size: 24 }), k.pos(10, 15)]);
    ui.waveText = k.add([
        k.text(`Wave ${state.wave + 1} / ${state.mission.waves.length}`, { size: 24 }),
        k.pos(1730, 15),
    ]);


    ui.turnCharIcon = k.add([k.pos(200, 900)]);
    ui.turnCharName = k.add([k.pos(380, 950), k.text("")]);
    ui.turnCharHp = k.add([k.pos(380, 990), k.text("")]);

    ui.turnBg = k.add([k.rect(200, 50), k.color(40, 40, 40)]);
    ui.turnText = k.add([k.text("Turn " + state.turn, { size: 24 }), k.pos(10, 15)]);

    ui.waveBg = k.add([k.rect(200, 50), k.color(40, 40, 40), k.pos(1720, 0)]);
    ui.waveText = k.add([k.text("Wave " + (state.wave + 1) + " / " + state.mission.waves.length, { size: 24 }), k.pos(1730, 15)]);



    ui.spellSlots = [
        1290, 1500, 1710
    ].map((x, i) => k.add([k.sprite("spell-slot"), k.pos(x, 870), k.area(), "spell", `${i}`]));

    setupClickHandlers();

    state.team = spawnCharacters();
    state.enemies = spawnWave();
    state.allCharacters = [...state.team, ...state.enemies];

    prepareTurnOrder();
    startTurn();
}

function setupClickHandlers() {
    k.onClick("character-slot", (o) => {
        if (!state.focus) return;

        const [tag, position] = o.tags.find(t => t.startsWith("ennemy-") || t.startsWith("ally-")).split("-");
        state.target = tag === "ennemy"
            ? state.enemies.find(e => e.position == position)
            : state.team.find(t => t.position == position);

        state.allCharacters = state.spellHandler.activateSpell(state.spell, state.currentCharacter, state.target, state.allCharacters);
        state.currentCharacter.setSpellOnCD(state.spellSlot);
        state.currentCharacter.playedOnce = true;
        state.focus = false;

        if (!state.enemies.length) {
            if (++state.wave < state.mission.waves.length) {
                state.enemies = spawnWave(state.wave);
                ui.waveText.text = `Wave ${state.wave + 1} / ${state.mission.waves.length}`;
            } else return setWin();
        }

        if (!state.team.length) return setLose();
        startTurn();
    });

    k.onClick("spell", (o) => {
        state.spellSlot = +o.tags.find(t => ["0", "1", "2"].includes(t));
        if (!state.currentCharacter.isSpellOnCD(state.spellSlot)) {
            state.spell = state.currentCharacter.spells()[state.spellSlot];
            state.target = null;
            state.focus = true;
            if (state.spell.affect != "mono") {
                state.allCharacters = state.spellHandler.activateSpell(state.spell, state.currentCharacter, null, state.allCharacters);
            }
        } else {
            console.log("spell is on cd");
        }
    });
}

function spawnWave() {
    return state.mission.waves[state.wave].wave.map((id, index) => {
        return new CharacterSlot(new Character(id), 1, [], index, 2)

    });
}

function spawnCharacters() {
    return state.heroTeam.map((char, index) => new CharacterSlot(char, 1, [], index, 1));
}

function refreshState(target) {
    const teamKey = target.teamNumber === 1 ? "team" : "enemies";
    state[teamKey] = state[teamKey].filter(c => c !== target);
    state.allCharacters = state.allCharacters.filter(c => c !== target);
}

function prepareTurnOrder() {
    state.allCharacters.forEach(char => {
        char.speedSum += char.speed()
        char.setTimelineIconPos();
    });
    state.allCharacters.sort((a, b) => b.speed - a.speed);

    state.allCharacters[0].setTlIconPos(840);
}

function updateUI() {
    const char = state.currentCharacter;
    console.log();
    ui.turnText.text = `Turn ${state.turn}`;
    ui.spellSlotsText.forEach((text, i) => {
        text.text = char.spells()[i]?.name || "";
    });

    let spriteName = "char-icon-" + char.name;
    k.loadSprite(spriteName, "assets/" + char.character.icon);

    ui.turnCharIcon.use(k.sprite(spriteName));
    ui.turnCharName.text = char.character.name;
    ui.turnCharHp.text = char.remainingHp + " / " + char.health();
}

function startTurn() {
    state.currentCharacter = state.allCharacters[0];

    if (state.combatStart) {
        ui.spellSlotsText = ui.spellSlots.map((slot, i) =>
            k.add([k.text("", { size: 24 }), k.pos(slot.pos.x + 10, slot.pos.y + 100), k.color(0, 0, 0)])
        );
        state.combatStart = false;
    }

    updateUI();

    if (state.currentCharacter.teamNumber === 2) {
        state.currentCharacter.playedOnce = true;
        return startTurn();
    }
}

function setWin() {
    console.log("Victory!");
}

function setLose() {
    console.log("Defeat!");
}
