var request = require('request');
var cheerio = require('cheerio');
var Utils = require('../utilities/Utils');
var String = require('../utilities/StopWordsPlugin');
var conf = require('../config');
var async = require("async");
var Crawler = require("../utilities/Crawler");

var TOP_RELEVANT_LIMIT = conf.params.top_relevant_limit;
var ANCHORS_LIMIT = conf.params.anchors_limit;
var KW_PTS = conf.params.kw_pts;
var H_PTS = conf.params.h_pts;
var R_PTS = conf.params.r_pts;

var SplinterController = {

    processURL: function (req, res) {

        var url = req.body.url;

        if (!url || !url.length) {
            res.json({
                status: 'error',
                error: 'Parameter [url] is missing.'
            });
            return;
        }

        url = Utils.prependScheme(url);

        request(url, function (error, response, html) {
            if (!error && response.statusCode == 200) {

                var freq = Crawler.crawlHtml(html);
                var urls = Crawler.findAnchors(html);

                SplinterController.processAnchors(url, urls, 0.4, function (f) {

                    var final_freq = Utils.mergeFreqTables(freq, f);

                    var pairs = Object.keys(final_freq)
                        .filter(function (k) {
                            return k.length > 0;
                        })
                        .map(function (key) {
                            return [key, f[key]];
                        })
                        .sort(function (a, b) {
                            if(b[1] == a[1]) {
                                return a[0] < a[1];
                            }
                            return b[1] - a[1];
                        });

                    var result = [];
                    for (var i = 0; i < TOP_RELEVANT_LIMIT && i < pairs.length; i++) {
                        result.push(pairs[i][0]);
                    }

                    res.status(200).json({
                        status: 'ok',
                        result: result
                    });
                });

            } else {
                res.status(200).json({
                    status: 'error',
                    result: []
                });
            }

        });
    },

    processAnchors: function (baseUrl, refs, discountFactor, callback) {

        var asyncTasks = [];

        function enqueueTask(task) {
            asyncTasks.push(function (callback) {
                request(task, function (error, response, html) {
                    var freq = {};
                    if (!error && response.statusCode == 200) {
                        var $ = cheerio.load(html);
                        Crawler.crawlAnchorHeaders($, freq, discountFactor);
                    }
                    callback(null, freq);
                })
            });
        }

        refs = refs.filter(function(ref) { return ref!=null && typeof ref == "string"; });
        for(var i=0; i < ANCHORS_LIMIT; i++) {
            var item = refs[i];

            if (!item || typeof item != "string") {
                continue;
            }

            if (item.match(/^\/[a-z0-9]/i))
                item = baseUrl + item;
            else if (item.match(/^\/\//i))
                item = 'http:' + item;
            else if (!item.match(/^https?:\/\//i))
                item = baseUrl + '/' + item;

            enqueueTask(item);
        }

        async.parallel(asyncTasks, function (err, freqs) {
            var freq = {};
            freqs.forEach(function(f) {
                freq = Utils.mergeFreqTables(freq, f);
            });
            callback(freq);
        });

    }
};

module.exports = SplinterController;