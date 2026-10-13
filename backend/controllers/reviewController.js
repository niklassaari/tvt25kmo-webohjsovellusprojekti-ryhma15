import {
  addReview,
  fetchReviews,
  deleteReview
} from "../models/reviewmodel.js";

export async function postReview(req, res) {


  // Adds a review to the database
  const { movie_id, rating, comment } = req.body; //  stores the user's and the movie's ID
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


// Fetches all the reviews for the selected movie

export async function getReviews(req, res) {
  const { movie_id } = req.params;

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

export async function removeReview(req, res) {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const result = await deleteReview(reviewId, userId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        error: "Review not found or insufficient permissions"
      });
    }

    res.json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({
      error: "Failed to delete review"
    });
  }
}

