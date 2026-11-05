import { Locator, Page, expect } from "@playwright/test";
import { getRandomIndex, toCents } from "../utils/helper";

export class ProductsPage {
  readonly page: Page;
  readonly product: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly productListContainer: Locator;

  readonly sortDropdown: Locator;
  readonly activeSortOption: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.product = page.locator(".inventory_item");
    this.productListContainer = page.locator(
      '[data-test="inventory-container"]'
    );
    this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');

    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.activeSortOption = page.locator('[data-test="active-option"]');
    this.productNames = page.locator('[data-test="inventory-item-name"]');
    this.productPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /**
   * Verifies that the product list container is visible and displays expected number of products.
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
   * Clicks the cart icon to open the cart page
   * @returns Promise that resolves when the navigation completes
   * @author Pooja
   */
  async goToCart(): Promise<void> {
    await this.cartIcon.click();
  }

  /**
   *Randomly selects a product that is not yet in the cart and adds it to the cart
   * @returns A promise that resolves to the name and price of the added product
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
      throw new Error("No products left to add to the cart");
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
  async removeFirstProductInCart(): Promise<void> {
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
   *Verifies that a product with the given name is shown in the list
   * @param productName
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async verifyProductIsListed(productName: string): Promise<void> {
    const matchingProduct = this.product.filter({
      hasText: productName,
    });
    await expect(matchingProduct).toBeVisible();
  }

  /**
   * selects a sort option by it's visible label abd verifies it's applied
   * @param optionLabel the label shown in the dropdown : eg: Price low to high
   * @return A promise that resolves when the option is active
   * @author Pooja
   */
  async sortBy(optionLabel: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: optionLabel });
    await expect(this.activeSortOption).toHaveText(optionLabel);
  }

  /**
   * Reads the product names in the order they are shown
   * @returns The product names
   * @author Pooja
   */
  async getProductNames(): Promise<string[]> {
    return this.productNames.allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const priceTexts = await this.productPrices.allInnerTexts();
    return priceTexts.map(toCents);
  }
}
