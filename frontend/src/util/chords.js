const _ = require('lodash');

export const Notes = {
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    E: "E",
    F: "F",
    G: "G",
};

export const Accidentals = {
    Natural: "♮",
    Flat: "♭",
    Sharp: "♯",
}

const Case = {
    Upper: "upper",
    Lower: "lower",
}

const KeyTypes = ["Major", "Minor"];

export const Types = {
    Major: "maj",
    Minor: "min",
    Diminished: "dim",
    MajorSeventh: "maj7",
    MinorSeventh: "m7",
    Sixth: "6",
    MinorSixth: "m6",
    
}

const TypeCase = {
   Major: Case.Upper,
   Minor: Case.Lower,
   Diminished: Case.Lower,
   MajorSeventh: Case.Upper,
   MinorSeventh: Case.Lower,
   Sixth: Case.Upper,
   MinorSixth: Case.Lower,

}

const Numerals = {
    One: 'i',
    Two: 'ii',
    Three: 'iii',
    Four: 'iv',
    Five: 'v',
    Six: 'vi',
    Seven: 'vii',
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

export const generateChordOptions = (arg) => {
    return ( 
        <>
        { Object.keys(arg).map((val) => (
            <option value={ arg[val] } key={ val }>{ arg[val] }</option>
        )) }
        </>
    )
}

/**
 * Generates array of option elements. Types enum object is used for comparison with defaultVal.
 * @param {*} defaultVal Types enum object to be used as the initial value. No value by default.
 * @returns Array of option elements.
 */
export const generateAllTypeOptions = (defaultVal=null) => {
    return ( 
        <>
        { Object.keys(Types).map((typeKey) => {
            if (_.isEqual(Types[typeKey], defaultVal)) {
                return (
                    <option value={ typeKey } key={ typeKey } selected>{ Types[typeKey].symbol }</option>
                )
            } else {
                return (
                    <option value={ typeKey } key={ typeKey }>{ Types[typeKey].symbol }</option>
                )
            }
        }) }
        </>
    )
}

/**
 * Values are the String key for the Type objects enum. use Types[value] to obtain the Type object.
 */
export const generateKeyTypeOptions = () => {
    return ( 
        <>
            { KeyTypes.map((typeKey) => (
                <option value={ Types[typeKey] } key={ typeKey }>{ Types[typeKey] }</option>
            )) }
        </>
    )
}

export const displayNote = (note, accidental) => {
    return accidental === Accidentals.Natural
        ? note
        : note + accidental;
}

export const displayChord = (note, accidental, type) => {
    return displayNote(note, accidental) + displayChordType(type);
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


export const convertChordToNumerals = (note, accidental, type, keyNote, keyAccidental, keyType) => {
    let num = noteToNumber(note) + accidentalModifier(accidental);
    if (num > 12) {
        num -= 12;
    }
    let tonic = noteToNumber(keyNote) + accidentalModifier(keyAccidental);
    if (tonic > 12) {
        tonic -= 12;
    }

    if (tonic > num) {
        num += 12
    }
    const diff = 1 + Math.abs(num - tonic);
    
    if (_.isEqual(keyType, Types.Major)) {
        return TypeCase[type] === Case.Upper 
            ? numberToNumeralMajor(diff, accidental).toUpperCase() + displayNumericChordType(type)
            : numberToNumeralMajor(diff, accidental).toLowerCase() + displayNumericChordType(type);
    } else if (_.isEqual(keyType, Types.Minor)) {
        return TypeCase[type] === Case.Upper 
            ? numberToNumeralMinor(diff, accidental).toUpperCase() + displayNumericChordType(type)
            : numberToNumeralMinor(diff, accidental).toLowerCase() + displayNumericChordType(type);
    } else {
        throw Error("Invalid key type, should be Major or Minor only");
    }
}