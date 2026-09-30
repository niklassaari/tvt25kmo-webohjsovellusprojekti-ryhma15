import {
    addReview,
    fetchReviews
} from "../models/reviewmodel.js";

export async function postReview(req, res) {
// lisää arvostelun tietokantaan
    const { movie_id, rating, comment } = req.body; // nää ottaa käyttäjän id ja sit ton elokuvan id talteen
    const userId = req.user.id;

   try {
        await addReview(userId, movie_id, rating, comment);

        res.status(201).json({
            message: 'review created successfully'
        });

    } catch (error) {
        console.error('error when creating review', error);
        res.status(500).json({
            error: 'database error'
        });
    }
}

// hakee kaikki elokuvan arvostelut

export async function getReviews(req, res) {
    const {movie_id} = req.params;
    
     try {
        const reviews = await fetchReviews(movie_id);

        res.status(200).json(reviews.rows);

    } catch (error) {
        console.error('error when getting reviews', error);
        res.status(500).json({
            error: 'database error'
        });
    }
}

