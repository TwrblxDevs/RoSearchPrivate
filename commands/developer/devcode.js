// const { SlashCommandBuilder, EmbedBuilder, Client, VoiceChannel } = require("discord.js")
// const axios = require("axios")
// const ytdl = require("ytdl-core");


// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("devcode")
//     .setDescription("[RoSearcher Developer Command]")
//     .addStringOption(option =>
//         option
//             .setName("code")
//             .setDescription("Dev Code")
//         ),

//         /**
//          * 
//          @param {Client} client
//          */

//         async execute(interaction, client) {
//             const DevCode = interaction.options.getString("code")
//             if (interaction.user.id === "919674489581731842") {
//                     if (DevCode === "dancing") {
//                         interaction.reply("https://cdn.discordapp.com/attachments/1191594940103413843/1201633679559106601/738440555e611e49c51b3c2bebed6edb.mp4?ex=65ca8792&is=65b81292&hm=14e0f702b249d5b9c4f444ab6044e7ff66e1dd926b56dfe008c41569a2ee4745&")
//                     }
//                     if (DevCode === "boo") {
//                         interaction.reply("https://cdn.discordapp.com/avatars/972502840247484527/6cc277505fcd2b642936883acceccdce.png?size=1024")
//                     }
//                     if (DevCode === "hooligang") {
//                         const VCID = "1185235397266116611"
//                         const Song = "../../assets/dev/hooligang.mp3"
//                         const channel = client.channels.cache.get(VCID);
//                         if (channel && channel.type === "GUILD_VOICE") {
//                             const connection = await channel.join();
//                             const stream = ytdl(Song, { filter: "audioonly" });
//                             connection.play(stream, { volume: 1.0 });
//                         }
//                     }
//             } else {
//                 return;
//             }

//         }
// }
const { SlashCommandBuilder, Client } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus, entersState, StreamType } = require("@discordjs/voice");
const path = require("path");
const { createReadStream } = require("fs");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("devcode")
        .setDescription("[RoSearcher Developer Command]")
        .addStringOption(option =>
            option
                .setName("code")
                .setDescription("Dev Code")
        ),

    async execute(interaction, client) {
        try {
            await interaction.deferReply();

            const DevCode = interaction.options.getString("code");

            if (interaction.user.id === "919674489581731842") {
                if (DevCode === "hooligang") {
                    const audioFilePath = path.join(__dirname, "../../assets/dev/hooligang.mp3");

                    const channel = interaction.member.voice.channel;
                    if (!channel) {
                        return interaction.reply("You need to be in a voice channel to use this command.");
                    }

                    const connection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: interaction.guildId,
                        adapterCreator: interaction.guild.voiceAdapterCreator,
                        selfDeaf: true,
                    });

                    connection.on(VoiceConnectionStatus.Ready, async () => {
                        console.log("Connected to voice channel.");

                        const player = createAudioPlayer();
                        const resource = createAudioResource(createReadStream(audioFilePath), {
                            inputType: StreamType.Arbitrary,
                        });

                        player.play(resource);
                        connection.subscribe(player);

                        try {
                            await entersState(player, VoiceConnectionStatus.Playing, 5000);
                            console.log("Audio played successfully.");

                            // Wait for a few seconds and then disconnect
                            setTimeout(() => {
                                connection.destroy();
                                console.log("Disconnected after 5 seconds.");
                            }, 5000);

                            return interaction.reply("Joining voice channel and playing audio...");
                        } catch (error) {
                            console.error("Error playing audio:", error);
                            return interaction.followUp("Error playing audio.");
                        }
                    });

                    connection.on(VoiceConnectionStatus.Disconnected, (err) => {
                        console.error("Disconnected from voice channel:", err);
                    });
                }
            } else {
                return interaction.reply("You do not have permission to use this command.");
            }
        } catch (error) {
            console.error("Error handling interaction:", error);
            return interaction.followUp("Error handling interaction.");
        }
    }
};