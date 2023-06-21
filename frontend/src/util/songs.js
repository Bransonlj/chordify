import {Chord} from './classes/Chord'

export const Fields = {
    SongName: "song-name",
    Artist: "artist",
    NumSections: "num-sections",
    NumChords: "num-chords",
    SectionName: "section-name",
    Note: "note",
    Accidental: "accidental",
    Type: "type",
    SectionIndex: "section-index",
    Lyric: "lyric",

}

// in place modification of data.
export const parseSong = (data) => {
    for (const section of data.sections) {
        const keyObject = Chord.fromString(section.keyString);
        section.key = keyObject.toGenericObject()

        delete section.keyString;

        for (const chord of section.chords) {
            const chordObject = Chord.fromString(chord.chordString);
            const {note, accidental, type} = chordObject.toGenericObject()
            chord.note = note;
            chord.accidental = accidental;
            chord.type = type;

            delete chord.chordString
        }
    }

    return data;
}

// inplace modification of Chord object to chordString. Does not convert if chord object is undefined.
export const songChordToChordString = (data) => {
    for (const section of data.sections) {
        if (section.key) {
            section.keyString = section.key.note + section.key.accidental + section.key.type;

            delete section.key
        }

        for (const chord of section.chords) {
            // possibility of accidental being empty string, considered undefined.
            if (chord.note && (chord.accidental || chord.accidental === "") && chord.type) {
                chord.chordString = chord.note + chord.accidental + chord.type

                delete chord.note;
                delete chord.accidental;
                delete chord.type;
            }
        }
    }

    return data;
}