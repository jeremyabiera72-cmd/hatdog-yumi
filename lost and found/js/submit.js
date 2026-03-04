import { db } from "./firebase.js";
import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Helper function for ImgBB Upload
async function uploadToImgBB(file) {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch("https://api.imgbb.com/1/upload?key=fa0a284c3740c0ae00d2c54c2b2de444", {
        method: "POST",
        body: formData
    });
    const data = await res.json();
    if (!data.success) throw new Error("Image upload failed");
    return data.data.url;
}

// --- HANDLE LOST & FOUND ITEM SUBMISSION (index.html) ---
const itemForm = document.getElementById("submitForm");
if (itemForm) {
    itemForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById("submitBtn") || itemForm.querySelector("button[type='submit']");
        btn.disabled = true; 
        btn.innerText = "Uploading to Server...";

        try {
            const file = document.getElementById("image").files[0];
            const imageUrl = await uploadToImgBB(file);
            
            await addDoc(collection(db, "items"), {
                name: document.getElementById("name").value,
                description: document.getElementById("desc").value,
                location: document.getElementById("place").value,
                date: document.getElementById("date").value,
                phone: document.getElementById("contactPhone").value,
                fb: document.getElementById("contactFB").value,
                email: document.getElementById("contactEmail").value,
                image: imageUrl,
                status: "Pending",
                createdAt: serverTimestamp()
            });

            alert("Item submitted successfully! Jeremy will review this shortly.");
            location.reload();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit item.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Submit Report";
        }
    });
}

// --- HANDLE PROBLEM REPORTS (report-problems.html) ---
const reportForm = document.getElementById("reportForm");
if (reportForm) {
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById("submitBtn");
        btn.disabled = true;
        btn.innerText = "Sending...";

        try {
            await addDoc(collection(db, "reports"), {
                name: document.getElementById("reporterName").value,
                category: document.getElementById("reportCategory").value,
                description: document.getElementById("reportDesc").value,
                status: "New",
                createdAt: serverTimestamp()
            });

            alert("Support ticket sent to Admin Jeremy!");
            reportForm.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send report.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Submit Support Ticket";
        }
    });
}

// --- HANDLE CONTACT DEVELOPER REPORTS (contact-developer.html) ---
const contactDevForm = document.getElementById("contactDevForm");
if (contactDevForm) {
    contactDevForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = document.getElementById("devSubmitBtn");
        btn.disabled = true;
        btn.innerText = "Sending Ticket...";

        try {
            await addDoc(collection(db, "reports"), {
                name: "Contact Page User", 
                category: document.getElementById("devIssueCategory").value,
                description: document.getElementById("devIssueDesc").value,
                status: "New",
                createdAt: serverTimestamp()
            });

            alert("Ticket submitted successfully to the developer!");
            contactDevForm.reset();
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to submit ticket.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Submit Report";
        }
    });
}

// --- HANDLE HELP US IMPROVE (help-us-improve.html) ---
const feedbackForm = document.querySelector(".feedback-card form");
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = feedbackForm.querySelector(".submit-btn");
        
        // Get the selected emoji from the .selected class
        const selectedRating = feedbackForm.querySelector(".rating-btn.selected").innerText;
        // Get textareas (0 is features, 1 is comments)
        const textareas = feedbackForm.querySelectorAll("textarea");
        
        btn.disabled = true;
        btn.innerText = "Sending Feedback...";

        try {
            await addDoc(collection(db, "feedback"), {
                rating: selectedRating,
                suggestedFeatures: textareas[0].value,
                generalComments: textareas[1].value,
                createdAt: serverTimestamp()
            });

            alert("Feedback sent! Thank you for helping us improve MNHS Portal.");
            feedbackForm.reset();
            // Reset emoji selection to default
            const buttons = feedbackForm.querySelectorAll('.rating-btn');
            buttons.forEach(b => b.classList.remove('selected'));
            buttons[2].classList.add('selected'); // Default back to 😊
            
        } catch (error) {
            console.error("Error sending feedback:", error);
            alert("Could not send feedback at this time.");
        } finally {
            btn.disabled = false;
            btn.innerText = "Send Feedback";
        }
    });
}