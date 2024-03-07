const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("support")
    .setDescription("support server invite"),

    async execute(interaction) {
        const Embed = new EmbedBuilder()
        .setTitle("Support Server")
        .setColor("Random")
        .setImage("https://i.imgur.com/mwxI654.png")

        const LinkButton = new ButtonBuilder()
        .setLabel("Join Support Server")
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/fey8cp2Jhw")

        const Row = new ActionRowBuilder()
        .addComponents(LinkButton)

        interaction.reply({ embeds: [Embed], components: [Row]})

    }
}