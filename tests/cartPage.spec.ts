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
          await productsPage.addToCartMethod();
        await productsPage.goToCart();

        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );

    test(
      `TID012- Remove product from the cart - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addToCartMethod();
        await productsPage.goToCart();
        await cartPage.removeProductfromCart();
      }
    );

    test(
      `TID013 - Add two products and verify both appear - ${user.userName}`,
      { tag: ["@cart", "@regression"] },
      async ({ loginAs, productsPage, cartPage }) => {
        await loginAs(user.userName, user.password);
        const firstProduct = await productsPage.addToCartMethod();
        const secondProduct = await productsPage.addToCartMethod();
        await productsPage.goToCart();
        await cartPage.multipleProductsonCart(
          firstProduct.productName,
          secondProduct.productName
        );
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
        await cartPage.checkoutonCart();
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
          await productsPage.addToCartMethod();
        await productsPage.goToCart();
        await page.reload();
        await cartPage.verifyCartDetails(productName, productPrice);
      }
    );
  });
}
