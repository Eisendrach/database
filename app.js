const sqlite3 = require("sqlite3")
const express = require ("express")
const app = express()
app.use(express.json())


const db = new sqlite3.Database(':memory:')

db.serialize(()=> {
  db.run("CREATE TABLE users (username VARCHAR(255)), password VARCHAR(255))");

  const a = db.prepare("INSERT INTO users VALUES (?,?)")
  for (var i = 0; i < 10; i++) {
      a.run(`user${i}`, `user${i}`)
  }
  a.finalize()
})

app.post("/login",(req,res)=>{
    console.log(req.body)
    const user  = req.body.user
    const password = req.body.password
    db.get("SELECT * FROM users WHERE username = ? AND password = ?",user,password,(err,row)=>{
        if (err) console.log(err)
        else{
            if (row) res.json({status : 200, ok: "true"})
            else res.json({status : 401, ok: "false"})
        }
    })
})

app.listen(8080,()=>{console.log('server listening on port 8080')})