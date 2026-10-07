export async function SearchMovies(searchTerm, genre, year, type, page = 1) {
    try {
        const params = new URLSearchParams();

        if (searchTerm && searchTerm.trim() !== '') {
            params.append('q', searchTerm.trim());
        }

        if (genre) {
            params.append('genre', genre);
        }

        if (year) {
            params.append('year', year);
        }

        if (type) {
            params.append('type', type);
        }
        // page parametri hakee ns. seuraavan "sivun" hakutuloksia    
        params.append('page', page);
        

        const response = await fetch(
            `/api/movies/search?${params.toString()}`
        );

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