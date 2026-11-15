/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Booking Page Logic, Conflict Checks & Price Calculation
 */

let selectedHall = null;

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Set min date to today immediately (no async needed)
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // 2. Pre-fill user data if logged in
    const currentUser = Auth.getCurrentUser();
    if (currentUser) {
        if (document.getElementById('booking-name')) document.getElementById('booking-name').value = currentUser.name || '';
        if (document.getElementById('booking-email')) document.getElementById('booking-email').value = currentUser.email || '';
        if (document.getElementById('booking-phone')) document.getElementById('booking-phone').value = currentUser.phone || '';
    }

    // 3. Attach Live Calculation & Validation Listeners
    const hallSelect = document.getElementById('booking-hall');
    const guestInput = document.getElementById('booking-guests');
    const startTimeInput = document.getElementById('booking-start-time');
    const endTimeInput = document.getElementById('booking-end-time');

    if (hallSelect) {
        hallSelect.addEventListener('change', async (e) => {
            const hallId = e.target.value;
            if (hallId) {
                // Use local storage directly for instant, no-network response
                const halls = JSON.parse(localStorage.getItem('sch_halls')) || INITIAL_DEMO_DATA.halls;
                selectedHall = halls.find(h => Number(h.id) === Number(hallId)) || null;
            } else {
                selectedHall = null;
            }
            updateOrderSummary();
            checkSlotAvailability();
        });
    }

    if (dateInput) {
        dateInput.addEventListener('change', checkSlotAvailability);
    }
    if (startTimeInput) {
        startTimeInput.addEventListener('change', checkSlotAvailability);
    }
    if (endTimeInput) {
        endTimeInput.addEventListener('change', checkSlotAvailability);
    }

    if (guestInput) {
        guestInput.addEventListener('input', () => {
            validateGuestCapacity();
            updateOrderSummary();
        });
        guestInput.addEventListener('change', () => {
            validateGuestCapacity();
            updateOrderSummary();
        });
    }

    // 4. Booking Form Submission
    const bookingForm = document.getElementById('hall-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // 5. Populate Halls Select Dropdown LAST (uses local data - instant)
    await initHallDropdown();
});

// Initialize Hall Dropdown - uses LocalStorage directly for instant load (no network delay)
async function initHallDropdown() {
    const hallSelect = document.getElementById('booking-hall');
    if (!hallSelect) return;

    // Read halls directly from LocalStorage (instant, no backend ping delay)
    const halls = JSON.parse(localStorage.getItem('sch_halls')) || INITIAL_DEMO_DATA.halls;
    hallSelect.innerHTML = '<option value="">-- Choose a Community Hall --</option>';

    halls.forEach(hall => {
        const isMaint = hall.status === 'maintenance';
        const opt = document.createElement('option');
        opt.value = hall.id;
        opt.textContent = `${hall.name} (${hall.location} - Max ${hall.capacity} Guests) ${isMaint ? '⚠️ Under Maintenance' : ''}`;
        if (isMaint) opt.disabled = true;
        hallSelect.appendChild(opt);
    });

    // Check if hallId passed via URL, else default to first available hall
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedId = urlParams.get('hallId');
    const preselectedDate = urlParams.get('date');

    if (preselectedDate && document.getElementById('booking-date')) {
        document.getElementById('booking-date').value = preselectedDate;
    }

    if (preselectedId) {
        hallSelect.value = preselectedId;
        selectedHall = halls.find(h => Number(h.id) === Number(preselectedId)) || halls[0];
    } else {
        // Automatically pre-select first available hall so calculation shows immediately
        const firstAvailable = halls.find(h => h.status === 'available') || halls[0];
        if (firstAvailable) {
            hallSelect.value = firstAvailable.id;
            selectedHall = firstAvailable;
        }
    }

    // Set default guest count to 100 if empty
    const guestInput = document.getElementById('booking-guests');
    if (guestInput && !guestInput.value) {
        guestInput.value = 100;
    }

    // Trigger calculation immediately after hall is selected
    if (selectedHall) {
        updateOrderSummary();
        checkSlotAvailability();
    }
}

