import { testUsers, products } from "../testdata/credentials";
import { test } from "../fixtures/contextFixture";

for (const user of testUsers) {
  test.describe("Sauce Demo Products Page", () => {
    test(
      `TID004-category actions - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.randomlypickedproduct();
      }
    );

    test(
      `TID005- Add selected product to the cart - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addToCartMethod();
      }
    );

    test(
      `TID006 - Cart Badge count verification - ${user.userName}`,
      { tag: ["@products", "@smoke"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);

        for (let count = 1; count <= 6; count++) {
          await productsPage.addToCartMethod();
          await productsPage.verifyCartBadge(count.toString());
        }
      }
    );

    test(
      `TID007 - Remove product and verify cart badge - ${user.userName}`,
      { tag: ["@products", "@regression"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.addToCartMethod();
        await productsPage.addToCartMethod();
        await productsPage.verifyCartBadge("2");
        await productsPage.removeProductFromtheProducts();
        await productsPage.verifyCartBadge("1");
      }
    );

    test(
      `TID008- Search product - ${user.userName}`,
      { tag: ["@products", "@regression"] },
      async ({ loginAs, productsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.filteredProduct(products);
      }
    );
  });
}
