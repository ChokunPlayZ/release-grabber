#  release-grabber
a simple and lightweight bun script that sits in SubsPlease IRC and grab a new release when it comes out  
designed to work with [pyMedusa](https://pymedusa.com/)  

also when your stuff is designed to only do one and one thing only it is super light, clocking in at just 32MB with libaries installed  
the docker image is arround `297.2 MB` a lot more heavy since it has to include bun and other stuff  
## Why?
for the past months or so, I switched to a proper PVR on my streaming stack, I have a problem with pyMedusa not being able to grabbing the release fast enough, the delay is usually 10 minutes, which is not what I wanted, I used to make pyMedusa run a daily search every 1 minute but that also spam subsplease server with request, not what I wanted to do, autobrr does not work with pyMedusa, so I come up with this
## How it works
this script will first login to rizon IRC, #subsplease channel and sit there, waiting for a message  
when the message comes in, it verify the sender, match the data and pull the filename and url from the message (the script is only designed to pull 1080p releases, the option to pick the resolution might come later)  
then it sends the filename over to medusa to check if the show is in your list, if it is it sends the torrent url to qBittorrent to have it download the file  
# How To run
There's a few way to run this script, the recomended way is using [PM2](https://pm2.io/), docker is also supported  
## PM2
1. Clone the Repo 
 ```bash
git clone https://github.com/ChokunPlayZ/release-grabber.git
```
2. cd into the directory
```bash
cd release-grabber
```
3. copy the file `example.env` and rename it to `.env`
4. edit the file using YOUR info
4.1. change the nickname having `|AutoDL` tailing the name is recomended
4.2. discord webhook can be left empty, just remeber to delete the varible from the file, then the script wont try to send a webhook, it is recomended but not required
5. install required packages
```bash
npm i
```
6. run the script using pm2
```bash
pm2 start pm2.config.js
```
7. verify that is is working, if it is there should probarly see a message in the channel you pointed the webhook to, if webhook isnt configured, run `pm2 log <id>` to see what the script is doing
## Docker
1. Clone the Repo 
 ```bash
git clone https://github.com/ChokunPlayZ/release-grabber.git
```
2. cd into the directory
```bash
cd release-grabber
```
3. copy the file `example.env` and rename it to `.env`
4. edit the file using YOUR info, 
4.1. change the nickname having `|AutoDL` tailing the name is recomended
4.2. discord webhook can be left empty, just remeber to delete the varible from the file, then the script wont try to send a webhook, it is recomended but not required
5. build and run the docker image
```bash
docker compose up --build -d
```
wait for it to run and you should be set

## Updating
1. Pull the repo
```
git pull
```
2. Run the script  
2.1. PM2,  
```
pm2 restart Release\ Grabber
```
2.2. Docker,  
```
docker compose up --build -d
```
3. Enjoy!
# Dependencies
everything this script relys on to function
 - [matrix org irc](https://www.npmjs.com/package/matrix-org-irc)
 - [discord.js](https://www.npmjs.com/package/discord.js)
 - [qs](https://www.npmjs.com/package/qs)
 - [PyMedusa](https://pymedusa.com/)