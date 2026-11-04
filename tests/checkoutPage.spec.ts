import { test } from "../fixtures/contextFixture";
import { testUsers } from "../testdata/credentials";
import {
  validCustomer,
  ORDER_COMPLETE_MESSAGE,
} from "../testdata/checkoutData";

test.describe("Checkout", () => {
  for (const user of testUsers) {
    test(
      `TID018 - Complete an order end to end - ${user.userName}`,
      { tag: ["@checkout", "@smoke"] },
      async ({ loginAs, productsPage, cartPage, checkoutPage }) => {
        await loginAs(user.userName, user.password);
        const { productName } = await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.goToCheckout();
        await checkoutPage.fillCustomerInformation(validCustomer);
        await checkoutPage.continueToOverview();
        await checkoutPage.verifyOverviewItems([productName]);
        await checkoutPage.finishOrder(ORDER_COMPLETE_MESSAGE);
      }
    );
  }
});
