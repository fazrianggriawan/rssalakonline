let host = 'https://simrsmandiri.com/api/index.php';
let hostAntrol = 'https://api.simrsmandiri.com/public';
let publicHost = 'http://182.253.22.220/vclaim/index.php';
let localhost = 'http://localhost/api_rssalakonline/public';

export const config = {
    api: function (url: string) { return host + '/' + url },
    api_antrol: function (url: string) { return localhost + '/' + url },
    api_public: function (url: string) { return publicHost + '/' + url },
}