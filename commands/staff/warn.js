// const ModerationModel = require("./schemas/moderation")
// const { SlashCommandBuilder, EmbedBuilder, embedLength } = require("discord.js")


// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("warn")
//     .setDescription("[RoSearcher Staff Command]")
//     .addUserOption(option =>
//         option
//             .setName("user")
//             .setDescription("user")
//             .setRequired(true)
//         ),
//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {

//             const guild = interaction.guild;
//             // const botStaffRoleId = '1200587720062414859';

//             if (!interaction.member.roles.cache.has(botStaffRoleId)) {
//                 const noPermissionEmbed = new EmbedBuilder()
//                 .setTitle('Permission Denied')
//                 .setColor("Red")
//                 .setDescription('You do not have permission to use this command.');

//                 return interaction.reply({ embeds: [noPermissionEmbed]})
//             }

//             const user = interaction.options.getUser('user')
//             const guildId = '1185235395970088970';

//         } catch (error) {

//         }
//     }
// }

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const ModerationModel = require("../../schemas/moderation")


module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("[RoSearcher Staff Command]")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("user")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the warning")
                .setRequired(true)
        ),

    /**
    @param {Client} client
    @param {ChatInputCommandInteraction} interaction
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

            const user = interaction.options.getUser('user');
            const reason = interaction.options.getString('reason');
            const guildId = '1185235395970088970';

            const userId = user.id;
            let moderationEntry = await ModerationModel.findOne({ UserID: userId });

            if (!moderationEntry) {
                moderationEntry = await ModerationModel.create({
                    UserID: userId,
                    actions: { warns: 1, reasons: [reason] }
                });
            } else {
                moderationEntry.actions.warns++;
                moderationEntry.actions.reasons.push(reason);
                await moderationEntry.save();
            }

            const WarnEmbed = new EmbedBuilder()
            .setTitle("You have been warned")
            .setColor("Yellow")
            .setDescription(`Warning reason: ${reason}`)

            user.send({ embeds: [WarnEmbed] })

            interaction.reply(`User ${user.tag} has been warned. Total warns: ${moderationEntry.actions.warns}. Reason: ${reason}`);
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    }
};