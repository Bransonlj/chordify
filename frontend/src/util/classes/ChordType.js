import Note from "./Note";

export class ChordType {

    static KeyTypes = {
        MAJOR: new ChordType("", true),
        MINOR: new ChordType("m", false),
    }

    static Types = {
        MAJOR: new ChordType("", true),
        MINOR: new ChordType("m", false),
        DIMINISHED: new ChordType("dim", false),
        MAJOR_SEVENTH: new ChordType("maj7", true),
        MINOR_SEVENTH: new ChordType("m7", false),
        DOMINANT_SEVENTH: new ChordType("7", true),
        SIXTH: new ChordType("6", true),
        MINOR_SIXTH: new ChordType("m6", false),
    }

    /**
     * Factory method to generate ChordType object from string.
     * @param {string} typeString 
     * @returns ChordType object
     */
    static fromString(str) {
        let typeString = str;
        let note = Note.EMPTY_NOTE;

        // contains bass note
        if (typeString.includes("/")) {
            const index = typeString.indexOf("/");
            const noteString = str.slice(index + 1);

            try {
                note = Note.fromString(noteString);
            } catch {

            }
            typeString = typeString.slice(0, index);
        }

        for (const typeKey in ChordType.Types) {
            if (typeString === ChordType.Types[typeKey].name) {
                return ChordType.Types[typeKey].withBassNote(note);
            }
        }

        throw new Error("invalid type string given");
    }

    /**
     * 
     * @param {string} name 
     * @param {boolean} isUpper whether the numeric representation should be upper case or not.
     * @param {Note} bassNote
     */
    constructor(name, isUpper, bassNote=Note.EMPTY_NOTE) {
        this.name = name;
        this.isUpper = isUpper;
        this.bassNote = bassNote
    }

    /**
     * Creates a new ChordType object with same name and isUpper as this instance but with bassNote given.
     * @param {*} bassNote 
     * @returns {ChordType} ChordType object
     */
    withBassNote(bassNote) {
        return new ChordType(this.name, this.isUpper, bassNote);
    }

    toString() {
        return this.bassNote.isEmpty() ? this.name : this.name + "/" + this.bassNote.toString();
    }

    isEqual(obj) {
        if (obj instanceof ChordType) {
            return obj.name === this.name && obj.isUpper === this.isUpper && obj.bassNote.isEqual(this.bassNote);
        } else {
            return false;
        }
    }
}