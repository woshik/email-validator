"use strict";

const dns = require('dns')
const net = require('net')
const Joi = require('@hapi/joi')

let email = "woshikuzzaman@gmail.com"
let stage = 0,
    success = false,
    response = '',
    completed = false,
    ended = false,
    tryagain = false,
    banner = '',
    socket = new net.Socket()

const schema = Joi.object({
    email: Joi.string().trim().email()
})

const validateResult = schema.validate({
    email: email,
})

if (!validateResult.error) {
    let email = validateResult.value.email
    let domain = email.split("@")[1]

    dns.resolve(domain, 'MX', (err, records) => {
        if (err) {
            console.log('invalid email')
        } else {
            records.sort((a, b) => a.priority - b.priority)

            socket.connect({
                port: 25,
                host: records[0].exchange
            }, () => {
                console.log('Connected')
            })
        }
    })
} else {
    console.log('invalid email')
}

socket.on('data', function(data) {
    response += data.toString();
    completed = response.slice(-1) === '\n';
    if (completed) {
        console.log(response)
        switch (stage) {
            case 0:
                if (response.indexOf('220') > -1 && !ended) {
                    // Connection Worked
                    banner = response
                    var cmd = 'EHLO ' +  + '\r\n'
                    console.log(cmd)
                    socket.write(cmd, function() {
                        stage++;
                        response = '';
                    });
                } else {
                    if (response.indexOf('421') > -1 || response.indexOf('450') > -1 || response.indexOf('451') > -1)
                        tryagain = true;
                    socket.end();
                }
                break;
            case 1:
                if (response.indexOf('250') > -1 && !ended) {
                    // Connection Worked
                    var cmd = 'MAIL FROM:<' + email + '>\r\n'
                    console.log(cmd)
                    socket.write(cmd, function() {
                        stage++;
                        response = '';
                    });
                } else {
                    socket.end();
                }
                break;
            case 2:
                if (response.indexOf('250') > -1 && !ended) {
                    // MAIL Worked
                    var cmd = 'RCPT TO:<' + email + '>\r\n'
                    console.log(cmd)
                    socket.write(cmd, function() {
                        stage++;
                        response = '';
                    });
                } else {
                    socket.end();
                }
                break;
            case 3:
                if (response.indexOf('250') > -1 && !ended) {
                    // RCPT Worked
                    success = true;
                    console.log('mail verifyed')
                }
                stage++;
                response = '';
                // close the connection cleanly.
                if (!ended) {
                    var cmd = 'QUIT\r\n'
                    console.log(cmd)
                    socket.write(cmd);
                }
                break;
            case 4:
                socket.end();
        }

    }
})

socket.once('error', function(err) {
    console.log("Connection error")
})

socket.once('end', function() {
    console.log("Closing connection")
})