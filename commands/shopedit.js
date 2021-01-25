const SHOP = require('../models/shops');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'shopedit',
    description: 'Edit item in shop list',
    aliases: ['se','edit'],
    usage: '!shopdedit <itemName> <name, role, cost, or quantity> <value>',
    async execute(message, args) {
        if(!message.member.hasPermission(process.env.SHOP_MANAGE)) return message.reply("You don't have the required permissions for this command");
        let i;

     i = await SHOP.findOne({
        name: args[0]
    })

    if(!i) return message.channel.send(new MessageEmbed().setDescription('Item not found!').setColor('##FFFF00'));

    let m;
    switch(args[1].charAt(0))
    {
        case 'n':
            m = 'name'
            i.name = args[2];
            break;
        case 'r' : 
        m = 'role';
        let role = message.guild.roles.cache.get(args[2].substring(3,args[2].length -1));
        if(!role) {
        return message.channel.send("Please tag a valid role");
    }
            i.role = args[2];
        break;
        case 'c':
            m = 'cost';
            i.cost = parseInt(args[2]);
        break;
        case 'q':
            m = 'quantity';
            i.inventory = parseInt(args[2]);
        break;
        default:
            return message.reply("use help command for correct syntax");
    }
    i.save();
    return message.channel.send(new MessageEmbed().setDescription(`Edited the ${m} Successfuly!`).setColor('##00FF00'));
}
}