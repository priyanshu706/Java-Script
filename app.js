const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const saveNumberToFile = (fileName, data) => {
    try {
        fs.appendFileSync(fileName, JSON.stringify(data) + '\n');
        console.log(`Data saved: ${JSON.stringify(data)}`);
    } catch (err) {
        console.error('Error saving data:', err);
    }
};

const fetchNumbersFromTruecaller = async () => {
    const prefixes = [
        "90060", "91620", "91990", "95460", "95720", "96310", "96610", "97710", "98010", "99310", "99340", "99390", "99550", "99730", 
        "90061", "91621", "91991", "95461", "95721", "96311", "96611", "97711", "98011", "99311", "99341", "99391", "99551", "99731", 
        "90062", "91622", "91992", "95462", "95722", "96312", "96612", "97712", "98012", "99312", "99342", "99392", "99552", "99732", 
        "90063", "91623", "91993", "95463", "95723", "96313", "96613", "97713", "98013", "99313", "99343", "99393", "99553", "99733", 
        "90064", "91624", "91994", "95464", "95724", "96314", "96614", "97714", "98014", "99314", "99344", "99394", "99554", "99734", 
        "90065", "91625", "91995", "95465", "95725", "96315", "96615", "97715", "98015", "99315", "99345", "99395", "99555", "99735", 
        "90066", "91626", "91996", "95466", "95726", "96316", "96616", "97716", "98016", "99316", "99346", "99396", "99556", "99736", 
        "90067", "91627", "91997", "95467", "95727", "96317", "96617", "97717", "98017", "99317", "99347", "99397", "99557", "99737", 
        "90068", "91628", "91998", "95468", "95728", "96318", "96618", "97718", "98018", "99318", "99348", "99398", "99558", "99738", 
        "90069", "91629", "91999", "95469", "95729", "96319", "96619", "97719", "98019", "99319", "99349", "99399", "99559", "99739", 
        "80020", "80840", "82920", "82940", "85210", "87570", "88090", "89690", "80021", "80841", "82921", "82941", "85211", "87571", 
        "88091", "89691", "80022", "80842", "82922", "82942", "85212", "87572", "88092", "89692", "80023", "80843", "82923", "82943", 
        "85213", "87573", "88093", "89693", "80024", "80844", "82924", "82944", "85214", "87574", "88094", "89694", "80025", "80845", 
        "82925", "82945", "85215", "87575", "88095", "89695", "80026", "80846", "82926", "82946", "85216", "87576", "88096", "89696", 
        "80027", "80847", "82927", "82947", "85217", "87577", "88097", "89697", "80028", "80848", "82928", "82948", "85218", "87578", 
        "88098", "89698", "80029", "80849", "82929", "82949", "85219", "87579", "88099", "89699", "72500", "77390", "72501", "77391", 
        "72502", "77392", "72503", "77393", "72504", "77394", "72505", "77395", "72506", "77396", "72507", "77397", "72508", "77398", 
        "72509", "77399"
    ];
    const postfix = '021';
    const rateLimitPerToken = 25;
    const delayBetweenRequests = (60 / rateLimitPerToken) * 1000; // in milliseconds

    for (const prefix of prefixes) {
        for (let middleDigits = 0; middleDigits <= 999; middleDigits++) {
            const middlePart = middleDigits.toString().padStart(3, '0'); // Format middle part as three digits
            const number = `${prefix}${middlePart}${postfix}`;

            try {
                const response = await axios.get(`https://api.truecaller.com/v1/search?q=${number}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.TRUECALLER_API_KEY}`, // Use the API key from the environment variable
                        'User-Agent': 'Mozilla/5.0' // Example user agent
                    }
                });

                const results = response.data.results;

                for (const result of results) {
                    const name = result.name;
                    const phoneNumber = result.phone;

                    // Check if name includes 'aanchal' or 'anchal'
                    if (name.toLowerCase().includes('aanchal') || name.toLowerCase().includes('anchal')) {
                        saveNumberToFile('numbers.txt', { name, phoneNumber });
                    }
                }
            } catch (error) {
                console.error('Error fetching data from Truecaller API:', error.message);
                // Save the failed number to a separate file
                saveNumberToFile('failed_numbers.txt', { number, error: error.message });
            }

            // Delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, delayBetweenRequests));
        }
    }
};

fetchNumbersFromTruecaller();