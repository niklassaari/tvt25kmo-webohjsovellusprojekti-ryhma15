const db = require('../db');


//Ryhmän luonti tietokantaan
const createGroup = async (groupName, ownerId) => {
    const [result] = await db.query(
        'INSERT INTO groups (group_name, owner_id) VALUES (?, ?)',
        [groupName, ownerId]
    );
    return result.insertId;
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
//Päivittää ryhmän nimen ID:n perusteella
const updateGroup = async (id, groupName) => {
    const [result] = await db.query('UPDATE groups SET group_name = ? WHERE id = ?', [groupName, id]);
    return result.affectedRows > 0;
}
//Poistaa ryhmän ID:n perusteella
const deleteGroup = async (id) => {
    const [result] = await db.query('DELETE FROM groups WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
//Lisää käyttäjän ryhmään ja määrittää roolin
const groupRole = async (groupId, userId, role) => {
    const [result] = await db.query('INSERT INTO group_members (group_id, user_id, role) VALUES (?, ?, ?)', [groupId, userId, role]);
    return result.insertId;
};

module.exports = {
    createGroup,
    getGroupOwner,
    getAllGroups,
    getGroupById,
    updateGroup,
    deleteGroup,
    groupRole
};
