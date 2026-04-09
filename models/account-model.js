const pool = require("../database/");

async function getAccountByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_email = $1",
    [email],
  );
  return result.rows[0];
}

async function registerAccount(first, last, email, password) {
  const sql = `
    INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type)
    VALUES ($1,$2,$3,$4,'Client') RETURNING *`;
  const result = await pool.query(sql, [first, last, email, password]);
  return result.rows[0];
}

async function checkExistingEmail(email) {
  const result = await pool.query(
    "SELECT 1 FROM account WHERE account_email=$1",
    [email],
  );
  return result.rowCount > 0;
}

async function updateAccount(id, first, last, email) {
  const result = await pool.query(
    `UPDATE account SET account_firstname=$1, account_lastname=$2, account_email=$3
     WHERE account_id=$4 RETURNING *`,
    [first, last, email, id],
  );
  return result.rows[0];
}

async function updatePassword(id, password) {
  const result = await pool.query(
    `UPDATE account SET account_password=$1 WHERE account_id=$2 RETURNING *`,
    [password, id],
  );
  return result.rows[0];
}

async function getAccountById(id) {
  const result = await pool.query("SELECT * FROM account WHERE account_id=$1", [
    id,
  ]);
  return result.rows[0];
}

module.exports = {
  getAccountByEmail,
  registerAccount,
  checkExistingEmail,
  updateAccount,
  updatePassword,
  getAccountById,
};
