export class ChordType {

    static Casings = {
        UPPER: "upper",
        LOWER: "lower",
    }

    static KeyTypes = {
        MAJOR: new ChordType("", ChordType.Casings.UPPER),
        MINOR: new ChordType("m", ChordType.Casings.LOWER),
    }

    static Types = {
        MAJOR: new ChordType("", ChordType.Casings.UPPER),
        MINOR: new ChordType("m", ChordType.Casings.LOWER),
        DIMINISHED: new ChordType("dim", ChordType.Casings.LOWER),
        MAJOR_SEVENTH: new ChordType("maj7", ChordType.Casings.UPPER),
        MINOR_SEVENTH: new ChordType("m7", ChordType.Casings.LOWER),
        DOMINANT_SEVENTH: new ChordType("7", ChordType.Casings.UPPER),
        SIXTH: new ChordType("6", ChordType.Casings.UPPER),
        MINOR_SIXTH: new ChordType("m6", ChordType.Casings.LOWER),
    }

    /**
     * Factory method to generate ChordType object from string.
     * @param {string} typeString 
     * @returns ChordType object
     */
    static fromString(typeString) {
        for (const typeKey in ChordType.Types) {
            if (typeString === ChordType.Types[typeKey].name) {
                return ChordType.Types[typeKey];
            }
        }

        throw new Error("invalid type string given");
    }

    /**
     * 
     * @param {string} name 
     * @param {string} casing 
     */
    constructor(name, casing) {
        this.name = name;
        this.casing = casing;
    }

    toString() {
        return this.name;
    }

    isEqual(obj) {
        if (obj instanceof ChordType) {
            return obj.name === this.name && obj.casing === this.casing;
        } else {
            return false;
        }
    }
}