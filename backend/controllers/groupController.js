
import * as groupModel from '../models/groupModel.js';
//Ryhmän luonti/ownerId tallennetaan tietokantaan
export const addGroups = async (req, res,) => {
    try {
        const {name} = req.body;
        const ownerId = 1; //req.user.id;
        if(!name){
            return res.status(400).json({error:"Group name is required"});
        }

        const groupId = await groupModel.createGroup(name, ownerId);
        res.status(201).json({message:"Group created successfully", groupId});
    } catch (err) {
        console.error('Error creating group:', err);
        res.status(500).json({error:"Failed to create group", details: err.message});
    }
};

//tarkistetaan ryhmän poistoon onko pyynnön tekijä owner
export const deleteGroup = async (req, res,) => {
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
export const updateGroup = async (req, res) => {
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

        const groupUpdated = await groupModel.updateGroup(groupId, name);
        if (!groupUpdated){
            return res.status(404).json({error:"Group not found"});
        }

        res.status(200).json({ message: "Group updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to update group", details: err.message });
    }
};

//Hakee kaikki ryhmät nimellä tai ilman nimeä, jos nimeä ei annettu hakee kaikki ryhmät
export const getAllGroups = async (req, res) => {
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

//lisätään käyttäjä ryhmään ja määritetään rooli
export const groupRole = async (req, res) => {
    try {
        const { groupId, userId, role ='member'} = req.body;
        if (!groupId || !userId || !role) {
            return res.status(400).json({ error: "Group ID, User ID, and Role are required" });
        }

        await groupModel.groupRole(groupId, userId, role);
        res.status(201).json({ message: "User added to group successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to add user to group", details: err.message });
    }
};

// Luo ryhmäpyyntö
export const createGroupRequest = async (req, res) => {
    try {
        const { groupId } = req.body;
        const userId = req.user.id;

        await groupModel.createGroupRequest(groupId, userId);
        res.status(201).json({ message: "Group request created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to create group request", details: err.message });
    }
};

//Jäsenen poisto ryhmästä, tarkistetaan onko pyynnön tekijä owner
export const removeMember = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userIdToRemove = req.params.userId;
        const userId = req.user.id;
        const ownerId = await groupModel.getGroupOwner(groupId);

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" });
        }

        await groupModel.removeMember(groupId, userIdToRemove);
        res.status(200).json({ message: "Member removed from group successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to remove member from group", details: err.message });
    }
};

// lisätään ryhmään elokuva
export const getGroupMovies = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const {movie_id, movie_title} = req.body;

        if (!movie_title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const groupMovies = await groupModel.getGroupMovies(groupId);
        res.status(200).json({ message: "movie added successfully", groupMovies });
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Movie already exists in the group" });
        }
        res.status(500).json({ error: "Failed to fetch group movies", details: err.message });
    }
};
