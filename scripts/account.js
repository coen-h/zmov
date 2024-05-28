import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

        const firebaseConfig = {
            apiKey: "AIzaSyAEXZjHoivvvO_I-mzXKEHBGWqUbWSNu6A",
            authDomain: "zmov-0.firebaseapp.com",
            projectId: "zmov-0",
            storageBucket: "zmov-0.appspot.com",
            messagingSenderId: "326117586417",
            appId: "1:326117586417:web:b5b902a295e80793810050",
            measurementId: "G-K8YZBHVLJ9"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        // Check auth state
        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById('account-email').textContent = `Signed in as: ${user.email}`;
                document.getElementById('account-section').style.display = 'block';
            } else {
                window.location.href = 'signin.html'; // Redirect to sign-in page if not authenticated
            }
        });

        // Logout function
        window.logout = function logout() {
            signOut(auth).then(() => {
                window.location.href = 'signin.html'; // Redirect to sign-in page after sign-out
            }).catch((error) => {
                console.error('Error logging out:', error.message);
            });
        }