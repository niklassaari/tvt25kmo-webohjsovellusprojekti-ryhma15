import db from '../models/database.js';


//Ryhmän luonti tietokantaan
export const createGroup = async (groupName, ownerId) => {
    const result = await db.query(
        'INSERT INTO moviegroups (name, owner_id) VALUES ($1, $2) RETURNING id',
        [groupName, ownerId]
    );
    return result.rows[0].id;
}
//Hakee ryhmän omistajan ID:n
export const getGroupOwner = async (groupId) => {
    const result = await db.query(
        'SELECT owner_id FROM moviegroups WHERE id = $1',
        [groupId]
    );
    return result.rows[0] ? result.rows[0].owner_id : null;
}
//Hakee kaikki ryhmät
export const getAllGroups = async () => {
    const result = await db.query('SELECT * FROM moviegroups');
    return result.rows;
}
//Hakee ryhmän ID:n perusteella
export const getGroupById = async (id) => {
    const result = await db.query('SELECT * FROM moviegroups WHERE id = $1', [id]);
    return result.rows[0];
}
//Päivittää ryhmän nimen ID:n perusteella
export const updateGroup = async (id, groupName) => {
    const result = await db.query('UPDATE moviegroups SET name = $1 WHERE id = $2', [groupName, id]);
    return result.rowCount > 0;
}
//Poistaa ryhmän ID:n perusteella
export const deleteGroup = async (id) => {
    const result = await db.query('DELETE FROM moviegroups WHERE id = $1', [id]);
    return result.rowCount > 0;
}
//Lisää käyttäjän ryhmään ja määrittää roolin
export const groupRole = async (groupId, userId, role) => {
    const result = await db.query(
        'INSERT INTO group_members (group_id, user_id, role) VALUES ($1, $2, $3) RETURNING id',
         [groupId, userId, role]
    );
    return result.rows[0].id;
}
//Hakee ryhmät nimellä
export const getGroupsByName = async (name) => {
    const result = await db.query('SELECT * FROM moviegroups WHERE name ILIKE $1', [`%${name}%`]);
    return result.rows;
}
// Luo ryhmäpyyntö tietokantaan
export const createGroupRequest = async (groupId, userId) => {
    try {
        const result = await db.query(
            'INSERT INTO group_requests (group_id, user_id) VALUES ($1, $2) RETURNING id',
            [groupId, userId]
        );
        return result.rows[0].id;
    }  catch (err) {
        if (err.code === '23505') {
            throw new Error('Group request already exists');
        }
        throw err;
    }
};