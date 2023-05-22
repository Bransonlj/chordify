import { useEffect, useState } from "react";
import { useLoaderData, Form, NavLink, useParams, redirect, Link } from "react-router-dom"
import { generateKeyTypeOptions, generateChordOptions, Notes, Accidentals, Types } from "../../util/chords";
import { Fields } from "../../util/songs";
import "../../styles/pages/songs/SongForm.css"
import { tryOrNull } from "../../util/Util";

/**
 * Helper function that generates a name string to represent
 * the given Section and Chord index and Name. 
 * For use as a input field name in Form to store values and retrival
 * of the respective values from the Form in Action function.
 */
const generateSectionChordName = (sectionIndex, chordIndex, field) => {
    return "section" + sectionIndex + "-chord" + chordIndex + "-" + field;
}

const generateSectionName = (sectionIndex, field) => {
    return "section" + sectionIndex + "-" + field;
}

export default function SongForm() {

    const { id } = useParams(); 
    const song = useLoaderData();

    const [sections, setSections] = useState([0]);
    const [chords, setChords] = useState([[0]]);
    const [currentId, setCurrentId] = useState(1);
    const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (song) {
            const sections = Array.from(Array(song.sections.length).keys())
            setSections(sections)
            const chords = sections.map(section => Array.from(Array(song.sections[section].chords.length).keys()))
            setChords(chords);
            setCurrentId(sections.length);
            setIsEdit(true);
        }
    }, [])

    /**
     * Deletes the chord corresponding to the supplied section and chord index.
     */
    const handleDeleteChord = (sectionIndex, chordIndex) => {
        setChords(chords.map((chordsection, iSection) => {
            return iSection !== sectionIndex 
                ? chordsection 
                : chordsection.filter((chord, iChord) => {
                    return iChord !== chordIndex
                })
        }))
    }

    const handleDeleteSection = (sectionNumber, sectionIndex) => {
        setSections(sections.filter(x => x !== sectionNumber));
        setChords(chords.filter((num, i) => i !== sectionIndex));
    }

    /**
     * Adds a chord input to the given section.
     */
    const handleAddChord = (sectionIndex) => {
        setChords(chords.map((chordsection, iChord) => {
            return iChord === sectionIndex 
                ? [...chordsection, chordsection[chordsection.length - 1] + 1] 
                : chordsection
        }))
    }

    const handleAddSection = () => {
        setSections([...sections, currentId]);
        setChords([...chords, [0]]);
        setCurrentId(currentId + 1);
    }

    const handleSwapSectionUp = (sectionIndex) => {
        const tempSections = sections.slice(0);
        const tempChords = chords.slice(0);
        const tempSection = tempSections[sectionIndex];
        const tempChord = tempChords[sectionIndex];
        tempSections[sectionIndex] = tempSections[sectionIndex - 1];
        tempSections[sectionIndex - 1] = tempSection;
        tempChords[sectionIndex] = tempChords[sectionIndex - 1];
        tempChords[sectionIndex - 1] = tempChord;
        setSections(tempSections);
        setChords(tempChords);
    }

    const handleSwapSectionDown = (sectionIndex) => {
        const tempSections = sections.slice(0);
        const tempChords = chords.slice(0);
        const tempSection = tempSections[sectionIndex];
        const tempChord = tempChords[sectionIndex];
        tempSections[sectionIndex] = tempSections[sectionIndex + 1];
        tempSections[sectionIndex + 1] = tempSection;
        tempChords[sectionIndex] = tempChords[sectionIndex + 1];
        tempChords[sectionIndex + 1] = tempChord;
        setSections(tempSections);
        setChords(tempChords);
    }

    /**
     * Generates individual React chord components from given section and chord params.
     * chord components consist of input fields for note, accidental and type,
     * and handler to delete itself.
     */
    const chordComponent = (section, sectionIndex, chord, chordIndex) => {
        return (
            <div key={ section + "-" + chord } className="songForm__chordContainer">
                <div className="songForm__chordLyric">
                    <div>
                        <label>Chord: </label>
                        <select 
                            name={ generateSectionChordName(sectionIndex, chordIndex, Fields.Note) } 
                            defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].chords[chordIndex].note) }
                        >
                            { generateChordOptions(Notes) }
                        </select>
                        <select 
                            name={ generateSectionChordName(sectionIndex, chordIndex, Fields.Accidental) } 
                            defaultValue={ song && tryOrNull(() =>song.sections[sectionIndex].chords[chordIndex].accidental ?? null) }
                        >
                            { generateChordOptions(Accidentals) }
                        </select>
                        <select 
                            name={ generateSectionChordName(sectionIndex, chordIndex, Fields.Type) } 
                            defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].chords[chordIndex].type) }
                        >
                            { generateChordOptions(Types) } 
                        </select>
                    </div>
                    <div className="songForm__lyric">
                        <label>Lyric: </label>
                        <input 
                            name={ generateSectionChordName(sectionIndex, chordIndex, Fields.Lyric) } 
                            defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].chords[chordIndex].lyric) }
                            className="songForm__lyricInput"
                        />
                    </div>
                </div>
                { chords[sectionIndex].length <= 1 
                    ? null 
                    : (<label onClick={ () => handleDeleteChord(sectionIndex, chordIndex) } className="songForm__deleteChordButton">Delete chord</label>)
                }
            </div>
        )
    }

    /**
     * Generates individual React section component from given section params.
     * section components consists of name and key{name, accidental, type[major/minor]}
     * and chord components for each chord it holds.
     * It has handlers to delete itself and add chord component.
     */
    const sectionComponent = (section, sectionIndex) => {
        return (
            <div key={ section } className="songForm__sectionContainer">
                <div className="songForm__sectionHeader">
                    <div className="songForm__sectionName">
                        <label>Section name: </label>
                        <input name={ generateSectionName(sectionIndex, Fields.SectionName) } required={ section === 0 } defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].name) }></input>
                    </div>
                    <div className="songForm__sectionKey"> 
                        <label>Key</label>
                        <select name={ generateSectionName(sectionIndex, Fields.Note) } defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].key.note) }>
                            { generateChordOptions(Notes) }
                        </select>
                        <select name={ generateSectionName(sectionIndex, Fields.Accidental) } defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].key.accidental) }>
                            { generateChordOptions(Accidentals) }
                        </select>
                        <select name={ generateSectionName(sectionIndex, Fields.Type) } defaultValue={ song && tryOrNull(() => song.sections[sectionIndex].key.type) }>
                            { generateKeyTypeOptions() }
                        </select>
                    </div>
                </div>
                <div className="songForm__sectionButtonContainer">
                    <label onClick={ () => handleAddChord(sectionIndex) } className="songForm__addChord">Add chord</label>

                    <div className="songForm__changeSectionButtonsContainer">
                        { sectionIndex < 1 
                            ? null
                            : (<label onClick={ () => handleSwapSectionUp(sectionIndex) }>Move Up</label>)
                        }
                        { sectionIndex >= sections.length - 1
                            ? null
                            : (<label onClick={ () => handleSwapSectionDown(sectionIndex) }>Move Down</label>)
                        }
                        { sections.length <= 1 
                            ? null 
                            : (<label onClick={ () => handleDeleteSection(section, sectionIndex) }>Delete Section</label>)
                        }
                    </div>
                </div>
                { chords[sectionIndex].map((chord, chordIndex) => chordComponent(section, sectionIndex, chord, chordIndex)) }
                <input name={ generateSectionName(sectionIndex, Fields.NumChords) } type="hidden" value={ chords[sectionIndex].length }></input>
            </div>
        )
    }

  return (
    <div className="songForm">
        <Form method={ isEdit ? "PATCH" : "POST" } action={ isEdit ? `/songs/edit/${id}` : "/songs/create"} className="songForm__form">
            <label>Song name</label>
            <input name={Fields.SongName} defaultValue={ song && song.name }/>
            <label>Artist</label>
            <input name={Fields.Artist} defaultValue={ song && song.artist }/>
            { sections.map(sectionComponent) }

            <div className="songForm__songButtons">
                <label onClick={ () => handleAddSection() } className="songForm__addSection">Add Section</label>
                { isEdit && <Link to={`/songs/${id}`}>Cancel</Link>}
                <button className="songForm__submitButton">{ isEdit ? "Save" : "Add" }</button>
            </div>
            <input type="hidden" name={Fields.NumSections} value={sections.length} />
        </Form>

    </div>
  )
}


