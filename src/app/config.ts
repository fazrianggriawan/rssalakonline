let host = 'http://simrsmandiri.com/api/index.php';
let hostOnline = 'http://api.simrsmandiri.com/public';
let hostPublic = 'http://182.253.22.220/vclaim/index.php';
export const config = {
    api: function (url: string) { return host + '/' + url },
    api_online: function (url: string) { return hostOnline + '/' + url },
    api_public: function (url: string) { return hostPublic + '/' + url },
}