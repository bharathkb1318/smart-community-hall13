/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Admin Panel & Analytics Dashboard Logic
 */

let allHalls = [];
let allBookings = [];
let allMaintenance = [];

let bookingsTrendChart = null;
let eventTypeChart = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Guard route: requires admin authorization
    if (!Auth.requireAuth('admin')) return;

    // 2. Tab Navigation
    initAdminTabs();

    // 3. Load All Data
    await loadAdminData();

    // 4. Modal and Form Listeners
    initHallForms();
    initMaintenanceForm();
});

function initAdminTabs() {
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

            // Re-render charts when switching back to overview
            if (tabId === 'overview') {
                renderCharts();
            }
        });
    });
}

async function loadAdminData() {
    allHalls = await DataService.getHalls();
    allBookings = await DataService.getAllBookings();
    allMaintenance = await DataService.getMaintenanceSchedules();

    // Compute KPIs
    const totalHalls = allHalls.length;
    const totalBookings = allBookings.length;
    const pendingBookings = allBookings.filter(b => b.status === 'pending').length;
    const approvedBookings = allBookings.filter(b => b.status === 'approved' || b.status === 'completed');
    const totalRevenue = approvedBookings.reduce((sum, b) => sum + Number(b.total_amount), 0);
    const activeMaint = allMaintenance.filter(m => m.status === 'in_progress' || m.status === 'scheduled').length;

    // Update KPI UI
    document.getElementById('admin-kpi-halls').textContent = totalHalls;
    document.getElementById('admin-kpi-bookings').textContent = totalBookings;
    document.getElementById('admin-kpi-pending').textContent = pendingBookings;
    document.getElementById('admin-kpi-revenue').textContent = UI.formatCurrency(totalRevenue);
    document.getElementById('admin-kpi-maintenance').textContent = activeMaint;

    // Render tables
    renderHallsTable();
    renderBookingsTable();
    renderMaintenanceTable();
    renderRecentBookings();

    // Render Analytics Charts
    renderCharts();
}

