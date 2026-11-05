import { test, expect } from "../fixtures/contextFixture";
import { testUsers } from "../testdata/credentials";
import { sortCases } from "../testdata/sortingData";

const EXPECTED_PRODUCT_COUNT = 6;

test.describe("Product Sorting", () => {
  for (const user of testUsers) {
    for (const { id, option, sortBy, order, startFrom } of sortCases) {
      test(
        `${id} - Sort by ${option} - ${user.userName}`,
        { tag: ["@products", "@sorting", "@regression"] },
        async ({ loginAs, productsPage }) => {
          test.skip(
            sortBy === "price" && user.userName === "visual_user",
            "Visual user shows random prices on the products page (visual bug)"
          );
          await loginAs(user.userName, user.password);
          if (startFrom) {
            await productsPage.sortBy(startFrom);
          }
          await productsPage.sortBy(option);

          if (sortBy === "name") {
            const names = await productsPage.getProductNames();
            const expected = [...names].sort((a, b) => a.localeCompare(b));
            if (order === "descending") {
              expected.reverse();
            }
            await expect(productsPage.productNames).toHaveCount(
              EXPECTED_PRODUCT_COUNT
            );
            expect(names, `Products are not sorted by ${option}`).toEqual(
              expected
            );
          } else {
            const prices = await productsPage.getProductPrices();
            const expected = [...prices].sort((a, b) => a - b);
            if (order === "descending") expected.reverse();

            expect(prices).toHaveLength(EXPECTED_PRODUCT_COUNT);
            expect(prices, `Products are not sorted by ${option}`).toEqual(
              expected
            );
          }
        }
      );
    }
  }
});
