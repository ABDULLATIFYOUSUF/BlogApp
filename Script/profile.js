import {
  storage,
  app,
  auth,
  ref,
  db,
  uploadBytesResumable,
  getDownloadURL,
  doc,
  getDoc,
  onAuthStateChanged,
  updateDoc,
  signOut,
} from "./firebase.js";
let fileInput = document.getElementById("fileInput");
let img = document.getElementById("img");
let updateBtn = document.getElementById("updateBtn");
let mainDiv = document.getElementById("mainDiv");
let userName = document.getElementById("userName");
let phoneNumber = document.getElementById("phoneNumber");
let loginEmail = document.getElementById("loginEmail");
let logoName = document.getElementById("logoName");
let navImg = document.getElementById("navImg");
let logoutBtn = document.getElementById("logoutBtn");
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

let uid;
onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    getUser();
    if (location.pathname !== "/profile.html") {
      location.href = "/profile.html";
    }
  } else {
    location.href = "/index.html";

    console.log(error);
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
    img.src = data.profile;
    userName.value = data.userName;
    phoneNumber.value = data.phoneNumber;
    loginEmail.value = data.loginEmail;
    spinner.style.display = "none";
    logoName.innerHTML = data.userName;
    navImg.src = data.profile;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
};

updateBtn &&
  updateBtn.addEventListener("click", async () => {
    spinner.style.display = "flex";
    try {
      const washingtonRef = doc(db, "blogUsers", uid);

      // Set the "capital" field of the city 'DC'
      await updateDoc(washingtonRef, {
        userName: userName.value,
        phoneNumber: phoneNumber.value,
        profile: img.src,
      });
      spinner.style.display = "none";
      Swal.fire({
        position: "center",
        icon: "success",
        title: "profile Updated",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
      spinner.style.display = "none";
    }
  });

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
