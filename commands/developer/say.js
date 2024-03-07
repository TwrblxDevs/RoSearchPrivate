const { SlashCommandBuilder } = require("discord.js")
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("[RoSearcher Developer Command]")
    .addStringOption(option =>
            option
                .setName("message")
                .setDescription("say")
                .setRequired(true)
        ),

        async execute(interaction) {
                if (interaction.user.id !== config.DevID) return;
                const msg = interaction.options.getString('message');
                const C = interaction.channel;

                C.send(msg)
                interaction.reply({ content: "Hi james it worked.",  ephemeral: true})
        }
}