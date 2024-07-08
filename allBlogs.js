import {
  doc,
  app,
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

  allBlogsDiv.innerHTML += `<div class="mainDiv">
            <div class="fDiv">
                <img src="${data.user.profile}">
                <h4>${data.user.userName}</h4>
                <h4>${data.time.toDate().toDateString()}</h4>
            </div>
            <div class="sDiv">
                <img src="${data.BlogImage}">
                <h1>${data.Title}</h1>
                <p>${data.Desc}</p>
            </div>
            

        </div>`;
});

logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
