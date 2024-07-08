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
  spinner.style.display = "block";
  try {
    img.src = await uploadFile(fileInput.files[0]);
    img.style.display = "block";
    spinner.style.display = "none";
  } catch (error) {
    console.log(error);
  }
};

logoutBtn &&
  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
      });
  });
let data;
const getUser = async () => {
  spinner.style.display = "block";
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
    spinner.style.display = "block";
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
      window.location.reload();
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
  const q = query(collection(db, "blogs"), where("userId", "==", uid));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let blogData = doc.data();
    blogDiv.classList.add("blogContainer");
    blogDiv.innerHTML += `<div class="subContainer">
    <div class="topDiv">
    <button class="eBtn" onClick="editBtn('${doc.id}', '${blogData.Title}', '${
      blogData.BlogImage
    }', '${blogData.Desc}')"><i class="bi bi-pencil-fill"></i></button>
    <button class="dBtn" onClick="deleteBtn('${
      doc.id
    }')"><i class="bi bi-trash3-fill"></i></button>
      </div>
    <h4><img class="blogImage" src="${blogData.user.profile}">${
      blogData.user.userName
    }, <p>${blogData.time
      .toDate()
      .toDateString()}</p></h4><img class="blogImage" src="${
      blogData.BlogImage
    }">
      <h1 class="blogHead">${blogData.Title}</h1>
      <h6 class="descBlog">${blogData.Desc}</h6>
      </div>`;
  });
};

window.deleteBtn = async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Successfully deleted",
      showConfirmButton: false,
      timer: 1500,
    });
    window.location.reload();
  } catch (error) {
    spinner.style.display = "none";
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error,
    });
  }
};

window.editBtn = (id, title, image, desc) => {
  labelInput.innerHTML = "";
  blogTitle.value = title;
  (img.src = image),
    (blogDesc.innerHTML = desc),
    (blogBtn.style.display = "none");
  let updBtn = document.createElement("button");
  updBtn.innerHTML = "Update";
  mainDiv.appendChild(updBtn);
  updBtn.setAttribute(
    "onclick",
    `updateBlog('${id}', '${title}', '${image}', '${desc}')`
  );
};

window.updateBlog = async (id, title, image, desc) => {
  spinner.style.display = "block";
  const washingtonRef = doc(db, "blogs", id);

  try {
    await updateDoc(washingtonRef, {
      Title: blogTitle.value,
      Desc: blogDesc.value,
    });
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Update Blog Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    spinner.style.display = "none";
    window.location.reload();
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error,
    });
    spinner.style.display = "none";
  }
};
