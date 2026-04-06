export const getProductsFind = async (find, offset) => {
  
  const key = find;
  const limit = "10";
  const response = await fetch(
    `https://api.moysklad.ru/api/remap/1.2/entity/assortment/?filter=search=${key};pathname~Ассортимент по категориям;stockMode=positiveOnly&expand=images&limit=${limit}&offset=${offset}`,
    {
      headers: {
        authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
      },
    }
  );
  return response.json();
};
