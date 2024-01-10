const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder  } = require('discord.js');
const mongoose = require('mongoose');

const BlacklistModel = require('../../schemas/blacklists');
// const uri = "mongodb+srv://RoDB:RoDB@rosearch.frdmhyd.mongodb.net/";
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true,});

module.exports = {
    data: new SlashCommandBuilder()
    .setName("appeal")
    .setDescription("Appeal your blacklist")
    .setDMPermission(true),

     /**
      @param {Client} client
      @param {ChatInputCommandInteraction} interaction
      */

      async execute(interaction, client) {
        const NotBlacklistedEmbed = new EmbedBuilder()
        .setTitle("You are not Blacklisted.")
        .setColor("Red")

        const userId = interaction.user.id;
        const isUserBlacklisted = await BlacklistModel.findOne({ UserID: userId })

        if (isUserBlacklisted) {

            const modal = new ModalBuilder()
            .setCustomId("appelModal")
            .setTitle("Appeal Blacklist")



            const reasonInput = new TextInputBuilder()
            .setCustomId('appealModalReasoninput')
            .setLabel("Why should your blacklist be removed?")
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph)
           

           
		const secondActionRow = new ActionRowBuilder().addComponents(reasonInput);
    

        modal.addComponents( secondActionRow );

            await interaction.showModal(modal);

        } else {
            interaction.reply({ embeds: [NotBlacklistedEmbed]})
        }
      }
}