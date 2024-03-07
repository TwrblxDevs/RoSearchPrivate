const express = require("express")
const app = express()
const client = require('../../index.js')

app.listen(8000, () => {
    console.log("Web API Started")
})

app.get('/api', (req, res) => {
    res.status(200).send("API Online")
})

app.get('/', (req, res) => {
    res.send("E")
})

let botInfo = null;

app.post('/botinfopost', (req, res) => {
  if (botInfo) {
    res.json(botInfo);
  } else {
    res.status(500).send('Bot information not available');
  }
});


app.get('/botinfo', (req, res) => {
    try {
      const guildCount = client.guilds.cache.size;
      const userCount = client.users.cache.size;
      const channelCount = client.channels.cache.size;
      const uptime = formatUptime(client.uptime);
  
      botInfo = {
        guildCount,
        userCount,
        channelCount,
        uptime
      };
  
      res.json(botInfo);
    } catch (error) {
      console.error('Error in /botinfo GET handler:', error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  


function formatUptime(uptime) {
    const seconds = Math.floor(uptime / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    return `${hours} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
}