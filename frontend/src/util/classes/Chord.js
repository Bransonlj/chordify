import { Notes, Accidentals, Types, Case, Numerals, TypeCase } from '../chords'

const _ = require('lodash');

const displayNote = (note, accidental) => {
    return accidental === Accidentals.Natural
        ? note
        : note + accidental;
}

const displayChordType = (type) => {
    if (_.isEqual(type, Types.Major)) {
        return "";
    } else if (_.isEqual(type, Types.Minor)) {
        return "m";
    } else {
        return type;
    }
}

// -------------- NUMERIC CHORD DISPLAY HELPER FUNCTIONS ----------------

// if major/minor chord, dont display type.
const displayNumericChordType = (type) => {
    return _.isEqual(type, Types.Major) || _.isEqual(type, Types.Minor)
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
        case Accidentals.Flat:
            return -1;
        case Accidentals.Natural:
            return 0;
        case Accidentals.Sharp:
            return 1;
        default:
            throw Error("Not an Accidental");
    }
}

const numberToNumeralMajor = (num, accidental) => {
    switch(num) {
        case 1:
            return Numerals.One;
        case 2:
            return accidental === Accidentals.Sharp
                ? Accidentals.Sharp + Numerals.One
                : Accidentals.Flat + Numerals.Two;
        case 3:
            return Numerals.Two;
        case 4:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Two
            : Accidentals.Flat + Numerals.Three;
        case 5:
            return Numerals.Three;
        case 6:
            return Numerals.Four;
        case 7:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Four
            : Accidentals.Flat + Numerals.Five;
        case 8:
            return Numerals.Five;
        case 9:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Five
            : Accidentals.Flat + Numerals.Six;
        case 10:
            return Numerals.Six;
        case 11:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Six
            : Accidentals.Flat + Numerals.Seven;
        case 12:
            return Numerals.Seven;
    }
}

const numberToNumeralMinor = (num, accidental) => {
    switch(num) {
        case 1:
            return Numerals.One;
        case 2:
            return accidental === Accidentals.Sharp
                ? Accidentals.Sharp + Numerals.One
                : Accidentals.Flat + Numerals.Two;
        case 3:
            return Numerals.Two;
        case 4:
            return Numerals.Three
        case 5:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Three
            : Accidentals.Flat + Numerals.Four;
        case 6:
            return Numerals.Four;
        case 7:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Four
            : Accidentals.Flat + Numerals.Five;
        case 8:
            return Numerals.Five;
        case 9:
            return Numerals.Six;
        case 10:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Five
            : Accidentals.Flat + Numerals.Six;
        case 11:
            return Numerals.Seven;
        case 12:
            return accidental === Accidentals.Sharp
            ? Accidentals.Sharp + Numerals.Six
            : Accidentals.Flat + Numerals.Seven;
    }
}


/**
 * Data class to store Chord object and convert for display between numeric and alphabetic.
 */
export class Chord {
    constructor(note, accidental, type) {
        this.note = note;
        this.accidental = accidental;
        this.type = type;
    }

    /**
     * Static factory method to create Chord object from string. Returns a Chord object.
     * @param {*} chordString string to convert. Onus is on user to ensure string is valid as there is no validation currently.
     */
    static create(chordString) {
        // Note
        const noteNew = chordString[0];

        let accidentalNew = Accidentals.Natural;
        let nextIndex = 2;
        // Accidental
        if (chordString[1] === "#") {
            accidentalNew = Accidentals.Sharp;
        } else if (chordString[1] === "b") {
            accidentalNew = Accidentals.Flat;
        } else {
            nextIndex = 1
        }
        
        // Type
        const typeNew = chordString.slice(nextIndex);

        return new Chord(noteNew, accidentalNew, typeNew);
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

        if (_.isEqual(key.type, Types.Major)) {
            return TypeCase[this.type] === Case.Upper 
                ? numberToNumeralMajor(relativeNum, this.accidental).toUpperCase() + displayNumericChordType(this.type)
                : numberToNumeralMajor(relativeNum, this.accidental).toLowerCase() + displayNumericChordType(this.type);
        } else if (_.isEqual(key.type, Types.Minor)) {
            return TypeCase[this.type] === Case.Upper 
                ? numberToNumeralMinor(relativeNum, this.accidental).toUpperCase() + displayNumericChordType(this.type)
                : numberToNumeralMinor(relativeNum, this.accidental).toLowerCase() + displayNumericChordType(this.type);
        } else {
            throw Error("Invalid key type, should be Major or Minor only");
        }

    }
}