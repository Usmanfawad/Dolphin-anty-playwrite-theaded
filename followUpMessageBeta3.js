const { chromium } = require('playwright');

// Human-like typing functions
function randomDelay() {
    const typing_speed_range = [50, 200];
    return Math.floor(Math.random() * (typing_speed_range[1] - typing_speed_range[0] + 1) + typing_speed_range[0]);
}

async function human_like_typing(page, selector, text) {
    for (let char of text) {
        if (Math.random() < 0.05) {  // 5% chance of a typo
            await page.press(selector, neighboringKey(char));  // Makes a typo using a neighboring key
            await page.waitForTimeout(randomDelay());
            await page.press(selector, 'Backspace');  // corrects the typo
            await page.waitForTimeout(randomDelay());
        }
        await page.press(selector, char);  // Types the actual character
        await page.waitForTimeout(randomDelay());  // Waits for a random time
    }
}

function neighboringKey(char) {
    const neighbors = {
        'a': ['s', 'q', 'z'],
        's': ['a', 'd', 'w', 'z', 'x'],
        // ... add more keys and their neighbors
    };
    if (neighbors[char]) {
        return neighbors[char][Math.floor(Math.random() * neighbors[char].length)];
    }
    return char;
}

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto('https://www.bumble.com');
    console.log("Navigated to Bumble.");

    const loginSuccessSelector = '#main > div > div.page__layout > main > div.page__content-inner > div > div > span > div.encounters-user__controls > div > div:nth-child(2) > div > div:nth-child(2) > div > div.encounters-action__icon > span';
    await page.waitForSelector(loginSuccessSelector, { timeout: 210000 });
    console.log("Login selector identified, assuming successful login.");

    const chatBoxBaseSelector = '#main > div > div.page__layout > aside.page__sidebar > div > div.sidebar__content.sidebar__content--main > div > div > section.contact-tabs__section.contact-tabs__section--conversations > div > div > div.scroll__inner > div';
    const notificationClass = 'has-notifications';
    const sendButtonSelector = '#main > div > div.page__layout > main > div.message-field > div > button';
    const messageInputSelector = '#main > div > div.page__layout > main > div.message-field.is-focused > div > div.message-field__input > div > div > textarea.textarea__input';
    const greetings = ["Hi, sorry i'm so bad at messaging here! if you wanna use snap mine's dadayanyx ", "Hey sorry don't have my notifications on, probs better to use snap? dadayanyx ", "Hiya do you have sc? i hardly use this sorry, mines dadayanyx", "heyy i'd rather use snap cause i dont check this...dadaynayx"];
    //const greetings = ['hmm send me yours??'];
    let i = 1;
    let uidToMessage = null;
    
    while (true) {
        const chatBox = await page.$(`${chatBoxBaseSelector}:nth-child(${i})`);
        
        // Break if no more chat boxes are found
        if (!chatBox) {
            break;
        }

        await page.evaluate(el => el.scrollIntoView(), chatBox);
        console.log(`Scrolled chat box ${i} into view`);

        // Check if the current chat box has a notification
        const isNotified = await chatBox.evaluate((node, notificationClass) => node.classList.contains(notificationClass), notificationClass);


        if (isNotified) {
            uidToMessage = await chatBox.evaluate(node => node.getAttribute('data-qa-uid'));
            console.log(`Chat box ${i} has a notification! UID: ${uidToMessage}`);
        }
    
        // Click the chat box to move to the next one
        await chatBox.click();
        console.log(`Clicked on chat box ${i}`);
    
        // If we identified a chat box with a notification, find it using its UID and send a message
        if (uidToMessage) {
            const chatToMessage = await page.$(`[data-qa-uid="${uidToMessage}"]`);
            if (chatToMessage) {
                const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
                await human_like_typing(page, messageInputSelector, randomGreeting);
                
                await page.waitForTimeout(Math.random() * (1000 - 500) + 500);
                await page.click(sendButtonSelector);
                console.log(`Sent a message to chat box with UID: ${uidToMessage}`);
                
                // Reset the UID to ensure we don't message the same chat box again
                uidToMessage = null;
            }
        }
    
        const randomWait = 1000 + Math.floor(Math.random() * 1000);
        await page.waitForTimeout(randomWait);
    
        i++;
    }    

    console.log("All chats processed.");
    await browser.close();
    console.log("Browser closed successfully.");
})();
