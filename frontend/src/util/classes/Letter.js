export class Letter {
    constructor(name, value) {
        this.name = name;
        this.value = value;
    }

    static Letters = {
        A: new Letter('A', 10),
        B: new Letter('B', 12),
        C: new Letter('C', 1),
        D: new Letter('D', 3),
        E: new Letter('E', 5),
        F: new Letter('F', 6),
        G: new Letter('G', 8),
    };

    static InvalidLetter = new Letter('INVALID', 0);

    static fromValue(value) {
        for (const key in Letter.Letters) {
            if (value === Letter.Letters[key].value) {
                return Letter.Letters[key];
            }
        }
        return Letter.InvalidLetter;
    }

    /**
     * Factory method to generate Letter object from string.
     * @param {string} letterString character from A - G
     * @returns Letter object
     */
    static fromString(letterString) {
        for (const key in Letter.Letters) {
            if (letterString === Letter.Letters[key].name) {
                return Letter.Letters[key];
            }
        }
        throw new Error("Invalid string, must be from A - G");
    }

    toString() {
        return this.name;
    }

    isEqual(obj) {
        if (obj instanceof Letter) {
            return obj === Letter.InvalidLetter ? false : obj.name === this.name && obj.value === this.value;
        } else {
            return false;
        }
    }
}