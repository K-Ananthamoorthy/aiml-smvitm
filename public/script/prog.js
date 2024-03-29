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
    try {
      const querySnapshot = await getDocs(csharpProgramsRef);
      const csharpProgramsDiv = document.getElementById("csharp-programs");
      querySnapshot.forEach((doc) => {
        const programData = doc.data();
        console.log("Program Data:", programData); // Log program data for debugging
        const codeBlock = document.createElement("pre");
        codeBlock.className = "code-block";
        codeBlock.textContent = programData.code;
        csharpProgramsDiv.appendChild(codeBlock); // Append code block to the div
      });
    } catch (error) {
      console.error("Error getting documents:", error); // Log any errors
    }
  }

  // Sample C# program data
const samplePrograms = [
  { code: "class Program {\n  static void Main() {\n    Console.WriteLine(\"Hello, World!\");\n  }\n}" },
  { code: "class MyClass {\n  public void MyMethod() {\n    // Your code here\n  }\n}" }
];

// Loop through sample data and create code blocks
samplePrograms.forEach((programData) => {
  const codeBlock = document.createElement("pre");
  codeBlock.className = "code-block";
  codeBlock.textContent = programData.code;
  document.getElementById("csharp-programs").appendChild(codeBlock);
});


  // Call the function to display C# programs when the page loads
  displayCSharpPrograms();
});