// const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require("discord.js")
// const ModerationModel = require("../../schemas/moderation")
// const config = require("../../config.json")


// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("warnings")
//         .setDescription('[RoSearcher Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//             ),
//             /**
//              @param {Client} client
//              @param {ChatInputCommandInteraction} interaction
//              */

//              async execute(interaction, client) {
//                 try {
//                     const guild = interaction.guild
//                     const botStaffRoleId = config.botStaffRoleId;

//                     if (!interaction.member.roles.cache.has(botStaffRoleId)) {
//                         const noPermissionEmbed = new EmbedBuilder()
//                         .setTitle('Permission Denied')
//                         .setColor("Red")
//                         .setDescription('You do not have permission to use this command.');
    
//                     return interaction.reply({ embeds: [noPermissionEmbed] });
//                 }

//                 const user = interaction.options.getUser("user");
                

//                 const moderationEntry = await ModerationModel.findOne({ UserID: user.id });

//                 const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))

//                 if (moderationEntry && moderationEntry.actions.reasons.length > 0) {
//                     const reasonsList = moderationEntry.actions.reasons.map(reason => `• ${reason}`).join('\n');
//                     embed.addFields(
//                         { name: 'Warning', value: `**Warn Count:** ${moderationEntry.actions.warns}\n**Warning Reasons:**\n${reasonsList}`, inline: true }
//                     );
//                 } else {
//                     embed.addFields(
//                         { name: 'Warning', value: `**Warn Count:** ${moderationEntry ? moderationEntry.actions.warns : 0}\nNo Warning Reasons`, inline: true }
//                     );
//                 }

//                 interaction.reply({ embeds: [embed] });

//                 } catch (error) {
//                     console.error('Error in warnings command:', error)

//                     const ErrorEmbed = new EmbedBuilder()
//                     .setTitle("Command Error")
//                     .setDescription(`Error: ${error}`)
//                     .setColor("Red")

//                     interaction.reply({ embeds: [ErrorEmbed] })
//                     throw error;
//                 }
//              }
// }

const { SlashCommandBuilder, Client } = require("discord.js");
const { EmbedBuilder } = require("discord.js");
const ModerationModel = require("../../schemas/moderation");
const config = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription('[RoSearcher Staff Command]')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user")
                .setRequired(true)
        ),
    /**
     * @param {Client} client
     * @param {ChatInputCommandInteraction} interaction
     */
    async execute(interaction, client) {
        try {
            const guild = interaction.guild;
            const botStaffRoleId = '1200587720062414859';

            if (!interaction.member.roles.cache.has(botStaffRoleId)) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setColor("Red")
                    .setDescription('You do not have permission to use this command.');

                return interaction.reply({ embeds: [noPermissionEmbed] });
            }

            const user = interaction.options.getUser("user");

            const moderationEntry = await ModerationModel.findOne({ UserID: user.id });

            const embed = new EmbedBuilder()
                .setTitle(`User Information for ${user.tag}`)
                .setColor("Yellow")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }));

            if (moderationEntry && moderationEntry.actions.reasons.length > 0) {
                const reasonsList = moderationEntry.actions.reasons.map(reason => `• ${reason}`).join('\n');
                embed.addFields(
                    { name: 'Warning', value: `**Warn Count:** ${moderationEntry.actions.warns}\n**Warning Reasons:**\n${reasonsList}`, inline: true }
                );
            } else {
                embed.addFields(
                    { name: 'Warning', value: `**Warn Count:** ${moderationEntry ? moderationEntry.actions.warns : 0}\nNo Warning Reasons`, inline: true }
                );
            }

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Error in warnings command:', error);

            const ErrorEmbed = new EmbedBuilder()
                .setTitle("Command Error")
                .setDescription(`Error: ${error}`)
                .setColor("Red");

            interaction.reply({ embeds: [ErrorEmbed] });
            throw error;
        }
    }
};
