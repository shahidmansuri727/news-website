// FIXED: Changed path from "../firebase-config.js" to "./firebase-config.js"
import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- Protect page ---
// FIXED: Changed redirect from "../login.html" to "login.html"
if(localStorage.getItem("isLoggedIn") !== "true"){
  location.href = "login.html";
}

// --- Add article ---
document.getElementById("news-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.textContent = "Adding News...";
  submitBtn.disabled = true;

  const article = {
    title: document.getElementById("title").value,
    summary: document.getElementById("summary").value,
    content: document.getElementById("content").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value || "https://via.placeholder.com/800x450",
    video: document.getElementById("video").value,
    breaking: document.getElementById("breaking").checked,
    date: new Date().toISOString()
  };

  try {
    await addDoc(collection(db, "articles"), article);
    alert("News added globally!");
    e.target.reset();
    renderNewsList(); 
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to add news. Check console.");
  } finally {
    submitBtn.textContent = "Add News";
    submitBtn.disabled = false;
  }
});

// --- List / Delete ---
async function renderNewsList() {
  const listEl = document.getElementById("news-list");
  listEl.innerHTML = "<p>Loading live news...</p>";

  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    const list = [];
    querySnapshot.forEach((doc) => {
      list.push({ id: doc.id, ...doc.data() });
    });

    list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    listEl.innerHTML = list.length ? "" : "<p>No news articles added yet.</p>";

    list.forEach((a) => {
      const div = document.createElement("div");
      div.className = "news-card";
      div.innerHTML = `
        <h3>${a.title}</h3>
        <p><strong>Category:</strong> ${a.category}</p>
        <button data-id="${a.id}">Delete</button>
      `;
      
      div.querySelector("button").addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        if(confirm("Are you sure you want to delete this article?")) {
          e.target.textContent = "Deleting...";
          try {
            await deleteDoc(doc(db, "articles", docId));
            renderNewsList(); 
          } catch(error) {
            console.error("Error deleting document: ", error);
            alert("Failed to delete.");
            e.target.textContent = "Delete";
          }
        }
      });

      listEl.appendChild(div);
    });
  } catch (error) {
    console.error("Error fetching news: ", error);
    listEl.innerHTML = "<p>Error loading news. Check Firebase configuration keys.</p>";
  }
}

renderNewsList();

// --- Logout ---
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  // FIXED: Changed redirect from "../login.html" to "login.html"
  location.href = "login.html";
});
