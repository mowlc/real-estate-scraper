# real-estate-scraper
Web scraper that makes it easier to find real estate in Slovenia. After scraper finishes you get an email with updates, so you don't have to check web pages all the time but only. In email you get all the information you need: Title with location, short description, price and link to original listing.

Email example:

![Email example](http://shrani.si/f/2Z/oj/4hrdFzjY/2017-03-149-28-47.png)

Currently supporting two major webpages for real estate Bolha.com and Nepremicnine.net

## Download
In order to rund script you have to install [Node.js] (https://nodejs.org/en/) and do the following:
* Clone repo 
```bash
git clone https://github.com/mowlc/real-estate-scraper.git
```
* Install additional libraries
```bash
npm install --save tinyreq
npm install --save cheerio 
npm install --save node-json-db 
npm install --save nodemailer


```

## Run
Firstly you need to get oAuth credentials. Very good tutorial on how to get them can be found here: https://stackoverflow.com/questions/24098461/nodemailer-gmail-what-exactly-is-a-refresh-token-and-how-do-i-get-one
Once you have your clientID, clientSecret, refreshToken and accessToken take config.json.example, compy and rename it to config.json. Then fill in the required data:
```bash
sender_email - Email from which emails will be sent (must be gmail)
clientID - Client ID for oAuth
clientSecret - Client secret for oAuth
refreshToken - Refresh token for oAuth
accessToken - Inital access token for oAuth, can also be empty because new one is generated upon registration
interval = 15 - Interval on which the script executes (between 15 and 30 minutes is optimal) 
receiver_email - List of email addresses on which to send email 
url_bolha  - list of URLs of selection on bolha.com				
url_nepremicnine - list of URLs of selection on nepremicnine.net				
```
You can get desired URL's from chosen site(bolha, nepremicnine.net) by configuring search paramteres on the site and then copying the URL in to configuration file. 

You run the script by executing following command:
```bash
node scraper.js
```

## Troubleshooting
### Email not send
Problem could be in your Gmail account settings as Google blocks sign-in attempts from apps that do not use modern security standards. In order to fix that go to [Google less secure apps settings](https://www.google.com/settings/security/lesssecureapps) and turn Access for less secure apps ON.
