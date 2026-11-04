import { Page, Locator, expect } from "@playwright/test";
import { CustomerInfo } from "../testdata/checkoutData";
import { toCents } from "../utils/helper";

export class CheckoutPage {
  readonly page: Page;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;

  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemTotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  readonly completeHeader: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.postalCodeInput = page.getByPlaceholder("Zip/Postal Code");
    this.continueButton = page.locator('[data-test="continue"]');
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.errorMessage = page.locator('[data-test="error"]');

    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');

    this.itemTotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');
    this.finishButton = page.getByRole("button", { name: "Finish" });

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  /**
   *Fills in the customer information form on checkout step one
   * @param customer
   * @returns A promise that resolves when all the fields are filled
   * @author Pooja
   */
  async fillCustomerInformation(customer: CustomerInfo): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  /**
   *Clicks Continue and verifies the checkout overview page is shown
   * @returns A promise that resolves when the overview page is open
   * @author Pooja
   */
  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
  }

  /**
   * Verifies the overview lists exactly the given products, in order
   * @param expectedNames The product names expected on the overview
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async verifyOverviewItems(expectedNames: string[]): Promise<void> {
    await expect(this.itemNames).toHaveText(expectedNames);
  }

  /**
   *Verifies the overview lists exactly the given products, in order
   * @param expectedMessage expectedNames The product names expected on the overview
   * @returns A promise that resolves when the assertion passes
   * @author Pooja
   */
  async finishOrder(expectedMessage: string): Promise<void> {
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
    await expect(
      this.completeHeader,
      "Order confirmation message is not as expected"
    ).toHaveText(expectedMessage);
    await expect(
      this.cartBadge,
      "Cart should be empty after the order"
    ).toBeHidden();
  }

  /**
   * Clicks Continue and verifies the expected validation error is shown
   * @param expectedError The error text that should appear
   *  @returns A promise that resolves when the error assertion passes
   * @author Pooja
   */
  async verifyErrorOnContinue(expectedError: string): Promise<void> {
    await this.continueButton.click();
    await expect(
      this.errorMessage,
      "Checkout validation error is not as expected"
    ).toHaveText(expectedError);
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }

  /**
   *  Reads the item prices and the summary amounts from the overview page
   * @returns  Item prices, item total, tax and total, all in cents
   * @author Pooja
   */
  async getOrderSummary(): Promise<{
    itemPrices: number[];
    itemTotal: number;
    tax: number;
    total: number;
  }> {
    const priceTexts = await this.itemPrices.allInnerTexts();
    return {
      itemPrices: priceTexts.map(toCents),
      itemTotal: toCents(await this.itemTotalLabel.innerText()),
      tax: toCents(await this.taxLabel.innerText()),
      total: toCents(await this.totalLabel.innerText()),
    };
  }

  /**
   * Clicks Cancel on the information step and verifies the cart page is shown
   * @returns A promise that resolves when the cart page is open
   * @author Pooja
   */
  async cancelToCart(): Promise<void> {
    await this.cancelButton.click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }
}
