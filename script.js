var currentPage = 1;

function getUserData() {
  var username = document.getElementById("username").value;
  document.getElementById("repoList").innerHTML = "";
  fetch("https://api.github.com/users/" + username)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Enter valid username!");
      }
      return response.json();
    })
    .then((data) => {
      document.getElementById("bio").innerHTML = "";
      document.getElementById("location").innerHTML = "";
      document.getElementById("twitter").innerHTML = "";
      if (data.avatar_url) {
        document.getElementById("profileImage").src = data.avatar_url;
        document.getElementById("profileImage").style.display = "block";
      }
      if (data.name) {
        document.getElementById("name").innerHTML = data.name;
      }
      if (data.bio) {
        document.getElementById("bio").innerHTML = data.bio;
      }
      if (data.location) {
        document.getElementById(
          "location"
        ).innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
      }
      if (data.twitter_username) {
        document.getElementById(
          "twitter"
        ).innerHTML = `Twitter : ${data.twitter_username}`;
      }
      if (data.html_url) {
        document.getElementById(
          "githubUrl"
        ).innerHTML = `Github URL: ${data.html_url}`;
      }
      if (
        data.avatar_url ||
        data.name ||
        data.bio ||
        data.location ||
        data.twitter_username ||
        data.html_url
      ) {
        document.getElementById("search_div").style.display = "flex";
        document.getElementById("page_selector").style.display = "block";
        document.getElementById("bottom_btn").style.display = "flex";
      }

      getRepos(username);
    })
    .catch((error) => {
      alert(error);
    });
}

function getRepos(username, pageNumber) {
  var perPage = document.getElementById("perPage").value;
  document.getElementById("pageNumber").innerHTML = pageNumber || 1;
  return fetch(
    "https://api.github.com/users/" +
      username +
      "/repos?page=" +
      pageNumber +
      "&per_page=" +
      perPage
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        alert("No repositories available for this user.");
        return;
      }
      document.getElementById("pageNumber").innerHTML = currentPage;
      document.getElementById("repoList").style.display = "flex";
      document.getElementById("search_div").style.display = "flex";
      document.getElementById("page_selector").style.display = "block";
      document.getElementById("bottom_btn").style.display = "flex";

      var repoList = document.getElementById("repoList");
      repoList.innerHTML = "";
      data.forEach((repo) => {
        var repoDiv = document.createElement("div");
        repoDiv.className = "repositories";

        var nameP = document.createElement("p");
        nameP.className = "repo_name";
        nameP.innerHTML = repo.name;
        repoDiv.appendChild(nameP);

        var languagesDiv = document.createElement("div");
        languagesDiv.className = "languages";
        repoDiv.appendChild(languagesDiv);

        repoList.appendChild(repoDiv);

        getLanguages(username, repo.name, languagesDiv);
      });
      return data.length;
    })
    .catch((error) => console.error("Error:", error));
}

function getLanguages(username, repoName, element) {
  fetch(
    "https://api.github.com/repos/" + username + "/" + repoName + "/languages"
  )
    .then((response) => response.json())
    .then((data) => {
      var languages = Object.keys(data);
      languages.forEach((language) => {
        var div = document.createElement("div");
        div.innerHTML = language;
        element.appendChild(div);
      });
    })
    .catch((error) => console.error("Error:", error));
}

function changePage(direction) {
  if (currentPage === 1 && direction === -1) {
    return;
  }
  
  var newPage = currentPage + direction;
  var username = document.getElementById("username").value;
  
  getRepos(username, newPage).then((length) => {  
    if (length > 0) {  
      currentPage = newPage;
      document.getElementById("pageNumber").innerHTML = currentPage;
    }
  });
}

function searchRepos() {
  var username = document.getElementById("username").value;
  var searchTerm = document.getElementById("searchTerm").value.toLowerCase();
  fetch(
    "https://api.github.com/users/" +
      username +
      "/repos?page=" +
      currentPage +
      "&per_page=100"
  )
    .then((response) => response.json())
    .then((data) => {
      var filteredRepos = data.filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm)
      );
      displayRepos(filteredRepos, username);
    })
    .catch((error) => console.error("Error:", error));
}

function displayRepos(repos, username) {
  var repoList = document.getElementById("repoList");
  repoList.innerHTML = "";
  repos.forEach((repo) => {
    var repoDiv = document.createElement("div");
    repoDiv.className = "repositories";

    var nameP = document.createElement("p");
    nameP.className = "repo_name";
    nameP.innerHTML = repo.name;
    repoDiv.appendChild(nameP);

    var languagesDiv = document.createElement("div");
    languagesDiv.className = "languages";
    repoDiv.appendChild(languagesDiv);

    repoList.appendChild(repoDiv);

    getLanguages(username, repo.name, languagesDiv);
  });
}
