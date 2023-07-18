// let host = 'http://192.168.150.55/';
let host = 'http://localhost/';
let hostSimrs = host;
let simrslama = 'http://192.168.150.204/jkn/';

export const config = {
    api: function (url: string) { return host + 'bihealth-service/index.php/' + url },
    api_vclaim: function (url: string) { return host + 'bihealth-vclaim/public/index.php/' + url },
    api_simrs: function (url: string) { return hostSimrs + 'bihealth-service/vclaim/index.php/' + url },
    api_simrslama: function (url: string) { return simrslama + url },
    host: host
}