import { Page } from "playwright";
import { ComponentBase } from "./component-base";

export class PageBase extends ComponentBase {

  constructor(page: Page) {
    super(page);
  }

  async initPage() {
    return await this.page.waitForLoadState('load')
  }

  bringToFront = async () => {
    return this.page.bringToFront()
  }

  close = async () => {
    return this.page.close()
  }

  reloadPage = async () => {
    await this.page.reload({ waitUntil: "domcontentloaded" });
  }

}