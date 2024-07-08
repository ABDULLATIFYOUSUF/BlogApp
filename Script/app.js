import {
  auth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "./firebase.js";
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginBtn = document.getElementById("loginBtn");
let spinner = document.getElementById("spinner");
onAuthStateChanged(auth, (user) => {
  if (user) {
    if (location.pathname !== "/blog.html") {
      location.href = "/blog.html";
    }
    const uid = user.uid;
  } else {
    if (location.pathname !== "/index.html") location.href = "/index.html";
  }
});

loginBtn.addEventListener("click", () => {
  spinner.style.display = "flex";
  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      spinner.style.display = "none";
      location.href = "./blog.html";
    })
    .catch((error) => {
      spinner.style.display = "none";
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error,
      });
    });
});
