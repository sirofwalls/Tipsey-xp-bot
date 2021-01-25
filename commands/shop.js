const SHOP = require('../models/shops')
const { MessageEmbed, UserManager } = require('discord.js');

module.exports = {
    name: 'shop',
    description: 'View shop items',
    cooldown: 3,
    aliases: ['store','market'],
    usage: '!shop [page]',
    async execute(message, args) {

        await SHOP.find({
        }).sort([
            ['name', 'descending']
        ]).exec((err, res) => {
            if(err) console.log(err);
            
            var page = Math.ceil(res.length/10);
            let embed = new MessageEmbed();
            embed.setTitle('Shop')
            .setColor('YELLOW')

            let pg;
            
            if(args.length)
            {
               pg = parseInt(args[0]); 
               if(!pg || pg < 1) pg = 1;
            }else{
                pg = 1;
            }

            let end = pg * 10;
            let start = (pg * 10) - 10;
            if(res.length === 0) {
                embed.addField("Error", "No Items found!");
            }else if(res.length <= start) {
                embed.addField("Error", "Page not found");
            }else if (res.length <= end) {
                embed.setFooter(`page ${pg} of ${page} | [-1] means infinity`);

                for(let i = start; i < res.length; i++) {
                embed.addFields(
                    {name: `[Q] Name`, value: `[${(res[i].inventory).toLocaleString()}] ${(res[i].name).toLocaleString()}`, inline: true},
                    {name: `Cost `, value: `${(res[i].cost).toLocaleString()}`, inline: true},
                    {name: `Role`, value: `${(res[i].role)}`, inline: true}
                );
                }
            }else{
                embed.setFooter(`page ${pg} of ${page} | [-1] means infinity`);

                for(let i = start; i < end; i++) {
                    embed.addFields(
                        {name: `[Q] Name`, value: `[${(res[i].inventory).toLocaleString()}] ${(res[i].name).toLocaleString()}`, inline: true},
                        {name: `Cost `, value: `${(res[i].cost).toLocaleString()}`, inline: true},
                        {name: `Role`, value: `${(res[i].role)}`, inline: true}
                        );}
           
            }

            message.channel.send(embed);

        });
    }
};