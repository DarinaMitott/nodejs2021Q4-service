import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import {POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_PORT, POSTGRES_USER} from "./common/config";

const config: PostgresConnectionOptions = {
    "type": "postgres",
    "username": POSTGRES_USER,
    "password": POSTGRES_PASSWORD,
    "host": POSTGRES_HOST,
    "port": Number(POSTGRES_PORT),
    "database": POSTGRES_DB,
    "synchronize": false,
    "logging": true,
    "entities": [
        "src/resources/**/*.model.ts"
    ],
    "migrations": [
        "src/migration/*.ts"
    ],
    "subscribers": [
        "src/subscriber/**/*.ts"
    ],
    "cli": {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}

export default config;
