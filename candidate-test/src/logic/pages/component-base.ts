import { Page } from "playwright";
export class ComponentBase {
    protected page: Page;

    constructor(page: Page) {
        this.page= page;
    }
}