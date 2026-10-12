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
  const [members, setMembers] = useState([])
  
  // State for movie search
  const [movieSearchTerm, setMovieSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])

  const getToken = () => accessToken || ''
  const getUser = () => user

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
      const response = await authorizedFetch('/api/groups/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
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
 const showGroupMovies = async (groupId) => {
    setSelectedGroupId(groupId)
    setError(null)
    setSearchResults([])
    setJoinRequests([])
    setMembers([])

    try {
      const response = await authorizedFetch(`/api/groups/${groupId}/movies`)
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
      setError('Network error')
    }

    // Fetch group members
    try {
      const response = await authorizedFetch(`/api/groups/${groupId}/members`)
      const data = await response.json()
      if (response.ok) {
        setMembers(data.members || [])
      } else {
        setError(data.error || 'Error fetching group members')
      }
    } catch (error) {
      console.error('Error fetching group members:', error)
      setError('Network error')
    }
  }
  // Function for request accept or reject, only the owner can do this
  const handleRequest = async (requestId, action) => {
    try {
      const response = await authorizedFetch(`/api/groups/requests/${requestId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      })
      if (response.ok) {
        setJoinRequests(prevRequests =>
          prevRequests.filter(request => {
            const currentReqId = request.id ?? request.request_id
            return String(currentReqId) !== String(requestId)
          })
        )

        // Update the members list if the request was accepted
        if (action === 'accept'&& selectedGroupId) {
          const memResponse = await authorizedFetch(`/api/groups/${selectedGroupId}/members`)
          const memData = await memResponse.json()
          if (memResponse.ok) setMembers(memData.members || [])
        }

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
      setSearchResults((response || []).filter(movie => movie.media_type !== 'tv'))
    } catch (err) {
      console.error('Error searching movies:', err)
      setError('Failed to search movies')
    }
  }

  // Add a movie to the selected group
  const addMovieToGroup = async (movieId, movieTitle) => {
    if (!selectedGroupId) return

    try {
      const response = await authorizedFetch(`/api/groups/${selectedGroupId}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ movieId, movieTitle })
      })
      const data = await response.json()
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
      setError('Network error')
    }
  }

  // Send a request to join a group
  const joinGroup = async (groupId) => {
    try {
      const response = await authorizedFetch(`/api/groups/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ groupId })
      })
      const data = await response.json()
      if (response.ok) {
        alert('Request to join group submitted successfully')
      } else {
        setError(data.error || 'Error submitting join request')
      }
    } catch (error) {
      console.error('Error submitting join request:', error)
      setError('Network error')
    }
  }

  // Fetch join requests for the selected group, only the owner can do this
  const fetchJoinRequests = async (groupId) => {
    setError(null)
    try {
      const response = await authorizedFetch(`/api/groups/${groupId}/requests`)
      const data = await response.json()
      if (response.ok) {
        const fetchedRequests = Array.isArray(data.requests)
          ? data.requests
          : (Array.isArray(data) ? data : [])
        setJoinRequests(fetchedRequests)
        if (fetchedRequests.length === 0) {
          alert('No new requests for this group.')
        }
      } else {
        setError(data.error || 'Error fetching join requests')
      }
    } catch (err) {
      console.error('Error fetching join requests:', err)
      setError('Network error')
    }
  }

  // Remove a member from the group
  const removeMember = async (groupId, userId) => {
    try {
      const response = await authorizedFetch(`/api/groups/member/${groupId}/${userId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (response.ok) {
        alert('Member removed from group successfully')
      } else {
        setError(data.error || 'Error removing member from group')
      }
    } catch (error) {
      console.error('Error removing member from group:', error)
      setError('Network error')
    }
  }

  // Leave the group
  const leaveGroup = async (groupId) => {
    const userObj = getUser()
    if (!userObj) return
    try {
      const response = await authorizedFetch(`/api/groups/member/${groupId}/${userObj.id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (response.ok) {
        alert('Left group successfully')
      } else {
        setError(data.error || 'Error leaving group')
      }
    } catch (error) {
      console.error('Error leaving group:', error)
      setError('Network error')
    }
  }

  // Remove the group, only the owner can do this
  const deleteGroup = async (groupId) => {
    try {
      const response = await authorizedFetch(`/api/groups/delete/${groupId}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (response.ok) {
        alert('Group deleted successfully')
        setGroups(groups.filter(g => (g.id || g.group_id) !== groupId))
        setSelectedGroupId(null)
      } else {
        setError(data.error || 'Error deleting group')
      }
    } catch (error) {
      console.error('Error deleting group:', error)
      setError('Network error')
    }
  }

  // Check if the current user is the owner of the selected group
  const currentUser = getUser()
  const currentUserId = currentUser?.id ?? currentUser?.user_id ?? currentUser?.sub
  const selectedGroup = groups.find(g => String(g.id || g.group_id) === String(selectedGroupId))
  const ownerId = selectedGroup?.owner_id ?? selectedGroup?.group_owner_id ?? selectedGroup?.ownerId ?? selectedGroup?.user_id ?? selectedGroup?.created_by
  const isOwner = Boolean(currentUserId && ownerId && String(currentUserId) === String(ownerId))
  const isMember = Boolean(members.some(member => String(member.user_id) === String(currentUserId)))

  return (
    <div id="Groups">
      <h1>Groups Page</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>Enter a group name to create a new group.</p>
      <form className="create-group-form" onSubmit={createGroup}>
        <input
          className="group-name-form"
          type="text"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="Enter group name"
        />
        <button className="create-group-btn" type="submit">Create Group</button>
      </form>

      {/* Display the list of groups and join request buttons */}
      <div className="group-list-all" style={{ marginTop: '20px' }}>
        <h2 className="groups-title">All Groups</h2>
        {(!groups || groups.filter(Boolean).length === 0) ? (
          <p>No groups found.</p>
        ) : (
          <ul className="groups-list">
            {groups.filter(Boolean).map((group) => (
              <li className="group-item" key={group.id || group.group_id} style={{ marginBottom: '10px' }}>
                <span className="group-name">{group.name}</span>{' '}

                <button className="show-movies-btn" onClick={() => showGroupMovies(group.id || group.group_id, group.owner_id || group.group_owner_id || group.user_id)}>
                 Show Movies
                </button>

                <button className="join-group-btn" onClick={() => joinGroup(group.id || group.group_id)}>
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
      {selectedGroupId && (isOwner||isMember) && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2 className="movie-search-title">Search & add a movie to your group's list</h2>
          <form className="movie-search-row" onSubmit={handleMovieSearch}>
            <input
              className="movie-search-form"
              type="text"
              value={movieSearchTerm}
              onChange={(e) => setMovieSearchTerm(e.target.value)}
              placeholder="Search for movies..."
            />
            {(isOwner || isMember) && (
              <button className="search-tmbd-btn" type="submit">Search TMDB</button>
            )}
          </form>

          {/* TMDB search results */}
{searchResults.length > 0 && (
  <div className="search-results">
    <h3 className="search-results-title">Search Results:</h3>
    <ul className="search-results-list">
      {searchResults.map((movie) => (
        <li className="search-result-item" key={movie.id}>
          <span className="search-result-name">
            {movie.title}
            {movie.release_date ? ` (${movie.release_date.slice(0, 4)})` : ''}
          </span>
          <button
            className="add-to-group-btn"
            onClick={() => addMovieToGroup(movie.id, movie.title)}
          >
            + Add to Group
          </button>
        </li>
      ))}
    </ul>
  </div>
          )}
        </div>
      )}

      {/* Display the list of group members */}
      {selectedGroupId && members.length > 0 && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2 className="member-list-title">Group Members</h2>
          <ul>
            {members.map((member) => (
              <li key={member.user_id} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>{member.username} ({member.role})</span>
                {isOwner && String(member.user_id) !== String(currentUserId) && (
                  <button 
                    onClick={() => removeMember(selectedGroupId, member.user_id)}
                    style={{ backgroundColor: '#c0392b', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
                  >
                    Remove Member
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display the list of group favorite movies */}
      {groupMoviesVisible && (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          <h2 className="group-fav-title">Group Favorite Movies</h2>
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
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
          {/* Show View Requests button ONLY if the current user is the owner */}
          {isOwner && (
            <button
              onClick={() => fetchJoinRequests(selectedGroupId)}
              style={{ backgroundColor: '#e67e22', color: 'white', marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>
              View Join Requests
            </button>
          )}

          {isOwner && (
            <button onClick={() => deleteGroup(selectedGroupId)} style={{ marginLeft: '10px', backgroundColor: '#6e0202', color: 'white', marginRight: '10px', padding: '6px 12px', cursor: 'pointer' }}>
              Delete Group
            </button>
          )}

          {currentUser && !isOwner && (
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