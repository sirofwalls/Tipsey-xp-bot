const SHOP = require('../models/shops');
const { MessageEmbed } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'shopdel',
    description: 'remove item to shop list',
    aliases: ['shopdelete','sd','shopremove','shoprm'],
    usage: '!shopdelete <item name>',
    async execute(message, args) {
        if(!message.member.hasPermission(process.env.SHOP_MANAGE)) return message.reply("You don't have the required permissions for this command");

    var i = await SHOP.findOne({
        name: args[0]
    })

    if(!i) return message.channel.send(new MessageEmbed().setDescription('Item not found!').setColor('##FFFF00'));

    await SHOP.deleteOne({
        name: args[0]
    })
    return message.channel.send(new MessageEmbed().setDescription('Removed Successfuly!').setColor('##00FF00'));
}
}