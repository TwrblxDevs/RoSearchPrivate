const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const BlacklistModel = require('../../schemas/blacklists');
const ModerationModel = require('../../schemas/moderation');
const moment = require('moment-timezone');
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('[RoSearcher Staff Command')
        .addUserOption(option =>
                        option
                            .setName("user")
                            .setDescription("user")
                            .setRequired(true)
                    ),

    /**
    @param {Client} client
    @param {ChatInputCommandInteraction} interaction
    */

    async execute(interaction, client) {
        try {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const hasStaffRole = member.roles.cache.some(role => role.name === config.staffRoleName);

            function isMemberStaff(member) {
                return member.roles.cache.some(role => role.name === config.staffRoleName);
            }

            const isStaff = config.staffIds.includes(interaction.user.id);

            if (!hasStaffRole && !isStaff) {
                const noPermissionEmbed = new EmbedBuilder()
                    .setTitle('Permission Denied')
                    .setColor("Red")
                    .setDescription('You do not have permission to use this command.');

                return interaction.reply({ embeds: [noPermissionEmbed] });
            }

            const user = interaction.options.getUser('user');
            const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
            const memberInGuild = await interaction.guild.members.fetch(user.id);

            const moderationEntry = await ModerationModel.findOne({ UserID: user.id });

            const userUnixTimestamp = Math.round(user.createdAt / 1000);
const guildUnixTimestamp =
    memberInGuild.joinedAt && Math.round(memberInGuild.joinedAt / 1000);

            const embed = new EmbedBuilder()
                .setTitle(`User Information for ${user.tag}`)
                .setColor("Yellow")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    // { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
                    // { name: 'Joined Server', value: moment(memberInGuild.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
                    { name: 'Joined Discord', value: `<t:${userUnixTimestamp}> (${moment
                        .unix(userUnixTimestamp)
                        .tz('UTC')
                        .format('MMMM Do YYYY, h:mm:ss a')})`,
                    },
                    { name: 'Joined Guild', value: guildUnixTimestamp
                    ? `<t:${guildUnixTimestamp}> (${moment
                          .unix(guildUnixTimestamp)
                          .tz('UTC')
                          .format('MMMM Do YYYY, h:mm:ss a')})`
                    : 'Not available'},
                    { name: 'User ID', value: `${user.id}`  },
                    { name: 'Command Usage Count', value: 'Soon' }
                );
                if (isMemberStaff(memberInGuild)) {
                    embed.addFields(
                        { name: "Badges", value: "<:7524sta:1204129929839640616><:5782ff:1204129928157593681>"}
                    )
                }

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
            console.error('Error in userinfo command:', error);
            interaction.reply('An error occurred while processing the command.');
            // throw error;
        }
    }
};
