import { Locator, Page, expect } from "@playwright/test";
import { getRandomIndex } from "../utils/helper";

export class ProductsPage {
  page: Page;
  product: Locator;
  productText: Locator;
  addToCart: Locator;
  cartIcon: Locator;
  cartBadge: Locator;
  productListContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.product = page.locator(".inventory_item");
    this.productListContainer = page.locator(
      '[data-test="inventory-container"]'
    );
    this.productText = page.locator(".inventory_item_name ");
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Verifies that the product list container is visible and displays six products.
   * @returns A promise that resolves all the assertion passes
   * @author Pooja
   */
  async verifyproductListVisible() {
    await expect(this.productListContainer).toBeVisible();
    await expect(this.product).toHaveCount(6);
  }

  /**
   * Randomly selects a product from the list,retrives it's details,navigates to the product details page and returns the selected product information.
   * @returns A promise containing selected product Name,Price and Image.
   * @author Pooja
   */
  async randomlypickedproduct(): Promise<{
    productName: string;
    productPrice: string;
    productImage: string;
  }> {
    const count: number = await this.product.count();
    const randomIndex: number = getRandomIndex(count);
    const selectedproduct = this.product.nth(randomIndex);
    const productName = await selectedproduct
      .locator('[data-test="inventory-item-name"]')
      .innerText();
    const productPrice = await selectedproduct
      .locator('[data-test="inventory-item-price"]')
      .innerText();
    console.log("Listing price:", productPrice);
    const productImage = await selectedproduct
      .locator(".inventory_item_img img")
      .getAttribute("src");
    await selectedproduct.locator('[data-test$="-title-link"]').click();
    await expect(this.page).toHaveURL(/inventory-item\.html/);
    return { productName, productPrice, productImage: productImage ?? "" };
  }

  /**
   * Verifies the navigation to the cart page
   * @returns Promise that resolves when the navigation completes
   * @author Pooja
   */
  async goToCart() {
    await this.cartIcon.click();
  }

  /**
   * Randomly selects a product and adds it to the cart, Indentifies products with visible add to cart before selecting one.
   * @returns A promise that resolves to the name of the product added to the cart
   * @throws An error if no products are available to add it to the cart
   * @author Pooja
   */
  async addToCartMethod() {
    const count: number = await this.product.count();
    const availableProductsIndexes: number[] = [];

    for (let i = 0; i < count; i++) {
      const selectedProduct = this.product.nth(i);
      const addButton = selectedProduct.getByRole("button", {
        name: "Add to cart",
      });

      if (await addButton.isVisible()) {
        availableProductsIndexes.push(i);
      }
    }

    if (availableProductsIndexes.length === 0) {
      throw new Error("No products left to add to cart");
    }

    const randomIndex = getRandomIndex(availableProductsIndexes.length);
    const selectedProduct = this.product.nth(
      availableProductsIndexes[randomIndex]
    );

    const productName = await selectedProduct
      .locator('[data-test="inventory-item-name"]')
      .innerText();

    const productPrice = await selectedProduct
      .locator('[data-test="inventory-item-price"]')
      .innerText();

    await selectedProduct
      .getByRole("button", {
        name: "Add to cart",
      })
      .click();

    return { productName, productPrice };
  }

  async removeProductFromtheProducts() {
    const selectedProduct = this.product
      .filter({
        has: this.page.getByRole("button", { name: "Remove" }),
      })
      .first();
    await selectedProduct.getByRole("button", { name: "Remove" }).click();
  }

  /**
   * Verifies the cart badge with the expected item count.
   * @param count
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async verifyCartBadge(count: string): Promise<void> {
    await expect(this.cartBadge).toHaveText(count);
  }

  /**
   * filters the product list using the specifies keyword and verifies that the matching product is visible.
   * @param productkeyword
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async filteredProduct(productkeyword: string) {
    const matchingProduct = this.product.filter({
      hasText: productkeyword,
    });
    await expect(matchingProduct).toBeVisible();
  }
}
