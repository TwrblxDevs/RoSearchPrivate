 const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 5,

	data: new SlashCommandBuilder()
    
		.setName('profile')
        
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
	},
};

