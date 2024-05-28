import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
        import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

        onAuthStateChanged(auth, (user) => {
            if (user) {
                document.getElementById('account-email').textContent = `Signed in as: ${user.email}`;
                document.getElementById('account-section').style.display = 'block';
            } else {
                window.location.href = 'signin.html';
            }
        });

        window.logout = function logout() {
            signOut(auth).then(() => {
                window.location.href = 'signin.html';
            }).catch((error) => {
                console.error('Error logging out:', error.message);
            });
        }