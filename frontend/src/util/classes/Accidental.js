export class Accidental{
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    static Accidentals = {
        NATURAL: new Accidental("", 0),
        FLAT: new Accidental("b", -1),
        SHARP: new Accidental("#", 1),
    }

    static fromValue(value) {
        for (const key in Accidental.Accidentals) {
            if (value === Accidental.Accidentals[key].value) {
                return Accidental.Accidentals[key];
            }
        }
        throw new Error("Invalid value, must be either -1, 0, 1");
    }

    static fromString(str) {
        for (const key in Accidental.Accidentals) {
            if (str === Accidental.Accidentals[key].name) {
                return Accidental.Accidentals[key];
            }
        }
        throw new Error("Invalid string, must be either #, b or empty string");
    }

    toString() {
        return this.name;
    }

    isEqual(obj) {
        if (obj instanceof Accidental) {
            return obj.name === this.name && obj.value === this.value;
        } else {
            return false;
        }
    }
}