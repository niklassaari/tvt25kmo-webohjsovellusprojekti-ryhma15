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
    addMovieToGroup
} from '../controllers/groupController.js'

const groupRouter = express.Router()

groupRouter.post('/add', addGroups)
groupRouter.delete('/delete/:id', authenticateToken, deleteGroup)
groupRouter.put('/update/:id', authenticateToken, updateGroup)
groupRouter.get('/all', getAllGroups)
groupRouter.post('/role', authenticateToken, groupRole)
groupRouter.post('/request', authenticateToken, createGroupRequest)
groupRouter.delete('/member/:groupId/:userId', authenticateToken, removeMember)
groupRouter.get('/movies/:groupId', authenticateToken, getGroupMovies)
groupRouter.post('/movies/:groupId', authenticateToken, addMovieToGroup)

export default groupRouter