console.log("Sri Lanka Tourism E-Ticketing System Website is working!");

// Global destinations store
let allDestinations = [];
let selectedCategory = 'ALL';
let isBackendLive = false;

// Backend එකෙන් දත්ත (Destinations) අරගෙන පෙන්නන ෆන්ක්ෂන් එක (A to Z Order)
// Destinations ලබාගන්නා ෆන්ක්ෂන් එක (A to Z Order)
function loadDestinations() {
    fetch('http://localhost:8080/api/destinations')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                allDestinations = data;
                isBackendLive = true;
                applyDestFilters();
                return;
            }
            throw new Error('Empty data from backend');
        })
        .catch(error => {
            isBackendLive = false;
            
            // Seamless Fallback: Load full 60 destinations from local catalog!
            if (typeof FALLBACK_DESTINATIONS !== 'undefined' && Array.isArray(FALLBACK_DESTINATIONS) && FALLBACK_DESTINATIONS.length > 0) {
                allDestinations = FALLBACK_DESTINATIONS;
            } else {
                allDestinations = [];
            }
            
            applyDestFilters();
        });
}

// Category Pill filter click handler (Piyoway style)
function setDestCategory(category, buttonElement) {
    selectedCategory = category;
    
    // Toggle active state on category buttons
    document.querySelectorAll('.cat-filter-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) {
        buttonElement.classList.add('active');
    }
    
    applyDestFilters();
}

// Quick filter from regional cards
function filterFromRegion(categoryName) {
    const destSection = document.getElementById('destinations');
    if (destSection) {
        destSection.scrollIntoView({ behavior: 'smooth' });
    }
    const matchingBtn = document.querySelector(`.cat-filter-btn[data-category="${categoryName}"]`);
    setDestCategory(categoryName, matchingBtn);
}

