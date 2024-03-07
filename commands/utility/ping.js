//  const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// module.exports = {
//     cooldown: 5,

// 	data: new SlashCommandBuilder()
    
// 		.setName('ping')
        
// 		.setDescription('Replies with Pong!'),
// 	async execute(interaction) {
// 		const sent = await interaction.reply({ content: 'Pinging..', fetchReply: true });

// 		const PingResult = new EmbedBuilder()
// 		.setTitle("Ping Result")
// 		.setColor("Green")
// 		.addFields(
// 			{ name: 'Uptime: ', value: `${Math.round(interaction.client.uptime / 60000 )} minutes`},
// 			{ name: 'Websocket Heartbeat: ', value: `${interaction.client.ws.ping}ms`},
// 			{ name: 'Rountrip Latency: ', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`}
// 		)

//         await interaction.editReply({ embeds: [PingResult] });
// 	},
// };

const { SlashCommandBuilder, EmbedBuilder, version: discordJsVersion } = require('discord.js');
const { version: nodeJsVersion } = require('process'); // Assuming process.version gives you Node.js version
const config = require("../../config.json")
const os = require("node:os")

module.exports = {
    cooldown: 5,

    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging..', fetchReply: true });

        const uptimeMilliseconds = interaction.client.uptime;
        const hours = Math.floor(uptimeMilliseconds / 3600000);
        const minutes = Math.floor((uptimeMilliseconds % 3600000) / 60000);
        const seconds = Math.floor((uptimeMilliseconds % 60000) / 1000);

        const uptimeString = `${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`;  

        const PingResult = new EmbedBuilder()
            .setTitle("Ping Result")
            .setColor("Green")
            .addFields(
                // { name: '🕰 Uptime: ', value: `${Math.round(interaction.client.uptime / 60000)} minutes` },
                { name: '🕰 Uptime: ', value: uptimeString },
                { name: '💓 Websocket Heartbeat: ', value: `${interaction.client.ws.ping}ms` },
                { name: '🌐 Roundtrip Latency: ', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms` },
                { name: '🖥 Server Count: ', value: `${interaction.client.guilds.cache.size}` },
                { name: ':gear: Architecture ', value: `${os.arch()}` },
                { name: ':desktop: Operating System ', value: `${os.platform()}`},
                { name: ':rocket:  Processor ', value: `${os.cpus().map(i => `${i.model}`)[0]}` },
                { name: '🗃 Ram and CPU Usage: ', value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)}MB / ${( process.cpuUsage().user / 1000 ).toFixed(2)}%` },
                { name: '🔧 Discord.js Version: ', value: `${discordJsVersion}` },
                { name: '🛠 Node.js Version: ', value: `${nodeJsVersion}` },
                { name: "🖨 Database Connected:", value: `${config.MongoDBConnected}`}
            );

        

        await interaction.editReply({ embeds: [PingResult], content: "‎" });
    },
};