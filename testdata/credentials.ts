import credentials from "../testdata/credentials.json";

const env = (process.env.ENV || "qa").toLowerCase() as "qa" | "uat";

export const testUsers = process.env.CI
  ? [
      {
        userName: process.env.SAUCE_USERNAME!,
        password: process.env.SAUCE_PASSWORD!,
      },
    ]
  : credentials[env].users;

export const products = credentials[env].productkeyword;
