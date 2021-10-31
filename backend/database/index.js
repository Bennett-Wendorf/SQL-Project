// Import sqlite3 module
const sqlite3 = require('sqlite3').verbose()

// Initialize a new database from the specified file path relative to the backend index.js (not this file)
const db = new sqlite3.Database('./data.db')

// Return a json object containing all tasks in the Task table
function getTasks(req, res, next) {

    // Define the query to be run
    let sql = `SELECT *
               FROM Task`

    // Run the above query and then call the callback function given the full set of rows
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message})
            return
        }
        // Set the response to this api call as the data from the database
        res.json({
            rows
        })
    })
}

module.exports = { getTasks }