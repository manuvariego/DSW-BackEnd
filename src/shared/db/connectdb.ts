import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.dbconnect) {
  throw new Error("No se encuentra la variable de entorno");
}

const uri = `mongodb+srv://manuvariego:${process.env.dbconnect}@testdb.mmftwxw.mongodb.net/?retryWrites=true&w=majority&appName=testdb`;
const client = new MongoClient(uri);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");
    return client.db('test');
  } catch (error) {
    console.error("Fallo la conexion a database", error);
    throw error;
  }
}

export function getDatabase() {
  return client.db('test');
}

export async function closeDatabaseConnection() {
  await client.close();
  console.log("Desconectado de MongoDB");
}
