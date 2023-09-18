const https = require("https");
const axios = require("axios");
const qs = require("qs");

const http2Agent = new https.Agent({
  rejectUnauthorized: false,
});

async function login(qburl: string, username: string, password: string) {
  try {
    const response = await axios({
      method: "POST",
      url: `${qburl}/api/v2/auth/login`,
      data: {
        username: username,
        password: password,
      },
      headers: {
        Referer: `${qburl}`,
        "Content-Type": "multipart/form-data",
      },
      httpsAgent: http2Agent,
    });

    const sid = response.headers["set-cookie"]
      .find((cookie) => cookie.startsWith("SID="))
      .split(";")[0]
      .split("=")[1];

    return sid;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

async function logout(qburl, sid) {
  try {
    const response = await axios({
      method: "POST",
      url: `${qburl}/api/v2/auth/logout`,
      headers: {
        Referer: `${qburl}`,
        "Content-Type": "multipart/form-data",
        Cookie: `SID=${sid}`,
      },
      httpsAgent: http2Agent,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function addTorrent(qburl, sid, magnet, path, category) {
  try {
    const response = await axios({
      method: "POST",
      url: `${qburl}/api/v2/torrents/add`,
      data: qs.stringify({
        urls: magnet,
        savepath: path,
        category: category,
      }),
      headers: {
        Cookie: `SID=${sid}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      httpsAgent: http2Agent,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {login, logout, addTorrent}