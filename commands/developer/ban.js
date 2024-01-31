const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("[RoSearcher Developer Command]")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
        option.setName("user")
        .setDescription("user to ban")
        .setRequired(true)
        ),

    async execute(interaction) {
       
        const BanPanel = new EmbedBuilder()
        .setTitle("Developer Ban Panel")
        .setColor("Red")

        const OpenPanel = new ButtonBuilder()
        .setCustomId("OpenBanPanelButton")
        
        .setLabel("Open Panel")
        .setStyle(ButtonStyle.Danger)

        const row = new ActionRowBuilder()
        .addComponents(OpenPanel)

        const notadevEmbed = new EmbedBuilder()
        .setTitle("You are not a developer")
        .setColor("Red")

        const modal = new ModalBuilder()
			.setCustomId('BanModal')
			.setTitle('Ban Modal');

            const BanReason = new TextInputBuilder()
            .setCustomId("BanReason")
            .setLabel("Reason")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            const firstActionRow = new ActionRowBuilder().addComponents(BanReason);

            modal.addComponents(firstActionRow)

        if (interaction.user.id === "919674489581731842") {

            await interaction.showModal(modal)
            interaction.options.getMember('user').ban(BanReason)
        }
               
              

        if (interaction.user.id != "919674489581731842") {
            interaction.reply({ embeds: [notadevEmbed]});
        }
    }
}