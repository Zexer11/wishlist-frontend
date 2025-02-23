const BASE_URL = 'https://wishlist-api-r8zs.onrender.com/api/wishlist';
const PARTICIPANTS_URL = 'https://wishlist-api-r8zs.onrender.com/api/participants';



// Function to mark an item as purchased and update backend
async function markPurchased(checkbox, itemId) {
    const item = checkbox.closest('.bg-white');
    if (!item) return;
    
    const purchased = checkbox.checked;
    item.style.opacity = purchased ? '0.6' : '1';
    item.style.textDecoration = purchased ? 'line-through' : 'none';

    try {
        const response = await fetch(`${BASE_URL}/${itemId}/purchased`, { method: 'PATCH' });
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        console.log(`Item ${itemId} marked as purchased:`, purchased);
    } catch (error) {
        console.error("Error updating purchased status:", error);
    }
}

// Function to fetch wishlist from backend
async function fetchWishlist() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
        
        const wishlist = await response.json();
        console.log("Fetched wishlist:", wishlist);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
    }
}

// Function to fetch participants from backend
async function fetchParticipants() {
    try {
        const response = await fetch(PARTICIPANTS_URL);
        const participants = await response.json();
        
        const participantsList = document.getElementById('participantsList');
        participantsList.innerHTML = ''; // Clear previous content

        participants.forEach(participant => {
            const participantDiv = document.createElement('div');
            participantDiv.className = 'mb-3 p-3 bg-gray-100 rounded-lg';
            participantDiv.innerHTML = `
                <p class="text-sm font-medium">${participant.name}</p>
                <p class="text-xs text-gray-600">${participant.email}</p>
            `;
            participantsList.appendChild(participantDiv);
        });
    } catch (error) {
        console.error("Error fetching participants:", error);
    }
}

// Function to register the current user automatically
async function registerParticipant() {
    try {
        const userData = {
            name: "Guest User", // Replace with actual user data if available
            email: "guest@example.com" // Ideally, fetch from authentication system
        };

        await fetch(PARTICIPANTS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        console.log("User registered successfully!");
        fetchParticipants(); // Refresh the participant list
    } catch (error) {
        console.error("Error registering participant:", error);
    }
}

// Ensure script runs after DOM loads
document.addEventListener("DOMContentLoaded", async function() {
    await registerParticipant(); // Register user on page load
    await fetchParticipants();   // Fetch updated participant list
    fetchWishlist();

    // Add event listener for profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const bio = document.getElementById('bio').value;
            alert(`Profile Updated!\nName: ${name}\nEmail: ${email}\nBio: ${bio}`);
        });
    }

    // Add event listener for edit profile form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            console.log("Save button clicked!");
            const newUsername = document.getElementById('usernameInput').value.trim();
            const newProfilePic = document.getElementById('profilePicPreview')?.src;
            
            if (newUsername) {
                document.getElementById('username').textContent = newUsername;
            }
            if (newProfilePic) {
                document.getElementById('profilePic').src = newProfilePic;
            }
            closeEditModal();
        });
    }

    
});

// Comment system
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commentInput = this.previousElementSibling;
            const commentText = commentInput.value.trim();
            if (commentText) {
                const commentsList = this.closest('.comments-section').querySelector('.comments-list');
                const newComment = document.createElement('div');
                newComment.classList.add('comment');
                newComment.textContent = commentText;
                commentsList.appendChild(newComment);
                commentInput.value = ''; 
            }
        });
    });
});


// Share Wishlist
function shareWishlist() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('Wishlist link copied to clipboard!');
    });
}

// Open and close edit modal
function openEditModal() {
    console.log("Opening modal...");
    document.getElementById('editModal')?.classList.add('active');
}

function closeEditModal() {
    console.log("Closing modal...");
    document.getElementById('editModal')?.classList.remove('active');
}

// Close modal when clicking outside of it
window.addEventListener('click', (event) => {
    const modal = document.getElementById('editModal');
    if (modal && event.target === modal) {
        closeEditModal();
    }
});

// Preview Profile Picture
function previewProfilePic(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('profilePicPreview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

// Save Profile (Update Profile Section)
document.getElementById('editProfileForm').addEventListener('submit', function (e) {
    e.preventDefault(); // Prevent form from submitting

    // Get updated values
    const newProfilePic = document.getElementById('profilePicPreview').src;
    const newUsername = document.getElementById('usernameInput').value.trim();

    // Ensure username is not empty before updating
    if (newUsername !== "") {
        document.getElementById('username').textContent = newUsername;
    }

    // Update profile picture
    document.getElementById('profilePic').src = newProfilePic;

    // Close Modal
    closeEditModal();
});

document.addEventListener('DOMContentLoaded', function () {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!lightbox || !lightboxImg || !lightboxClose) {
        console.error("Lightbox elements not found in the DOM.");
        return;
    }

    document.querySelectorAll('.bg-white img').forEach(img => {
        img.addEventListener('click', function () {
            lightboxImg.src = this.src;
            lightbox.classList.remove('hidden');
            lightbox.style.display = "flex"; // Ensure visibility
        });
    });

    lightboxClose.addEventListener('click', function () {
        lightbox.classList.add('hidden');
        lightbox.style.display = "none"; // Ensure hiding
    });

    lightbox.addEventListener('click', function (e) {
        if (e.target !== lightboxImg) {
            lightbox.classList.add('hidden');
            lightbox.style.display = "none";
        }
    });
});

function previewImage(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const uploadedImage = input.nextElementSibling.querySelector('.uploaded-image');
            const deleteBtn = input.nextElementSibling.querySelector('.delete-btn');

            if (uploadedImage) {
                uploadedImage.src = e.target.result;
                uploadedImage.classList.remove('hidden');
                deleteBtn.classList.remove('hidden');
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function deleteImage(button) {
    const uploadedImage = button.previousElementSibling;
    const input = button.closest('.relative').previousElementSibling; 

    if (uploadedImage) {
        uploadedImage.src = "";
        uploadedImage.classList.add('hidden');
    }
    if (button) {
        button.classList.add('hidden');
    }
    if (input) {
        input.value = ""; // Clear the input
    }
}
