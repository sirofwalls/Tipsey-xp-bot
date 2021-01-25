const USER = require('../models/user');
const { MessageEmbed } = require('discord.js');
const successRate = 50;

module.exports = {
    name: 'ranks',
    description: 'See the ranks leaderboard',
    aliases: ['lb','levels'],
    usage: '!ranks [page number]',
    async execute(message, args) {
        
        USER.find({
        }).sort([
            ['level', 'descending']
        ]).exec((err, res) => {
            if(err) console.log(err);
            
            var page = Math.ceil(res.length/10);
            let embed = new MessageEmbed();
            embed.setTitle('Rank Leaderboard')
            .setColor('GOLD')
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
                embed.addField("Error", "No pages found!");
            }else if(res.length <= start) {
                embed.addField("Error", "Page not found");
            }else if (res.length <= end) {
                embed.setFooter(`page ${pg} of ${page} | You can access more pages using !ranks [page number]`);

                for(let i = start; i < res.length; i++) {
                embed.addFields(
                    {name: `${i+1}. ${res[i].userTag}`, value: `Level: ${(res[i].level).toLocaleString()}`}
                );
                }
            }else{
                embed.setFooter(`page ${pg} of ${page} | You can access more pages using !ranks [page number]`);

                for(let i = start; i < end; i++) {
                    embed.addFields(
                        {name: `${i+1}. ${res[i].userTag}`, value: `Level: ${(res[i].level).toLocaleString()}`}
                    );}
           
            }

            message.channel.send(embed);

        });
    }
}