export const SongFormAction = async ({ params, request }) => {
    const { id } = params;
    const data = await request.formData();
    const numsections = data.get(Fields.NumSections);

    const sectionsID = []

    for (let i = 0; i < numsections; i++) {
        sectionsID.push(i);
    }

    // Create Song sections object array
    const sections = sectionsID.map(section => {
        const numChords = data.get(generateSectionName(section, Fields.NumChords));
        const chordsID = []
        for (let i = 0; i < numChords; i++) {
            chordsID.push(i)
        }
        // For each section, create chords object array
        const chords = chordsID.map(chord => {
            return {
                note: data.get(generateSectionChordName(section, chord, Fields.Note)),
                accidental: data.get(generateSectionChordName(section, chord, Fields.Accidental)),
                type: data.get(generateSectionChordName(section, chord, Fields.Type)),
                lyric: data.get(generateSectionChordName(section, chord, Fields.Lyric))
            }
        })
        return {
            name: data.get(generateSectionName(section, Fields.SectionName)),
            key: {
                note: data.get(generateSectionName(section, Fields.Note)),
                accidental: data.get(generateSectionName(section, Fields.Accidental)),
                type: data.get(generateSectionName(section, Fields.Type)),
            },
            chords: chords,
        };
    })

    // Create and post Song object
    const songDetails = {
        name: data.get(Fields.SongName),
        artist: data.get(Fields.Artist),
        sections: sections,
    }

    if (request.method === "POST") {
        const response = await fetch("/api/songs/", {
            method: "POST",
            body: JSON.stringify(songDetails),
            headers: {
                "Content-Type": 'application/json'
            }
        })
        if (!response.ok) {
            throw Error("unable to add song");
        }
    
        return redirect('/songs/list');

    } else if (request.method === "PATCH") {
        const response = await fetch("/api/songs/" + id, {
            method: "PATCH",
            body: JSON.stringify(songDetails),
            headers: {
                "Content-Type": 'application/json'
            }
        })
        if (!response.ok) {
            throw Error("unable to add song");
        }
    
        return redirect('/songs/' + id);
    }


}
