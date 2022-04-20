let host = 'http://rssalakbogor.co.id/api/index.php';
let host2 = 'https://simrsmandiri.com/api/index.php';
let publichost = 'http://182.253.22.220/vclaim/index.php';
export const config = {
    api_antrol: function (url: string) { return host2 + '/antrol/bpjs/' + url },
    api_online: function (url: string) { return host2 + '/online/' + url },
    api_vclaim: function (url: string) { return host2 + '/vclaim/' + url },
    api: function (url: string) { return host2 + '/' + url },
    api_public: function (url: string) { return publichost + '/' + url },
}