const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("listguilds")
    .setDescription("[RoSearcher Developer Command]"),
    async execute(interaction) {

    }
}