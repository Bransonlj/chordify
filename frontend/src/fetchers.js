const { useState } = require("react")

const useFetchSong = async (id) => {
    const [song, setSong] = useState(null);
    const [error, setError] = useState(null);

    fetch("/api/songs/" + id)
        .then(result => result.json())
        .then(result => setSong(result))
        .catch(error => setError(error.message));

    return { song, error };
}

export default useFetchSong;