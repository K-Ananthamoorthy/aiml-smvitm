import { initializeApp } from "https://www.gstatic.com/firebasejs/9.2.0/firebase-app.js";
import { getFirestore} from "https://www.gstatic.com/firebasejs/9.2.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch Firebase configuration from server
  const response = await fetch('/auth-config');
  const firebaseConfig = await response.json();

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Assuming you have a collection called "csharpPrograms" in Firestore
  const csharpProgramsRef = db.collection("csharpPrograms");

  // Function to fetch and display C# programs
  function displayCSharpPrograms() {
    csharpProgramsRef.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const programData = doc.data();
        const codeBlock = document.createElement("pre");
        codeBlock.className = "code-block";
        codeBlock.textContent = programData.code;
        document.getElementById("csharp-programs").appendChild(codeBlock);
      });
    }).catch((error) => {
      console.log("Error getting documents: ", error);
    });
  }

  // Call the function to display C# programs when the page loads
  window.onload = displayCSharpPrograms;
});