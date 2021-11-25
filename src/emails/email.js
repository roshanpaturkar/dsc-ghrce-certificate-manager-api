const axios = require('axios');

const send = async (to, cc, bcc, subject, body, htmlBody, name='admin@certificate.server') => {
    var data = JSON.stringify({
        "server_id": process.env.MAIL_SERVER_ID,
        "name": name,
        "to": to?to: [],
        "cc": cc?cc: [],
        "bcc": bcc?bcc: [],
        "subject": subject,
        "body": body?body: null,
        "html_body": htmlBody?htmlBody: null
    });

    var config = {
        method: 'post',
            url: process.env.MAIL_SERVER_URL,
            headers: { 
            'accept': 'application/json', 
            'API-KEY': process.env.MAIL_SERVER_API_KEY, 
            'Content-Type': 'application/json'
        },
        data : data
    };

    axios(config)
    .then(function (response) {
        console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
        console.log(error);
    });
}

module.exports = send