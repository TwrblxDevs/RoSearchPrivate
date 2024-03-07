const UserModel = require('../../schemas/Roblox');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');
const axios = require("axios");
const randomCode = require("random-code.js");
const Config = require("../../config.json");
const { config } = require('dotenv');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("linkprofile")
        .setDescription("Link your Roblox Profile with RoSearcher")
        .addStringOption((option) =>
            option.setName('username').setDescription('Roblox Username').setRequired(true)
        ),

    async execute(interaction) {
        try {
            const RobloxName = interaction.options.getString("username", true);

            if (Config.LinkProfileDisabled && interaction.user.id !== Config.DevID) {
                const DisabledEmbed = new EmbedBuilder()
                .setTitle("Command Disabled Via Developer")
                .setDescription("Note from developer: The Link Profile Command has been disabled as it is in its very early stages of **beta** and is only allowed to be ran by devs as of now.")
                .setColor("Red")

                return interaction.reply({ embeds: [DisabledEmbed] })
            }

            async function searchUsersByKeyword(keyword, limit) {
                const apiUrl = `https://users.roblox.com/v1/users/search?keyword=${keyword}&limit=${limit}`;
                try {
                    const response = await axios.get(apiUrl);

                    if (response.status === 429) {
                        console.log("LinkProfile 429");
                    }

                    if (response.status === 200) {
                        return response.data.data;
                    }
                } catch (error) {
                    console.error(`API Error: ${error}`);
                }
            }

            async function getUserHeadshot(userId) {
                const apiUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?size=420x420&format=png&userIds=${userId}`;

                try {
                    const response = await axios.get(apiUrl);
                    return response.data?.data[0].imageUrl;
                } catch (error) {
                    console.error(`API Error: ${error}`);
                }
            }


            const generatedCode = randomCode.generateOne({
                length: 5,
                prefix: "Verify-",
                postfix: "-RoSearcher"
            });
            
            const searchTerm = RobloxName;
            const limit = 10;

            const searchResults = await searchUsersByKeyword(searchTerm, limit);

            if (!searchResults || searchResults.length === 0) {
                return interaction.reply('No results found. Please try a different username.');
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
                            customId: 'selectLinkUser',
                            options: userChoices,
                            placeholder: 'Select a user',
                        },
                    ],
                },
            ];

            interaction.reply({
                content: 'Please Choose a user:',
                components: components,
            }).then(() => {
                const filter = (interaction) => interaction.customId === 'selectLinkUser' && interaction.user.id === interaction.user.id && !interaction.deferred;
                const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

                collector.on('collect', async (interaction) => {
                    const selectedUserIndex = interaction.values[0];
                    const selectedUser = searchResults[selectedUserIndex];

                    const headshotUrl = await getUserHeadshot(selectedUser.id);

                    const userEmbed = new EmbedBuilder()
                        .setTitle(`User Selected: ${selectedUser.displayName}`)
                        .setThumbnail(headshotUrl)
                        .setDescription(`RoSearcher Link needs you to verify that this is you. Please set your Roblox bio to the following Code:`)
                        .addFields(
                            { name: 'Generated Code:', value: generatedCode}
                        )
                        .setColor("Yellow");

                    const CheckBioEmbed = new EmbedBuilder()
                    .setTitle(`<a:2217load:1207038965647937566> Waiting for user confirmation`)  
                    .setColor('Blue')  

                    const LinkButton = new ButtonBuilder()
                        .setStyle(ButtonStyle.Success)
                        .setCustomId('RoSearchLinkButton')
                        .setLabel(`Link ${selectedUser.displayName} with RoSearcher`)
                        .setEmoji('1207008747902345266');

                    const row = new ActionRowBuilder().addComponents(LinkButton);

                    try {
                        if (interaction.deferred) {
                            await interaction.editReply({
                                embeds: [userEmbed, CheckBioEmbed],
                                components: [row],
                            });
                        } else {
                            await interaction.reply({
                                embeds: [userEmbed, CheckBioEmbed],
                                components: [row],
                            });
                        }

                        const linkCollectorFilter = (interaction) => interaction.customId === 'RoSearchLinkButton' && interaction.user.id === selectedUser.id;
                        const linkCollector = interaction.channel.createMessageComponentCollector({
                            filter: linkCollectorFilter,
                            time: 60000,
                        });

                        linkCollector.on('collect', async (interaction) => {
                            const newUser = new UserModel({
                                UserID: interaction.user.id,
                                Roblox: {
                                    username: selectedUser.displayName,
                                },
                            });

                            try {
                                console.log('newUser before save:', newUser);

                                await newUser.save();

                                console.log('User saved successfully');

                                await interaction.followUp(`You have successfully linked your profile with RoSearcher!`);
                                linkCollector.stop();
                            } catch (error) {
                                console.error('Error saving to the database:', error);
                                await interaction.followUp('An error occurred during the linking process. Please try again.');
                            }
                        });
                    } catch (error) {
                        console.error('Interaction error:', error);
                    }
                });

                collector.on('end', (collected) => {
                    if (collected.size === 0) {
                        interaction.followUp('User selection timeout. Please run the command again.');
                    }
                });
            }).catch(error => console.error('Reply error:', error));

        } catch (error) {
            console.error('Command execution error:', error);
            interaction.reply('An error occurred during the linking process. Please try again.');
        }
    },
};