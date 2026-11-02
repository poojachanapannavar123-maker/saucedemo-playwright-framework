import { testUsers, products } from "../testdata/credentials";
import { test } from "../fixtures/contextFixture";

for (const user of testUsers) {
  test.describe("Sauce Demo Product details Page", () => {
    test(
      `TID008-product description page actions - ${user.userName}`,
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
      `TID009-verify add to cart button changes to remove-${user.userName}`,
      { tag: ["@pdp", "@regression"] },
      async ({ loginAs, productsPage, productDetailsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.openRandomProduct();
        await productDetailsPage.verifyAddAndRemoveFromCart();
      }
    );

    test(
      `TID010-Verify Back to Products navigation -${user.userName}`,
      { tag: ["@pdp", "@regression"] },
      async ({ loginAs, productsPage, productDetailsPage }) => {
        await loginAs(user.userName, user.password);
        await productsPage.openRandomProduct();
        await productDetailsPage.verifyBackToProductsNavigation();
      }
    );
  });
}
