const express = require('express')
const app = express()
const cors = require('cors')
const options = {cors: {origin: "*",},};
const { getAllTasks, getPersonsTasks, getPeople, getProjects, getProjectTasks, addTask, updateTask, deleteTask } = require('./database')

// Define the port to run the backend on as the enviroment variable for port, or 3500 if that variable is not defined
const PORT = process.env.PORT || 3500;

// Ensure the express app uses these modules
app.use(cors())
app.use(express.json())

// Get all tasks on get request or add a new task on post
app.route('/api/tasks')
    .get(getAllTasks)
    .post(addTask);

// Update the existing task with the specified id
app.put('/api/tasks/:id', updateTask)

// Delete the task with the specified id
app.delete('/api/tasks/delete/:id', deleteTask)

// Get all tasks assigned to the person with the specified id
app.get(`/api/tasks/person/:id`, getPersonsTasks)

// Get all people
app.get('/api/people', getPeople)

// Get all projects
app.get('/api/projects', getProjects)

// Get all tasks part of the project with the specified id
app.get('/api/tasks/project/:id', getProjectTasks)

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})
