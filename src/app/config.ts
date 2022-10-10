let host = 'http://rstambon.co.id/';
// let host = 'http://localhost/';
let hostSimrs = 'http://36.94.176.218/';

export const config = {
    api: function (url: string) { return host + 'bihealth_api/index.php/' + url },
    api_vclaim: function (url: string) { return host + 'bihealth_vclaim/public/' + url },
    api_simrs: function (url: string) { return hostSimrs + 'bihealth_api/vclaim/index.php/' + url },
    host: host
}