const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits, ActivityType, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, WebhookClient, Message } = require('discord.js');
const Canvas = require('@napi-rs/canvas');
const { request, RetryHandler } = require('undici');
const clc = require("cli-color")
const axios = require("axios")
const BanJsonFilePath = "./database/bannedusers.json";
const User = require("./schemas/User");
const Blacklists = require("./schemas/blacklists")
// require("./events/afkMessageCreate.js")
const mongoose = require("mongoose")
const config = require('./config.json')


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent,
] });

const { Webhook } = require('discord-webhook-node');
const { exec } = require('node:child_process');
const blacklists = require('./schemas/blacklists');

const hook = new Webhook("https://discord.com/api/webhooks/1184513322163384320/smzI6Ri-4RMu5Vrq7IRLP5G0-dBMwQPZdunYZCJcQqbH4y6SpRHZvv-JGmc7Dq9Pcp9s");

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

const OnlineEmbed = new EmbedBuilder()
.setTitle("Bot has been started")
.setColor("Green")

const BotShuttingDown = new EmbedBuilder()
.setTitle("Bot Shutdown")

client.on(Events.ClientReady, RC => {

	mongoose
    .connect("mongodb+srv://RoDB:RoDB@rosearch.frdmhyd.mongodb.net/", {
	  dbName: `test`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("🟩 Connected to Database.");
    })
    .catch((e) => {
      console.error(e)
      console.log("🟪 Failed Database Connection");
	  
    });

	console.log(clc.greenBright(`Ready! Logged in as`), clc.whiteBright(`${RC.user.tag}`));
  console.log(clc.greenBright("[Server] Sup im online"))
  const LogChannel = client.channels.cache.get('1185239390742655006')
  LogChannel.send({ embeds: [OnlineEmbed]})
    client.user.setPresence({
        activities: [{ name: `${client.guilds.cache.size} Guilds | ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()} Users`, type: ActivityType.Watching }],
        status: 'idle',
      });
});

// if (!data) return;
//       if (data.afk.isAfk === false) {
//         return;
//       } else if (data.afk.isAfk === true) {
//         User.findOneAndUpdate({ "afk.isAfk": false }).then(() => {
//           interaction.reply({ content: "YOUR AFK STATUS HAS BEEN REMOVED" });
//         });
//       }

//     const tagMember = interaction.mentions.users.map((msg) => msg.id);
//     if (tagMember.length > 0) {
//       tagMember.forEach((m) => {
//         User.findOne({ UserID: m }).then((data) => {
//           if (!data) return;

//           if (data.afk.isAfk === true) {
//             interaction.reply({
//               content: `The user is currently AFK for reasoning of ${data.afk.reason}`,
//             });
//           }
//         });
//       });
//     }

client.on('messageCreate', 
/**
 * @param {Message} message
 */
async (message, client) => {
	User.findOne({ UserID: message.author.id, }).then((data) => {
		if (!data) return;
		if (data.afk.isAfk === true) {
			User.findOneAndUpdate({ "afk.isAfk": false }).then(() => {
				message.reply({ content: "Removed status"})
			}); 
		} else if (data.afk.isAfk === false) {
			return;
		}
	})

	  // tag
	  const tagMember = await message.mentions.users.map((msg) => msg.id);
	  if (tagMember.length > 0) {
		tagMember.forEach((m) => {
		  User.findOne({ UserID: m }).then((data) => {
			if (!data) return;
  
			if (data.afk.isAfk === true) {
				message.reply({
				content: `The user is currently AFK for reasoning of ${data.afk.reason}`,
			  });
			}
		  });
		});
	  }
})


function isUserInJsonFile(userId, filePath) {
	try {
	  
	  const jsonData = fs.readFileSync(filePath, 'utf-8');
	  
	
	  const data = JSON.parse(jsonData);
  
	  
	  return data.users && data.users.includes(userId);
	} catch (error) {
	  console.error('Error reading or parsing the JSON file:', error);
	  return false;
	} 
  }

client.commands = new Collection();
client.cooldowns = new Collection();

client.on('unhandledRejection', async (error) => {
  console.error('Discord.js error:', error);

  const userId = "919674489581731842";
  const user = await client.users.fetch(userId);
  console.log('User ID:', userId);

  if (user) {
    user.send(`An error occurred:\n\`\`\`${error.message}\`\`\``)
      .then(() => console.log('Error message sent successfully.'))
      .catch((sendError) => console.error('Error sending message:', sendError));
  } else {
    console.error(`User with ID ${userId} not found.`);
  }
});


