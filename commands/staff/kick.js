const { SlashCommandBuilder, EmbedBuilder,Client, ChatInputCommandInteraction } = require("discord.js")
const config = require("../../config.json")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("[RoSearcher Staff Command]")
    .addUserOption(option => 
        option
        .setName("user")
        .setDescription("user to kick")
        .setRequired(true)
        )
    .addStringOption(option =>
        option
        .setName("reason")
        .setDescription("reason of kick")
        .setRequired(true)
        ),
        
             /**
    @param {Client} client
    @param {ChatInputCommandInteraction} interaction
    */

    async execute(interaction) {
        const user = interaction.options.getUser("user")
        const reason = interaction.options.getString("reason")

        const isStaff = config.staffIds.includes(interaction.user.id)
        const hasStaffRole = interaction.member.roles.cache.some(role => role.name === config.staffRoleName);



        if (user) {
               if (hasStaffRole && isStaff) {
                    const KickedEmbed = new EmbedBuilder()
                    .setTitle("user Kicked")
                    .setColor("Yellow")
                    .addFields(
                        { name: 'Username', value: user.username },
                        { name: "UserID", value: user.id },
                        { name: "Reason", value: reason },
                        // { name: "Moderator", value: interaction.user.username }
                        )
                    .setThumbnail(user.displayAvatarURL())

                    interaction.reply({ embeds: [KickedEmbed] })



                    const LogChannel = client.channels.cache.get("1204126123856887859")


                    if (LogChannel) {
                        const KickAdded = new EmbedBuilder()
                    .setTitle("user Kicked")
                    .setColor("Yellow")
                    .addFields(
                        { name: 'Username', value: user.username },
                        { name: "UserID", value: user.id },
                        { name: "Reason", value: reason },
                        { name: "Moderator", value: interaction.user.username }
                        )
                .setThumbnail(user.displayAvatarURL())

                LogChannel.send({ embeds: [KickAdded] })
                
                user.kick(reason)
                    }



               } else if (!hasStaffRole && !isStaff) {
                    return interaction.reply("Command Error: You are not allowed to run this command.")
               }
        } else {
            const Embed = new EmbedBuilder()

            return interaction.reply({ embeds: [Embed] })

        }
    }    
}