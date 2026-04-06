const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const todoRoutes = require("./routes/todos.js");

const PORT = process.env.PORT || 3001;

const app = express();
const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(todoRoutes);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/",
      {
        useNewUrlParser: true,
      }
    );
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};
start();
