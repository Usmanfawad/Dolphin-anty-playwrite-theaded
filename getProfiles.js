// import { openDolphin } from "./main";
const openDolphin = require('./main');
const axios = require('axios');

const url = 'https://dolphin-anty-api.com/browser_profiles'; // URL to get all the IDs
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZWU3Y2I5N2JiMGRiYzI2MGU0OWM0NDZmY2QxNmVjNTI4MGQ5MzM4OGFlODAzMGUyY2U4M2U5ZjQwZTk5YmNkZjQwN2U3ZmYwMWRlMzM3OTgiLCJpYXQiOjE2OTI2MzA1MzEuMjA4ODMyLCJuYmYiOjE2OTI2MzA1MzEuMjA4ODM0LCJleHAiOjE3MDgxODI1MzEuMjAwODU1LCJzdWIiOiIyMzQxOTM0Iiwic2NvcGVzIjpbXX0.gblF0oCBWloa2SHHnNiMvgbMR1JJjC0Fp5eHB_ghsrE9BuVyj-DaG6m1-3ag6VTwx7A8YPHU4DRmhp7azew25vt7R7hCyHrJpT_xmgLPHXWjFhuPTHj4GOcazALURODbwsiYRJx0G8ebO4c2-sB4SCpbTTJ0c1Mi84tITJYt6kOKXpTPPArXghzwXGrApK2Xzlm22n0b1BD8lXZ3igRoHwvK6Tq0JBSVXGrKVNdJnUmi0VDUh_L2Law7ndCnjSVasqRujXoIDj_NZPnZmCCWDB1hXzNfmkHJVzFAw_LYdMbsZwu78_Woldg38b6QkkAtuT-Nu_tKlgoPPBC4nBtTQ6QHKmoNWgdiGQ10Rlr4VS5wY8DdKBU57Raj7GjsCQLgILhDLQOdXSujhRrfCMvoWmgR2mp6wXrWhLB2z35bOlhlXVSFO06AHQnqCm0CxYVVh1QsV-1nvHzcUxkDb744Ssl2li70KL5asPdpNdFePEI1WovpocJzpmlsIL6EHHHTd7RpGByeoSRN-a-ZFhIacBSBan2rSBPJDCOtCCH2CvqIe8_zfTAkbU-eu-QfpAR2LMhDA61nWtzz_5NvmdP6VTObX9s-31GBLFSROyAhadhM28xX2FW5q-SDfGnquUd4rFxVig5gGDLLXDETeCGijT5U2NBIaw9ukWhFdjf5Zk0'; 


const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

// API call to get all the IDs
axios.get(url, config)
  .then(response => {
    const responseData = response.data.data;
    for (let i = 0; i < 5; i++) {
        // console.log(responseData[i].id);
        openDolphin(responseData[i].id);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });


