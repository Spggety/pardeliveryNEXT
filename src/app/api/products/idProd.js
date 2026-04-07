export const getProductsIdProd = async (id) => {
  const response = await fetch(
    `https://api.moysklad.ru/api/remap/1.2/entity/assortment/?filter=id=${id}&expand=images&limit=1&offset=0`,
    {
      headers: {
        authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
      },
    }
  );
  return response.json();
};
