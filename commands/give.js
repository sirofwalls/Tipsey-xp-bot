const USER = require('../models/user');
const { MessageEmbed, UserManager } = require('discord.js');
require('dotenv').config();
module.exports = {
    name: 'add',
    aliases: ['give'],
    description: 'add money!',
    usage: '!add <user> <amount>',
    cooldown: 1,
    async execute(message, args) {

        if(!message.member.hasPermission(process.env.ADD_MONEY)) return message.reply("You do not have permissions to use this command");
        
        let idd = message.mentions.members.first()
        if(!idd) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`Please tag who you wanna give money to`));
        id = idd.id;
        let user;

        if(!parseInt(args[1])) return message.channel.send(new MessageEmbed().setColor("RED").setDescription(`The correct syntax is add <user> <amount>`));
        
        user = await USER.findOne({
            userId: id,
        })

        if(!user) return message.channel.send("Not valid user");
         
        user.cash = user.cash- + -parseInt(args[1]);
        user.save();
        const emb = new MessageEmbed()
        .setColor('#722EE8')
        .setTitle(`Added Successfully!`)
        .setDescription(`We successfully added $${args[1]} to ${user.userTag}\'s account 👍`)
        message.channel.send(emb);

}
}