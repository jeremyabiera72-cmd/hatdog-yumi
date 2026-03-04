import { db } from "./firebase.js";
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const itemsContainer = document.getElementById("items");

if (itemsContainer) {
    // Only fetch items that are "Approved"
    // Note: Once an item is marked "Claimed", it will automatically disappear from here
    const q = query(
        collection(db, "items"), 
        where("status", "==", "Approved"), 
        orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
        itemsContainer.innerHTML = ""; 
        
        if (snapshot.empty) {
            itemsContainer.innerHTML = "<p style='text-align:center; grid-column: 1/-1;'>No approved items to display yet.</p>";
            return;
        }

        snapshot.forEach((docSnap) => {
            const item = docSnap.data();
            const card = document.createElement("div");
            card.className = "card";
            card.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="card-content">
                    <span style="color:#2563eb; font-size:0.7rem; font-weight:bold; text-transform:uppercase;">Status: Live</span>
                    <h3 style="margin-top:5px;">${item.name}</h3>
                    <p style="font-size: 0.9rem; color: #475569;">${item.description}</p>
                    
                    <div style="margin: 15px 0; padding: 12px; background: #f8fafc; border-radius: 8px; font-size: 0.85rem; border: 1px solid #e2e8f0;">
                        <p style="font-weight:bold; margin-bottom:5px; color:#1e293b;">Contact Finder to Claim:</p>
                        <p>📞 <strong>Phone:</strong> ${item.phone || 'N/A'}</p>
                        <p>👤 <strong>FB:</strong> ${item.fb || 'N/A'}</p>
                        ${item.email ? `<p>📧 <strong>Email:</strong> ${item.email}</p>` : ''}
                    </div>

                    <div style="font-size: 0.75rem; color: #64748b; margin-bottom: 15px;">
                        📍 ${item.location} <br> 📅 Found on: ${item.date}
                    </div>

                    <button class="btn btn-primary" style="width:100%;" onclick="markAsClaimed('${docSnap.id}')">
                        Mark as Claimed
                    </button>
                </div>
            `;
            itemsContainer.appendChild(card);
        });
    }, (error) => {
        console.error("Query error:", error);
    });
}

/**
 * Updates the item status to "Claimed"
 * This removes it from the public list but keeps it in the Admin database
 */
window.markAsClaimed = async (id) => {
    const confirmation = confirm("Is this item successfully returned to its owner? \n\nThis will remove the post from the public page.");
    
    if (confirmation) {
        try {
            const itemRef = doc(db, "items", id);
            await updateDoc(itemRef, {
                status: "Claimed"
            });
            alert("Success! The item has been marked as claimed. Thank you for your honesty!");
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update status. Please try again.");
        }
    }
};