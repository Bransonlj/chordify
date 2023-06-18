import { Accidental } from './Accidental';
import { Letter } from './Letter';
import { Note } from './Note';
import { ChordType } from './ChordType'

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

    /**
     * Factory method to generate Chord object from string.
     * @param {string} chordString 
     * @returns Chord object
     */
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
     * Generates the numeric form of the Chord using given keyChord as tonic.
     * @param {Chord} keyChord
     * @returns string of numeric form of chord
     */
    toNumeric(keyChord) {

        if (!keyChord instanceof Chord) {
            throw Error("invalid key object given");
        }
        return this.note.toNumeric(keyChord.note, keyChord.type, this.type) + this.type.toString();
    }

    /**
     * Converts Chord object to generic typeless javascript object
     * @returns object with params: note, accidental, type
     */
    toGenericObject() {
        return {
            note: this.note.letter.toString(),
            accidental: this.note.accidental.toString(),
            type: this.type.toString(),
        }
    }

}