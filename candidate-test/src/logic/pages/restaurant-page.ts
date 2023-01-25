import { Page } from "playwright";
import { PageBase } from "./page-base";

const CREATE_NEW_RESTURANT_BUTTON = "//button[contains(text(),'Create new')]";
const POPUP_TITLE = "//h2[contains(text(),'Create new restaurant')]"

export class RestaurantPage extends PageBase {

    constructor(page: Page) {
        super(page);
    }

    clickreateNewRestaurantButtone = async () => {
        await this.page.click(CREATE_NEW_RESTURANT_BUTTON);
    }
    checkIfTitleInPopupExcit = async () => {
        return await this.page.isVisible(POPUP_TITLE);
    }
}