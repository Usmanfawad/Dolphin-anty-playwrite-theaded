const { chromium } = require('playwright');
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


async function openDolphin (profileId) {
    console.log(profileId);
    try {
        const wsEndPoint = await getWsEndPoint(profileId);
        // console.log('Received:', wsEndPoint);
      } catch (error) {
        console.error('Error:', error);
    }
    
};

async function openBrowser (wsEndPoint, port) {
    const browser = await chromium.connectOverCDP(`ws://127.0.0.1:${port}${wsEndPoint}`);
    const page = await browser.contexts()[0].newPage();
    await page.goto('https://bumble.com');
    await page.screenshot({path: 'google.png'});
    await browser.close(); 

    // Implementation



}



module.exports = openDolphin;