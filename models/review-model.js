const pool = require("../database");

/* ***************************
 * Add Review
 *************************** */
async function addReview(review_text, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO reviews (review_text, inv_id, account_id)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(sql, [review_text, inv_id, account_id]);

    return result.rows[0]; // ✅ return single inserted review
  } catch (error) {
    console.error("addReview error:", error);
    return null; // ✅ prevents crashes in controller
  }
}

/* ***************************
 * Get Reviews by Inventory ID
 *************************** */
async function getReviewsByInvId(inv_id) {
  try {
    const sql = `
      SELECT 
        r.review_id,
        r.review_text,
        r.review_date,
        r.inv_id,
        r.account_id,
        a.account_firstname,
        a.account_lastname
      FROM reviews r
      JOIN account a 
        ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `;

    const result = await pool.query(sql, [inv_id]);

    return result.rows; // ✅ return array (IMPORTANT)
  } catch (error) {
    console.error("getReviews error:", error);
    return []; // ✅ always return array (prevents EJS crash)
  }
}

module.exports = {
  addReview,
  getReviewsByInvId,
};
