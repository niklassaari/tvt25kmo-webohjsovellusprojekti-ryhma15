export async function SearchMovies(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        return [];
    }

    try {
        // calls backend
        const response = await fetch(`/api/movies/search?q=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            throw new Error(`Error searching movies: ${response.status}`);
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
}