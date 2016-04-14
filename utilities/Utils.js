var Utils = {
        prependScheme: function (url) {
            if (!url.match(/^https?:\/\//i))
                url = 'http://' + url;

            if (url[url.length - 1] == '/')
                url = url.substring(0, url.length - 1);

            return url;
        },
        addToFreqTable: function (word, factor, freq) {
            word = word.toLowerCase().replace(/[ {}()#@&?<>\|\+/:]|'s/gi,"");

            if (!isNaN(word))
                return;

            if (word.length != 0) {
                if (!freq[word])
                    freq[word] = 0;
                freq[word] += factor;
            }
        },
        mergeFreqTables: function(f1, f2) {
            var f = {};
            Object.keys(f1)
                .forEach(function(key) {
                    var k = key.replace(/[ \-:@()#\.,]/g, "");
                    Utils.addToFreqTable(k, f1[key], f);
                });

            Object.keys(f2)
                .forEach(function (key) {
                    var k = key.replace(/[ \-:@()#\.,]/g, "");
                    Utils.addToFreqTable(k, f2[key], f);
                });
            return f;
        },
        validURL: new RegExp(
            "^" +
                // protocol identifier
            "(?:(?:https?|t?ftps?|mailto|data|wss?)://)?" +
                // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
                // IP address dotted notation octets
                // excludes loopback network 0.0.0.0
                // excludes reserved space >= 224.0.0.0
                // excludes network & broadcast addresses
                // (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
                // host name
            "localhost" +
            "|" +
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
                // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
                // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
                // TLD may end with dot
            "\\.?" +
            ")" +
                // port number
            "(?::\\d{2,5})?" +
                // resource path
            "(?:[/?#]\\S*)?" +
            "$", "i"
        )
    }
    ;

module.exports = Utils;