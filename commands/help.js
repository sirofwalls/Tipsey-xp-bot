const prefix = process.env.PREFIX;
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'help',
    description: 'Receive a list of commands available.',
    cooldown: 2,
    aliases: ['commands'],
    usage: prefix + 'help [command]',
    execute(message, args) {
        const data = [];
        const {commands} = message.client;
        
        if(!args.length) {
            data.push(`Here's a list of my commands.\n`);
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \'${prefix}help [command name]\' to get more info about it`);

            const embed = new MessageEmbed()
            .setTitle('Help')
            .setDescription(data,{split: true})
            .setColor('#00ff00')
            .setFooter('Server prefix \'' + prefix + '\'');
            return message.channel.send(embed)
                .then(()=> {
                    if(message.channel.type === 'dm') return;
                })
                .catch(error => {
                    console.error(error);
                    message.reply('Seems like I can\'t dm you. Check if you have dms disabled!');
                });
        }

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
        return message.reply('that\'s not a valid command!');
        
        }

        data.push(`Name: ${command.name}`);
        if(command.aliases) data.push(`Aliases: ${command.aliases.join(', ')}`);
        if(command.description) data.push(`Description: ${command.description}`);
        if(command.usage) data.push(`Usage: ${command.usage}`);

        data.push(`Cooldown: ${command.cooldown || 3} second(s)`);

        const embed = new MessageEmbed()
            .setTitle(command.name + " Command")
            .setDescription(data,{split: true})
            .setColor('#00ff00')
            .setFooter('Server prefix \'' + prefix + '\' | arguments in <> are required, [] are optional');
        message.channel.send(embed);

    },
};