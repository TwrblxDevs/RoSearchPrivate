// const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder,SelectMenuBuilder, MessageSelectMenuBuilder } = require('discord.js');
// const axios = require('axios');

// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("useravatar")
//     .setDescription("Get a users avatar Items and Info")
//     .addStringOption((option) =>
//             option.setName('userid').setDescription('Roblox User ID').setRequired(true)
//         ),

//      async execute(interaction)  {
//         const UID = interaction.options.getString("userid", true);

//         async function getAvatar(ID) {
//             const AURL = `https://avatar.roblox.com/v1/users/${ID}/avatar`

//             try {
//                 const response = await axios.getAdapter(AURL);
//                 return response.data.data
//             } catch (error) {
//                 throw error;
//             }
//         }

//         try {
//             const ID = UID
//             const AvatarResults = await getAvatar(ID)

//             const UserEmbed = new EmbedBuilder()
//             .setTitle("Avatar Results")

//         } catch (error) {
//             throw error;
//         }
//      }

// }

const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, SelectMenuBuilder, MessageSelectMenuBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("useravatar")
        .setDescription("Get a user's avatar Items and Info")
        .addStringOption((option) =>
            option.setName('userid').setDescription('Roblox User ID').setRequired(true)
        ),

    async execute(interaction) {
        const UID = interaction.options.getString("userid", true);
        async function getAvatar(ID) {
            const AURL = `https://avatar.roblox.com/v1/users/${ID}/avatar`;
        
            try {
                const response = await axios.get(AURL);
        
                console.log("API Response:", response.data);
        
                if (response.status === 404) {
                    console.error("User Not Found:", `User with ID ${ID} not found or has no public avatar information.`);
                    throw new Error(`User not found or no avatar information available.`);
                }
        
                if (response.data.errors) {
                    const errorMessages = response.data.errors.map(error => error.message).join(', ');
                    console.error("API Errors:", errorMessages);
                    throw new Error(`API Error: ${errorMessages}`);
                }
        
                if (response.data === undefined) {
                    console.error("API Response Data:", response.data);
                    throw new Error("Avatar data not found in the API response.");
                }
        
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

        
        
        
        
        try {
            const ID = UID;
            const AvatarResults = await getAvatar(ID);
        
            if (!AvatarResults) {
                await interaction.reply("User not found or no avatar information available.");
                return;
            }
        
            function getRobloxAssetUrl(assetId) {
                return `https://www.roblox.com/catalog/${assetId}`;
            }

            const headshotUrl = await getUserHeadshot(UID);


            const UserEmbed = new EmbedBuilder()
                .setTitle("Avatar Results")
                .setColor("Random")
                .setThumbnail(headshotUrl)
                .addFields(
                    { name: "Avatar Scales", value: JSON.stringify(AvatarResults.scales) },
                    { name: "Body Colors", value: JSON.stringify(AvatarResults.bodyColors)},
                    { name: "Avatar Assets", value: AvatarResults.assets.map(asset => `[${asset.name}](${getRobloxAssetUrl(asset.id)}) (${asset.assetType.name})`).join('\n')},
                    { name: "Emotes", value: AvatarResults.emotes.map(emote => `${emote.assetName}`).join(', ')}
                )
        
       
  
        
            await interaction.reply({ embeds: [UserEmbed] });
        } catch (error) {
            console.error(error.message);
            await interaction.reply(error.message);
        }
    }
};
