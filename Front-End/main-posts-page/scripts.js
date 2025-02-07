import {openDatabase, storePostInDB} from '../CreatePost-page/scripts.js'


// Filter and Sort feature - Lana
// Get the modal, open button, and close button elements
const modal = document.getElementById("modal");
const filterButton = document.getElementById("filter-button");
const closeButton = document.getElementById("close-button");

// Show the modal when the filter button is clicked
filterButton.onclick = function() {
    modal.classList.add("show");
}

// Hide the modal when the close button is clicked
closeButton.onclick = function() {
    modal.classList.remove("show");
}

// Optionally, close the modal when clicking outside of the modal content
window.onclick = function(event) {
    if (event.target === modal) {
        modal.classList.remove("show");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Filter setup');

    const passengerButton = document.getElementById('passenger');
    const driverButton = document.getElementById('driver');

    // Add event listeners for each button of filter
    passengerButton.addEventListener("click", function() {
        selectType('passenger');
    });
    driverButton.addEventListener("click", function() {
        selectType('driver');
    });

    const filterButton = document.getElementById('filter-apply-button');
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const filterType = document.querySelector('.type-selection .selected')?.id;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const requiredSeats = document.getElementById('seats-range').value;
            const availableLuggage = document.getElementById('luggage-range').value;

            // Log filter criteria
            console.log("Filter applied with criteria:", {
                type: filterType,
                startDate: startDate,
                endDate: endDate,
                requiredSeats: requiredSeats,
                availableLuggage: availableLuggage
            });

            const filterCriteria = {
                type: filterType,
                startDate: startDate,
                endDate: endDate,
                requiredSeats: requiredSeats,
                availableLuggage: availableLuggage
            };

            // Reload posts based on filter
            // loadPostsFromDB(filterCriteria);
            loadPostsFromServer(filterCriteria);
        });
    }
});


// Type selection function
function selectType(type) {
    const passengerButton = document.getElementById('passenger');
    const driverButton = document.getElementById('driver');
    
    if (type === 'passenger') {
        if (passengerButton.classList.contains('selected')) {
            // If already selected, deselect it
            passengerButton.classList.remove('selected');
        } else {
            // Otherwise, select it and deselect the other
            passengerButton.classList.add('selected');
            driverButton.classList.remove('selected');
        }
    } else if (type === 'driver') {
        if (driverButton.classList.contains('selected')) {
            // If already selected, deselect it
            driverButton.classList.remove('selected');
        } else {
            // Otherwise, select it and deselect the other
            driverButton.classList.add('selected');
            passengerButton.classList.remove('selected');
        }
    }
}
window.selectType = selectType;

// Sort feature - Lana
// Select the sort dropdown
const sortDropdown = document.querySelector('#sort-options');

// Add an event listener to the dropdown
sortDropdown.addEventListener('change', function () {
    // Get the selected sorting criteria
    const sortBy = sortDropdown.value;

    // Select all posts
    const postsList = document.querySelector('.posts-list');
    const posts = Array.from(postsList.querySelectorAll('.posts'));

    // Sort the posts array based on the selected criteria
    const sortedPosts = posts.sort((a, b) => {
        if (sortBy === 'date') {
            // Parse date and time from posts
            const dateA = new Date(a.querySelector('.custom-post-time .custom-post-detail').textContent.trim());
            const dateB = new Date(b.querySelector('.custom-post-time .custom-post-detail').textContent.trim());
            return dateA - dateB; // Ascending order
        } else if (sortBy === 'location') {
            // Sort alphabetically by 'from' location
            const fromA = a.querySelector('.custom-post-starting-place .custom-post-detail').textContent.trim().toLowerCase();
            const fromB = b.querySelector('.custom-post-starting-place .custom-post-detail').textContent.trim().toLowerCase();
            return fromA.localeCompare(fromB);
        } else if (sortBy === 'passengers') {
            // Sort by number of passengers (numeric comparison)
            const passengersA = parseInt(a.querySelector('.custom-post-capacity .custom-post-detail').textContent.trim(), 10);
            const passengersB = parseInt(b.querySelector('.custom-post-capacity .custom-post-detail').textContent.trim(), 10);
            return passengersA - passengersB; // Ascending order
        }
        return 0; // No sorting if no valid option is selected
    });

    // Clear the posts container and re-add the sorted posts
    postsList.innerHTML = ''; // Remove all current posts
    sortedPosts.forEach((post) => postsList.appendChild(post)); // Append sorted posts
});


// Search feature - Lana
// Select the search input and posts container
const searchInput = document.querySelector('#searchInput'); 
const postsList = document.querySelector('.posts-list');

