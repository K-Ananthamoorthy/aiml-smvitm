import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// Function to fetch Firebase configuration from the server
async function fetchFirebaseConfig() {
  try {
    const response = await fetch('/auth-config');
    if (!response.ok) {
      throw new Error('Failed to fetch Firebase configuration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching Firebase configuration:', error);
    return null;
  }
}

// Function to initialize Firebase with fetched configuration
async function initializeFirebase() {
  const firebaseConfig = await fetchFirebaseConfig();
  if (!firebaseConfig) {
    console.error('Firebase configuration not available.');
    return null;
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const storage = getStorage();

  return { app, storage };
}


// Call the function to initialize Firebase and render subject folders
initializeFirebase().then(({ app, storage }) => {
  renderFolders('folder-notes', 'notes', storage);
  renderFolders('folder-textbooks', 'textbooks', storage);
  renderFolders('folder-tie', 'tie_imp', storage);
  renderFolders('folder-oldpapers', 'oldpapers', storage);
}).catch(error => {
  console.error('Failed to initialize Firebase:', error);
});

let currentOpenFolder = null;

// Function to render subject folders
async function renderFolders(containerId, folderName, storage) {
  const foldersDiv = document.getElementById(containerId);
  if (!foldersDiv) {
    console.error('Folders container not found.');
    return;
  }
  try {
    const folderRef = ref(storage, folderName);
    const folderList = await listAll(folderRef);
    folderList.prefixes.forEach(async (subjectRef) => {
      const subjectName = subjectRef.name.split('/').pop(); // Extract subject name from folder path
      const subjectDiv = document.createElement('div');
      const filesDiv = document.createElement('div');
      filesDiv.classList.add('subfolder');
      subjectDiv.innerHTML = `<h3>${subjectName.toUpperCase()}</h3>`;
      subjectDiv.classList.add('subject-folder');
      subjectDiv.appendChild(filesDiv);
      foldersDiv.appendChild(subjectDiv);

      subjectDiv.addEventListener('click', async () => {
        const transitionEndHandler = (event) => {
          if (event.propertyName === 'max-height') {
            event.target.innerHTML = '';
            event.target.removeEventListener('transitionend', transitionEndHandler);
          }
        };

        if (currentOpenFolder && currentOpenFolder !== filesDiv) {
          currentOpenFolder.style.maxHeight = null;
          currentOpenFolder.classList.remove('active');
          currentOpenFolder.addEventListener('transitionend', transitionEndHandler);
        }
        if (filesDiv.classList.contains('active')) {
          filesDiv.style.maxHeight = null;
          filesDiv.addEventListener('transitionend', transitionEndHandler);
        } else {
          const filesList = await listAll(subjectRef);
          const filesLinks = await Promise.all(filesList.items.map(async (itemRef) => {
            const url = await getDownloadURL(itemRef);
            const fileName = itemRef.name;
            return `<li><a href="${url}" target="_blank">${fileName}</a></li>`;
          }));
          filesDiv.innerHTML = '<ul>' + filesLinks.join('') + '</ul>';
          filesDiv.style.maxHeight = `${filesDiv.scrollHeight}px`;
          currentOpenFolder = filesDiv;
        }
        filesDiv.classList.toggle('active');
      });
    });
  } catch (error) {
    console.error('Failed to render subject folders:', error);
  }
}
