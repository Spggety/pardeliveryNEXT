const { Router } = require("express");
const { MongoClient } = require("mongodb");
const router = Router();

let client;
let db;
let bonusCards;
let phones;
let orders;
let addresses;
let products;

// async function init() {
//   if (db) return;
//   try {
//     client = await clientPromise;
//     db = await client.db();

//     products = db.collection("products");
//     bonusCards = db.collection("bonuscards");
//     phones = db.collection("phones");
//     addresses = db.collection("addresses");
//     orders = db.collection("orders");
//   } catch (error) {
//     throw new Error("Gabella");
//   }
// }

router.get("/", async (req, res) => {
  const products = () => {};

  const todos =  products();
  res.render("index", {
    title: "Админка 1.0",
    isIndex: true,
  });
});

router.get("/create", (req, res) => {
  res.render("create", {
    title: "Управление",
    isCreate: true,
  });
});

module.exports = router;
