// Import sqlite3 module
const sqlite3 = require('sqlite3').verbose()

// Initialize a new database from the specified file path relative to the backend index.js (not this file)
const db = new sqlite3.Database('./data.db')

// Return a json object containing all tasks in the Task table
function getAllTasks(req, res, next) {

    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Project.Title AS ProjectTitle
               FROM Task JOIN Project
               ON Project.ProjectID = Task.ProjectID`

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

function getPersonsTasks(req, res, next) {

    if(req.params.id == -1){
        return getAllTasks(req, res, next)
    }

    // TODO: Write this query to only pull tasks for the certain user
    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Project.Title AS ProjectTitle
                FROM Task JOIN Completes JOIN Person JOIN Project
                    ON Task.TaskID = Completes.TaskID
                    AND Completes.PersonID = Person.PersonID
                    AND Project.ProjectID = Task.ProjectID
                WHERE Person.PersonID = ${req.params.id}`

    // Run the above query then call the callback given the full set of rows
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error": err.message})
            return
        }

        // Set the response to this api call as the data from the database
        res.json({
            rows
        })
    })
}

function getPeople(req, res, next) {

    // Define the query to be fun
    let sql =  `SELECT *
                FROM Person`

    // Run the above query and call the callback to return all rows as json
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error": err.message})
            return
        }

        // Set the response to be the new data
        res.json({
            rows
        })
    })
}

function getProjectTasks(req, res, next) {

    // TODO: Write this query to only pull tasks for the certain user
    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Project.Title AS ProjectTitle
                FROM Task JOIN Completes JOIN Person JOIN Project
                    ON Task.TaskID = Completes.TaskID
                    AND Completes.PersonID = Person.PersonID
                    AND Project.ProjectID = Task.ProjectID
                WHERE Person.PersonID = ${req.params.id}`

    // Run the above query then call the callback given the full set of rows
    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error": err.message})
            return
        }

        // Set the response to this api call as the data from the database
        res.json({
            rows
        })
    })
}

module.exports = { getAllTasks, getPersonsTasks, getPeople, getProjectTasks }
