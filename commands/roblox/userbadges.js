// const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder,SelectMenuBuilder, MessageSelectMenuBuilder } = require('discord.js');
// const axios = require("axios");

// const ROBLOX_API_URL = 'https://badges.roblox.com/v1/users/';

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userbadges')
//         .setDescription('get a users badges on Roblox')
//         .addStringOption((option) =>
//             option.setName('user').setDescription('Roblox ID').setRequired(true)
//         ),

//     async execute(interaction) {
// const userId = interaction.options.getString('user');

// if (!userId) {
//   return interaction.reply('Please provide a valid Roblox user ID.');
// }

// try {
//   const response = await axios.get(`${ROBLOX_API_URL}${userId}/badges?limit=100&sortOrder=Asc`);
//   const badges = response.data.data;

//   if (badges.length === 0) {
//     return interaction.reply('This user has no badges.');
//   }

//   const badgeList = badges.map(badge => `**${badge.name}**: [Badge Icon](${badge.imageUrl})`).join('\n');
//   interaction.reply(`**Badges for user ${userId}**:\n${badgeList}`);
// } catch (error) {
//   console.error('Error:', error);
//   interaction.reply('An error occurred while processing the command.');
// }
// }
// }

const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const ROBLOX_API_URL = 'https://badges.roblox.com/v1/users/';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userbadges')
    .setDescription('Get a user\'s badges on Roblox')
    .addStringOption((option) =>
      option.setName('user').setDescription('Roblox ID').setRequired(true)
    ),

  async execute(interaction) {
    const userId = interaction.options.getString('user');

    if (!userId) {
      return interaction.reply('Please provide a valid Roblox user ID.');
    }

    try {
      const response = await axios.get(`${ROBLOX_API_URL}${userId}/badges?limit=100&sortOrder=Asc`);
      const badges = response.data.data;

      if (badges.length === 0) {
        return interaction.reply('This user has no badges.');
      }

      const badgeList = badges.map(badge => {
        const badgeName = `**${badge.name}**`;
        const badgeIcon = badge.imageUrl ? `[Badge Icon](${badge.imageUrl})` : 'Badge Icon not available';
        return `${badgeName}: ${badgeIcon}`;
      }).join('\n');

      // Split the content into chunks of 2000 characters
      const chunks = badgeList.match(/[\s\S]{1,2000}/g);

      // Send each chunk as a separate reply
      for (const chunk of chunks) {
        interaction.reply(chunk);
      }
    } catch (error) {
      console.error('Error:', error);
      interaction.reply('An error occurred while processing the command.');
    }
  }
};
