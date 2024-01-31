// const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const axios = require("axios")

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("usersearch")
//     .setDescription("Search a user on roblox")
//     .addStringOption(option => 
//         option.setName("username")
//         .setDescription("Roblox Username")
//         .setRequired(true)),

//     async execute(interaction) {
//        const RobloxName = interaction.options.getString('username', true)

//        async function searchUsersByKeyword(keyword, limit) {
//         const apiUrl = `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`;
    
//         try {
//             const response = await axios.get(apiUrl);
//             return response.data.data;
//         } catch (error) {
//             throw error;
//         }
//     }

//     async function getUserHeadshot(userId) {
//         const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?size=420x420&format=png&userIds=${userId}`
    
//         try {
//             const response = await axios.get(apiUrl)
//             return response.data?.data[0].imageUrl
//         } catch(error) {
//             throw error;
//         }
//     }

//     const searchTerm = RobloxName;
//     const limit = 10;

//     const UsrResults = searchUsersByKeyword(searchTerm, limit)

//     const UserEmbed = new EmbedBuilder()
//     .setTitle(`User Search for: ${searchTerm}`)
//     .setColor("Random")
//     .addFields(
//         { name: 'UserId: ', value: `${UsrResults.id}`},
//         { name: 'DisplayName', value: `${UsrResults.displayName}` }
//     )

//     interaction.reply({ embeds: [UserEmbed]})
// }
//     }

// const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
// const axios = require("axios")

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName("usersearch")
//         .setDescription("Search a user on Roblox")
//         .addStringOption(option =>
//             option.setName("username")
//                 .setDescription("Roblox Username")
//                 .setRequired(true)),

//     async execute(interaction) {
//         const RobloxName = interaction.options.getString('username', true);

//         async function searchUsersByKeyword(keyword, limit) {
//             const apiUrl = `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`;
    
//             try {
//                 const response = await axios.get(apiUrl);
//                 return response.data.data;
//             } catch (error) {
//                 throw error;
//             }
//         }

//         const searchTerm = RobloxName;
//         const limit = 10;

//         try {
//             const UsrResults = await searchUsersByKeyword(searchTerm, limit);

//             if (!UsrResults || UsrResults.length === 0) {
//                 interaction.reply('No results found. Please try a different username.');
//                 return;
//             }

//             const userChoices = UsrResults.map((user, index) => ({
//                 label: user.displayName,
//                 value: String(index),
//                 description: `UserID: ${user.id}`,
//             }));

//             interaction.reply({
//                 content: 'Please choose a user:',
//                 components: [
//                     {
//                         type: 1, // ActionRow
//                         components: [
//                             {
//                                 type: 3, // SelectMenu
//                                 customId: 'selectUser',
//                                 placeholder: 'Select a user',
//                                 options: userChoices,
//                             },
//                         ],
//                     },
//                 ],
//             });

//             // Wait for user selection
//             const filter = (interaction) =>
//                 interaction.customId === 'selectUser' && interaction.user.id === interaction.user.id;

//             const collector = interaction.channel.createMessageComponentCollector({
//                 filter,
//                 time: 30000, // 30 seconds timeout
//             });

//             collector.on('collect', async (interaction) => {
//                 const selectedUserIndex = interaction.values[0];
//                 const selectedUser = UsrResults[selectedUserIndex];

//                 // const UserEmbed = {
//                 //     title: `User Search for: ${searchTerm}`,
//                 //     color: "RANDOM",
//                 //     fields: [
//                 //         { name: 'UserId: ', value: `${selectedUser.id}` },
//                 //         { name: 'DisplayName', value: `${selectedUser.displayName}` },
//                 //     ],
//                 // };

//                 const UserEmbed = new EmbedBuilder()
//                 .setTitle(`User Search for: ${searchTerm}`)
//                 .setColor("Random")
//                 .addFields(
//                     { name: 'UserId', value: `${selectedUser.id}`},
//                     { name: 'DisplayName', value: `${selectedUser.displayName}` }
//                 )

//                 interaction.editReply({ content: 'User selected:', embeds: [UserEmbed], components: [] });
//                 collector.stop();
//             });

//             collector.on('end', (collected) => {
//                 if (collected.size === 0) {
//                     interaction.editReply('User selection timeout. Please run the command again.');
//                 }
//             });
//         } catch (error) {
//             console.error(error);
//             interaction.reply('An error occurred while searching for the user.');
//         }
//     },
// };

const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder,SelectMenuBuilder, MessageSelectMenuBuilder } = require('discord.js');
const axios = require("axios");

const BannedTerms = ["fuck", "shit", "bitch", "slut", "nigger", "nigga", "hentai"]

