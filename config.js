var config = {
    server: {
        url: 'http://splinter.kg.gg:3007/',
        port: 3007
    },
    params: {
        top_relevant_limit: 25,
        anchors_limit: 10,
        kw_pts: 17 * this.anchors_limit * 0.4,
        h_pts: 13,
        r_pts: 7
    }
};

module.exports = config;