const USER = require('../models/user');
const Discord = require('discord.js');
const Canvas = require("canvas");

module.exports = {
    name: 'balance',
    description: 'Get your balance or another user\'s',
    aliases: ['b', 'bank', 'bal', 'money', 'cash'],
    usage: '!balance [user]',
    async execute(message, args) {
        let id;
        let user;

        if(args.length) {
            id = message.mentions.members.first().id;
        }else{
            id = message.author.id;
        }

        user = await USER.findOne({
            userId: id,
        })

        if(user) {
        // Balance Card
        
        let emb = new Discord.MessageEmbed()
        .setTitle("Account Balance")
        .setDescription(user.cash)
        .setColor("#ffff00")
        message.channel.send(emb);


        }else{
            return message.channel.send('That user hasn\'t participated yet');
        }
    }
}