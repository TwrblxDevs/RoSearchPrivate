// const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits  } = require("discord.js")
// const ConfigModel = require("../../schemas/GuildConfig")

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("configure")
//     .setDescription("Configure the Settings for your Server's RoSearcher Setup")
//     .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
//     .setDMPermission(false),

//     async execute(interaction) {

    

//     }
// }

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionFlagsBits  } = require("discord.js")
const ConfigModel = require("../../schemas/GuildConfig")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("configure")
    .setDescription("Configure the Settings for your Server's RoSearcher Setup")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),


    async execute(interaction) {
       
    }
}