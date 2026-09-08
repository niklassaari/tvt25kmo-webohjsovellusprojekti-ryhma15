async function GetMovie(movie_id) {
    try {
        const response = await fetch(`${import.meta.env.VITE_TMDB_API_URL}/movie/${movie_id}`, {
            headers: {
                'Authorization': `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
            }
        });
        const data = await response.json();
        
        return data;
    }   catch (error) {
        console.error('Error fetching movie:', error);
        throw error;
    }
}

GetMovie(123); 