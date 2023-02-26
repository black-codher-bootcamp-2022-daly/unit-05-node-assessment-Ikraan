require('dotenv').config();
const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const todoFilePath = process.env.BASE_JSON_PATH;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  
  res.sendFile("./public/index.html", { root: __dirname },(err) => {
    console.log(err);
  });
  
  res.status(200).end();
});

//Add GET request with path '/todos'
app.get('/todos', (_, res) => {
  
  res.header("Content-Type","application/json");
  res.sendFile(todoFilePath, { root: __dirname });

  res.status(200);
});

//Add GET request with path '/todos/overdue'
app.get("/todos/overdue", (req, res) => {
  const date = new Date();
  const profile = JSON.parse(
    fs.readFileSync(path.join(__dirname, "models/todos.json"))
  );
  const result = profile.filter((item) => new Date(item.due) < date);
  res.send(result);
  profile[0].due;
});

//   const data = fs.readFileSync(__dirname + todoFilePath)
//    let date = new Date() 
//    let todos = JSON.parse(data)

//   let overdues = []
 
//   todos.forEach(todo => {
//     const parse_date = Date.parse(todo.due)
//     if(new Date(todo.due) < today_date && todo.completed === false){
//       overdues.push(todo)
//     }
//   });
//   res.header('Content-Type', 'Application/json');
//   res.send(JSON.stringify(overdues,null,2))
// })

//Add GET request with path '/todos/completed'
// app.get('/todo/completed', (req, res) => {
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)
//   let list_of_todos = todos.filter(todo => todo.completed ===true)
//   res.header('Content-Type', 'Application/json');
//   res.send(JSON.stringify(list_of_todos, null, 2))
// })

// app.get('/todo/:id', (req, res) => {
//   const id = req.params.id
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)
//   const matched_id = todos.find((el)=> el.id == id);
//   if (matched_id){
//     res.send(JSON.stringify(matched_id, null, 2))
//   } else {
//     res.status(404).end()
//   }
// })

//Add POST request with path '/todos'
// app.post('/todos', (req, res) => {
//   const date_and_time = new Date()
//   const {name, due} = req.body
// if (req.body && new Date(due) != 'Invalid Date'){
//   console.log('worked')
//   const new_todo = {id:uuidv4(), name, created:date_and_time, due, completed:false}
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)
//   todos.push(new_todo)
//   todos = JSON.stringify(todos, null, 2)

//   fs.writeFile(__dirname + todoFilePath, todos, (err) => {
//     if (err) {
//       throw err;
//     } else {
//       res.status(201).end()
//     }
//   })
// } else {
//   res.status(400).end()
// }
// })


//Add PATCH request with path '/todos/:id
// app.patch('/todos/:id', (req, res) => {
//   const id = req.params.id
//   const body = req.body
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)
//   const matchedProfile = todos.find((el) => el.id == id);
//   if (matchedProfile){
//     const allowed_keys = ['name','due']
//     let body_keys = Object.keys(body)
  
//   const intersection = []
//   body_keys.forEach(key => {
//     if (allowed_keys.includes(key)){
//       intersection.push(key)
//     }
//   })
//   if (intersection.length === 0 || (body.due && new Date(body.due) == 'Invalid Date')){
//     console.log('here')
//     res.status(404).end()
//   }
//   intersection.forEach(result => {
//     matchedProfile[result] = body[result]
//   })
//   todos = JSON.stringify(todos, null, 2)
//   fs.writeFile(__dirname + todoFilePath,todos, (err) => {
//     if (err){
//       throw err;
//     }
//   })
//   res.status(200).end()
//   }
//   else{
//     res.status(404).end()
//   }
// })


//Add POST request with path '/todos/:id/complete
// app.post('/todos/:id/undo', (req, res) => {
//   const id = req.params.id
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)

//   const matchedProfile = todos.find((el) => el.id == id)
//   if(matchedProfile){
//     matchedProfile.completed = false
//     todos = JSON.stringify(todos, null, 2)

//     fs.writeFile(__dirname + todoFilePath, todos, (err) => {
//       if (err) {
//         throw err;
//       } else {
//         res.status(200).end()
//       }
//     })
//   } else {
//     res.status(404).end()
//   }
// })

//Add POST request with path '/todos/:id/undo

//Add DELETE request with path '/todos/:id
// app.delete('/todos/:id', (req, res) => {
//   const id = req.params.id
//   const data = fs.readFileSync(__dirname + todoFilePath)
//   let todos = JSON.parse(data)
//   if (matchedProfile){
//     todos = todos.filter((todo) => todo.id != id);
//     todos = JSON.stringify(todos, null, 2);

//     fs.writeFile(__dirname + todoFilePath, todos, (err) => {
//       if (err){
//         throw err;
//       }
//       res.status(200).end();
//     });
//   } else {
//     res.status(404).end();
//   }
// });

module.exports = app;