import { Accidental } from "./Accidental";
import { Letter } from "./Letter";
import { ChordType } from './ChordType';

const _ = require('lodash')

const Numerals = {
    ONE: 'i',
    TWO: 'ii',
    THREE: 'iii',
    FOUR: 'iv',
    FIVE: 'v',
    SIX: 'vi',
    SEVEN: 'vii',
}

/**
 * 
 * @param {number} num 
 * @param {Accidental} accidental 
 * @returns numeric note as a string
 */
const numberToNumeralMajor = (num, accidental) => {
    const emptyString = '';

    switch(num) {
        case 1:
            return [emptyString, Numerals.ONE];
        case 2:
            return accidental.isEqual(Accidental.SHARP)
                ? [Accidental.Accidentals.SHARP.toString(), Numerals.ONE]
                : [Accidental.Accidentals.FLAT.toString(), Numerals.TWO];
        case 3:
            return [emptyString, Numerals.TWO];
        case 4:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.TWO]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.THREE];
        case 5:
            return [emptyString, Numerals.THREE];
        case 6:
            return [emptyString, Numerals.FOUR];
        case 7:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(),  Numerals.FOUR]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.FIVE];
        case 8:
            return [emptyString, Numerals.FIVE];
        case 9:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.FIVE]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.SIX];
        case 10:
            return [emptyString, Numerals.SIX];
        case 11:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.SIX]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.SEVEN];
        case 12:
            return [emptyString, Numerals.SEVEN];
    }
}

const numberToNumeralMinor = (num, accidental) => {
    const emptyString = '';

    switch(num) {
        case 1:
            return [emptyString, Numerals.ONE];
        case 2:
            return accidental.isEqual(Accidental.SHARP)
                ? [Accidental.Accidentals.SHARP.toString(), Numerals.ONE]
                : [Accidental.Accidentals.FLAT.toString(), Numerals.TWO];
        case 3:
            return [emptyString, Numerals.TWO];
        case 4:
            return [emptyString, Numerals.THREE];
        case 5:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.THREE]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.FOUR];
        case 6:
            return [emptyString, Numerals.FOUR];
        case 7:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.FOUR]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.FIVE];
        case 8:
            return [emptyString, Numerals.FIVE];
        case 9:
            return [emptyString, Numerals.SIX];
        case 10:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.FIVE]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.SIX];
        case 11:
            return [emptyString, Numerals.SEVEN];
        case 12:
            return accidental.isEqual(Accidental.SHARP)
            ? [Accidental.Accidentals.SHARP.toString(), Numerals.SIX]
            : [Accidental.Accidentals.FLAT.toString(), Numerals.SEVEN];
    }
}


export class Note {
    constructor(letter, accidental) {
        if (letter instanceof Letter && accidental instanceof Accidental) {
            this.letter = letter;
            this.accidental = accidental;
        } else {
            throw new Error("Invalid arguements")
        }

    }

    static valueToNote(value) {
        const cleanedValue = (value - 1) % 12 + 1;
        for (const key in Letter.Letters) {
            if (cleanedValue === Letter.Letters[key].value || cleanedValue === Letter.Letters[key].value + 1) {
                const letter = Letter.Letters[key];
                const accidental = Accidental.fromValue(cleanedValue - letter.value);
                return new Note(letter, accidental);
            }
        }
    }

    static fromString(noteString) {
        return new Note(Letter.fromString(noteString[0]), Accidental.fromString(noteString.slice(1)));
    }

    toString(transpose = 0) {
        if (transpose === 0) {
            return this.letter.toString() + this.accidental.toString();
        } else {
            return Note.valueToNote(this.letter.value + this.accidental.value + transpose).toString();
        }
    }

    getValue() {
        return this.letter.value + this.accidental.value;
    }

    /**
     * Converts Note to numeric form using given key as root and returns the numeric note as a string.
     * @param {Note} keyNote 
     */
    toNumeric(keyNote, keyType, chordType) {
        let chordValue = this.getValue()
        const tonicValue = keyNote.getValue();
        if (tonicValue > chordValue) {
            chordValue += 12;
        }

        const difference = 1 + chordValue - tonicValue;
        
        let isMajor = true;
        if (keyType.isEqual(ChordType.Types.MAJOR)) {
            isMajor = true;
        } else if (keyType.isEqual(ChordType.Types.MINOR)) {
            isMajor = false;
        } else {
            throw new Error("invalid key type");
        }

        const [accidentalString, numeralString] = isMajor 
                ? numberToNumeralMajor(difference, this.accidental) 
                : numberToNumeralMinor(difference, this.accidental);

        return accidentalString 
                + (chordType.casing === ChordType.Casings.UPPER 
                ? numeralString.toUpperCase() 
                : numeralString.toLowerCase());
    } 
}