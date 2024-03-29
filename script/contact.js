import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCN0VLc3wYAeKBk06g-HVtE4dDPcEZo6xk",
    authDomain: "aiml-smvitm.firebaseapp.com",
    projectId: "aiml-smvitm",
    storageBucket: "aiml-smvitm.appspot.com",
    messagingSenderId: "867145474581",
    appId: "1:867145474581:web:a2e294081b458bdb69e41c",
    measurementId: "G-64CF103MLC"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById('contactForm');
form.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const name = formData.get('name');
    const email = formData.get('email');
    const usn = formData.get('usn');
    const phone = formData.get('phone');
    const message = formData.get('message');

    try {
        // Create a reference to the "messages" collection
        const messagesCollection = collection(db, 'messages');
        // Use the email as the document ID
        const messageDoc = doc(messagesCollection, email);
        // Set the contact details as a new document with the email as the document ID
        await setDoc(messageDoc, {
            name: name,
            email: email,
            usn: usn,
            phone: phone,
            message: message,
            timestamp: new Date().toISOString()
        });
        alert('Your message has been submitted successfully!');
        form.reset();
        // Redirect to index.html after successful submission
        window.location.assign('index.html');
    } catch (error) {
        console.error('Error adding document: ', error);
        alert('An error occurred. Please try again later.');
    }
});