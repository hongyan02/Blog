import { defineConfig } from "drizzle-kit";
import * as yaml from "js-yaml";
import * as fs from "fs";
import * as path from "path";

// 加载 YAML 配置文件
const configPath = path.resolve(__dirname, "config.yaml");
const config = yaml.load(fs.readFileSync(configPath, "utf8")) as {
    database: { host: string; port: number; database: string; user: string; password: string };
};

// 获取数据库连接信息
const { host, port, database, user, password } = config.database;

// 构建数据库连接 URL
const dbUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
    schema: "./src/features/db/schema.ts",
    out: "./drizzle/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: dbUrl,
    },
});
