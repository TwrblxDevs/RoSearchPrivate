const { Client, ActivityType, Message } = require("discord.js");
const User = require("../schemas/User");

module.exports = {
	name: "messageCreate",
	/**
	 *
	 * @param {Client} client
	 * @param {Message} interaction
	 */
	async execute(interaction, client) {
	  User.findOne({ UserID: interaction.author.id }).then((data) => {
		if (!data) return;
		if (data.afk.isAfk === false) {
		  return;
		} else if (data.afk.isAfk === true) {
		  User.findOneAndUpdate({ "afk.isAfk": false }).then(() => {
			interaction.reply({ content: "YOUR AFK STATUS HAS BEEN REMOVED" });
		  });
		}
	  });
	  const tagMember = await interaction.mentions.users.map((msg) => msg.id);
	  if (tagMember.length > 0) {
		tagMember.forEach((m) => {
		  User.findOne({ UserID: m }).then((data) => {
			if (!data) return;
  
			if (data.afk.isAfk === true) {
			  interaction.reply({
				content: `The user is currently AFK for reasoning of ${data.afk.reason}`,
			  });
			}
		  });
		});
	  }
	},
  };