// Add an event listener to capture input changes
searchInput.addEventListener('input', function () {
    // Get the search token (case-insensitive)
    const token = searchInput.value.toLowerCase();

    // Retrieve all posts
    const posts = postsList.querySelectorAll('.posts');

    // Iterate through posts and filter based on the token
    posts.forEach((post) => {
        // Combine the searchable fields from the post (e.g., destination, "from" location)
        const destination = post.querySelector('.custom-post-destination .custom-post-detail')?.textContent.toLowerCase() || '';
        const from = post.querySelector('.custom-post-starting-place .custom-post-detail')?.textContent.toLowerCase() || '';

        // Check if any field contains the search token
        if (destination.includes(token) || from.includes(token)) {
            post.style.display = ''; // Show the post
        } else {
            post.style.display = 'none'; // Hide the post
        }
    });
});

//main function - Jinghao
async function getUserId() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/current-user', {
            method: 'GET',
            credentials: 'include',
        });

        if (!response.ok) {
            console.error('Failed to fetch current user. Status:', response.status);
            return null;
        }

        const data = await response.json();
        const currentUserId = data.user.username;
        console.log('Current User ID:', currentUserId);
        return currentUserId;

    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

document.addEventListener('DOMContentLoaded', () => {

  //Load all the posts from data base
  console.log('DOMContentLoaded');
  // loadPostsFromDB();
  loadPostsFromServer();
    const filterButton = document.getElementById('filter-apply-button');
    if (filterButton) {
        filterButton.addEventListener('click', () => {
            const filterType = document.querySelector('.type-selection .selected')?.id;
            const startDate = document.getElementById('start-date').value;
            const endDate = document.getElementById('end-date').value;
            const requiredSeats = document.getElementById('seats-range').value;
            const availableLuggage = document.getElementById('luggage-range').value;

            const filterCriteria = {
                type: filterType,
                startDate: startDate,
                endDate: endDate,
                requiredSeats: requiredSeats,
                availableLuggage: availableLuggage
            };

            // loadPostsFromDB(filterCriteria);
            loadPostsFromServer(filterCriteria);
            modal.classList.remove('show'); //close filter pop up block
        });
    }


  const userName = document.querySelector('.username');
  const icon = document.querySelector('.profile-icon');

  getUserId().then(userid => {
    if (userid) {
        userName.textContent = userid;
        icon.textContent = userid.charAt(0).toUpperCase();
        userName.addEventListener('click', () => {
            window.location.href = '../user-profile-page/index.html'; // Redirect to user profile page
        });
        // Event listener for profile icon click
        if (icon) {
            icon.addEventListener('click', () => {
                window.location.href = '../user-profile-page/index.html'; // Redirect to user profile page
            });
        }
    }
    else {
        userName.textContent = "Guest";
        icon.textContent = "Guest".charAt(0).toUpperCase();
        userName.addEventListener('click', () => {
            window.location.href = '../login/LoginPage.html'; // Redirect to user profile page
        });
        // Event listener for profile icon click
        if (icon) {
            icon.addEventListener('click', () => {
                window.location.href = '../login/LoginPage.html'; // Redirect to user profile page
            });
        }
    }
    });
    
  // Event listener for post button click
  const postButton = document.querySelector('.post-button');
  if (postButton) {
    postButton.addEventListener('click', () => {
      window.location.href = '../CreatePost-page/index.html'; // Redirect to post creation page
    });
  }


});



// Data type definition for a post
class Post {
  constructor(id, destination, from, time, date, people, luggage, extraInfo) {
    this.id = id;
    this.destination = destination;
    this.from = from;
    this.time = time;
    this.date = date;
    this.people = people;
    this.luggage = luggage;
    this.extraInfo = extraInfo;
  }
}

