const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("about")
    .setDescription("About RoSearcher"),


    async execute(interaction) {
        const embed = new EmbedBuilder()
        .setTitle("About RoSearcher")
        .setDescription("RoSearcher was Created on Dec 8, 2023 as a bot used to search or roblox for users and to return info on them")
        .addFields(
            { name: '💐 This Part is dedicated to JD 💐', value: '2015 - 2024', inline: true}
        )
        

        await interaction.reply({ embeds: [embed]})
    }
}