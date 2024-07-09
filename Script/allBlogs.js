import {
  doc,
  app,
  query,
  where,
  collection,
  getDoc,
  getDocs,
  db,
  auth,
  signOut,
  onAuthStateChanged,
} from "./firebase.js";
let allBlogsDiv = document.getElementById("allBlogsDiv");
let logoutBtn = document.getElementById("logoutBtn");
let logoName = document.getElementById("logoName");
let navImg = document.getElementById("navImg");
let menuBtn = document.getElementById("menuBtn");

menuBtn &&
  menuBtn.addEventListener("click", () => {
    let menuList = document.querySelector(".menuList");
    if (menuList.style.display === "none") {
      menuList.style.display = "flex";
    } else {
      menuList.style.display = "none";
    }
  });

  onAuthStateChanged(auth, (user) => {
    if (user) {
     let uid = user.uid;
     getUser(uid);
      if (location.pathname !== "/allBlogs.html") {
        location.href = "/allBlogs.html";
      }
    } else {
      location.href = "/index.html";
  
      console.log(error);
    }
  });

const getUser = async (uid) => {
  const docRef = doc(db, "blogUsers", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let data = docSnap.data();
    logoName.innerHTML = data.userName;
    navImg.src = data.profile;
  } else {
    console.log("No such document!");
  }
};

const querySnapshot = await getDocs(collection(db, "blogs"));
querySnapshot.forEach((doc) => {
  let data = doc.data();

  allBlogsDiv.innerHTML += `<div class="topDiv">
        <div class="topDiv1">
          <div>
            <img class="userImg" src="${data.user.profile}" alt="">
          </div>
          <div>
            <h1 class="userName">${data.user.userName}</h1>
            <p class="blogTime">${data.time.toDate().toDateString()}</p>
          </div>
        </div>
        <img class="blogImg" src="${data.BlogImage}">
        <h2 class="blogTitle">${data.Title}</h2>
        <p class="blogDesc">${data.Desc}</p>
        <a href="./user.html?user=${data.user.uid}">view all blogs</a>
      </div>`
});




logoutBtn && logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
  let logoutNav = document.getElementById("logoutNav")

  logoutNav && logoutNav.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });