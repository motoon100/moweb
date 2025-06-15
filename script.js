import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js";

// Firebase setup (Replace with your project details)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Submit new message
document.getElementById("messageForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const messageInput = document.getElementById("messageInput");
    if (messageInput.value.trim() === "") return;

    await addDoc(collection(db, "messages"), {
        text: messageInput.value,
        timestamp: new Date()
    });

    messageInput.value = "";
});

// Display messages with edit & delete buttons
const messagesContainer = document.getElementById("messagesContainer");

onSnapshot(query(collection(db, "messages"), orderBy("timestamp", "desc")), (snapshot) => {
    messagesContainer.innerHTML = "";
    snapshot.forEach((docSnapshot) => {
        const messageData = docSnapshot.data();
        const messageId = docSnapshot.id;

        // Create message element
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Message text
        const messageText = document.createElement("span");
        messageText.textContent = messageData.text;

        // Edit button
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.onclick = () => editMessage(messageId, messageData.text);

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = () => deleteMessage(messageId);

        // Append elements
        messageElement.appendChild(messageText);
        messageElement.appendChild(editButton);
        messageElement.appendChild(deleteButton);

        messagesContainer.appendChild(messageElement);
    });
});

// Function to edit a message
const editMessage = async (id, oldText) => {
    const newText = prompt("Enter new message:", oldText);
    if (newText !== null && newText.trim() !== "") {
        await updateDoc(doc(db, "messages", id), {
            text: newText
        });
    }
};

// Function to delete a message
const deleteMessage = async (id) => {
    const confirmDelete = confirm("Are you sure you want to delete this message?");
    if (confirmDelete) {
        await deleteDoc(doc(db, "messages", id));
    }
};