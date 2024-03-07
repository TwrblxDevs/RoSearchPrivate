const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, Client, ChatInputCommandInteraction } = require("discord.js")
const UserModel = require('.././../schemas/User')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("message")
        .setDescription("[RoSearcher Developer Command]")
        .addUserOption(option =>
                option
                .setName('user')
                .setDescription("user")
                .setRequired(true)
            )

            .addStringOption(option =>
                    option
                    .setName('message')
                    .setDescription('message')
                    .setRequired(true)
                ),

            /**
               @param {Client} client
               @param {ChatInputCommandInteraction} interaction
             */

               async execute(interaction, client) {
                try {

                    const User = await interaction.options.getUser('user')
                    const MSG = await interaction.options.getString('message')

                    const UID = User.id

                    if (User) {
                        UserModel.findOne({ UserID: UID}).then((data) => {
                            if (!data) return;
                            if (data.Notifs.isSubbed === true) {
                                const Confirm = new ButtonBuilder()
                                .setCustomId('DMConfirm')
                                .setLabel("Confirm")
                                .setStyle(ButtonStyle.Success)
        
                                const Cancel = new ButtonBuilder()
                                .setCustomId("DMCancel")
                                .setLabel('Cancel')
                                .setStyle(ButtonStyle.Danger)
        
        
                                const row = new ActionRowBuilder()
                                .addComponents(Confirm, Cancel)
        
                                const Embed = new EmbedBuilder()
                                .setColor("Yellow")
                                .setTitle(`Confirm Message to: ${User.username}`)
        
                                const response = interaction.reply({ embeds: [Embed], components: [row], ephemeral: true})
        
                                const collectorFilter = m => m.customId === "DMConfirm" || m.customId === "DMCancel";
                                const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 });
        
                                collector.on('collect', async m => {
                                    if (m.user.id !== '919674489581731842') {
                                        const noUseEmbed = new EmbedBuilder()
                                        .setTitle("You are not authorized to use these buttons.")
                                        .setColor("Red")
                            
                            
                                          await m.reply({ content: 'You are not authorized to use these buttons.', ephemeral: true });
                                          return;
                                      }
        
                                      if (m.customId === "DMConfirm") {
                                        User.send({ content: `Message from RoSearcher Developer: ${MSG}`})
                                        interaction.editReply({ content: "Message Sent", embeds: [], components: []})
                                      }
                                })
                            } else {
                                interaction.reply("User Has Refused to be Dmed Notifs,")
                            }
                        })
                      
                    }

                } catch (error) {
                    console.error('Error in dm command:', error);
            interaction.reply(`An error occurred while processing the command. ${error}`);
                }
               }
}