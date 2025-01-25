export default class Effect {

    constructor(primaryType, secondaryType, power, duration) {
        this.primaryType = primaryType;
        this.secondaryType = secondaryType;
        this.power = power;
        this.duration = duration;

        this.gameObject = null;
    }
}