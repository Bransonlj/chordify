import React, { useState } from "react";
import { useLoaderData, useNavigate, useParams, NavLink } from "react-router-dom";
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
                        <ChordDetails key={chord._id} chord={chord} keyObject={keyObject} isViewNumbers={isViewNumbers} />
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
        if (window.confirm("Delete song?")) {
            const response = await fetch("/api/songs/" + song._id, {
                method: "DELETE",
            });
    
            if (!response.ok) {
                throw Error("unable to delete");
            }
            navigate("/songs/list");
        }
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
                                <SectionDetails key={section._id} section={section} isViewNumbers={isViewNumbers} />
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