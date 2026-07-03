// Import Firebase logic (adjust the path to your firebase-config.js if needed)
import { db } from "../firebase-config.js";
import { collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- Protect page ---
if(localStorage.getItem("isLoggedIn") !== "true"){
  location.href = "../login.html";
}

// --- Add article ---
document.getElementById("news-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // Change button text while saving so you know it's working
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
    // Send to Firebase
    await addDoc(collection(db, "articles"), article);
    alert("News added globally!");
    e.target.reset();
    renderNewsList(); // Refresh the list automatically
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Failed to add news. Check the developer console for details.");
  } finally {
    // Reset button
    submitBtn.textContent = "Add News";
    submitBtn.disabled = false;
  }
});

// --- List / Delete ---
async function renderNewsList() {
  const listEl = document.getElementById("news-list");
  listEl.innerHTML = "<p>Loading live news from database...</p>";

  try {
    // Fetch all articles from Firebase
    const querySnapshot = await getDocs(collection(db, "articles"));
    const list = [];
    querySnapshot.forEach((doc) => {
      // Push the document ID alongside the data so we can delete it later
      list.push({ id: doc.id, ...doc.data() });
    });

    // Sort by newest first
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
      
      // Delete event listener
      div.querySelector("button").addEventListener("click", async (e) => {
        const docId = e.target.getAttribute("data-id");
        if(confirm("Are you sure you want to delete this article from the live site?")) {
          e.target.textContent = "Deleting...";
          try {
            // Delete from Firebase
            await deleteDoc(doc(db, "articles", docId));
            renderNewsList(); // Refresh the list
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
    listEl.innerHTML = "<p>Error loading news. Make sure Firebase is configured correctly.</p>";
  }
}

// Initial load of the news list
renderNewsList();

// --- Logout ---
document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  location.href = "../login.html";
});
