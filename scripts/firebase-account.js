import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: process.env.FIREBASE_AUTH_DOMAIN,
            projectId: process.env.FIREBASE_PROJECT_ID,
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE_APP_ID,
            measurementId: process.env.FIREBASE_MEASUREMENT_ID
        };

          const app = initializeApp(firebaseConfig);
          const auth = getAuth(app);
  
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