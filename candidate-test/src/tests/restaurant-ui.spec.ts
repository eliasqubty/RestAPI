import { expect } from 'chai';
import { RestaurantPage } from '../logic/pages/restaurant-page';
import { BrowserWrapper } from '../infra/browser/browser';
import configJson from '../../config.json';


describe('UI tests', () => {
    let browser: BrowserWrapper;
    let resturantPage: RestaurantPage;

    beforeEach('Start browser', async () => {
        browser = new BrowserWrapper();
        resturantPage = await browser.newPage(RestaurantPage, configJson.baseUiUrl);
    })

    afterEach('Close browser', async () => {
        await browser.close();
    })

    it('Validate "Create new Restaurant Popup" opened', async function () {
        await resturantPage.clickreateNewRestaurantButtone();
        let actualResult = await resturantPage.checkIfTitleInPopupExcit();
        expect(actualResult, 'Restaurants popup was not opened').to.be.true;
    })
})


