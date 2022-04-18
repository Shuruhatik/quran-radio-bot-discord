import inquirer from "inquirer";
import chalkAnimation from "chalk-animation";
import Discord from 'discord.js';
import { createAudioResource,createAudioPlayer, joinVoiceChannel} from '@discordjs/voice'; 
import { createSpinner } from "nanospinner";
import Database from "st.db";
import ms from 'ms';
import express from 'express';
import radio_choices from "./channels.mjs";
const app = express()
import replit from "quick.replit"
const config_db = new replit.Database(process.env["REPLIT_DB_URL"])
const config_delete_db = new Database({path:"./datas/config.yml"})
await getStarted()

async function getStarted(){
  if(await config_delete_db.has("delete_this_value_if_you_want_delete_config") != true || await config_delete_db.get("delete_this_value_if_you_want_delete_config") == true){
    await config_db.delete(`bot_config`)
  }
  if(await config_db.get(`bot_config`)) return await startBot()
  const rainbow = chalkAnimation.pulse('؟ﻡﻮﻴﻟﺍ ﻲﺒﻨﻟﺍ ﻲﻠﻋ ﺖﻴﻠﺻ ﻞﻫ');

  setTimeout(async()=> {
     rainbow.stop()
     console.log(`\u001b[40;1m ﻢﻳﺮﻜﻟﺍ ﻥﺍﺮﻘﻟﺍ ﻮﻳﺩﺍﺭ ﺕﻮﺑ\n\u001b[0m ﺔﻄﺳﺍﻮﺑ \u001b[47;1m\u001b[30;1mShuruhatik#2443\u001b[0m `)
     const ask1 = await inquirer.prompt({
       name:"token_bot",
       type:'password',
       message:`ﻚﺑ ﺹ ﺎﺨﻟﺍ ﺕﻮﺒﻟﺍ ﻦﻛﻮﺗ ﻊﺿﻮﺑ ﻢﻗ :`,
       mask:"*"
     })
     const ask2 = await inquirer.prompt({
       name:"status_bot",
       type:'input',
       message:`ﻩﺪﻳﺮﺗ ﻱﺬﻟﺍ ﺕﻮﺒﻟﺍ ﺔﻟﺎﺣ ﺐﺘﻛﺍ :`,
     })
     const ask3 = await inquirer.prompt({
       name:"status_type",
       type:'list',
       message:`ﺕﻮﺒﻟﺍ ﺔﻟﺎﺣ ﻉﻮﻧ ﺮﺘﺧﺍ :`,
       choices:[
         "Playing","Competing","Listening","Watching"
       ]
     })
    const ask4 = await inquirer.prompt({
       name:"voice_invitelink",
       type:'input',
       message:`ﻪﻠﺧﺍﺩ ﺔﻋﺍﺫﻻﺍ ﺚﺑ ﺪﻳﺮﺗ ﻱﺬﻟﺍ ﻡﻭﺮﻟ ﺓﻮﻋﺩ ﻂﺑﺍﺭ ﻊﺿﻮﺑ ﻡﻮﻗ :`
     })
    const ask5 = await inquirer.prompt({
       name:"radio_url",
       type:'list',
       message:`ﺎﻫﺪﻳﺮﺗ ﻲﺘﻟﺍ ﺔﻴﻋﺍﺫﻹﺍ ﺓﺎﻨﻘﻟﺍ ﻢﻳﺮﻜﻟﺍ ﻥﺁﺮﻘﻟﺍ ﻮﻳﺩﺍﺭ ﺭﺎﺘﺧﺍ :`,
       choices:radio_choices
     })
     await config_db.set(`bot_config`,{
         token_bot:ask1.token_bot.replaceAll("\\","").replaceAll("~",""),
         status_bot:ask2.status_bot.replaceAll("\\","").replaceAll("~",""),
         status_type:ask3.status_type,
         voice_invite_link:ask4.voice_invitelink.replaceAll("\\","").replaceAll("~","")
     })
    await config_delete_db.set(`radio_url`,ask5.radio_url)
     return await startBot()
  },6500)
} 


async function startBot(){
 console.clear()
  const spinner = createSpinner(`Processing..`).start()
  const client = new Discord.Client({
      intents:[Discord.GatewayIntentBits.Guilds,Discord.GatewayIntentBits.GuildIntegrations,Discord.GatewayIntentBits.GuildVoiceStates],
  partials: [Discord.Partials.GuildScheduledEvent,Discord.Partials.Channel, Discord.Partials.GuildPresences] 

  })
  const config = await config_db.get(`bot_config`)
  client.login(config.token_bot).then(()=>{
    spinner.update({ text: 'Running the bot...' })
  }).catch(()=>{
    spinner.error({ text: 'Invalid Bot Token' })
  })

  // Event Ready
  client.once("ready",async()=>{
    client.user.setActivity(config.status_bot, { type:Discord.ActivityType[config.status_type] });
    let bot_invite_link = `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`
    spinner.success({ text: `Logged in as ${client.user.tag} (${client.user.id})`})
     app.get('/',(r, s) => {
       s.send({message:"Bot by Shuruhatik#2443",youtube_channel:"https://www.youtube.com/ShuruhatikYT"})
      }).post('/',async(r, s) => {
       
        s.send({
          message:"Bot by Shuruhatik#2443",  youtube_channel:"https://www.youtube.com/ShuruhatikYT"
        })
        if(await config_db.has(`uptime`) != true){
          console.log("\u001b[32m✔ \u001b[0mﺡﺎيﺠﻨﺑ ﻉﻭﺮﺸﻤﻟ ﻢﻳﺎﺗ ﺏﺍ ﻞﻤﻋ ﻢﺗ")
          await config_db.set(`uptime`,true)
        }
      })
     .get("/invite", (req, res) => res.status(301).redirect(bot_invite_link))
     .listen(3000)
     console.log("\u001b[32m▣\u001b[0m \u001b[0mﺔﻄﺳﺍﻮﺑ ﺕﻮﺒﻟﺍ ﺔﺠﻣﺮﺑ ﻢﺗ \u001b[34;1mShuruhatik#2443\u001b[0m")
     console.log("\u001b[32m▣ \u001b[0m\u001b[0m\u001b[40;1m\u001b[34;1mhttps://"+process.env.REPL_ID+".id.repl.co/invite\u001b[0m")
      client.fetchInvite(config.voice_invite_link).then(async invite => {
        let guild = await client.guilds.cache.get(invite.guild.id)
        if(guild){
          let voiceChannel = await guild.channels.cache.get(invite.channelId)
          let connection = joinVoiceChannel({
              channelId: voiceChannel.id,
              guildId: voiceChannel.guild.id,
              adapterCreator: voiceChannel.guild.voiceAdapterCreator,
              group:client.user.id
         })
         startPlayRadio(connection)
         setInterval(() => startPlayRadio(connection),60000)
        }
      })
   })
   function startPlayRadio(connection) {
     try{
      let radio_url = config_delete_db.get(`radio_url`)
      let player = createAudioPlayer()
      let resource = createAudioResource(radio_url)
       connection.subscribe(player)
       player.play(resource)
      } catch(e){
         // في حال ظهور اي خطا احذف الشرطين من سطر اسفل هذه التعليق لمعرفة اين الخطا
        //console.error(e)
      }
  }
}
