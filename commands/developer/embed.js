const { SlashCommandBuilder, ModalBuilder, EmbedBuilder,  TextInputBuilder, TextInputStyle, ActionRowBuilder  } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("embed")
    .setDescription('[RoSearcher Developer Command]'),

    async execute(interaction) {
        if (!interaction.user.id === "919674489581731842") {
            return;
        }

        const Modal = new ModalBuilder()
        .setTitle("Embed Builder")
        .setCustomId("EmbedBuilderModal")

        const EmbedTitle = new TextInputBuilder()
        .setLabel("Title")
        .setCustomId("EmbedBuilderTitle")
        .setStyle(TextInputStyle.Short)

        const EmbedDescription = new TextInputBuilder()
        .setCustomId("EmbedBuilderDesc")
        .setLabel("Description")
        .setStyle(TextInputStyle.Paragraph)

        const Row1 = new ActionRowBuilder().addComponents(EmbedTitle)
        const Row2 = new ActionRowBuilder().addComponents(EmbedDescription)

        Modal.addComponents(Row1, Row2)

        await interaction.showModal(Modal);
        }
}