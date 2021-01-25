const USER = require('../models/user');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'inventory',
    description: 'View inventory',
    aliases: ['inv'],
    usage: '!inventory',
    async execute(message, args) {
    
        let user = await USER.findOne({
            userId: message.author.id,
        });

        if(!user) return message.channel.send("Not a user");
        
        

        let items = user.inventory;
        let post = "";
        
        for(let i = 0; i < items.length; i++) {
            post += items[i].name + "\n";
        }

        let emb = new MessageEmbed()
        .setTitle("Inventory")
        .setDescription(post)
        .setFooter("Check out the store with !shop")
        message.channel.send(emb);
}
}