//Each endpoint has a counter to keep track of the server
//usage, so that the Round Robin Load Balancing strategy can 
//distribute equally the requests between the servers.

const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(cors());

var counter = 0;

app.post("/sumNumbers", (req, res) => {
  const numOne = Number.parseInt(req.body.numOne, 10);
  const numTwo = Number.parseInt(req.body.numTwo, 10);

  if (!Number.isFinite(numOne) || !Number.isFinite(numTwo)) {
    return res.status(400).json({ error: "numOne and numTwo must be valid integers" });
  }

  counter++;
  return res.status(200).json({
    result: numOne + numTwo,
    serverName: req.headers.host,
    counter,
  });
});

app.post("/getData", (req, res) => {
  //Mock API to get random data
  axios
    .get("https://jsonplaceholder.typicode.com/todos")
    .then((response) => {
      counter++;
      return res.status(200).json({
        data: response.data,
        serverName: req.headers.host,
        counter,
      });
    })
    .catch((err) => {
      console.error("Error fetching data from upstream API", err.message);
      return res.status(502).json({ error: "Unable to fetch upstream data" });
    });
});

module.exports = app;
