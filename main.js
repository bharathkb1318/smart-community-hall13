/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Home Page Interactivity (Search & Featured Halls)
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Initialize Hero Search Form
    const heroSearchForm = document.getElementById('hero-search-form');
    if (heroSearchForm) {
        heroSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const location = document.getElementById('search-location').value;
            const date = document.getElementById('search-date').value;
            const capacity = document.getElementById('search-capacity').value;

            const params = new URLSearchParams();
            if (location && location !== 'all') params.append('location', location);
            if (date) params.append('date', date);
            if (capacity) params.append('minCapacity', capacity);

            window.location.href = `halls.html?${params.toString()}`;
        });
    }

    // Set minimum date to today
    const dateInput = document.getElementById('search-date');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
    }

    // 2. Load Featured Available Halls
    loadFeaturedHalls();
});

async function loadFeaturedHalls() {
    const container = document.getElementById('featured-halls-grid');
    if (!container) return;

    try {
        const halls = await DataService.getHalls();
        // Take top 3 or available halls
        const featured = halls.slice(0, 3);

        if (featured.length === 0) {
            container.innerHTML = '<p class="text-center">No community halls currently available.</p>';
            return;
        }

        container.innerHTML = featured.map(hall => {
            const facilitiesList = hall.facilities.split(',').slice(0, 4).map(f => `
                <span class="facility-pill">${f.trim()}</span>
            `).join('');

            const statusBadge = hall.status === 'available' ?
                '<span class="hall-badge badge-available">Available</span>' :
                '<span class="hall-badge badge-maintenance">In Maintenance</span>';

            return `
                <div class="hall-card">
                    <div class="hall-image-box">
                        <img src="${hall.image_url}" alt="${hall.name}" onerror="this.src='https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'">
                        ${statusBadge}
                        <div class="hall-price-chip">
                            <strong>${UI.formatCurrency(hall.price_per_day)}</strong> / day
                        </div>
                    </div>
                    <div class="hall-card-body">
                        <h3 class="hall-card-title">${hall.name}</h3>
                        <p class="hall-card-location">
                            <i class="fa-solid fa-location-dot"></i> ${hall.location}
                        </p>
                        <div class="hall-meta-info">
                            <div class="hall-meta-item">
                                <i class="fa-solid fa-users"></i>
                                <span>Max ${hall.capacity} Guests</span>
                            </div>
                            <div class="hall-meta-item">
                                <i class="fa-solid fa-shield-halved"></i>
                                <span>Deposit: ${UI.formatCurrency(hall.caution_deposit || 5000)}</span>
                            </div>
                        </div>
                        <div class="hall-facilities-list">
                            ${facilitiesList}
                        </div>
                        <div class="hall-card-footer">
                            <button onclick="openHallDetailsModal(${hall.id})" class="btn btn-outline btn-sm">
                                <i class="fa-solid fa-eye"></i> View Details
                            </button>
                            <a href="booking.html?hallId=${hall.id}" class="btn btn-primary btn-sm ${hall.status !== 'available' ? 'disabled' : ''}">
                                <i class="fa-solid fa-calendar-check"></i> Book Now
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.error('Error loading featured halls:', err);
        container.innerHTML = '<p class="text-danger text-center">Unable to load halls. Please try again.</p>';
    }
}

// Global Modal Helper for Hall Details
async function openHallDetailsModal(hallId) {
    const hall = await DataService.getHallById(hallId);
    if (!hall) return;

    let modal = document.getElementById('hall-details-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hall-details-modal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    const facilitiesBadges = hall.facilities.split(',').map(f => `
        <span class="facility-pill" style="font-size: 0.85rem; padding: 6px 12px;">
            <i class="fa-solid fa-check text-success"></i> ${f.trim()}
        </span>
    `).join('');

    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-header">
                <h3>${hall.name}</h3>
                <button class="modal-close-btn" onclick="closeHallDetailsModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 20px; border-radius: var(--radius-md); overflow: hidden; max-height: 320px;">
                    <img src="${hall.image_url}" alt="${hall.name}" style="width: 100%; height: 320px; object-fit: cover;">
                </div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <p style="color: var(--text-muted); font-size: 0.95rem;">
                            <i class="fa-solid fa-location-dot text-gold"></i> ${hall.address}
                        </p>
                        <p style="font-size: 0.95rem; margin-top: 4px;">
                            <strong>Capacity:</strong> Up to ${hall.capacity} guests | 
                            <strong>Deposit:</strong> ${UI.formatCurrency(hall.caution_deposit || 5000)}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 1.5rem; font-weight: 700; color: var(--navy-primary);">
                            ${UI.formatCurrency(hall.price_per_day)}
                        </span>
                        <span style="font-size: 0.85rem; color: var(--text-muted);">/ day</span>
                    </div>
                </div>

                <h4 style="margin-bottom: 8px; color: var(--navy-primary);">About This Hall</h4>
                <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.6;">${hall.description}</p>

                <h4 style="margin-bottom: 10px; color: var(--navy-primary);">Facilities & Amenities</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px;">
                    ${facilitiesBadges}
                </div>

                ${hall.rules ? `
                    <h4 style="margin-bottom: 8px; color: var(--navy-primary);">Venue Rules & Guidelines</h4>
                    <p style="color: var(--text-secondary); font-size: 0.88rem; background: var(--bg-light); padding: 12px 16px; border-radius: var(--radius-md); border-left: 4px solid var(--gold-primary);">
                        ${hall.rules}
                    </p>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-outline btn-sm" onclick="closeHallDetailsModal()">Close</button>
                <a href="booking.html?hallId=${hall.id}" class="btn btn-primary btn-sm ${hall.status !== 'available' ? 'disabled' : ''}">
                    <i class="fa-solid fa-calendar-check"></i> Proceed to Book
                </a>
            </div>
        </div>
    `;

    modal.classList.add('active');
}

function closeHallDetailsModal() {
    const modal = document.getElementById('hall-details-modal');
    if (modal) modal.classList.remove('active');
}
