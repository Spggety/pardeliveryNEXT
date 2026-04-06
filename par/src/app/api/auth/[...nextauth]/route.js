import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Vk from "next-auth/providers/vk";
import Credentials from "next-auth/providers/email";
import Yandex from "next-auth/providers/yandex";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/database/mongodb";
import { createTransport } from "nodemailer";
let email;
const html = ({ url, host, theme, token, identifier }) => {
  const escapedHost = host.replace(/\./g, "&#8203;.");
  email = identifier;
  const brandColor = theme.brandColor || "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: theme.buttonText || "#fff",
  };

  return `
<body style="background: ${color.background};">
  <h1>Необходимо подтвердить адрес
  электронной почты для входа в аккаунт </h1>
  <h2>
    Добрый день!<br/>Вы получили это письмо. потому что выбрали этот адрес электронной почты в качестве входа в аккаунт 
    Пардоставки<br/>Для подтверждения этого адреса введите следующий код на странице подтверждения адреса электронной почты:
  </h2>
  <span style="font-size: 18px;
   font-family: Helvetica, Arial, sans-serif; 
    color: ${color.buttonText}; 
    text-decoration: none;
    border-radius: 5px; 
    padding: 10px 20px; 
    border: 1px solid ${color.buttonBorder}; 
    background-color: ${color.buttonBorder}; 
    display: inline-block; 
    font-weight: bold;">
    ${token}
  </span>
  <p>Скрок действия кода - 10 минут с момента отправки сообщения.</p>
  <h3>Почему Вы получили это сообщение</h3>
  <ul>
  <li>
    — Вы хотите создать или войти в аккаунт сервиса Пардоствки
  </li>
  <li>
    — Вы попытались зайти в систему с другого компьютера или иного устройства
  </li>
  <li>
    — Вы используете другой браузер
  </li>
  <li>
    — Кто-то другой пытается получить доступ к вашему аккаунту
  </li>
  </ul>
</body>
`;
};

const apiVersion = "5.131";
const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Vk({
      clientId: process.env.VK_ID,
      clientSecret: process.env.VK_SECRET,
      authorization: `https://oauth.vk.com/authorize?scope=offline,email,phone_number&v=${apiVersion}`,
    }),
    Yandex({
      clientId: process.env.YANDEX_ID,
      clientSecret: process.env.YANDEX_SECRET,
      authorization:
        "https://oauth.yandex.ru/authorize?scope=login:default_phone+login:email+login:info+login:avatar",
    }),
    Credentials({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async generateVerificationToken() {
        let min = 1000;
        let max = 9999;
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
      },
      async sendVerificationRequest(params) {
        const { identifier, url, provider, theme, token } = params;
        const { host } = new URL(url);
        // NOTE: You are not required to use `nodemailer`, use whatever you want.
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Необходимо подтвердить адрес
          электронной почты для входа в аккаунт ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: html({ url, host, theme, token, identifier }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        console.log(failed);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
  session: {
    // Set it as jwt instead of database
    strategy: "jwt",
  },
  pages: {
    verifyRequest: "/login/verifyRequest",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};

const handler = NextAuth(authConfig);
export { handler as GET, handler as POST };
