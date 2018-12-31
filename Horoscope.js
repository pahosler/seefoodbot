const getHoroscope = require("./getHoroscope.js");
  const readableDate = (date) => {
  let d = new Date(date);
  return d
    .toUTCString()
    .split(' ')
    .filter((d, i) => (i <= 3 ? d : ''))
    .join(' ');
};

async function horoscope(sign) {
  sign = sign.toLowerCase();
  return await getHoroscope(sign)
      .then((message) => {    
        if (message.error !== undefined) {
          return `I only know these Zodiac symbols: ${message.error}`;
        }
        return `\n:${sign === 'scorpio' ? 'scorpius':sign}: ${message.sign.name} ${message.sign.start} thru ${message.sign.end}\nHoroscope for ${readableDate(message.date)}\n${message.description}`
      })
      .catch((error) => {
        console.error(error);
      });
}
module.exports = horoscope;
