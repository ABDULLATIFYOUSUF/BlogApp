import {
  auth,
  createUserWithEmailAndPassword,
  db,
  doc,
  setDoc,
  signOut
} from "./firebase.js";
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let userName = document.getElementById("userName");
let phoneNumber = document.getElementById("phoneNumber");
let signupBtn = document.getElementById("signupBtn");
let spinner = document.getElementById("spinner");
const passwordValidationRegex = /^(?=.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;



signupBtn &&
  signupBtn.addEventListener("click", () => {
    if (!passwordValidationRegex.test(loginPassword.value)) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Password does not meet the criteria",
        text: "Password must be at least 8 characters long, contain at least one digit or special character, one uppercase letter, and one lowercase letter.",
        showConfirmButton: true,
      });
      return;
    }
    spinner.style.display = "flex";
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

        signOut(auth)
      .then(() => {
        location.href = "./index.html";
      })
      .catch((error) => {
        console.log(error);
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
