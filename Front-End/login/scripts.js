// Define the base API URL
const BASE_API_URL = "http://localhost:3000/api"; // Adjust this if your server is hosted elsewhere

document.addEventListener('DOMContentLoaded', () => {
// Select DOM elements
const loginButton = document.getElementById("SignIn");
const createAccountButton = document.querySelector("#button5");

// Event listener for "Create New Account" button
createAccountButton.addEventListener("click", () => {
    // Redirect to the Create Account page
    window.location.href = "CreateAccount.html"; // Adjust the path if necessary
});
});