function createPost(post) {
    //create main container
    const postDiv = document.createElement('div');
    postDiv.className = 'posts';

    //add first line: destination, starting place
    const firstLineDiv = document.createElement('div');
    firstLineDiv.className = 'custom-post-line';

    const destinationDiv = createCustomPostDetail('custom-post-destination', 'To', post.destination);
    const startingPlaceDiv = createCustomPostDetail('custom-post-starting-place', 'From', post.from);
    const idDiv = createCustomPostDetail('custom-post-id', 'ID', `&nbsp;${post.id}`, 'custom-post-id-content');

    firstLineDiv.appendChild(destinationDiv);
    firstLineDiv.appendChild(startingPlaceDiv);
    firstLineDiv.appendChild(idDiv);
    postDiv.appendChild(firstLineDiv);

    //add second line: time/date, passenger, luggage
    const secondLineDiv = document.createElement('div');
    secondLineDiv.className = 'custom-post-line';

    const timeDiv = createCustomPostDetail('custom-post-time', 'Time', `${post.date} ${post.time}`);
    const capacityDiv = createCustomPostDetail('custom-post-capacity', 'Passenger', post.people);
    const luggageDiv = createCustomPostDetail('custom-post-luggage', 'Luggage', post.luggage);

    secondLineDiv.appendChild(timeDiv);
    secondLineDiv.appendChild(capacityDiv);
    secondLineDiv.appendChild(luggageDiv);
    postDiv.appendChild(secondLineDiv);

    //add third line: note
    const thirdLineDiv = document.createElement('div');
    thirdLineDiv.className = 'custom-post-line';

    const notesDiv = createCustomPostDetail('custom-post-notes', 'Notes', post.extraInfo, 'notes-detail');
    thirdLineDiv.appendChild(notesDiv);
    postDiv.appendChild(thirdLineDiv);

    //add redirect link


    postDiv.addEventListener('click', async (event) => {
        // Check if a post element is clicked
        // const post = event.target.closest('.posts');
        if (post) {
          // const postId = post.getAttribute('id'); // Assuming post ID is stored in the post element's id attribute?
          // const currentUserId = "Tom"; // hardcoded for testing (Replace with actual current user ID)
          let currentUserId = "Tom";
          try {
            // request for current user info
            const response = await fetch('http://localhost:3000/api/auth/current-user', {
                method: 'GET',
                credentials: 'include',
            });
    
            if (response.ok) {
                const data = await response.json(); //get json data
                // get username
                currentUserId = data.user.username;
                console.log(currentUserId);
            } else {
                console.error('Failed to fetch current user. Status:', response.status);
                // alert('You are not logged in. Redirecting to login page.');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            alert('An error occurred.');
        }
          // const postOwnerId = "Jerry"; // hardcoded for testing (Replace with actual post owner ID)
          let postOwnerId = post.userId;
          console.log(post.userId)
          if (currentUserId === postOwnerId) {
            alert("You posted it!");
            return; 
        }
          try {
            // Call backend to get or create a session
            const response = await fetch('http://localhost:3000/api/chat/session', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ currentUserId, postOwnerId })
            });
    
            const result = await response.json();
            if (result.success) {
  
              // Redirect to the chat page with the session ID 
              window.location.href = `../chat-page/index.html?session_id=${result.session_id}&postOwnerId=${postOwnerId}&currentUserId=${currentUserId}`;
              console.log("successfully redirected");
            } else {
              console.error('Failed to create or retrieve session');
              window.location.href = `../chat-page/index.html?session_id=${result.session_id}&postOwnerId=${postOwnerId}&currentUserId=${currentUserId}`;
            }
          } catch (error) {
            console.error('Error:', error);
          }
        }
      });




    //append posts to posts-list
    const postsList = document.querySelector('.posts-list');
    postsList.appendChild(postDiv);
}

//helper function for creating post details
function createCustomPostDetail(className, title, detail, detailClass = 'custom-post-detail') {
    const containerDiv = document.createElement('div');
    containerDiv.className = className;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'custom-post-title';
    titleSpan.innerText = title;

    const detailSpan = document.createElement('span');
    detailSpan.className = detailClass;
    detailSpan.innerHTML = detail;

    containerDiv.appendChild(titleSpan);
    containerDiv.appendChild(detailSpan);

    return containerDiv;
}


function loadPostsFromDB(filterCriteria = {}) {
  console.log("Loading posts from the database with filter criteria:", filterCriteria);
  openDatabase().then((db) => {
      const transaction = db.transaction('posts', 'readonly');
      const store = transaction.objectStore('posts');
      const request = store.getAll();

      request.onsuccess = (event) => {
          console.log("load posts successfully");
          const posts = event.target.result;
          const postsList = document.querySelector('.posts-list');
          if (postsList) {
              postsList.innerHTML = ''; //clear current posts

              //apply filter to posts
              const filteredPosts = posts.filter((post) => {
                console.log("Post being checked for filtering:", post);

                let match = true;
                // Apply filters (debugging each criteria separately)
                if (filterCriteria.type && filterCriteria.type !== 'all' && post.type !== filterCriteria.type) {
                    console.log("Post excluded by type filter");
                    match = false;
                }

                if (filterCriteria.startTime && filterCriteria.endTime) {
                    console.log('Filtering by time:');
                    console.log('Raw startTime:', filterCriteria.startTime);
                    console.log('Raw endTime:', filterCriteria.endTime);
            
                    const startTime = new Date(filterCriteria.startTime).getTime();
                    const endTime = new Date(filterCriteria.endTime).getTime();
            
                    if (isNaN(startTime) || isNaN(endTime)) {
                        console.error("Invalid start or end time format:", { startTime, endTime });
                        return false;
                    }
            
                    const postTimeString = `${post.date}T${post.time}`;
                    const postTime = new Date(postTimeString).getTime();
            
                    if (isNaN(postTime)) {
                        console.error("Invalid post time format:", { date: post.date, time: post.time });
                        return false;
                    }
            
                    if (postTime < startTime || postTime > endTime) {
                        console.log("Post excluded by time range filter");
                        match = false;
                    }
                }

                if (filterCriteria.requiredSeats && parseInt(post.people) < parseInt(filterCriteria.requiredSeats)) {
                    console.log("Post excluded by required seats filter");
                    match = false;
                }

                if (filterCriteria.availableLuggage && parseInt(post.luggage) < parseInt(filterCriteria.availableLuggage)) {
                    console.log("Post excluded by luggage filter");
                    match = false;
                }

                return match;
              });

              //create posts that fits the conditions
              filteredPosts.forEach((post) => {
                  console.log("load post:", post);
                  createPost(post);
              });
          } else {
              console.error('cannot find .posts-list element');
          }
          console.log("Finish loading posts");
      };

      request.onerror = (event) => {
          console.error('Error loading posts from IndexedDB:', event.target.error);
      };
  });
}


