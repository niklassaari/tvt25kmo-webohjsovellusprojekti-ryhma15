
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
const deleteGroup = async (req, res,) => {
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

//päivitetään ryhmän nimi jos pyynnön tekijä on owner
const updateGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const groupId = req.params.id;
        const userId = req.user.id;
        const ownerId = await groupModel.getGroupOwner(groupId);

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" });
        }

        if (!name){
            return res.status(400).json({error:"Group name is required"});
        }

        const groupUpdated = await groupModel.updateGroup(name);
        if (!groupUpdated){
            return res.status(404).json({error:"Group not found"});
        }

        res.status(200).json({ message: "Group updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update group", details: err.message });
    }
};

//Hakee kaikki ryhmät
const getAllGroups = async (req, res) => {
    try {
        const {name} = req.query;
        let groups;
        if (name) {
            groups = await groupModel.getGroupsByName(name);
        } else {
            groups = await groupModel.getAllGroups();
        }
        res.status(200).json({ groups });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch groups", details: err.message });
    }
};

module.exports = {
    addGroups,
    deleteGroup,
    updateGroup,
    getAllGroups
};