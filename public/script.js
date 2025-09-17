// Example: search bar alert
document.querySelector(".search-bar input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    alert("Searching for: " + e.target.value);
  }
});

  // ✅ Firebase Config
    const firebaseConfig = {
      apiKey: "AIzaSyA4tVXiipMH4YI0E2yvnIbEm4bpYIM1pdU",
      authDomain: "booklibrarytest-6b377.firebaseapp.com",
      databaseURL: "https://booklibrarytest-6b377-default-rtdb.firebaseio.com",
      projectId: "booklibrarytest-6b377",
      storageBucket: "booklibrarytest-6b377.appspot.com",
      messagingSenderId: "1008516508937",
      appId: "1:1008516508937:web:52f60b4587cd5708fe77d8",
      measurementId: "G-42DH0K3CK6"
    };

    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    let posts = [];

    // 🔹 Fetch all posts once on page load
    database.ref("posts").once("value", (snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach(child => {
          posts.push(child.val()); // { heading, summary, timestamp }
        });
      }
    });

    const searchInput = document.getElementById("searchInput");
    const suggestionsDiv = document.getElementById("suggestions");

    // 🔎 Search input listener
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      suggestionsDiv.innerHTML = "";

      if (query.trim() === "") {
        suggestionsDiv.style.display = "none";
        return;
      }

      // Filter posts by heading
      const filtered = posts.filter(post =>
        post.heading.toLowerCase().includes(query)
      );

      if (filtered.length > 0) {
        filtered.forEach(post => {
          const div = document.createElement("div");
          div.classList.add("suggestion-item");
          div.textContent = post.heading;
          div.onclick = () => {
            window.location.href = `tdpage.html?post=${encodeURIComponent(post.heading)}`;
          };
          suggestionsDiv.appendChild(div);
        });
        suggestionsDiv.style.display = "block";
      } else {
        suggestionsDiv.style.display = "none";
      }
    });

    // Hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) {
        suggestionsDiv.style.display = "none";
      }
    });