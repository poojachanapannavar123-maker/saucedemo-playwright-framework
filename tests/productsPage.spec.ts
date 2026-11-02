import { testUsers, products } from "../testdata/credentials";
import { test } from "../fixtures/contextFixture";

test.describe("Products Page", () => {
  for (const user of testUsers) {
    test(
      `TID004- Open a random product - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.openRandomProduct();
      }
    );

    test(
      `TID005- Add a random product to the cart - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addRandomProductToCart();
      }
    );

    test(
      `TID006 - Cart badge counts up to 6 - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);

        for (let count = 1; count <= 6; count++) {
          await productsPage.addRandomProductToCart();
          await productsPage.verifyCartBadge(count.toString());
        }
      }
    );

    test(
      `TID007 -  Remove a product from the list updates the badge - ${user.userName}`,
      { tag: ["@products", "@regression"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addRandomProductToCart();
        await productsPage.addRandomProductToCart();
        await productsPage.verifyCartBadge("2");
        await productsPage.removeFirstProductInCart();
        await productsPage.verifyCartBadge("1");
      }
    );

    test(
      `TID008- Product from test data is listed - ${user.userName}`,
      { tag: ["@products", "@regression"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.verifyProductIsListed(products);
      }
    );
  }
});
