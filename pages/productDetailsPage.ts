import { Page, Locator, expect } from "@playwright/test";

export class ProductDetailsPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly nameLabel: Locator;
  readonly priceLabel: Locator;
  readonly image: Locator;
  readonly description: Locator;
  readonly removeButton: Locator;
  readonly cartBadge: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameLabel = page.locator(
      '.inventory_details [data-test="inventory-item-name"]'
    );
    this.priceLabel = page.locator(
      '.inventory_details [data-test="inventory-item-price"]'
    );
    this.image = page.locator(".inventory_details_img");
    this.description = page.locator(
      '.inventory_details [data-test="inventory-item-desc"]'
    );
    this.addToCartButton = page
      .locator(".inventory_details")
      .getByRole("button", { name: "Add to cart", exact: true });

    this.removeButton = page.getByRole("button", { name: "Remove" });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.backToProductsButton = page.locator('[data-test="back-to-products"]');
  }

  /**
   * Verifies the product details page including productName,productPrice,productImage,description and add to cart buttons
   * @param productName
   * @param productPrice
   * @param productImage
   * @returns A promise that resolves when all product details assertion passes
   * @author Pooja
   */
  async verifyProductDetails(
    productName: string,
    productPrice: string,
    productImage: string
  ): Promise<void> {
    await expect(
      this.nameLabel,
      "Product name on the details page does not match the products list "
    ).toHaveText(productName);
    await expect(
      this.priceLabel,
      "Product price on the details page does not match the products list"
    ).toHaveText(productPrice);
    await expect(
      this.image,
      "Product image on the details page does not match the products list"
    ).toHaveAttribute("src", productImage);
    await expect(
      this.description,
      "Product description should not be empty"
    ).not.toBeEmpty();
    await expect(
      this.addToCartButton,
      "Add to cart should be visible"
    ).toBeVisible();
    await expect(
      this.addToCartButton,
      "Add to cart button should be enabled"
    ).toBeEnabled();
  }

  /**
   * Adds the product to the cart from the details page, verifies the Remove button and cart badge, then removes it again
   * @returns A promise that resolves when all the assertion passes
   * @author Pooja
   */
  async verifyAddAndRemoveFromCart(): Promise<void> {
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.cartBadge).toBeHidden();

    await this.addToCartButton.click();
    await expect(this.removeButton).toBeVisible();

    await expect(this.cartBadge).toHaveText("1");
    await this.removeButton.click();
    await expect(this.addToCartButton).toBeVisible();
    await expect(this.cartBadge).toBeHidden();
  }

  /**
   * Clicks Back to products and verifies the products page is shown
   * @returns A promise that resolves when navigation and the URL assertion passes
   * @author Pooja
   */
  async verifyBackToProductsNavigation(): Promise<void> {
    await this.backToProductsButton.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }
}
