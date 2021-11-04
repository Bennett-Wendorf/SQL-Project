const express = require('express')
const app = express()
const cors = require('cors')
const options = {cors: {origin: "*",},};
const { getAllTasks, getPersonsTasks, getPeople } = require('./database')

// Define the port to run the backend on as the enviroment variable for port, or 3500 if that variable is not defined
const PORT = process.env.PORT || 3500;

// Ensure the express app uses these modules
app.use(cors())
app.use(express.json())

// When a get request is made to this backend, call the getTasks function
app.get('/api/tasks', getAllTasks)
app.get(`/api/tasks/person/:id`, (req, res, next) => getPersonsTasks(req, res, next))
app.get('/api/people', getPeople)

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})