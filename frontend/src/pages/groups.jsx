import React,{useState, useEffect} from 'react'
import { useAuth } from '../context/authContext'
import { SearchMovies } from '../GetMovie';
import './groups.css'

const Groups = () => {
  const { auth } = useAuth ? useAuth() : { auth: null };
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [error, setError] = useState(null)
  const [groupMoviesVisible, setGroupMoviesVisible] = useState(false)
  const [movies, setMovies] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [newMovieId] = useState('')
  const [newMovieTitle, setNewMovieTitle] = useState('')

  const [movieSearchTerm, setMovieSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const getToken = () => {
    if (!auth) return '';
    if (typeof auth.getToken === 'function') return auth.getToken();
    return auth.Token;
    };

  const getUser = () => {
    if (!auth) return null;
    if (typeof auth.getUser === 'function') return auth.getUser();
    return auth.User || auth
  }

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
                    'Authorization': `Bearer ${getToken()}`
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
      setSearchResults([]);
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
//Get movie search results from TMDB API
const handleMovieSearch = async (e) => {
    e.preventDefault()
    if (!movieSearchTerm.trim()) {
        setSearchResults([])
        return
    }

    try {
        const response = await SearchMovies(movieSearchTerm)
        setSearchResults(response.movies || [])
    } catch (err) {
        console.error('Error searching movies:', err)
        setError('Failed to search movies')
    }
}

// Add a movie to the selected group
const addMovieToGroup = async (groupId, movieId, movieTitle) => {
    try {
        const response = await fetch(`/api/groups/${groupId}/movies`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify({ movieId, movieTitle })
        });
        const data = await response.json();
        if (response.ok) {
            alert(`"${movieTitle}" added to group successfully`)
            showGroupMovies(groupId) // Refresh the group movies list after adding
            setSearchResults([]) // Clear search results after adding
            setMovieSearchTerm('') // Clear search term after adding
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
// Remove a member from the group
const removeMember = async (groupId, userId) => {
    try {
        const response = await fetch(`/api/groups/member/${groupId}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
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
// Leave the group
const leaveGroup = async (groupId) => {
    try {
        const response = await fetch(`/api/groups/member/${groupId}/${getUser().id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
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
// Remove the group, only the owner can do this
const deleteGroup = async (groupId) => {
    try {
        const response = await fetch(`/api/groups/delete/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            alert('Group deleted successfully')
        } else {
            setError(data.error || 'Error deleting group')
        }
    } catch (error) {
        console.error('Error deleting group:', error)
        setError('Network error');
    }
}
 
return (
    <div id="Groups"> {/*create a new group*/}
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
        {(!groups || groups.filter(Boolean).length === 0) ? (
          <p>No groups found.</p>
        ) : (
          <ul>
            {groups.filter(Boolean).map((group) => (
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
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2>Search and Add Movie to Selected Group</h2>
          <form onSubmit={handleSearchTMDB}>
            <input
              type="text"
              value={movieSearchTerm}
              onChange={(e) => setMovieSearchTerm(e.target.value)}
              placeholder="Search movie title from TMDB..."
            />
            <button type="submit">Search TMDB</button>
          </form>

          {/* TMDB search results */}
          {searchResults.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <h3>Search Results:</h3>
              <ul>
                {searchResults.map((movie) => (
                  <li key={movie.id} style={{ marginBottom: '5px' }}>
                    {movie.title} ({movie.release_date?.slice(0, 4) || 'N/A'}){' '}
                    <button onClick={() => addMovieToGroup(movie.title, movie.id)}>
                      + Add to Group
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

        {/* Display the list of group favorite movies */}
        {groupMoviesVisible && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
            <h2>Group Favorite Movies</h2>
            {movies.length === 0 ? (
                <p>No favorite movies found in this group.</p>
            ) : (
                <ul>
                    {movies.map((movie, index) => (
                        <li key={index}>
                            {movie.movie_title || movie.title}
                        </li>
                    ))}
                </ul>
            )}
        </div>
      )}
    
        {/*Remove member button if remover is owner*/}
        {auth?.getUser() && (
            <button onClick={() => removeMember(selectedGroupId, auth.getUser().id)}>
                Remove Member
            </button>
        )}

        {/*Delete group button if user is owner*/}
        {auth?.getUser() && auth.getUser().is_owner && (
            <button onClick={() => deleteGroup(selectedGroupId)}>
                Delete Group
            </button>
        )}

        {/*Leave group button if user is a member*/}
        {auth?.getUser() && (
            <button onClick={() => leaveGroup(selectedGroupId)}>
                Leave Group
            </button>
        )}

    </div>
  )
}


export default Groups