import axios from "axios";
import clientPromise from "./mongodb";
import { ObjectId } from "mongodb";

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

//////////////////
/// BonusCards ///
//// vvvvvvvv ////

export const postBonusCards = async (data) => {
  try {
    if (!bonusCards) await init();
    const result = await bonusCards.insertOne({
      userid: data.userid,
      promoCard: data.promoCard,
    });
    return { bonusCards: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

//////////////
/// Phones ///
// vvvvvvvv //

export const postPhones = async (data) => {
  try {
    if (!phones) await init();
    const result = await phones.insertOne({
      userid: data.userid,
      phone: data.phone,
    });
    return { phones: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

/////////////////
/// addresses ///
// vvvvvvvvvvv //

export const postAddresses = async (data) => {
  try {
    if (!addresses) await init();
    const result = await addresses.insertOne({
      userid: data.userid,
      address: data.address,
      apartment: data.apartment,
      porch: data.porch,
      floor: data.floor,
    });

    return { addresses: result };
  } catch (error) {
    return { error: "falled to fetch __name!" };
  }
};

////////////////
/// Products ///
// vvvvvvvvvv //

export const postProducts = async (data) => {
  try {
    if (!products) await init();
    const options = { upsert: true };
    const createTime = new Date();
    const result = await products.insertMany(
      data.rows.map((el) => ({ _id: el.id, createTime, ...el })),
      {
        ordered: false,
      }
    );

    return { Products: result };
  } catch (error) {
    return { error: error.message };
  }
};

//////////////
/// Orders ///
// vvvvvvvv //

const post_TG_ORDER = async (data, result_sklad, sum, time, day) => {
  if (!phones) await init();
  const ph = await phones
    .find({
      userid:
        data.activeAddress != null
          ? data.activeAddress.userid
          : data.activePickup.userid,
    })
    .toArray();

  if (!bonusCards) await init();

  const bc = await bonusCards
    .find({
      userid:
        data.activeAddress != null
          ? data.activeAddress.userid
          : data.activePickup.userid,
    })
    .toArray();

  const URL_API_MESSAGE = `https://api.telegram.org/bot6466921292:AAGagoV889I4xQprS8pETyVaxtAfOWyplOA/sendMessage`;
  const PAR_SUPPORT_CHAT_ID = "-1002146224218";
  let message = `<b> <u>Заказ покупателя: </u> \n`;
  message += `${result_sklad.updated}</b>\n`;
  message += `Клиент - ${data.userName}\n`;
  message += `\n<b>Состав заказа:</b>`;
  message += result_sklad.positions.rows.map(
    (el) =>
      `\n\n-${el.assortment.name}\n <b>Инфо:</b> ${
        el.assortment.salePrices[0].value / 100
      }₽ | ${el.quantity}шт`
  );
  message += `\n\n<b>Оплата и Адрес:</b>`;
  message += `\n-Оплата:${
    data.payType == false
      ? data.cashValue === 0
        ? " наличными, сдача не нужна"
        : " наличными, сдача с " + data.cashValue + "р"
      : " переводом"
  }\n`;
  message += `-Бонусная карта: ${bc[0]?.promoCard}\n`;
  if (data.typeOrder === false) {
    message += `\n-Адрес:`;
    message += `\n      <b>${data.activeAddress.address}, ${data.activeAddress.porch} подъезд, ${data.activeAddress.floor} этаж, кв ${data.activeAddress.apartment}</b>`;
  } else {
    message += `\nСамовывоз: `;
    message += `<b>${data.activePickup.address}</b>`;
  }
  message += `\n\n-Дата доставки: ${day}\n`;
  message += `-Время доставки: ${time}\n\n`;
  // message += `Телеграм клиента - @\n`;
  message += `Телефон клиента: <b>+7${ph[0]?.phone}</b>\n`;
  message += `<b>Сумма заказа: ${sum}</b> рублей\n\n`;
  message += `${
    data.comment != "" ? `<b>Коментарий к заказу:</b>\n ${data.comment}` : ""
  }`;
  message += `\n<b>Ссылка на заказ: </b>https://online.moysklad.ru/app/#customerorder/edit?id=${result_sklad.id}`;

  axios.post(URL_API_MESSAGE, {
    chat_id: PAR_SUPPORT_CHAT_ID,
    parse_mode: "html",
    text: message,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Отменить",
            callback_data: "btn_no",
          },
          {
            text: "Изменить",
            callback_data: "btn_reload",
          },
          {
            text: "Выполнен",
            callback_data: "btn_yes",
          },
        ],
      ],
    },
  });
};

const post_SKLAD_ORDER = async (data) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", process.env.TOKEN_MYSKLAD);
    if (!phones) await init();
    const ph = await phones
      .find({
        userid:
          data.activeAddress != null
            ? data.activeAddress.userid
            : data.activePickup.userid,
      })
      .toArray();

    const positions = data.prod.map((el) => ({
      assortment: {
        meta: {
          href: `https://api.moysklad.ru/api/remap/1.2/entity/product/${el.id}`,
          metadataHref:
            "https://api.moysklad.ru/api/remap/1.2/entity/product/metadata",
          type: "product",
          mediaType: "application/json",
        },
      },
      price: el.price * 100,
      quantity: el.count,
    }));
    var raw = JSON.stringify({
      organization: {
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/organization/21c10969-6751-11ed-0a80-02410014c134",
          type: "organization",
          mediaType: "application/json",
        },
      },
      agent: {
        meta: {
          href: "https://api.moysklad.ru/api/remap/1.2/entity/counterparty/2f3ff38a-4212-11eb-0a80-02b80019ede7",
          metadataHref:
            "https://api.moysklad.ru/api/remap/1.2/entity/counterparty/metadata",
          type: "counterparty",
          mediaType: "application/json",
          uuidHref:
            "https://online.moysklad.ru/app/#company/editid=2f3ff38a-4212-11eb-0a80-02b80019ede7",
        },
      },
      positions: positions,
      description: `Тест \nТелефон: ${ph[0]?.phone} \nИмя: ${data.userName}\n ${
        data.typeOrder === false
          ? `Адрес: ${data.activeAddress.address}, ${data.activeAddress.porch} подъезд, кв ${data.activeAddress.apartment}, ${data.activeAddress.floor} этаж`
          : `Самовывоз: ${data.activePickup.address}`
      } ${
        data.comment != "" ? `\nКомментарий к заказу: ${data.comment}` : ""
      } `,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    return fetch(
      "https://api.moysklad.ru/api/remap/1.2/entity/customerorder?action=evaluate_price&expand=positions.assortment,state,positions.assortment.images",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        return result;
      })
      .catch((error) => {
        console.log("error", error);
        throw error;
      });
  } catch (error) {
    return { error: "falled to post_SKLAD_ORDER!" };
  }
};

