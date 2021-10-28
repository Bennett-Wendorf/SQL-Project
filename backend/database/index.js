const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('./data.db')

function getTasks(req, res, next) {

    let sql = `SELECT TaskID, Title
               FROM Task`


    db.all(sql, [], (err, rows) => {
        if(err) {
            res.status(400).json({"error":err.message})
            return
        }
        res.json({
            "message":"success",
            "data": rows
        })
    })

}

module.exports = { getTasks }