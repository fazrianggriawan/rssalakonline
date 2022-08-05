let host = 'http://rssalakbogor.co.id/';
// let host = 'http://localhost/';
let hostSimrs = 'http://182.253.22.220/';

export const config = {
    api: function (url: string) { return host + 'api/index.php/' + url },
    api_vclaim: function (url: string) { return host + 'vclaim/public/' + url },
    api_simrs: function (url: string) { return hostSimrs + 'vclaim/index.php/' + url },
    host: host
}