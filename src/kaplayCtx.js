import kaplay from "kaplay";

// initialize context
const k = kaplay({
    width: 1920,
    height: 1080,
    letterbox: true,
    background: [0, 0, 0],
    global: false,
    touchToMouse: true,
    debugKey: "p",
    debug: true
});

export default k;
