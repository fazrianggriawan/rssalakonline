var host = 'http://182.253.22.220/vclaim/index.php';
export const config = {
    api_url: function (url: string) { return host + '/' + url }
}