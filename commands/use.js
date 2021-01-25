const USER = require('../models/user');
const SHOP = require('../models/shops');
const { MessageEmbed } = require('discord.js');
const shop = require('./shop');
module.exports = {
    name: 'use',
    description: 'use an item',
    usage: '!use <item name>',
    async execute(message, args) {
    
        let user = await USER.findOne({
            userId: message.author.id,
        });

        if(!user) return message.channel.send("Not a user");
        

        let items = USER.find({
            inventory: {
                $elemMatch: {
                    name: args[0]
                }
            }
        });

        if(!items) return message.channel.send("Item does not exist in your inventory");

        await USER.findOneAndUpdate(
            {userId: message.author.id},
            {
                $pull: {
                    "inventory": 
                        {name: args[0]}
                    
                }
            }
        )
        
        let shopItem = await SHOP.findOne({
            name: args[0]
        });

        let s = shopItem.role;
        let role = message.guild.roles.cache.get(s.substring(3,s.length -1));
        message.member.roles.add(role);

        
        let emb = new MessageEmbed()
        .setTitle("Sucess")
        .setDescription("You used this item")
        .setFooter("Checkout the store with !shop")

        message.channel.send(emb);
}
}