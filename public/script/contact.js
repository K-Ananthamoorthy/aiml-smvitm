import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch Firebase configuration from server
  const response = await fetch('/auth-config');
  const firebaseConfig = await response.json();

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Continue with the rest of your client-side code here
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
});
