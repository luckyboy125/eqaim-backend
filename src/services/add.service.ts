import { Pool } from "pg";
import AdditionSteps from "../types/types";
import { postgresConfig } from "../configs/config";

class AddService {
  private pool: Pool;

  constructor() {
    const { username, password, host, port, database } = postgresConfig;

    this.pool = new Pool({
      connectionString: `postgresql://${username}:${password}@${host}:${port}`,
    });

    this.createDatabase(database)
      .then(() => {
        this.pool = new Pool({
          connectionString: `postgresql://${username}:${password}@${host}:${port}/${database}`,
        });
      })
      .catch((error) => {
        throw new Error("An error occurred while creating the database.");
      });
  }

  private async createDatabase(database: string): Promise<void> {
    try {
      const client = await this.pool.connect();
      await client.query(`CREATE DATABASE ${database}`);
      client.release();
    } catch (error) {
      const errorMessage = (error as Error).toString();

      if (!errorMessage.includes("already exists")) {
        throw new Error("An error occurred while creating the database.");
      }
    }
  }

  public performAddition(num1: string, num2: string): AdditionSteps {
    if (num1.length < num2.length) {
      [num1, num2] = [num2, num1];
    }

    const steps: AdditionSteps = {};
    const reversedFirstNumber = Array.from(num1).reverse().join("");
    const reversedSecondNumber = Array.from(num2).reverse().join("");

    let sumString = "";
    let carryString = "_";
    let carry = 0;
    let i: number;

    for (i = 0; i < reversedFirstNumber.length; i++) {
      if (i >= reversedSecondNumber.length && !carry) {
        break;
      }

      const digit1 = parseInt(reversedFirstNumber[i]) || 0;
      const digit2 = parseInt(reversedSecondNumber[i]) || 0;
      const digitSum = (digit1 + digit2 + carry) % 10;

      carry = Math.floor((digit1 + digit2 + carry) / 10);

      sumString = digitSum.toString() + sumString;
      carryString = carry.toString() + carryString;

      steps[`step${i + 1}`] = { carryString, sumString };
    }

    if (carry) {
      steps[`step${i}`] = { carryString, sumString: "1" + sumString };
    } else {
      steps[`step${i}`] = { carryString: carryString.slice(1), sumString: num1.slice(0, -i) + sumString };
    }

    return steps;
  }

  public async saveStepsToDB(num1: string, num2: string, steps: AdditionSteps): Promise<void> {
    try {
      const client = await this.pool.connect();

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS steps (
          id SERIAL PRIMARY KEY,
          first_number VARCHAR NOT NULL,
          second_number VARCHAR NOT NULL,
          steps JSONB NOT NULL
        )
      `;

      await client.query(createTableQuery);

      await client.query("INSERT INTO steps (first_number, second_number, steps) VALUES ($1, $2, $3)", [
        num1,
        num2,
        JSON.stringify(steps),
      ]);

      client.release();
    } catch (error) {
      throw new Error("An error occurred while saving the steps.");
    }
  }
}

export default AddService;
