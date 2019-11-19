"use strict";

const dns = require('dns')
const net = require('net')
const Joi = require('@hapi/joi')

let email = "woshikuzzaman@appgenbd.com"


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
            // records.forEach(mx => {
            // 	net.createConnection({
            // 		pot
            // 	}, )
            // })

            let socket = net.createConnection({
            	host: records[0].exchange,
            	port: 25,
            }, () => {

            })

            socket.on('data', msg => {
            	console.log(msg)
            })
        }
    })
} else {
    console.log('invalid email')
}
