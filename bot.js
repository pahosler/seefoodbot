require("dotenv").config();
const Discord = require("discord.js");
const bot = new Discord.Client();
const SeeFood = require("./seefood");
const Commands = require("./Commands");
const fs = require("fs");
const https = require("https");

const getAttached = msg => msg.attachments.array();
const isAttached = Attached => Attached[0] !== undefined;
const TestURL = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?\.([jpg|png|svg|jpeg|gif])?)/i;

const getDogMsg = imgURI => SeeFood(imgURI);

let commands = new Commands();

const seefoodbot = () => {
  bot.on("ready", () => {
    console.log(`Logged in as ${bot.user.tag}!`);
    bot.user
      .setActivity(`Serving ${bot.guilds.size} servers`)
      .then(async () => {
        await setTimeout(() => {}, 1000);
        try {
          bot.channels
            .find("name", "general")
            .send(
              `${bot.user.tag.split("#")[0]} now online and serving ${
                bot.guilds.size
              } servers`
            );
        } catch (e) {
          console.log("could not send to channel", e);
        }
      });
  });

  bot.on("guildCreate", guild => {
    // This event triggers when the bot joins a guild.
    console.log(
      `New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${
        guild.memberCount
      } members!`
    );
    bot.user.setActivity(`Serving ${bot.guilds.size} servers`);
  });

  bot.on("message", async msg => {
    if (msg.author.bot) return; //message from a bot? do not reply

    // did we get an image URL? yes, send response
    let attachment = await getAttached(msg);
    if (TestURL.test(msg.content)) {
      let imgURI = msg.content;
      try {
        let response = await SeeFood(imgURI);
        await msg.reply(response);
      } catch (e) {
        console.log(e);
      }
    }

    // check for an uploaded image and send a response
    if (isAttached(attachment)) {
      try {
        let response = await SeeFood(attachment[0].proxyURL);
        await msg.reply(response);
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
    }

    let args = msg.content.trim().split(/ +/g);
    if (args.length > 1) {
      // who's mentioned? get the ID numbers
      let mentioned;
      try {
        mentioned = args.shift().match(/(\d+)/)[0];
      } catch(e){
        // console.log("bot not mentioned")
      }
      // get the botID numbers only
      let botID = bot.user.id.match(/(\d+)/)[0];
      let command = args.shift().toLowerCase();
      // return if bot wasn't mentioned
      if (mentioned !== botID) return;

      // bot was sent a command, call it or just return if it doesn't exist
      try {
        // console.log('author', msg.author.id)
        await commands[command](msg, args);
      } catch (e) {
        return;
      }
    }
  });

  bot.login(process.env.SECRET);
};
// export module
module.exports = seefoodbot;
