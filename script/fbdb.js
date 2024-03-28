// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCN0VLc3wYAeKBk06g-HVtE4dDPcEZo6xk",
  authDomain: "aiml-smvitm.firebaseapp.com",
  projectId: "aiml-smvitm",
  storageBucket: "aiml-smvitm.appspot.com",
  messagingSenderId: "867145474581",
  appId: "1:867145474581:web:a2e294081b458bdb69e41c",
  measurementId: "G-64CF103MLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to render uploaded files for each subject
async function renderUploadedFiles(subject) {
  const notesDiv = document.getElementById(`notes-${subject}`);
  const storageRef = ref(storage, `notes/${subject}`);
  const items = await listAll(storageRef);
  const fileLinks = await Promise.all(items.items.map(async (itemRef) => {
    const url = await getDownloadURL(itemRef);
    const fileName = itemRef.name;
    return `<li><a href="${url}" target="_blank">${fileName}</a></li>`;
  }));
  notesDiv.innerHTML = '<ul>' + fileLinks.join('') + '</ul>';
}

// Render uploaded files for each subject
['dbms', 'pai', 'atc', 'cn', 'evs', 'rmipr'].forEach((subject) => {
  renderUploadedFiles(subject);
});

// Function to render subject folders
async function renderSubjectFolders() {
  const foldersDiv = document.getElementById('folders');
  if (!foldersDiv) {
    console.error('Folders container not found.');
    return;
  }
  try {
    const notesRef = ref(storage, 'notes');
    const notesList = await listAll(notesRef);
    notesList.prefixes.forEach((subjectRef) => {
      const subjectName = subjectRef.name.split('/').pop(); // Extract subject name from folder path
      const subjectDiv = document.createElement('div');
      subjectDiv.innerHTML = `<h3>${subjectName.toUpperCase()}</h3>`;
      subjectDiv.classList.add('subject-folder');
      foldersDiv.appendChild(subjectDiv);
      subjectDiv.addEventListener('click', async () => {
        const filesList = await listAll(subjectRef);
        const filesLinks = await Promise.all(filesList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const fileName = itemRef.name.split('/').pop(); // Extract file name from file path
          return `<li><a href="${url}" target="_blank">${fileName}</a></li>`;
        }));
        if (!subjectDiv.querySelector('ul')) {
          const ul = document.createElement('ul');
          ul.innerHTML = filesLinks.join('');
          subjectDiv.appendChild(ul);
        }
      });
    });
  } catch (error) {
    console.error('Error rendering subject folders:', error);
  }
}

// Call the function to render subject folders
renderSubjectFolders();
