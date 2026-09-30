import React,{useState, useEffect} from 'react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/groups/all');
            const data = await response.json();
            if (response.ok) {
                setGroups(data.groups || []);
            } else {
                setError(data.error || 'Error fetching groups');
            }
        } catch (error) {
            console.error('Error fetching groups:', error);
            setError('Network error');
        }
    };

    fetchGroups();
  }, []);

    const createGroup = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    //Authentication header should be added here so that the backend can identify the user creating the group
                },
                body: JSON.stringify({ name: newGroupName })
            });
            const data = await response.json();
            if (response.ok) {
                alert('Group created successfully');
                setGroups([...groups, data.group]);
                setNewGroupName('');
            } else {
                setError(data.error || 'Error creating group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            setError('Network error');
        }
    };

return (
    <div id="Groups">
      <h1>Groups Page</h1>
      {/* Add your group-related content here */}
        <form onSubmit={createGroup}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <button type="submit">Create Group</button>
        </form>
    </div>
  );

};


export default Groups;