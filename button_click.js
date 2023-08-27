// WORKING
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.bumble.com');
        console.log("Navigated to Bumble.");
        
        console.log("Please log in. Waiting for successful login detection...");
        await page.waitForSelector('#main > div > div.page__layout > main > div.page__content-inner > div > div > span > div.encounters-user__controls > div > div:nth-child(2) > div > div:nth-child(2) > div > div.encounters-action__icon > span', { timeout: 210000 });
        console.log("Login selector identified, assuming successful login.");

    } catch (e) {
        console.log("Error during navigation or login detection:", e.message);
    }

    let matchIndex = 1;  // Start with button a for testing
    while (true) {
        const buttonSelector = `#main > div > div.page__layout > aside.page__sidebar > div > div.sidebar__content.sidebar__content--main > div > div > section.contact-tabs__section.contact-tabs__section--matches > div > section > section > div.scrollable-carousel__items > ul > li:nth-child(${matchIndex}) > div`;
        
        try {
            await page.click(buttonSelector);
            console.log(`Button ${matchIndex} clicked.`);
            await page.waitForTimeout(Math.random() * (1700 - 800) + 800); // Random wait between 0.8 and 1.7 seconds.
            matchIndex++; // Move to the next button

        } catch (e) {
            if (e.message.includes("No node found for selector")) {
                console.log(`Button ${matchIndex} not found. Assuming end of matches.`);
            } else {
                console.log(`Error while trying to click Button ${matchIndex}:`, e.message);
            }
            console.log(`Total matches = ${matchIndex - 1}`);  // Subtract 1 from the current index to get the number of successful matches.
            break;
        }
    }

    // Wait for a few seconds before closing
    console.log("Waiting for 10 seconds before closing the browser...");
    await page.waitForTimeout(10000);

    try {
        await browser.close();
        console.log("Browser closed successfully.");

    } catch (e) {
        console.log("Error while trying to close the browser:", e.message);
    }

})();
