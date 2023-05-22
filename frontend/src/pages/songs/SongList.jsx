import { useState, useEffect } from "react";
import { Link, Form, useLoaderData } from "react-router-dom";
import "../../styles/pages/songs/SongList.css"

const SongList = () => {

    const songs = useLoaderData();

    return ( 
        <div className="songList">
            <h2 className="songList__title">All Songs</h2>
            <Form method="get" action="/songs" className="songList__filterForm">
                <label>Search: </label>
                <input name="search"></input>
                <label>by: </label>
                <select name="by">
                    <option value="song">Song</option>
                    <option value="artist">Artist</option>
                </select>
                <button className="songList__searchButton">Search</button>
                <Link to="/songs" className="songList__clearButton">Clear</Link>
            </Form>
            <div className="songList__header">
                <p>Song</p>
                <p>Artist</p>
            </div>
            {songs.map((song) => {
                return (
                    <div key={song._id} className="songList__song">
                        <Link to={"/songs/" + song._id}>{song.name}</Link>
                        <Link to={"/songs/" + song._id}>{song.artist}</Link>
                    </div>
                )
            })}
        </div>
     );
}

export const songListLoader = async ({ request }) => {
    const url = new URL(request.url);
    console.log(url.search);
    //const response = await fetch("/api/songs/" + id);
    const response = await fetch("/api/songs" + url.search);
    
    if (!response.ok) {
        throw Error("unable to query");
    }

    return response.json()
}
 
export default SongList;
