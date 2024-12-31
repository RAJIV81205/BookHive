

// Import Firebase libraries
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwTPAKgvU4EpX-YMDNXVn_kC_hKoC66m8",
  authDomain: "bookhive-99.firebaseapp.com",
  projectId: "bookhive-99",
  storageBucket: "bookhive-99.firebasestorage.app",
  messagingSenderId: "1087067588892",
  appId: "1:1087067588892:web:d61d9723c18e68022292d9",
  measurementId: "G-RGFFYR6BN4"
};

// Initialize Firebase



const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


document.getElementById("google-login-btn").addEventListener("click", async () => {
  document.querySelector('.login-loader-container').style.display = "flex"
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;


    const response = await fetch('https://bookhive2-1k7bw13r.b4a.run/google-signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: user.displayName,
      }),
    });

    const data = await response.json();

    if (response.ok) {

      localStorage.setItem('token', data.token)
      localStorage.setItem('username', data.user.name)
      localStorage.setItem('email', data.user.email)
      localStorage.setItem('mobile', data.user.mobile);
      document.querySelector('.login-loader-container').style.display = "none";
      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome Back! ${data.user.name}.`,
        icon: 'success',
        showConfirmButton: true,
        confirmButtonText: 'Start Shopping',
        timer: 3000, 
        timerProgressBar: true,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          confirmButton: 'custom-swal-button',
          timerProgressBar: 'custom-swal-timer-bar',
        },
      }).then((result) => {

        if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
          window.location.href = 'index.html';
        }
      });
    } else {
      alert(data.message);
    }
  } catch (error) {
    location.reload()
    console.error('Error signing in with Google:', error);
  }
});




