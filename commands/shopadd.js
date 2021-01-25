const SHOP = require('../models/shops');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'shopadd',
    description: 'add item to shop list',
    aliases: ['sa'],
    usage: '!shopadd <item name> <item cost> <role> [inventory]',
    async execute(message, args) {
    if(!message.member.hasPermission(process.env.SHOP_MANAGE)) return message.reply("You don't have the required permissions for this command");

    if(args.length > 4) {
        return message.channel.send("Too many arguments (no spaces allowed for item name)")
    }

    if(args.length < 3) {
        return message.channel.send("Not enough arguments, use help command for help")
    }

    let role = message.guild.roles.cache.get(args[2].substring(3,args[2].length -1));
    if(!role) {
        return message.channel.send("Please tag a valid role");
    }

    if(isNaN(args[1])) {
        return message.channel.send("Please enter a valid number for the cost");
    }
    if(isNaN(args[3])) {
        args[3] = -1;
    }


    

    await new SHOP({
        name: args[0],
        cost: args[1],
        role: args[2],
        inventory: args[3]
    }).save();

    return message.channel.send(new MessageEmbed().setDescription('Added Successfuly!').setColor('#00FF00'));
}
}