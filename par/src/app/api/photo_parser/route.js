import { NextResponse } from "next/server";
import axios from "axios";
import fs from "fs";
import { getPhotoProducts } from "@/app/database/get_modals";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const pass = searchParams.get("pass");
  try {
    if (pass == 123321) {
      const Arr = await getPhotoProducts();
      let photoLinks;
      photoLinks = Arr.products.map((el) => ({
        link: el.images.rows[0] ? el.images.rows[0].meta.downloadHref : "",
        name: el.id,
        dir: "./public/images/photos/" + el.pathName,
      }));
      // Предполагается, что photoLinks это массив URL-адресов фотографий

      let parsedPhotos = 0;
      const photoPath = "./public/images/photos"; // Путь для сохранения фотографий

      // Создание директории для сохранения фотографий, если она не существует
      // Проход по каждой ссылке и загрузка фотографии

      if (photoLinks) {
        let i = 0;
        for (const link of photoLinks) {
          var re = /\?|\||\*/gi;
          if (link.link != "") {
            const folders = link.dir.split("/");

            let currentPath = "";

            for (let i = 0; i < folders.length; i++) {
              currentPath += folders[i] + "/";
              // Check if the folder exists, if not create it
              if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
              }
            }
            const response = await axios.get(link.link, {
              responseType: "arraybuffer",
              headers: {
                Authorization:
                  "Bearer aec3495c6678b37e84fd1c39b4ade73a82ce221d",
              },
            });
            const photoData = Buffer.from(response.data, "binary").toString(
              "base64"
            );

            const fileName = link.name + ".png"; // Получение имени файла из ссылки
            fs.writeFileSync(
              `${link.dir}/${fileName}`,
              photoData,
              "base64"
            ); // Сохранение фотографии на диск
            parsedPhotos = parsedPhotos + 1;
          }
        }
      }
    }

    return NextResponse.json({ good: "ОК" });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
