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
        const keyObject = Chord.create(section.keyString);
        section.key = {
            note: keyObject.note,
            accidental: keyObject.accidental,
            type: keyObject.type,
        };
        delete section.keyString;

        for (const chord of section.chords) {
            const chordObject = Chord.create(chord.chordString);
            chord.note = chordObject.note;
            chord.accidental = chordObject.accidental;
            chord.type = chordObject.type;
            delete chord.chordString
        }
    }

    return data;
}
