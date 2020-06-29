const TelegramBot = require('node-telegram-bot-api');

const svg2img = require('svg2img');

const TOKEN = '803200302:AAFqk_St_825ksbdde4vYfEVpFrOwE8dySM'

console.log('YOSHLAR BOT HAS BEEN STARTED');

const fs = require('fs');

const bot = new TelegramBot(TOKEN, {
  polling: true
});

const svgFrames = require('./svg');

bot.on('text', msg => {
  const text = msg.text;
  const svg = getYoshlarKuniSvg(text);
  if (msg.text === '/start') {
    bot.sendMessage(msg.chat.id, 'Ism kiriting!!!');
    return;
  }
  fs.exists(`${__dirname}/img/${text}.png`, res => {
    if (!res) {
      svg2img(svg, function(error, buffer) {
        if(error) {
          console.log(error);
        }
        fs.writeFile(`${__dirname}/img/${text}.png`, buffer, err => {
          if(err) {
            console.log(err);
          }
          bot.sendPhoto(-1001342118300,fs.createReadStream(`${__dirname}/img/${text}.png`))
            .then(media => {
              bot.sendPhoto(msg.chat.id, media.photo[media.photo.length - 1].file_id, {
                caption: '#' + text.toUpperCase() + '\nSo\'z sig\'masa bitta joy tashlab yozing!!!',
                parse_mode: "Markdown"
              });
            });
        });
      });
    } else {
      bot.sendPhoto(msg.chat.id,fs.createReadStream(`${__dirname}/img/${text}.png`), {
        caption: '#' + text.toUpperCase() + '\nSo\'z sig\'masa bitta joy tashlab yozing!!!',
        parse_mode: "Markdown"
      });
    }

  })
});

bot.on('polling_error', err => console.log(err));




function getYoshlarKuniSvg(data) {
  return `${svgFrames.yoshlarKuniFrame}${getYoshlarKuniText(data)}</svg>`
}


function getYoshlarKuniText(data) {
  const fonstSizeRatio = data.length - 6 <= 0 ? 1 : data.length - 6;
  let text = '';
  if(data.includes(' ')) {
    text = `
    <text x="50%"  transform="scale(1)" font-family="Bronx Bystreets" alignment-baseline="middle" text-anchor="middle" class="cls-1" font-size="${165 - fonstSizeRatio * 5}px" fill="#fff">
      <tspan y="27%" x="52%">${data.split(' ')[0]}</tspan>
      <tspan y="389" x="52%">${data.split(' ')[1]}</tspan>
    </text>
    `
  } else {
    text = `<text x="52%" y="33%" transform="scale(1)" font-family="Bronx Bystreets" alignment-baseline="middle" text-anchor="middle" class="cls-1" font-size="${165 - fonstSizeRatio * 10}px" fill="#fff">${data}</text>`;
  }
  return text;
}