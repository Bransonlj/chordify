import { Notes, Accidentals, AccidentalsSimple, Types, Case, Numerals, TypeCase } from '../chords'
import { Accidental } from './Accidental';
import { Letter } from './Letter';
import { Note } from './Note';
import { ChordType } from './ChordType'

const _ = require('lodash');

const displayNote = (note, accidental) => {
    return accidental === Accidentals.NATURAL
        ? note
        : note + accidental;
}

const displayChordType = (type) => {
    if (_.isEqual(type, Types.MAJOR)) {
        return "";
    } else if (_.isEqual(type, Types.MINOR)) {
        return "m";
    } else {
        return type;
    }
}

// -------------- NUMERIC CHORD DISPLAY HELPER FUNCTIONS ----------------

// if major/minor chord, dont display type.
const displayNumericChordType = (type) => {
    return _.isEqual(type, Types.MAJOR) || _.isEqual(type, Types.MINOR)
        ? ""
        : type;
}

const noteToNumber = (note) => {
    switch (note) {
        case Notes.C:
            return 1;
        case Notes.D:
            return 3;
        case Notes.E:
            return 5;    
        case Notes.F:
            return 6;
        case Notes.G:
            return 8;
        case Notes.A:
            return 10;
        case Notes.B:
            return 12;     
        default:
            throw Error("Cannot convert to numeral");
    }
}

const accidentalModifier = (accidental) => {
    switch (accidental) {
        case Accidentals.FLAT:
            return -1;
        case Accidentals.NATURAL:
            return 0;
        case Accidentals.SHARP:
            return 1;
        default:
            throw Error("Not an Accidental");
    }
}

const numberToNumeralMajor = (num, accidental) => {
    switch(num) {
        case 1:
            return Numerals.ONE;
        case 2:
            return accidental === Accidentals.SHARP
                ? Accidentals.SHARP + Numerals.ONE
                : Accidentals.FLAT + Numerals.TWO;
        case 3:
            return Numerals.TWO;
        case 4:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.TWO
            : Accidentals.FLAT + Numerals.THREE;
        case 5:
            return Numerals.THREE;
        case 6:
            return Numerals.FOUR;
        case 7:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.FOUR
            : Accidentals.FLAT + Numerals.FIVE;
        case 8:
            return Numerals.FIVE;
        case 9:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.FIVE
            : Accidentals.FLAT + Numerals.SIX;
        case 10:
            return Numerals.SIX;
        case 11:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.SIX
            : Accidentals.FLAT + Numerals.SEVEN;
        case 12:
            return Numerals.SEVEN;
    }
}

const numberToNumeralMinor = (num, accidental) => {
    switch(num) {
        case 1:
            return Numerals.ONE;
        case 2:
            return accidental === Accidentals.SHARP
                ? Accidentals.SHARP + Numerals.ONE
                : Accidentals.FLAT + Numerals.TWO;
        case 3:
            return Numerals.TWO;
        case 4:
            return Numerals.THREE
        case 5:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.THREE
            : Accidentals.FLAT + Numerals.FOUR;
        case 6:
            return Numerals.FOUR;
        case 7:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.FOUR
            : Accidentals.FLAT + Numerals.FIVE;
        case 8:
            return Numerals.FIVE;
        case 9:
            return Numerals.SIX;
        case 10:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.FIVE
            : Accidentals.FLAT + Numerals.SIX;
        case 11:
            return Numerals.SEVEN;
        case 12:
            return accidental === Accidentals.SHARP
            ? Accidentals.SHARP + Numerals.SIX
            : Accidentals.FLAT + Numerals.SEVEN;
    }
}


/**
 * Data class to store Chord object and convert for display between numeric and alphabetic.
 */
export class Chord {
    
    /**
     * 
     * @param {Note} note 
     * @param {ChordType} type 
     */
    constructor(note, type) {
        this.note = note;
        this.type = type;
    }

    /**
     * Static factory method to create Chord object from string. Returns a Chord object.
     * @param {*} chordString string to convert. Onus is on user to ensure string is valid as there is no validation currently.
     */
    static create(chordString) {
        // Note
        const noteNew = chordString[0];

        let accidentalNew = Accidentals.NATURAL;
        let nextIndex = 2;
        // Accidental
        if (chordString[1] === "#") {
            accidentalNew = Accidentals.SHARP;
        } else if (chordString[1] === "b") {
            accidentalNew = Accidentals.FLAT;
        } else {
            nextIndex = 1
        }
        
        // Type
        const typeNew = chordString.slice(nextIndex);

        return new Chord(noteNew, accidentalNew, typeNew);
    }

