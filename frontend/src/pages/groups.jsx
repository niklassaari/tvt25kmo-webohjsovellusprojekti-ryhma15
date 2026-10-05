import React,{useState, useEffect} from 'react'
import { useAuth } from '../context/authContext'
import './groups.css'

const Groups = () => {
  const { auth } = useAuth();
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [error, setError] = useState(null)
  const [groupMoviesVisible, setGroupMoviesVisible] = useState(false)
  const [movies, setMovies] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)

  useEffect(() => {
    const fetchGroups = async () => {
        try {
            const response = await fetch('/api/groups/all')
            const data = await response.json()
            if (response.ok) {
                setGroups(data.groups || [])
            } else {
                setError(data.error || 'Error fetching groups')
            }
        } catch (error) {
            console.error('Error fetching groups:', error)
            setError('Network error')
        }
    }

    fetchGroups()
  }, [])
// Create a new group
    const createGroup = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/groups/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${auth.getToken()}`
                },
                body: JSON.stringify({ name: newGroupName })
            })
            const data = await response.json()
            if (response.ok) {
                alert('Group created successfully')
                setGroups([...groups, data.group])
                setNewGroupName('')
            } else {
                setError(data.error || 'Error creating group')
            }
        } catch (error) {
            console.error('Error creating group:', error)
            setError('Network error')
        }
    }
// Get groups favorite movie list, if the user is a member of the group
const showGroupMovies = async (groupId) => {
      setSelectedGroupId(groupId);
      setError(null);
      try {
          const response = await fetch(`/api/groups/${groupId}/movies`)
          const data = await response.json()
          
          if (response.ok) {
              setMovies(data.movies || [])
              setGroupMoviesVisible(true)
          } else {
              setMovies([])
              setGroupMoviesVisible(false)
              setError(data.error || 'Error fetching group movies')
          }
      } catch (error) {
          console.error('Error fetching group movies:', error)
          setError('Network error');
      }
    }
// Add a movie to the selected group
const addMovieToGroup = async (groupId, movieId, movieTitle) => {
    try {
        const response = await fetch(`/api/groups/${groupId}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.getToken()}`
            },
            body: JSON.stringify({ movieId, movieTitle })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Movie added to group successfully')
        } else {
            setError(data.error || 'Error adding movie to group')
        }
    } catch (error) {
        console.error('Error adding movie to group:', error)
        setError('Network error');
    }
}
// Send a request to join a group
const joinGroup = async (groupId) => {
    try {
        const response = await fetch(`/api/groups/request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ groupId })
        });
        const data = await response.json();
        if (response.ok) {
            alert('Request to join group submitted successfully')
        } else {
            setError(data.error || 'Error submitting join request')
        }
    } catch (error) {
        console.error('Error submitting join request:', error)
        setError('Network error');
    }
}

const removeMember = async (groupId, userId) => {
    try {
        const response = await fetch(`/api/groups/member/${groupId}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Member removed from group successfully')
        } else {
            setError(data.error || 'Error removing member from group')
        }
    } catch (error) {
        console.error('Error removing member from group:', error)
        setError('Network error');
    }
}

const leaveGroup = async (groupId) => {
    try {
        const response = await fetch(`/api/groups/member/${groupId}/${auth.getUser().id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${auth.getToken()}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Left group successfully')
        } else {
            setError(data.error || 'Error leaving group')
        }
    } catch (error) {
        console.error('Error leaving group:', error)
        setError('Network error');
    }
}

return (
    <div id="Groups">
      <h1>Groups Page</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {<p>Enter a group name to create a new group.</p>}
        <form onSubmit={createGroup}>
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="Enter group name"
          />
          <button type="submit">Create Group</button>
        </form>

        {/* Display the list of groups and join request buttons */}
        <div style={{ marginTop: '20px' }}>
        <h2>All Groups</h2>
        {groups.length === 0 ? (
          <p>No groups found.</p>
        ) : (
          <ul>
            {groups.map((group) => (
              <li key={group.id || group.group_id} style={{ marginBottom: '10px' }}>
                <span>{group.name}</span>{' '}
                <button onClick={() => showGroupMovies(group.id || group.group_id)}>
                  Show Movies
                </button>
                <button onClick={() => joinGroup(group.id || group.group_id)}>
                  Join Group
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/*button to add a movie to the selected group */}
      {selectedGroupId && (
        <div style={{ marginTop: '20px' }}>
          <h2>Add Movie to Group</h2>
          <form onSubmit={(e) => {
            e.preventDefault();
            addMovieToGroup(selectedGroupId, newMovieId, newMovieTitle);
          }}>
            <input
              type="text"
              value={newMovieTitle}
              onChange={(e) => setNewMovieTitle(e.target.value)}
              placeholder="Enter movie title"
            />
            <button type="submit">Add Movie</button>
          </form>
        </div>
      )}

        {/* Display the list of group favorite movies */}
        {groupMoviesVisible &&
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
    
        {/*Remove member button if remover is owner*/}
        {auth.getUser() && (
            <button onClick={() => removeMember(selectedGroupId, auth.getUser().id)}>
                Remove Member
            </button>
        )}
        {/*Leave group button if user is a member*/}
        {auth.getUser() && (
            <button onClick={() => leaveGroup(selectedGroupId)}>
                Leave Group
            </button>
        )}

    </div>
  )
}


export default Groups