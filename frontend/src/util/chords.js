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
    NATURAL: "♮",
    FLAT: "♭",
    SHARP: "♯",
}

export const AccidentalsSimple = {
    NATURAL: "",
    FLAT: "b",
    SHARP: "#",
}

export const Case = {
    UPPER: "upper",
    LOWER: "lower",
}

const KeyTypes = ["Major", "Minor"];

export const Types = {
    MAJOR: "maj",
    MINOR: "min",
    DIMINISHED: "dim",
    MAJOR_SEVENTH: "maj7",
    MINOR_SEVENTH: "m7",
    DOMINANT_SEVENTH: "7",
    SIXTH: "6",
    MINOR_SIXTH: "m6",
    
}

export const TypeCase = {
   MAJOR: Case.UPPER,
   MINOR: Case.LOWER,
   DIMINISHED: Case.LOWER,
   MAJOR_SEVENTH: Case.UPPER,
   MINOR_SEVENTH: Case.LOWER,
   DOMINANT_SEVENTH: Case.UPPER,
   SIXTH: Case.UPPER,
   MINOR_SIXTH: Case.LOWER,

}

export const Numerals = {
    ONE: 'i',
    TWO: 'ii',
    THREE: 'iii',
    FOUR: 'iv',
    FIVE: 'v',
    SIX: 'vi',
    SEVEN: 'vii',
}

// generates all possible chords.
export const generateAllChordOptions = () => {
    const options = [];
    for (const note in Notes) {
        for (const accidental in AccidentalsSimple) {
            for (const type in Types) {
                const option = Notes[note] + AccidentalsSimple[accidental] + Types[type]
                options.push({ value: option, label: option});
            }
        }
    }

    return options;
}

export const generateAllKeyOptions = () => {
    const options = [];
    for (const note in Notes) {
        for (const accidental in AccidentalsSimple) {
            for (const type of KeyTypes) {
                const option = Notes[note] + AccidentalsSimple[accidental] + Types[type]
                options.push({ value: option, label: option});
            }
        }
    }

    return options;
}