import { Locator, Page, expect } from "@playwright/test";
import { getRandomIndex } from "../utils/helper";

export class ProductsPage {
  readonly page: Page;
  readonly product: Locator;
  readonly productText: Locator;
  readonly addToCart: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly productListContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.product = page.locator(".inventory_item");
    this.productListContainer = page.locator(
      '[data-test="inventory-container"]'
    );
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Verifies that the product list container is visible and displays six products.
   * @returns A promise that resolves all the assertion passes
   * @author Pooja
   */
  async verifyProductListVisible(expectedCount: number): Promise<void> {
    await expect(this.productListContainer).toBeVisible();
    await expect(this.product).toHaveCount(expectedCount);
  }

  /**
   * Randomly selects a product from the list,retrives it's details,navigates to the product details page and returns the selected product information.
   * @returns A promise containing selected product Name,Price and Image.
   * @author Pooja
   */
  async openRandomProduct(): Promise<{
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
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /**
   * Randomly selects a product and adds it to the cart, Indentifies products with visible add to cart before selecting one.
   * @returns A promise that resolves to the name of the product added to the cart
   * @throws An error if no products are available to add it to the cart
   * @author Pooja
   */
  async addRandomProductToCart(): Promise<{
    productName: string;
    productPrice: string;
  }> {
    const availableProducts = this.product.filter({
      has: this.page.getByRole("button", { name: "Add to cart" }),
    });
    const count: number = await availableProducts.count();

    if (count === 0) {
      throw new Error("No products left to add the cart");
    }

    const selectedProduct = availableProducts.nth(getRandomIndex(count));
    const productName = await selectedProduct
      .locator('[data-test="inventory-item-name"]')
      .innerText();

    const productPrice = await selectedProduct
      .locator('[data-test="inventory-item-price"]')
      .innerText();

    await selectedProduct.getByRole("button", { name: "Add to cart" }).click();
    return { productName, productPrice };
  }

  /**
   * On the products page, clicks the Remove button of the first product
   * that is already in the cart, which removes it from the cart
   * @returns A promise that resolves when the product is removed
   * @author Pooja
   */
  async removeFirstProductInCart() {
    await this.product.getByRole("button", { name: "Remove" }).first().click();
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
  async verifyProductIsListed(productkeyword: string) {
    const matchingProduct = this.product.filter({
      hasText: productkeyword,
    });
    await expect(matchingProduct).toBeVisible();
  }
}
