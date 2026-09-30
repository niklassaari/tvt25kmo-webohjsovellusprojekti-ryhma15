import router from 'express'
import {
    addGroups,
    deleteGroup,
    updateGroup,
    getAllGroups,
    groupRole,
    createGroupRequest,
    removeMember
} from '../controllers/groupController'
//Ryhmän luonti, haku, päivitys ja poisto
const groupRouter = router.Router()
groupRouter.post('/add', addGroups)
groupRouter.delete('/delete/:id', deleteGroup)
groupRouter.put('/update/:id', updateGroup)
groupRouter.get('/all', getAllGroups)
groupRouter.post('/role', groupRole)
groupRouter.post('/request', createGroupRequest)
groupRouter.delete('/member/:groupId/:userId', removeMember)

export default groupRouter;