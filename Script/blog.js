import {
  storage,
  addDoc,
  collection,
  db,
  getDoc,
  app,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  auth,
  signOut,
  onAuthStateChanged,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "./firebase.js";
let fileInput = document.getElementById("fileInput");
let img = document.getElementById("img");
let blogBtn = document.getElementById("blogBtn");
let mainDiv = document.getElementById("mainDiv");
let logoutBtn = document.getElementById("logoutBtn");
let logoName = document.getElementById("logoName");
let navImg = document.getElementById("navImg");
let blogTitle = document.getElementById("blogTitle");
let blogDesc = document.getElementById("blogDesc");
let blogDiv = document.getElementById("blogDiv");
let labelInput = document.getElementById("labelInput");
let uid;
let menuBtn = document.getElementById("menuBtn");
let logoutNav = document.getElementById("logoutNav")
let EditDiv = document.getElementById("EditDiv")
let EditTitle = document.getElementById("EditTitle")
let EditDesc = document.getElementById("EditDesc")
let UpdBtn = document.getElementById("UpdBtn")




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
    if (location.pathname !== "/blog.html") {
      location.href = "/blog.html";
    }
    uid = user.uid;
    getBlogs(uid);
    getUser();
  } else {
    location.href = "/index.html";
  }
});

const uploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `images/${name}/${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

let spinner = document.getElementById("spinner");

fileInput.onchange = async () => {
  spinner.style.display = "flex";
  try {
    img.src = await uploadFile(fileInput.files[0]);
    img.style.display = "block";
    spinner.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};


let data;
const getUser = async () => {
  spinner.style.display = "flex";
  const docRef = doc(db, "blogUsers", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    data = docSnap.data();
    spinner.style.display = "none";
    logoName.innerHTML = data.userName;
    navImg.src = data.profile;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

blogBtn &&
  blogBtn.addEventListener("click", async () => {
    spinner.style.display = "flex";
    const docRef = doc(db, "blogUsers", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      data = docSnap.data();
    }
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(db, "blogs"), {
        BlogImage: img.src,
        Title: blogTitle.value,
        Desc: blogDesc.value,
        userId: data.uid,
        time: serverTimestamp(),
        user: data,
      });
      console.log("Document written with ID: ", docRef.id);
      spinner.style.display = "none";
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Blog Published Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      img.style.display = "none";
      blogTitle.value = '',
      blogDesc.value = ''
      getBlogs(data.uid)
    } catch (error) {
      spinner.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    }
  });


  let getBlogs = async (uid) => {
    blogDiv.innerHTML = '';
    const q = query(collection(db, "blogs"), where("userId", "==", uid));
  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let blogData = doc.data();
      blogDiv.classList.add("blogContainer");
      blogDiv.innerHTML += `
        <div class="topDiv">
          <div class="btnDiv">      
            <button onclick="editBtn('${doc.id}', \`${blogData.Title}\`, \`${blogData.Desc}\`)" class="eBtn"><i class="bi bi-pencil-fill"></i></button>
            <button class="dBtn" onclick="deleteBtn('${doc.id}', '${uid}')"><i class="bi bi-trash3-fill"></i></button>
          </div>
          <div class="topDiv1">
            <div>
              <img class="userImg" src="${blogData.user.profile}" alt="">
            </div>
            <div>
              <h1>${blogData.user.userName}</h1>
              <p>${blogData.time.toDate().toDateString()}</p>
            </div>
          </div>
          <img class="blogImg" src="${blogData.BlogImage}" alt="">
          <h3 class="blogTitle">${blogData.Title}</h3>
          <p class="blogDesc">${blogData.Desc}</p>
        </div>
      `;
    });
  };
  
  window.deleteBtn = async (id, userId) => {
    spinner.style.display = "flex";
    try {
      await deleteDoc(doc(db, "blogs", id));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Successfully deleted",
        showConfirmButton: false,
        timer: 1500,
      });
      spinner.style.display = "none";
      getBlogs(userId);   
    } catch (error) {
      spinner.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };
  
  window.editBtn = (id, title, desc) => {
    EditDiv.style.display = "flex"
    EditTitle.value = title
    EditDesc.value = desc
    UpdBtn.setAttribute("onclick", `updateBlog('${id}')`);
  };
  
  window.updateBlog = async (id) => {
    spinner.style.display = "flex";
    const washingtonRef = doc(db, "blogs", id);
  
    try {
      await updateDoc(washingtonRef, {
        Title: EditTitle.value,
        Desc: EditDesc.value,
      });
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Blog Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      spinner.style.display = "none";
      EditDiv.style.display = "none"
      getBlogs(uid);
    } catch (error) {
      spinner.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
    }
  };
  
  logoutBtn && logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
  
  logoutNav && logoutNav.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
  