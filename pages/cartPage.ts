import { Page, Locator, expect } from "@playwright/test";

export class CartPage {
  page: Page;
  productNameonCart: Locator;
  removebuttonvisible: Locator;
  continueshoppingbuttononcart: Locator;
  checkoutoncart: Locator;
  cartBadge: Locator;
  productPriceonCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productNameonCart = page.locator(
      '.cart_item [data-test="inventory-item-name"]'
    );

    this.productPriceonCart = page.locator(
      '[data-test="inventory-item-price"]'
    );
    this.removebuttonvisible = page.getByRole("button", {
      name: "Remove",
    });

    this.continueshoppingbuttononcart = page.getByRole("button", {
      name: "Continue Shopping",
    });

    this.checkoutoncart = page.getByRole("button", { name: "Checkout" });
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async verifyCartDetails(
    productName: string,
    productPrice: string
  ): Promise<void> {
    await expect(this.productNameonCart).toHaveText(productName);
    await expect(this.productPriceonCart).toHaveText(productPrice);
    await expect(this.removebuttonvisible).toBeVisible();
    await expect(this.continueshoppingbuttononcart).toBeVisible();
    await expect(this.checkoutoncart).toBeVisible();
  }

  async removeProductfromCart() {
    await expect(this.removebuttonvisible).toBeVisible();
    await this.removebuttonvisible.first().click();
    await expect(this.productNameonCart).toHaveCount(0);
    await expect(this.cartBadge).toHaveCount(0);
  }

  async multipleProductsonCart(firstProduct: string, secondProduct: string) {
    await expect(this.productNameonCart.nth(0)).toHaveText(firstProduct);
    await expect(this.productNameonCart.nth(1)).toHaveText(secondProduct);
  }

  async continueShopping() {
    await this.continueshoppingbuttononcart.click();
    await expect(this.page).toHaveURL(/inventory\.html/);
  }

  async checkoutonCart() {
    await this.checkoutoncart.click();
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}
