const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

async function executeCommand(interaction, commandName, folderName) {
    const command = interaction.client.commands.get(commandName);

    if (!command) {
        return interaction.reply(`There is no command with name \`${commandName}\`!`);
    }

    const resolvedPath = path.resolve(process.cwd(), 'commands', folderName, `${command.data.name}.js`);
    delete require.cache[resolvedPath];

    try {
        interaction.client.commands.delete(command.data.name);
        const newCommand = require(resolvedPath);
        interaction.client.commands.set(newCommand.data.name, newCommand);
        await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
    } catch (error) {
        console.error(error);
        await interaction.reply(`There was an error while reloading a command \`${command.data.name}\`:\n\`${error.message}\``);
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reload')
        .setDescription("[RoSearcher Developer Command]")
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
        const folderName = interaction.options.getString('folder', true).toLowerCase();

        if (interaction.user.id === "919674489581731842") {
            await executeCommand(interaction, commandName, folderName);
        } else {
            await interaction.reply("You are not authorized to use this command.");
        }
    },
};

module.exports.executeCommand = executeCommand;
