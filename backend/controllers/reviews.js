export const getGoogleReviews = async (req, res) => {
  const GOOGLE_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
  const GOOGLE_PLACE_ID = process.env.REACT_APP_GOOGLE_PLACE_ID;

  try {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&key=${GOOGLE_API_KEY}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.result?.reviews) {
      res.status(200).json({ reviews: data.result.reviews });
    } else {
      res.status(200).json({ reviews: [] });
    }
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    res.status(500).json({ error: "Internal server error." });
  }
};