// client.on(Events.InteractionCreate, async interaction => {
//     if (!interaction.isModalSubmit()) return;
//     if (interaction.customId === 'appelModal') {
        
//         const appealID = interaction.fields.getTextInputValue('appealModalUserIDinput');
//         console.log({ appealusername, appealreason, appealID });
//         await interaction.reply({ content: 'Your appeal was received successfully!', ephemeral: false });

//         const channel = client.channels.cache.get("1185235397266116610");

//         const AppealEmbed = new EmbedBuilder()
//             .setTitle("Pending Appeal Request")
//             .setColor("Yellow")
//             .addFields(
//                 { name: "Reason", value: `\`${appealreason}\`` },
//                 { name: "Username", value: `${interaction.user.username}` },
//                 { name: "ID", value: `${interaction.user.id}` }
//             );

//         const accept = new ButtonBuilder()
//             .setCustomId("AppealAccept")
//             .setLabel("Remove Blacklist")
//             .setStyle(ButtonStyle.Success);

//         const deny = new ButtonBuilder()
//             .setCustomId("AppealDeny")
//             .setLabel("Deny Blacklist")
//             .setStyle(ButtonStyle.Danger);

//         const row = new ActionRowBuilder()
//             .addComponents(accept, deny);

//         const response = await channel.send({ embeds: [AppealEmbed], components: [row] });

//         const collectorFilter = i => i.customId === "AppealAccept" || i.customId === "AppealDeny";
//         const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 }); // Set your desired time

//         collector.on('collect', async i => {
//             if (i.customId === "AppealAccept") {
//                 await blacklists.deleteOne({ UserID: interaction.user.id });
//                 await i.update({ content: `Appeal Accepted and Removed from MongoDB Collection`, components: [] });
//             } else if (i.customId === 'AppealDeny') {
//                 await i.update({ content: 'Action cancelled', components: [] });
//             }
//             collector.stop();
//         });

//         collector.on('end', collected => {
//             if (collected.size === 0) {
//                 interaction.followUp({ content: 'Confirmation not received, cancelling', ephemeral: false });
//             }
//         });
//     }
// });

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId === 'appelModal') {
      
      const appealreason = interaction.fields.getTextInputValue('appealModalReasoninput');

      const UserCheckBeforeSendEmbed = new EmbedBuilder()
      .setTitle("Appeal Preview")
      .setColor("Yellow")
  
      await interaction.reply({ content: 'Your appeal was received successfully!', ephemeral: false });

      const channel = client.channels.cache.get("1185235397266116610");

      const AppealEmbed = new EmbedBuilder()
          .setTitle("Pending Appeal Request")
          .setColor("Yellow")
          .addFields(
              { name: "Reason", value: `\`${appealreason}\`` },
              { name: "Username", value: `${interaction.user.username}` },
              { name: "ID", value: `${interaction.user.id}` }
          );

      const AppealDeniedEmbed = new EmbedBuilder()
          .setTitle("Your appeal has been Denied")
          .setColor("Red")   

      const accept = new ButtonBuilder()
          .setCustomId("AppealAccept")
          .setLabel("Remove Blacklist")
          .setStyle(ButtonStyle.Success);

      const deny = new ButtonBuilder()
          .setCustomId("AppealDeny")
          .setLabel("Deny Blacklist")
          .setStyle(ButtonStyle.Danger);

      const row = new ActionRowBuilder()
          .addComponents(accept, deny);

      const response = await channel.send({ embeds: [AppealEmbed], components: [row] });

      const collectorFilter = m => m.customId === "AppealAccept" || m.customId === "AppealDeny";
      const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 }); // Set your desired time

      collector.on('collect', async m => {
          if (m.user.id !== '919674489581731842') {
              await m.reply({ content: 'You are not authorized to use these buttons.', ephemeral: true });
              return;
          }

          if (m.customId === "AppealAccept") {
              await blacklists.deleteOne({ UserID: interaction.user.id });
              await m.update({ content: `Appeal Accepted and Removed from MongoDB Collection`, components: [] });
          } else if (m.customId === 'AppealDeny') {
           await m.update({ content: 'Appeal Denied', components: [] });
              interaction.user.send({ embeds: [AppealDeniedEmbed]});
          }
          collector.stop();
      });

      collector.on('end', collected => {
          if (collected.size === 0) {
              interaction.followUp({ content: 'Confirmation not received, cancelling', ephemeral: false });
          }
      });
  }
});


