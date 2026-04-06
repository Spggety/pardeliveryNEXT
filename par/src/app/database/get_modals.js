import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

let client;
let db;
let bonusCards;
let phones;
let orders;
let addresses;
let products;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();

    products = db.collection("products");
    db.collection("products").createIndex({ name: "text", pathName: "text" })
    bonusCards = db.collection("bonuscards");
    phones = db.collection("phones");
    orders = db.collection("orders");
    addresses = db.collection("addresses");
  } catch (error) {
    throw new Error("Gabella");
  }
}

(async () => {
  await init();
})();

//////////////////
/// BonusCards ///
//// vvvvvvvv ////

export const getBonusCards = async (userid) => {
  try {
    if (!bonusCards) await init();
    const result = await bonusCards.find({ userid: userid }).toArray();
    return { bonusCards: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

//////////////
/// Phones ///
// vvvvvvvv //

export const getPhones = async (userid) => {
  try {
    if (!phones) await init();
    const result = await phones.find({ userid: userid }).toArray();
    return { phones: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

//////////////
/// Orders ///
// vvvvvvvv //

export const getOrders = async (userid) => {
  try {
    if (!orders) await init();
    const result = await orders
      .find({ "activeAddress.userid": userid })
      .toArray();
    return { orders: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

////////////////
/// OneOrder ///
///  vvvvvv  ///

export const getOneOrder = async (id) => {
  let filter = { _id: new ObjectId(id) };
  try {
    if (!orders) await init();
    const result = await orders.find(filter).toArray();
    return { orders: result };
  } catch (error) {
    return { error: "falled to getOneOrder!" };
  }
};

/////////////////
/// addresses ///
// vvvvvvvvvvv //

export const getAddresses = async (userid) => {
  try {
    if (!addresses) await init();
    const result = await addresses.find({ userid: userid }).toArray();
    return { addresses: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

/////////////////
///  Product  ///
// vvvvvvvvvvv //

export const getPhotoProducts = async () => {
  try {
    if (!products) await init();
    const result = await products.find().toArray();
    return { products: result };
  } catch (error) {
    return { error: "falled to get products!" };
  }
};

export const getProductsFromDB = async (tab, offset, sort) => {
  try {
    if (!products) await init();
    console.log(tab)
    const result = await products
      .find({ pathName: { $regex: tab }, stock: { $gt: 0 } })
      .sort(sort)
      .skip(Number(offset))
      .limit(10)
      .toArray();
    return { rows: result };
  } catch (error) {
    return { error: error.message };
  }
};
export const getOneProductsFromDB = async (id) => {
  try {
    if (!products) await init();
    const result = await products.find({ id: id }).toArray();
    return { rows: result };
  } catch (error) {
    return { error: error.message };
  }
};

export const getSearchProductsFromDB = async (text, offset) => {
  // text.replace('','\*')
  try {
    if (!products) await init();
    const result = await products
      .find(
        { $text: { $search: text } },
        { stock: { $gt: 0 } },
        { $language: "ru" }
      ).project({ score: { $meta: "textScore" } })
      .sort({ score: { $meta: "textScore" } })
      .skip(Number(offset))
      .limit(10)
      .toArray();
    return { rows: result };
  } catch (error) {
    return { error: error.message };
  }
};

