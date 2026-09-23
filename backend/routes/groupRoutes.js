import router from 'express';
import {
    addGroups,
    deleteGroup
} from '../controllers/groupController'
//Ryhmän luonti ja poisto
const groupRouter = router.Router();
groupRouter.post('/add', addGroups);
groupRouter.delete('/delete/:id', deleteGroup);