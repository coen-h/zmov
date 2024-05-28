import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAEXZjHoivvvO_I-mzXKEHBGWqUbWSNu6A",
            authDomain: "zmov-0.firebaseapp.com",
            projectId: "zmov-0",
            storageBucket: "zmov-0.appspot.com",
            messagingSenderId: "326117586417",
            appId: "1:326117586417:web:b5b902a295e80793810050",
            measurementId: "G-K8YZBHVLJ9"
          };
          

          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
  
          // Sign up function
          window.signUp = function signUp() {
              const email = document.getElementById('signup-email-input').value;
              const password = document.getElementById('signup-password-input').value;
  
              createUserWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                      const user = userCredential.user;
                      console.log('User signed up:', user);
                      window.location.href = './settings.html';
                  })
                  .catch((error) => {
                      console.error('Error signing up:', error.message);
                  });
          }
  
          // Login function
          window.login = function login() {
              const email = document.getElementById('email').value;
              const password = document.getElementById('password').value;
  
              signInWithEmailAndPassword(auth, email, password)
                  .then((userCredential) => {
                      const user = userCredential.user;
                      console.log('User logged in:', user);
                      window.location.href = './settings.html';
                  })
                  .catch((error) => {
                      console.error('Error logging in:', error.message);
                  });
          }
  
          // Sign in with Google function
          window.signInWithGoogle = function signInWithGoogle() {
              const provider = new GoogleAuthProvider();
              signInWithPopup(auth, provider)
                  .then((result) => {
                      const user = result.user;
                      console.log('User signed in with Google:', user);
                      window.location.href = './settings.html';
                  })
                  .catch((error) => {
                      console.error('Error signing in with Google:', error.message);
                  });
          }