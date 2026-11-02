import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly itemNames: Locator;
  readonly removeButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly cartBadge: Locator;
  readonly itemPrices: Locator;

  constructor(page: Page) {
    this.page = page;
    this.itemNames = page.locator(
      '.cart_item [data-test="inventory-item-name"]'
    );

    this.itemPrices = page.locator(
      '.cart_item [data-test="inventory-item-price"]'
    );
    this.removeButton = page.getByRole("button", {
      name: "Remove",
    });

    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });

    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   * Verifies the product name and price on the cart page and visibility of the cart page buttons
   * @param productName
   * @param productPrice
   * @returns A promise that resolves when all cart detail assertion passes
   * @author Pooja
   */
  async verifyCartDetails(
    productName: string,
    productPrice: string
  ): Promise<void> {
    await expect(this.itemNames).toHaveText(productName);
    await expect(this.itemPrices).toHaveText(productPrice);
    await expect(this.removeButton).toBeVisible();
    await expect(this.continueShoppingButton).toBeVisible();
    await expect(this.checkoutButton).toBeVisible();
  }

  /**
   * Removes the only product in the cart and verifies the cart is empty
   * @returns A promise that resolves when the cart is empty
   * @author Pooja
   */
  async removeProductAndVerifyCartEmpty(): Promise<void> {
    await expect(this.removeButton).toBeVisible();
    await this.removeButton.first().click();
    await expect(this.itemNames).toHaveCount(0);
    await expect(this.cartBadge).toBeHidden();
  }

  /**
   * verifies the cart contains exactly the given products,in the given order
   * @param expectedNames The productNames expected in the cart
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async verifyProductsInCart(expectedNames: string[]): Promise<void> {
    await expect(this.itemNames).toHaveText(expectedNames);
  }

  /**
   * clicks continue shopping and verifies the products page is shown
   * @returns A promise that resolves when the navigation assertion passes
   * @author Pooja
   */
  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  /**
   * Clicks checkout and verifies the checkout information page is shown
   * @returns A promise that resolves when the navigation assertion passes
   * @author Pooja
   */
  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}