//Milestone 4: Load posts from the server
function loadPostsFromServer(filterCriteria = {}) {
    console.log("Loading posts from the server with filter criteria:", filterCriteria);
    
    let url = 'http://localhost:3000/api/posts';

    fetch(url, {
        method: 'GET',
        credentials: 'include' // include cookie, to keep track of communication
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(posts => {
            const postsList = document.querySelector('.posts-list');
            if (postsList) {
                postsList.innerHTML = ''; // Clear current posts
                
                // Apply filter to posts if needed (optional, based on filterCriteria)
                const filteredPosts = posts.filter((post) => {
                    let match = true;
                    // Apply filters (e.g., type, time range, required seats, luggage, etc.)
                    // Filtering logic goes here (similar to existing filter logic)
                    if (filterCriteria.type && filterCriteria.type !== 'all' && post.type !== filterCriteria.type) {
                        console.log("Post excluded by type filter");
                        match = false;
                    }


                    if (filterCriteria.startDate && filterCriteria.endDate) {
                        const postDate = post.date;  // e.g., '2024-04-01'
                        
                        if (postDate < filterCriteria.startDate || postDate > filterCriteria.endDate) {
                            console.log("Post excluded by date filter");
                            match = false;
                        }
                    }
                                 
    
                    if (filterCriteria.requiredSeats && parseInt(post.people) < parseInt(filterCriteria.requiredSeats)) {
                        console.log("Post excluded by required seats filter");
                        match = false;
                    }
    
                    if (filterCriteria.availableLuggage && parseInt(post.luggage) < parseInt(filterCriteria.availableLuggage)) {
                        console.log("Post excluded by luggage filter");
                        match = false;
                    }
                    return match;
                });

                // Create posts that fit the conditions
                filteredPosts.forEach((post) => {
                    createPost(post);
                });
            } else {
                console.error('Cannot find .posts-list element');
            }
        })
        .catch(error => {
            console.error('Error fetching posts from server:', error);
        });
}

// adding event listener to postings that directs you to the chat page and creates a chat session between the 
// corresponding users.
document.addEventListener('DOMContentLoaded', () => {
    // Assuming posts are dynamically added, use event delegation
    const postsContainer = document.querySelector('.posts-list');
  
    // postsContainer.addEventListener('click', async (event) => {
    //   // Check if a post element is clicked
    //   const post = event.target.closest('.posts');
    //   if (post) {
    //     // const postId = post.getAttribute('id'); // Assuming post ID is stored in the post element's id attribute?
    //     const currentUserId = "Tom"; // hardcoded for testing (Replace with actual current user ID)
    //     // const postOwnerId = "Jerry"; // hardcoded for testing (Replace with actual post owner ID)
    //     const postOwnerId = post.userId;
    //     console.log(post.userId)
    //     try {
    //       // Call backend to get or create a session
    //       const response = await fetch('http://localhost:3000/api/chat/session', {
    //         method: 'POST',
    //         headers: {
    //           'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ currentUserId, postOwnerId })
    //       });
  
    //       const result = await response.json();
    //       if (result.success) {

    //         // Redirect to the chat page with the session ID 
    //         window.location.href = `../chat-page/index.html?session_id=${result.session_id}&postOwnerId=${postOwnerId}&currentUserId=${currentUserId}`;
    //         console.log("successfully redirected");
    //       } else {
    //         console.error('Failed to create or retrieve session');
    //       }
    //     } catch (error) {
    //       console.error('Error:', error);
    //     }
    //   }
    // });
  });
  
