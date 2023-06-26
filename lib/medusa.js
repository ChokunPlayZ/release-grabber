const axios = require("axios");

async function GuessitLookup(medusaurl, medusaapikey, filename) {
  const conf = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${medusaurl}/api/v2/guessit?release=${filename}`,
    headers: {
      "x-api-key": medusaapikey,
    },
  };

  const res = await axios.request(conf);

  return res;
}

module.exports = { GuessitLookup };
