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

async function getAccountByEmail(email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const result = await pool.query(sql, [email])
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

async function updateAccount(id, firstname, lastname, email) {
  const sql = `
    UPDATE account
    SET account_firstname = $1,
        account_lastname = $2,
        account_email = $3
    WHERE account_id = $4
    RETURNING *`

  const result = await pool.query(sql, [firstname, lastname, email, id])
  return result.rows[0]
}

async function updatePassword(id, password) {
  const sql = `
    UPDATE account
    SET account_password = $1
    WHERE account_id = $2
    RETURNING *`

  const result = await pool.query(sql, [password, id])
  return result.rows[0]
}

async function getAccountById(account_id) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_id = $1",
    [account_id]
  )
  return result.rows[0]
}

async function getAccountById(account_id) {
  const result = await pool.query(
    "SELECT * FROM account WHERE account_id = $1",
    [account_id]
  )
  return result.rows[0]
}

module.exports = {
  getAccountByEmail,
  registerAccount,
  checkExistingEmail,
  updateAccount,
  updatePassword,
  getAccountById 
}