// Update Order Summary & Price Breakdown Card
function updateOrderSummary() {
    const previewContainer = document.getElementById('summary-hall-preview');
    const rentEl = document.getElementById('summary-rent');
    const guestFeeEl = document.getElementById('summary-guest-fee');
    const guestBadgeEl = document.getElementById('summary-guests-badge');
    const taxEl = document.getElementById('summary-tax');
    const depositEl = document.getElementById('summary-deposit');
    const totalEl = document.getElementById('summary-total');

    if (!selectedHall) {
        if (previewContainer) {
            previewContainer.innerHTML = '<p style="color: var(--text-muted); font-size: 0.9rem;">Select a hall on the left to see price details.</p>';
        }
        if (rentEl) rentEl.textContent = '₹0';
        if (guestFeeEl) guestFeeEl.textContent = '₹0';
        if (taxEl) taxEl.textContent = '₹0';
        if (depositEl) depositEl.textContent = '₹0';
        if (totalEl) totalEl.textContent = '₹0';
        return;
    }

    if (previewContainer) {
        previewContainer.innerHTML = `
            <div class="selected-hall-preview">
                <img src="${selectedHall.image_url}" alt="${selectedHall.name}" class="preview-thumb">
                <div class="preview-info">
                    <h4>${selectedHall.name}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${selectedHall.location}</p>
                    <p><i class="fa-solid fa-users"></i> Max Capacity: <strong>${selectedHall.capacity}</strong></p>
                </div>
            </div>
        `;
    }

    // Dynamic Guest Facility Calculation
    const guestInput = document.getElementById('booking-guests');
    const guestCount = Math.max(0, Number(guestInput?.value) || 0);
    const guestRatePerPerson = Number(selectedHall.price_per_guest) || 100; // Configured per-guest rate set by Admin
    const guestFee = guestCount * guestRatePerPerson;

    const rent = Number(selectedHall.price_per_day);
    const subtotal = rent + guestFee;
    const tax = subtotal * CONFIG.TAX_RATE;
    const deposit = Number(selectedHall.caution_deposit) || CONFIG.DEFAULT_DEPOSIT;
    const total = subtotal + tax + deposit;

    const guestRateEl = document.getElementById('summary-guest-rate');
    if (guestRateEl) guestRateEl.textContent = guestRatePerPerson;
    if (rentEl) rentEl.textContent = UI.formatCurrency(rent);
    if (guestBadgeEl) guestBadgeEl.textContent = guestCount;
    if (guestFeeEl) guestFeeEl.textContent = UI.formatCurrency(guestFee);
    if (taxEl) taxEl.textContent = UI.formatCurrency(tax);
    if (depositEl) depositEl.textContent = UI.formatCurrency(deposit);
    if (totalEl) totalEl.textContent = UI.formatCurrency(total);
}

// Check Guest Capacity Validation
function validateGuestCapacity() {
    const guestInput = document.getElementById('booking-guests');
    const guestError = document.getElementById('guest-capacity-error');
    if (!guestInput || !guestError || !selectedHall) return true;

    const count = Number(guestInput.value);
    if (count > selectedHall.capacity) {
        guestError.textContent = `Warning: Hall maximum capacity is ${selectedHall.capacity} guests.`;
        guestError.style.display = 'block';
        guestInput.classList.add('is-invalid');
        return false;
    } else {
        guestError.style.display = 'none';
        guestInput.classList.remove('is-invalid');
        return true;
    }
}

