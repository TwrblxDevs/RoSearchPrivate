const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require("axios")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("usersearch")
    .setDescription("Search a user on roblox")
    .addStringOption(option => 
        option.setName("username")
        .setDescription("Roblox Username")
        .setRequired(true)),

    async execute(interaction) {
       const RobloxName = interaction.options.getString('username', true)

       async function searchUsersByKeyword(keyword, limit) {
        const apiUrl = `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`;
    
        try {
            const response = await axios.get(apiUrl);
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }

    async function getUserHeadshot(userId) {
        const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?size=420x420&format=png&userIds=${userId}`
    
        try {
            const response = await axios.get(apiUrl)
            return response.data?.data[0].imageUrl
        } catch(error) {
            throw error;
        }
    }

    const searchTerm = RobloxName;
    const limit = 10;

    const UsrResults = searchUsersByKeyword(searchTerm, limit)

    const UserEmbed = new EmbedBuilder()
    .setTitle(`User Search for: ${searchTerm}`)
    .setColor("Random")
    .addFields(
        { name: 'UserId: ', value: `${UsrResults.id}`},
        { name: 'DisplayName', value: `${UsrResults.displayName}` }
    )

    interaction.reply({ embeds: [UserEmbed]})
}
    }

    