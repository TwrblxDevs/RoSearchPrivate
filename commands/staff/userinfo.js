// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const BlacklistModel = require('../../schemas/blacklists');
// const moment = require('moment-timezone');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userinfo')
//         .setDescription('[RoSearcher Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//         ),

//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {
//             const user = interaction.options.getUser('user');
//             const guild = interaction.guild;

//             const guildId = '1185235395970088970';
//             const botStaffRoleId = '1200587720062414859';

//             const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
//             const member = await guild.members.fetch(user.id);
//             const isBotStaff = guild.id === guildId && member.roles.cache.has(botStaffRoleId);

//             const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))
//                 .addFields(
//                     { name: 'Bot Staff', value: isBotStaff ? 'Yes' : 'No' },
//                     { name: 'Blacklist Status', value: isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted' },
//                     { name: 'Joined Discord', value: user.createdAt.toUTCString(), inline: true },
//                     { name: 'Joined Server', value: user.joinedAt ? user.joinedAt.toUTCString() : 'Not available', inline: true },
//                     { name: 'Command Usage Count', value: 'Soon' },
//                 )
               

          

//             interaction.reply({ embeds: [embed]});
//         } catch (error) {
//             console.error('Error in userinfo command:', error);
//             interaction.reply('An error occurred while processing the command.');
//             throw error;
//         }
//     }
// };

// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const BlacklistModel = require('../../schemas/blacklists');
// const moment = require('moment-timezone');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userinfo')
//         .setDescription('[RoSearcher Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//         ),

//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {
            
//             const user = interaction.options.getUser('user');
//             const guild = interaction.guild;

//             const guildId = '1185235395970088970';
//             const botStaffRoleId = '1200587720062414859';

//             const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
//             const member = await guild.members.fetch(user.id);
//             const isBotStaff = guild.id === guildId && member.roles.cache.has(botStaffRoleId);
            

//             const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))
//                 .addFields(
//                     { name: 'Bot Staff', value: isBotStaff ? 'Yes' : 'No' },
//                     { name: 'Blacklist Status', value: isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted' },
//                     { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
//                     { name: 'Joined Server', value: moment(member.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
//                     { name: 'Command Usage Count', value: 'Soon' },
//                 )
               
//             interaction.reply({ embeds: [embed] });
//         } catch (error) {
//             console.error('Error in userinfo command:', error);
//             interaction.reply('An error occurred while processing the command.');
//             throw error;
//         }
//     }
// };





// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const BlacklistModel = require('../../schemas/blacklists');
// const moment = require('moment-timezone');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userinfo')
//         .setDescription('[RoSearcher Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//         ),

//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {
//             const guild = interaction.guild;
//             const botStaffRoleId = '1200587720062414859';

//             if (!interaction.member.roles.cache.has(botStaffRoleId)) {
//                 const noPermissionEmbed = new EmbedBuilder()
//                 .setTitle('Permission Denied')
//                 .setColor("Red")
//                 .setDescription('You do not have permission to use this command.');


//                 return interaction.reply({ embeds: [noPermissionEmbed]});
//             }

//             const user = interaction.options.getUser('user');
//             const guildId = '1185235395970088970';

//             const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
//             const member = await guild.members.fetch(user.id);
//             const isBotStaff = guild.id === guildId && member.roles.cache.has(botStaffRoleId);

//             const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))
//                 .addFields(
//                     { name: 'Bot Staff', value: isBotStaff ? 'Yes' : 'No' },
//                     { name: 'Blacklist Status', value: isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted' },
//                     { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
//                     { name: 'Joined Server', value: moment(member.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
//                     { name: 'Command Usage Count', value: 'Soon' },
//                 );

//             interaction.reply({ embeds: [embed] });
//         } catch (error) {
//             console.error('Error in userinfo command:', error);
//             interaction.reply('An error occurred while processing the command.');
//             throw error;
//         }
//     }
// };


// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const BlacklistModel = require('../../schemas/blacklists');
// const ModerationModel = require('../../schemas/moderation');
// const moment = require('moment-timezone');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userinfo')
//         .setDescription('[RoSearcher Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//         ),

//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {
//             const guild = interaction.guild;
//             const botStaffRoleId = '1200587720062414859';

//             if (!interaction.member.roles.cache.has(botStaffRoleId)) {
//                 const noPermissionEmbed = new EmbedBuilder()
//                     .setTitle('Permission Denied')
//                     .setColor("Red")
//                     .setDescription('You do not have permission to use this command.');

//                 return interaction.reply({ embeds: [noPermissionEmbed] });
//             }

//             const user = interaction.options.getUser('user');
//             const guildId = '1185235395970088970';

//             const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
//             const member = await guild.members.fetch(user.id);
//             const isBotStaff = guild.id === guildId && member.roles.cache.has(botStaffRoleId);

//             const moderationEntry = await ModerationModel.findOne({ UserID: user.id });

//             const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))
//                 .addFields(
//                     { name: 'Bot Staff', value: isBotStaff ? 'Yes' : 'No' },
//                     { name: 'Blacklist Status', value: isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted' },
//                     { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
//                     { name: 'Joined Server', value: moment(member.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
//                     { name: 'Command Usage Count', value: 'Soon' }
//                 );

