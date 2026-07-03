// Import Firebase logic (ensure firebase-config.js is in the same folder)
import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// ---- Helpers ----
function getParam(name){
  return new URLSearchParams(location.search).get(name);
}

// ---- Load news from Firebase ----
async function loadNews(){
  const newsArray = [];
  try {
    const querySnapshot = await getDocs(collection(db, "articles"));
    querySnapshot.forEach((doc) => {
      // Push the document ID alongside the data
      newsArray.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) { 
    console.error("Error loading news from Firebase:", e); 
  }
  
  // Sort newest first based on the date
  return newsArray.sort((a,b)=> new Date(b.date||0) - new Date(a.date||0));
}

// ---- Breaking ticker (red line) ----
async function startTicker(){
  const el = document.getElementById("breaking-ticker");
  if(!el) return;
  const all = await loadNews();
  const breaking = all.filter(n => n.breaking);
  
  if (breaking.length === 0){ 
    el.textContent = "No breaking news right now."; 
    return; 
  }
  
  el.innerHTML = breaking.map(b => `<span>🔥 ${b.title}</span>`).join("");
  
  // Simple marquee effect
  let x = el.scrollWidth;
  function step(){
    x -= 1;
    if (x < -el.scrollWidth) x = el.clientWidth;
    el.scrollLeft = el.scrollWidth - x;
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---- Render homepage (ALL news) ----
async function renderHome(){
  const container = document.getElementById("top-stories");
  if(!container) return;
  
  container.innerHTML = "<p style='padding:1rem;'>Loading live news...</p>";
  const all = await loadNews();
  container.innerHTML = "";
  
  if(all.length === 0) {
    container.innerHTML = "<p style='padding:1rem;'>No news articles published yet.</p>";
    return;
  }

  all.forEach(a=>{
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${a.image}" alt="${a.title}">
      <div class="content">
        <h3><a href="article.html?id=${a.id}">${a.title}</a></h3>
        <p>${a.summary || ""}</p>
        <small>${a.category}</small>
      </div>`;
    container.appendChild(card);
  });
}

// ---- Render category page ----
async function renderCategory(){
  const container = document.getElementById("category-news");
  if(!container) return;
  
  const cat = getParam("category") || "All";
  document.getElementById("category-title").textContent = cat;
  container.innerHTML = "<p style='padding:1rem;'>Loading category news...</p>";
  
  const all = await loadNews();
  const list = all.filter(n => n.category === cat);
  
  container.innerHTML = list.length ? "" : `<p style='padding:1rem;'>No news in ${cat} yet.</p>`;
  
  list.forEach(a=>{
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${a.image}" alt="${a.title}">
      <div class="content">
        <h3><a href="article.html?id=${a.id}">${a.title}</a></h3>
        <p>${a.summary || ""}</p>
      </div>`;
    container.appendChild(card);
  });
}

// ---- Render article page ----
async function renderArticle(){
  const container = document.getElementById("article-container");
  if(!container) return;
  
  container.innerHTML = "<p>Loading article...</p>";
  const id = getParam("id");
  const all = await loadNews();
  
  // Find the exact article by Firebase ID
  const a = all.find(x => String(x.id) === String(id));
  if(!a){ 
    container.innerHTML = "<p>Article not found.</p>"; 
    return; 
  }
  
  // Format the date nicely
  const publishDate = a.date ? new Date(a.date).toLocaleDateString() : "Recently";

  container.innerHTML = `
    <h1>${a.title}</h1>
    <img src="${a.image}" alt="${a.title}">
    <p><em>${a.category} • ${publishDate}</em></p>
    <p style="white-space: pre-wrap;">${a.content}</p>
    ${a.video ? `<iframe src="${a.video}" frameborder="0" allowfullscreen style="width:100%;height:360px;margin-top:1rem;border-radius:8px;"></iframe>` : ""}
    <div class="share-buttons" style="margin-top:1.5rem; padding-top:1rem; border-top:1px solid #eee;">
      <a target="_blank" href="https://twitter.com/intent/tweet?text=${encodeURIComponent(a.title)}">Share on X</a>
      <a target="_blank" href="https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}">Share on Facebook</a>
      <a target="_blank" href="https://wa.me/?text=${encodeURIComponent(a.title + ' ' + location.href)}">Share on WhatsApp</a>
    </div>
  `;
}

// ---- Search (filters what you see on the page) ----
function attachSearch(){
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const grid = document.getElementById("top-stories") || document.getElementById("category-news");
  if(!form || !input || !grid) return;

  form.addEventListener("submit", e => e.preventDefault());
  input.addEventListener("input", ()=>{
    const term = input.value.trim().toLowerCase();
    const cards = Array.from(grid.getElementsByClassName("news-card"));
    cards.forEach(c=>{
      const txt = c.textContent.toLowerCase();
      c.style.display = txt.includes(term) ? "" : "none";
    });
  });
}

// ---- Init ----
document.addEventListener("DOMContentLoaded", ()=>{
  startTicker();
  renderHome();
  renderCategory();
  renderArticle();
  attachSearch();
});
