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

            socket = new net.Socket()

            socket.connect({
                port: 25,
                host: records[0].exchange
            }, () => {
                console.log('connection open successfully')
            })

            socket.on('data', (mes) => {
                console.log(mes.toString())
            })

            socket.on('connect', () => {
                console.log('successfully connected with the server')
            })

            socket.on('ready', () => {
            	console.log('connection ready')
            })

            socket.on('error', err => {
                console.log(err)
            })

            socket.on('end', err => {
                console.log('connection end')
            })

            socket.on('close', err => {
                console.log('connection close')
            })
        }
    })
} else {
    console.log('invalid email')
}
