function showSection(sectionId) {
    // Hides all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
    });
    
    // Shows the selected section
    document.getElementById(sectionId).classList.remove('hidden');
    
    // Updates navigation active states
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.textContent.toLowerCase().includes(sectionId.toLowerCase())) {
            link.classList.add('active');
        }
    });
}

// Shows home section by default
window.addEventListener('load', function() {
    showSection('home');
});