export const postOrders = async (data) => {
  const timePer = [
    { id: 1, time: "30 - 90 мин" },
    { id: 14, time: "14:00 - 15:00" },
    { id: 15, time: "15:00 - 16:00" },
    { id: 16, time: "16:00 - 17:00" },
    { id: 17, time: "17:00 - 18:00" },
    { id: 18, time: "18:00 - 19:00" },
    { id: 19, time: "19:00 - 20:00" },
    { id: 20, time: "20:00 - 21:00" },
    { id: 21, time: "21:00 - 22:00" },
    { id: 22, time: "22:00 - 23:00" },
  ];
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 1000 * 60 * 60 * 24);
  const tomorrowAfter = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2);

  const dateDayNow =
    now.getDate() + "." + ((now.getMonth() + 1) % 12) + "." + now.getFullYear();
  const dateDayTomorrow =
    tomorrow.getDate() +
    "." +
    ((tomorrow.getMonth() + 1) % 12) +
    "." +
    now.getFullYear();
  const dateDayAfterTomorrow =
    tomorrowAfter.getDate() +
    "." +
    ((tomorrowAfter.getMonth() + 1) % 12) +
    "." +
    now.getFullYear();

  try {
    const result_sklad = await post_SKLAD_ORDER(data);
    if (result_sklad != null) {
      const sum = result_sklad.positions.rows
        .map((el) => (el.assortment.salePrices[0].value / 100) * el.quantity)
        .reduce(function (a, b) {
          return a + b;
        }, 0);

      if (!orders) await init();
      const time = timePer.find(
        (el) => el.id === data?.activeTimeId % 100
      ).time;
      const day =
        data.activeTimeId - 100 < 0
          ? dateDayNow
          : data.activeTimeId - 100 < 100 && data.activeTimeId - 100 >= 0
          ? dateDayTomorrow
          : dateDayAfterTomorrow;
      let ord;
      if (data.typeOrder == false) {
        ord = {
          type: "Доставка",
          state: "Активный",
          activeAddress: data.activeAddress,
          activeTimeId: `${
            time === "30 - 90 мин"
              ? `${now.getHours()}:${now.getMinutes()} (30 - 90 мин)}`
              : time
          }`,
          activeDate: day,
          cashValue: data.cashValue,
          payType: data.payType,
          products: result_sklad.positions.rows,
          sum: sum,
          comment: data.comment,
        };
      }
      if (data.typeOrder == true) {
        ord = {
          type: "Самовывоз",
          state: "Активный",
          activeAddress: data.activePickup,
          activeTimeId: `${
            time === "30 - 90 мин"
              ? `${now.getHours()}:${now.getMinutes()} (30 - 90 мин)}`
              : time
          }`,
          activeDate: day,
          cashValue: data.cashValue,
          payType: data.payType,
          products: result_sklad.positions.rows,
          sum: sum,
          comment: data.comment,
        };
      }
      const result = await orders.insertOne(ord);
      post_TG_ORDER(data, result_sklad, sum, time, day);
      return { orders: result };
    }
  } catch (error) {
    return { error: result_sklad };
  }
};
