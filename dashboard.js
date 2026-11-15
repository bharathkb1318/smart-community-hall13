/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * User Dashboard Logic (Bookings History, Invoice, Cancellation & Profile)
 */

let userBookings = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Guard route: requires user authentication
    if (!Auth.requireAuth()) return;

    const user = Auth.getCurrentUser();

    // 2. Populate User Profile Data
    updateUserProfileHeader(user);

    // 3. Tab navigation within Dashboard (Bookings vs Profile)
    initNavigationTabs();

    // 4. Load Bookings
    await loadUserBookings();

    // 5. Booking Filter Tabs (All, Approved, Pending, Cancelled)
    initStatusFilterTabs();

    // 6. Profile Form Submission
    const profileForm = document.getElementById('user-profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }
});

function updateUserProfileHeader(user) {
    if (!user) return;
    const nameEls = document.querySelectorAll('.user-display-name');
    nameEls.forEach(el => el.textContent = user.name);

    const emailEl = document.getElementById('user-display-email');
    if (emailEl) emailEl.textContent = user.email;

    const avatarInitial = document.getElementById('user-avatar-initial');
    if (avatarInitial) avatarInitial.textContent = user.name.charAt(0).toUpperCase();

    // Fill form inputs
    if (document.getElementById('profile-name')) document.getElementById('profile-name').value = user.name || '';
    if (document.getElementById('profile-email')) document.getElementById('profile-email').value = user.email || '';
    if (document.getElementById('profile-phone')) document.getElementById('profile-phone').value = user.phone || '';
    if (document.getElementById('profile-address')) document.getElementById('profile-address').value = user.address || '';
}

function initNavigationTabs() {
    const navItems = document.querySelectorAll('.sidebar-nav-item[data-tab]');
    const tabPanes = document.querySelectorAll('.dashboard-tab-pane');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tabId = item.getAttribute('data-tab');
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            tabPanes.forEach(pane => {
                pane.style.display = pane.id === `tab-${tabId}` ? 'block' : 'none';
            });
        });
    });
}

function initStatusFilterTabs() {
    const filterBtns = document.querySelectorAll('.tab-btn[data-status]');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-status');
            renderBookingsTable();
        });
    });
}

async function loadUserBookings() {
    const user = Auth.getCurrentUser();
    userBookings = await DataService.getUserBookings(user.id);

    // Update KPI Stat Counters
    const total = userBookings.length;
    const approved = userBookings.filter(b => b.status === 'approved' || b.status === 'completed').length;
    const pending = userBookings.filter(b => b.status === 'pending').length;
    const cancelled = userBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected').length;

    document.getElementById('kpi-total-bookings').textContent = total;
    document.getElementById('kpi-approved-bookings').textContent = approved;
    document.getElementById('kpi-pending-bookings').textContent = pending;
    document.getElementById('kpi-cancelled-bookings').textContent = cancelled;

    renderBookingsTable();
}

