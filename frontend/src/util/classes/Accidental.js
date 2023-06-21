export class Accidental{
    static Accidentals = {
        NATURAL: new Accidental("", 0),
        FLAT: new Accidental("b", -1),
        SHARP: new Accidental("#", 1),
    }

    static EMPTY_ACCIDENTAL = new Accidental("EMPTY", 9)

    /**
     * Factory method to generate Accidental object from value.
     * @param {number} value -1/0/1
     * @returns Accidental object
     */
    static fromValue(value) {
        for (const key in Accidental.Accidentals) {
            if (value === Accidental.Accidentals[key].value) {
                return Accidental.Accidentals[key];
            }
        }
        throw new Error("Invalid value, must be either -1, 0, 1");
    }

    /**
     * Factory method to generate Accidental object from string.
     * @param {string} str '#'/'b'/''
     * @returns Accidental object
     */
    static fromString(str) {
        for (const key in Accidental.Accidentals) {
            if (str === Accidental.Accidentals[key].name) {
                return Accidental.Accidentals[key];
            }
        }
        throw new Error("Invalid string, must be either #, b or empty string");
    }

    /**
     * 
     * @param {string} name 
     * @param {number} value 
     */
    constructor(name, value) {
        this.name = name;
        this.value = value;
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