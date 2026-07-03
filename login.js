// Demo credentials (change these to whatever you want!)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const err = document.getElementById("login-error");

  // Check if credentials match
  if (u === ADMIN_USERNAME && p === ADMIN_PASSWORD) {
    // Save the login state to the browser
    localStorage.setItem("isLoggedIn", "true");
    
    // Redirect to the admin panel (Fixed the file path here!)
    location.href = "admin.html"; 
  } else {
    // Show error message
    err.textContent = "Invalid username or password.";
  }
});
