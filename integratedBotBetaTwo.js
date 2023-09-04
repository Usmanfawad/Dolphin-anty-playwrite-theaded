//Current status
//refresh logic is working
//

//MOABB Beta 1

const { chromium } = require('playwright');

//-----------------------------------------------------HELPER FUNCTIONS----------------------------------------------

function randomDelay() {
    const typing_speed_range = [50, 200];
    return Math.floor(Math.random() * (typing_speed_range[1] - typing_speed_range[0] + 1) + typing_speed_range[0]);
}

async function human_like_typing(page, selector, text) {
    for (let char of text) {
        if (Math.random() < 0.05) {
            await page.press(selector, neighboringKey(char));
            await page.waitForTimeout(randomDelay());
            await page.press(selector, 'Backspace');
            await page.waitForTimeout(randomDelay());
        }
        await page.press(selector, char);
        await page.waitForTimeout(randomDelay());
    }
}

function neighboringKey(char) {
    const neighbors = {
        'a': ['s', 'q', 'z'],
        's': ['a', 'd', 'w', 'z', 'x'],
        'h': ['g', 'j', 'y'],
        'y': ['u', 't'],
        'i': ['o', 'l', 'u'],
        'o': ['p', 'l', 'i', 'k'],
        'e': ['w', 'r', 's', 'd']
    };
    if (neighbors[char]) {
        return neighbors[char][Math.floor(Math.random() * neighbors[char].length)];
    }
    return char;
}