// client.on(Events.InteractionCreate, async interaction => {
//     if (!interaction.isModalSubmit()) return;
//     if (interaction.customId === 'appelModal') {
        
//         const appealreason = interaction.fields.getTextInputValue('appealModalReasoninput');
//         // console.log({ appealusername, appealreason, appealID });
		
//         await interaction.reply({ content: 'Your appeal was received successfully!', ephemeral: false });

//         const channel = client.channels.cache.get("1185235397266116610");

//         const AppealEmbed = new EmbedBuilder()
//             .setTitle("Pending Appeal Request")
//             .setColor("Yellow")
//             .addFields(
//                 { name: "Reason", value: `\`${appealreason}\`` },
//                 { name: "Username", value: `${interaction.user.username}` },
//                 { name: "ID", value: `${interaction.user.id}` }
//             );



//         const AppealDeniedEmbed = new EmbedBuilder()
//         .setTitle("Your appeal has been Denied")
//         .setColor("Red")   

//         const accept = new ButtonBuilder()
//             .setCustomId("AppealAccept")
//             .setLabel("Remove Blacklist")
//             .setStyle(ButtonStyle.Success);

//         const deny = new ButtonBuilder()
//             .setCustomId("AppealDeny")
//             .setLabel("Deny Blacklist")
//             .setStyle(ButtonStyle.Danger);

//         const row = new ActionRowBuilder()
//             .addComponents(accept, deny);

//         const response = await channel.send({ embeds: [AppealEmbed], components: [row] });

//         const collectorFilter = m => m.customId === "AppealAccept" || m.customId === "AppealDeny";
//         const collector = response.createMessageComponentCollector({ filter: collectorFilter, time: 60000 }); // Set your desired time

//         collector.on('collect', async m => {
//             if (m.customId === "AppealAccept") {
//                 await blacklists.deleteOne({ UserID: interaction.user.id });
//                 await m.update({ content: `Appeal Accepted and Removed from MongoDB Collection`, components: [] });
//             } else if (m.customId === 'AppealDeny') {
//                 await m.update({ content: 'Action cancelled', components: [] });
//                 interaction.user.send({ embeds: [AppealDeniedEmbed]})
//             }
//             collector.stop();
//         });

//         collector.on('end', collected => {
//             if (collected.size === 0) {
//                 interaction.followUp({ content: 'Confirmation not received, cancelling', ephemeral: false });
//             }
//         });
//     }
// });


// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isModalSubmit()) return;
// 	if (interaction.customId === 'appelModal') {
		
// 		const appealID = interaction.fields.getTextInputValue('appealModalUserIDinput')
// 		console.log({ appealusername, appealreason, appealID })
// 		await interaction.reply({ content: 'Your appeal was received successfully!' });
  
// 		const channel = client.channels.cache.get("1185235397266116610")
  
// 		const AppealEmbed = new EmbedBuilder()
// 		.setTitle("Pending Appeal Request")
// 		.setColor("Yellow")
// 		.addFields(
// 			{ name: "Reason", value: `\`${appealreason}\``},
// 			{ name: "Username", value: `${interaction.user.username}`},
// 			{ name: "ID", value: `${interaction.user.id}`}
// 		)
  
		
  
// 		const accept = new ButtonBuilder()
// 		.setCustomId("AppealAccept")
// 		.setLabel("Remove Blacklist")
// 		.setStyle(ButtonStyle.Success)
  
// 		const deny = new ButtonBuilder()
// 		.setCustomId("AppealDeny")
// 		.setLabel("Deny Blacklist")
// 		.setStyle(ButtonStyle.Danger)
  
// 		const row = new ActionRowBuilder()
// 		.addComponents(accept, deny)
  
// 		const response = channel.send({ embeds: [AppealEmbed], components: [row]})

// 		const collectorFilter = i => i.user.id === interaction.user.id;
// 		try {
// 			const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

// 			if (confirmation.customId === "AppealAccept") {
// 				await blacklists.deleteOne({ UserID: interaction.user.id })
// 				await confirmation.update({ content: `Appeal Accepted and Removed from MongoDB Collection`, components: [] })
// 			} else if (confirmation.customId === 'cancel') {
// 				await confirmation.update({ content: 'Action cancelled', components: [] });
// 			}
// 		} catch (e) {
// 			await interaction.editReply({ content: 'Confirmation not received within 1 minute, cancelling', components: [] });
// 		}
// 		}
//   });


const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}



