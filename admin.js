// --- Protect page ---
if(localStorage.getItem("isLoggedIn") !== "true"){
  location.href = "../login.html";
}

// --- Storage helpers ---
function getLocalNews(){ return JSON.parse(localStorage.getItem("news")) || []; }
function saveLocalNews(arr){ localStorage.setItem("news", JSON.stringify(arr)); }

// --- Add article ---
document.getElementById("news-form").addEventListener("submit", (e)=>{
  e.preventDefault();
  const article = {
    id: Date.now(),
    title: document.getElementById("title").value,
    summary: document.getElementById("summary").value,
    content: document.getElementById("content").value,
    category: document.getElementById("category").value,
    image: document.getElementById("image").value || "https://via.placeholder.com/800x450",
    video: document.getElementById("video").value,
    breaking: document.getElementById("breaking").checked,
    date: new Date().toISOString()
  };
  const list = getLocalNews();
  list.push(article);
  saveLocalNews(list);
  alert("News added!");
  e.target.reset();
  renderNewsList();
});

// --- List / delete ---
function renderNewsList(){
  const listEl = document.getElementById("news-list");
  const list = getLocalNews();
  listEl.innerHTML = list.length ? "" : "<p>No news articles added yet.</p>";
  list.forEach((a, idx)=>{
    const div = document.createElement("div");
    div.className = "news-card";
    div.innerHTML = `
      <h3>${a.title}</h3>
      <p><strong>Category:</strong> ${a.category}</p>
      <button data-index="${idx}">Delete</button>
    `;
    div.querySelector("button").addEventListener("click", ()=>{
      const arr = getLocalNews();
      arr.splice(idx,1);
      saveLocalNews(arr);
      renderNewsList();
    });
    listEl.appendChild(div);
  });
}
renderNewsList();

// --- Logout ---
document.getElementById("logout-btn").addEventListener("click", ()=>{
  localStorage.removeItem("isLoggedIn");
  location.href = "../login.html";
});
