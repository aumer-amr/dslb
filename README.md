# DSLB
Discord Shoutout Lock Bot - A bot created to lock one channel while the streamer is streaming, and unlocks it when the user stops streaming

# Add to heroku instant
[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# Setup

## Discord
First we need to create a discord bot, to do this we login to the developer console of discord [https://discordapp.com/developers/applications/](https://discordapp.com/developers/applications/). If you're not logged in yet, you'll be redirected to discord after logging in, simply go to [https://discordapp.com/developers/applications/](https://discordapp.com/developers/applications/) again after logging in.

On the developer console, press the button **New Application**. 
The name you fill out on the popup is also the name of your bot, and how people will see it.

On the next page, i highly recommend uploading an image. This won't be the bot's avatar but when you have multiple applications it's easy to seperate them.

In the left menu go to the "Bot" setting and press the button **Add Bot**

With the new options available, i again suggest uploading an image. This will be the picture people see next to the bot user in discord. Also disable **PUBLIC BOT**.

Now open notepad or something similar where you can write stuff down. Press **Click to Reveal Token** and copy/write this down as discordBotToken.

Again in the left menu, go to "Oauth2" setting.
Here under **SCOPES** select **bot** only, and under **BOT PERMISSIONS** select **Manage Channels**, and press copy next to the URL that was generated. It should look like "https://discordapp.com/api/oauth2/authorize?client_id=000000000000000&permissions=16&scope=bot"

For the next step, make sure your discord role on the discord server has **Administrator**. If you don't have this, give the link that was generator to someone who has.

On the window that is presented after going to the generated url, select the server you want the shoutout bot to be in and press **Authorize**

We now need to enable **Developer mode** on your account, to do this open your Discord Desktop App and go into settings. Under **Appearance** you'll see a switch **Developer Mode**, enable this and go to the server you want to enable the bot for.

Now Right-click on the shoutout channel, and select **Copy ID**. Copy/write this down as discordShoutoutChannelId.

The role id is still unknown, so let's try to grab that. If you want the shoutout channel locked for everyone this would be the @everyone role. If you have the **Send Messages** permissions already disabled for @everyone and want it disabled for subs, find your sub role.

Go to your server settings and view your Roles (again this depends if you have the permissions to view these). Find the role explained above, and right click the name and again select **Copy ID**, Copy/write this down as discordRoleId.

## Twitch
Signin to your twitch account on https://dev.twitch.tv/, if you're already logged in go to your dashboard.

Visit the **Applications** tab and register a new application by pressing **Register Your Application**.

### Name
This can be anything you want

### OAuth Redirect URL
Set this to "http://localhost"

### Category 
Set this to "Application Integration"

After you created your app, you'll see your **Client ID** copy/write this down as twitchClientId.

## Twitch Streamer ID
I put this as a seperate part as this can be tricky, especially if you have 0 tech knowledge. However i'll try to discribe it the best i can, if it's not working or you're helpless talk to someone tech minded or hit me up on discord.

Open an API tester like Postman or [https://resttesttest.com/](https://resttesttest.com/), in this example i'll explain using [https://resttesttest.com/](https://resttesttest.com/).

### Endpoint
https://api.twitch.tv/kraken/users

### Headers
Press **Add header** twice and add the following:
* Name: Client-ID
* Value: Use the value you copied/written down as twitchClientId

* Name: Accept
* Value: application/vnd.twitchtv.v5+json

### Parameters
Press **Add parameter** once and add the following:
* Name: login
* Value: Streamers channel name (mine would be dwaigonaumer, be aware this is case sensative)

### URL
Fill this field with the following url, with LOGINHERE replaced by the streamers channel name.
https://api.twitch.tv/kraken/users?login=LOGINHERE

After this press the big green button **Ajax request**, if all things went well you'll see on the right side the message "HTTP 200 success" with some giberish below it. In this giberish try to find "\_id" and the big number next to it. For example mine is 85384867.

Copy/write this value down as twitchStreamerId.

## Create New App
Start by creating an heroku account if you haven't yet at [https://signup.heroku.com/](https://signup.heroku.com/), a free account is sufficient (and better in this case).

After you have logged into your (new) account, press the purple button above.

### App name
Choose a suiting name, the name can only contain lowercase letters, numbers and dashes. A good name would be: <streamer>-shoutout-bot, in my case this would be: dwaigonaumer-shoutout-bot.
  
### Choose a region
This doesn't matter at all, leaving it default is fine.

### Config Vars
Fill these out with the variables you copied/written down in all the previous steps. However host is explained on the form itself.

After this it should be done and running, be aware there might be a slight delay when the streamer begins streaming / ends streaming for the bot to do it's work.

On any questions hit me up on discord.
