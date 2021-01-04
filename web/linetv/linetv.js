const express = require('express');
const router = express.Router();
const fs = require('fs');
const http = require('https');
router.get('/', async (req, res) => {

    const datetime = new Date().toISOString().slice(0, 10);
    const localIP = "http://shachikuengineer.ddns.net:3000";
    const dramaId = req.query.dramaId;
    let eps = req.query.eps;
    try {

        if (typeof eps === 'undefined')
            eps = '1';
        let isToday = false;
        if (typeof req.query.daily !== 'undefined') {
            let array = eps.split('-');
            let date = array[array.length - 1];
            if (date === datetime)
                isToday = true;
        }

        let returnResult = { status: "", file: dramaId + "_" + eps };
        if (typeof req.query.daily === 'undefined' && fs.existsSync(__dirname + '/key/' + dramaId + "_" + eps) && fs.existsSync(__dirname + '/m3u8/' + dramaId + "_" + eps + ".m3u8") && typeof req.query.playlist === 'undefined') {
            returnResult.status = "exist";

        } else if (typeof req.query.daily !== 'undefined' && (isToday || (fs.existsSync(__dirname + '/key/' + dramaId + "_" + eps + "-" + datetime) && fs.existsSync(__dirname + '/m3u8/' + dramaId + "_" + eps + "-" + datetime + ".m3u8"))) && typeof req.query.playlist === 'undefined') {
            returnResult.status = "exist";
        } else {
            if (!fs.existsSync(__dirname + '/key'))
                fs.mkdirSync(__dirname + '/key');
            if (!fs.existsSync(__dirname + '/m3u8'))
                fs.mkdirSync(__dirname + '/m3u8');
            if (!fs.existsSync(__dirname + '/local'))
                fs.mkdirSync(__dirname + '/local');

            let url = "https://www.linetv.tw/api/part/" + dramaId + "/eps/" + eps + "/part?chocomemberId=";

            if (typeof req.query.memberId !== 'undefined') {
                url += req.query.memberId;
            }
            let request_call = new Promise((resolve, reject) => {
                http.get(url, (response) => {
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                    });
                    response.on('end', () => {
                        try {
                            const parsedData = JSON.parse(rawData);
                            resolve(parsedData);

                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            });

            let json = await request_call;

            if (json.code !== 2000)
                new Error(json.message);

            let dramaName = json.dramaInfo.name + '-' + json.epsInfo.eps_title;
            let link = json.epsInfo.source[0].links[0].link;
            let subtitle = json.epsInfo.source[0].links[0].subtitle;
            let keyType = json.epsInfo.source[0].links[0].keyType;
            let keyId = json.epsInfo.source[0].links[0].keyId;
            // #xspf
            // if (isset(_GET['playlist'])) {
            //     newsXML = new SimpleXMLElement("<playlist></playlist>");
            //     newsXML->addAttribute('xmlns', 'http://xspf.org/ns/0/');
            //     newsXML->addAttribute('xmlns:vlc', 'http://www.videolan.org/vlc/playlist/ns/0/');
            //     newsXML->addAttribute('version', '1');
            //     newsIntro = newsXML->addChild('title', json->dramaInfo->name);
            //     trackList = newsXML->addChild('trackList');
            //     extension = newsXML->addChild('extension');
            //     extension->addAttribute('application', 'http://www.videolan.org/vlc/playlist/0');
            //     for (ep = 1; ep <= (int)json->dramaInfo->eps; ep++) {
            //         track = trackList->addChild('track');
            //         track->addChild('title', json->dramaInfo->name . ' ep. ' . ep);
            //         track->addChild('location', localIP . '/linetv/index.php?dramaId=' . dramaId . '&amp;eps=' . ep);
            //         ext = track->addChild('extension');
            //         ext->addAttribute('application', 'http://www.videolan.org/vlc/playlist/0');
            //         ext->addChild('vlc:id', strval(ep - 1));
            //         ext->addChild('vlc:option', 'network-caching=1000');

            //         newsIntro = extension->addChild('vlc:item');
            //         newsIntro->addAttribute('tid', strval(ep - 1));
            //     }
            //     header('Content-Type: application/xspf+xml');
            //     header('Content-Disposition: attachment; filename="' . json->dramaInfo->name . '.xspf"');
            //     echo newsXML->asXML();
            //     exit();
            // }

            let array = link.split('/');
            let dramaFile = array[array.length - 1];
            dramaFile = dramaFile.split("_HD")[0];
            dramaFile = dramaFile.split("_SD")[0];
            link = link.split(dramaFile)[0] + '1080/' + dramaFile;

            // subtitle
            if (subtitle !== null) {
                if (!fs.existsSync(__dirname + "/m3u8/subs/"))
                    fs.mkdirSync(__dirname + "/m3u8/subs/");

                request_call = new Promise((resolve, reject) => {
                    http.get(subtitle, (response) => {
                        let rawData = '';
                        response.on('data', function (chunk) {
                            rawData += chunk;
                        });
                        response.on('end', () => {
                            try {
                                resolve(rawData);

                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                });


                let result = await request_call;

                array = subtitle.split("/");
                let subExt = array[array.length - 1];
                array = subExt.split(".");
                subExt = array[array.length - 1];
                fs.writeFileSync(__dirname + "/m3u8/subs/" + dramaId + "_" + eps + "." + subExt, result, function (err) {
                    if (err) throw err;
                });
                fs.copyFileSync(__dirname + "/m3u8/subs/" + dramaId + "_" + eps + "." + subExt, __dirname + "/m3u8/subs/" + dramaId + "_" + eps + "-" + datetime + "." + subExt);
            }


            request_call = new Promise((resolve, reject) => {
                http.get(link + '_1080p.m3u8', (response) => {
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                    });
                    response.on('end', () => {
                        try {
                            resolve(rawData);

                        } catch (e) {
                            reject(e);
                        }
                    });
                });
            });


            let result = await request_call;

            result = result.split(dramaFile + '_1080p.ts').join(link + '_1080p.ts');


            if (!fs.existsSync(__dirname + "/local/" + dramaId))
                fs.mkdirSync(__dirname + "/local/" + dramaId);

            if (typeof req.query.daily !== 'undefined') {

                fs.writeFileSync(__dirname + "/local/" + dramaId + "/" + dramaId + "_" + eps + "-" + datetime + ".m3u8", result.split("https://keydeliver.linetv.tw/jurassicPark").join(dramaId + "_" + eps + "-" + datetime), function (err) {
                    if (err) throw err;
                });
                fs.writeFileSync(__dirname + "/m3u8/" + dramaId + "_" + eps + "-" + datetime + ".m3u8", result.split("https://keydeliver.linetv.tw/jurassicPark").join(localIP + "/linetv?key&dramaId=" + dramaId + "&eps=" + eps + "-" + datetime), function (err) {
                    if (err) throw err;
                });
            }


            resultLocal = result.split("https://keydeliver.linetv.tw/jurassicPark").join(dramaId + "_" + eps);
            fs.writeFileSync(__dirname + "/local/" + dramaId + "/" + dramaId + "_" + eps + ".m3u8", resultLocal, function (err) {
                if (err) throw err;
            });
            result = result.split("https://keydeliver.linetv.tw/jurassicPark").join(localIP + "/linetv?key&dramaId=" + dramaId + "&eps=" + eps);
            fs.writeFileSync(__dirname + "/m3u8/" + dramaId + "_" + eps + ".m3u8", result, function (err) {
                if (err) throw err;
            });



            let postData = JSON.stringify({ 'keyType': keyType, 'keyId': keyId, 'dramaId': dramaId, 'eps': parseInt(eps) });



            let options = {
                hostname: 'www.linetv.tw',
                port: 443,
                path: '/api/part/dinosaurKeeper',
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
                    'Content-Type': 'application/json',
                    'Content-Length': postData.length
                }
            };
            request_call = new Promise((resolve, reject) => {
                http.request(options, (response) => {
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;
                    });
                    response.on('end', () => {
                        try {
                            resolve(JSON.parse(rawData));

                        } catch (e) {
                            reject(e);
                        }
                    });
                }).write(postData);
            });


            result = await request_call;
            options = {
                hostname: 'keydeliver.linetv.tw',
                port: 443,
                path: '/jurassicPark',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0',
                    'authentication': result.token
                }
            };
            if (fs.existsSync(__dirname + "/key/" + dramaId + "_" + eps)) {
                fs.unlinkSync(__dirname + "/key/" + dramaId + "_" + eps);
            }
            request_call = new Promise((resolve, reject) => {
                http.request(options, (response) => {
                    let rawData = '';
                    response.on('data', function (chunk) {
                        rawData += chunk;

                        fs.appendFileSync(__dirname + "/key/" + dramaId + "_" + eps, chunk);
                    });
                    response.on('end', () => {
                        try {
                            resolve(rawData);

                        } catch (e) {
                            reject(e);
                        }
                    });
                }).end();
            });

            result = await request_call;
            fs.copyFileSync(__dirname + "/key/" + dramaId + "_" + eps, __dirname + "/local/" + dramaId + "/" + dramaId + "_" + eps);
            // console.log(result);
            // fs.writeFileSync(__dirname + "/local/" + dramaId + "/" + dramaId + "_" + eps, result, "binary", function (err) {
            //     if (err) throw err;
            // });
            // fs.writeFileSync(__dirname + "/key/" + dramaId + "_" + eps, result, "binary", function (err) {
            //     if (err) throw err;
            // });


            if (typeof req.query.daily !== 'undefined') {
                fs.copyFileSync(__dirname + "/key/" + dramaId + "_" + eps, __dirname + "/key/" + dramaId + "_" + eps + "-" + datetime);
                eps += "-" + datetime;
            }
            returnResult.status = "success";

        }

        console.log(returnResult);
        if (typeof req.query.key !== 'undefined') {
            let stat = fs.statSync(__dirname + '/key/' + dramaId + "_" + eps);
            let readStream = fs.createReadStream(__dirname + '/key/' + dramaId + "_" + eps);
            res.writeHead(200, {
                'Content-Type': 'binary/octet-stream',
                'Content-Disposition': 'attachment; filename=' + dramaId + '_' + eps,
                'Content-Length': stat.size
            });
            readStream.pipe(res);
        }
        else if (typeof req.query.local === 'undefined') {
            let stat = fs.statSync(__dirname + '/m3u8/' + dramaId + "_" + eps + ".m3u8");
            let readStream = fs.createReadStream(__dirname + '/m3u8/' + dramaId + "_" + eps + ".m3u8");
            res.writeHead(200, {
                'Content-Type': 'application/vnd.apple.mpegurl',
                'Content-Disposition': 'attachment; filename=' + dramaId + '_' + eps + '.m3u8',
                'Content-Length': stat.size
            });
            readStream.pipe(res);
        }
        else
            res.status(200).send(returnResult);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;