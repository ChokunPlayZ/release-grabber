import irc from "matrix-org-irc";
import fs from "fs";
import {EmbedBuilder, WebhookClient} from "discord.js";

// load custom libs
const qbit = require("./lib/qBittorrent");
const utils = require("./lib/utils");
const medusa = require("./lib/medusa");

// Check if docker is connected
const isInDocker = fs.existsSync("/.dockerenv");

const footer = "Release Grabber"
const config = process.env;

let webhook;
let mode;

if (!isInDocker) {
  mode = "Local";
} else {
  mode = "Docker";
}

let resolutions;

resolutions = config.ALLOWED_RESOLUTION.replace(" ", "").split(",");

console.log(`---------------------------`);
console.log(`Release Grabber, V3.1, Bun Edition`);
console.log(`https://github.com/ChokunPlayZ/release-grabber`);
console.log(`---------------------------`);
console.log(`Mode: ${mode}`);
console.log(`In Container: ${isInDocker}`);
console.log(
  `System Timzone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`
);
console.log(`-----------Configs---------`);
console.log(`IRC Server: ${config.IRC_ADDRESS}`);
console.log(`IRC Username: ${config.IRC_USERNAME}`);
console.log(``);
console.log(`Medusa URL: ${config.MEDUSA_URL}`);
console.log(`qBittorrent URL: ${config.QBIT_BURL}`);
console.log(``);
console.log(`Discord Webhook: ${Boolean(config.WEBHOOK_URL)}`);
console.log(``);
console.log(`Allowed Resolutions: ${resolutions}`);
console.log(`---------------------------`);
console.log(`Connecting to ${config.IRC_ADDRESS} as ${config.IRC_USERNAME}`);

var client = new irc.Client(config.IRC_ADDRESS, config.IRC_USERNAME, {
  channels: ["#subsplease"],
  autoConnect: false,
  autoRejoin: true,
  floodProtection: true,
  floodProtectionDelay: 1000,
});

if (Boolean(config.WEBHOOK_URL)) {
  webhook = new WebhookClient({ url: config.WEBHOOK_URL });
}

client.addListener("message#subsplease", async (nick, message) => {
  const msg = String(message);

  console.log(`${nick} -> #subsplease : ${msg}`);

  const relinfo = utils.extractReleaseInformation(msg);

  if (!relinfo) return;

  if (!resolutions.includes(relinfo.resolution)) return;

  console.log(`New Release: ${relinfo.fileName}`);

  if (Boolean(config.WEBHOOK_URL)) {
    await webhook.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("New Release")
          .addFields([
            { name: "File Name", value: `${relinfo.fileName}`, inline: false },
          ])
          .setColor("#00A5FF")
          .setTimestamp()
          .setFooter({ text: footer }),
      ],
    });
  }

  const lookup = await medusa.GuessitLookup(
    config.MEDUSA_URL,
    config.MEDUSA_API_KEY,
    relinfo.fileName
  );

  if (lookup.data.show == null) {
    console.log(
      `"${relinfo.fileName}" does not exist in Medusa db, not doing anything`
    );
    return;
  }

  if (lookup.data.show.config.paused == true) {
    console.log(`"${relinfo.fileName}" is paused, not downloading`);
    return;
  }

  console.log(
    `"${relinfo.fileName}" marked to be downloaded, sending download command`
  );
  console.log("Logging into qBittorrent");

  let token = await qbit.login(
    config.QBIT_BURL,
    config.QBIT_USERNAME,
    config.QBIT_PASSWORD
  );

  if (typeof token === "undefined" || !token) {
    console.log("Login failed, most likely due to invalid credentials");
    if (Boolean(config.WEBHOOK_URL)) {
      await webhook.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("ERROR!")
            .setDescription(`qBittorrent Login Failed`)
            .setColor("#F90000")
            .setTimestamp()
            .setFooter({ text: footer }),
        ],
      });
    }
    return;
  }

  console.log("Logged into qBittorrent!, Sending Download Command");
  await qbit.addTorrent(
    config.QBIT_BURL,
    token,
    relinfo.torrentUrl,
    config.QBIT_DOWNLOADPATH,
    "Auto Grabbed"
  );

  console.log("Download Command Sent, Logging out...");

  if (Boolean(config.WEBHOOK_URL)) {
    await webhook.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("Download Command Sent!")
          .setDescription(`Sent File to qBit`)
          .addFields([
            { name: "FileName", value: relinfo.fileName, inline: false },
            { name: "FileSize", value: relinfo.fileSize, inline: false },
          ])
          .setColor("#90EE90")
          .setTimestamp()
          .setFooter({ text: footer }),
      ],
    });
  }

  await qbit.logout(config.QBIT_BURL, token);

  console.log("Logged Out!");
});

client.addListener("registered", async () => {
  console.log(`Connected to ${config.IRC_ADDRESS},`);
  if (Boolean(config.WEBHOOK_URL)) {
    await webhook.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("IRC Connected!")
          .setDescription(
            `Connected to: \`${config.IRC_ADDRESS}\` as \`${config.IRC_USERNAME}\``
          )
          .setColor("#00FF3F")
          .setTimestamp()
          .setFooter({ text: footer }),
      ],
    });
  }
  console.log("me -> NickServ : `IDENTIFY <REDACTED>`")
  await client.say("NickServ", `IDENTIFY ${config.NICKSERV_PASS}`);
});

client.addListener("notice", async (nick, to, text, message) => {
  if (nick == "Global") return;
  console.log(`${nick} -> me : ${text}`);
  if (text.includes("you are now recognized.")) {
    if (Boolean(config.WEBHOOK_URL)) {
      await webhook.send({
        embeds: [
          new EmbedBuilder()
            .setTitle("NickServ Identified!")
            .setDescription(`Identified as \`${config.IRC_USERNAME}\``)
            .setColor("#00FF3F")
            .setTimestamp()
            .setFooter({ text: footer }),
        ],
      });
    }
  }
}); 

client.addListener("error", async (message) => {
  console.log(`IRC Client Error\n${message}`)
});

client.connect();