// Live Slot Conflict & Double-Booking / Maintenance Check
async function checkSlotAvailability() {
    const hallId = document.getElementById('booking-hall')?.value;
    const bookingDate = document.getElementById('booking-date')?.value;
    const startTime = document.getElementById('booking-start-time')?.value;
    const endTime = document.getElementById('booking-end-time')?.value;
    const conflictAlert = document.getElementById('slot-conflict-alert');
    const submitBtn = document.getElementById('btn-submit-booking');

    if (!hallId || !bookingDate) {
        if (conflictAlert) conflictAlert.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
        return;
    }

    const avail = await DataService.checkAvailability(hallId, bookingDate, startTime, endTime);

    if (!avail.available) {
        if (conflictAlert) {
            conflictAlert.innerHTML = `
                <i class="fa-solid fa-circle-exclamation fa-lg"></i>
                <div>
                    <strong>Date/Time Slot Unavailable:</strong> ${avail.reason}
                </div>
            `;
            conflictAlert.style.display = 'flex';
        }
        if (submitBtn) submitBtn.disabled = true;
    } else {
        if (conflictAlert) conflictAlert.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
}

// Handle Form Submission
async function handleBookingSubmit(e) {
    e.preventDefault();

    const hallId = document.getElementById('booking-hall').value;
    const fullName = document.getElementById('booking-name').value.trim();
    const email = document.getElementById('booking-email').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const eventType = document.getElementById('booking-event-type').value;
    const bookingDate = document.getElementById('booking-date').value;
    const startTime = document.getElementById('booking-start-time').value;
    const endTime = document.getElementById('booking-end-time').value;
    const guestCount = document.getElementById('booking-guests').value;
    const specialRequests = document.getElementById('booking-special-requests').value.trim();
    const termsCheck = document.getElementById('booking-terms')?.checked;

    // Validation Checks
    if (!hallId || !fullName || !email || !phone || !eventType || !bookingDate || !startTime || !endTime || !guestCount) {
        UI.showToast('Please fill out all mandatory fields.', 'error');
        return;
    }

    if (startTime >= endTime) {
        UI.showToast('End time must be later than start time.', 'error');
        return;
    }

    if (!validateGuestCapacity()) {
        UI.showToast('Guest count exceeds hall capacity.', 'error');
        return;
    }

    if (!termsCheck) {
        UI.showToast('Please agree to the Community Hall booking regulations and terms.', 'warning');
        return;
    }

    const submitBtn = document.getElementById('btn-submit-booking');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Request...';
    submitBtn.disabled = true;

    try {
        const payload = {
            hallId,
            fullName,
            email,
            phone,
            eventType,
            bookingDate,
            startTime,
            endTime,
            guestCount,
            specialRequests
        };

        const result = await DataService.createBooking(payload);

        if (result.success) {
            UI.showToast('Booking request submitted successfully!', 'success');
            openBookingSuccessModal(result.bookingReference, payload);
        } else {
            UI.showToast(result.message || 'Failed to submit booking.', 'error');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error('Booking submission error:', err);
        UI.showToast('A network error occurred. Please try again.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Booking Success Modal
function openBookingSuccessModal(reference, details) {
    let modal = document.getElementById('booking-success-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'booking-success-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-header" style="background: linear-gradient(135deg, #065f46 0%, #10b981 100%);">
                <h3><i class="fa-solid fa-circle-check"></i> Booking Request Received!</h3>
            </div>
            <div class="modal-body" style="text-align: center; padding: 30px;">
                <div style="width: 70px; height: 70px; background: #ecfdf5; color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 16px;">
                    <i class="fa-solid fa-check"></i>
                </div>
                <h3 style="color: var(--navy-primary); margin-bottom: 8px;">Reservation Request Pending Approval</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    Your booking request has been logged and sent to the community hall supervisor.
                </p>
                <div style="background: var(--bg-light); padding: 16px; border-radius: var(--radius-md); border: 1px dashed var(--gold-primary); margin-bottom: 24px; text-align: left;">
                    <p style="margin-bottom: 6px;"><strong>Reference ID:</strong> <span style="color: var(--gold-dark); font-weight: 700;">${reference}</span></p>
                    <p style="margin-bottom: 6px;"><strong>Date:</strong> ${UI.formatDate(details.bookingDate)} (${details.startTime} to ${details.endTime})</p>
                    <p style="margin-bottom: 6px;"><strong>Event:</strong> ${details.eventType} (${details.guestCount} Guests)</p>
                    <p style="margin-bottom: 0;"><strong>Status:</strong> <span class="status-pill status-pending">Pending Review</span></p>
                </div>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <a href="dashboard.html" class="btn btn-navy btn-sm">
                        <i class="fa-solid fa-table-columns"></i> View in Dashboard
                    </a>
                    <a href="halls.html" class="btn btn-outline btn-sm">
                        Browse More Halls
                    </a>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('active');
}
