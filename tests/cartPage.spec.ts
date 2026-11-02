import { test } from "../fixtures/contextFixture";
import { testUsers } from "../testdata/credentials";

test.describe("Cart Page", () => {
  for (const user of testUsers) {
    test(
      `TID012 - Cart shows the added product and price - ${user.userName}`,
      { tag: ["@cart", "@smoke"] },
      async ({ loginAs, productsPage, cartPage }) => {
        test.skip(
          user.userName === "visual_user",
          "visual_user shows wrong prices on the products page (known visual bug)"
        );
        await loginAs(user.userName, user.password);

        const { productName, productPrice } =
          await productsPage.addRandomProductToCart();
        await productsPage.goToCart();

        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );

    test(
      `TID013 - Remove product empties the cart - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await cartPage.removeProductAndVerifyCartEmpty();
      }
    );

    test(
      `TID014 - Two products appear in the cart in order - ${user.userName}`,
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
      `TID015 - Continue shopping returns to products - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.goToCart();
        await cartPage.continueShopping();
      }
    );

    test(
      `TID016 - Checkout opens the checkout page - ${user.userName}`,
      { tag: ["@cart", "@smoke"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.goToCart();
        await cartPage.goToCheckout();
      }
    );

    test(
      `TID017 - Cart keeps items after page refresh - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage, page }) => {
        test.skip(
          user.userName === "visual_user",
          "visual_user shows wrong prices on the products page (known visual bug)"
        );
        await loginAs(user.userName, user.password);
        const { productName, productPrice } =
          await productsPage.addRandomProductToCart();
        await productsPage.goToCart();
        await page.reload();
        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );
  }
});
