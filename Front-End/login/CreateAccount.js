const createAccountButton = document.getElementById('createAccbutt');
const invalidUser = /[^ \w@.]/;

createAccountButton.addEventListener('click', async(event)=>{
  createAccountButton.disabled = true;
    event.preventDefault();
  
    const username = document.getElementById('crusr').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('inipsw').value.trim();
    const confirmPassword = document.getElementById('confpsw').value.trim();
    
    if (!username || !email || !password || !confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
  
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
  
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include' // include cookie, to keep track of communication
      });
  
      if (response.ok) {
        alert('Account created successfully');
        // Redirect to the main page or login page
        window.location.href = 'LoginPage.html';
      } else {
        const error = await response.json();
        console.error('Server error:', error);
        alert(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  },{once: true});