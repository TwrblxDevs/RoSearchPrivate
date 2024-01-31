
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const mongoose = require('mongoose');
const BlacklistModel = require('../../schemas/blacklists');


// const uri = "mongodb+srv://RoDB:RoDB@rosearch.frdmhyd.mongodb.net/"
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: `prod`, });

module.exports = {
  data: new SlashCommandBuilder()
    .setName("removeblacklist")
    .setDescription("[RoSearcher Developer Command]")
    .addUserOption(option => option.setName("user").setDescription("User to remove").setRequired(true)),

  async execute(interaction) {
    const notadevEmbed = new EmbedBuilder().setTitle("You are not a developer").setColor("Red");

    if (interaction.user.id === "919674489581731842") {
      const user = interaction.options.getUser('user');

      try {
        const existingUser = await BlacklistModel.findOne({ UserID: user.id });

        if (existingUser) {
          await BlacklistModel.deleteOne({ UserID: user.id });

          const userRemovedEmbed = new EmbedBuilder()
            .setTitle("✅ User Removed from the MongoDB Collection")
            .setColor("Green")
            .addFields(
              { name: "UserID", value: user.id }
            )
            .setThumbnail(user.displayAvatarURL());

          interaction.reply({ embeds: [userRemovedEmbed] });
        } else {
          const userNotFoundEmbed = new EmbedBuilder()
            .setTitle("❌ User not found in the MongoDB collection.")
            .setColor("Red")
            .setThumbnail(user.displayAvatarURL())
            .addFields(
              { name: "UserID", value: user.id }
            );

          interaction.reply({ embeds: [userNotFoundEmbed] });

          const channel = client.channels.cache.get("1185239093311971348")
    
          if (channel) {
            const userAddedEmbed = new EmbedBuilder()
              .setTitle('✅ User Removed from the Blacklist')
              .setColor("Red")
              .addFields(
                { name: "UserID", value: user.id },
              )

            channel.send({ embeds: [userAddedEmbed] }).catch(error => {
              console.error(`Error sending message to channel: ${error.message}`);
            });
          }
        }
      } catch (error) {
        console.error('Error interacting with MongoDB:', error);
        interaction.reply('An error occurred while processing the request.');
      }
    } else {
      interaction.reply({ embeds: [notadevEmbed] });
    }
  },
};
