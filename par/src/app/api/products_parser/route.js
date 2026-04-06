import { postProducts } from "@/app/database/post_modals";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pass = searchParams.get("pass");
  try {
    // Определение параметров пагинации
    // if (pass == 123321) {
      const limit = 100;
      let offset = 0;
      const value_old = `Ассортимент по категориям`;
      // Выгрузка JSON с внешнего API с использованием пагинации
      const URL_NEW = `https://api.moysklad.ru/api/remap/1.2/entity/assortment/?filter=pathname~${value_old};&expand=images&limit=${limit}&offset=${offset}`;

      const response = await fetch(URL_NEW, {
        headers: {
          authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
        },
      });

      const data = await response.json();
      const totalPages = data.meta.size;
      console.log(totalPages)
      for (let i = 1; i * 100 <= totalPages + 100; i++) {
        console.log(i * 100);
        const nextPageResponse = await fetch(
          `https://api.moysklad.ru/api/remap/1.2/entity/assortment/?filter=pathname~${value_old};&expand=images&limit=${limit}&offset=${
            i * 100
          }`,
          {
            headers: {
              authorization: "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
            },
          }
        );
        const nextPageData = await nextPageResponse.json();
        const { products, error } = await postProducts(nextPageData);
        NextResponse.json({ products });
      }
      const { products, error } = await postProducts(data);
      if (error) throw new Error(error);
      return NextResponse.json({ products: products });
    // }
    // else return NextResponse.json({ products: "no" });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