const webhook = new WebhookClient({ url: `https://discord.com/api/webhooks/1192035421690019960/v0QurSx25tq5S9YXmmbAVZjjkbdW_5V_yFz-2lIpdHPrDAEixhFGD-doWPcECVyMoKVq` });

async function logError(error, stack) {
  const formatedStack =
    stack.length > 2048 ? stack.slice(0, 2045) + "..." : stack;

  const embed = new EmbedBuilder()
    .setColor("Red")
    .setTitle(`${error}`)
    .setDescription(`\`\`\`diff\n- ${formatedStack}\n\`\`\``);

  await webhook.send({ embeds: [embed] });
}

module.exports = {
  errorHandler: async (client) => {
    process.on("unhandledRejection", async (reason) => {
      await logError("UnhandledRejection", reason);
    });
    process.on("uncaughtException", async (error) => {
      if (error.message.includes("Cannot find module")) {
        const errorMessage = error.message.split("Require")[0].trim();
        const stack = error.stack.split(">")[1].split("\n")[0].trim();
        await logError(
          "UncaughtException",
          errorMessage + ` in a file ${stack}`
        );
      } else {
        await logError("UncaughtException", error);
      }
    });
    client.on("error", async (error) => {
      if (error.message.includes("Cannot find module")) {
        const errorMessage = error.message.split("Require")[0].trim();
        const reqStack = error.message.split("Require stack:")[1].trim();
        const stack = reqStack
          .split("\n")[0]
          .trim()
          .replace(/^[-\s]{2}/, "");
        await logError(
          "Discord.js Error",
          errorMessage + ` in a file (${stack})`
        );
      } else {
        await logError("Discord.js Error", error);
      }
    });
  },
};


// client.on(Events.InteractionCreate, async interaction => {
// 	if (!interaction.isChatInputCommand()) return;

// 	const command = interaction.client.commands.get(interaction.commandName);

// 	const userIdToCheck = interaction.user.id

// 	const isUserInFile = isUserInJsonFile(userIdToCheck, BanJsonFilePath);

// 	if (!command) {
// 		console.error(`No command matching ${interaction.commandName} was found.`);
// 		return;
// 	}

// 	if (isUserInFile) {
// 		const blacklistEmbed = new EmbedBuilder()
// 		.setTitle("You have been Blacklisted from RoSearcher")
// 		.setColor("Red")

// 		interaction.reply({ embeds: [blacklistEmbed]})
// 	}

// 	if (!isUserInFile) {
// 	try {
// 		await command.execute(interaction);
// 	} catch (error) {
// 		console.error(error);
// 		if (interaction.replied || interaction.deferred) {
// 			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 			console.error('Discord.js error:', error);

//   const userId = "919674489581731842";
//   const user = await client.users.fetch(userId);
//   console.log('User ID:', userId);

 

//   if (user) {
// // 	const ErrorEmbed = new EmbedBuilder()
// // 	.setTitle('An Error has Occurred')
// // 	.setColor("Red")
// // 	.setDescription(`Discord.js Error: ${error.message}`)

// //     user.send({ embeds: [ ErrorEmbed ]})
// //       .then(() => console.log('Error message sent successfully.'))
// //       .catch((sendError) => console.error('Error sending message:', sendError));
// // 	  client.user.setPresence({
// //         activities: [{ name: `Error in bot`, type: ActivityType.Playing }],
// //         status: 'idle',
// //       });
// // 	  setTimeout(() => {
// // 		client.user.setPresence({
			
// // 			activities: [{ name: `${client.guilds.cache.size} Guilds | ${client.users.cache.size} Users`, type: ActivityType.Watching }],
// // 			status: 'idle',
// // 		  });
// // 	  }, 5000);
// //   } else {
// //     console.error(`User with ID ${userId} not found.`);
// //   }
// 		} else {
// 			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 			console.error('Discord.js error:', error);

//   const userId = "919674489581731842";
//   const user = await client.users.fetch(userId);
//   console.log('User ID:', userId);

//   if (user) {
// // 	const ErrorEmbed = new EmbedBuilder()
// // 	.setTitle('An Error has Occurred')
// // 	.setColor("Red")
// // 	.setDescription(`Discord.js Error: ${error.message}`)

