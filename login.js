// Demo credentials (change as you like)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "12345";

document.getElementById("login-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const u = document.getElementById("username").value.trim();
  const p = document.getElementById("password").value.trim();
  const err = document.getElementById("login-error");

  if(u === ADMIN_USERNAME && p === ADMIN_PASSWORD){
    localStorage.setItem("isLoggedIn","true");
    location.href = "admin/admin.html";
  } else {
    err.textContent = "Invalid username or password.";
  }
});
