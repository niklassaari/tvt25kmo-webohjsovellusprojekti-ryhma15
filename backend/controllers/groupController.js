
import * as groupModel from '../models/groupModel.js'

//Ryhmän luonti/ownerId tallennetaan tietokantaan
export const addGroups = async (req, res,) => {
    try {
        const {name} = req.body
        const ownerId = req.user.id
        if(!name){
            return res.status(400).json({error:"Group name is required"})
        }

        const groupId = await groupModel.createGroup(name, ownerId)

        await groupModel.groupRole(groupId, ownerId, 'owner')

        res.status(201).json({message:"Group created successfully", groupId})
    } catch (err) {
        console.error('Error creating group:', err)
        res.status(500).json({error:"Failed to create group", details: err.message})
    }
};

//tarkistetaan ryhmän poistoon onko pyynnön tekijä owner
export const deleteGroup = async (req, res,) => {
    try {
        const groupId = req.params.id
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (!ownerId) {
            return res.status(404).json({ error: "Group not found" })
        }

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        await groupModel.deleteGroup(groupId)
        res.status(200).json({ message: "Group deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete group", details: err.message })
    }
};

//päivitetään ryhmän nimi jos pyynnön tekijä on owner
export const updateGroup = async (req, res) => {
    try {
        const { name } = req.body
        const groupId = req.params.id
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        if (!name){
            return res.status(400).json({error:"Group name is required"})
        }

        const groupUpdated = await groupModel.updateGroup(groupId, name)
        if (!groupUpdated){
            return res.status(404).json({error:"Group not found"})
        }

        res.status(200).json({ message: "Group updated successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to update group", details: err.message })
    }
};

//Hakee kaikki ryhmät nimellä tai ilman nimeä, jos nimeä ei annettu hakee kaikki ryhmät
export const getAllGroups = async (req, res) => {
    try {
        const {name} = req.query
        let groups
        if (name) {
            groups = await groupModel.getGroupsByName(name)
        } else {
            groups = await groupModel.getAllGroups()
        }
        res.status(200).json({ groups })
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch groups", details: err.message })
    }
};

//lisätään käyttäjä ryhmään ja määritetään rooli
export const groupRole = async (req, res) => {
    try {
        const { groupId, userId, role ='member'} = req.body
        if (!groupId || !userId || !role) {
            return res.status(400).json({ error: "Group ID, User ID, and Role are required" })
        }

        await groupModel.groupRole(groupId, userId, role)
        res.status(201).json({ message: "User added to group successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to add user to group", details: err.message })
    }
};

// Luo ryhmään liittymis pyyntö
export const createGroupRequest = async (req, res) => {
    try {
        const { groupId } = req.body
        const userId = req.user.id

        await groupModel.createGroupRequest(groupId, userId)
        res.status(201).json({ message: "Group request created successfully" })
    } catch (err) {
        if (err.message === 'Group request already exists') {
            return res.status(400).json({ error: err.message })
        }
        res.status(500).json({ error: "Failed to create group request", details: err.message })
    }
};

//Jäsenen poisto ryhmästä, tarkistetaan onko pyynnön tekijä owner
export const removeMember = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userIdToRemove = req.params.userId
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (userId !== ownerId && userId !== parseInt(userIdToRemove)) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }
        const removed = await groupModel.removeMember(groupId, userIdToRemove)
        if (!removed) {
            return res.status(404).json({ error: "Member not found in the group" })
        }

        res.status(200).json({ message: "Member removed from group successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to remove member from group", details: err.message })
    }
};

// Hakee ryhmän elokuvat
export const getGroupMovies = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const movies = await groupModel.getGroupMovies(groupId);
        res.status(200).json({ movies });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch group movies", details: err.message });
    }
};

// Lisää elokuva ryhmään
export const addMovieToGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.id
        const { movieTitle } = req.body

        if (!movieTitle) {
            return res.status(400).json({ error: "Movie title is required" })
        }

        const newMovie =await groupModel.addMovieToGroup(groupId, userId, movieTitle)
        res.status(201).json({ message: "Movie added to group successfully", movie: newMovie })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Movie already exists in the group" })
        }
        res.status(500).json({ error: "Failed to add movie to group", details: err.message })
    }
};

// Hakee ryhmän hakemukset
export const getGroupRequests = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }
        const requests = await groupModel.getGroupRequests(groupId)
        res.status(200).json({ requests })
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch group requests", details: err.message })
    }
};

// käsittelee ryhmän hakemuksen tilan päivityksen
export const updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId
        const { action, status } = req.body
        const desicion = action || status
        const userId = req.user.id

        const request = await groupModel.getGroupRequestById(requestId)
        if (!request) {
            return res.status(404).json({ error: "Request not found" })
        }

        const ownerId = await groupModel.getGroupOwner(request.group_id)
        if (userId !== ownerId) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        if (action === 'accept') {
            await groupModel.updateGroupRequestStatus(requestId, 'Approved')
            await groupModel.groupRole(request.group_id, request.user_id, 'member')
            res.status(200).json({ message: "Request accepted and user added to group" })
        } else if (action === 'reject') {
            await groupModel.updateGroupRequestStatus(requestId, 'Rejected')
            res.status(200).json({ message: "Request rejected" })
        } else {
            res.status(400).json({ error: 'Invalid action.' })
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update request status", details: err.message })
    }
};
