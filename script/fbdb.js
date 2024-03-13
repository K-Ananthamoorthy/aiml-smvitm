// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL, uploadBytes } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Function to upload files to Firebase Storage
function uploadFile(subject) {
  const fileInput = document.getElementById(`file-upload-${subject}`);
  const file = fileInput.files[0];
  const storageRef = ref(storage, `notes/${subject}/${file.name}`);
  const uploadTask = uploadBytes(storageRef, file);
  uploadTask.on('state_changed', 
    (snapshot) => {
      // Track upload progress
    },
    (error) => {
      // Handle unsuccessful upload
      console.error('Error uploading file:', error);
    },
    () => {
      // Handle successful upload
      console.log('File uploaded successfully!');
    }
  );
}

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

// Function to render subject folders
async function renderSubjectFolders() {
    const mainDiv = document.getElementById('main-container');
    if (!mainDiv) {
      console.error('Main container not found.');
      return;
    }
    try {
      const notesRef = ref(storage, 'notes');
      const notesList = await listAll(notesRef);
      notesList.prefixes.forEach(async (subjectRef) => {
        const subjectName = subjectRef.name.split('/')[1]; // Extract subject name from folder path
        const filesList = await listAll(subjectRef);
        const filesLinks = await Promise.all(filesList.items.map(async (itemRef) => {
          const url = await getDownloadURL(itemRef);
          const fileName = itemRef.name.split('/')[2]; // Extract file name from file path
          return `<li><a href="${url}" target="_blank">${fileName}</a></li>`;
        }));
        const subjectDiv = document.createElement('div');
        subjectDiv.innerHTML = `
          <h3>${subjectName}</h3>
          <ul>${filesLinks.join('')}</ul>
        `;
        mainDiv.appendChild(subjectDiv);
      });
    } catch (error) {
      console.error('Error rendering subject folders:', error);
    }
  }
  
  // Call the function to render subject folders
  renderSubjectFolders();
});