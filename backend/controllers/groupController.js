
const groupModel = require('../models/groupModel');
//Ryhmän luonti/ownerId tallennetaan tietokantaan
const addGroups = async (req, res,) => {
    try {
        const {name}=req.body;
        const ownerId=req.user.id;
        if(!name){
            return res.status(400).json({error:"Group name is required"});
        }

        const groupId = await groupModel.createGroup(name, ownerId);
        res.status(201).json({message:"Group created successfully", groupId});
    } catch (err) {
        res.status(500).json({error:"Failed to create group", details: err.message});
    }
};

//tarkistetaan ryhmän poistoon onko pyynnön tekijä owner
const deleteGroup = async (req, res, next) => {
    try {
        const groupId = req.params.id;
        const userId = req.user.id;
        const ownerId = await groupModel.getGroupOwner(groupId);

        if (!ownerId) {
            return res.status(404).json({ error: "Group not found" });
        }

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" });
        }

        await groupModel.deleteGroup(groupId);
        res.status(200).json({ message: "Group deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete group", details: err.message });
    }
};

module.exports = {
    addGroups,
    deleteGroup
};