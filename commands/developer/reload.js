const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('DEVELOPER COMMAND')
        .addStringOption(option =>
            option.setName('folder')
            .setDescription("Command Folder")
            .setRequired(true))
		.addStringOption(option =>
			option.setName('command')
				.setDescription('The command to reload.')
				.setRequired(true)),
                async execute(interaction) {
                    const commandName = interaction.options.getString('command', true).toLowerCase();
                    const command = interaction.client.commands.get(commandName);
                    const Folder = interaction.options.getString('folder', true).toLowerCase();
                    
            
                    if (interaction.user.id == "919674489581731842") {
                    if (!command) {
                        return interaction.reply(`There is no command with name \`${commandName}\`!`);
                    }

                    delete require.cache[require.resolve(`./commands/${Folder}/${command.data.name}.js`)];

                    try {
                        interaction.client.commands.delete(command.data.name);
                        const newCommand = require(`./${command.data.name}.js`);
                        interaction.client.commands.set(newCommand.data.name, newCommand);
                        await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
                    } catch (error) {
                        console.error(error);
                        await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
                    }
                }
                },
            
                
            };
