// --- 1. Scroll Animation ---
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active');
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// --- 2. Mobile Navigation ---
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => navLinks.classList.toggle('active'));
function closeMenu() { navLinks.classList.remove('active'); }

// --- 3. Typewriter Effect ---
const textElement = document.getElementById('typewriter-text');
const roles = ["Full Stack Developer", "Software Engineer", "Backend Architect", "Frontend Specialist"];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function type() {
    const currentRole = roles[roleIndex];
    textElement.textContent = isDeleting 
        ? currentRole.substring(0, charIndex - 1) 
        : currentRole.substring(0, charIndex + 1);
    
    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true; setTimeout(type, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; roleIndex = (roleIndex + 1) % roles.length; setTimeout(type, 500);
    } else {
        charIndex += isDeleting ? -1 : 1;
        setTimeout(type, isDeleting ? 50 : 100);
    }
}
document.addEventListener('DOMContentLoaded', type);

// --- 4. Lightbox Gallery Logic ---
let currentImages = [];
let currentIndex = 0;
const modal = document.getElementById('galleryModal');
const mainImg = document.getElementById('galleryMainImg');
const thumbnailsContainer = document.getElementById('galleryThumbnails');

function openGallery(element) {
    // Get Info
    const folderName = element.getAttribute('data-folder');
    const count = parseInt(element.getAttribute('data-count'));
    const extension = element.getAttribute('data-extension') || 'jpg';
    
    // Legacy Support (for Inflation Dynamics if it uses list)
    const imagesStr = element.getAttribute('data-images');

    currentImages = [];

    if (folderName && count > 0) {
        // FOLDER MODE (Look for img1.jpg, img2.jpg...)
        for (let i = 1; i <= count; i++) {
            currentImages.push(`assets/projects/${folderName}/img${i}.${extension}`);
        }
    } else if (imagesStr) {
        // LEGACY LIST MODE
        currentImages = imagesStr.split(',').map(url => url.trim());
    } else {
        // Empty or invalid - Do nothing
        return;
    }

    currentIndex = 0;

    // Populate Thumbnails
    thumbnailsContainer.innerHTML = '';
    currentImages.forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = `gallery-thumb ${index === 0 ? 'active' : ''}`;
        thumb.onclick = () => showImage(index);
        
        // Hide broken thumbnails
        thumb.onerror = function() { this.style.display = 'none'; };
        
        thumbnailsContainer.appendChild(thumb);
    });

    // Show Modal & First Image
    updateGalleryView();
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeGallery() {
    modal.classList.remove('show');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function changeImage(direction) {
    currentIndex += direction;
    if (currentIndex >= currentImages.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = currentImages.length - 1;
    updateGalleryView();
}

function showImage(index) {
    currentIndex = index;
    updateGalleryView();
}

function updateGalleryView() {
    mainImg.src = currentImages[currentIndex];
    const thumbs = document.querySelectorAll('.gallery-thumb');
    thumbs.forEach((t, i) => {
        if (i === currentIndex) {
            t.classList.add('active');
            t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } else {
            t.classList.remove('active');
        }
    });
}

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeGallery();
});

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('show')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowLeft') changeImage(-1);
    if (e.key === 'ArrowRight') changeImage(1);
});