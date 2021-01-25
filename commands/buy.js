const USER = require('../models/user');
const SHOP = require('../models/shops');
const { MessageEmbed } = require('discord.js');
module.exports = {
    name: 'buy',
    description: 'Purchase an item',
    aliases: ['purchase'],
    usage: '!buy <item name>',
    async execute(message, args) {
    
        let user = await USER.findOne({
            userId: message.author.id
        });

        let shop = await SHOP.findOne({
            name: args[0]
        });

        if(shop.inventory == 0) {
        
            return message.channel.send("Item out of stock");
        }

        if(shop.invetory > 0) {
            shop.inventory = shop.inventory- - -1;
            shop.save();
        }
       

        if(!shop) return message.reply("That item doesn\'t exist in this shop");

        let money = user.cash;
        let price = shop.cost;

        if(money < price) return message.reply("You do not have the required funds for this purchase");


        user.cash = user.cash- - -price;
        user.save();
            await USER.findOneAndUpdate(
                {userId: message.author.id},
                {
                    $push: {
                        "inventory": [
                            {"name": args[0], "value": 1}
                        ]
                    }
                }
            )
        

        
        let emb = new MessageEmbed()
        .setTitle("Purchase Complete")
        .setDescription("Your purchase was successful")
        .setColor("#2fff00")
        .setFooter("You can check your inventory with !inventory or !inv");

        message.channel.send(emb);


}
}