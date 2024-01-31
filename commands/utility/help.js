const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle} = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Commands for RoSearcher"),

   

    async execute(interaction) {
        const botStaffRoleId = '1200587720062414859'

        if (interaction.member.roles.cache.has(botStaffRoleId)) {
                const Embed = new EmbedBuilder()
                .setTitle("RoSearcher Command's")
                .setColor("Aqua")
                .setDescription("RoSearcher Has a bunch of commands")
                .addFields(
                    { name: 'Roblox', value: `</usersearch:1184875723316527176>`},
                    { name: "Utility", value: `</afk:1191020022055845898>, </appeal:1200417905645461587>, </ping:1184518488786743338>, </help:1201353626157842433>`},
                    { name: "Staff", value: `</userinfo:1200598169344548967>`}
                )

               await interaction.reply({ embeds: [Embed]}) 
        } else {
                interaction.reply("e")
        }
    }
}