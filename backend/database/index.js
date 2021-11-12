// Import sqlite3 module
const sqlite3 = require('sqlite3').verbose()

// Initialize a new database from the specified file path relative to the backend index.js (not this file)
const db = new sqlite3.Database('./data.db')

// Return a json object containing all tasks in the Task table
function getAllTasks(req, res, next) {

    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Task.ProjectID, Project.Title AS ProjectTitle, Completes.PersonID
                FROM Task LEFT NATURAL JOIN Completes LEFT JOIN Project
                ON Task.ProjectID = Project.ProjectID`

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

// Return all tasks assigned to the specified person. This person should be passed to the request as a parameter called id
function getPersonsTasks(req, res, next) {

    if(req.params.id == -1){
        return getAllTasks(req, res, next)
    }

    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Task.ProjectID, Project.Title AS ProjectTitle, Completes.PersonID
                FROM Completes JOIN Task
                ON Completes.TaskID = Task.TaskID
                LEFT JOIN Project
                ON Task.ProjectID = Project.ProjectID
                WHERE Completes.PersonID = ${req.params.id}`

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

// Add a new task to the database
function addTask(req, res, next) {
    const newObject = req.body

    console.log(newObject)

    // Prepare the sql statement to be run.
    var statement = db.prepare("INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES (?, ?, ?, ?, ?)")

    // Run the statement with the given parameters and define a callback to fun on completion
    statement.run(newObject.title, newObject.completion, newObject.dueDate, newObject.creationDate, newObject.projectID, function (error, result) {
        // This callback function will assign the newly created task to the correct person, if needed

        // Grab the id of the task that was just created.
        const newTaskID = this.lastID

        // If the newTaskID is defined and the assignee of the new task is not -1, then run another sql statement to add the assignment tuple to the Completes table
        if(newTaskID && newObject.assignee != -1){
            var assignStatement = db.prepare("INSERT INTO Completes (DateAssigned, TaskID, PersonID) VALUES (?, ?, ?)")
            assignStatement.run((new Date().getTime() / 1000), newTaskID, newObject.assignee)
            assignStatement.finalize()
        }
    })

    statement.finalize()

    // Return a success statement
    // BUG: Figure out how to return a failure statement here if the queries failed
    res.send("Success")
}

// Update the passed task object in the database
function updateTask(req, res, next) {
    // The object to update
    const updatedObject = req.body

    console.log(updatedObject)

    // Prep the sql statement and run it with the specified parameters
    // HACK: Rebuild this to be able to handle only receiving the information that needs to change
    var statement = db.prepare(`UPDATE Task 
                                SET Completion = ?, DueDate = ?, ProjectID = ?, Title = ?
                                WHERE TaskID = ?`)
    statement.run(updatedObject.completion, updatedObject.dueDate, updatedObject.projectID, updatedObject.title, updatedObject.taskID)

    statement.finalize()

    // Return a success statement
    // BUG: Figure out how to return a failure statement here if the queries failed
    res.send("Success")
}

// Mark the task as complete
// HACK: Integrate this into the updateTask function
function markCompleted(req, res) {
    const updatedObject = req.body

    var statement = db.prepare(`UPDATE Task
                                SET Completion = ?
                                WHERE TaskID = ?`)
    statement.run(updatedObject.completion, req.params.id)

    statement.finalize()

    // Return a success statement
    // BUG: Figure out how to return a failure statement here if the queries failed
    res.send("Success")
}

// Delete the specified task from the database
function deleteTask(req, res, next) {
    // Prep the sql statement to be run
    var statement = db.prepare(`DELETE FROM Task
                                WHERE TaskID = ?`)

    // Run the query with the passed id parameter
    statement.run(req.params.id)

    // BUG: Check for errors here before returning success
    res.send("Success")
}

// Return all people from the database
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

// Return all projects from the database
function getProjects(req, res, next) {

    // Define the query to be fun
    let sql =  `SELECT *
                FROM Project`

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

// Return all tasks that are a part of the specified project
function getProjectTasks(req, res, next) {

    // Define the query to be run
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Project.Title AS ProjectTitle, Project.ProjectID
                FROM Task JOIN Project
                ON Task.ProjectID = Project.ProjectID
                WHERE Project.ProjectID =  ${req.params.id}`

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

// Return a json object containing all projects in the project table
function getIncompleteProjects(req, res, next) {

    // Query returns a list of all project that still have tasks remaining
    // HACK: Why does this group by Title and not ProjectID?
    let sql = `SELECT Project.Title AS ProjectTitle, Project.DueDate, count(TaskID) as TaskCount
                  FROM Project JOIN Task
                    ON Project.ProjectID = Task.ProjectID
                  GROUP BY Project.ProjectID
                  HAVING Task.Completion = 0` // HACK: Will this work to check like that? I'm guessing it's not going to do what we want

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

module.exports = { getAllTasks, getPersonsTasks, getPeople, getProjects, getProjectTasks, getIncompleteProjects, addTask, updateTask, deleteTask, markCompleted }
