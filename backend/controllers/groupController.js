import * as groupModel from '../models/groupModel.js'

// Create a group / ownerId is saved to the database
export const addGroups = async (req, res) => {
    try {
        const { name } = req.body
        const ownerId = req.user.id
        if (!name) {
            return res.status(400).json({ error: "Group name is required" })
        }

        const groupId = await groupModel.createGroup(name, ownerId)
        await groupModel.groupRole(groupId, ownerId, 'owner')

        res.status(201).json({ message: "Group created successfully", groupId })
    } catch (err) {
        console.error('Error creating group:', err)
        res.status(500).json({ error: "Failed to create group", details: err.message })
    }
};

// Check if the requester is the owner before deleting the group
export const deleteGroup = async (req, res) => {
    try {
        const groupId = req.params.id
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (!ownerId) {
            return res.status(404).json({ error: "Group not found" })
        }

        if (Number(userId) !== Number(ownerId)) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        await groupModel.deleteGroup(groupId)
        res.status(200).json({ message: "Group deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to delete group", details: err.message })
    }
};

// Update group name if the requester is the owner
export const updateGroup = async (req, res) => {
    try {
        const { name } = req.body
        const groupId = req.params.id
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (Number(userId) !== Number(ownerId)) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        if (!name) {
            return res.status(400).json({ error: "Group name is required" })
        }

        const groupUpdated = await groupModel.updateGroup(groupId, name)
        if (!groupUpdated) {
            return res.status(404).json({ error: "Group not found" })
        }

        res.status(200).json({ message: "Group updated successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to update group", details: err.message })
    }
};

// Fetch all groups with or without a name filter
export const getAllGroups = async (req, res) => {
    try {
        const { name } = req.query
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

// Add a user to a group and assign a role
export const groupRole = async (req, res) => {
    try {
        const { groupId, userId, role = 'member' } = req.body
        if (!groupId || !userId || !role) {
            return res.status(400).json({ error: "Group ID, User ID, and Role are required" })
        }

        await groupModel.groupRole(groupId, userId, role)
        res.status(201).json({ message: "User added to group successfully" })
    } catch (err) {
        res.status(500).json({ error: "Failed to add user to group", details: err.message })
    }
};

// Create a join request for a group
export const createGroupRequest = async (req, res) => {
    try {
        const { groupId } = req.body
        const userId = req.user.id

        const ownerId = await groupModel.getGroupOwner(groupId)
        if (Number(userId) === Number(ownerId)) {
            return res.status(400).json({ error: "You are the owner of this group" })
        }

        await groupModel.createGroupRequest(groupId, userId)
        res.status(201).json({ message: "Group request created successfully" })
    } catch (err) {
        if (err.message === 'Group request already exists') {
            return res.status(400).json({ error: err.message })
        }
        res.status(500).json({ error: "Failed to create group request", details: err.message })
    }
};

// Remove a member from a group, check if the requester is the owner or the user themselves
export const removeMember = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userIdToRemove = req.params.userId
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (Number(userId) !== Number(ownerId) && Number(userId) !== Number(userIdToRemove)) {
            return res.status(403).json({ error: "You are not authorized to remove this member" })
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

// Fetch user's groups
export const getUserGroups = async (req, res) => {
    try {
        const { username } = req.params;
        const groups = await groupModel.getUserGroups(username);

        res.status(200).json({ groups });
    } catch (err) {
        console.error('Error fetching user groups:', err);
        res.status(500).json({
            error: "Failed to fetch user groups",
            details: err.message
        });
    }
};

// Fetch group movies
export const getGroupMovies = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const userId = req.user.id

        // Check if the user is the owner or a member
        const ownerId = await groupModel.getGroupOwner(groupId)
        const members = await groupModel.getGroupMembers(groupId)
        const isOwner = Number(userId) === Number(ownerId)
        const isMember = members.some(m => Number(m.user_id) === Number(userId));

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: "You must be a member or owner to view this group's movies" })
        }
        // Get movies after checking if the user belongs to the group
        const movies = await groupModel.getGroupMovies(groupId)
        res.status(200).json({ movies })
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch group movies", details: err.message });
    }
};

// Add a movie to a group
export const addMovieToGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.id
        const { movieId, movieTitle } = req.body

        if (!movieTitle) {
            return res.status(400).json({ error: "Movie title is required" })
        }

        //check if the user is Member or the owner
        const ownerId = await groupModel.getGroupOwner(groupId)
        const members = await groupModel.getGroupMembers(groupId)
        const isOwner = Number(userId) === Number(ownerId)
        const isMember = members.some(m => Number(m.user_id) === Number(userId))

        if (!isOwner && !isMember) {
            return res.status(403).json({ error: "You must be a member or owner to add movies to this group" })
        }

        const newMovie = await groupModel.addMovieToGroup(groupId, userId, movieId, movieTitle)
        res.status(201).json({ message: "Movie added to group successfully", movie: newMovie })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(400).json({ error: "Movie already exists in the group" })
        }
        res.status(500).json({ error: "Failed to add movie to group", details: err.message })
    }
};

// Fetch group requests
export const getGroupRequests = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const userId = req.user.id
        const ownerId = await groupModel.getGroupOwner(groupId)

        if (Number(userId) !== Number(ownerId)) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }
        const requests = await groupModel.getGroupRequests(groupId)
        res.status(200).json({ requests })
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch group requests", details: err.message })
    }
};

// Handle group request status updates
export const updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.requestId
        const { action, status } = req.body
        const decision = action || status
        const userId = req.user.id

        const request = await groupModel.getGroupRequestById(requestId)
        if (!request) {
            return res.status(404).json({ error: "Request not found" })
        }

        const ownerId = await groupModel.getGroupOwner(request.group_id)
        if (Number(userId) !== Number(ownerId)) {
            return res.status(403).json({ error: "You are not the owner of this group" })
        }

        if (decision === 'accept' || decision === 'Approved') {
            await groupModel.updateRequestStatus(requestId, 'Approved')
            await groupModel.groupRole(request.group_id, request.user_id, 'member')
            return res.status(200).json({ message: "Request accepted and user added to group" })
        } else if (decision === 'reject' || decision === 'Rejected') {
            await groupModel.updateRequestStatus(requestId, 'Rejected')
            return res.status(200).json({ message: "Request rejected" })
        } else {
            return res.status(400).json({ error: 'Invalid action.' })
        }
    } catch (err) {
        res.status(500).json({ error: "Failed to update request status", details: err.message })
    }
};

// Fetch group members
export const getGroupMembers = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const members = await groupModel.getGroupMembers(groupId)
        res.status(200).json({ members });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch group members", details: err.message })
    }
};