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

            const channel = client.channels.cache.get("1204126123856887859")

        

            if (channel) {
                const moderatorName = interaction.user.name || 'Unknown Moderator'; // Provide a default value if undefined
                const WarnAdded = new EmbedBuilder()
                    .setTitle("Warn Added")
                    .setColor("Yellow")
                    .addFields(
                        { name: 'Username', value: user.username },
                        { name: "UserID", value: user.id },
                        { name: "Reason", value: reason },
                        { name: "Moderator", value: interaction.user.username }
                        )
                .setThumbnail(user.displayAvatarURL())


                channel.send({ embeds: [WarnAdded]}).catch(error => {
                    console.error(`Error sending message to channel: ${error.message}`);
                })
            }

            // if(user) {
            //   const WarnedEmbed = new EmbedBuilder()
            //   .setColor("Red")
            //   .setTitle("You have been warned")
            //   .setFields(
            //     { name: 'Reason', value: reason }
            //   )  
            // }

            const WarnAddedEmbed = new EmbedBuilder()
            .setTitle(`${user.tag} has been warned`)
            .setColor("Yellow")
            .addFields(
                { name: 'Total Warns', value: `${moderationEntry.actions.warns}` },
                { name: 'Reason', value: `${reason}`}
            )

            // interaction.reply(`User ${user.tag} has been warned. Total warns: ${moderationEntry.actions.warns}. Reason: ${reason}`);
            interaction.reply({ embeds: [WarnAddedEmbed] })
        } catch (error) {
            console.error(error);
            interaction.reply('An error occurred while processing the command.');
        }
    }
};