const express = require("express");
const auth = require("../middleware/auth");
const ContactModel = require("../models/Contact.model");
const {check, validationResult} = require("express-validator");

const router = express.Router();

// Get All Contacts - Private
router.get("/", auth, async (req, res) => {
    try {
        // Return Contact of Specific User
        const contacts = await ContactModel.find({user: req.user.id}).sort({date: -1});
        res.json(contacts);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Add Contact - Private
router.post("", [
    auth,
    [
        check("name", "Please Enter Name").not().isEmpty(),
        check("email", "Please Enter Email").isEmail(),
        check("phone", "Please Enter Contact Number").isLength({min: 10, max: 10})
    ]
], async (req, res) => {
    const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
    try {
        const {name, email, phone, type} = req.body;
        const newContact = new ContactModel({name, email, phone, type, user: req.user.id});
        const contact = await newContact.save();
        res.json(contact);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Update Contact - Private
router.put("/:id", auth, async (req, res) => {
    const {name, email, phone, type} = req.body;

        // Build Contact Object
        const contactField = {}
        if(name) contactField.name = name;
        if(email) contactField.email = email;
        if(phone) contactField.phone = phone;
        if(type) contactField.type = type;

    try {
        const contact = await ContactModel.findById(req.params.id);
        if(!contact) {
            return res.status(404).json({msg: "Contact Not Found"});
        }
        // Make Sure User Own Contact
        if(contact.user.toString() !== req.user.id) {
            return res.status(401).json({msg: "Not Authorized"});
        }

        contact = await ContactModel.findByIdAndUpdate(req.params.id, {
            $set: contactField
        }, {
            new: true
        });
        res.json({contact});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

// Delete Contact - Private
router.delete("/:id", auth, async (req, res) => {
    try {
        let contact = await ContactModel.findById(req.params.id);
		if (!contact) {
            return res.status(404).json({ msg: 'Contact Not Found' });
        }
		// Make Sure User Own Contact
		if (contact.user.toString() !== req.user.id){
            return res.status(401).json({ msg: 'Not Authorized' });
        }

		await ContactModel.findByIdAndRemove(req.params.id);
		res.json({ msg: 'Contact Removed' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;