import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', async () => {
  // Fetch Firebase configuration from server
  const response = await fetch('/auth-config');
  const firebaseConfig = await response.json();

  // Initialize Firebase app
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Assuming you have a collection called "csharpPrograms" in Firestore
  const csharpProgramsRef = collection(db, "csharpPrograms");

  // Function to fetch and display C# programs
  async function displayCSharpPrograms() {
    const querySnapshot = await getDocs(csharpProgramsRef);
    querySnapshot.forEach((doc) => {
      const programData = doc.data();
      programData.cs.forEach((codeSnippet) => {
        console.log(codeSnippet);
        const formattedCode = formatCode(codeSnippet);
        const codeBlock = document.createElement("pre");
        codeBlock.className = "code-block";
        codeBlock.innerHTML = formattedCode;
        document.getElementById("csharp-programs").appendChild(codeBlock);
      });
    });
  }

  // Format the code snippet to maintain indentation and line breaks
  function formatCode(code) {
    // Replace newlines with <br> tags
    code = code.replace(/\n/g, "<br>");

    // Add spacing after specific characters
    code = code.replace(/;/g, ";<br>&nbsp;&nbsp;");
    code = code.replace(/{/g, "{<br>&nbsp;&nbsp;");
    code = code.replace(/}/g, "<br>}");

    return code;
  }

  // Call the function to display C# programs when the page loads
  window.onload = displayCSharpPrograms;
});