// //     user.send({ embeds: [ ErrorEmbed ]})
// //       .then(() => console.log('Error message sent successfully.'))
// //       .catch((sendError) => console.error('Error sending message:', sendError));
// // 	  client.user.setPresence({
// //         activities: [{ name: `Error in bot`, type: ActivityType.Playing }],
// //         status: 'idle',
// //       });
// // 	  setTimeout(() => {
// // 		client.user.setPresence({
// // 			activities: [{ name: `${client.guilds.cache.size} Guilds | ${client.users.cache.size} Users`, type: ActivityType.Watching }],
// // 			status: 'idle',
// // 		  });
// // 	  }, 5000);
// //   } else {
// //     console.error(`User with ID ${userId} not found.`);
// //   }
// 		}
// 	}
// }
// 	}
// }
// });

// client.on(Events.InteractionCreate, async (interaction) => {
// 	if (!interaction.isCommand()) return;
  
// 	const command = client.commands.get(interaction.commandName);
  
// 	if (!command) {
// 	  console.error(`No command matching ${interaction.commandName} was found.`);
// 	  return;
// 	}
  
// 	// Check if the user is blacklisted
// 	const userIdToCheck = interaction.user.id;
// 	const isUserBlacklisted = await blacklists.findOne({ UserID: userIdToCheck });
  
// 	if (isUserBlacklisted) {
// 	  const blacklistEmbed = new EmbedBuilder()
// 		.setTitle("You have been Blacklisted from RoSearcher")
// 		.setColor("Red");
  
// 	  interaction.reply({ embeds: [blacklistEmbed] });
// 	  return;
// 	}
  
// 	// Execute the command if the user is not blacklisted
// 	try {
// 	  await command.execute(interaction, client);
// 	} catch (error) {
// 	  console.error('Error executing command:', error);
  
// 	  const userId = "919674489581731842";
// 	  const user = await client.users.fetch(userId);
  
// 	  if (user) {
// 		const errorEmbed = new EmbedBuilder()
// 		  .setTitle('An Error has Occurred')
// 		  .setColor("Red")
// 		  .setDescription(`Discord.js Error: ${error.message}`);
  
// 		user.send({ embeds: [errorEmbed] })
// 		  .then(() => console.log('Error message sent successfully.'))
// 		  .catch((sendError) => console.error('Error sending message:', sendError));
// 	  }
  
// 	  // Handle error response to the interaction
// 	  if (interaction.replied || interaction.deferred) {
// 		await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
// 	  } else {
// 		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
// 	  }
// 	}
//   });

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isCommand()) return;
  
    const command = client.commands.get(interaction.commandName);
  
    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    
    if (interaction.commandName === 'appeal') {
        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error('Error executing command:', error);

            // Handle error response to the interaction
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        return;
    }
 

    const userIdToCheck = interaction.user.id;
    const isUserBlacklisted = await blacklists.findOne({ UserID: userIdToCheck });
  
    if (isUserBlacklisted) {
        const blacklistEmbed = new EmbedBuilder()
            .setTitle("You have been Blacklisted from RoSearcher")
            .setColor("Red")
            .setFooter(
              { text: 'Offical RoSearcher Blacklist'}
            )
  
        interaction.reply({ embeds: [blacklistEmbed] });
        return;
    }
  
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error('Error executing command:', error);

        const userId = "919674489581731842";
        const user = await client.users.fetch(userId);

        if (user) {
            const errorEmbed = new EmbedBuilder()
                .setTitle('An Error has Occurred')
                .setColor("Red")
                .setDescription(`Discord.js Error: ${error.message}`);

            user.send({ embeds: [errorEmbed] })
                .then(() => console.log('Error message sent successfully.'))
                .catch((sendError) => console.error('Error sending message:', sendError));
        }

        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: `There was an error while executing this command!, Error: ${sendError}`, ephemeral: true });
        } else {
            await interaction.reply({ content: `There was an error while executing this command!, Error: ${sendError}`, ephemeral: true });
        }
    }
});


// const developerRoleId = '1185236060737904782';

// client.on('messageCreate', async (message) => {
//   if (!message.guild) return;
//   if (message.author.id === client.user.id ) return;
  

//   if (message.mentions.members.size > 0) {
//     const developerId = '919674489581731842';

//     if (message.mentions.members.has(developerId)) {
//       if (message.mentions.members.first().roles.cache.has(developerRoleId)) {
       

// 		const warningEmbed = new EmbedBuilder()
// 		.setColor("Yellow")
// 		.setTitle('⚠️ Warning!')
// 		.setDescription(`Please avoid mentioning the developer (${message.mentions.members.first().user.tag}).`,)

//         const acknowledgeButton = new ButtonBuilder()
//           .setCustomId('acknowledgeButton')
//           .setLabel('Acknowledge')
//           .setStyle(ButtonStyle.Primary);

