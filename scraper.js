'use strict';
var request = require('tinyreq');
var cheerio = require("cheerio");
var JsonDB = require('node-json-db');
var nodemailer = require('nodemailer');
var config = require( "./config.json" );

var transporter = nodemailer.createTransport({
    service:"Gmail",
    auth: {
		type: "OAuth2",
        user: config.sender_email,
        clientId: config.clientID,
        clientSecret: config.clientSecret,
        refreshToken: config.refreshToken,
		accessToken: config.accessToken,
		expires: 1484314697598
    }
});
var interval = config.interval;
var db = new JsonDB("NepremicnineProd", true, false);
var delta = [];
var sites = [];
var bolhaEnd = false;
var nepremEnd = false;

function onEnd() {
	if (bolhaEnd && nepremEnd){
		if (delta.length > 0){
			var mailContent = "";
			for (var i = 0; i < delta.length; i++){
				mailContent += "********** " + (i + 1) + " **********<br/>";
				mailContent += "<b>" + delta[i].title + "</b><br/>";
				mailContent += "<p>" + delta[i].desc + "</p><br/>";
				mailContent += "<b>" + delta[i].price + "</b><br/>";
				mailContent += '<a href="' + delta[i].conn + '">POVEZAVA</a><br/>';
				mailContent += "<br/>";
			}
			var mailDef = {
				from: '"Nove nepremičnine"',
				to: config.receiver_email.join(";"),
				subject: "NOVO " + (new Date()).toString(),
				html : mailContent
			};
			transporter.sendMail(mailDef, function (error, info) {
				if (error) {
					console.log((new Date()).toString() + " Error sending mail: " + error);
				} else {
					console.log((new Date()).toString() + " Email sent: " + info.response);
					delta = [];
				}
			});
		}
		bolhaEnd = false;
		nepremEnd = false;
		
	}
} 
onEnd();

for (var pIdx = 0; pIdx < config.url_bolha.length; pIdx++){
	sites.push({
		url: config.url_bolha[pIdx], 
		callback: function (err, body) {
			var bolhaDelta = 0;
			if(body) {
				var $ = cheerio.load(body);
				var bAds = $(".ad");
				for (var i = 0; i < bAds.length; i++){
					var ad = {
						id: bAds[i].children[3].children[1].children[0].attribs.href.split("aclct=")[1],
						title: bAds[i].children[3].children[1].children[0].attribs.title,
						desc: bAds[i].children[3].children[2].data.trim(),
						conn: "www.bolha.com" + bAds[i].children[3].children[1].children[0].attribs.href,
						price: bAds[i].children[7].children[1].children[0].children[0].data
					};
					try {
						db.getData("/B"+ad.id);
					} catch (err){
						bolhaDelta += 1;
						db.push("/B"+ad.id,ad);
						delta.push(ad);
					}	
				}
			}
			console.log((new Date()).toString() + " BOLHA.COM Delta: " + bolhaDelta);
			bolhaEnd = true;
			onEnd();
		}
	});
}

for (var pIdx = 0; pIdx < config.url_nepremicnine.length; pIdx++){
	sites.push({
		url: config.url_nepremicnine[pIdx], 
		callback: function (err, body) {
			var nepremDelta = 0;
			if(body) {
				var $ = cheerio.load(body);
				var nAds = $(".oglas_container");
				for (var i = 0; i < nAds.length; i++){
					try {
						var ad = {
							id: 	nAds[i].children[5].children[5].children[0].attribs.title,//id: nAds[i].children[1].children[0].attribs.title,
							title: 	nAds[i].children[5].children[5].children[0].children[0].children[0].data,//nAds[i].children[1].children[0].children[0].children[0].data,
							desc: 	nAds[i].children[5].children[11].children[9].children[1].children[0].data,//nAds[i].children[5].children[9].children[1].children[0].data,
							conn: 	"https://www.nepremicnine.net" + nAds[i].children[5].children[5].children[0].attribs.href,//nAds[i].children[1].children[0].attribs.href,
							price: 	nAds[i].children[5].children[11].children[13].children[4].children[0].data//nAds[i].children[5].children[13].children[4].children[0].data
						};
						try {
							db.getData("/N"+ad.id);
						} catch (err){
							nepremDelta += 1;
							db.push("/N"+ad.id,ad);
							delta.push(ad);
						}
					} catch (err) {
						console.log("NEPREMICNINE no data err" + err);
					}
				}
			}
			console.log((new Date()).toString() + " NEPREMICNINE.NET Delta: " + nepremDelta);
			nepremEnd = true;
			onEnd();
		}
	});
}


setInterval( 
	function(){
		console.log((new Date()).toString() + " STARTED"); 
		if ((new Date()).getHours() < 22 && (new Date()).getHours() >= 7) {
			for (var i = 0; i < sites.length; i++){
				request({
						url: sites[i].url,
						method: "GET",
						headers: {
							"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
						}
					},
					sites[i].callback
				);
			}
		}
	},
	interval * 60 * 1000
);