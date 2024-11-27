import "reflect-metadata";
import dotenv from "dotenv";
import { Motorista } from "../../models/Motorista";
import { dbconnect } from "../connection";

dotenv.config();

export const initializeDbConnection = async () => {
  try {
    await dbconnect.initialize();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    // Verificar se o banco de dados 'taxi' existe e criá-lo caso não exista
    await dbconnect.query(`
      CREATE DATABASE IF NOT EXISTS taxi;
    `);
    console.log("Banco de dados 'taxi' verificado/criado.");

    await dbconnect.query("USE taxi;");

    // Verificar se a tabela 'motorista' existe, caso contrário, criá-la
    const motoristaTableExists = await dbconnect.query(`
      SHOW TABLES LIKE 'motorista';
    `);

    if (motoristaTableExists.length === 0) {
      console.log("Tabela 'motorista' não encontrada. Criando a tabela.");

      await dbconnect.query(`
        CREATE TABLE IF NOT EXISTS motorista (
          id INT NOT NULL AUTO_INCREMENT,
          nome VARCHAR(255) NULL,
          descricao LONGTEXT NULL,
          carro VARCHAR(200) NULL,
          avaliacao LONGTEXT NULL,
          taxa DOUBLE NULL,
          km_minimo INT NULL,
          PRIMARY KEY (id)
        ) ENGINE = InnoDB;
      `);
      console.log("Tabela 'motorista' criada com sucesso.");
    } else {
      console.log("Tabela 'motorista' já existe.");
    }

    // Verificar se a tabela 'viagem' existe, caso contrário, criá-la
    const viagemTableExists = await dbconnect.query(`
      SHOW TABLES LIKE 'viagem';
    `);

    if (viagemTableExists.length === 0) {
      console.log("Tabela 'viagem' não encontrada. Criando a tabela.");

      await dbconnect.query(`
        CREATE TABLE IF NOT EXISTS viagem (
          id INT NOT NULL,
          data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
          origem VARCHAR(255) NULL,
          destino VARCHAR(255) NULL,
          distancia INT NULL,
          duracao VARCHAR(100) NULL,
          valor DOUBLE NULL,
          cliente_id INT NOT NULL,
          motorista_id INT NOT NULL,
          PRIMARY KEY (id),
          INDEX fk_viagem_motorista1_idx (motorista_id ASC) VISIBLE,
          CONSTRAINT fk_viagem_motorista1
            FOREIGN KEY (motorista_id)
            REFERENCES motorista (id)
            ON DELETE NO ACTION
            ON UPDATE NO ACTION
        ) ENGINE = InnoDB;
      `);
      console.log("Tabela 'viagem' criada com sucesso.");
    } else {
      console.log("Tabela 'viagem' já existe.");
    }

    // Verificar se existem motoristas cadastrados
    const motoristaRepository = dbconnect.getRepository(Motorista);

    // Contar o número de motoristas na tabela
    const motoristaCount = await motoristaRepository.count();

    // Se não houver motoristas cadastrados, insira os dados padrão
    if (motoristaCount === 0) {
      console.log("Nenhum motorista encontrado. Inserindo dados padrão.");

      await motoristaRepository.insert([
        {
          id: 1,
          nome: "Homer Simpson",
          descricao:
            "Um motorista simpático e descontraído, a experiência é única e o preço é bem acessível.",
          carro: "Plymouth Valiant 1973 rosa e enferrujado",
          avaliacao: "2/5 O motorista é muito desatento!",
          taxa: 2.5,
          km_minimo: 1,
        },
        {
          id: 2,
          nome: "Dominic Toretto",
          descricao:
            "Sou um profissional gente boa e dono de um carro bem arrumado!",
          carro: "Dodge Charger R/T 1970 modificado",
          avaliacao:
            "4/5 Não dei nota máxima por conta da modificação do carro rsrsrs!",
          taxa: 5,
          km_minimo: 5,
        },
        {
          id: 3,
          nome: "James Bond",
          descricao:
            "Motorista muito experiente e super atencioso com os seus clientes!",
          carro: "Aston Martin DB5 clássico",
          avaliacao: "5/5 Gostei do motorista, muito prestativo!",
          taxa: 10,
          km_minimo: 10,
        },
      ]);

      console.log("Motoristas inseridos com sucesso.");
    } else {
      console.log(
        "Motoristas já cadastrados, não será necessário inserir dados."
      );
    }
  } catch (error) {
    console.error("Erro ao conectar com o banco de dados:", error);
  }
};
