const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on('message', message => {
  let tag = "⩙"; //tagınızı yazın
  let rol = "713845966402224230"; //tag alındığı zaman verilecek rolün ID-si
  let channel = message.guild.channels.find('name', 'tag-log'); //tagrol-log yerine kendi kanalınızın ismini yaza bilirsiniz
  if (!rol) return;
  if (!tag) return;
  if (message.member.user.username.includes(tag)) {
    if (message.member.roles.has(rol)) return;
    message.member.addRole(rol).then(() => {
      const tagalma = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} ${tag} tagını aldığından dolayı <@&${rol}> rolü Verildi`)
        .setTimestamp()
      channel.send(tagalma)
    });
  }
  if (!message.member.user.username.includes(tag)) {
    if (!message.member.roles.has(rol)) return;
    message.member.removeRole(rol).then(() => {
      const tagsilme = new Discord.RichEmbed()
        .setColor("RANDOM")
        .setDescription(`${message.author} ${tag} tagını sildiğinden dolayı <@&${rol}> rolü Alındı`)
        .setTimestamp()
      channel.send(tagsilme)
    });
  }
});
client.on("guildMemberAdd", member => {
  if (member.guild.id == "651030381776207892") {
    console.log(
      `${member.user.username} Adlı Kullanıcı Destek Sunucumuza Katıldı`
    );
    client.channels
      .get("")
      .send(
        `<@${member.id}> Adlı Kişi Sunucumuza Katıldı Hoşgeldin :)`
      );
    return;
  }
});

client.on("guildMemberAdd", async member => {
  let autorole = JSON.parse(fs.readFileSync("./otorol.json", "utf8"));
  let role = autorole[member.guild.id].sayi;

  member.addRole(role);
});
      client.on('message', msg => {
  if (msg.content.toLowerCase() === 'botum benim') {
    msg.reply('Kutluhan Babam benim ').then(s=> s.delete (100000));
  }
});
      client.on('message', msg => {
  if (msg.content.toLowerCase() === 'bot annen kim') {
    msg.reply('Furkan anneciğim benim <3 <3 ').then(s=> s.delete (100000));
  }
});

     client.on('message', msg => {
  if (msg.content.toLowerCase() === 'bot baban kim') {
    msg.reply('Benim Babam Kutluhan 16 <3 <3').then(s=> s.delete (100000));
  }
});
    client.on('message', msg => {
  if (msg.content.toLowerCase() === 'Furkanın babası Kim') {
    msg.reply('Furkanıııın Babası Geceğğğ <3 <3').then(s=> s.delete (100000));
  }
});

// KÜFÜR ENGEL //

client.on("message", async msg => {
    if(msg.author.bot) return;
    if(msg.channel.type === "dm") return;
        
    let i = await db.fetch(`küfürFiltre_${msg.guild.id}`)  
          if (i == 'acik') {
              const küfür = [ "amcık", "yarrak", "orospu","piç", "sikerim", "sikik", "amına", "pezevenk", "yavşak", "ananı", "anandır", "orospu", "evladı", "göt", "pipi", "sokuk", "yarak", "bacını", "karını","amk","aq","mk","anaskm",];
              if (küfür.some(word => msg.content.toLowerCase().includes(word))) {
                try {
                  if (!msg.member.hasPermission("MANAGE_WEBHOOKS")) {
                    msg.delete();                    
                    let embed = new Discord.RichEmbed()
                    .setColor(0xffa300)
                    .setFooter('Penthos Küfür Sistemi', client.user.avatarURL)
                    .setAuthor(msg.guild.owner.user.username, msg.guild.owner.user.avatarURL)
                    .setDescription("Mathias, " + `***${msg.guild.name}***` + " adlı sunucunuzda küfür yakaladım.")
                    .addField('Küfür Eden Kişi', 'Kullanıcı: '+ msg.author.tag +'\nID: '+ msg.author.id, true)
                    .addField('Engellenen mesaj', msg.content, true)
                    .setTimestamp()                   
                    msg.guild.owner.user.send(embed)                       
                    return msg.channel.send(`${msg.author}, Küfür Etmek Yasak! Senin Mesajını Özelden Kurucumuza Gönderdim.`).then(msg => msg.delete(25000));
                  }              
                } catch(err) {
                  console.log(err);
                }
              }
          }
          if (!i) return;
          });   

// KÜFÜR ENGEL //
client.on('ready', ()=>{
client.channels.get('713846109570859018').join()
})