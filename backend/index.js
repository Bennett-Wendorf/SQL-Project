const express = require('express')
const app = express()
const cors = require('cors')
const helmet = require('helmet')
const options = {cors: {origin: "*",},};
const { getAllTasks, getPersonsTasks, getPeople, getProjects, getDepartments, getProjectTasks, addTask, updateTask, deleteTask, markCompleted, getFreeUsers, getBestUser, getProjectOverview, getDepartmentPeople } = require('./database')

// Define the port to run the backend on as the enviroment variable for port, or 8080 if that variable is not defined
const PORT = process.env.PORT || 8080;

// Ensure the express app uses these modules
app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(helmet({
    contentSecurityPolicy: false,
}))

// Get all tasks on get request or add a new task on post
app.route('/api/tasks')
    .get(getAllTasks)
    .post(addTask);

// Update the existing task with the specified id
app.put('/api/tasks/:id', updateTask)

// Mark the task completed
app.put('/api/task/complete/:id', markCompleted)

// Delete the task with the specified id
app.delete('/api/tasks/delete/:id', deleteTask)

// Get all tasks assigned to the person with the specified id
app.get(`/api/tasks/person/:id`, getPersonsTasks)

// Get all people
app.get('/api/people', getPeople)

// Get people that have no tasks assigned or all tasks are completed
app.get('/api/people/free', getFreeUsers)

// Get the best user
app.get('/api/people/best', getBestUser)

// Get all projects
app.get('/api/projects', getProjects)

// Get all departments
app.get('/api/departments', getDepartments)

// Get all tasks part of the project with the specified id
app.get('/api/tasks/project/:id', getProjectTasks)

// Gets project overview (main query for project page)
app.get('/api/projects/overview', getProjectOverview)

// Gets people that have worked for a certain department
app.get('/api/people/department/:id', getDepartmentPeople)

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})