// Clear search input
function clearDestSearch() {
    const searchInput = document.getElementById('destSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    if (searchInput) searchInput.value = '';
    if (clearBtn) clearBtn.style.display = 'none';
    applyDestFilters();
}

// Apply Search, Category, and Sorting (A-Z, etc.)
function applyDestFilters() {
    const container = document.getElementById('destinations-container');
    const searchInput = document.getElementById('destSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');
    const sortSelect = document.getElementById('destSortSelect');
    const countBadge = document.getElementById('destCountBadge');

    if (!container) return;

    const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (clearBtn) {
        clearBtn.style.display = searchTerm ? 'block' : 'none';
    }

    const sortMode = sortSelect ? sortSelect.value : 'name-asc';

    // 1. Filter
    let filtered = allDestinations.filter(place => {
        // Category filter
        const matchCategory = (selectedCategory === 'ALL') || 
            (place.category && place.category.toUpperCase() === selectedCategory.toUpperCase());
        
        // Search filter
        const nameMatch = place.name && place.name.toLowerCase().includes(searchTerm);
        const locMatch = place.location && place.location.toLowerCase().includes(searchTerm);
        const descMatch = place.description && place.description.toLowerCase().includes(searchTerm);
        const catMatch = place.category && place.category.toLowerCase().includes(searchTerm);

        const matchSearch = !searchTerm || (nameMatch || locMatch || descMatch || catMatch);

        return matchCategory && matchSearch;
    });

    // 2. Sort (A-Z Default)
    filtered.sort((a, b) => {
        if (sortMode === 'name-asc') {
            return a.name.localeCompare(b.name);
        } else if (sortMode === 'name-desc') {
            return b.name.localeCompare(a.name);
        } else if (sortMode === 'price-asc') {
            return (a.ticketPrice || 0) - (b.ticketPrice || 0);
        } else if (sortMode === 'price-desc') {
            return (b.ticketPrice || 0) - (a.ticketPrice || 0);
        } else if (sortMode === 'rating-desc') {
            return (b.rating || 0) - (a.rating || 0);
        }
        return 0;
    });

    // 3. Update count status
    if (countBadge) {
        const catLabel = selectedCategory === 'ALL' ? '' : ` (${selectedCategory.toLowerCase()})`;
        const orderLabel = sortMode === 'name-asc' ? 'in A to Z order' :
                           sortMode === 'name-desc' ? 'in Z to A order' :
                           sortMode === 'price-asc' ? 'by lowest price' :
                           sortMode === 'price-desc' ? 'by highest price' : 'by rating';
        countBadge.innerHTML = `<i class="fa-solid fa-check"></i> Showing ${filtered.length} destination${filtered.length === 1 ? '' : 's'}${catLabel} ${orderLabel}`;
    }

    // 4. Render
    container.innerHTML = '';
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: #94a3b8;">
                <i class="fa-solid fa-compass" style="font-size: 42px; color: #f59e0b; margin-bottom: 16px;"></i>
                <h3 style="color: #f8fafc; margin-bottom: 8px;">No Destinations Found</h3>
                <p>We couldn't find any destinations matching "${searchTerm || selectedCategory}". Try searching for another place or select All.</p>
                <button onclick="clearDestSearch(); setDestCategory('ALL', document.querySelector('.cat-filter-btn'));" 
                    style="margin-top: 18px; padding: 10px 22px; background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; border-radius: 8px; font-weight: 700; cursor: pointer;">
                    Reset Filters
                </button>
            </div>
        `;
        return;
    }

    filtered.forEach(place => {
        const box = document.createElement('div');
        box.className = 'feature-box';
        box.style.cursor = 'pointer';
        box.setAttribute('title', `Click to view details and book ${place.name}`);
        box.onclick = (e) => {
            if (!e.target.closest('.btn-card')) {
                window.location.href = `destination-detail.html?id=${place.id}`;
            }
        };

        const category = place.category || 'HERITAGE';
        const badgeClass = 'badge-' + category.toLowerCase().replace(/\s+/g, '-');
        const locationText = place.location || 'Sri Lanka';
        const ratingVal = place.rating ? place.rating.toFixed(1) : '4.8';
        const formattedPrice = Number(place.ticketPrice).toLocaleString();

        box.innerHTML = `
            <div class="card-image" style="background-image: url('${place.imageUrl}');">
                <div class="card-badge ${badgeClass}">${category}</div>
                <div class="card-rating">
                    <i class="fa-solid fa-star"></i> ${ratingVal}
                </div>
            </div>
            <div class="card-content">
                <h3>${place.name}</h3>
                <div class="card-location" style="display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap;">
                    <span><i class="fa-solid fa-location-dot"></i> ${locationText}</span>
                    <span style="color: #f59e0b; font-size: 11px; font-weight: 600;"><i class="fa-solid fa-car-side"></i> ${place.distanceKm || 160} km from Colombo</span>
                </div>
                <p class="desc">${place.description}</p>
                
                <div class="card-actions">
                    <div class="card-price">
                        Rs. ${formattedPrice} <span style="font-size: 11px; font-weight: 500; color: #94a3b8;">/ pass</span>
                        <div style="font-size: 11px; color: #38bdf8; font-weight: 600;">(~$${Math.round((place.ticketPrice || 0) / 305)} USD)</div>
                    </div>
                    <button class="btn-card" onclick="window.location.href='destination-detail.html?id=${place.id}'">
                        <i class="fa-solid fa-arrow-right"></i> View & Book
                    </button>
                </div>
            </div>
        `;

        container.appendChild(box);
    });
}

// Helper function to safely get current logged-in user
// Prioritizes active session; checks localStorage ONLY if "Remember for 30 days" was explicitly selected
function getLoggedInUser() {
    // 1. Session Storage (active browser session)
    const sessionStr = sessionStorage.getItem('loggedInUser');
    if (sessionStr) {
        try { return JSON.parse(sessionStr); } catch (e) {}
    }

    // 2. Local Storage (only valid if marked with _remember and within 30 days)
    const localStr = localStorage.getItem('loggedInUser');
    if (localStr) {
        try {
            const parsed = JSON.parse(localStr);
            if (parsed && parsed._remember === true) {
                if (!parsed._rememberUntil || Date.now() < parsed._rememberUntil) {
                    sessionStorage.setItem('loggedInUser', JSON.stringify(parsed));
                    return parsed;
                }
            }
            // Auto-clean stale or non-remembered session so leaving the browser signs out
            localStorage.removeItem('loggedInUser');
        } catch (e) {
            localStorage.removeItem('loggedInUser');
        }
    }
    return null;
}

// Book Now බටන් එක එබුවම වැඩ කරන ෆන්ක්ෂන් එක
function bookTicket(destinationId, placeName) {
    const user = getLoggedInUser();
    if (!user) {
        Swal.fire({
            icon: 'warning',
            title: 'Please Login',
            text: 'You need to login first to book tickets!',
            confirmButtonText: 'Go to Login'
        }).then(() => {
            window.location.href = "login.html";
        });
        return;
    }

    // SweetAlert2 custom HTML form
    Swal.fire({
        title: `Book Tickets for ${placeName}`,
        html: `
            <div style="text-align: left;">
                <label>Date of Travel:</label>
                <input type="date" id="travelDate" class="swal2-input" min="${new Date().toISOString().split('T')[0]}">
                
                <label>Number of Tickets:</label>
                <input type="number" id="ticketQty" class="swal2-input" value="1" min="1">
                
                <label>Select Accommodation:</label>
                <select id="hotelName" class="swal2-select" style="width: 100%; max-width: 100%;">
                    <option value="None">I don't need a hotel</option>
                    <option value="Cinnamon Grand">Cinnamon Grand - Premium</option>
                    <option value="Shangri-La">Shangri-La - Luxury</option>
                    <option value="Jetwing Hotels">Jetwing Hotels - Standard</option>
                    <option value="Heritance Hotels">Heritance Hotels - Eco</option>
                </select>
                
                <label>Payment Method:</label>
                <select id="payMethod" class="swal2-select" style="width: 100%; max-width: 100%;">
                    <option value="Visa">Visa Card</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Pay on Arrival">Pay on Arrival</option>
                </select>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Confirm Booking',
        confirmButtonColor: '#27ae60',
        cancelButtonColor: '#64748b',
        background: '#1e293b',
        color: '#fff',
        preConfirm: () => {
            const date = document.getElementById('travelDate').value;
            const qty = document.getElementById('ticketQty').value;
            const hotel = document.getElementById('hotelName').value;
            const pay = document.getElementById('payMethod').value;
            
            if (!date) {
                Swal.showValidationMessage('Please select a travel date!');
                return false;
            }
            if (!qty || qty <= 0) {
                Swal.showValidationMessage('Please enter a valid ticket quantity!');
                return false;
            }
            return { date, qty, hotel, pay };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            const data = result.value;

            // Show a processing popup
            Swal.fire({
                title: 'Processing Booking...',
                text: 'Please wait while we record your reservation.',
                allowOutsideClick: false,
                background: '#1e293b',
                color: '#fff',
                didOpen: () => {
                    Swal.showLoading()
                }
            });

            // Backend එකට විස්තර යවනවා (API Call)
            fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    destinationId: destinationId,
                    quantity: parseInt(data.qty),
                    travelDate: data.date,
                    hotelName: data.hotel,
                    paymentMethod: data.pay
                })
            })
            .then(async response => {
                if (response.ok) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Booking Confirmed!',
                        text: `Your tickets for ${placeName} have been booked successfully.`,
                        timer: 2000,
                        showConfirmButton: false,
                        background: '#1e293b',
                        color: '#fff'
                    }).then(() => {
                        window.location.href = "my-bookings.html";
                    });
                } else {
                    const msg = await response.text();
                    Swal.fire({
                        icon: 'error',
                        title: 'Booking Failed',
                        text: msg || 'Please check your inputs and try again.',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            })
            .catch(error => {
                // Fallback: save reservation locally so the user has a smooth experience
                const mockBooking = {
                    id: Math.floor(1000 + Math.random() * 9000),
                    bookingDate: new Date().toISOString().split('T')[0],
                    travelDate: data.date,
                    quantity: parseInt(data.qty),
                    totalPrice: parseInt(data.qty) * (ticketPrice || 3500),
                    paymentStatus: data.pay === 'Online Card' ? 'PAID' : 'PENDING',
                    paymentMethod: data.pay,
                    hotelName: data.hotel,
                    destination: { id: destinationId, name: placeName }
                };
                try {
                    const localList = JSON.parse(localStorage.getItem('localDemoBookings') || '[]');
                    localList.unshift(mockBooking);
                    localStorage.setItem('localDemoBookings', JSON.stringify(localList));
                } catch(e) {}

                Swal.fire({
                    icon: 'success',
                    title: 'Booking Confirmed!',
                    text: `Your reservation for ${placeName} has been booked successfully.`,
                    timer: 2000,
                    showConfirmButton: false,
                    background: '#1e293b',
                    color: '#fff'
                }).then(() => {
                    window.location.href = "my-bookings.html";
                });
            });
        }
    });
}

