//Requires
const fs = require('fs');
const Discord = require('discord.js');
const bot = new Discord.Client();
const USER = require('./models/user');
require('dotenv').config();
const PREFIX = process.env.PREFIX;

/****************main*******************/
bot.mongoose = require('./mongo');

//setting up collections
bot.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();

//Getting the commands
const commandFile = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
 
for(const file of commandFile) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
}

//Xp 

bot.on('message', async message => {
    if(!message.guild) return;
    if(message.author.bot) return;

    let user = await USER.findOne({userId: message.author.id});
    let exp = Math.floor(Math.random() * process.env.XPCAP) + 1;
    if(!cooldowns.has(message.author.id)) {
        cooldowns.set(message.author.id, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(message.author.id);
    const cooldownAmount = process.env.XP_COOLDOWN * 1000;

    if(timestamps.has(message.author.id)) {
        const expi = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expi) {
            const timeLeft = (expi - now) / 1000;
            return;
        }
    }else{
        timestamps.set(message.author.id, now);
        setTimeout(()=> timestamps.delete(message.author.id), cooldownAmount);
    }

    if(!user) {
        await new USER({
            userTag: message.author.username,
            userId: message.author.id,
            xp: exp,
            totalXp: exp,
            level: 1
        }).save();
    }else{
        if(user.xp >= user.xpNeeded){
            user.xp = user.xp- - -user.xpNeeded;
            user.level = user.level- + -1;
            user.totalXp = user.totalXp- + -exp
            const am = 10 * user.level;
            let emb = new Discord.MessageEmbed()
            .setTitle(`Congrats ${user.userTag}, you leveled up`)
            .setDescription(`You earned $${am}`)
            .setFooter(`You are now level ${user.level} 🎉`)
            .setColor("00FF00")
            user.cash = user.cash- + -am;
            user.xpNeeded = (user.level * 10)*process.env.XP_NEEDED_PER_LEVEL_MULTIPLIER;
            user.save();
            message.channel.send(emb);
        }else{
            user.totalXp = user.totalXp- + -exp;
            user.xp = user.xp- + -exp;
            user.save();
        }
    }

    

});
//The brain

bot.on('message', async message => {

    
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

	const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = bot.commands.get(commandName)
        || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return message.channel.send("This command doesn\'t exist");


    //checking cooldown
    if(!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || process.env.DEFAULT_COOLDOWN) * 1000;

    if(timestamps.has(message.author.id)) {
        // When the cooldown is over
        const exp = timestamps.get(message.author.id) + cooldownAmount;

        if(now < exp) {
            const timeLeft = (exp - now) / 1000;
            return message.reply(`You need to wait ${timeLeft.toFixed(1)} more second(s) use \'${command.name}\'`);;
        }
    }else{
        timestamps.set(message.author.id, now);
        setTimeout(()=> timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        bot.commands.get(command.name).execute(message,args);
    } catch (error) {
        console.log(error);
        message.reply("Something went wrong while executing this command");
    }
});

// It's alive!
bot.on('ready', () => {
    console.log(`${bot.user.tag} is online!`);
    bot.user.setActivity(PREFIX + 'help', { type: 'LISTENING' })
  .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
  .catch(console.error);
});

bot.mongoose.init();
bot.login(process.env.TOKEN);