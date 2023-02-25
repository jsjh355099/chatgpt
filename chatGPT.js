import { ChatGPTAPI } from 'chatgpt'

import linebot from 'linebot'

const apiKey = "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"
const channelId = "1660661041"
const channelSecret = "5bb5a72b0a17241c82b3d2242b793738"
const channelAccessToken = "/RCDBbeHKnE+ZLPcWvJrAu1TsqEopFj0zyfVSjx5F8TwP42YGgGxP6hPsMYLMfEkflCVE6vqqL5LaVy0fG+poq7pVr5npVBk7aZdhLf7MNC3ZEIAhdEpc2EvVYHtvLUniYs2WLPTPQcYD+D8meRTzwdB04t89/1O/w1cDnyilFU="


const ChatGPT = new ChatGPTAPI({
  apiKey: apiKey,
  completionParams: {
    temperature: 0.5,
    top_p: 0.8
  }
})

const bot = linebot({
  channelId: channelId,
  channelSecret: channelSecret,
  channelAccessToken:channelAccessToken
})

bot.listen('/', "9653", () => {
  // 在port啟動
  console.log('http://localhost:9653')
  console.log('機器人已啟動')

})

let lastRes = {
  
}

bot.on('message', async (event) => {
  try {
    let firstChar = event.message.text.charAt(0);
    let wakeUpkeyList = ["#"]
    let findkey = wakeUpkeyList.includes(firstChar)
    if(findkey){
      let content = event.message.text.substring(1);
      let user = event.source.userId
      let group = event.source.groupId
      let key = group || user
      if(lastRes[key] == undefined){
        lastRes[key] = {}
      }
      if(content == "重置"){
        lastRes[key] = {}
        event.reply("已經重置")
        return
      }

      console.log({content,event});
      const res = await ChatGPT.sendMessage(content,{
        conversationId: lastRes[key].conversationId || "",
        parentMessageId: lastRes[key].id || ""
      })
      lastRes[key] = res
      event.reply(res.text)
    }
  } catch (error) {
    console.log(error);
    event.reply(error)
  }  
})