function renderBookingsTable() {
    const tbody = document.getElementById('user-bookings-tbody');
    if (!tbody) return;

    let filtered = [...userBookings];
    if (currentFilter !== 'all') {
        filtered = filtered.filter(b => b.status === currentFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: var(--text-muted);">
                    <i class="fa-solid fa-calendar-xmark fa-2x" style="margin-bottom: 10px; display: block; color: var(--gold-primary);"></i>
                    No bookings found in this category.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(b => {
        const canCancel = b.status === 'pending' || b.status === 'approved';

        return `
            <tr>
                <td><strong>${b.booking_reference}</strong></td>
                <td>
                    <div style="font-weight: 600; color: var(--navy-primary);">${b.hall_name}</div>
                    <small style="color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${b.hall_location || 'Bangalore'}</small>
                </td>
                <td>
                    <div>${UI.formatDate(b.booking_date)}</div>
                    <small style="color: var(--text-muted);">${b.start_time} - ${b.end_time}</small>
                </td>
                <td><span class="facility-pill">${b.event_type}</span></td>
                <td><strong>${UI.formatCurrency(b.total_amount)}</strong></td>
                <td><span class="status-pill status-${b.status}">${b.status}</span></td>
                <td>
                    <div class="actions-cell">
                        <button onclick="viewInvoiceModal(${b.id})" class="btn-icon" title="View & Print Invoice">
                            <i class="fa-solid fa-receipt"></i>
                        </button>
                        ${canCancel ? `
                            <button onclick="promptCancelBooking(${b.id})" class="btn-icon btn-icon-danger" title="Cancel Booking">
                                <i class="fa-solid fa-ban"></i>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Invoice Modal Viewer
function viewInvoiceModal(bookingId) {
    const b = userBookings.find(item => Number(item.id) === Number(bookingId));
    if (!b) return;

    let modal = document.getElementById('invoice-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'invoice-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const hallRent = b.hall_rate || (b.total_amount / 1.18);
    const tax = b.tax_amount || (hallRent * 0.18);
    const deposit = b.deposit_amount || 5000;

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-header">
                <h3><i class="fa-solid fa-file-invoice"></i> Booking Confirmation & Invoice</h3>
                <button class="modal-close-btn" onclick="closeInvoiceModal()">&times;</button>
            </div>
            <div class="modal-body" id="printable-invoice">
                <div class="invoice-box">
                    <div class="invoice-header">
                        <div>
                            <h2 style="font-size: 1.3rem; color: var(--navy-primary); margin-bottom: 2px;">Smart Community Hall Booking</h2>
                            <p style="font-size: 0.8rem; color: var(--text-muted);">Municipal Civic Center, Indiranagar, Bengaluru</p>
                        </div>
                        <div style="text-align: right;">
                            <span class="status-pill status-${b.status}">${b.status.toUpperCase()}</span>
                            <p style="font-size: 0.85rem; margin-top: 6px; font-weight: 600;">Ref: ${b.booking_reference}</p>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; font-size: 0.88rem;">
                        <div>
                            <p><strong>Billed To:</strong> ${b.user_name || 'Community Member'}</p>
                            <p><strong>Phone:</strong> ${b.user_phone || '+91 99001 23456'}</p>
                            <p><strong>Email:</strong> ${b.user_email || 'user@example.com'}</p>
                        </div>
                        <div>
                            <p><strong>Venue:</strong> ${b.hall_name}</p>
                            <p><strong>Date of Event:</strong> ${UI.formatDate(b.booking_date)}</p>
                            <p><strong>Time Slot:</strong> ${b.start_time} to ${b.end_time}</p>
                        </div>
                    </div>

                    <table class="invoice-summary-table">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-light); font-weight: 600;">
                                <th style="padding: 6px 0;">Item Description</th>
                                <th style="text-align: right; padding: 6px 0;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Hall Base Rent (${b.event_type} - Up to ${b.guest_count} Guests)</td>
                                <td style="text-align: right;">${UI.formatCurrency(hallRent)}</td>
                            </tr>
                            <tr>
                                <td>Civic Amenities Tax & GST (18%)</td>
                                <td style="text-align: right;">${UI.formatCurrency(tax)}</td>
                            </tr>
                            <tr>
                                <td>Refundable Security Caution Deposit</td>
                                <td style="text-align: right;">${UI.formatCurrency(deposit)}</td>
                            </tr>
                            <tr class="invoice-total-row">
                                <td style="padding-top: 10px;">Total Billed Amount</td>
                                <td style="text-align: right; padding-top: 10px; color: var(--navy-primary); font-size: 1.15rem;">
                                    ${UI.formatCurrency(b.total_amount)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 16px; border-top: 1px solid var(--border-light); padding-top: 10px;">
                        * The caution deposit is 100% refundable after event inspection within 3 business days.
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline btn-sm" onclick="closeInvoiceModal()">Close</button>
                <button class="btn btn-primary btn-sm" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Print Invoice
                </button>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeInvoiceModal() {
    const modal = document.getElementById('invoice-modal');
    if (modal) modal.classList.remove('active');
}

// Cancel Booking
async function promptCancelBooking(bookingId) {
    const reason = prompt('Please state the reason for cancellation (e.g. rescheduling, personal emergency):');
    if (reason === null) return; // User pressed cancel on prompt

    const res = await DataService.cancelBooking(bookingId, reason || 'Cancelled by user');
    if (res.success) {
        UI.showToast('Your booking has been cancelled.', 'info');
        await loadUserBookings();
    } else {
        UI.showToast(res.message || 'Failed to cancel booking', 'error');
    }
}

// Handle Profile Update
async function handleProfileUpdate(e) {
    e.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();

    const currentUser = Auth.getCurrentUser();
    currentUser.name = name;
    currentUser.phone = phone;
    currentUser.address = address;

    localStorage.setItem('sch_user', JSON.stringify(currentUser));

    // Update in local users array
    const users = JSON.parse(localStorage.getItem('sch_users')) || [];
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) {
        users[idx].name = name;
        users[idx].phone = phone;
        users[idx].address = address;
        localStorage.setItem('sch_users', JSON.stringify(users));
    }

    updateUserProfileHeader(currentUser);
    Auth.updateNavUI();
    UI.showToast('Profile information updated successfully!', 'success');
}
