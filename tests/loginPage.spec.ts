import { testUsers } from "../testdata/credentials";
import { test } from "../fixtures/contextFixture";

const INVALID_CREDENTIALS_ERROR =
  "Epic sadface: Username and password do not match any user in this service";
const LOCKED_OUT_ERROR = "Epic sadface: Sorry, this user has been locked out.";

test.describe("Sauce demo Login Page", () => {
  for (const user of testUsers) {
    test(
      `TID001 Successful Login ${user.userName}`,
      { tag: ["@login", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.verifyproductListVisible();
      }
    );
  }

  test(
    `TID002 Invalid Login`,
    { tag: ["@login", "@regression"] },
    async ({ loginPage }) => {
      await loginPage.goTo();
      await loginPage.verifyLoginError(
        "invalid_user",
        "Test@123",
        INVALID_CREDENTIALS_ERROR
      );
    }
  );
  test(
    `TID003 Lockedoutuser login`,
    { tag: ["@login", "@regression"] },
    async ({ loginPage }) => {
      await loginPage.goTo();
      await loginPage.verifyLoginError(
        "locked_out_user",
        "secret_sauce",
        LOCKED_OUT_ERROR
      );
    }
  );
});
