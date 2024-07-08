import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
} from "./firebase.js";
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let userName = document.getElementById("userName");
let phoneNumber = document.getElementById("phoneNumber");
let signupBtn = document.getElementById("signupBtn");
let spinner = document.getElementById("spinner");

signupBtn &&
  signupBtn.addEventListener("click", () => {
    spinner.style.display = "block";
    createUserWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "blogUsers", user.uid), {
          userName: userName.value,
          phoneNumber: phoneNumber.value,
          loginEmail: loginEmail.value,
          loginPassword: loginPassword.value,
          uid: user.uid,
        });
        loginEmail.value = "";
        loginPassword.value = "";
        userName.value = "";
        phoneNumber.value = "";
        spinner.style.display = "none";
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Signup Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
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
