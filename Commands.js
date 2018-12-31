const horoscope = require("./Horoscope");
const Insult = require("./ShakeAspear.js")
function Commands() {
  let command = {
    pong: function(message) {
      message.reply("Ping!");
      return;
    },
    ping: function(message) {
      message.reply("Pong!");
      return;
    },
    horoscope: async function(message, args) {
      let response = await horoscope(args.length >= 1 ? args[0] : ' ');
      await message.reply(response);
      return;
    },
    insult: (message, args) => {
      let insulter = message.author.id
      message.delete().catch(O_o=>{});
      if(args[0] === undefined) {
        message.channel.send('Who would you like to insult?')
        .then(()=>{
          message.channel.awaitMessages(response => response.author.id == insulter && response.content !==" ", {
            max: 1,
            time: 30000,
            errors: ['time'],
          })
          .then((collected)=>{
            message.channel.send(`Are you sure you want to insult ${collected.first().content}?`);
            message.channel.awaitMessages(response => response.author.id == insulter && response.content.toLowerCase() === "yes", {
              max: 1,
              time: 30000,
              message: 'no',
              errors: ['message','time']
            })
          .then((saidYes) => {
              message.channel.send(Insult(message,collected.first().content))
            })
          .catch(()=>{
              message.channel.send('Apparently not... chicken!')
           })
          })
          .catch(()=> {
            message.channel.send('Aborted!') 
          })
        })
      }else {
        return message.channel.send(Insult(message,args[0]))
      }
    }
    // insult ends
  };
  // commands end
  return command;
}

module.exports = Commands;
