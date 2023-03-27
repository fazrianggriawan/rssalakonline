let host = 'http://rspadonline.bertek.co.id/rspad/';
let hostSimrs = host;

export const config = {
    api: function (url: string) { return host + 'bihealth-service/index.php/' + url },
    api_vclaim: function (url: string) { return host + 'bihealth-vclaim/public/index.php/' + url },
    api_simrs: function (url: string) { return hostSimrs + 'bihealth-service/vclaim/index.php/' + url },
    host: host
}