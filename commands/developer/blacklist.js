// const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
// const fs = require('fs');
// const { url } = require('inspector');
// const BanJsonFilePath = "./database/bannedusers.json";



// module.exports = {
//     data: new SlashCommandBuilder()
//     .setName("blacklist")
//     .setDescription("DEVELOPER COMMAND")
    
//     .addUserOption(option => 
//         option.setName("user")
//         .setRequired(true)
//         .setDescription("user to blacklist")
//         )
//         .addStringOption(option =>
//             option.setName("reason")
//             .setRequired(true)
//             .setDescription("Blacklist Reason")
//             ),

//     async execute(interaction) {

//         const notadevEmbed = new EmbedBuilder()
//         .setTitle("You are not a developer")
//         .setColor("Red")


//         if (interaction.user.id === "919674489581731842") {
//         const user = interaction.options.getUser('user')
//         const reason = interaction.options.getString('reason')

        
       
//         function addUserToJsonFile(userId, filePath) {
//             try {
//               const jsonData = fs.readFileSync(filePath, 'utf-8');
          
//               const data = JSON.parse(jsonData);
          
//               if (!data.users) {
//                 data.users = [];
//               }
          
//               if (!data.users.includes(userId)) {
//                 data.users.push(userId);
          
//                 const updatedJsonData = JSON.stringify(data, null, 2);
          
//                 fs.writeFileSync(filePath, updatedJsonData, 'utf-8');

//                 const userAdded = new EmbedBuilder()
//                 .setTitle("✅ User Added to the JSON File")
//                 .setColor("Yellow")
//                 .addFields(
//                     { name: "UserID", value: userId },
//                     { name: `Reason`, value: reason}
//                 )
//                 .setThumbnail(user.displayAvatarURL())

//                 const UserExists = new EmbedBuilder()
//                 .setTitle("❌ User already exists in the JSON file.")
//                 .setColor("Red")
//                 .setThumbnail(user.displayAvatarURL())
//                 .addFields(
//                   { name: "UserID", value: userId }
//                 )
          
//                 interaction.reply({ embeds: [userAdded]});
//                 return true;
//               } else {
//                 interaction.reply(`User ${userId} already exists in the JSON file.`);
//                 return false;
//               }
//             } catch (error) {
//               console.error('Error reading, parsing, or writing to the JSON file:', error);
//               return false;
//             }
//           }
          
//           const id = user?.id

//           // if (id != "919674489581731842") {
//           addUserToJsonFile(id, BanJsonFilePath)
         

//           const BlacklistedEmbed = new EmbedBuilder()
//           .setTitle("You have been Blacklisted from RoSearcher")
//           .setThumbnail(user.displayAvatarURL())
//           .addFields(
//             { name: "Reason", value: reason}
//           )
//           .setColor("Red")
          
//          user.send({ embeds: [BlacklistedEmbed] })
      
          
          
          
//           if (id === "919674489581731842") {
//             interaction.reply('This user is immune to Blacklisting as they own the bot')
//           }

//           if (id === "1182682121094049923") {
//             interaction.reply("How stupid are you blacklisting the bot crashes it...")
//           }
//     }
//     if (!interaction.user.id === "919674489581731842") {
//             interaction.reply({ embeds: [notadevEmbed]})
//     }
//         }
//  }




const clc = require('cli-color');
const { SlashCommandBuilder, EmbedBuilder, Client, ChatInputCommandInteraction } = require('discord.js');
const mongoose = require('mongoose');
const BlacklistModel = require('../../schemas/blacklists');
const User = require('../../schemas/User');



// const uri = "mongodb+srv://RoDB:RoDB@cluster0.n6svlkv.mongodb.net/";
// mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: `dev`, });


module.exports = {
  data: new SlashCommandBuilder()
    .setName("blacklist")
    .setDescription("DEVELOPER COMMAND")
    .addUserOption(option => option.setName("user").setRequired(true).setDescription("User to blacklist"))
    .addStringOption(option => option.setName("reason").setRequired(true).setDescription("Blacklist Reason"))
    .addStringOption(option =>
        option.setName("type")
        .setRequired(true)
        .setDescription("Blacklist Type")
        .addChoices(
          { name: 'Permanent', value: 'Permanent'},
          { name: "Temp", value : "Temp"}
        )
      ),

      /**
      @param {Client} client
      @param {ChatInputCommandInteraction} interaction
      */

      async execute(interaction, client) {
        const notadevEmbed = new EmbedBuilder()
        .setTitle("You are not a developer")
        .setColor("Red");
    
        if (interaction.user.id === "919674489581731842") {
          const user = interaction.options.getUser('user');
          const reason = interaction.options.getString('reason');
          const type = interaction.options.getString("type")
    
          try {
            const existingUser = await BlacklistModel.findOne({ UserID: user.id });
    
            if (!existingUser) {
              const newBlacklistedUser = new BlacklistModel({ UserID: user.id, info: { reason, type } });
              await newBlacklistedUser.save();
    
              const userAdded = new EmbedBuilder()
                .setTitle("✅ User Added to the MongoDB Collection")
                .setColor("Yellow")
                .addFields(
                  { name: "UserID", value: user.id },
                  { name: "Reason", value: reason },
                  { name: 'Type', value: type }
                )
                .setThumbnail(user.displayAvatarURL());
    
              interaction.reply({ embeds: [userAdded] });
    
          
                  const UserEmbed = new EmbedBuilder()
                  .setTitle("You have been Blacklisted fron RoSearcher")
                  .setColor("Red")
                  .addFields(
                    { name: 'How to Appeal', value: 'To appeal a Blacklist run /appeal in either the bots DMs or our Discord Server'}
                  )
                  .setFooter(
                    { text: 'Offical RoSearcher Blacklist'}
                  )
  
                  
                  user.send({ embeds: [UserEmbed]}).catch(e => {
                    console.error(clc.redBright("[ERROR]:"), clc.red(e.message))
                  })


              const channel = client.channels.cache.get("1185239093311971348")
    
              if (channel) {
                const userAddedEmbed = new EmbedBuilder()
                  .setTitle('✅ User Added to the Blacklist')
                  .setColor('Yellow')
                  .addFields(
                    { name: "UserID", value: user.id },
                    { name: "Reason", value: reason },
                    { name: 'Type', value: type },
                    { name: "Moderator", value: interaction.user.username }
                  )
    
                channel.send({ embeds: [userAddedEmbed] }).catch(error => {
                  console.error(`Error sending message to channel: ${error.message}`);
                });
              }
            } else {
              const userExistsEmbed = new EmbedBuilder()
                .setTitle("❌ User already exists in the MongoDB collection.")
                .setColor("Red")
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                  { name: "UserID", value: user.id }
                );
    
              interaction.reply({ embeds: [userExistsEmbed] });
            }
          } catch (error) {
            console.error('Error interacting with MongoDB:', error);
          }
        } else {
          interaction.reply({ embeds: [notadevEmbed] });
        }
      },
    }; 