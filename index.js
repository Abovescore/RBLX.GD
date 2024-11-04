const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/getLevel', async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // user-agent has to start with 'Roblox' or 'RobloxStudio'
    if (!userAgent.startsWith('Roblox') && !userAgent.startsWith('RobloxStudio')) {
        return res.status(403).send('Forbidden: Invalid User-Agent');
    }
    
    // set up data
    const { levelID } = req.body;
    if (!levelID) return res.status(400).send('Missing levelID');

    try {
        const gdResponse = await axios.post('http://www.boomlings.com/database/getGJLevels21.php', new URLSearchParams({
            str: levelID,
            type: 0,
            secret: 'Wmfv3899gc9'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        res.send(gdResponse.data);  // send back to Roblox
    } catch (error) {
        console.error('Error contacting Geometry Dash servers:', error);
        res.status(500).send('Error fetching level data');
    }
});

// set the port for render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
