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

let currentOpenFolder = null;

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
      const filesDiv = document.createElement('div');
      filesDiv.classList.add('subfolder');
      subjectDiv.innerHTML = `<h3>${subjectName.toUpperCase()}</h3>`;
      subjectDiv.classList.add('subject-folder');

      // Append the subject name and files div to the subject div
      subjectDiv.appendChild(filesDiv);

      // Append the subject div to the folders div
      foldersDiv.appendChild(subjectDiv);

      subjectDiv.addEventListener('click', async () => {
        const transitionEndHandler = (event) => {
          if (event.propertyName === 'max-height') {
            event.target.innerHTML = '';
            event.target.removeEventListener('transitionend', transitionEndHandler);
          }
        };
      
        if (currentOpenFolder && currentOpenFolder !== filesDiv) {
          // If there is a currently open folder and it's not the clicked one, close it
          currentOpenFolder.style.maxHeight = null;
          currentOpenFolder.classList.remove('active');
          currentOpenFolder.addEventListener('transitionend', transitionEndHandler);
        }
        if (filesDiv.classList.contains('active')) {
          // If the clicked folder is currently open, close it
          filesDiv.style.maxHeight = null;
          filesDiv.addEventListener('transitionend', transitionEndHandler);
        } else {
          // If the clicked folder is not currently open, open it
          const filesList = await listAll(subjectRef);
          const filesLinks = await Promise.all(filesList.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const fileName = itemRef.name;
            return `<li><a href="${url}" target="_blank">${fileName}</a></li>`;
          }));
          filesDiv.innerHTML = '<ul>' + filesLinks.join('') + '</ul>';
          filesDiv.style.maxHeight = `${filesDiv.scrollHeight}px`;
          currentOpenFolder = filesDiv; // Set the clicked folder as the currently open one
        }
        filesDiv.classList.toggle('active'); // Toggle the active class
      });
    });
  } catch (error) {
    console.error('Failed to render subject folders:', error);
  }
}

// Call the function to render subject folders
renderSubjectFolders();