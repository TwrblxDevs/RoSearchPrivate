const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
const  clc  = require("cli-color")


module.exports = {
    data: new SlashCommandBuilder()
    .setName('shutdown')
    .setDescription("[RoSearcher Developer Command]"),

    async execute(interaction) {

        const shutdownEmbed = new EmbedBuilder()
        .setTitle("Confirm Shutdown RoSearcher")
        .setColor("Yellow")

        const notadevEmbed = new EmbedBuilder()
        .setTitle("You are not a developer")
        .setColor("Red")

        const offEmbed = new EmbedBuilder()
        .setTitle("RoSearcher Shutdown")
        .setColor("Green")

        const BotShuttingDown = new EmbedBuilder()
          .setTitle("Bot Shutdown")
          .setColor("Red")

        const TimedoutEmbed = new EmbedBuilder()
        .setTitle("No Response Received during Wait Threshold")
        .setColor("DarkGrey")

        const ConfirmButton = new ButtonBuilder()
        .setCustomId('shutdownconfirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Danger)

        const CancelButton = new ButtonBuilder()
        .setCustomId('shutdowncancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Success)

        const row = new ActionRowBuilder()
        .addComponents(ConfirmButton, CancelButton);

        if (interaction.user.id == "919674489581731842") {
            const response = await interaction.reply({ embeds: [shutdownEmbed], components: [row], });
            const collectorFilter = i => i.user.id === interaction.user.id;
            try {
                const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });
            
                if (confirmation.customId === 'shutdownconfirm') {
                     interaction.followUp({ embeds: [offEmbed], components: [] });
                     console.log(clc.redBright("Bot has shutdown"))
                     setTimeout(() => process.exit(0), 5000)

                } else if (confirmation.customId === 'shutdowncancel') {
                     interaction.update({ content: 'Action cancelled', components: [], ephemeral: true });
                }
            } catch (e) {
                 interaction.followUp({ embeds: [TimedoutEmbed], components: [], ephemeral: true });
            }
                }
            
            
    
        if (interaction.user.id != "919674489581731842") {
             interaction.reply({ embeds: [notadevEmbed]});
        }

    }

    }

