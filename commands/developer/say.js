const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("[RoSearcher Developer Command]")
    .addStringOption(option =>
            option
                .setName("message")
                .setDescription("say")
        )
}