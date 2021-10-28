const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('../data.db')

db.serialize(() => {
    db.each("SELECT * FROM Task", (err, row) => {
        console.log(row.TaskID + ": " + row.Title);
    })
})

db.close()