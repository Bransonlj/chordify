import React, { useState } from "react";
import { useLoaderData, useNavigate, useParams, NavLink } from "react-router-dom";
import { displayChord, convertChordToNumerals } from "../../util/chords";
import "../../styles/pages/songs/SongDetail.css"
import { Chord } from "../../util/classes/Chord";

const ChordDetails = ({ chord, keyObject, isViewNumbers }) => {
    const chordObject = new Chord(chord.note, chord.accidental, chord.type);

    return (
        <div className="songDetails__chordLyric">
            <p className="songDetails__chord">{ isViewNumbers ? chordObject.displayChordNumeric(keyObject) : chordObject.displayChordAlphabetic() }</p>
            <p className="songDetails__lyric">{ chord.lyric }</p>
        </div>
    )
}

const SectionDetails = ({ section, isViewNumbers }) => {
    const keyObject = new Chord(section.key.note, section.key.accidental, section.key.type);

    return (
        <div key={ section._id } className="songDetails__section">
            <div className="songDetails__sectionHeader">
                <h4>{ section.name }</h4>
                <p>key: { keyObject.displayChordAlphabetic() }</p>
            </div>
            <div className="songDetails__chordContainer">
                { section.chords.map(chord => (
                    <>
                        <ChordDetails key={chord.id} chord={chord} keyObject={keyObject} isViewNumbers={isViewNumbers} />
                    </>
                )) } 
            </div>
        </div>
    )
}

const SongDetails = () => {

    const { id } = useParams();

    const [isViewNumbers, setIsViewNumbers] = useState(false);

    const song = useLoaderData();

    const navigate = useNavigate();

    const deleteSong = async () => {
        const response = await fetch("/api/songs/" + song._id, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw Error("unable to delete");
        }
        
        navigate("/songs/list");
    }

    const viewChordLetter = (chord) => {

        return (
            <div key={ chord._id } className="songDetails__chordLyric">
                <p className="songDetails__chord">{ displayChord(chord.note, chord.accidental, chord.type) }</p>
                <p className="songDetails__lyric">{ chord.lyric }</p>
            </div>
        )
    }

    const viewChordNumbers = (chord, section) => {
        return (
            <div key={ chord._id } className="songDetails__chordLyric">
                <p className="songDetails__chord">{ convertChordToNumerals(chord.note, chord.accidental, chord.type, section.key.note, section.key.accidental, section.key.type) }</p>
                <p className="songDetails__lyric">{ chord.lyric }</p>
            </div>
        )
    }

    const displaySection = (section, sectionIndex) => {
        const keyObject = new Chord(section.key.note, section.key.accidental, section.key.type);
        return (
            <div key={ section._id } className="songDetails__section">
                <div className="songDetails__sectionHeader">
                    <h4>{ section.name }</h4>
                    <p>key: { keyObject.displayChordAlphabetic() }</p>
                </div>
                <div className="songDetails__chordContainer">
                    { section.chords.map(chord => (
                        <ChordDetails chord={chord} keyObject={keyObject} isViewNumbers={isViewNumbers} key={chord.id}/>
                    )) } 
                </div>
            </div>
        )
    }

    return ( 
        <div>
            {song && <div className="songDetails">
                        <div className="songDetails__header">
                            <h2 className="songDetails__songName">{ song.name }</h2>
                            <p className="songDetails__artist">Artist: { song.artist } </p>
                        </div>
                        <div className="songDetails__songSettings">
                            
                            <label onClick={() => setIsViewNumbers(!isViewNumbers)} className="songDetails__toggleView">Toggle Chord View</label>
                            <NavLink to={`/songs/edit/${id}`} className="songDetails__editButton">edit</NavLink>
                            <button onClick={deleteSong} className="songDetails__deleteButton">Delete</button>
                        </div>
                        { song.sections.map(section => (
                            <>
                                <SectionDetails key={section.id} section={section} isViewNumbers={isViewNumbers} />
                            </>
                        )) }
                        
                    
            </div>}
        

        </div>
     );
}

export const songDetailsLoader = async ({ params }) => {
    const { id } = params;
    const response = await fetch("/api/songs/" + id);
    if (!response.ok) {
        throw Error('Could not fetch data');
    }

    return response.json();
}

export default SongDetails;