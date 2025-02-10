const dotenv = require("dotenv");
dotenv.config();

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many requests, please try again later.' },
});

async function isMaliciousUrl(url){
    const body = {
        client: {
            clientId: 'your-app',
            clientVersion: '1.0.0',
        },
        threatInfo: {
            threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING'],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
        },
    };
    try{
        const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API_KEY}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify(body),
        });
        const data = await response.json();
        return data.matches ? true : false;
    }catch(error){
        console.error('Error checking malicious URL:', error);
        return false;
    }
}

async function getGeoData(ip) {
    try {
        const response = await fetch(`https://ip-api.com/json/${ip}`);
        const data = await response.json();

        if (data.status === 'fail') {
            return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
        }

        return {
            country: data.country || 'Unknown',
            city: data.city || 'Unknown',
            isp: data.isp || 'Unknown'
        };
    } catch (error) {
        console.error('Error fetching geolocation:', error);
        return { country: 'Unknown', city: 'Unknown', isp: 'Unknown' };
    }
}


module.exports = {
    isMaliciousUrl,
    limiter,
    getGeoData
}