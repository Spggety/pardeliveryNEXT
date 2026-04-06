const categories = {
  vape: `Ассортимент по категориям/Одноразовые электронные испарители`,
  liquid: `Ассортимент по категориям/Жидкости для POD-систем`,
  podSystem: `Ассортимент по категориям/POD-системы/Многоразовые POD-системы`,
  cartridge: `Ассортимент по категориям/POD-системы/Испарители и Картриджи`,

  tobacco: `Ассортимент по категориям/Табачная продукция/Табаки и смеси для кальяна/(м) Табаки и смеси для кальяна`,
  tobaccoMix: `Ассортимент по категориям/Табачная продукция/Табаки и смеси для кальяна/(н) Табаки и смеси для кальяна`,
  coal: `Ассортимент по категориям/Уголь для кальяна`,
  accessories: `Ассортимент по категориям/Аксессуары для кальяна`,

  snus: `Ассортимент по категориям/Табачная продукция/Табак жевательный`,
  snuf: `Ассортимент по категориям/Табачная продукция/Табак нюхательный`,
};

export const getGroup = async (tab) => {
  function getValueByKey(array, key) {
    return array[key];
  }

  
  const key = tab;
  const value = getValueByKey(categories, key);
  const response = await fetch(
    `https://api.moysklad.ru/api/remap/1.2/entity/productfolder?filter=pathName=${value}`,
    {
      headers: {
        authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
      },
    }
  );
  return response.json();
};


export const getGroupName = async (tab, other) => {
  function getValueByKey(array, key) {
    return array[key];
  }

  const key = tab;
  const value = getValueByKey(categories, key);
  const response = await fetch(
    `https://api.moysklad.ru/api/remap/1.2/entity/productfolder?filter=pathName=${value}/${other}`,
    {
      headers: {
        authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
      },
    }
  );
  return response.json();
};
