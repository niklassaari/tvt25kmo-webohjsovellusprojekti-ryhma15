const db = require('../db');
//Ryhmän luonti tietokantaan
const createGroup = async (groupName, ownerId) => {
    const [result] = await db.query(
        'INSERT INTO groups (group_name, owner_id) VALUES (?, ?)',
        [groupName, ownerId]
    );
    return result.insertId;

    await db.query(
        'INSERT INTO group_members (group_id, user_id) VALUES (?, ?)',
        [groupId, ownerId]
    );
    return groupId;
}
//Hakee ryhmän omistajan ID:n
const getGroupOwner = async (groupId) => {
    const [rows] = await db.query(
        'SELECT owner_id FROM groups WHERE id = ?',
        [groupId]
    );
    return rows[0] ? rows[0].owner_id : null;
}
//Hakee kaikki ryhmät
const getAllGroups = async () => {
    const [rows] = await db.query('SELECT * FROM groups');
    return rows;
}
//Hakee ryhmän ID:n perusteella
const getGroupById = async (id) => {
    const [rows] = await db.query('SELECT * FROM groups WHERE id = ?', [id]);
    return rows[0];
}
//Päivittää ryhmän nimen ja omistajan ID:n
const updateGroup = async (id, groupName, ownerId) => {
    const [result] = await db.query(
        'UPDATE groups SET group_name = ?, owner_id = ? WHERE id = ?',
        [groupName, ownerId, id]
    );
    return result.affectedRows > 0;
}
//Poistaa ryhmän ID:n perusteella
const deleteGroup = async (id) => {
    const [result] = await db.query('DELETE FROM groups WHERE id = ?', [id]);
    return result.affectedRows > 0;
}

module.exports = {
    createGroup,
    getGroupOwner,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup
};
