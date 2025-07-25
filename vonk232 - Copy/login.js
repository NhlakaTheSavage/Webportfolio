// DOM Elements
const tabBtns = document.querySelectorAll('.tab-btn');
const forms = document.querySelectorAll('.form');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const socialBtns = document.querySelectorAll('.social-btn');

// Tab Switching
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all tabs and forms
        tabBtns.forEach(b => b.classList.remove('active'));
        forms.forEach(f => f.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding form
        btn.classList.add('active');
        const formId = btn.getAttribute('data-tab') + '-form';
        document.getElementById(formId).classList.add('active');
    });
});

// Login Form Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate inputs
    if (!email || !password) {
        showError('Please fill in all fields');
        return;
    }
    
    // Here you would normally send a request to your authentication API
    console.log('Login attempt:', { email, password, remember });
    
    // For demo purposes, simulate successful login
    simulateLogin(email);
});

// Sign Up Form Submission
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
        showError('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showError('Passwords do not match');
        return;
    }
    
    if (!terms) {
        showError('You must agree to the Terms of Service');
        return;
    }
    
    // Here you would normally send a request to your registration API
    console.log('Signup attempt:', { name, email, password });
    
    // For demo purposes, simulate successful registration
    simulateRegistration(name, email);
});

// Social Login Buttons
socialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const provider = btn.classList.contains('google') ? 'Google' : 'Facebook';
        console.log(`Attempting to login with ${provider}`);
        
        // Here you would normally redirect to OAuth provider
        // For demo purposes, simulate successful social login
        simulateSocialLogin(provider);
    });
});

// Helper Functions

// Show error message
function showError(message) {
    // Check if error element already exists
    let errorElement = document.querySelector('.error-message');
    
    if (!errorElement) {
        // Create error element if it doesn't exist
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.style.backgroundColor = '#ff4d4f';
        errorElement.style.color = 'white';
        errorElement.style.padding = '10px';
        errorElement.style.borderRadius = '4px';
        errorElement.style.marginBottom = '15px';
        errorElement.style.textAlign = 'center';
        
        // Insert at the top of the active form
        const activeForm = document.querySelector('.form.active');
        activeForm.insertBefore(errorElement, activeForm.firstChild);
    }
    
    // Set error message
    errorElement.textContent = message;
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

// Simulate login (for demo purposes)
function simulateLogin(email) {
    showLoading();
    
    // Simulate API request delay
    setTimeout(() => {
        hideLoading();
        // Redirect to main app
        window.location.href = 'index.html';
    }, 1500);
}

// Simulate registration (for demo purposes)
function simulateRegistration(name, email) {
    showLoading();
    
    // Simulate API request delay
    setTimeout(() => {
        hideLoading();
        // Show success message
        showSuccess('Account created successfully! Redirecting to login...');
        
        // Switch to login tab after 2 seconds
        setTimeout(() => {
            tabBtns[0].click();
            // Pre-fill email field
            document.getElementById('login-email').value = email;
        }, 2000);
    }, 1500);
}

// Simulate social login (for demo purposes)
function simulateSocialLogin(provider) {
    showLoading();
    
    // Simulate API request delay
    setTimeout(() => {
        hideLoading();
        // Redirect to main app
        window.location.href = 'index.html';
    }, 1500);
}

// Show loading indicator
function showLoading() {
    // Disable form submission
    const activeForm = document.querySelector('.form.active');
    const submitBtn = activeForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
}

// Hide loading indicator
function hideLoading() {
    const activeForm = document.querySelector('.form.active');
    const submitBtn = activeForm.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
    submitBtn.innerHTML = activeForm.id === 'login-form' ? 'Login' : 'Create Account';
}

// Show success message
function showSuccess(message) {
    // Check if success element already exists
    let successElement = document.querySelector('.success-message');
    
    if (!successElement) {
        // Create success element if it doesn't exist
        successElement = document.createElement('div');
        successElement.className = 'success-message';
        successElement.style.backgroundColor = '#52c41a';
        successElement.style.color = 'white';
        successElement.style.padding = '10px';
        successElement.style.borderRadius = '4px';
        successElement.style.marginBottom = '15px';
        successElement.style.textAlign = 'center';
        
        // Insert at the top of the active form
        const activeForm = document.querySelector('.form.active');
        activeForm.insertBefore(successElement, activeForm.firstChild);
    }
    
    // Set success message
    successElement.textContent = message;
    
    // Remove success message after 3 seconds
    setTimeout(() => {
        successElement.remove();
    }, 3000);
}

// Check if user is already logged in (for demo purposes)
function checkLoggedInStatus() {
    // In a real app, you would check for a valid token in localStorage or cookies
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // Redirect to main app
        window.location.href = 'index.html';
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    checkLoggedInStatus();
});