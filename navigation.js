function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
            section.classList.add('visible');
        } else {
            section.classList.add('hidden');
            section.classList.remove('visible');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.getElementById(`nav-${sectionId}`);
    if (activeLink) activeLink.classList.add('active');
}


// Shows home section by default
window.addEventListener('load', function() {
    showSection('home');
});