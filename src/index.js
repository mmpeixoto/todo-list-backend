const express = require("express");
const { uuid } = require("uuidv4");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

require("dotenv/config");

app.use(cors());
app.use(express.json());

/*
 Get = listar api
 Post = criar novo elemento
 Put = atualizar elemento
 Delete = remover elemento

  queryParams = Parametros que se passam pelo link apos o link com um ?
  Route params = identificar recursos, com :id, por exemplo
  Body = dados que se passam no corpo da requisição
*/

const users = [
  {
    id: uuid(),
    username: "matheus",
    password: "123456",
    tasks: [],
  },
];

app.get("/clients", (req, res, next) => {
  const userId = req.query.userId;
  const token = req.query.token;

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(700)
        .json({ auth: false, message: "Failed to authenticate token." });
  });

  users.map((user) => {
    if (user.id === userId) {
      return res.json(user.tasks);
    }
  });
});

app.post("/clients", (req, res, next) => {
  const { userId, tasks } = req.body;
  const user = users.find((user) => user.id === userId);
  user.tasks = tasks;
  return res.json(user.tasks);
});

app.post("/login", (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return res.status(400).json({ error: "User not found" });
  }

  if (user.password !== password) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: 300,
  });

  return res.json({ user, token });
});

app.post("/newUser", (req, res, next) => {
  const { username, password } = req.body;

  const user = users.find((user) => user.username === username);

  if (user) {
    return res.status(400).json({ error: "User already exists" });
  }

  const newUser = {
    id: uuid(),
    username,
    password,
    tasks: [],
  };

  users.push(newUser);

  return res.json(newUser);
});

app.listen(3333, () => {
  console.log("🚀 servidor rodando ");
});
