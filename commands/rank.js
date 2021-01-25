const USER = require('../models/user');
const Canvas = require("canvas");
const Discord = require('discord.js');
const align = 270;
module.exports = {
    name: 'rank',
    description: 'Get your rank or another user\'s',
    aliases: ['level'],
    usage: '!rank [user]',
    async execute(message, args) {
        let id;
        let user;
        let person;
        if(args.length) {
            person = message.mentions.users.first();
        }else{
            person = message.author;
        }

        id = person.id;
        user = await USER.findOne({
            userId: id,
        })

        if(!user) return message.reply("that user hasn't participated");
        //rank card
        const canvas = Canvas.createCanvas(1000,300);
        const ctx = canvas.getContext("2d");

        //background for the rank card
        const background = await Canvas.loadImage("./img/background.png");
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

        //xp bar background
        ctx.beginPath();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000"
        ctx.fillRect(align,216, 700, 65);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeRect(align, 216, 700, 65);
        ctx.stroke();

        // The Progress

        ctx.fillStyle = "#ff0000";
        ctx.globalAlpha = 1;
        let per = 0;
        if(user.xp > user.xpNeeded) {
            per = 1;
        }else{
            per = user.xp/user.xpNeeded
        }
        ctx.fillRect(align, 216, (per)*700,65 );
        ctx.fill();

        // Text

        ctx.font = "35px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${user.xp} / ${user.xpNeeded} Xp`, 580, 260)

        ctx.fillStyle = "#FFFFFF";
        ctx.font = "40px impact";
        ctx.textAlign = "left";
        ctx.fillText(user.userTag, align, 55);

        ctx.font = "40px impact";
        ctx.fillText("Level:", align,120)
        ctx.fillText(user.level, align + 120, 120);

        ctx.font = "40px impact";
        ctx.fillText("Balance: $", align,120 + (120 - 55));
        ctx.fillText(user.cash, align + 210, 120 + (120 - 55));

        // Avatar holder
        ctx.lineWidth = 4;
        ctx.fillStyle = "#000000"
        ctx.globalAlpha = .5;
        ctx.fillRect(0,0, 250, 300);
        ctx.fill();
        ctx.globalAlpha = 1;
        
        // Total Xp

        ctx.font = "35px impact";
        ctx.textAlign = "left";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`Total XP`, 50, 250);
        ctx.font = "30px impact";
        ctx.textAlign = "center";
        ctx.fillText(user.totalXp, 110, 290);

        // The avatar, last so it's on top
        ctx.arc(120, 120, 90, 0, Math.PI * 2, true);
        ctx.lineWidth = 6;
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        const pfp =  await Canvas.loadImage(person.displayAvatarURL({format: "jpg"}));
        ctx.drawImage(pfp, 20,20,200,200);

        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), "rank.png");
        message.channel.send(attachment);

}
}