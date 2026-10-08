import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/authContext'
import { SearchMovies } from '../GetMovie.js'
import './groups.css'

const Groups = () => {
  const { user, accessToken, authorizedFetch } = useAuth()
  const [groups, setGroups] = useState([])
  const [newGroupName, setNewGroupName] = useState('')
  const [error, setError] = useState(null)
  const [groupMoviesVisible, setGroupMoviesVisible] = useState(false)
  const [movies, setMovies] = useState([])
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [joinRequests, setJoinRequests] = useState([])
  
  // State for movie search
  const [movieSearchTerm, setMovieSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

const getToken = () => {
    let token = accessToken || localStorage.getItem('accessToken') || localStorage.getItem('token') || ''
    if (!token) {
      try {
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userObj = JSON.parse(userStr)
          token = userObj.accessToken || userObj.token || ''
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e)
      }
    }

    console.log('Retrieved token:', token ? `${token.substring(0, 10)}...` : 'No token found')
    return token
  }

  const getUser = () => {
    if (!user) return null
    return user
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

  // Get groups favorite movie list, and requests if the user is the owner
  const showGroupMovies = async (groupId, groupOwnerId) => {
      setSelectedGroupId(groupId);
      setError(null);
      setSearchResults([]);
      try {
          const response = await fetch(`/api/groups/${groupId}/movies`, {
              headers: {
                  'Authorization': `Bearer ${getToken()}`
              }
          })
          const data = await response.json()
          if (response.ok) {
              setMovies(data.movies || [])
              setGroupMoviesVisible(true)
          
              const currentUser = getUser()
              if (currentUser && currentUser.id === groupOwnerId) {
                  try {
                      const requestsResponse = await fetch(`/api/groups/${groupId}/requests`, {
                          headers: { 'Authorization': `Bearer ${getToken()}` }
                      })
                      const requestsData = await requestsResponse.json()
                      if (requestsResponse.ok) {
                          setJoinRequests(requestsData.requests || [])
                      } else {
                          setJoinRequests([])
                      }
                  } catch (reqErr) {
                      console.error('Error fetching join requests:', reqErr)
                      setJoinRequests([])
                  }
              } else {
                  setJoinRequests([])
              }
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

  // Function for request accept or reject, only the owner can do this
  const handleRequest = async (requestId, action) => {
      try {
          const response = await fetch(`/api/groups/requests/${requestId}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${getToken()}`
              },
              body: JSON.stringify({ action })
          })
          if (response.ok) {
              setJoinRequests(joinRequests.filter(request => request.id !== requestId))
              alert(`Request ${action === 'accept' ? 'accepted' : 'rejected'} successfully`)
          } else {
              const data = await response.json()
              setError(data.error || 'Failed to handle request')
          }
      } catch (error) {
          console.error('Error handling request:', error)
          setError('Network error')
      }
  }

  // Get movie search results from TMDB API
  const handleMovieSearch = async (e) => {
      e.preventDefault()
      if (!movieSearchTerm.trim()) {
          setSearchResults([])
          return
      }

      try {
          const response = await SearchMovies(movieSearchTerm)
          setSearchResults(response || [])
      } catch (err) {
          console.error('Error searching movies:', err)
          setError('Failed to search movies')
      }
  }

  // Add a movie to the selected group
  const addMovieToGroup = async (movieId, movieTitle) => {
      if (!selectedGroupId) return

      const token = getToken()
      console.log('sendable token:', token)

      try {
          const response = await fetch(`/api/groups/${selectedGroupId}/movies`, {
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
              showGroupMovies(selectedGroupId, groups.find(g => (g.id || g.group_id) === selectedGroupId)?.owner_id ?? null)
              setSearchResults([])
              setMovieSearchTerm('')
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
                  'Authorization': `Bearer ${getToken()}`
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
      const user = getUser();
      if (!user) return;
      try {
          const response = await fetch(`/api/groups/member/${groupId}/${user.id}`, {
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
              setGroups(groups.filter(g => (g.id || g.group_id) !== groupId));
              setSelectedGroupId(null);
          } else {
              setError(data.error || 'Error deleting group')
          }
      } catch (error) {
          console.error('Error deleting group:', error)
          setError('Network error');
      }
  }
 
  return (
    <div id="Groups">
      <h1>Groups Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Enter a group name to create a new group.</p>
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
                <button onClick={() => showGroupMovies(group.id || group.group_id, group.owner_id)}>
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

      {/* Display join requests if the user is the owner of the selected group */}
      {selectedGroupId && joinRequests.length > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid orange', paddingTop: '10px' }}>
            <h3>Join Requests</h3>
            <ul>
              {joinRequests.map((request) => (
                <li key={request.id || request.request_id} style={{ marginBottom: '8px' }}>
                  <span>{request.username}</span>
                  <button
                    onClick={() => handleRequest(request.id || request.request_id, 'accept')}
                    style={{ marginLeft: '10px', backgroundColor: 'green', color: 'white' }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRequest(request.id || request.request_id, 'reject')}
                    style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                  >
                    Reject
                  </button>
                </li>
              ))}
            </ul>
          </div>
      )}

      {/* Button to add a movie to the selected group */}
      {selectedGroupId && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2>Search and Add Movie to Selected Group</h2>
          <form onSubmit={handleMovieSearch}>
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
                    <button onClick={() => addMovieToGroup(movie.id, movie.title)}>
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
    
      {/* Group management buttons */}
      {selectedGroupId && (
        <div style={{ marginTop: '20px' }}>
            {getUser() && (
                <button onClick={() => removeMember(selectedGroupId, getUser().id)}>
                    Remove Member
                </button>
            )}

            {getUser() && Number(getUser().id) === Number(groups.find(g => (g.id || g.group_id) === selectedGroupId)?.owner_id) && (
              <button onClick={() => deleteGroup(selectedGroupId)} style={{ marginLeft: '10px' }}>
                Delete Group
              </button>
            )}

            {getUser() && (
                <button onClick={() => leaveGroup(selectedGroupId)} style={{ marginLeft: '10px' }}>
                    Leave Group
                </button>
            )}
        </div>
      )}
    </div>
  )
}

export default Groups