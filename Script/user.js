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
let userView = document.getElementById("userView")
const urlParams = new URLSearchParams(location.search);
const myParam = urlParams.get('user');
console.log(myParam)

let userBlogs = async (id) => {
    userView.style.display = "flex"
    const q = query(collection(db, "blogs"), where("userId", "==", id));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let blogData = doc.data();
      userView.innerHTML += `<div class="topDiv">
          <div class="topDiv1">
            <div>
              <img class="userImg" src="${blogData.user.profile}" alt="">
            </div>
            <div>
              <h1 class="userName">${blogData.user.userName}</h1>
              <p class="blogTime">${blogData.time.toDate().toDateString()}</p>
            </div>
          </div>
          <img class="blogImg" src="${blogData.BlogImage}">
          <h2 class="blogTitle">${blogData.Title}</h2>
          <p class="blogDesc">${blogData.Desc}</p>
          
        </div>`
    });
  
  }

  userBlogs(myParam)