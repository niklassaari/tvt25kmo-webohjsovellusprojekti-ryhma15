import React,{useState, useEffect} from 'react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [error, setError] = useState(null);
  const [getGroupMovies, setSelectedGroupMovies] = useState(false);
  const [movies, setMovies] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

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
            const response = await fetch('/api/groups/add', {
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
// Get groups favorite movie list, if the user is a member of the group
    const getGroupMovies = async (groupId) => {
        setSelectedGroupId(groupId);
        try {
            const response = await fetch(`/api/groups/${groupId}/movies`);
            const data = await response.json();
            if (!response.ok) {
                setMovies(data.movies || []);
                setSelectedGroupMovies(true);
            } else {
                setMovies([]);
                setSelectedGroupMovies(false);
                setError(data.error || 'Error fetching group movies');
            }
        }   catch (error) {
            console.error('Error fetching group movies:', error);
            setError('Network error');
        }
    };

return (
    <div id="Groups">
      <h1>Groups Page</h1>
        <form onSubmit={createGroup}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <button type="submit">Create Group</button>
        </form>

        {selectedGroupMovies &&
            <div>
                <h2>Group favorite movies</h2>
                {movies.length === 0 ? (
                    <p>No favorite movies found.</p>
                ) : (
                    <ul>
                        {movies.map((movie, index) => (
                            <li key={index}>{movie.title}</li>
                        ))}
                    </ul>
                )}
            </div>
        }
    </div>
  );
};

export default Groups;