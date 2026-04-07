function getValueByKey(array, key) {
  return array[key];
}

const orders = {
  "По умолчанию": "",
  "Дороже": "salePrice,desc",
  "Дешевле": "salePrice,asc",
  Новинки: "avgStockDays,asc",
};

export const getProducts = async (tab, offset, sort) => {
  const categoriesOld = {
    vape: `^Ассортимент по категориям/Одноразовые электронные`,
    liquid: `^Ассортимент по категориям/Жидкости для POD-систем`,
    podSystem: `^Ассортимент по категориям/POD-системы/Многоразовые`,
    cartridge: `^Ассортимент по категориям/POD-системы/Испарители и Картриджи`,

    tobacco: `^Ассортимент по категориям/Табачная продукция/Табаки и смеси для кальяна/(м)`,
    tobaccoMix: `^Ассортимент по категориям/Табачная продукция/Табаки и смеси для кальяна/(н)`,
    coal: `^Ассортимент по категориям/Уголь для кальяна`,
    accessories: `^Ассортимент по категориям/Аксессуары для кальяна`,

    snus: `^Ассортимент по категориям/Табачная продукция/Табак жевательный`,
    snuf: `^Ассортимент по категориям/Табачная продукция/Табак нюхательный`,
  };
  const categories = {
    vape: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/78e4cf75-4584-11ee-0a80-005d00595a36`,
    liquid: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/c734ccee-4212-11eb-0a80-084c005da5d9`,
    podSystem: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/1174539d-6ff3-11ed-0a80-05640046bd67`,
    cartridge: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/fb8f9130-6ff2-11ed-0a80-0c070047a900`,

    tobacco: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/f43aa6f7-dc2d-11eb-0a80-00f600079bd5`,
    tobaccoMix: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/5033b1b3-be62-11ed-0a80-02b80066ac71`,
    coal: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/c41b6b38-4212-11eb-0a80-084c005da068`,
    accessories: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/5ce9b952-4212-11eb-0a80-084c005d4d9f`,

    snus: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/6bf434b7-2a76-11ec-0a80-05d20010c148`,
    snuf: `https://api.moysklad.ru/api/remap/1.2/entity/productfolder/79917305-aac8-11ec-0a80-0c250012b874`,
  };

  const key = tab;
  const value = getValueByKey(categories, key);
  const value_old = getValueByKey(categoriesOld, key);
  const limit = "10";
  const order = getValueByKey(orders, sort);
  const URL_OLD = `https://api.moysklad.ru/api/remap/1.2/entity/assortment/?filter=pathname~${value_old};stockMode=positiveOnly&expand=images&limit=${limit}&offset=${offset}`;
  const URL_NEW = `https://api.moysklad.ru/api/remap/1.2/report/stock/all?filter=productFolder=${value};stockMode=positiveOnly&expand=images&limit=${limit}&offset=${offset}&order=${order}`;

  const response = await fetch(URL_OLD, {
    headers: {
      authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
    },
  });
  return response.json();
};

export const getProductsPath = async (path, offset, sort) => {
  const limit = "10";
  
  const order = getValueByKey(orders, sort);
  const URL_NEW = `https://api.moysklad.ru/api/remap/1.2/report/stock/all?filter=productFolder=${path};stockMode=positiveOnly&expand=images&limit=${limit}&offset=${offset}&order=${order}`;
  const URL_OLD = `https://api.moysklad.ru/api/remap/1.2/entity/assortment?filter=productFolder=${path};stockMode=positiveOnly&expand=images&limit=${limit}&offset=${offset}&order=${order}`
  const response = await fetch(URL_OLD, {
    headers: {
      authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
    },
  });
  return response.json();
};
