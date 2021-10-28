const express = require('express')
const app = express()
const cors = require('cors')
const options = {cors: {origin: "*",},};
const { getTasks } = require('./database')

const PORT = process.emitWarning.PORT || 3500;

app.use(cors())
app.use(express.json())

app.get('/api/tasks', getTasks)

// Error handlers
app.use((req, res) => res.status(404).send("404 NOT FOUND"))
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send("Internal Server Error")
})

app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
})