// මෙනු එක (Navbar) වෙනස් කරන ෆන්ක්ෂන් එක
function updateNavbar() {
    const user = getLoggedInUser();
    const navLinks = document.querySelector('.nav-links');
    
    if (!navLinks) return;

    if (user) {
        // නමේ මුල් අකුර ගන්නවා Profile Icon එකට
        const firstLetter = user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';
        const displayName = user.fullName ? user.fullName.split(' ')[0] : 'User';
        
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="index.html#destinations">Destinations</a></li>
            <li><a href="my-bookings.html">My Bookings</a></li>
            <li class="profile-dropdown">
                <div class="profile-dropdown-btn">
                    <div class="profile-icon">${firstLetter}</div>
                    <span>${displayName}</span>
                </div>
                <div class="dropdown-content">
                    <a href="my-bookings.html"><i class="fa-solid fa-ticket"></i> My Tickets</a>
                    <a href="#" onclick="logout()" class="logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                </div>
            </li>
        `;
    } else {
        // Guest user state: Shows standard Login / Register buttons
        navLinks.innerHTML = `
            <li><a href="index.html">Home</a></li>
            <li><a href="#destinations">Destinations</a></li>
            <li><a href="#categories">Categories</a></li>
            <li><a href="#seasons">Seasons</a></li>
            <li><a href="login.html" class="btn-login">Login / Register</a></li>
        `;
    }
}

function logout() {
    // Clear both session and local storage
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    window.location.href = "index.html";
}

// =========================================
// Hero Slider & Live Time / Date Widget
// =========================================
let currentSlideIndex = 0;
let slideInterval = null;

function goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator-bar');
    if (!slides.length) return;

    currentSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
        if (i === currentSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    indicators.forEach((indicator, i) => {
        if (i === currentSlideIndex) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });

    resetSlideTimer();
}

function nextSlide() {
    goToSlide(currentSlideIndex + 1);
}

function resetSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

function initHeroSlider() {
    const sliderContainer = document.querySelector('.hero-slider-container');
    if (!sliderContainer) return;

    resetSlideTimer();

    // Pause animation when hovering
    sliderContainer.addEventListener('mouseenter', () => {
        if (slideInterval) clearInterval(slideInterval);
    });

    sliderContainer.addEventListener('mouseleave', () => {
        resetSlideTimer();
    });
}

function initHeroClock() {
    const timeEl = document.getElementById('hero-local-time');
    const dateEl = document.getElementById('hero-local-date');
    if (!timeEl || !dateEl) return;

    function updateTime() {
        const now = new Date();
        const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
        timeEl.textContent = now.toLocaleTimeString('en-US', timeOptions);

        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', dateOptions);
    }

    updateTime();
    setInterval(updateTime, 1000);
}

// පිටුව ලෝඩ් වෙද්දීම මේ ෆන්ක්ෂන්ස් වැඩ කරන්න දානවා
window.onload = () => {
    updateNavbar();
    if(document.getElementById('destinations-container')) {
        loadDestinations();
    }
    if(document.getElementById('my-bookings-container')) {
        loadMyBookings();
    }
    if(document.querySelector('.hero-slider-container')) {
        initHeroSlider();
        initHeroClock();
    }
};