// -------------------------------------------------------------
// Analytics Charts (Chart.js)
// -------------------------------------------------------------
function renderCharts() {
    // 1. Monthly Bookings Trend Chart
    const ctxMonthly = document.getElementById('monthlyTrendChart');
    if (ctxMonthly && typeof Chart !== 'undefined') {
        if (bookingsTrendChart) bookingsTrendChart.destroy();

        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const bookingCounts = [12, 18, 15, 22, 28, 35];
        const revenues = [540000, 810000, 680000, 1020000, 1340000, 1750000];

        bookingsTrendChart = new Chart(ctxMonthly, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Total Bookings',
                        data: bookingCounts,
                        backgroundColor: '#d4af37',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'top' }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // 2. Event Type Distribution Chart
    const ctxEvent = document.getElementById('eventTypeChart');
    if (ctxEvent && typeof Chart !== 'undefined') {
        if (eventTypeChart) eventTypeChart.destroy();

        const eventCounts = {};
        allBookings.forEach(b => {
            eventCounts[b.event_type] = (eventCounts[b.event_type] || 0) + 1;
        });

        const labels = Object.keys(eventCounts).length ? Object.keys(eventCounts) : ['Wedding', 'Reception', 'Meeting', 'Birthday', 'Cultural'];
        const dataVals = Object.keys(eventCounts).length ? Object.values(eventCounts) : [14, 9, 7, 5, 4];

        eventTypeChart = new Chart(ctxEvent, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: dataVals,
                    backgroundColor: ['#0f233e', '#d4af37', '#10b981', '#f59e0b', '#3b82f6', '#8b5cf6']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// -------------------------------------------------------------
// Recent Bookings (Overview Tab)
// -------------------------------------------------------------
function renderRecentBookings() {
    const tbody = document.getElementById('admin-recent-bookings-tbody');
    if (!tbody) return;

    const recent = allBookings.slice(0, 5);
    tbody.innerHTML = recent.map(b => `
        <tr>
            <td><strong>${b.booking_reference}</strong></td>
            <td>${b.user_name || 'Client'}</td>
            <td>${b.hall_name}</td>
            <td>${UI.formatDate(b.booking_date)}</td>
            <td>${UI.formatCurrency(b.total_amount)}</td>
            <td><span class="status-pill status-${b.status}">${b.status}</span></td>
        </tr>
    `).join('');
}

// -------------------------------------------------------------
// Hall Management
// -------------------------------------------------------------
function renderHallsTable() {
    const tbody = document.getElementById('admin-halls-tbody');
    if (!tbody) return;

    tbody.innerHTML = allHalls.map(h => `
        <tr>
            <td>
                <img src="${h.image_url}" alt="${h.name}" style="width: 50px; height: 50px; border-radius: 6px; object-fit: cover;">
            </td>
            <td>
                <strong>${h.name}</strong>
                <div style="font-size: 0.8rem; color: var(--text-muted);"><i class="fa-solid fa-location-dot"></i> ${h.location}</div>
            </td>
            <td>${h.capacity} Guests</td>
            <td>
                <strong>${UI.formatCurrency(h.price_per_day)}</strong> / day
                <div style="font-size: 0.78rem; color: var(--gold-dark); font-weight: 600;">
                    + ₹${h.price_per_guest || 100} / guest
                </div>
            </td>
            <td><span class="status-pill status-${h.status}">${h.status}</span></td>
            <td>
                <div class="actions-cell">
                    <button onclick="openEditHallModal(${h.id})" class="btn-icon" title="Edit Hall">
                        <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button onclick="toggleHallStatus(${h.id})" class="btn-icon" title="Toggle Available / Maintenance">
                        <i class="fa-solid fa-power-off"></i>
                    </button>
                    <button onclick="deleteHallAction(${h.id})" class="btn-icon btn-icon-danger" title="Delete Hall">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function initHallForms() {
    const addHallForm = document.getElementById('add-hall-form');
    if (addHallForm) {
        addHallForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                name: document.getElementById('hall-name').value.trim(),
                location: document.getElementById('hall-location').value.trim(),
                address: document.getElementById('hall-address').value.trim(),
                capacity: Number(document.getElementById('hall-capacity').value),
                price_per_day: Number(document.getElementById('hall-price').value),
                price_per_guest: Number(document.getElementById('hall-guest-price')?.value) || 100,
                caution_deposit: Number(document.getElementById('hall-deposit').value) || 5000,
                facilities: document.getElementById('hall-facilities').value.trim(),
                image_url: document.getElementById('hall-image').value.trim(),
                description: document.getElementById('hall-description').value.trim(),
                rules: document.getElementById('hall-rules').value.trim(),
                status: 'available'
            };

            const res = await DataService.createHall(payload);
            if (res.success) {
                UI.showToast('New community hall added successfully!', 'success');
                closeModal('add-hall-modal');
                addHallForm.reset();
                await loadAdminData();
            } else {
                UI.showToast(res.message || 'Error adding hall', 'error');
            }
        });
    }

    const editHallForm = document.getElementById('edit-hall-form');
    if (editHallForm) {
        editHallForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-hall-id').value;
            const payload = {
                name: document.getElementById('edit-hall-name').value.trim(),
                location: document.getElementById('edit-hall-location').value.trim(),
                address: document.getElementById('edit-hall-address').value.trim(),
                capacity: Number(document.getElementById('edit-hall-capacity').value),
                price_per_day: Number(document.getElementById('edit-hall-price').value),
                price_per_guest: Number(document.getElementById('edit-hall-guest-price')?.value) || 100,
                caution_deposit: Number(document.getElementById('edit-hall-deposit').value),
                facilities: document.getElementById('edit-hall-facilities').value.trim(),
                image_url: document.getElementById('edit-hall-image').value.trim(),
                description: document.getElementById('edit-hall-description').value.trim(),
                rules: document.getElementById('edit-hall-rules').value.trim(),
                status: document.getElementById('edit-hall-status').value
            };

            const res = await DataService.updateHall(id, payload);
            if (res.success) {
                UI.showToast('Hall details updated!', 'success');
                closeModal('edit-hall-modal');
                await loadAdminData();
            } else {
                UI.showToast(res.message || 'Error updating hall', 'error');
            }
        });
    }
}

function openAddHallModal() {
    openModal('add-hall-modal');
}

async function openEditHallModal(id) {
    const hall = allHalls.find(h => Number(h.id) === Number(id));
    if (!hall) return;

    document.getElementById('edit-hall-id').value = hall.id;
    document.getElementById('edit-hall-name').value = hall.name;
    document.getElementById('edit-hall-location').value = hall.location;
    document.getElementById('edit-hall-address').value = hall.address;
    document.getElementById('edit-hall-capacity').value = hall.capacity;
    document.getElementById('edit-hall-price').value = hall.price_per_day;
    document.getElementById('edit-hall-guest-price').value = hall.price_per_guest || 100;
    document.getElementById('edit-hall-deposit').value = hall.caution_deposit || 5000;
    document.getElementById('edit-hall-facilities').value = hall.facilities;
    document.getElementById('edit-hall-image').value = hall.image_url;
    document.getElementById('edit-hall-description').value = hall.description;
    document.getElementById('edit-hall-rules').value = hall.rules || '';
    document.getElementById('edit-hall-status').value = hall.status;

    openModal('edit-hall-modal');
}

async function toggleHallStatus(id) {
    const hall = allHalls.find(h => Number(h.id) === Number(id));
    if (!hall) return;

    const newStatus = hall.status === 'available' ? 'maintenance' : 'available';
    await DataService.updateHall(id, { status: newStatus });
    UI.showToast(`Hall status updated to ${newStatus}.`, 'info');
    await loadAdminData();
}

async function deleteHallAction(id) {
    if (confirm('Are you sure you want to delete this hall? This action cannot be undone.')) {
        const res = await DataService.deleteHall(id);
        if (res.success) {
            UI.showToast('Hall deleted successfully.', 'info');
            await loadAdminData();
        } else {
            UI.showToast(res.message, 'error');
        }
    }
}

// -------------------------------------------------------------
// Bookings Management
// -------------------------------------------------------------
function renderBookingsTable() {
    const tbody = document.getElementById('admin-bookings-tbody');
    if (!tbody) return;

    const filterStatus = document.getElementById('admin-booking-filter-status')?.value || 'all';
    const searchTerm = document.getElementById('admin-booking-search')?.value.trim().toLowerCase() || '';

    let list = [...allBookings];

    if (filterStatus !== 'all') {
        list = list.filter(b => b.status === filterStatus);
    }

    if (searchTerm) {
        list = list.filter(b => 
            b.booking_reference.toLowerCase().includes(searchTerm) ||
            (b.user_name && b.user_name.toLowerCase().includes(searchTerm)) ||
            b.hall_name.toLowerCase().includes(searchTerm)
        );
    }

    tbody.innerHTML = list.map(b => {
        const isPending = b.status === 'pending';

        return `
            <tr>
                <td><strong>${b.booking_reference}</strong></td>
                <td>
                    <strong>${b.user_name || 'Client'}</strong>
                    <div style="font-size: 0.78rem; color: var(--text-muted);">${b.user_phone || ''}</div>
                </td>
                <td>${b.hall_name}</td>
                <td>
                    <div>${UI.formatDate(b.booking_date)}</div>
                    <small style="color: var(--text-muted);">${b.start_time} - ${b.end_time}</small>
                </td>
                <td><span class="facility-pill">${b.event_type} (${b.guest_count} guests)</span></td>
                <td><strong>${UI.formatCurrency(b.total_amount)}</strong></td>
                <td><span class="status-pill status-${b.status}">${b.status}</span></td>
                <td>
                    <div class="actions-cell">
                        ${isPending ? `
                            <button onclick="approveBookingAction(${b.id})" class="btn-icon btn-icon-success" title="Approve Request">
                                <i class="fa-solid fa-check"></i>
                            </button>
                            <button onclick="rejectBookingAction(${b.id})" class="btn-icon btn-icon-danger" title="Reject Request">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        ` : ''}
                        <button onclick="viewBookingDetails(${b.id})" class="btn-icon" title="View Full Booking Details">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

async function approveBookingAction(bookingId) {
    if (confirm('Approve this community hall booking request?')) {
        const res = await DataService.updateBookingStatus(bookingId, 'approved', 'Approved by administrator');
        if (res.success) {
            UI.showToast('Booking approved successfully!', 'success');
            await loadAdminData();
        }
    }
}

async function rejectBookingAction(bookingId) {
    const reason = prompt('Please specify reason for rejecting this booking request:');
    if (reason === null) return;

    const res = await DataService.updateBookingStatus(bookingId, 'rejected', reason || 'Slot unavailable');
    if (res.success) {
        UI.showToast('Booking rejected.', 'warning');
        await loadAdminData();
    }
}

function viewBookingDetails(bookingId) {
    const b = allBookings.find(item => Number(item.id) === Number(bookingId));
    if (!b) return;

    alert(`
BOOKING DETAILS:
Reference: ${b.booking_reference}
Client: ${b.user_name} (${b.user_phone}, ${b.user_email})
Hall: ${b.hall_name}
Date: ${b.booking_date} (${b.start_time} - ${b.end_time})
Event: ${b.event_type}
Guests: ${b.guest_count}
Special Requests: ${b.special_requests || 'None'}
Total Amount: ₹${Number(b.total_amount).toLocaleString('en-IN')}
Status: ${b.status.toUpperCase()}
Remarks: ${b.admin_remarks || 'None'}
    `);
}

// -------------------------------------------------------------
// Maintenance Management
// -------------------------------------------------------------
function renderMaintenanceTable() {
    const tbody = document.getElementById('admin-maintenance-tbody');
    if (!tbody) return;

    tbody.innerHTML = allMaintenance.map(m => `
        <tr>
            <td><strong>${m.hall_name}</strong></td>
            <td>${m.reason}</td>
            <td>${UI.formatDate(m.start_date)}</td>
            <td>${UI.formatDate(m.end_date)}</td>
            <td><span class="status-pill status-${m.status}">${m.status}</span></td>
            <td>
                <div class="actions-cell">
                    ${m.status !== 'completed' ? `
                        <button onclick="completeMaintenanceAction(${m.id})" class="btn-icon btn-icon-success" title="Mark Maintenance Completed">
                            <i class="fa-solid fa-circle-check"></i>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function initMaintenanceForm() {
    const form = document.getElementById('schedule-maintenance-form');
    if (!form) return;

    // Populate hall selector inside maintenance modal
    const select = document.getElementById('maint-hall-id');
    if (select) {
        select.innerHTML = '<option value="">-- Choose Hall --</option>' +
            allHalls.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
            hallId: document.getElementById('maint-hall-id').value,
            reason: document.getElementById('maint-reason').value.trim(),
            startDate: document.getElementById('maint-start-date').value,
            endDate: document.getElementById('maint-end-date').value,
            notes: document.getElementById('maint-notes').value.trim(),
            status: 'scheduled'
        };

        const res = await DataService.createMaintenance(payload);
        if (res.success) {
            UI.showToast('Maintenance scheduled! Hall bookings blocked for this period.', 'success');
            closeModal('schedule-maintenance-modal');
            form.reset();
            await loadAdminData();
        }
    });
}

function openScheduleMaintenanceModal() {
    const select = document.getElementById('maint-hall-id');
    if (select) {
        select.innerHTML = '<option value="">-- Choose Hall --</option>' +
            allHalls.map(h => `<option value="${h.id}">${h.name}</option>`).join('');
    }
    openModal('schedule-maintenance-modal');
}

async function completeMaintenanceAction(id) {
    if (confirm('Mark this maintenance as completed and restore hall to Available?')) {
        const res = await DataService.updateMaintenanceStatus(id, 'completed');
        if (res.success) {
            UI.showToast('Maintenance marked completed. Hall is available.', 'success');
            await loadAdminData();
        }
    }
}

// -------------------------------------------------------------
// Modal Utilities
// -------------------------------------------------------------
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}
