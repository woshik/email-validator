"use strict";

const dns = require('dns')
const net = require('net')
const Joi = require('@hapi/joi')

let email = "woshikuzzaman@gmail.com"
let socket = null

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

            socket = new net.Socket({
            	host: records[0].exchange,
            	port: 25,
            })

            socket.on('ready', () => {
            	console.log('successfully connected with the server')
            })

            socket.on('error', err => {
                console.log(err)
            })
        }
    })
} else {
    console.log('invalid email')
}
