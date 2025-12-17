//  const express =require("express")
//  const users =require("./sample.json")
//  const app= express();
//  const port =8000;
 
// //  display all user 

// app.get("/users",(req,res)=>{
//      return res.json(users)
// })

//  app.listen(port,(err)=>{
//    console.log(`app is running in port ${port}` )
//  })

const express = require("express");
const cors = require("cors");
const users = require("./sample.json");
const fs =require("fs")


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json())

// display all user-read
app.get("/users", (req, res) => {
  res.json(users);
});

// delete user -delete

  app.delete("/users/:id",(req,res)=>{
    let id =Number(req.params.id)
    let filterusers = users.filter((user)=>user.id !==id);
    fs.writeFile("sample.json",JSON.stringify(filterusers),(err,data)=>{
        return res.json(filterusers)
      }
    )
    })

// add new user  -create
 
app.post("/users", (req, res) => {
  let { name, age, city } = req.body;

  if (!name || !age || !city) {
    return res.status(400).send({ message: "All Fields Required" });
  }

  let id = Date.now();  

  users.push({ id, name, age, city });

  fs.writeFile("sample.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "File write error" });
    }
    return res.json({ message: "User detail added successfully" });
  });
});

// update user

app.patch("/users/:id", (req, res) => {
  let id =Number(req.params.id)
  let { name, age, city } = req.body;

  if (!name || !age || !city) {
    return res.status(400).send({ message: "All Fields Required" });
  } 

  let index =users.findIndex((user)=>user.id ==id)
  users.splice(index,1,{...req.body})

  fs.writeFile("sample.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: "File write error" });
    }
    return res.json({ message: "User detail updated successfully" });
  });
});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

