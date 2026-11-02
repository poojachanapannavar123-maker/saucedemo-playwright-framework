import { testUsers, products } from "../testdata/credentials";
import { test } from "../fixtures/contextFixture";

test.describe("Product Details Page", () => {
  for (const user of testUsers) {
    test(
      `TID009 - Details match the products list - ${user.userName}`,
      { tag: ["@pdp", "@regression"] },
      async ({ loginAs, productsPage, productDetailsPage }) => {
        test.skip(
          user.userName === "visual_user",
          "PDP price consistency test is for standard users"
        );

        await loginAs(user.userName, user.password);
        const selectedProduct = await productsPage.openRandomProduct();

        await productDetailsPage.verifyProductDetails(
          selectedProduct.productName,
          selectedProduct.productPrice,
          selectedProduct.productImage
        );
      }
    );

    test(
      `TID010 - Add and remove from the details page - ${user.userName}`,
      { tag: ["@pdp", "@regression"] },
      async ({ loginAs, productsPage, productDetailsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.openRandomProduct();
        await productDetailsPage.verifyAddAndRemoveFromCart();
      }
    );

    test(
      `TID011 - Back to products navigation - ${user.userName}`,
      { tag: ["@pdp", "@regression"] },
      async ({ loginAs, productsPage, productDetailsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.openRandomProduct();
        await productDetailsPage.verifyBackToProductsNavigation();
      }
    );
  }
});
