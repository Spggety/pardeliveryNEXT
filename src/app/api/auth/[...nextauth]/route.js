import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Vk from "next-auth/providers/vk";
import Credentials from "next-auth/providers/email";
import Yandex from "next-auth/providers/yandex";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { MongoClient } from "mongodb";
import { createTransport } from "nodemailer";

// --- Настройка MongoDB с TLS ---
if (!process.env.MONGODB_URI) {
  throw new Error('Missing environment variable: "MONGODB_URI"');
}

const client = new MongoClient(process.env.MONGODB_URI, {
  tls: true,
  tlsAllowInvalidCertificates: true, // временно для dev
});

let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

// --- HTML шаблон письма ---
const html = ({ url, host, theme, token, identifier }) => {
  const escapedHost = host.replace(/\./g, "&#8203;.");
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
  <h1>Подтвердите адрес электронной почты</h1>
  <h2>Добрый день! Вы получили это письмо для входа в аккаунт ${host}.</h2>
  <span style="
    font-size: 18px;
    font-family: Helvetica, Arial, sans-serif;
    color: ${color.buttonText};
    text-decoration: none;
    border-radius: 5px;
    padding: 10px 20px;
    border: 1px solid ${color.buttonBorder};
    background-color: ${color.buttonBorder};
    display: inline-block;
    font-weight: bold;
  ">
    ${token}
  </span>
  <p>Срок действия кода: 10 минут с момента отправки.</p>
</body>
`;
};

// --- Конфиг NextAuth ---
export const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    Vk({
      clientId: process.env.VK_ID,
      clientSecret: process.env.VK_SECRET,
      authorization: `https://oauth.vk.com/authorize?scope=offline,email,phone_number&v=5.131`,
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
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      async generateVerificationToken() {
        return Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
      },
      async sendVerificationRequest({ identifier, url, provider, theme, token }) {
        const { host } = new URL(url);
        const transport = createTransport(provider.server);
        const result = await transport.sendMail({
          to: identifier,
          from: provider.from,
          subject: `Подтвердите адрес электронной почты для входа в ${host}`,
          text: `Sign in to ${host}\n${url}\n\n`,
          html: html({ url, host, theme, token, identifier }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
      },
    }),
  ],
  session: {
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
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
});

export { handler as GET, handler as POST };