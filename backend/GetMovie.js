// If the search field is empty, don't make a unnecessary request
export async function SearchMovies(searchTerm) {
    
    // If the search field is empty, don't make a unnecessary request
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }

    // Use the TMDB API to search for movies based on the search term
    try { 
        const response = await fetch(
            `${import.meta.env.VITE_TMDB_API_URL}/search/movie?query=${encodeURIComponent(searchTerm)}&language=en-US`,
             
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
        
         // Remove duplicate movies based on TMDB ID
        const uniqueResults = data.results.filter(
            (movie, index, self) =>
                index === self.findIndex(m => m.id === movie.id)
        );

        return uniqueResults;

    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}