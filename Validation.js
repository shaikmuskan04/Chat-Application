import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase- app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https:// www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/ firebasejs/10.12.4/firebase-database.js";
const firebaseConfig = {
apiKey: "AIzaSyAUrb5jDB35cjsVnRd-ZxMHw576gVVtPmA",
authDomain: "chat-application-83b31.firebaseapp.com",
databaseURL: "https://chat-application-83b31-default-rtdb.firebaseio.com", projectId: "chat-application-83b31",
storageBucket: "chat-application-83b31.appspot.com", messagingSenderId: "798019972509",
appId: "1:798019972509:web:a322d78dc989b13ee25374",
measurementId: "G-QZH9KHEH4J"
};
const app = initializeApp(firebaseConfig); const auth = getAuth(app);
const db = getDatabase(app);
// Login Functionality $(document).ready(() => {
$("#aunthenticateUser").on("click", () => { const email = $("#email").val();
const password = $("#password").val();
if (validateLogin(email, password)) { signInWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
window.location.href = "start-chat.html"; })
.catch((error) => {
$("#emailErr").text(error.message); });
} });
// Signup Functionality $("#saveUser").on("click", () => {
const name = $("#name").val(); const email = $("#email").val();
 const password = $("#password").val();
const confirmPassword = $("#confirm_password").val();
if (validateSignup(name, email, password, confirmPassword)) { createUserWithEmailAndPassword(auth, email, password)
.then((userCredential) => {
window.location.href = "index.html"; })
.catch((error) => {
$("#emailErr").text(error.message); });
} });
// Real-time Message Loading
const chatBox = $("#chatBox"); const chatInput = $(".chat");
const chatButton = $(".btn-primary");
// Load Messages from Firebase onAuthStateChanged(auth, (user) => {
if (user) {
const messagesRef = ref(db, 'messages'); onChildAdded(messagesRef, (snapshot) => {
const messageData = snapshot.val(); const messageElement = `
<li class="${messageData.sender === user.email ? 'sent' : 'reply'}"> <p class="chat-bubble ${messageData.sender === user.email ?
'from-message' : 'to-message'}">${messageData.message}</p> </li>`;
chatBox.append(messageElement);
chatBox.scrollTop(chatBox[0].scrollHeight); });
} else {
window.location.href = "index.html"; }
});
// Send Message chatButton.on("click", () => {
sendMessage(); });
chatInput.on("keypress", (event) => { if (event.keyCode === 13) {
sendMessage(); }
});

 function sendMessage() {
const message = chatInput.val(); const user = auth.currentUser;
if (message && user) {
const messagesRef = ref(db, 'messages'); push(messagesRef, {
sender: user.email,
message: message });
chatInput.val(''); }
}
// Logout Functionality $(".fa-power-off").on("click", () => {
signOut(auth).then(() => {
window.location.href = "index.html"; });
}); });
// Validation Functions
function validateLogin(email, password) {
let valid = true; if (!email) {
$("#emailErr").text("Email is required.");
valid = false; } else {
$("#emailErr").text(""); }
if (!password) {
$("#passwordErr").text("Password is required."); valid = false;
} else {
$("#passwordErr").text(""); }
return valid; }
function validateSignup(name, email, password, confirmPassword) { let valid = true;
if (!name) {
$("#nameErr").text("Name is required."); valid = false;

} else {
$("#nameErr").text(""); }
if (!email) {
$("#emailErr").text("Email is required."); valid = false;
} else {
$("#emailErr").text(""); }
if (!password) {
$("#passwordErr").text("Password is required."); valid = false;
} else {
$("#passwordErr").text(""); }
if (password !== confirmPassword) { $("#confirmPasswordErr").text("Passwords do not match."); valid = false;
} else {
$("#confirmPasswordErr").text(""); }
return valid;
}
