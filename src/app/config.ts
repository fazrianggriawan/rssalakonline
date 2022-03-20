let host = 'http://localhost/simrsmandiri/api/index.php';
let host2 = 'https://simrsmandiri.com/api/index.php';
export const config = {
    api_antrol: function (url: string) { return host + '/antrol/bpjs/' + url },
    api_online: function (url: string) { return host + '/online/' + url },
    api_vclaim: function (url: string) { return host + '/vclaim/' + url },
    api: function (url: string) { return host + '/' + url },
}