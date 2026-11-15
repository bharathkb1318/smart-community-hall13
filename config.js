/**
 * SMART COMMUNITY HALL BOOKING SYSTEM
 * Configuration & Dual-Mode Client Data Service
 * 
 * Automatically connects to Express/Java REST API on http://localhost:5000/api
 * If backend is offline or opened via file:// or Live Server, seamlessly switches
 * to an intelligent local storage data engine with realistic demo data.
 */

const CONFIG = {
    API_BASE_URL: 'http://localhost:5000/api',
    APP_NAME: 'Smart Community Hall Booking System',
    CURRENCY_SYMBOL: '₹',
    TAX_RATE: 0.18, // 18% GST / Civic Amenities Cess
    DEFAULT_DEPOSIT: 5000
};

// Initial Realistic Seed Dataset for Zero-Friction Demo
const INITIAL_DEMO_DATA = {
    halls: [
        {
            id: 1,
            name: "Royal Palace Convention Centre",
            tagline: "A majestic venue tailored for royal weddings, grand receptions and gala events",
            location: "Indiranagar, Bangalore",
            address: "Plot 18, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
            capacity: 1200,
            price_per_day: 75000,
            price_per_guest: 150,
            caution_deposit: 15000,
            facilities: "Central AC,Grand Stage,Dining Hall for 500,Valet Parking (250 Cars),Digital Sound System,Bridal Suites (2),24/7 Generator Backup,CCTV & Security,Elevator",
            image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
            description: "Royal Palace Convention Centre is our premier flagship auditorium offering opulent chandeliers, acoustic wall paneling, and an expansive dining hall. Designed to host lavish weddings, award functions, and cultural conventions with top-tier hospitality infrastructure.",
            rules: "Sound decibels strictly regulated after 10:00 PM. No open flames outside specified havan area. External catering allowed with prior permit.",
            status: "available"
        },
        {
            id: 2,
            name: "Sanskriti Heritage Hall",
            tagline: "Traditional architecture blended with state-of-the-art modern comforts",
            location: "Jayanagar, Bangalore",
            address: "34, 11th Main Road, 4th Block, Jayanagar, Bengaluru, Karnataka 560011",
            capacity: 800,
            price_per_day: 52000,
            price_per_guest: 120,
            caution_deposit: 10000,
            facilities: "Central AC,Traditional Wooden Stage,Separate Dining Area,Car Parking (120 Cars),Acoustic Audio System,Green Rooms (2),Generator Backup,Wi-Fi",
            image_url: "https://images.unsplash.com/photo-1545232979-fbf68fe9ec40?auto=format&fit=crop&w=1200&q=80",
            description: "Designed with ethnic woodcarvings and brass motifs, Sanskriti Heritage Hall provides an enchanting traditional ambiance ideal for engagements, traditional weddings, classical recitals, and silver jubilee celebrations.",
            rules: "Decorations must use designated hooks; double-sided tape not permitted on woodwork. Hall must be vacated within the booked slot.",
            status: "available"
        },
        {
            id: 3,
            name: "Golden Jubilee Community Auditorium",
            tagline: "Affordable, spacious, and centrally located public auditorium for all occasions",
            location: "Malleshwaram, Bangalore",
            address: "Opposite Metro Station, 8th Cross Road, Malleshwaram, Bengaluru, Karnataka 560003",
            capacity: 600,
            price_per_day: 38000,
            price_per_guest: 90,
            caution_deposit: 8000,
            facilities: "Air Conditioning,Spacious Raised Stage,Dining Hall,Covered Parking (80 Cars),PA Sound Setup,Green Room,Elevator,Wheelchair Ramp",
            image_url: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
            description: "A citizen-first community auditorium managed with immaculate hygiene and convenient metro connectivity. Perfect for community gatherings, birthday bashes, retirement celebrations, and educational conferences.",
            rules: "Strictly vegetarian catering inside the dining premises. Cleaning charges included in rent.",
            status: "available"
        },
        {
            id: 4,
            name: "Harmony Banquet & Conference Pavilion",
            tagline: "Sleek contemporary venue for corporate seminars, anniversaries and banquets",
            location: "Whitefield, Bangalore",
            address: "ITPB Main Road, Near Hope Farm Junction, Whitefield, Bengaluru, Karnataka 560066",
            capacity: 450,
            price_per_day: 42000,
            price_per_guest: 180,
            caution_deposit: 8000,
            facilities: "Central AC,High-Def Projector & LED Wall,Buffet Dining Area,Parking (100 Cars),Wireless Mics & JBL Audio,High-Speed Wi-Fi,Podium,Conference Lounge",
            image_url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
            description: "Modern architectural marvel optimized for tech conventions, startup demo days, dealer meets, and elegant evening family dinner parties. Equipped with motorized projection screens and intelligent mood lighting.",
            rules: "Smoking strictly prohibited throughout the facility. High-voltage installations require electrician authorization.",
            status: "available"
        },
        {
            id: 5,
            name: "Emerald Garden & Open Lawn Hall",
            tagline: "Breathtaking open-air lawn combined with an air-conditioned indoor pavilion",
            location: "Kanakapura Road, Bangalore",
            address: "Survey 89, Off Nice Ring Road, Thalaghattapura, Bengaluru, Karnataka 560062",
            capacity: 1500,
            price_per_day: 85000,
            price_per_guest: 160,
            caution_deposit: 20000,
            facilities: "Lush Lawn (25,000 sq ft),Covered AC Pavilion,Huge Dining Arena,Spacious Parking (300 Cars),Stage Lighting Truss,Bridal Villa,Live Cooking Stations,Generator Backup",
            image_url: "https://images.unsplash.com/photo-1478147427282-58a87a120781?auto=format&fit=crop&w=1200&q=80",
            description: "Nestled among tranquil palm grooves, Emerald Garden provides a magical setting for fairy-tale reception nights, sangeet ceremonies, and grand open-air musical concerts with both open lawn and covered rain-proof banquet.",
            rules: "Sound cutoff at 10:30 PM as per civic guidelines. Fireworks restricted to designated safe launchpad.",
            status: "available"
        },
        {
            id: 6,
            name: "Ashirwad Mini Celebration Hall",
            tagline: "Cozy, intimate and budget-friendly hall for birthday parties and meetings",
            location: "Rajajinagar, Bangalore",
            address: "14, 1st Block, Dr. Rajkumar Road, Rajajinagar, Bengaluru, Karnataka 560010",
            capacity: 200,
            price_per_day: 18000,
            price_per_guest: 80,
            caution_deposit: 4000,
            facilities: "Air Conditioning,Mini Stage,Dining Section,Two-Wheeler & Car Parking (30),Standard Sound System,Changing Room,Elevator",
            image_url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
            description: "An economical yet charming intimate hall best suited for naming ceremonies, baby showers, 50th birthday milestones, thread ceremonies, and society AGM meetings.",
            rules: "No loud percussion instruments. Cleanliness must be maintained in the dining hall.",
            status: "available"
        },
        {
            id: 7,
            name: "Utsav Grand Multipurpose Hall",
            tagline: "Versatile hall tailored for vibrant cultural exhibitions and marriages",
            location: "Koramangala, Bangalore",
            address: "80 Feet Road, 6th Block, Koramangala, Bengaluru, Karnataka 560095",
            capacity: 700,
            price_per_day: 48000,
            price_per_guest: 110,
            caution_deposit: 10000,
            facilities: "Central AC,Stage with Red Velvet Drapes,Dining Hall,Basement Parking (90 Cars),Surround Sound,Dressing Rooms (2),Power Backup,Wi-Fi",
            image_url: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
            description: "Located right at the heart of Koramangala, Utsav Grand is favorite for handloom exhibitions, book fairs, wedding receptions, and academic convocations.",
            rules: "Exhibition stalls must adhere to fire egress pathways. Advance booking required 15 days prior.",
            status: "maintenance"
        }
    ],
    users: [
        {
            id: 1,
            name: "System Administrator",
            email: "admin@community.org",
            phone: "+91 98450 11223",
            role: "admin",
            password: "admin123",
            address: "Central Civic Center, Indiranagar, Bangalore"
        },
        {
            id: 2,
            name: "Bharath Kumar",
            email: "bharath@example.com",
            phone: "+91 99001 23456",
            role: "user",
            password: "user123",
            address: "No. 42, 4th Cross, Indiranagar, Bangalore"
        },
        {
            id: 3,
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            phone: "+91 98765 43219",
            role: "user",
            password: "user123",
            address: "Flat 302, Royal Palms, Koramangala, Bangalore"
        }
    ],
    bookings: [
        {
            id: 1,
            booking_reference: "SCH-2026-1001",
            user_id: 2,
            user_name: "Bharath Kumar",
            user_email: "bharath@example.com",
            user_phone: "+91 99001 23456",
            hall_id: 1,
            hall_name: "Royal Palace Convention Centre",
            hall_location: "Indiranagar, Bangalore",
            event_type: "Wedding",
            booking_date: "2026-11-25",
            start_time: "08:00",
            end_time: "22:00",
            guest_count: 950,
            special_requests: "Mandap flower decoration setup from 6 AM. 5 VIP parking passes.",
            hall_rate: 75000,
            tax_amount: 13500,
            deposit_amount: 15000,
            total_amount: 103500,
            status: "approved",
            admin_remarks: "Approved by Admin. All verification checks passed.",
            created_at: "2026-11-01 10:30:00"
        },
        {
            id: 2,
            booking_reference: "SCH-2026-1002",
            user_id: 3,
            user_name: "Priya Sharma",
            user_email: "priya.sharma@example.com",
            user_phone: "+91 98765 43219",
            hall_id: 2,
            hall_name: "Sanskriti Heritage Hall",
            hall_location: "Jayanagar, Bangalore",
            event_type: "Reception",
            booking_date: "2026-12-05",
            start_time: "16:00",
            end_time: "23:00",
            guest_count: 650,
            special_requests: "Grand stage backdrop with golden lighting, vegetarian dining arrangement.",
            hall_rate: 52000,
            tax_amount: 9360,
            deposit_amount: 10000,
            total_amount: 71360,
            status: "approved",
            admin_remarks: "Confirmed. Security supervisor briefed.",
            created_at: "2026-11-03 14:15:00"
        },
        {
            id: 3,
            booking_reference: "SCH-2026-1003",
            user_id: 2,
            user_name: "Bharath Kumar",
            user_email: "bharath@example.com",
            user_phone: "+91 99001 23456",
            hall_id: 4,
            hall_name: "Harmony Banquet & Conference Pavilion",
            hall_location: "Whitefield, Bangalore",
            event_type: "Meeting",
            booking_date: "2026-11-18",
            start_time: "09:00",
            end_time: "18:00",
            guest_count: 250,
            special_requests: "Projector, wireless collars mics, corporate buffet catering setup.",
            hall_rate: 42000,
            tax_amount: 7560,
            deposit_amount: 8000,
            total_amount: 57560,
            status: "pending",
            admin_remarks: "Awaiting catering vendor verification by hall supervisor.",
            created_at: "2026-11-08 11:20:00"
        },
        {
            id: 4,
            booking_reference: "SCH-2026-1004",
            user_id: 2,
            user_name: "Bharath Kumar",
            user_email: "bharath@example.com",
            user_phone: "+91 99001 23456",
            hall_id: 6,
            hall_name: "Ashirwad Mini Celebration Hall",
            hall_location: "Rajajinagar, Bangalore",
            event_type: "Birthday",
            booking_date: "2026-11-30",
            start_time: "17:00",
            end_time: "22:00",
            guest_count: 120,
            special_requests: "Kids play area setup near dining corner, helium balloons allowed.",
            hall_rate: 18000,
            tax_amount: 3240,
            deposit_amount: 4000,
            total_amount: 25240,
            status: "pending",
            admin_remarks: "Under review for weekend slot scheduling.",
            created_at: "2026-11-09 16:45:00"
        }
    ],
    maintenance: [
        {
            id: 1,
            hall_id: 7,
            hall_name: "Utsav Grand Multipurpose Hall",
            reason: "Annual Electrical Overhaul & Central AC Duct Sanitization",
            start_date: "2026-11-08",
            end_date: "2026-11-22",
            notes: "Rewiring stage dimmer boards and servicing chillers.",
            status: "in_progress"
        },
        {
            id: 2,
            hall_id: 2,
            hall_name: "Sanskriti Heritage Hall",
            reason: "Teak Wood Polish & Stage Curtain Motor Replacement",
            start_date: "2026-12-15",
            end_date: "2026-12-18",
            notes: "Heritage wood treatment and anti-termite application.",
            status: "scheduled"
        }
    ]
};

