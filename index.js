"use strict";

const dns = require('dns')
const net = require('net')
const Joi = require('@hapi/joi')

let email = "admin@appgenbd.com"


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
            console.log(records)
        }
    })
} else {
    console.log('invalid email')
}
