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

export const AccidentalsSimple = {
    Natural: "",
    Flat: "b",
    Sharp: "#",
}

export const Case = {
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
    DominantSeventh: "7",
    Sixth: "6",
    MinorSixth: "m6",
    
}

export const TypeCase = {
   Major: Case.Upper,
   Minor: Case.Lower,
   Diminished: Case.Lower,
   MajorSeventh: Case.Upper,
   MinorSeventh: Case.Lower,
   DominantSeventh: Case.Upper,
   Sixth: Case.Upper,
   MinorSixth: Case.Lower,

}

export const Numerals = {
    One: 'i',
    Two: 'ii',
    Three: 'iii',
    Four: 'iv',
    Five: 'v',
    Six: 'vi',
    Seven: 'vii',
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