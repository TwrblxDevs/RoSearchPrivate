const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("eval")
        .setDescription("[RoSearcher Developer Command]")
        .addStringOption(option =>
            option
                .setName("code")
                .setDescription("Code")
                .setRequired(true)
        ),

    async execute(interaction) {
   
    }
};
