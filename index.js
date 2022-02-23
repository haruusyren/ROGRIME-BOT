/*
    * Copyright © 2022 Auto-Entreprise — Syrenery

    The bot is in FRENCH. If you don't understand, please goto https://translate.google.co.uk/?sl=fr&tl=en&op=translate :)
*/

const Discord = require('discord.js'); // Call discord.js package
const config = require('./config.json') // Call config.json file
const Client = new Discord.Client({
    intents: [ // Call intents
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_MEMBERS,
    ]
});

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

const prefix = "."; // Create the prefix

Client.on("messageCreate", message => { // Create the messageCreate event
    if (message.author.bot) return; // Return the auction if the author is a bot

    else if (message.content.startsWith(prefix + "help")){ // Detect the command `.help`
            let embed = new Discord.MessageEmbed() // Create an embed
                .setTitle(`Aide de **ROGRIME BOT**`) // Set the title
                .setDescription(`Requête de ${message.author.tag}`) // Set the description
                .setColor("33691E") // Set the color
                .addField(`\`${prefix}help\``, `Envoie l'aide du bot`) // Add the first field
                .addField(`\`${prefix}invite\``, `Envoie l'invitation du serveur`) // Add the second field
                .setTimestamp()
                .setFooter({text: "Créé par 𝕯𝖊𝖛'𝕽𝖚#0992"})
            
            message.channel.send({embeds: [embed]}); // Send the help message (embed) on the current channel
            message.delete(); // Delete the message who call the command
    }

    else if (message.content.startsWith(`${prefix}invite`)){ // Detect the command `.invite`
            if (message.channel.nsfw){
                message.reply("Hé ! Ce salon est marqué comme NSFW, impossible de créer une invitation _:(_");
                return message.react("👎");
            }
            else {
                message.guild.invites.create(message.channel.id)
                .then(invites => {
                        console.log(invites.URL);
                        message.react(`👍`);
                })
                .catch(console.error);
            }
    }

    else if (message.content.startsWith(prefix + "ping")) { // Detect the command `.ping`
        message.react("🇳");
        message.react("🇹");
        message.react("🇲");
    }

    else if (message.content.startsWith(prefix + "ban")){ // Detect the command `.ban`
        if (message.member.permissions.has("BAN_MEMBERS")){
            let mention = message.mentions.members.first();

            if (mention === undefined){
                message.reply("Vous n'avez mentionné aucune personne.");
                message.delete();
            }

            else{
                if (mention.bannable){
                    mention.ban();
                    message.reply(`Le membre : **${mention.displayName}** a bien été banni 👍`);
                }
                else (message.reply("Impossible de bannir le membre."))
                message.delete();
            }
        }
    }

    else if (message.content.startsWith(`${prefix}kick`)){ // Detect the command `.kick`
        if (message.member.permissions.has("KICK_MEMBERS")){
            let mention = message.mentions.members.first();

            if (mention === undefined){
                message.reply("Vous n'avez mentionné aucune personne.");
                message.delete();
            }

            else{
                if (mention.kickable){
                    mention.kick();
                    message.reply("Le membre : **" + mention.displayName + "** a bien été kick 👍");
                }
                else (message.reply("Impossible de kick le membre."));
                message.delete();
            }
        }
    }

    else if (message.content.startsWith(`${prefix}mute`)){ // Detect the command `.mute`
        if (message.member.permissions.has("MANAGE_ROLES")){
            let mention = message.mentions.members.first();
            let args = message.content.split(" ")

            if (mention === undefined){
                message.reply("Vous n'avez mentionné aucune personne.");
                message.delete();
            }

            else if (args[1] !== undefined && args[2] !== undefined){
                mention.roles.add("933455070962520095");
                    setTimeout(function(){
                        mention.roles.remove("933455070962520095")
                        message.channel.send(`Le membre : **${mention.displayName}** a été unmute 👍`)
                        message.delete();
                    }, args[2] * 1000)
                    message.delete();
            }

            else{
                mention.roles.add("933455070962520095")
                    .then(message.reply(`Le membre : **${mention.displayName}** a bien été mute 👍`))
                    .catch(err => {
                            message.reply(`Une erreur est survenue : \`${err}\`.`)
                            console.error;
                        });
                message.delete();
            }
        }
    }

    else if (message.content.startsWith(`${prefix}unmute`)){ // Detect the command `.unmute`
        if (message.member.permissions.has("MANAGE_ROLES")){
            let mention = message.mentions.members.first();

            if (mention === undefined){
                message.reply("Vous n'avez mentionné aucune personne.");
                message.delete();
            }

            else{
                if (mention.roles.has("933455070962520095")){
                mention.roles.remove("933455070962520095")
                    .then(message.reply(`Le membre : **${mention.displayName}** a bien été unmute 👍`))
                    .catch(err => {
                            message.reply(`Une erreur est survenue : \`${err}\`.`)
                        });
                message.delete();
                }
            }
        }
    }

    else if (message.content.startsWith(`${prefix}say`)){ // Detect the command `.say`
        let args = message.content.split(`${prefix}say `);

        if(args[1] === undefined){
            message.channel.send(`Impossible d'envoyer le message.`)
        }
        else if (message.member.permissions.has("MANAGE_MESSAGES")){
            message.channel.send(args[1])
        }
        else {
            message.channel.send(`Impossible d'envoyer le message. Vous n'avez certainement pas la permission : \`MANAGE_MESSAGES\`...`)
        }
        message.delete();
    }

    else if (message.content.startsWith(`${prefix}8ball`)){ // Detect the command `.8ball`
        let args = message.content.split(`${prefix}8ball `);

        if (args[1] === undefined){
            message.channel.send(`Impossible de répondre sans question !`)
        }

        else {
            let answer = getRandomInt(2)
            if (answer === 0){
                answer = "oui";
            }
            if (answer === 1){
                answer = "non";
            }
            let embed = new Discord.MessageEmbed()
                .setTitle("8ball")
                .setURL("https://twitch.tv/syren_off/")
                .setDescription(`\`${prefix}8ball\` pour avoir la réponse à tout !`)
                .setColor("33691E")
                .addField(`Ta question ${message.author.tag} :`, args[1])
                .addField(`Ma réponse est : **${answer}** !`, "_ _")
                .setTimestamp();
            message.channel.send({embeds: [embed]})
        }
        message.delete();
    }
});

Client.on('ready', () => {
    console.log('Ready !');

    Client.user.setPresence(
        {
            activities: [
                {
                    name: ` : Créé par 𝕯𝖊𝖛'𝕽𝖚#0992`,
                    type: 'STREAMING',
                    url: 'https://twitch.tv/syren_off/'
                }
            ],
            status: 'dnd'
        }
    );
});

Client.login(config.TOKEN); // Login the bot using token

Client.on('error', () => {
    Client.destroy();
});