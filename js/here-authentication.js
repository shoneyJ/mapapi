import OAuth from "./oauth-1.0a.js";
import { here_credentials } from '../config.js';

export default async function generateToken() {


        const oauth = OAuth({
            consumer: here_credentials,
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return CryptoJS.HmacSHA1(base_string, key).toString(CryptoJS.enc.Base64)
            },
        })
        const request_data = {
            url: 'https://account.api.here.com/oauth2/token',
            method: 'POST',
            data: { grant_type: 'client_credentials' },
        };
        const headerParam = await oauth.authorize(request_data);
        const header = await oauth.toHeader(headerParam)
        console.log(oauth.toHeader(headerParam));

        fetch('https://account.api.here.com/oauth2/token', {
            method: 'POST',
            body: 'grant_type=client_credentials',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': header.Authorization

            }
        }).then(function (resp) {

            // Return the response as JSON
            return resp.json();

        }).then(function (data) {
            document.cookie = JSON.stringify(data);

            // Log the API data
            console.log('token', data);

        }).catch(function (err) {

            // Log any errors
            console.log('something went wrong', err);

        });
    

}
