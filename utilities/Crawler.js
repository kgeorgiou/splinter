/**
 * Created by canastas on 11/04/16.
 */

var cheerio = require('cheerio');
var Utils = require('../utilities/Utils');
var String = require('../utilities/StopWordsPlugin');
var conf = require('../config');

var KW_PTS = conf.params.kw_pts;
var H_PTS = conf.params.h_pts;
var R_PTS = conf.params.r_pts;

var REPLACE_REGEX = /[{}()"\-—!#@&?<>\|@:;\.]|&.+;/g;

var Crawler = {
    crawlHtml: function(html) {
        var $ = cheerio.load(html);
        var freq = {};
        Crawler.crawlMeta($, freq);
        Crawler.crawlHeaders($, freq, 1.0);
        Crawler.crawlAnchorText($, freq);
        return freq;
    },

    crawlMeta: function($, freq) {
        $("meta[name=keywords], meta[name=description]").each(function () {
            var txt = this.attribs.content.toLowerCase().removeStopWords();

            var kw = txt.split(',').filter(function (t) {
                return t.length > 1 && isNaN(t);
            });
            kw.forEach(function (w) {
                w.split(' ').forEach(function (t) {
                    Utils.addToFreqTable(t, KW_PTS, freq)
                });
                w.replace(REPLACE_REGEX, '').split(' ').forEach(function (t) {
                    Utils.addToFreqTable(t, KW_PTS, freq)
                });
            });
        });
    },

    crawlHeaders: function($, freq, factor) {
        Crawler.crawlHeadersHelper($, freq, factor, H_PTS);
    },

    crawlAnchorHeaders: function($, freq, factor) {
        Crawler.crawlHeadersHelper($, freq, factor, R_PTS);
    },

    crawlHeadersHelper: function($, freq, factor, pts) {
        $("h1, h2, h3, h4, h5, h6").each(function () {
            var txt = $(this).text().toLowerCase().replace(REPLACE_REGEX,"").removeStopWords();
            var ws = txt.split(/[ ,\.\-\n/:']/g).filter(function (t) {
                return t.length > 1 && isNaN(t);
            });

            var f = parseInt(this.name.split("")[1]);
            ws.forEach(function (t) {
                Utils.addToFreqTable(t, factor * (pts - f), freq)
            });
        });
    },

    crawlAnchorText: function($, freq) {
        $("body a").each(function() {
            var txt = $(this).text().replace(REPLACE_REGEX, "").removeStopWords();
            txt.split(/[ ,\.\-\n:/']/g).filter(function (t) {
                return t.length > 1 && isNaN(t);
            }).forEach(function(t){
                Utils.addToFreqTable(t, 1, freq);
            })
        });
    },

    findAnchors: function(html) {
        var $ = cheerio.load(html);
        var urls = [];
        $("body a").each(function() {
            var txt = $(this).attr('href');
            urls.push(txt);
        });
        return urls;
    }
};

module.exports = Crawler;