//             if (moderationEntry && moderationEntry.actions.reasons.length > 0) {
//                 const reasonsList = moderationEntry.actions.reasons.map(reason => `• ${reason}`).join('\n');
//                 embed.addFields(
//                     { name: 'Warning', value: `**Warn Count:** ${moderationEntry.actions.warns}\n**Warning Reasons:**\n${reasonsList}`, inliene: true }
//                 );
//             } else {
//                 embed.addFields(
//                     { name: 'Warning', value: `**Warn Count:** ${moderationEntry ? moderationEntry.actions.warns : 0}\nNo Warning Reasons`, inliene: true }
//                 );
//             }

//             interaction.reply({ embeds: [embed] });
//         } catch (error) {
//             console.error('Error in userinfo command:', error);
//             interaction.reply('An error occurred while processing the command.');
//             throw error;
//         }
//     }
// };

// const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const BlacklistModel = require('../../schemas/blacklists');
// const ModerationModel = require('../../schemas/moderation');
// const moment = require('moment-timezone');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('userinfo')
//         .setDescription('[RoSearcher Support Guild Staff Command]')
//         .addUserOption(option =>
//             option
//                 .setName("user")
//                 .setDescription("user")
//                 .setRequired(true)
//         ),

//     /**
//     @param {Client} client
//     @param {ChatInputCommandInteraction} interaction
//     */

//     async execute(interaction, client) {
//         try {
//             const supportGuildId = '1185235395970088970';
//             const botStaffRoleId = '1200587720062414859';

//             if (interaction.guildId !== supportGuildId) {
//                 const wrongGuildEmbed = new EmbedBuilder()
//                     .setTitle('Wrong Guild')
//                     .setColor("Red")
//                     .setDescription('This command can only be used in the support guild.');

//                 return interaction.reply({ embeds: [wrongGuildEmbed] });
//             }

            
//             const botStaffRole = interaction.guild.roles.cache.get(botStaffRoleId);
//             if (!botStaffRole || !interaction.member.roles.cache.has(botStaffRoleId)) {
//                 const noPermissionEmbed = new EmbedBuilder()
//                     .setTitle('Permission Denied')
//                     .setColor("Red")
//                     .setDescription('You do not have permission to use this command.');

//                 return interaction.reply({ embeds: [noPermissionEmbed] });
//             }

//             const user = interaction.options.getUser('user');
//             const isUserBlacklisted = await BlacklistModel.findOne({ UserID: user.id });
//             const member = await interaction.guild.members.fetch(user.id);
//             const isBotStaff = interaction.guild.id === supportGuildId && member.roles.cache.has(botStaffRoleId);

//             const moderationEntry = await ModerationModel.findOne({ UserID: user.id });

//             const embed = new EmbedBuilder()
//                 .setTitle(`User Information for ${user.tag}`)
//                 .setColor("Yellow")
//                 .setThumbnail(user.displayAvatarURL({ dynamic: true }))
//                 .addFields(
//                     { name: 'Bot Staff', value: isBotStaff ? 'Yes' : 'No' },
//                     { name: 'Blacklist Status', value: isUserBlacklisted ? 'Blacklisted' : 'Not Blacklisted' },
//                     { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
//                     { name: 'Joined Server', value: moment(member.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
//                     { name: 'Command Usage Count', value: 'Soon' }
//                 );

//             if (moderationEntry && moderationEntry.actions.reasons.length > 0) {
//                 const reasonsList = moderationEntry.actions.reasons.map(reason => `• ${reason}`).join('\n');
//                 embed.addFields(
//                     { name: 'Warning', value: `**Warn Count:** ${moderationEntry.actions.warns}\n**Warning Reasons:**\n${reasonsList}`, inline: true }
//                 );
//             } else {
//                 embed.addFields(
//                     { name: 'Warning', value: `**Warn Count:** ${moderationEntry ? moderationEntry.actions.warns : 0}\nNo Warning Reasons`, inline: true }
//                 );
//             }

//             interaction.reply({ embeds: [embed] });

//         } catch (error) {
//             console.error('Error in userinfo command:', error);
//             interaction.reply('An error occurred while processing the command.');
//             throw error;
//         }
//     }
// };
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
            // Check if the user has the staff role
            const member = await interaction.guild.members.fetch(interaction.user.id);
            const hasStaffRole = member.roles.cache.some(role => role.name === config.staffRoleName);

            // Check if the user is in the staff IDs list
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

            const embed = new EmbedBuilder()
                .setTitle(`User Information for ${user.tag}`)
                .setColor("Yellow")
                .setThumbnail(user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    { name: 'Joined Discord', value: moment(user.createdAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a'), inline: true },
                    { name: 'Joined Server', value: moment(memberInGuild.joinedAt).tz('UTC').format('MMMM Do YYYY, h:mm:ss a') || 'Not available', inline: true },
                    { name: 'Command Usage Count', value: 'Soon' }
                );

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
            throw error;
        }
    }
};
