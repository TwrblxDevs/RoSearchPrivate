const {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../schemas/User");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("afk")
    .setDescription("Go AFK")
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reasoning for going AFK")
        .setRequired(false)
    ),
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   * @param {Client} client
   */
  execute(interaction, client) {
    const reason = interaction.options.getString("reason") || "Unspecified";
    User.findOne({ UserID: interaction.user.id }).then((data) => {
      if (!data) {
        const embed = new EmbedBuilder()
          .setTitle(`You are now AFK: ${reason}`)
          .setColor("Blue")
          .setFooter({
            text: `Command Recoded by 1dxy00 | https://github.com/1dxy00`,
          });
        User.create({
          UserID: interaction.user.id,
          "afk.isAfk": true,
          "afk.reason": reason,
        }).then(() => {
          interaction.reply({ embeds: [embed], ephemeral: true });
        });
      } else if (data) {
        const embed = new EmbedBuilder()
          .setTitle(`You are now AFK: ${reason}`)
          .setColor("Blue")
          .setFooter({
            text: `Command Recoded by 1dxy00 | https://github.com/1dxy00`,
          });
        if (data.afk.isAfk === true) {
          return interaction.reply({ content: "You're already afk." });
        }
        // if user passed in a different reason whilst already being afk
        User.findOneAndUpdate({ "afk.isAfk": true, "afk.reason": reason }).then(
          () => {
            interaction.reply({ embeds: [embed], ephemeral: true });
          }
        );
      }
    });
  },
};
