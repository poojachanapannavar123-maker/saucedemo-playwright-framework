import { test, expect } from "../fixtures/contextFixture";
import { testUsers } from "../testdata/credentials";
import {
  validCustomer,
  ORDER_COMPLETE_MESSAGE,
  TAX_RATE,
  missingFieldCases,
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

    for (const { id, field, customer, expectedError } of missingFieldCases) {
      test(
        `${id} - Missing ${field} shows an error - ${user.userName}`,
        { tag: ["@checkout", "@regression"] },
        async ({ loginAs, cartPage, productsPage, checkoutPage }) => {
          await loginAs(user.userName, user.password);
          await productsPage.addRandomProductToCart();
          await productsPage.goToCart();
          await cartPage.goToCheckout();
          await checkoutPage.fillCustomerInformation(customer);
          await checkoutPage.verifyErrorOnContinue(expectedError);
        }
      );
    }

    test(
      `TID022 - Order totals add up correctly - ${user.userName}`,
      { tag: ["@checkout", "@regression"] },
      async ({ loginAs, productsPage, cartPage, checkoutPage }) => {
        await loginAs(user.userName, user.password);
        const first = await productsPage.addRandomProductToCart();
        const second = await productsPage.addRandomProductToCart();
        const third = await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.goToCheckout();
        await checkoutPage.fillCustomerInformation(validCustomer);
        await checkoutPage.continueToOverview();
        await checkoutPage.verifyOverviewItems([
          first.productName,
          second.productName,
          third.productName,
        ]);
        const summary = await checkoutPage.getOrderSummary();
        const sumOfItems = summary.itemPrices.reduce(
          (sum, price) => sum + price,
          0
        );
        const expectedTax = Math.round(summary.itemTotal * TAX_RATE);

        expect(
          summary.itemTotal,
          "Item total should equal the sum of the item prices"
        ).toBe(sumOfItems);

        expect(
          Math.abs(summary.tax - expectedTax),
          "Tax should be 8% of the total (within 1 cent of rounding"
        ).toBeLessThanOrEqual(1);

        expect(summary.total, "Total should equal item total plus tax").toBe(
          summary.itemTotal + summary.tax
        );
      }
    );

    test(
      `TID023 - Cancel at information step keeps the cart - ${user.userName}`,
      { tag: ["@checkout", "@regression"] },
      async ({ loginAs, productsPage, cartPage, checkoutPage }) => {
        await loginAs(user.userName, user.password);
        const { productName } = await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.goToCheckout();
        await checkoutPage.cancelToCart();
        await cartPage.verifyProductsInCart([productName]);
      }
    );
  }
});
