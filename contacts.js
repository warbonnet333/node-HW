const fs = require("fs")
const path = require("path")
const { promises: fsPromises } = fs;


const contactsPath = path.join(__dirname, "db", "contacts.json")

function listContacts() {
    fs.readFile(contactsPath, (err, data) => {
        if (err) {
            throw err
        }
        console.table(JSON.parse(data))
        console.table()
    })
}

function getContactById(contactId) {
    fs.readFile(contactsPath, (err, data) => {
        if (err) {
            throw err
        }
        const res = JSON.parse(data).find(item => item.id === contactId)
        console.log(res)
        return res
    })
}

function removeContact(contactId) {
    fs.readFile(contactsPath, (err, data) => {
        if (err) {
            throw err
        }

        const res = JSON.parse(data).filter(item => item.id !== contactId)

        fs.writeFile(contactsPath, JSON.stringify(res), err => {
            if (err) console.log(err)
            listContacts()
        })
    })
}

function addContact(name, email, phone) {
    const newContact = {
        id: Date.now(),
        name,
        email,
        phone
    }

    fs.readFile(contactsPath, (err, data) => {
        if (err) {
            throw err
        }

        const newData = [...JSON.parse(data), newContact]

        fs.writeFile(contactsPath, JSON.stringify(newData), (err) => {
            if (err) console.log(err);
            listContacts()
        })
    })

}


module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact
}


