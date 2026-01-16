const requestBtn = document.getElementById('request-btn');
const form = document.getElementById('waitlist-form');
const submitBtn = document.getElementById('submit-btn');
const emailInput = document.getElementById('email-input');
const formMessage = document.getElementById('form-message');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');

// Show email form when "Request Early Access" is clicked
requestBtn.addEventListener('click', () => {
    // Fade out button first
    requestBtn.classList.add('hiding');
    
    // Show form and animate in
    setTimeout(() => {
        form.style.display = '';
        requestBtn.style.display = 'none';
        // Force reflow to ensure transition works
        form.offsetHeight;
        form.classList.add('is-visible');
        
        // Focus input after animation
        setTimeout(() => {
            emailInput.focus();
        }, 300);
    }, 200);
});

// Typing animation for heading
// Typing animation removed - using fade-in instead

// Add scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.querySelectorAll('.fade-in, .fade-in-delay, .fade-in-delay-2').forEach(el => {
    observer.observe(el);
});

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    if (!email) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }

    // Show loading state
    setLoadingState(true);
    hideMessage();
    emailInput.disabled = true;

    try {
        // Send email to joey@comethru.co
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Thank you. We\'ll be in touch soon.', 'success');
            emailInput.value = '';
            form.classList.remove('is-visible');
            requestBtn.style.display = 'flex';
        } else {
            const errorMsg = data.details || data.error || data.message || 'Something went wrong. Please try again.';
            console.error('API Error:', data);
            showMessage(errorMsg, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Unable to connect. Please try again later.', 'error');
    } finally {
        setLoadingState(false);
        emailInput.disabled = false;
    }
});

function setLoadingState(isLoading) {
    submitBtn.disabled = isLoading;
    if (isLoading) {
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
    } else {
        btnText.style.display = 'block';
        btnLoader.style.display = 'none';
    }
}

function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

function hideMessage() {
    formMessage.style.display = 'none';
    formMessage.className = 'form-message';
}
