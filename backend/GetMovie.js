// If the search field is empty, don't make a unnecessary request
export async function SearchMovies(searchTerm) {
    
    // If the search field is empty, don't make a unnecessary request
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }

    // Use the TMDB API to search for movies based on the search term
    try { 
        const response = await fetch(
            `${import.meta.env.VITE_TMDB_API_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&language=fi-FI`,
             
            {
                headers: {
                    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Error searching movies: ${response.status}`);
        }

        const data = await response.json();
        
        // TMDB returns an array of results in the 'results' property
        return data.results; 

    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}