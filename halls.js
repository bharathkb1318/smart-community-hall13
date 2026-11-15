/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Hall Listing & Interactive Filtering Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Parse URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const locationParam = urlParams.get('location');
    const capacityParam = urlParams.get('minCapacity');
    const dateParam = urlParams.get('date');

    // Populate initial inputs if query params exist
    if (searchParam) document.getElementById('filter-search').value = searchParam;
    if (locationParam) document.getElementById('filter-location').value = locationParam;
    if (capacityParam) document.getElementById('filter-capacity').value = capacityParam;
    if (dateParam) {
        const dateInput = document.getElementById('filter-date');
        if (dateInput) dateInput.value = dateParam;
    }

    // Price range slider live value indicator
    const priceRange = document.getElementById('filter-price');
    const priceDisplay = document.getElementById('price-value-display');
    if (priceRange && priceDisplay) {
        priceRange.addEventListener('input', (e) => {
            priceDisplay.textContent = UI.formatCurrency(e.target.value);
            filterHalls();
        });
    }

    // Attach listeners to all filter inputs
    const filterInputs = [
        'filter-search', 'filter-location', 'filter-capacity', 
        'filter-date', 'sort-by'
    ];

    filterInputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => filterHalls());
            el.addEventListener('change', () => filterHalls());
        }
    });

    // Facility checkboxes
    document.querySelectorAll('.facility-checkbox').forEach(cb => {
        cb.addEventListener('change', () => filterHalls());
    });

    // Reset button
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('filter-search').value = '';
            document.getElementById('filter-location').value = 'all';
            document.getElementById('filter-capacity').value = '';
            if (document.getElementById('filter-date')) document.getElementById('filter-date').value = '';
            document.getElementById('filter-price').value = '100000';
            document.getElementById('price-value-display').textContent = UI.formatCurrency(100000);
            document.getElementById('sort-by').value = 'default';
            document.querySelectorAll('.facility-checkbox').forEach(cb => cb.checked = false);
            filterHalls();
        });
    }

    // Initial render
    await filterHalls();
});

async function filterHalls() {
    const container = document.getElementById('halls-listing-container');
    const resultCount = document.getElementById('halls-count-badge');
    if (!container) return;

    container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px;"><i class="fa-solid fa-spinner fa-spin fa-2x text-gold"></i><p style="margin-top: 10px;">Finding available venues...</p></div>';

    const search = document.getElementById('filter-search')?.value.trim().toLowerCase() || '';
    const location = document.getElementById('filter-location')?.value || 'all';
    const minCapacity = Number(document.getElementById('filter-capacity')?.value) || 0;
    const maxPrice = Number(document.getElementById('filter-price')?.value) || 100000;
    const date = document.getElementById('filter-date')?.value || '';
    const sortBy = document.getElementById('sort-by')?.value || 'default';

    // Selected facilities checkboxes
    const selectedFacilities = Array.from(document.querySelectorAll('.facility-checkbox:checked')).map(cb => cb.value.toLowerCase());

    try {
        let halls = await DataService.getHalls({ location, minCapacity, maxPrice, search, date });

        // Client-side facility check & sorting
        halls = halls.filter(hall => {
            // Price filter
            if (Number(hall.price_per_day) > maxPrice) return false;

            // Capacity filter
            if (minCapacity > 0 && hall.capacity < minCapacity) return false;

            // Location filter
            if (location !== 'all' && !hall.location.toLowerCase().includes(location.toLowerCase())) {
                return false;
            }

            // Search filter
            if (search) {
                const combined = `${hall.name} ${hall.location} ${hall.facilities} ${hall.description}`.toLowerCase();
                if (!combined.includes(search)) return false;
            }

            // Facilities checklist
            if (selectedFacilities.length > 0) {
                const hallFac = hall.facilities.toLowerCase();
                const matchesAll = selectedFacilities.every(f => hallFac.includes(f));
                if (!matchesAll) return false;
            }

            return true;
        });

        // Sorting
        if (sortBy === 'price-low') {
            halls.sort((a, b) => Number(a.price_per_day) - Number(b.price_per_day));
        } else if (sortBy === 'price-high') {
            halls.sort((a, b) => Number(b.price_per_day) - Number(a.price_per_day));
        } else if (sortBy === 'capacity-high') {
            halls.sort((a, b) => Number(b.capacity) - Number(a.capacity));
        }

        if (resultCount) {
            resultCount.textContent = `${halls.length} Venue${halls.length === 1 ? '' : 's'} Available`;
        }

        if (halls.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: var(--white); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
                    <i class="fa-solid fa-magnifying-glass fa-3x" style="color: var(--text-muted); margin-bottom: 14px;"></i>
                    <h3 style="color: var(--navy-primary); margin-bottom: 8px;">No matching community halls found</h3>
                    <p style="color: var(--text-secondary); max-width: 440px; margin: 0 auto 20px;">
                        Try loosening your filters, adjusting the capacity or choosing an alternate date.
                    </p>
                    <button class="btn btn-navy btn-sm" onclick="document.getElementById('btn-reset-filters').click()">
                        Reset All Filters
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = halls.map(hall => {
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
                            <a href="booking.html?hallId=${hall.id}${date ? `&date=${date}` : ''}" class="btn btn-primary btn-sm ${hall.status !== 'available' ? 'disabled' : ''}">
                                <i class="fa-solid fa-calendar-check"></i> Book Now
                            </a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error('Error filtering halls:', err);
        container.innerHTML = '<p class="text-danger">Failed to load halls. Please refresh.</p>';
    }
}
