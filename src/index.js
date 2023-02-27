require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const pullData = () => JSON.parse(fs.readFileSync(__dirname + todoFilePath));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

//Add GET request with path '/'
app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
  });
  res.status(200);
});
//Add GET request with path '/todos'
app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });
});

//Add GET request with path '/todos/overdue'
app.get("/todos/overdue", (req, res) => {
  res.header("Content-Type", "application/json");
  let todos = pullData().filter(
    (todo) => !todo.completed && Date.parse(todo.due) < new Date()
  );
  res.send(todos);
});

//Add GET request with path '/todos/completed'
app.get("/todos/completed", (req, res) => {
  const todos = pullData().filter((todos) => todos.completed === true);
  let completed = [];
  const result = todos.filter((todo) => todo.completed == true);
  res.send(result);
});
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(__dirname + todoFilePath);
  let todos = pullData().find((todo) => todo.id == id);
  if (result) {
    res.send(JSON.stringify(result, null, 2));
  } else {
    res.status(404).send();
  }
});
//Add POST request with path '/todos'
app.post("/todos", (req, res) => {
  const dateNtime = new Date();
  const { name, due } = req.body;
  const data = pullData();

  if (req.body && new Date(due) != "Invalid Date") {
    const newTodo = {
      id: uuidv4(),
      name,
      created: dateNtime,
      due,
      completed: false,
    };
    const data = fs.readFileSync(__dirname + todoFilePath);
    let todos = JSON.parse(data);
    todos.push(newTodo);
    todos = JSON.stringify(todos, null, 2);
    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      } else {
        res.header("Content-Type", "application/json").status(201).send();
      }
    });
  } else {
    res.status(400).send();
  }
});

//Add PATCH request with path '/todos/:id
app.patch("/todos/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const data = fs.readFileSync(__dirname + todoFilePath);
  let todos = pullData()
  const profile = todos.find((el) => el.id == id);
  if (profile) {
    const info = ["name", "due"];
    let bodyResults = Object.keys(body);
    const interject = [];
    bodyResults.forEach((key) => {
      if (info.includes(key)) {
        interject.push(key);
      }
    });
    if (
      interject.length === 0 ||
      (body.due && new Date(body.due) == "Invalid Date")
    ) {
      res.status(404).end();
    }
    interject.forEach((result) => {
      profile[result] = body[result];
    });
    todos = JSON.stringify(todos, null, 2);
    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      }
    });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

//Add POST request with path '/todos/:id/complete
app.post("/todos/:id/complete", (req, res) => {
  const id = req.params.id;
  const data = fs.readFileSync(__dirname + todoFilePath);
  const todos = JSON.parse(data)

  const profile = todos.find((todos) => todos.id == id)
  if (profile) {
    profile.completed = true;

    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      } else {
        res.status(404).send();
      }
    });
  } else {
    res.status(200).send();
  }
});

//Add POST request with path '/todos/:id/undo
app.post("/todos/:id/undo", (req, res) => {
  let todos = JSON.parse(data)
  const id = req.params.id;
  const data = fs.readFileSync(__dirname + todoFilePath);
  const profile = todos.find(
    (todos) => todos.id === id)

  if (profile) {
    profile.completed = false
    todos = JSON.stringify(todos, null, 2);
    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      } else {
        res.status(200).end();
      }
    });
  } else {
    res.status(404).end();
  }
});

//Add DELETE request with path '/todos/:id
app.delete("/todos/:id", (req, res) => {
  
  const id = req.params.id;
  const data = fs.readFileSync(__dirname + todoFilePath)
  const todos = getTodos()
  .find((todos) => todos.id === id);
  if (todos) {
    todos = todos.filter((todos) => todos.id != id);
    todos = JSON.stringify(todos, null, 2);
    fs.writeFile(__dirname + todoFilePath, todos, (err) => {
      if (err) {
        throw err;
      }
      res.send();
    })
  } else {
    res.status(404).send();
  }
});

module.exports = app;
