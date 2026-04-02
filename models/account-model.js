const pool = require("../database/")

/* *****************************
* Get account by email
* ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT * FROM account WHERE account_email = $1",
      [account_email]
    )
    return result.rows[0] || null // ✅ ALWAYS return object or null
  } catch (error) {
    console.error("getAccountByEmail error:", error)
    return null // ✅ NEVER return a string
  }
}

/* *****************************
* Register new account
* ***************************** */
async function registerAccount(
  account_firstname,
  account_lastname,
  account_email,
  account_password
) {
  try {
    const sql = `
      INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password,
        account_type
      )
      VALUES ($1, $2, $3, $4, 'Client')
      RETURNING *
    `

    const result = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password
    ])

    return result.rows[0]
  } catch (error) {
    console.error("registerAccount error:", error)
    return null
  }
}

/* *****************************
* Check if email exists
* ***************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT 1 FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [account_email])

    return result.rowCount > 0
  } catch (error) {
    console.error("checkExistingEmail error:", error)
    return false
  }
}

module.exports = {
  getAccountByEmail,
  registerAccount,
  checkExistingEmail
}