// Initialize LocalStorage if not present
function initializeStorage() {
    let storedHalls = localStorage.getItem('sch_halls');
    if (!storedHalls) {
        localStorage.setItem('sch_halls', JSON.stringify(INITIAL_DEMO_DATA.halls));
    } else {
        // Upgrade existing stored halls with price_per_guest if missing
        try {
            const parsed = JSON.parse(storedHalls);
            let updated = false;
            parsed.forEach(h => {
                if (h.price_per_guest === undefined) {
                    const match = INITIAL_DEMO_DATA.halls.find(ih => ih.id === h.id);
                    h.price_per_guest = match ? match.price_per_guest : 100;
                    updated = true;
                }
            });
            if (updated) {
                localStorage.setItem('sch_halls', JSON.stringify(parsed));
            }
        } catch (e) {}
    }
    if (!localStorage.getItem('sch_users')) {
        localStorage.setItem('sch_users', JSON.stringify(INITIAL_DEMO_DATA.users));
    }
    if (!localStorage.getItem('sch_bookings')) {
        localStorage.setItem('sch_bookings', JSON.stringify(INITIAL_DEMO_DATA.bookings));
    }
    if (!localStorage.getItem('sch_maintenance')) {
        localStorage.setItem('sch_maintenance', JSON.stringify(INITIAL_DEMO_DATA.maintenance));
    }
}

