const fs = require("fs")
const path = require("path")
const Joi = require("joi")

const contactsPath = path.join(__dirname, "../", "db", "contacts.json")

const contacts = fs.readFileSync(contactsPath, 'utf-8')
const contactsArr = JSON.parse(contacts)

function listContacts(req, res) {
    res.status(200).send(contactsArr)
}

function getContactById(req, res) {
    const targetId = parseInt(req.params.id)
    const targetContact = contactsArr.find(item => item.id === targetId)
    if (!targetContact) {
        return res.status(404).json({ "message": "Not found" })
    }
    res.status(200).send(targetContact)
}

function removeContact(req, res) {
    const targetId = parseInt(req.params.id)
    const newContactArr = contactsArr.filter(item => item.id !== targetId)

    if (newContactArr.length === contactsArr.length) res.status(404).json({ "message": "Not found" })

    fs.writeFile(contactsPath, JSON.stringify(newContactArr), (err) => {
        if (err) res.status(400).send(err)
        res.status(200).send({ "message": "contact deleted" })
    })
}

function addContact(req, res) {
    const rules = {
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required()
    }

    const result = Joi.validate(req.body, rules)

    if (result.error) return res.status(400).json({ "message": "missing required name field" })

    const newContact = {
        ...req.body,
        id: Date.now(),
    }

    contactsArr.push(newContact)

    fs.writeFile(contactsPath, JSON.stringify(contactsArr), (err) => {
        if (err) res.status(400).send(err);
        res.status(201).send(newContact)
    })
}

function updateContact(req, res) {
    if (!Object.keys(req.body).length) return res.status(400).send("missing fields")

    const rules = {
        name: Joi.string(),
        email: Joi.string(),
        phone: Joi.string()
    }

    const result = Joi.validate(req.body, rules)

    if (result.error) return res.status(400).json({ "message": "missing fields" })

    const targetId = parseInt(req.params.id)
    const targetContactIndex = contactsArr.findIndex(item => item.id === targetId)
    if (targetContactIndex === -1) {
        return res.status(404).send("This user does not exist!")
    }

    const updatedContact = {
        ...contactsArr[targetContactIndex],
        ...req.body
    }

    contactsArr.splice(targetContactIndex, 1, updatedContact)

    fs.writeFile(contactsPath, JSON.stringify(contactsArr), (err) => {
        if (err) res.status(400).send(err);
        res.status(200).send(updatedContact)
    })
}


module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact
}