const dotenv = require("dotenv");
dotenv.config();

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


module.exports = {
    isMaliciousUrl
}