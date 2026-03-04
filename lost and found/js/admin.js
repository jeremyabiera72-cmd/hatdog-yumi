// Step out of public if this is called from an HTML inside public
import { db, auth } from "./firebase.js"; 
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const ADMIN_EMAIL = "cake@mlangnhs.edu.ph";

// --- LOGIN LOGIC ---
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.onclick = async (e) => {
    e.preventDefault(); 
    const email = document.getElementById("adminEmail").value;
    const pass = document.getElementById("adminPass").value;
    
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Login Error:", error.code, error.message);
      alert("Access Denied: " + error.message);
    }
  };
}

// --- DASHBOARD SYNC & AUTH STATE ---
onAuthStateChanged(auth, (user) => {
  const loginSec = document.getElementById("login");
  const dashSec = document.getElementById("dashboard");
  const itemList = document.getElementById("pendingItems");
  const feedbackList = document.getElementById("feedbackContainer"); // Make sure this ID exists in admin.html

  if (user && user.email === ADMIN_EMAIL) {
    if(loginSec) loginSec.classList.add("hidden");
    if(dashSec) dashSec.classList.remove("hidden");

    // 1. SYNC ITEMS (Lost & Found)
    if (itemList) {
      onSnapshot(query(collection(db, "items"), orderBy("createdAt", "desc")), (snap) => {
        itemList.innerHTML = "";
        snap.forEach(d => {
          const item = d.data();
          let statusColor = "#facc15"; 
          if (item.status === "Approved") statusColor = "#10b981"; 
          if (item.status === "Claimed") statusColor = "#64748b"; 
          
          itemList.innerHTML += `
            <div class="card" style="border-left: 5px solid ${statusColor}; opacity: ${item.status === 'Claimed' ? '0.7' : '1'}">
              <img src="${item.image}" style="width:100%; height:150px; object-fit:cover;">
              <div style="padding: 1rem;">
                <span style="font-size: 0.7rem; font-weight: bold; color: ${statusColor}; text-transform: uppercase;">
                   ● ${item.status}
                </span>
                <h3 style="margin-top: 5px;">${item.name}</h3>
                <div style="font-size: 0.8rem; color: #475569; margin: 10px 0; padding: 8px; background: #f8fafc; border-radius: 6px;">
                    <strong>Finder:</strong> ${item.fb || 'N/A'}<br>
                    📞 ${item.phone || 'N/A'}
                </div>
                <div style="margin-top: 10px; display: flex; gap: 5px;">
                  ${item.status === "Pending" ? 
                    `<button class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="approveItem('${d.id}')">Approve</button>` : ''}
                  <button class="btn" style="background:#ef4444; color:white; padding: 5px 10px; font-size: 0.8rem;" onclick="deleteItem('${d.id}')">Delete</button>
                </div>
              </div>
            </div>`;
        });
      });
    }

    // 2. SYNC FEEDBACK (Help Us Improve)
    if (feedbackList) {
      onSnapshot(query(collection(db, "feedback"), orderBy("createdAt", "desc")), (snap) => {
        feedbackList.innerHTML = "";
        if (snap.empty) feedbackList.innerHTML = "<p style='color:gray;'>No feedback received yet.</p>";
        
        snap.forEach(d => {
          const fb = d.data();
          feedbackList.innerHTML += `
            <div class="card" style="padding: 1.5rem; border-top: 4px solid #2563eb;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size: 1.5rem;">${fb.rating}</span>
                <button onclick="deleteFeedback('${d.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;">🗑️</button>
              </div>
              <p style="margin-top:10px; font-size:0.9rem;"><strong>Features:</strong> ${fb.suggestedFeatures || 'No suggestion'}</p>
              <p style="margin-top:5px; font-size:0.9rem;"><strong>Comments:</strong> ${fb.generalComments || 'No comments'}</p>
              <small style="color:gray; display:block; margin-top:10px;">${fb.createdAt?.toDate().toLocaleDateString() || ''}</small>
            </div>`;
        });
      });
    }

  } else {
    if(loginSec) loginSec.classList.remove("hidden");
    if(dashSec) dashSec.classList.add("hidden");
  }
});

// --- GLOBAL ACTIONS ---
window.approveItem = async (id) => {
    try {
        await updateDoc(doc(db, "items", id), { status: "Approved" });
        alert("Item is now live!");
    } catch (err) { alert("Error: " + err.message); }
};

window.deleteItem = async (id) => {
    if(confirm("Permanently delete this item?")) {
        await deleteDoc(doc(db, "items", id));
    }
};

window.deleteFeedback = async (id) => {
    if(confirm("Delete this feedback entry?")) {
        await deleteDoc(doc(db, "feedback", id));
    }
};

window.logoutAdmin = () => signOut(auth).then(() => location.reload());