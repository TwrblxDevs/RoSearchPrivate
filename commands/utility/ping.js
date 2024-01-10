 const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,

	data: new SlashCommandBuilder()
    
		.setName('ping')
        
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging..', fetchReply: true });

		const PingResult = new EmbedBuilder()
		.setTitle("Ping Result")
		.setColor("Green")
		.addFields(
			{ name: 'Uptime: ', value: `${Math.round(interaction.client.uptime / 60000 )} minutes`},
			{ name: 'Websocket Heartbeat: ', value: `${interaction.client.ws.ping}ms`},
			{ name: 'Rountrip Latency: ', value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`}
		)

        await interaction.editReply({ embeds: [PingResult] });
	},
};

