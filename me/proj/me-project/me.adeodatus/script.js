// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Animate projects on scroll
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Typewriter effect for roles
const roles = ['Full Stack Developer', 'AI Engineer', 'Problem Solver'];
let currentRole = 0;
let currentChar = 0;
const roleElement = document.querySelector('.typewriter');

function typeWriter() {
    if (currentChar < roles[currentRole].length) {
        roleElement.textContent += roles[currentRole].charAt(currentChar);
        currentChar++;
        setTimeout(typeWriter, 100);
    } else {
        setTimeout(eraseText, 2000);
    }
}

function eraseText() {
    if (currentChar > 0) {
        roleElement.textContent = roles[currentRole].substring(0, currentChar - 1);
        currentChar--;
        setTimeout(eraseText, 50);
    } else {
        currentRole = (currentRole + 1) % roles.length;
        setTimeout(typeWriter, 500);
    }
}

// Start the typewriter effect
typeWriter(); 