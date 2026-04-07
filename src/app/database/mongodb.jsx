import { MongoClient } from "mongodb";

if (!process.env.MONGODB_UR) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_UR;
const options = {
  tls: true, // включаем TLS
  tlsAllowInvalidCertificates: false, // можно временно true, если проблемы с сертификатом
};

const client = new MongoClient(uri, options);;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}
export default clientPromise;
