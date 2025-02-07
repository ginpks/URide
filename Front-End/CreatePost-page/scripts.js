function switchTab(tab) {

    // Get the Tabs and Posts
    const passengerTab = document.getElementById('passenger-tab');
    const driverTab = document.getElementById('driver-tab');
    const passengerForm = document.getElementById('passenger-post');
    const driverForm = document.getElementById('driver-post');

    // Switch the ACTIVE tab
    if (tab === 'passenger') {
        passengerTab.classList.add('active');
        driverTab.classList.remove('active');
        passengerForm.style.display = 'block';
        driverForm.style.display = 'none';
    } else if (tab === 'driver') {
        driverTab.classList.add('active');
        passengerTab.classList.remove('active');
        driverForm.style.display = 'block';
        passengerForm.style.display = 'none';
    }
}
let currentUserId = "";

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
        console.error('Please try to login again.');
        return null;
    }
}
const userName = document.querySelector('.username');
  const icon = document.querySelector('.profile-icon');

  getUserId().then(userid => {
    if (userid) {
        currentUserId = userid;
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

// Modify savePost function to store data in IndexedDB
export function savePost(type) {
    let postData;
    if (type === 'passenger') {
        postData = {
            // id: Math.floor(Math.random() * 10000),
            type: 'passenger',
            from: document.getElementById('from').value,
            destination: document.getElementById('destination').value,
            time: document.getElementById('Time').value,
            date: document.getElementById('date').value,
            people: document.getElementById('people').value,
            luggage: document.getElementById('luggage').value,
            extraInfo: document.getElementById('extraInfo').value.trim() === '' ? 'No additional comment' : document.getElementById('extraInfo').value,
            username: localStorage.getItem('loggedInUsername'),
            // User ID
            userId: currentUserId // use example to replace real authentication 
        };
    } else if (type === 'driver') {
        postData = {
            // id: Math.floor(Math.random() * 10000),
            type: 'driver',
            from: document.getElementById('fromDriver').value,
            destination: document.getElementById('destinationDriver').value,
            time: document.getElementById('TimeDriver').value,
            date: document.getElementById('dateDriver').value,
            people: document.getElementById('availableSeats').value,
            luggage: document.getElementById('availableLuggage').value,
            extraInfo: document.getElementById('extraInfoDriver').value.trim() === '' ? 'No additional comment' : document.getElementById('extraInfoDriver').value,
            // User ID
            userId: currentUserId // use example to replace real authentication 
        };
    }

    fetch('http://localhost:3000/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}`
        },
        credentials: 'include', // include cookie, to keep track of communication
        body: JSON.stringify(postData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Post created successfully:', data);
        clearFormFields(type);
    })
    .catch(error => {
        console.error('Error creating post:', error);
    });

    clearFormFields(type);
}
window.switchTab = switchTab;

function clearFormFields(type) {
    if (type === 'passenger') {
        document.getElementById('from').value = '';
        document.getElementById('destination').value = '';
        document.getElementById('Time').value = '';
        document.getElementById('date').value = '';
        document.getElementById('people').value = '';
        document.getElementById('luggage').value = '';
        document.getElementById('extraInfo').value = '';
    } else if (type === 'driver') {
        document.getElementById('fromDriver').value = '';
        document.getElementById('destinationDriver').value = '';
        document.getElementById('TimeDriver').value = '';
        document.getElementById('dateDriver').value = '';
        document.getElementById('availableSeats').value = '';
        document.getElementById('availableLuggage').value = '';
        document.getElementById('extraInfoDriver').value = '';
    }
}

// IndexedDB setup
export function openDatabase() {
    return new Promise((resolve, reject) => {
        console.log("trying to open database...");
        const request = indexedDB.open('PostDatabase', 1);
        
        request.onupgradeneeded = (event) => {
            console.log("database upgrading...");
            const db = event.target.result;
            if (!db.objectStoreNames.contains('posts')) {
                db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });
                console.log("create 'posts' data stored successfully");
            }
        };
        
        request.onsuccess = (event) => {
            console.log("open database successfully");
            resolve(event.target.result);
        };
        
        request.onerror = (event) => {
            console.error('fail to open IndexedDB: ' + event.target.errorCode);
            reject('Error opening IndexedDB: ' + event.target.errorCode);
        };
    });
}

export function storePostInDB(postData) {
    console.log("ready to store data to IndexedDB...", postData);
    openDatabase().then((db) => {
        const transaction = db.transaction('posts', 'readwrite');
        const store = transaction.objectStore('posts');
        store.add(postData);
        transaction.oncomplete = () => {
            console.log('Post saved to IndexedDB successfully!');
        };
        transaction.onerror = (event) => {
            console.error('Error saving post to IndexedDB:', event.target.error);
        };
    }).catch((error) => {
        console.error('fail to open database to store post:', error);
    });
}

// document.querySelector('#post-passenger').addEventListener('click', savePost('passenger'));
window.savePost = savePost;


// event listener for posts that call websocket