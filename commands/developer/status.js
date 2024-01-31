const { SlashCommandBuilder, EmbedBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("[RoSearcher Developer Command]")
        .addStringOption(option =>
                option
                .setName("message")
                .setDescription("status message")
                .setRequired(true)
            )
         .addStringOption(option => 
            option
                .setName("type")
                .setDescription("status type")
                .addChoices(
                    { name: 'Listening', value: 'Listening' },
                    { name: 'Watching', value: 'Watching' },
                    { name: 'Playing', value: 'Playing' }
                )
            ),
            async execute(interaction, client) {
                
            }   
}