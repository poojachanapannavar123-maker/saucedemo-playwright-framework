import { Page, Locator, expect } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly loginButton: Locator;
  readonly productList: Locator;
  readonly invalidError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.getByPlaceholder("Username");
    this.password = page.getByPlaceholder("Password");
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.productList = page.locator('[data-test="inventory-container"]');
    this.invalidError = page.getByRole("alert");
  }

  /**
   * Navigate to the application base url
   * @returns Promise that resolves when the navigation completes
   * @author Pooja
   */
  async goTo(): Promise<void> {
    await this.page.goto("/");
  }

  /**
   * fills in the username and password and clicks the login button
   * @param userName
   * @param password
   * @returns A promise that resolves when login button is clicked
   * @author Pooja
   */
  private async submitCredentials(
    userName: string,
    password: string
  ): Promise<void> {
    await this.username.fill(userName);
    await this.password.fill(password);
    await this.loginButton.click();
  }

  /**
   * Logs in to the application using valid username and password and verifies successful navigation
   * @param userName
   * @param password
   * @returns A promise that resolves when the login assertion passed
   * @author Pooja
   */
  async validLoginMethod(userName: string, password: string): Promise<void> {
    await this.submitCredentials(userName, password);
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.productList).toBeVisible();
  }

  /**
   * Attempts to log in and verifies the expected error message is shown
   * @param userName
   * @param password
   * @param expectedError
   * @returns A Promose that resolves when the error assertion passes
   * @author Pooja
   */
  async verifyLoginError(
    userName: string,
    password: string,
    expectedError: string
  ): Promise<void> {
    await this.submitCredentials(userName, password);
    await expect(
      this.invalidError,
      "Login error message is not as expected"
    ).toContainText(expectedError);
  }
}
