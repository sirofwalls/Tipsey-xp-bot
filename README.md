# Tipsey XP Bot

The bot that is meant for community engagement.

It adds "XP" and a "coin" the more you chat, and provides a "store" that the owner can add items/perks/roles and the users can purchase using the coin that is gained from leveling up and talking.

## Needed packages 
<pre>
build-essential
libcairo2-dev
libpango1.0-dev
libjpeg-dev
libgif-dev
librsvg2-dev
</pre>

---

## Permissions needed
MANAGE_ROLES

PRESENCE INTENT</br>
SERVER MEMBERS INTENT

---

### Create a free MongoDB with Atlas
https://cloud.mongodb.com/

Create a new Project and click on the "Connect" option, then select the "Connect your application" and copy the string it provides into the .env file(replacing the needed/missing information of course)

---

### Create a Discord Application/Bot
Log into your Discord developer portal:
https://discord.com/developers/applications

Create a bot and make sure to give it the needed roles for the invite string (mentioned above) and then generate a token in the bot menu, then use that in the .env file.