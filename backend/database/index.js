const mariadb = require('mariadb')

const pool = mariadb.createPool({
    host: 'localhost',
    user: 'appuser',
    password: 'AppUser123@',
    connectionLimit: 5,
    database: 'task_data'
})

// Return a json object containing all tasks in the Task table
async function getAllTasks(req, res, next) {

    // Define the query to be run
    // TODO: Allow the user to specify the ordering
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Task.ProjectID, Project.Title AS ProjectTitle, Completes.PersonID 
                FROM Task LEFT JOIN Completes ON Task.TaskID = Completes.TaskID 
                LEFT JOIN Project ON Task.ProjectID = Project.ProjectID 
                ORDER BY Task.DueDate ASC`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all tasks assigned to the specified person. This person should be passed to the request as a parameter called id
async function getPersonsTasks(req, res, next) {

    if(req.params.id == -1){
        return getAllTasks(req, res, next)
    }

    // Define the query to be run
    // TODO: Allow the user to specify the ordering
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Task.ProjectID, Project.Title AS ProjectTitle, Completes.PersonID
                FROM Completes JOIN Task ON Completes.TaskID = Task.TaskID
                LEFT JOIN Project ON Task.ProjectID = Project.ProjectID
                WHERE Completes.PersonID = ${req.params.id}
                ORDER BY Task.DueDate ASC`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Add a new task to the database
async function addTask(req, res, next) {
    const newObject = req.body

    // Prepare the sql statement to be run.
    var sql = `INSERT INTO Task (Title, Completion, DueDate, CreationDate, ProjectID) VALUES (?, ?, ?, ?, ?)`
    var assignSQL = `INSERT INTO Completes (DateAssigned, PersonID, TaskID) VALUES (?, ?, ?)`

    // Add the new task and return the response
    let conn;
    try {
        conn = await pool.getConnection();
        let result;

        if(newObject.projectID == -1){
            result = await conn.query(sql, [newObject.title, newObject.completion, newObject.dueDate, newObject.creationDate, null]);
        } else {
            result = await conn.query(sql, [newObject.title, newObject.completion, newObject.dueDate, newObject.creationDate, newObject.projectID]);
        }

        if(result.affectedRows > 0) {
            let newTaskID = result.insertId
            
            if(newObject.assignee != -1){
                result = await conn.query(assignSQL, [new Date().getTime()/1000, newObject.assignee, newTaskID])
            }

        }

        // Return a success statement
        res.send("Success")
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Update the passed task object in the database
// TODO: Ensure all these statements run as a transaction so we don't end up with inconsistencies
async function updateTask(req, res, next) {
    // The object to update
    const updatedObject = req.body

    // Prep the sql statement and run it with the specified parameters
    // HACK: Rebuild this to be able to handle only receiving the information that needs to change
    var sql1 = `UPDATE Task
                    SET Completion = ?, DueDate = ?, ProjectID = ?, Title = ?
                    WHERE TaskID = ?`

    // Update the completes table with the new assignee
    var sql2 = `UPDATE Completes
                    SET DateAssigned = ?, PersonID = ?
                    WHERE TaskID = ?`

    var deleteSql = `DELETE FROM Completes
                        WHERE TaskID = ?`

    var addSql = `INSERT INTO Completes (DateAssigned, PersonID, TaskID) VALUES (?, ?, ?)`

    // Update the specified task and send the response
    let conn;
    try {
        conn = await pool.getConnection();
        let result;

        if(updatedObject.projectID == -1){
            result = await conn.query(sql1, [updatedObject.completion, updatedObject.dueDate, null, updatedObject.title, updatedObject.taskID]);
        } else {
            result = await conn.query(sql1, [updatedObject.completion, updatedObject.dueDate, updatedObject.projectID, updatedObject.title, updatedObject.taskID]);
        }

        if(result.affectedRows > 0){
            // If we are unassigning a person, then we need to remove the tuple from the completes table
            if(updatedObject.personID == -1){
                result = await conn.query(deleteSql, [updatedObject.taskID])
            } else {
                result = await conn.query(sql2, [new Date().getTime() / 1000, updatedObject.personID, updatedObject.taskID])
                
                // If that didn't affect any rows, then we actually need to add a new tuple to the table
                if(result.affectedRows == 0){
                    result = await conn.query(addSql, [new Date().getTime() / 1000, updatedObject.personID, updatedObject.taskID])
                }
            }
        }

        // Return a success statement
        res.send("Success")
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }

}

// Mark the task as complete
async function markCompleted(req, res) {
    const updatedObject = req.body

    var sql = `UPDATE Task
                SET Completion = ?
                WHERE TaskID = ?`

    // Mark the specified task as completed and then send the response
    let conn;
    try {
        conn = await pool.getConnection();
        let result = await conn.query(sql, [updatedObject.completion, req.params.id]);

        // Return a success statement
        res.send("Success")
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Delete the specified task from the database
async function deleteTask(req, res, next) {
    // Prep the sql statement to be run
    var sql1 = `DELETE FROM Task
                    WHERE TaskID = ?`
    
    var sql2 = `DELETE FROM Completes
                    WHERE TaskID = ?`

    // Delete the specified task then send the response
    let conn;
    try {
        conn = await pool.getConnection();
        // TODO: Run these as a transaction
        let result = await conn.query(sql2, [req.params.id]);
        result = await conn.query(sql1, [req.params.id])

        // Return a success statement
        res.send("Success")
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all people from the database
async function getPeople(req, res, next) {

    // Define the query to be fun
    let sql =  `SELECT *
                FROM Person`

    // Run the above query and call the callback to return all rows as json
    let conn;
    try {
        conn = await pool.getConnection();
        let result = await conn.query(sql, [req.params.id]);

        // Return a success statement
        res.send("Success")
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all projects from the database
async function getProjects(req, res, next) {

    // Define the query to be run
    let sql =  `SELECT *
                FROM Project`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all departments from the database
async function getDepartments(req, res, next) {
    // Define the query to be run
    let sql = `SELECT *
                FROM Department`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all tasks that are a part of the specified project
async function getProjectTasks(req, res, next) {

    // Define the query to be run
    // TODO: Allow the user to specify the ordering
    let sql = `SELECT Task.TaskID, Task.Title, Task.Completion, Task.DueDate, Task.CreationDate, Project.Title AS ProjectTitle, Project.ProjectID
                FROM Task JOIN Project
                ON Task.ProjectID = Project.ProjectID
                WHERE Project.ProjectID =  ${req.params.id}
                ORDER BY Task.DueDate ASC`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all projects and a count of their remaining tasks
async function getProjectOverview(req, res, next) {

    // Define the query to be run
    let sql = ` SELECT Project.Title, count(Task.Completion)-sum(Task.Completion) AS TaskRemaining, Project.DueDate
                FROM Project LEFT JOIN Task
                ON Project.ProjectID = Task.ProjectID
                GROUP BY Project.ProjectID
                ORDER BY Project.DueDate ASC `

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return all people who have done work for the given dept
async function getDepartmentPeople(req, res, next) {

    // Define the query to be run
    let sql = ` SELECT Person.FirstName, Person.LastName, Person.JobRole
                FROM Person JOIN Completes JOIN Task JOIN Project JOIN Houses
                  ON Person.PersonID = Completes.PersonID
                  AND Completes.TaskID = Task.TaskID
                  AND Task.ProjectID = Project.ProjectID
                  AND Project.ProjectID = Houses.ProjectID
                WHERE Houses.DeptID = ${req.params.id}
                GROUP BY Person.PersonID
                ORDER BY Person.LastName `


    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Return a json object containing all projects with tasks that are incomplete
async function getIncompleteProjects(req, res, next) {

    // Query returns a list of all project that still have tasks remaining
    // TODO: Find a way to implement this into the frontend
    let sql = `SELECT Project.Title AS ProjectTitle, Project.DueDate, count(TaskID) as TaskCount
                  FROM Project JOIN Task
                    ON Project.ProjectID = Task.ProjectID
                  GROUP BY Project.ProjectID
                  HAVING Task.Completion = 0` // HACK: Will this work to check like that? I'm guessing it's not going to do what we want

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

// Get all users whose tasks are all completed or who has no tasks assigned
async function getFreeUsers(req, res){

    var toReturn = []

    // Get all users whose tasks are all completed
    let sql1 = `SELECT User.PersonID, User.FirstName, User.LastName, User.JobRole, User.Completion
                FROM (SELECT Person.PersonID, FirstName, LastName, JobRole, Task.Completion
                    FROM Person JOIN Completes ON Person.PersonID = Completes.PersonID
                    JOIN Task ON Task.TaskID = Completes.TaskID
                    GROUP BY PersonID, Completion
                    ORDER BY Completion ASC) AS User
                GROUP BY User.PersonID
                HAVING User.Completion = 1`

    // Get people with no tasks assigned
    let sql2 = `SELECT Person.PersonID, FirstName, LastName, JobRole
                FROM Person LEFT JOIN Completes ON Person.PersonID = Completes.PersonID
                WHERE TaskID IS NULL`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        let rows = await conn.query(sql1);

        // Add the results of the first query to the array to return
        rows.forEach(row => {
            toReturn.push(row)
        });

        rows = await conn.query(sql2);

        // Add the results of the first query to the array to return
        rows.forEach(row => {
            toReturn.push(row)
        });

        res.json({
            "rows": toReturn
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }

}

// Get the user that has completed the most tasks
async function getBestUser(req, res){

    let sql = `SELECT User.PersonID, User.FirstName, User.LastName, User.JobRole, User.CompletedTasks
                FROM (SELECT Person.PersonID, FirstName, LastName, JobRole, Count(*) AS CompletedTasks
                    FROM Person JOIN Completes ON Person.PersonID = Completes.PersonID
                    JOIN Task ON Completes.TaskID = Task.TaskID
                    WHERE Completion = 1
                    GROUP BY Person.PersonID) AS User
                ORDER BY User.CompletedTasks DESC
                LIMIT 1`

    // Run the above query then set the response to the result set of the query
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(sql);
        res.json({
            rows
        })
    } catch (err){
        res.status(400).json({"error":err.message})
        throw err;
    } finally {
        if (conn) return conn.end()
    }
}

module.exports = { getAllTasks, getPersonsTasks, getPeople, getProjects, getDepartments, getProjectTasks, getIncompleteProjects, addTask, updateTask, deleteTask, markCompleted, getFreeUsers, getBestUser, getProjectOverview, getDepartmentPeople }