initializeStorage();

// Centralized Data Access Layer
const DataService = {
    isBackendOnline: false,
    lastCheckTime: 0,

    async checkBackend() {
        const now = Date.now();
        // Cache backend status for 5 seconds to prevent network lag
        if (now - this.lastCheckTime < 5000) {
            return this.isBackendOnline;
        }
        this.lastCheckTime = now;
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 800);
            const res = await fetch(`${CONFIG.API_BASE_URL}/health`, { signal: controller.signal });
            clearTimeout(timeoutId);
            this.isBackendOnline = res.ok;
        } catch (e) {
            this.isBackendOnline = false;
        }
        return this.isBackendOnline;
    },

    // Halls API
    async getHalls(filters = {}) {
        try {
            await this.checkBackend();
            if (this.isBackendOnline) {
                const params = new URLSearchParams(filters);
                const res = await fetch(`${CONFIG.API_BASE_URL}/halls?${params}`);
                const data = await res.json();
                if (data && data.halls) return data.halls;
            }
        } catch (e) {
            console.warn('Backend fetch failed, falling back to local dataset');
        }

        // Local Storage Mode
        let halls = JSON.parse(localStorage.getItem('sch_halls')) || INITIAL_DEMO_DATA.halls;
        
        if (filters.search) {
            const term = filters.search.toLowerCase();
            halls = halls.filter(h => 
                h.name.toLowerCase().includes(term) || 
                h.location.toLowerCase().includes(term) ||
                h.facilities.toLowerCase().includes(term)
            );
        }
        if (filters.location && filters.location !== 'all') {
            halls = halls.filter(h => h.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.minCapacity) {
            halls = halls.filter(h => h.capacity >= Number(filters.minCapacity));
        }
        if (filters.maxPrice) {
            halls = halls.filter(h => h.price_per_day <= Number(filters.maxPrice));
        }
        if (filters.status) {
            halls = halls.filter(h => h.status === filters.status);
        }

        return halls;
    },

    async getHallById(id) {
        // First check locally for instant response
        const localHalls = JSON.parse(localStorage.getItem('sch_halls')) || INITIAL_DEMO_DATA.halls;
        const localMatch = localHalls.find(h => Number(h.id) === Number(id));

        try {
            await this.checkBackend();
            if (this.isBackendOnline) {
                const res = await fetch(`${CONFIG.API_BASE_URL}/halls/${id}`);
                const data = await res.json();
                if (data && data.hall) return data.hall;
            }
        } catch (e) {
            console.warn('Backend getHallById failed, using cached hall');
        }

        return localMatch || INITIAL_DEMO_DATA.halls[0];
    },

    async createHall(hallData) {
        await this.checkBackend();
        if (this.isBackendOnline) {
            const token = localStorage.getItem('sch_token');
            const res = await fetch(`${CONFIG.API_BASE_URL}/halls`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(hallData)
            });
            return await res.json();
        }

        const halls = JSON.parse(localStorage.getItem('sch_halls')) || [];
        const newHall = {
            id: halls.length > 0 ? Math.max(...halls.map(h => h.id)) + 1 : 1,
            ...hallData
        };
        halls.push(newHall);
        localStorage.setItem('sch_halls', JSON.stringify(halls));
        return { success: true, message: 'Hall added successfully!', hall: newHall };
    },

    async updateHall(id, hallData) {
        await this.checkBackend();
        if (this.isBackendOnline) {
            const token = localStorage.getItem('sch_token');
            const res = await fetch(`${CONFIG.API_BASE_URL}/halls/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(hallData)
            });
            return await res.json();
        }

        const halls = JSON.parse(localStorage.getItem('sch_halls')) || [];
        const index = halls.findIndex(h => Number(h.id) === Number(id));
        if (index !== -1) {
            halls[index] = { ...halls[index], ...hallData };
            localStorage.setItem('sch_halls', JSON.stringify(halls));
            return { success: true, message: 'Hall updated successfully!' };
        }
        return { success: false, message: 'Hall not found' };
    },

    async deleteHall(id) {
        await this.checkBackend();
        if (this.isBackendOnline) {
            const token = localStorage.getItem('sch_token');
            const res = await fetch(`${CONFIG.API_BASE_URL}/halls/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            return await res.json();
        }

        let halls = JSON.parse(localStorage.getItem('sch_halls')) || [];
        halls = halls.filter(h => Number(h.id) !== Number(id));
        localStorage.setItem('sch_halls', JSON.stringify(halls));
        return { success: true, message: 'Hall removed successfully.' };
    },

    // Bookings API
    async checkAvailability(hallId, bookingDate, startTime, endTime) {
        // Maintenance Check
        const maintenance = JSON.parse(localStorage.getItem('sch_maintenance')) || [];
        const isUnderMaint = maintenance.some(m => 
            Number(m.hall_id) === Number(hallId) &&
            m.status !== 'cancelled' &&
            bookingDate >= m.start_date && bookingDate <= m.end_date
        );

        if (isUnderMaint) {
            return { available: false, reason: `Hall is scheduled for maintenance on ${bookingDate}.` };
        }

        // Existing Bookings Check
        const bookings = JSON.parse(localStorage.getItem('sch_bookings')) || [];
        const conflict = bookings.find(b => {
            if (Number(b.hall_id) === Number(hallId) && b.booking_date === bookingDate && ['approved', 'pending'].includes(b.status)) {
                if (!startTime || !endTime) return true;
                const bS = b.start_time.slice(0, 5);
                const bE = b.end_time.slice(0, 5);
                const nS = startTime.slice(0, 5);
                const nE = endTime.slice(0, 5);
                return (nS < bE) && (nE > bS);
            }
            return false;
        });

        if (conflict) {
            return {
                available: false,
                reason: `Time slot conflict: Already booked from ${conflict.start_time} to ${conflict.end_time} (${conflict.booking_reference})`
            };
        }

        return { available: true };
    },

    async createBooking(bookingPayload) {
        await this.checkBackend();
        if (this.isBackendOnline) {
            const token = localStorage.getItem('sch_token');
            const res = await fetch(`${CONFIG.API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(bookingPayload)
            });
            return await res.json();
        }

        // Local Storage Flow with strict double-booking check
        const avail = await this.checkAvailability(
            bookingPayload.hallId,
            bookingPayload.bookingDate,
            bookingPayload.startTime,
            bookingPayload.endTime
        );

        if (!avail.available) {
            return { success: false, message: avail.reason };
        }

        const hall = await this.getHallById(bookingPayload.hallId);
        if (!hall) return { success: false, message: 'Selected hall not found.' };

        if (Number(bookingPayload.guestCount) > hall.capacity) {
            return {
                success: false,
                message: `Guest count (${bookingPayload.guestCount}) exceeds hall capacity (${hall.capacity}).`
            };
        }

        const guests = Math.max(0, Number(bookingPayload.guestCount) || 0);
        const guestFee = guests * 100; // ₹100 per guest facility fee
        const rate = Number(hall.price_per_day);
        const subtotal = rate + guestFee;
        const tax = subtotal * CONFIG.TAX_RATE;
        const deposit = Number(hall.caution_deposit) || CONFIG.DEFAULT_DEPOSIT;
        const total = subtotal + tax + deposit;

        const ref = `SCH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

        const user = Auth.getCurrentUser() || {
            id: Date.now(),
            name: bookingPayload.fullName,
            email: bookingPayload.email,
            phone: bookingPayload.phone
        };

        const newBooking = {
            id: Date.now(),
            booking_reference: ref,
            user_id: user.id,
            user_name: bookingPayload.fullName || user.name,
            user_email: bookingPayload.email || user.email,
            user_phone: bookingPayload.phone || user.phone,
            hall_id: hall.id,
            hall_name: hall.name,
            hall_location: hall.location,
            event_type: bookingPayload.eventType,
            booking_date: bookingPayload.bookingDate,
            start_time: bookingPayload.startTime,
            end_time: bookingPayload.endTime,
            guest_count: Number(bookingPayload.guestCount),
            special_requests: bookingPayload.specialRequests || '',
            hall_rate: rate,
            tax_amount: tax,
            deposit_amount: deposit,
            total_amount: total,
            status: 'pending',
            created_at: new Date().toISOString().replace('T', ' ').slice(0, 19)
        };

        const bookings = JSON.parse(localStorage.getItem('sch_bookings')) || [];
        bookings.unshift(newBooking);
        localStorage.setItem('sch_bookings', JSON.stringify(bookings));

        return {
            success: true,
            message: 'Booking request placed successfully! Awaiting admin review.',
            bookingReference: ref,
            booking: newBooking
        };
    },

    async getUserBookings(userId) {
        const bookings = JSON.parse(localStorage.getItem('sch_bookings')) || [];
        if (!userId) return bookings;
        return bookings.filter(b => Number(b.user_id) === Number(userId));
    },

    async getAllBookings() {
        return JSON.parse(localStorage.getItem('sch_bookings')) || [];
    },

    async updateBookingStatus(bookingId, status, remarks = '') {
        const bookings = JSON.parse(localStorage.getItem('sch_bookings')) || [];
        const index = bookings.findIndex(b => Number(b.id) === Number(bookingId));
        if (index !== -1) {
            bookings[index].status = status;
            if (remarks) bookings[index].admin_remarks = remarks;
            localStorage.setItem('sch_bookings', JSON.stringify(bookings));
            return { success: true, message: `Booking marked as ${status.toUpperCase()}` };
        }
        return { success: false, message: 'Booking not found.' };
    },

    async cancelBooking(bookingId, reason = '') {
        const bookings = JSON.parse(localStorage.getItem('sch_bookings')) || [];
        const index = bookings.findIndex(b => Number(b.id) === Number(bookingId));
        if (index !== -1) {
            bookings[index].status = 'cancelled';
            bookings[index].cancellation_reason = reason;
            localStorage.setItem('sch_bookings', JSON.stringify(bookings));
            return { success: true, message: 'Booking has been cancelled.' };
        }
        return { success: false, message: 'Booking not found' };
    },

    // Maintenance Management
    async getMaintenanceSchedules() {
        return JSON.parse(localStorage.getItem('sch_maintenance')) || [];
    },

    async createMaintenance(data) {
        const list = JSON.parse(localStorage.getItem('sch_maintenance')) || [];
        const halls = JSON.parse(localStorage.getItem('sch_halls')) || [];
        const hall = halls.find(h => Number(h.id) === Number(data.hallId));

        const newMaint = {
            id: Date.now(),
            hall_id: Number(data.hallId),
            hall_name: hall ? hall.name : 'Community Hall',
            reason: data.reason,
            start_date: data.startDate,
            end_date: data.endDate,
            notes: data.notes || '',
            status: data.status || 'scheduled'
        };

        list.unshift(newMaint);
        localStorage.setItem('sch_maintenance', JSON.stringify(list));

        // Update hall status
        const today = new Date().toISOString().split('T')[0];
        if (today >= data.startDate && today <= data.endDate && hall) {
            hall.status = 'maintenance';
            localStorage.setItem('sch_halls', JSON.stringify(halls));
        }

        return { success: true, message: 'Maintenance scheduled successfully!', item: newMaint };
    },

    async updateMaintenanceStatus(id, status) {
        const list = JSON.parse(localStorage.getItem('sch_maintenance')) || [];
        const index = list.findIndex(m => Number(m.id) === Number(id));
        if (index !== -1) {
            list[index].status = status;
            localStorage.setItem('sch_maintenance', JSON.stringify(list));

            // Restore hall if completed/cancelled
            if (['completed', 'cancelled'].includes(status)) {
                const hallId = list[index].hall_id;
                const halls = JSON.parse(localStorage.getItem('sch_halls')) || [];
                const hIdx = halls.findIndex(h => h.id === hallId);
                if (hIdx !== -1) {
                    halls[hIdx].status = 'available';
                    localStorage.setItem('sch_halls', JSON.stringify(halls));
                }
            }
            return { success: true, message: `Maintenance status updated to ${status}.` };
        }
        return { success: false, message: 'Maintenance item not found.' };
    }
};

// UI Helper Utilities
const UI = {
    formatCurrency(amount) {
        return `${CONFIG.CURRENCY_SYMBOL}${Number(amount).toLocaleString('en-IN')}`;
    },

    formatDate(dateStr) {
        if (!dateStr) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-IN', options);
    },

    showToast(message, type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' :
                     type === 'error' ? 'fa-exclamation-circle' :
                     type === 'warning' ? 'fa-triangle-exclamation' : 'fa-info-circle';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
};