//         const actionRow = new ActionRowBuilder().addComponents(acknowledgeButton);

//         await message.reply({ embeds: [warningEmbed], components: [actionRow] });
//       }
//     }
//   }
// });

const developerRoleId = '1185236060737904782';

client.on('messageCreate', async (message) => {
  if (!message.guild) return;
  if (message.author.id === client.user.id) return;

  if (message.mentions.members.size > 0) {
    const developerId = '919674489581731842';
    const mentionedMember = message.mentions.members.first();


    if (
      mentionedMember.roles.cache.has(developerRoleId) ||
      message.member.roles.cache.has(developerRoleId)
    ) {
      return;
    }

    const warningEmbed = new EmbedBuilder()
      .setColor('Yellow')
      .setTitle('⚠️ Warning!')
      .setDescription(`Please avoid mentioning the developer (${mentionedMember.user.tag}).`);

    const acknowledgeButton = new ButtonBuilder()
      .setCustomId('acknowledgeButton')
      .setLabel('Acknowledge')
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(acknowledgeButton);

    await message.reply({ embeds: [warningEmbed], components: [actionRow] });
  }
});

client.on('guildMemberAdd', member => { 
    if(client.guilds.cache.get("1185235395970088970")) {
    	 member.roles.add(member.guild.roles.cache.get("1185237211705253899"));
		const embed = new EmbedBuilder()
		.setColor('Green')
		.setTitle("Welcome to the RoSearcher Support Server")
		.setDescription(`Welcome ${member.user.username} to our server! Enjoy your stay.`)
		.addFields(
			{ name: "Support Channels", value: 'Quick help: <#1185280419302740040>, Tickets: <#1185280451984756736>'},
			{ name: 'Must do', value: "Please Read the Rules: <#1185281570127483002>"}
		)

    

		const channel = member.guild.channels.cache.find(channel => channel.name === 'general');
        if (channel) {
          channel.send({ embeds: [embed]});
        }
    }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'acknowledgeButton') {
    await interaction.update({ content: 'Acknowledged!', components: [] });
  }
});




const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	
	let fontSize = 70;

	do {
		
		context.font = `${fontSize -= 10}px sans-serif`;
	
	} while (context.measureText(text).width > canvas.width - 300);

	return context.font;
};

// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "shutdown" ) {

      
    
//   }
// })

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isModalSubmit()) return;
	if (interaction.customId === 'BanModal') {
		await interaction.reply({ content: 'user banned!' });
	}
});



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'profile') {
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');


	const background = await Canvas.loadImage('https://discordjs.guide/assets/canvas-preview.30c4fe9e.png');



  context.drawImage(background, 0, 0, canvas.width, canvas.height);

	
	context.strokeStyle = '#0099ff';


	context.strokeRect(0, 0, canvas.width, canvas.height);

  const { body } = await request(interaction.user.displayAvatarURL({ extension: 'jpg' }));
	const avatar = await Canvas.loadImage(await body.arrayBuffer());

	context.beginPath();


	context.arc(125, 125, 100, 0, Math.PI * 2, true);

	
	context.closePath();


	context.clip();


	context.drawImage(avatar, 25, 0, 200, canvas.height);

  context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

	context.font = applyText(canvas, `${interaction.member.displayName}!`);
	context.fillStyle = '#ffffff';
  context.fillText(interaction.member.displayName, canvas.width / 2.5, canvas.height / 1.8);

	const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });

  

	interaction.reply({ files: [attachment] });
	}
});

// client.on(Events.InteractionCreate, async (interaction) => {
// 	if (!interaction.isCommand()) return;
  
// 	const { commandName } = interaction;
  
// 	if (commandName === 'afk') {
// 	  const reason = interaction.options.getString('reason') || 'No reason provided';
  
// 	  const userId = interaction.user.id;
// 	  client.afkStatus.set(userId, { isAFK: true, reason });
  
// 	  await interaction.reply(`You are now AFK. Reason: ${reason}`);
// 	}
//   });
  
//   client.on(Events.MessageCreate, (message) => {
// 	const userId = message.author.id;
// 	const afkInfo = client.afkStatus.get(userId);
  
// 	if (afkInfo && afkInfo.isAFK) {
// 	  message.reply(`Welcome back! You were AFK. Reason: ${afkInfo.reason}`);
	  
// 	  client.afkStatus.delete(userId);
// 	}
//   });
  
//   client.afkStatus = new Map();
  


client.login(config.TESTTOKEN);