let isCommandRunning = false;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('usersearch')
        .setDescription('Search a user on Roblox')
        .addStringOption((option) =>
            option.setName('username').setDescription('Roblox Username').setRequired(true)
        ),

    async execute(interaction) {
        if (isCommandRunning) {
            interaction.reply('Command is still processing. Please wait.');
            return;
        }

        isCommandRunning = true;
        console.log(isCommandRunning)

        const RobloxName = interaction.options.getString('username', true);

        async function searchUsersByKeyword(keyword, limit) {
            const apiUrl = `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`;

            try {
                const response = await axios.get(apiUrl);
                return response.data.data;
            } catch (error) {
                throw error;
            }
        }

        async function getUserInfo(userId) {
            const apiUrl = `https://users.roblox.com/v1/users/${userId}`;

            try {
                const response = await axios.get(apiUrl);
                return response.data;
            } catch (error) {
                throw error;
            }
        }

        async function getUserHeadshot(userId) {
            const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?size=420x420&format=png&userIds=${userId}`;

            try {
                const response = await axios.get(apiUrl);
                return response.data?.data[0].imageUrl;
            } catch (error) {
                throw error;
            }
        }

        async function getFollowerCount(userId) {
            const apiUrl = `https://friends.roblox.com/v1/users/${userId}/followers/count`;

            try {
                const response = await axios.get(apiUrl);
                return response.data.count;
            } catch (error) {
                throw error;
            }
        }

      
        try {
            const searchTerm = RobloxName;
            const limit = 10;

            const searchResults = await searchUsersByKeyword(searchTerm, limit);

            if (BannedTerms.some(term => searchTerm.toLowerCase().includes(term.toLowerCase()))) {
                const embed = new EmbedBuilder()
                .setTitle("The search term contains a banned word. Please try a different username.")
                .setColor("Red")
                
                interaction.reply({ embeds: [embed] })
                isCommandRunning = false;
                return;
            }

            if (!searchResults || searchResults.length === 0) {
                interaction.reply('No results found. Please try a different username.');
                return;
            }

            const userChoices = searchResults.map((user, index) => ({
                label: user.displayName,
                value: String(index),
                description: `UserID: ${user.id}`,
            }));

            const components = [
                {
                    type: 1,
                    components: [
                        {
                            type: 3,
                            customId: 'selectUser',
                            options: userChoices,
                            placeholder: 'Select a user',
                        },
                    ],
                },
            ];

            interaction.reply({
                content: 'Please choose a user:',
                components: components,
            });

            const filter = (interaction) => interaction.customId === 'selectUser' && interaction.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (interaction) => {
                const selectedUserIndex = interaction.values[0];
                const selectedUser = searchResults[selectedUserIndex];

                const userInfo = await getUserInfo(selectedUser.id);
                const headshotUrl = await getUserHeadshot(selectedUser.id);
                const followerCount = await getFollowerCount(selectedUser.id);

                const userEmbed = new EmbedBuilder()
                    .setTitle(`User Search for: ${searchTerm}`)
                    .setColor('Random')
                    .setThumbnail(headshotUrl)
                    .addFields(
                        { name: 'UserId', value: `${selectedUser.id}`, inline: true },
                        { name: 'Bio', value: `${userInfo.description || 'No bio available'}`  },
                        { name: 'Follower Count', value: `${followerCount.toLocaleString()}`, inline: true  },
                        { name: 'DisplayName', value: `${selectedUser.displayName}`, inline: true  },
                        { name: "Created", value: `<t:${Math.floor(new Date(userInfo.created).getTime() / 1000)}:R>`, inline: true },
                        { name: 'Banned', value: `${userInfo.isBanned}`, inline: true }
                    )
                    

                const profileButton = new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('View Profile')
                    .setURL(`https://www.roblox.com/users/${selectedUser.id}/profile`);


                    const row = new ActionRowBuilder()
			        .addComponents(profileButton);
               

                interaction.reply({ content: 'User selected:', embeds: [userEmbed], components: [row] });
                collector.stop();
            });

            collector.on('end', (collected) => {
                if (collected.size === 0) {
                    interaction.followUp('User selection timeout. Please run the command again.');
                }
                isCommandRunning = false;
            });
        } catch (error) {
            console.error(error);
            interaction.reply(`An error occurred while searching for the user. | Error: ${error}`);
            isCommandRunning = false;
        }

       
        setTimeout(() => {
            isCommandRunning = false;
            const ReplyEmbed = new EmbedBuilder()
            .setTitle('You can now run the command again.')
            .setColor("Green")
            interaction.followUp({
                content: "You can now run the command again."
            });
        }, 60000);
    },
};