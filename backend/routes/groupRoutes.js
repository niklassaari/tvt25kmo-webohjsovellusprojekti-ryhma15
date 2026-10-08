import express from 'express'
import { authenticateToken } from '../middleware/auth.js'
import {
    addGroups,
    deleteGroup,
    updateGroup,
    getAllGroups,
    groupRole,
    createGroupRequest,
    removeMember,
    getGroupMovies,
    addMovieToGroup,
    getGroupRequests,
    updateRequestStatus
} from '../controllers/groupController.js'

const groupRouter = express.Router()

groupRouter.post('/add', authenticateToken, addGroups)
groupRouter.delete('/delete/:id', authenticateToken, deleteGroup)
groupRouter.put('/update/:id', authenticateToken, updateGroup)
groupRouter.get('/all', getAllGroups)
groupRouter.post('/role', authenticateToken, groupRole)
groupRouter.post('/request', authenticateToken, createGroupRequest)
groupRouter.delete('/member/:groupId/:userId', authenticateToken, removeMember)
groupRouter.get('/:groupId/movies', authenticateToken, getGroupMovies)
groupRouter.post('/:groupId/movies', authenticateToken, addMovieToGroup)
groupRouter.get('/:groupId/requests', authenticateToken, getGroupRequests)
groupRouter.post('/requests/:requestId', authenticateToken, updateRequestStatus)
groupRouter.get('/:groupId/members', authenticateToken, getGroupMembers)

export default groupRouter