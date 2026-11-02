import { test } from "../fixtures/contextFixture";
import { testUsers, products } from "../testdata/credentials";

for (const user of testUsers) {
  test.describe("Cart Page", () => {
    test(
      `TID011- Cart page verification - ${user.userName}`,
      { tag: ["@cart", "@smoke"] },
      async ({ loginAs, productsPage, cartPage }) => {
        test.skip(
          user.userName === "visual_user",
          "PDP price consistency test is for standard users"
        );
        await loginAs(user.userName, user.password);

        const { productName, productPrice } =
          await productsPage.addRandomProductToCart();
        await productsPage.goToCart();

        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );

    test(
      `TID012- Remove product from the cart - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.removeProductAndVerifyCartEmpty();
      }
    );

    test(
      `TID013 - Add two products and verify both appear - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        const firstProduct = await productsPage.addRandomProductToCart();
        const secondProduct = await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.verifyProductsInCart([
          firstProduct.productName,
          secondProduct.productName,
        ]);
      }
    );

    test(
      `TID014 - Continue Shopping - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.goToCart();
        await cartPage.continueShopping();
      }
    );

    test(
      `TID015 - Checkout from cart - ${user.userName}`,
      { tag: ["@cart", "@smoke"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.goToCart();
        await cartPage.goToCheckout();
      }
    );

    test(
      `TID016 - Verify cart after page refresh - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage, page }) => {
        test.skip(
          user.userName === "visual_user",
          "PDP price consistency test is for standard users"
        );
        await loginAs(user.userName, user.password);
        const { productName, productPrice } =
          await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await page.reload();
        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );
  });
}