//--------------------------------------------------------- LOGIN, DETECTION, SELECTORS, MESSAGES-------------------------------------------------------

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.bumble.com');
    console.log("Navigated to Bumble.");

    const loginSuccessSelector = '#main > div > div.page__layout > main > div.page__content-inner > div > div > span > div.encounters-user__controls > div > div:nth-child(2) > div > div:nth-child(2) > div > div.encounters-action__icon > span';
    await page.waitForSelector(loginSuccessSelector, { timeout: 210000 });
    console.log("Login selector identified, assuming successful login.");

    const sendButtonSelector = '#main > div > div.page__layout > main > div.message-field > div > button';
    const messageInputSelector = '#main > div > div.page__layout > main > div.message-field.is-focused > div > div.message-field__input > div > div > textarea.textarea__input';
    const openingMessages = ["hi", "hii", 'hiii', "hey", "heyy", "heyy", "hi hi", "hi hi hi"];
    const followUpMessages = [
        "Hi, sorry i'm so bad at messaging here if you wanna use snap mine's Andrea420x",
        "Hey sorry don't have my notifications on, probs better to use snap? Andrea420x",
        "Hiya do you have sc? i hardly use this sorry, mines Andrea420x ",
        "shit sorry!  Do you wanna use snap cause i legit never check this Anread420x"
    ];
    const specialKeywords = [ 'catfish', 'fake', 'faker', 'real', 'genuine', 'bot', 'legit', 'robot',
    'automated', 'AI', 'scam', 'true', 'fraud', 'sus', 'suss', 'suspect', 'suspicious',
    'questionable', 'report', 'alert', 'ban', 'block', 'pretend', 'wary', 'Catfish', 'Fake',
    'Faker', 'Real', 'Genuine', 'Bot', 'Legit','OnlyFans', 'Robot', 'Automated', 
    'AI', 'Scam', 'True', 'Fraud', 'Sus', 'Suss', 'Suspect', 'Suspicious', 'Questionable', 
    'Report', 'Report', 'Alert', 'Ban', 'Block', 'Pretend', 'Wary'];
    
    const specialResponses = ['ummm...wtf why??', 'why tf do people keep saying this am I just too hot or something?', 'your loss', 'seriously...?']; 

    let followedUpUIDs = new Set();

    //---------------------------------------------------------OPENING MESSAGE LOGIC-------------------------------------------------------------

    let totalMatchesMessaged = 0;
    let lastRefreshTime = Date.now(); 
    //RERESH TIMER
    const shouldRefresh = () => Date.now() - lastRefreshTime > (Math.random() * (4 * 60 * 1000 - 3 * 60 * 1000) + 3 * 60 * 1000);  // A function that checks if 3-4 minutes have passed since the last refresh
    
    while (totalMatchesMessaged < 100) { //        <-- !!!SET TOTAL OPENING MESSAGES TO SEND!!!
        for (let batch = 0; batch < 20; batch++) { // TOTAL NUMBER OF OPENING MESSAGES TO SEND IN ONE BATCH
            //CHECK IF WE NEED TO REFRESH
            if (shouldRefresh()) {
                console.log("Refreshing the page...");
                await page.reload({ waitUntil: 'load' });
                lastRefreshTime = Date.now();  // Reset the timer after the refresh
            }
    
            const buttonSelector = '//*[@id="main"]/div/div[1]/aside[1]/div/div[3]/div/div/section[1]/div/section/section/div[1]/ul/li[2]';
            try {
                await page.click(buttonSelector);
                const randomOpening = openingMessages[Math.floor(Math.random() * openingMessages.length)];
                await human_like_typing(page, messageInputSelector, randomOpening);
                await page.waitForTimeout(Math.random() * (1000 - 500) + 500);
                await page.click(sendButtonSelector);
                await page.waitForTimeout(3000);
            } catch (e) {
                console.error("Error sending message to match:", e);
            }
        }
    
        totalMatchesMessaged += 20; //CHNAGE THIS TO MATCH BATCH SIZE

            //--------------------------------------------------FOLLOW UP MESSAGE LOGIC--------------------------------------------------------------------


         console.log("Refreshing before starting follow-up logic...");
            await page.reload({ waitUntil: 'load' });
    
            console.log("Waiting between one and one and a half hours");
            await page.waitForTimeout(90000); // !!!SET TIME BETWEEN OPENING AND FOLLOWUP MESSAGES!!!
    
            const chatBoxBaseSelector = '#main > div > div.page__layout > aside.page__sidebar > div > div.sidebar__content.sidebar__content--main > div > div > section.contact-tabs__section.contact-tabs__section--conversations > div > div > div.scroll__inner > div';
            const notificationClass = 'has-notifications';
            let uidToMessage = null;
            let i = 1;
    
            while (true) {
                const chatBox = await page.$(`${chatBoxBaseSelector}:nth-child(${i})`);
                if (!chatBox) {
                    break;
                }
    
                await page.evaluate(el => el.scrollIntoView(), chatBox);
                console.log(`Scrolled chat box ${i} into view`); 
    
                const isNotified = await chatBox.evaluate((node, notificationClass) => node.classList.contains(notificationClass), notificationClass);
                if (isNotified) {
                    uidToMessage = await chatBox.evaluate(node => node.getAttribute('data-qa-uid'));
                    console.log(`Chat box ${i} has a notification! UID: ${uidToMessage}`);
                }
    
                await chatBox.evaluate(el => el.click());
                await page.waitForTimeout(1000); 
                console.log(`Clicked on chat box ${i}`);
    
                const chatToMessage = await page.$(`[data-qa-uid="${uidToMessage}"]`);
                if (chatToMessage && !followedUpUIDs.has(uidToMessage)) {
                    await page.waitForSelector(messageInputSelector); 
                    const lastMessageText = await page.$eval(messageInputSelector, el => el.textContent.trim());
                    let specialKeywordDetected = false;
    
                    for (let j = 0; j < specialKeywords.length; j++) {
                        if (lastMessageText.includes(specialKeywords[j])) {
                            const randomSpecialResponse = specialResponses[Math.floor(Math.random() * specialResponses.length)];
                            await human_like_typing(page, messageInputSelector, randomSpecialResponse);
                            followedUpUIDs.add(uidToMessage);
                            specialKeywordDetected = true;
                            break;
                        }
                    }
                    if (!specialKeywordDetected) {
                        await page.waitForSelector(messageInputSelector);
                        const randomFollowUp = followUpMessages[Math.floor(Math.random() * followUpMessages.length)];
                        await human_like_typing(page, messageInputSelector, randomFollowUp);
                        await page.waitForTimeout(Math.random() * (1000 - 500) + 500);
                        await page.click(sendButtonSelector);
                        console.log(`Sent a message to chat box with UID: ${uidToMessage}`);
                        followedUpUIDs.add(uidToMessage);
                        uidToMessage = null;
                    }
                } else if (uidToMessage) {
                    console.log(`Already sent a follow-up to UID: ${uidToMessage}`);
                }
    
                await page.waitForTimeout(1000 + Math.floor(Math.random() * 1000));
                i++;
            }
    
            console.log("Waiting for 30 seconds before resuming opening messages...");
            await page.waitForTimeout(30000); //SET THE TIME BETWEEN OPENING MESSAGES AND ANOTHER ROUND OF FOLLOWUP MESSAGES 
        }
    
        console.log("All matches processed.");
        await browser.close();
        console.log("Browser closed successfully.");
    
})();

    
