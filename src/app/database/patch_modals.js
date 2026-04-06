import { ObjectId } from "mongodb";
import clientPromise from "./mongodb";

let client;
let db;
let bonusCards;
let phones;
let orders;
let addresses;

async function init() {
  if (db) return;
  try {
    client = await clientPromise;
    db = await client.db();

    bonusCards = db.collection("bonuscards");
    phones = db.collection("phones");
    addresses = db.collection("addresses");

    orders = db.collection("orders");
  } catch (error) {
    throw new Error("Gabella");
  }
}

(async () => {
  await init();
})();

/////////////////
/// addresses ///
// vvvvvvvvvvv //

export const patchAddresses = async (data) => {
  let id = data.id;
  let filter = { _id: new ObjectId(id) };
  try {
    if (!addresses) await init();

    const options = { upsert: true };
    const result = await addresses.updateOne(
      filter,
      {
        $set: {
          userid: data.userid,
          address: data.address,
          apartment: data.apartment,
          porch: data.porch,
          floor: data.floor,
        },
      },
      options
    );
    return { addresses: result };
  } catch (error) {
    return { error: error };
  }
};

/////////////////
/// addresses ///
// vvvvvvvvvvv //

export const patchProducts = async (data) => {
  let id = data.id;
  let filter = { _id: new ObjectId(id) };
  try {
    if (!addresses) await init();

    const options = { upsert: true };
    const result = await addresses.updateOne(
      filter,
      {
        $set: {
          userid: data.userid,
          address: data.address,
          apartment: data.apartment,
          porch: data.porch,
          floor: data.floor,
        },
      },
      options
    );
    return { addresses: result };
  } catch (error) {
    return { error: error };
  }
};