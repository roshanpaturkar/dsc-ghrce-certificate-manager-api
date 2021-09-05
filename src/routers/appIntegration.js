const express = require("express");
const { Deta } = require("deta");
const cryptoRandomString = require("crypto-random-string");

const apiKey = require("../middleware/apiKey");

const Event = require("../models/event");
const Certificate = require("../models/certificate");

const router = new express.Router();

router.get("/certificates/email/:email", apiKey, async (request, response) => {
    const deta = Deta("c0i9fb8y_h54tokyywsUuX3F3Zbuk2cMxM5avEGJF"); // configure your Deta project
    const db = deta.Base("dsc-certificates-buffer");
    try {
        const certificates = await Certificate.find({ email: request.params.email});
        const bufferKey = cryptoRandomString({length: 20})
        certificates.forEach(async (certificate) => {
            const event = await Event.findOne({ eventID: certificate.eventID });
            await db.insert({
                bufferKey: bufferKey,
                certificateID: certificate.certificateID,
                eventID: certificate.eventID,
                name: certificate.name,
                email: certificate.email,
                eventName: event.eventName,
                eventDate: event.eventDate,
            })
        })
        await db.fetch({'bufferKey': bufferKey})
        certificatesData = await db.fetch({'bufferKey': bufferKey})
        certificatesData.items.forEach(async(certificate) => await db.delete(certificate.key))
        response.send(certificatesData.items)
    } catch (error) {
        console.log(error);
        response.status(404).send({ error: "Certificates not found!" });
    }
});

module.exports = router;