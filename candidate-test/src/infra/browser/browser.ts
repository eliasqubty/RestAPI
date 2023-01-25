import { BrowserContext, chromium, Page } from "playwright";
import { PageBase } from '../../logic/pages/page-base';

export class BrowserWrapper {

    browserContext: BrowserContext | undefined
    browserTimestemp: string;
    userDataDir: string | undefined

    constructor() {
        this.browserTimestemp = new Date().toString();
    }

    close = async () => {
        await this.browserContext?.close()
    }

    private getContext = async (testName?: string) => {
        if (!this.browserContext) {
            let browserContextArgs = [
                '--ignore-certificate-errors',
                '--no-sandbox'];
            this.browserContext =
                await (await chromium.launch({
                    headless: false, args: browserContextArgs
                }))
                    .newContext({
                        viewport: { width: 1280, height: 1024 },
                    });
        }
        return this.browserContext;
    }

    getPage = async (testName?: string) => {
        const context = await this.getContext(testName);
        if (context.pages().length == 0) {
            return await context.newPage();
        } else {
            return context.pages()[0];
        }
    }

    newPage = async <T extends PageBase>(pageType: new (page: Page) => T, url?: string, testName?: string) => {
        let newPage = await this.getPage(testName);
        if (url) {
            await newPage.goto(url)
        }
        let page = new pageType(newPage)
        await page.initPage()
        return page
    }

}