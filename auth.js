/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Authentication and Session Management
 */

const Auth = {
    // Get stored session user
    getCurrentUser() {
        const userStr = localStorage.getItem('sch_user');
        if (!userStr) return null;
        try {
            return JSON.parse(userStr);
        } catch (e) {
            return null;
        }
    },

    // Check if user is logged in
    isLoggedIn() {
        return !!this.getCurrentUser();
    },

    // Check if logged-in user is an admin
    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    },

    // Login function
    async login(email, password) {
        await DataService.checkBackend();

        // 1. Try Backend REST API
        if (DataService.isBackendOnline) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('sch_token', data.token);
                    localStorage.setItem('sch_user', JSON.stringify(data.user));
                    return { success: true, user: data.user };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (err) {
                console.warn('Backend login attempt failed, falling back to local verification');
            }
        }

        // 2. Local Storage Authentication Fallback
        const users = JSON.parse(localStorage.getItem('sch_users')) || INITIAL_DEMO_DATA.users;
        const normalizedEmail = email.trim().toLowerCase();
        const user = users.find(u => u.email.toLowerCase() === normalizedEmail);

        if (!user) {
            return { success: false, message: 'Invalid email address or user not registered.' };
        }

        // Demo check: check password or match default credentials
        if (user.password === password || password === 'admin123' || password === 'user123') {
            const userPayload = {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                address: user.address || ''
            };
            localStorage.setItem('sch_user', JSON.stringify(userPayload));
            localStorage.setItem('sch_token', 'demo-jwt-token-active');
            return { success: true, user: userPayload };
        }

        return { success: false, message: 'Incorrect password entered.' };
    },

    // Register function
    async register(name, email, phone, password, address = '') {
        await DataService.checkBackend();

        if (DataService.isBackendOnline) {
            try {
                const res = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone, password, address })
                });
                const data = await res.json();
                if (data.success) {
                    localStorage.setItem('sch_token', data.token);
                    localStorage.setItem('sch_user', JSON.stringify(data.user));
                    return { success: true, user: data.user };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (e) {
                console.warn('Backend register failed, using local registration');
            }
        }

        const users = JSON.parse(localStorage.getItem('sch_users')) || [];
        const exists = users.some(u => u.email.toLowerCase() === email.trim().toLowerCase());
        if (exists) {
            return { success: false, message: 'An account with this email address already exists.' };
        }

        const newUser = {
            id: Date.now(),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            password: password,
            role: 'user',
            address: address.trim()
        };

        users.push(newUser);
        localStorage.setItem('sch_users', JSON.stringify(users));

        const userPayload = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone,
            role: newUser.role,
            address: newUser.address
        };

        localStorage.setItem('sch_user', JSON.stringify(userPayload));
        localStorage.setItem('sch_token', 'demo-jwt-token-newuser');

        return { success: true, user: userPayload };
    },

    // Logout
    logout() {
        localStorage.removeItem('sch_user');
        localStorage.removeItem('sch_token');
        UI.showToast('You have been logged out safely.', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 600);
    },

    // Dynamic Navigation Bar Updater
    updateNavUI() {
        const navActions = document.getElementById('nav-actions');
        if (!navActions) return;

        const user = this.getCurrentUser();

        if (user) {
            const isAdmin = user.role === 'admin';
            navActions.innerHTML = `
                <div class="user-badge">
                    <i class="fa-solid ${isAdmin ? 'fa-user-shield' : 'fa-circle-user'}"></i>
                    <span>${user.name.split(' ')[0]} ${isAdmin ? '(Admin)' : ''}</span>
                </div>
                ${isAdmin ? `
                    <a href="admin.html" class="btn btn-primary btn-sm">
                        <i class="fa-solid fa-gauge-high"></i> Admin Panel
                    </a>
                ` : `
                    <a href="dashboard.html" class="btn btn-outline-gold btn-sm">
                        <i class="fa-solid fa-table-columns"></i> Dashboard
                    </a>
                `}
                <button onclick="Auth.logout()" class="btn btn-navy btn-sm" title="Logout">
                    <i class="fa-solid fa-arrow-right-from-bracket"></i>
                </button>
            `;
        } else {
            navActions.innerHTML = `
                <a href="login.html" class="btn btn-outline-gold btn-sm">
                    <i class="fa-solid fa-arrow-right-to-bracket"></i> Sign In
                </a>
                <a href="register.html" class="btn btn-primary btn-sm">
                    <i class="fa-solid fa-user-plus"></i> Register
                </a>
            `;
        }
    },

    // Route Guard
    requireAuth(requiredRole = null) {
        const user = this.getCurrentUser();
        if (!user) {
            sessionStorage.setItem('sch_redirect', window.location.href);
            window.location.href = 'login.html';
            return false;
        }

        if (requiredRole && user.role !== requiredRole) {
            UI.showToast('Restricted Area: Admin privileges required.', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 800);
            return false;
        }
        return true;
    }
};

// Auto update navbar on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    Auth.updateNavUI();

    // Toggle mobile menu if present
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
});
