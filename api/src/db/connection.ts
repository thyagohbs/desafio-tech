import "reflect-metadata";
import { DataSource } from "typeorm";
import { Motorista } from "../models/Motorista";
import { Viagem } from "../models/Viagem";

export const dbconnect = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  timezone: "-03:00",
  synchronize: true,
  logging: true,
  entities: [Motorista, Viagem],
});
