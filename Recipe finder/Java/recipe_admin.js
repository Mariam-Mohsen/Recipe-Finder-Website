document.addEventListener('DOMContentLoaded', function() {
    // Check admin authentication status
    checkAdminAuth();
    
    // Add navigation controls
    setupNavigation();
    
    // Add dashboard functionality
    initializeDashboard();
});

function checkAdminAuth() {
    // Check if admin is logged in (using sessionStorage)
    const isAdmin = sessionStorage.getItem('isAdmin') === 'true';
    const adminId = sessionStorage.getItem('adminId');
    
    if (!isAdmin || !adminId) {
        window.location.href = 'login.html';
    }
}

function setupNavigation() {
    // Handle logout functionality
    const nav = document.querySelector('nav');
    const logoutBtn = document.createElement('button');
    logoutBtn.textContent = 'Logout';
    logoutBtn.className = 'logout-btn';
    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('isAdmin');
        sessionStorage.removeItem('adminId');
        window.location.href = 'login.html';
    });
    nav.appendChild(logoutBtn);

    // Add active state to current page
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

function initializeDashboard() {
    // Add hover effects to category cards
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.querySelector('.category-image').style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.querySelector('.category-image').style.transform = 'scale(1)';
        });
    });

    // Add click handlers for category cards
    document.querySelectorAll('.category-card a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            // Add loading state
            this.parentElement.classList.add('loading');
            setTimeout(() => {
                window.location.href = this.getAttribute('href');
            }, 500);
        });
    });

    // Add session timeout check
    let timeout;
    function resetTimeout() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            sessionStorage.removeItem('isAdmin');
            sessionStorage.removeItem('adminId');
            window.location.href = 'login.html';
        }, 1800000); // 30 minute timeout
    }

    // Reset timeout on user activity
    document.addEventListener('mousemove', resetTimeout);
    document.addEventListener('keypress', resetTimeout);
    resetTimeout();
}