import OAuth from "./oauth-1.0a.js";
// Call the API
// This is a POST request, because we need the API to generate a new token for us
console.log('whats up!')
console.log('encrypted', CryptoJS.AES.encrypt('themessage', 'thekey'))

// Initialize
const oauth = OAuth({
    consumer: {
        key: '39KFTkbvunKUUTmzhZ7x1Q',
        secret: '_03_HqCLQZpOOCSSmWfwincN_pVkUJQFxH1un2dOLsIu1Lhf0Vk6zxJapSG9J-W9Oz-o7g_TUexO1Tt_S0t0Yw',
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return CryptoJS
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})
const request_data = {
    url: 'https://account.api.here.com/oauth2/token',
    method: 'POST',
    data: { grant_type: 'client_credentials' },
};
console.log(oauth.toHeader(oauth.authorize(request_data)));

fetch('https://account.api.here.com/oauth2/token', {
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'OAuth oauth_consumer_key="39KFTkbvunKUUTmzhZ7x1Q",oauth_signature_method="HMAC-SHA256",oauth_timestamp="1661900126",oauth_nonce="kyA3BXD0Il1",oauth_version="1.0",oauth_signature="3R%2F4KVkPexdlqxCvKZgBEgxuyg5Y8eraZypz%2FRl7cIk%3D"'

    }
}).then(function (resp) {

    // Return the response as JSON
    return resp.json();

}).then(function (data) {

    // Log the API data
    console.log('token', data);

}).catch(function (err) {

    // Log any errors
    console.log('something went wrong', err);

});

// // Token request function
// function generateToken() {
//     // #1 Initialize OAuth with your HERE OAuth credentials from the credentials file that you downloaded above
//     const oauth = OAuth({
//         consumer: {
//             key: 'your_key', //Access key
//             secret: 'your_secret_key', //Secret key
//         },
//         signature_method: 'HMAC-SHA256',
//         hash_function(base_string, key) {
//             return crypto
//                 .createHmac('sha256', key)
//                 .update(base_string)
//                 .digest('base64')
//         },
//     });
//     // #2 Building the request object.
//     const request_data = {
//         url: 'https://account.api.here.com/oauth2/token',
//         method: 'POST',
//         data: { grant_type: 'client_credentials' },
//     };
//     // #3 Sending the request to get the access token
//     request(
//         {
//             url: request_data.url,
//             method: request_data.method,
//             form: request_data.data,
//             headers: oauth.toHeader(oauth.authorize(request_data)),
//         },
//         function (error, response, body) {

//             if (response.statusCode == 200) {
//                 result = JSON.parse(response.body);
//                 console.log('Token', result);
//             }
//         }
//     );
// }

// // Calling this function to get the access token

// generateToken();
