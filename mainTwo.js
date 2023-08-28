const { chromium } = require('playwright');
// const mainFunction = require('./openingMessageBot');
const http = require('http');
const axios = require('axios');



const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWU3Y2I5N2JiMGRiYzI2MGU0OWM0NDZmY2QxNmVjNTI4MGQ5MzM4OGFlODAzMGUyY2U4M2U5ZjQwZTk5YmNkZjQwN2U3ZmYwMWRlMzM3OTgiLCJpYXQiOjE2OTI2MzA1MzEuMjA4ODMyLCJuYmYiOjE2OTI2MzA1MzEuMjA4ODM0LCJleHAiOjE3MDgxODI1MzEuMjAwODU1LCJzdWIiOiIyMzQxOTM0Iiwic2NvcGVzIjpbXX0.gblF0oCBWloa2SHHnNiMvgbMR1JJjC0Fp5eHB_ghsrE9BuVyj-DaG6m1-3ag6VTwx7A8YPHU4DRmhp7azew25vt7R7hCyHrJpT_xmgLPHXWjFhuPTHj4GOcazALURODbwsiYRJx0G8ebO4c2-sB4SCpbTTJ0c1Mi84tITJYt6kOKXpTPPArXghzwXGrApK2Xzlm22n0b1BD8lXZ3igRoHwvK6Tq0JBSVXGrKVNdJnUmi0VDUh_L2Law7ndCnjSVasqRujXoIDj_NZPnZmCCWDB1hXzNfmkHJVzFAw_LYdMbsZwu78_Woldg38b6QkkAtuT-Nu_tKlgoPPBC4nBtTQ6QHKmoNWgdiGQ10Rlr4VS5wY8DdKBU57Raj7GjsCQLgILhDLQOdXSujhRrfCMvoWmgR2mp6wXrWhLB2z35bOlhlXVSFO06AHQnqCm0CxYVVh1QsV-1nvHzcUxkDb744Ssl2li70KL5asPdpNdFePEI1WovpocJzpmlsIL6EHHHTd7RpGByeoSRN-a-ZFhIacBSBan2rSBPJDCOtCCH2CvqIe8_zfTAkbU-eu-QfpAR2LMhDA61nWtzz_5NvmdP6VTObX9s-31GBLFSROyAhadhM28xX2FW5q-SDfGnquUd4rFxVig5gGDLLXDETeCGijT5U2NBIaw9ukWhFdjf5Zk0'; 

const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

async function getWsEndPoint(profileId) {
    console.log("Get ws end point");
    const toEndPoint = `http://localhost:3001/v1.0/browser_profiles/${profileId}/start?automation=1`
    console.log(toEndPoint);
    const responseData = [];
    await axios.get(toEndPoint, config)
    .then(response => {
        const wsEndPointUrl = response.data.automation.wsEndpoint;
        const port = response.data.automation.port;
        responseData.push(wsEndPointUrl);
        responseData.push(port);
        openBrowser(wsEndPointUrl,port);
        console.log(response.data);
        return response.data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
    
}


async function openDolphinTwo (profileId) {
    console.log(profileId);
    try {
        const wsEndPoint = await getWsEndPoint(profileId);
        // console.log('Received:', wsEndPoint);
      } catch (error) {
        console.error('Error:', error);
    }
    
};

// -------------------------------------- Opening message bot script -------------

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


// ---------------------------- Opening message bot script END-------------

async function openBrowser (wsEndPoint, port) {
    const browser = await chromium.connectOverCDP(`ws://127.0.0.1:${port}${wsEndPoint}`);
    const page = await browser.contexts()[0].newPage();
    await page.goto('https://bumble.com');
    // screenshot debug
    // await page.screenshot({path: 'google.png'});
    
    
    // Hall's script to execute bumble related tasks
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
    // Hall's script to execute bumble related tasks END
    console.log("Waiting for 10 seconds before closing the browser...");
    await page.waitForTimeout(10000);

    await browser.close(); 
    console.log("Browser closed successfully.");

    // Implementation



}; 



module.exports = openDolphinTwo;