    static generateAllChordOptions() {
        const options = [];
        for (const letterKey in Letter.Letters) {
            for (const accidentalKey in Accidental.Accidentals) {
                for (const typeKey in ChordType.Types) {
                    const noteOptionString = Letter.Letters[letterKey].toString() 
                            + Accidental.Accidentals[accidentalKey].toString() 
                            + ChordType.Types[typeKey].toString();
                    options.push({ value: noteOptionString, label: noteOptionString});
                }
            }
        }
    
        return options;
    }

    static generateAllKeyOptions() {
        const options = [];
        for (const letterKey in Letter.Letters) {
            for (const accidentalKey in Accidental.Accidentals) {
                for (const typeKey in ChordType.KeyTypes) {
                    const noteOptionString = Letter.Letters[letterKey].toString() 
                            + Accidental.Accidentals[accidentalKey].toString() 
                            + ChordType.KeyTypes[typeKey].toString();
                    options.push({ value: noteOptionString, label: noteOptionString});
                }
            }
        }
    
        return options;
    }

    static fromString(chordString) {
        let nextIndex = 1;
        if (chordString[1] === Accidental.Accidentals.SHARP.toString() || chordString[1] === Accidental.Accidentals.FLAT.toString()) {
            nextIndex = 2;
        }

        return new Chord(Note.fromString(chordString.slice(0, nextIndex)), ChordType.fromString(chordString.slice(nextIndex)));
    }

    toString(transpose = 0) {
        return this.note.toString(transpose) + this.type.toString();
    }

    /**
     * 
     * @param {Chord} keyChord
     * @returns 
     */
    toNumeric(keyChord) {

        if (!keyChord instanceof Chord) {
            throw Error("invalid key object given");
        }
        return this.note.toNumeric(keyChord.note, keyChord.type, this.type) + this.type.toString();
    }

    toGenericObject() {
        return {
            note: this.note.letter.toString(),
            accidental: this.note.accidental.toString(),
            type: this.type.toString(),
        }
    }

    /**
     * Converts the chord object into a string and returns it
     */
    toChordString() {
        let chordString = this.note;
        switch (this.accidental) {
            case Accidentals.SHARP:
                chordString += AccidentalsSimple.SHARP;
                break;
            case Accidentals.FLAT:
                chordString += AccidentalsSimple.FLAT;
                break;
            case Accidentals.NATURAL:
                chordString += AccidentalsSimple.NATURAL;
                break;
            default:
                console.log(this.accidental)
        }
        chordString += this.type;
        return chordString;
    }

    displayChordAlphabetic() {
        return displayNote(this.note, this.accidental) + displayChordType(this.type);
    }

    // parameter key is a Chord object
    displayChordNumeric(key) {
        
        if (!key instanceof Chord) {
            throw Error("invalid key object given");
        }

        // calculate number of chord relative to the key
        let num = noteToNumber(this.note) + accidentalModifier(this.accidental);
        if (num > 12) {
            num -= 12;
        }

        let tonic = noteToNumber(key.note) + accidentalModifier(key.accidental);
        if (tonic > 12) {
            tonic -= 12;
        }
        if (tonic > num) {
            num += 12
        }

        const relativeNum = 1 + Math.abs(num - tonic);

        if (_.isEqual(key.type, Types.MAJOR)) {
            return TypeCase[this.type] === Case.UPPER 
                ? numberToNumeralMajor(relativeNum, this.accidental).toUpperCase() + displayNumericChordType(this.type)
                : numberToNumeralMajor(relativeNum, this.accidental).toLowerCase() + displayNumericChordType(this.type);
        } else if (_.isEqual(key.type, Types.MINOR)) {
            return TypeCase[this.type] === Case.UPPER 
                ? numberToNumeralMinor(relativeNum, this.accidental).toUpperCase() + displayNumericChordType(this.type)
                : numberToNumeralMinor(relativeNum, this.accidental).toLowerCase() + displayNumericChordType(this.type);
        } else {
            throw Error("Invalid key type, should be Major or Minor only");
        }

    }
}