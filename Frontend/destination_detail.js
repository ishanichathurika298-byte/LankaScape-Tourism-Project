// Destination Detail & Booking Page Controller
let currentDestination = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuthNav();
    initDateInput();
    loadDestinationDetails();
});

// Helper function to safely get current logged-in user
function getLoggedInUser() {
    const sessionStr = sessionStorage.getItem('loggedInUser');
    if (sessionStr) {
        try { return JSON.parse(sessionStr); } catch (e) {}
    }
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
            localStorage.removeItem('loggedInUser');
        } catch (e) {
            localStorage.removeItem('loggedInUser');
        }
    }
    return null;
}

// Setup auth state in navbar
function initAuthNav() {
    const authNavItem = document.getElementById('auth-nav-item');
    const user = getLoggedInUser();

    if (user && authNavItem) {
        authNavItem.innerHTML = `
            <div class="profile-dropdown">
                <div class="profile-dropdown-btn">
                    <div class="profile-icon">${user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}</div>
                    <span>${user.fullName ? user.fullName.split(' ')[0] : 'User'}</span>
                </div>
                <div class="dropdown-content">
                    <a href="my-bookings.html"><i class="fa-solid fa-ticket"></i> My Bookings</a>
                    <a href="#" onclick="logoutUser()" class="logout-btn"><i class="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                </div>
            </div>
        `;
    } else if (authNavItem) {
        authNavItem.innerHTML = `
            <a href="login.html" class="nav-btn-login">Sign in</a>
            <a href="register.html" class="nav-btn-register">Register</a>
        `;
    }
}

function logoutUser() {
    sessionStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInUser');
    window.location.reload();
}

// Minimum date for travel is today
function initDateInput() {
    const travelDateInput = document.getElementById('bookTravelDate');
    if (travelDateInput) {
        const today = new Date().toISOString().split('T')[0];
        travelDateInput.min = today;
        travelDateInput.value = today;
    }
}

// Fetch destination details by ID
function loadDestinationDetails() {
    const params = new URLSearchParams(window.location.search);
    const destId = params.get('id');

    if (!destId) {
        Swal.fire({
            icon: 'error',
            title: 'No Destination Selected',
            text: 'Please select a destination from the Explore page.',
            confirmButtonText: 'Browse Destinations'
        }).then(() => {
            window.location.href = 'index.html#destinations';
        });
        return;
    }

    fetch(`http://localhost:8080/api/destinations/${destId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Destination not found on server');
            }
            return response.json();
        })
        .then(data => {
            currentDestination = data;
            renderDestinationDetails(data);
        })
        .catch(err => {
            console.warn('Backend unavailable, checking fallback destination catalog:', err);
            if (typeof FALLBACK_DESTINATIONS !== 'undefined' && Array.isArray(FALLBACK_DESTINATIONS)) {
                const found = FALLBACK_DESTINATIONS.find(d => String(d.id) === String(destId));
                if (found) {
                    currentDestination = found;
                    renderDestinationDetails(found);
                    return;
                }
            }
            Swal.fire({
                icon: 'error',
                title: 'Destination Not Found',
                text: 'We could not find the requested destination in the catalog.',
                confirmButtonText: 'Back to Destinations'
            }).then(() => {
                window.location.href = 'index.html#destinations';
            });
        });
}

// Render details into DOM
function renderDestinationDetails(dest) {
    document.title = `${dest.name} - LankaScape`;

    // Dynamic Full-Page Background (Ambient destination photo with transparent overlay)
    const ambientBg = document.getElementById('detailAmbientBg');
    if (ambientBg && dest.imageUrl) {
        ambientBg.style.backgroundImage = `url('${dest.imageUrl}')`;
    }

    // Breadcrumb
    const breadcrumb = document.getElementById('breadcrumbDestName');
    if (breadcrumb) breadcrumb.innerText = dest.name;

    // Showcase Image & Badges
    const showcaseCard = document.getElementById('showcaseCard');
    if (showcaseCard) {
        showcaseCard.style.backgroundImage = `url('${dest.imageUrl}')`;
    }

    const catBadge = document.getElementById('destCategoryBadge');
    if (catBadge) {
        catBadge.innerText = dest.category || 'HERITAGE';
        catBadge.className = 'showcase-pill badge-' + (dest.category || 'heritage').toLowerCase().replace(/\s+/g, '-');
    }

    const ratingVal = document.getElementById('destRatingVal');
    if (ratingVal) {
        ratingVal.innerText = dest.rating ? dest.rating.toFixed(1) : '4.8';
    }

    // Title, Location, Description
    const locationText = document.getElementById('destLocationText');
    if (locationText) {
        locationText.innerText = dest.location || 'Sri Lanka';
    }

    // Colombo Distance & Drive Duration
    const destDistanceText = document.getElementById('destDistanceText');
    const km = dest.distanceKm || 160;
    const timeStr = dest.travelTime || '3.5 hrs drive';
    if (destDistanceText) {
        destDistanceText.innerText = `${km} km • ${timeStr}`;
    }

    // Dynamic Transport Options based on distance from Colombo
    setupTransportOptions(km);

    const destTitle = document.getElementById('destTitle');
    if (destTitle) {
        destTitle.innerText = dest.name;
    }

    const destDescription = document.getElementById('destDescription');
    if (destDescription) {
        destDescription.innerText = dest.description;
    }

    // Booking widget base ticket price
    const widgetPrice = document.getElementById('widgetTicketPrice');
    if (widgetPrice) {
        widgetPrice.innerText = `Rs. ${Number(dest.ticketPrice).toLocaleString()}`;
    }

    calculateLiveTotal();
}

// Dynamically calibrate roundtrip private transport costs based on Colombo distance & real operational expenses
function setupTransportOptions(distanceKm) {
    let sedanPrice = 0;
    const km = Number(distanceKm) || 160;

    if (km <= 20) {
        // Colombo City / Suburban Tour (Half/Full Day package with chauffeur, fuel, parking)
        sedanPrice = 16000;
    } else {
        // Real-world Sri Lanka Tour Operator Roundtrip formula:
        // Roundtrip distance (Colombo -> Destination -> Colombo) + 25km local sightseeing roaming
        const roundtripKm = (km * 2) + 25;
        // Base Day Chauffeur fee + Highway Tolls + Per KM fuel and fleet maintenance
        const baseOperationalCost = 10000;
        const perKmRate = 105;
        sedanPrice = Math.round((baseOperationalCost + (roundtripKm * perKmRate)) / 500) * 500;
    }

    // Luxury Van KDH has higher fuel consumption, capacity (4-8 pax) & driver allowance
    const vanPrice = Math.round((sedanPrice * 1.38) / 500) * 500;
    // Tourist Mini Coach (9-15 pax)
    const coachPrice = Math.round((sedanPrice * 1.90) / 500) * 500;

    const optSedan = document.getElementById('optSedan');
    if (optSedan) {
        optSedan.setAttribute('data-price', sedanPrice);
        optSedan.innerText = `Private AC Sedan (1-3 Pax) (+Rs. ${sedanPrice.toLocaleString()})`;
    }

    const optVan = document.getElementById('optVan');
    if (optVan) {
        optVan.setAttribute('data-price', vanPrice);
        optVan.innerText = `Luxury AC Van / KDH (4-8 Pax) (+Rs. ${vanPrice.toLocaleString()})`;
    }

    const optCoach = document.getElementById('optCoach');
    if (optCoach) {
        optCoach.setAttribute('data-price', coachPrice);
        optCoach.innerText = `Tourist Mini Coach (9-15 Pax) (+Rs. ${coachPrice.toLocaleString()})`;
    }
}

// Quantity Counter
function adjustQty(delta) {
    const qtyInput = document.getElementById('bookTicketQty');
    if (!qtyInput) return;

    let currentVal = parseInt(qtyInput.value, 10) || 1;
    let newVal = currentVal + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 50) newVal = 50;

    qtyInput.value = newVal;
    calculateLiveTotal();
}

// Live Price Calculator
function calculateLiveTotal() {
    if (!currentDestination) return;

    const qtyInput = document.getElementById('bookTicketQty');
    const vehicleSelect = document.getElementById('bookVehicleSelect');
    const guideSelect = document.getElementById('bookGuideSelect');
    const mealSelect = document.getElementById('bookMealSelect');
    const hotelSelect = document.getElementById('bookHotelSelect');

    const qty = parseInt(qtyInput ? qtyInput.value : 1, 10) || 1;
    const ticketPrice = Number(currentDestination.ticketPrice) || 0;
    const subtotalTickets = ticketPrice * qty;

    // Transport Cost (from Colombo)
    let transportCost = 0;
    if (vehicleSelect) {
        const selectedVehicleOpt = vehicleSelect.options[vehicleSelect.selectedIndex];
        transportCost = Number(selectedVehicleOpt.getAttribute('data-price')) || 0;
    }

    // Guide Cost
    let guideCost = 0;
    if (guideSelect) {
        const selectedGuideOpt = guideSelect.options[guideSelect.selectedIndex];
        guideCost = Number(selectedGuideOpt.getAttribute('data-price')) || 0;
    }

    // Meal Cost (per person)
    let mealPerPerson = 0;
    if (mealSelect) {
        const selectedMealOpt = mealSelect.options[mealSelect.selectedIndex];
        mealPerPerson = Number(selectedMealOpt.getAttribute('data-price')) || 0;
    }
    const subtotalMeals = mealPerPerson * qty;

    // Hotel Cost
    let hotelCost = 0;
    if (hotelSelect) {
        const selectedHotelOpt = hotelSelect.options[hotelSelect.selectedIndex];
        hotelCost = Number(selectedHotelOpt.getAttribute('data-price')) || 0;
    }

    const grandTotal = subtotalTickets + transportCost + guideCost + subtotalMeals + hotelCost;
    const grandTotalUsd = Math.round(grandTotal / 305); // Approx exchange rate 1 USD = 305 LKR

    // Update labels & breakdown in UI
    const lblTicket = document.getElementById('lblTicketBreakdown');
    if (lblTicket) lblTicket.innerText = `${qty} × Entry Ticket${qty > 1 ? 's' : ''}:`;

    const valTicket = document.getElementById('valTicketBreakdown');
    if (valTicket) valTicket.innerText = `Rs. ${subtotalTickets.toLocaleString()}`;

    const valTransport = document.getElementById('valTransportBreakdown');
    if (valTransport) valTransport.innerText = `Rs. ${transportCost.toLocaleString()}`;

    const valGuide = document.getElementById('valGuideBreakdown');
    if (valGuide) valGuide.innerText = `Rs. ${guideCost.toLocaleString()}`;

    const lblMeal = document.getElementById('lblMealBreakdown');
    if (lblMeal) lblMeal.innerText = `Meals (${qty} Pax):`;

    const valMeal = document.getElementById('valMealBreakdown');
    if (valMeal) valMeal.innerText = `Rs. ${subtotalMeals.toLocaleString()}`;

    const valHotel = document.getElementById('valHotelBreakdown');
    if (valHotel) valHotel.innerText = `Rs. ${hotelCost.toLocaleString()}`;

    const valTotal = document.getElementById('valTotalDisplay');
    if (valTotal) valTotal.innerText = `Rs. ${grandTotal.toLocaleString()}`;

    const valTotalUsd = document.getElementById('valTotalUsd');
    if (valTotalUsd) valTotalUsd.innerText = `(~$${grandTotalUsd.toLocaleString()} USD)`;
}

// Form Submission & API Call
function handleFormSubmit(event) {
    event.preventDefault();

    if (!currentDestination) return;

    // 1. Check Login
    const user = getLoggedInUser();
    if (!user) {
        Swal.fire({
            icon: 'warning',
            title: 'Login Required',
            text: 'You need to be signed in to book your tickets and tour packages.',
            showCancelButton: true,
            confirmButtonText: 'Go to Login',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login.html';
            }
        });
        return;
    }
    const travelDate = document.getElementById('bookTravelDate').value;
    const pickupLocation = document.getElementById('bookPickupLocation').value;
    const qty = parseInt(document.getElementById('bookTicketQty').value, 10) || 1;
    
    const vehicleSelect = document.getElementById('bookVehicleSelect');
    const vehicleType = vehicleSelect ? vehicleSelect.value : 'None';
    const transportCost = vehicleSelect ? (Number(vehicleSelect.options[vehicleSelect.selectedIndex].getAttribute('data-price')) || 0) : 0;

    const guideSelect = document.getElementById('bookGuideSelect');
    const guideType = guideSelect ? guideSelect.value : 'None';
    const guideCost = guideSelect ? (Number(guideSelect.options[guideSelect.selectedIndex].getAttribute('data-price')) || 0) : 0;

    const mealSelect = document.getElementById('bookMealSelect');
    const mealPlan = mealSelect ? mealSelect.value : 'None';
    const mealPerPax = mealSelect ? (Number(mealSelect.options[mealSelect.selectedIndex].getAttribute('data-price')) || 0) : 0;
    const mealCost = mealPerPax * qty;

    const hotelSelect = document.getElementById('bookHotelSelect');
    const hotelName = hotelSelect ? hotelSelect.value : 'None';
    const hotelCost = hotelSelect ? (Number(hotelSelect.options[hotelSelect.selectedIndex].getAttribute('data-price')) || 0) : 0;

    const payMethod = document.getElementById('bookPayMethod').value;
    const ticketPrice = Number(currentDestination.ticketPrice) || 0;
    const ticketCost = ticketPrice * qty;
    const grandTotal = ticketCost + transportCost + guideCost + mealCost + hotelCost;

    if (!travelDate) {
        Swal.fire({
            icon: 'error',
            title: 'Please Select a Date',
            text: 'A valid date of travel is required for ticket reservation.'
        });
        return;
    }

    // Disable button to prevent double-click
    const submitBtn = document.getElementById('btnSubmitBooking');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Tour Package...';
    }

    const bookingPayload = {
        userId: user.id,
        destinationId: currentDestination.id,
        quantity: qty,
        travelDate: travelDate,
        pickupLocation: pickupLocation,
        vehicleType: vehicleType,
        guideType: guideType,
        mealPlan: mealPlan,
        hotelName: hotelName,
        paymentMethod: payMethod,
        paymentStatus: 'PAID',
        transactionId: null,
        ticketCost: ticketCost,
        transportCost: transportCost,
        guideCost: guideCost,
        mealCost: mealCost,
        hotelCost: hotelCost,
        totalPrice: grandTotal
    };

    // Route to appropriate customer payment flow
    if (payMethod === 'Pay on Arrival') {
        openPayOnArrivalModal(bookingPayload, currentDestination, user, submitBtn);
    } else if (payMethod === 'PayPal') {
        openPayPalModal(bookingPayload, currentDestination, user, submitBtn);
    } else {
        // Visa or Mastercard Credit/Debit Gateway
        openCardPaymentModal(bookingPayload, currentDestination, user, submitBtn);
    }
}

// -------------------------------------------------------------
// Interactive Customer Payment Gateways (Card, PayPal, Pay on Arrival)
// -------------------------------------------------------------

function generateTxnId(prefix) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${prefix}-${Date.now().toString(36).toUpperCase()}-${code}`;
}

// 1. Interactive Bank-Grade Credit/Debit Card Payment Gateway Modal
function openCardPaymentModal(bookingPayload, currentDestination, user, submitBtn) {
    const amountLkr = Number(bookingPayload.totalPrice || 0).toLocaleString();
    const usdTotal = Math.round((bookingPayload.totalPrice || 0) / 305);
    const cardBrand = bookingPayload.paymentMethod === 'Mastercard' ? 'Mastercard' : 'Visa';

    Swal.fire({
        title: '',
        width: 480,
        background: '#1e293b',
        color: '#f8fafc',
        showCancelButton: true,
        confirmButtonText: `<i class="fa-solid fa-lock"></i> Pay Rs. ${amountLkr}`,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        focusConfirm: false,
        html: `
            <div style="text-align: left; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                <!-- Header with Trust Badges -->
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 12px; margin-bottom: 16px;">
                    <div>
                        <div style="font-size: 18px; font-weight: 800; color: #ffffff;">Secure Card Checkout</div>
                        <div style="font-size: 11px; color: #94a3b8;"><i class="fa-solid fa-shield-halved" style="color: #10b981;"></i> 256-bit SSL • LankaPay / 3D-Secure 2.0</div>
                    </div>
                    <div style="display: flex; gap: 8px; font-size: 24px;">
                        <i id="cardBrandIconVisa" class="fa-brands fa-cc-visa" style="color: #38bdf8;"></i>
                        <i id="cardBrandIconMastercard" class="fa-brands fa-cc-mastercard" style="color: #f97316;"></i>
                        <i id="cardBrandIconAmex" class="fa-brands fa-cc-amex" style="color: #0ea5e9;"></i>
                    </div>
                </div>

                <!-- Realistic Credit Card Graphic Preview -->
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%); border-radius: 14px; padding: 18px 20px; color: #ffffff; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.15); margin-bottom: 16px; position: relative;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                        <i class="fa-solid fa-microchip" style="color: #fcd34d; font-size: 28px;"></i>
                        <span id="previewCardBrand" style="font-size: 14px; font-weight: 800; letter-spacing: 1px; color: #38bdf8;">${cardBrand.toUpperCase()}</span>
                    </div>
                    <div id="previewCardNumber" style="font-family: monospace; font-size: 18px; letter-spacing: 2px; margin-bottom: 14px; color: #f8fafc;">
                        •••• •••• •••• ••••
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <div>
                            <span style="color: #94a3b8; display: block; font-size: 9px; text-transform: uppercase;">Card Holder</span>
                            <strong id="previewCardName" style="color: #ffffff; text-transform: uppercase;">${(user.fullName || 'TOURIST NAME').substring(0, 22)}</strong>
                        </div>
                        <div>
                            <span style="color: #94a3b8; display: block; font-size: 9px; text-transform: uppercase;">Expires</span>
                            <strong id="previewCardExpiry" style="color: #ffffff;">MM/YY</strong>
                        </div>
                    </div>
                </div>

                <!-- Order Summary Mini Pill -->
                <div style="background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 12.5px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #94a3b8;">Tour:</span> <strong style="color: #f1f5f9;">${currentDestination.name}</strong>
                    </div>
                    <div>
                        <span style="color: #94a3b8;">Amount:</span> <strong style="color: #10b981; font-size: 14px;">Rs. ${amountLkr}</strong>
                        <span style="color: #38bdf8; font-size: 11px;">(~$${usdTotal} USD)</span>
                    </div>
                </div>

                <!-- Form Fields -->
                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11.5px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; text-transform: uppercase;">Cardholder Name</label>
                    <input type="text" id="payCardName" value="${user.fullName || ''}" placeholder="Name as on card" style="width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #ffffff; font-size: 13.5px; outline: none;">
                </div>

                <div style="margin-bottom: 12px;">
                    <label style="display: block; font-size: 11.5px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; text-transform: uppercase;">Card Number</label>
                    <div style="position: relative;">
                        <input type="text" id="payCardNumber" placeholder="4532 •••• •••• ••••" maxlength="19" style="width: 100%; box-sizing: border-box; padding: 10px 40px 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #ffffff; font-size: 14px; font-family: monospace; outline: none;">
                        <i id="inputCardBrandIcon" class="fa-solid fa-credit-card" style="position: absolute; right: 12px; top: 12px; color: #94a3b8;"></i>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                    <div>
                        <label style="display: block; font-size: 11.5px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; text-transform: uppercase;">Expiration (MM/YY)</label>
                        <input type="text" id="payCardExpiry" placeholder="12/28" maxlength="5" style="width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #ffffff; font-size: 13.5px; font-family: monospace; outline: none;">
                    </div>
                    <div>
                        <label style="display: block; font-size: 11.5px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; text-transform: uppercase;">CVV / CVC (3-digit)</label>
                        <input type="password" id="payCardCvv" placeholder="•••" maxlength="4" style="width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 8px; color: #ffffff; font-size: 13.5px; font-family: monospace; outline: none;">
                    </div>
                </div>

                <!-- One-Click Demo Card Test Button -->
                <div style="text-align: center; margin-top: 4px; margin-bottom: 6px;">
                    <button type="button" id="btnFillDemoCard" style="background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px dashed rgba(56, 189, 248, 0.4); padding: 6px 14px; border-radius: 6px; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.2s;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Click here to auto-fill Test Demo Card
                    </button>
                </div>
            </div>
        `,
        didOpen: () => {
            const inputNum = document.getElementById('payCardNumber');
            const inputName = document.getElementById('payCardName');
            const inputExp = document.getElementById('payCardExpiry');
            const inputCvv = document.getElementById('payCardCvv');
            const previewNum = document.getElementById('previewCardNumber');
            const previewName = document.getElementById('previewCardName');
            const previewExp = document.getElementById('previewCardExpiry');
            const previewBrand = document.getElementById('previewCardBrand');
            const inputBrandIcon = document.getElementById('inputCardBrandIcon');
            const btnFillDemo = document.getElementById('btnFillDemoCard');

            // Format card number with spaces every 4 digits
            inputNum.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
                e.target.value = formatted;
                previewNum.textContent = formatted || '•••• •••• •••• ••••';

                // Detect card brand
                if (val.startsWith('4')) {
                    previewBrand.textContent = 'VISA';
                    previewBrand.style.color = '#38bdf8';
                    inputBrandIcon.className = 'fa-brands fa-cc-visa';
                    inputBrandIcon.style.color = '#38bdf8';
                } else if (val.startsWith('5')) {
                    previewBrand.textContent = 'MASTERCARD';
                    previewBrand.style.color = '#f97316';
                    inputBrandIcon.className = 'fa-brands fa-cc-mastercard';
                    inputBrandIcon.style.color = '#f97316';
                } else if (val.startsWith('3')) {
                    previewBrand.textContent = 'AMEX';
                    previewBrand.style.color = '#0ea5e9';
                    inputBrandIcon.className = 'fa-brands fa-cc-amex';
                    inputBrandIcon.style.color = '#0ea5e9';
                } else {
                    previewBrand.textContent = 'CREDIT CARD';
                    previewBrand.style.color = '#ffffff';
                    inputBrandIcon.className = 'fa-solid fa-credit-card';
                    inputBrandIcon.style.color = '#94a3b8';
                }
            });

            // Cardholder name live sync
            inputName.addEventListener('input', (e) => {
                previewName.textContent = (e.target.value || user.fullName || 'TOURIST NAME').substring(0, 22).toUpperCase();
            });

            // Expiry auto-slash format MM/YY
            inputExp.addEventListener('input', (e) => {
                let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                if (val.length >= 2) {
                    val = val.substring(0, 2) + '/' + val.substring(2);
                }
                e.target.value = val;
                previewExp.textContent = val || 'MM/YY';
            });

            // Auto-fill demo card shortcut
            btnFillDemo.addEventListener('click', () => {
                inputName.value = user.fullName || 'MR. JOHN DOE';
                inputNum.value = '4532 8820 1934 5621';
                inputExp.value = '11/28';
                inputCvv.value = '782';

                previewName.textContent = inputName.value.toUpperCase();
                previewNum.textContent = inputNum.value;
                previewExp.textContent = inputExp.value;
                previewBrand.textContent = 'VISA';
                previewBrand.style.color = '#38bdf8';
                inputBrandIcon.className = 'fa-brands fa-cc-visa';
                inputBrandIcon.style.color = '#38bdf8';
            });
        },
        preConfirm: () => {
            const cardName = document.getElementById('payCardName').value.trim();
            const rawCardNum = document.getElementById('payCardNumber').value.replace(/\s/g, '');
            const cardExpiry = document.getElementById('payCardExpiry').value.trim();
            const cardCvv = document.getElementById('payCardCvv').value.trim();

            if (!cardName) {
                Swal.showValidationMessage('Please enter cardholder name');
                return false;
            }
            if (rawCardNum.length < 16) {
                Swal.showValidationMessage('Please enter a valid 16-digit card number');
                return false;
            }
            if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
                Swal.showValidationMessage('Please enter a valid expiry date (MM/YY)');
                return false;
            }
            if (cardCvv.length < 3) {
                Swal.showValidationMessage('Please enter a 3 or 4 digit CVV/CVC code');
                return false;
            }
            return { cardName, rawCardNum, cardExpiry, cardCvv };
        }
    }).then((res) => {
        if (res.isConfirmed) {
            // Simulated 3D-Secure 2.0 Authorization
            Swal.fire({
                title: 'Authorizing Payment...',
                html: `
                    <div style="font-size: 13.5px; color: #cbd5e1; line-height: 1.6; text-align: center;">
                        <div style="margin-bottom: 10px;"><i class="fa-solid fa-lock" style="color: #10b981;"></i> 256-bit Secure LankaPay Gateway</div>
                        <p style="margin: 0; color: #38bdf8;">Connecting to Bank 3D-Secure 2.0 Verification...</p>
                        <small style="color: #94a3b8;">Authenticating Rs. ${amountLkr}...</small>
                    </div>
                `,
                allowOutsideClick: false,
                background: '#1e293b',
                color: '#fff',
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                const txnId = generateTxnId('TXN-LS');
                bookingPayload.paymentStatus = 'PAID';
                bookingPayload.transactionId = txnId;

                // Send to backend
                submitBookingToBackend(bookingPayload, currentDestination, user, submitBtn);
            }, 1200);
        } else {
            // Restore button if cancelled
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Book Complete Tour Package';
            }
        }
    });
}

// 2. Interactive PayPal Express Checkout Modal
function openPayPalModal(bookingPayload, currentDestination, user, submitBtn) {
    const amountLkr = Number(bookingPayload.totalPrice || 0).toLocaleString();
    const usdTotal = Math.round((bookingPayload.totalPrice || 0) / 305);

    Swal.fire({
        title: '',
        width: 460,
        background: '#1e293b',
        color: '#f8fafc',
        showCancelButton: true,
        confirmButtonText: `<i class="fa-brands fa-paypal"></i> Pay $${usdTotal} USD with PayPal`,
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#0070ba',
        cancelButtonColor: '#64748b',
        html: `
            <div style="text-align: center; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;">
                <div style="margin-bottom: 16px;">
                    <i class="fa-brands fa-paypal" style="color: #0070ba; font-size: 46px;"></i>
                    <h3 style="margin: 8px 0 4px; color: #ffffff; font-size: 20px;">PayPal Express Checkout</h3>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">Pay safely with your PayPal balance or linked international cards</p>
                </div>

                <div style="background: #0f172a; border-radius: 12px; padding: 18px; border: 1px solid #334155; margin-bottom: 16px; text-align: left;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                        <span style="color: #94a3b8;">Tour Destination:</span>
                        <strong style="color: #ffffff;">${currentDestination.name}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px;">
                        <span style="color: #94a3b8;">LKR Total:</span>
                        <strong style="color: #10b981;">Rs. ${amountLkr}</strong>
                    </div>
                    <div style="border-top: 1px dashed #334155; padding-top: 10px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #cbd5e1; font-weight: 700;">USD Total Charged:</span>
                        <strong style="color: #38bdf8; font-size: 18px;">$${usdTotal}.00 USD</strong>
                    </div>
                </div>

                <div style="background: rgba(0, 112, 186, 0.1); border: 1px solid rgba(0, 112, 186, 0.3); border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #7dd3fc; text-align: left;">
                    <i class="fa-solid fa-circle-info"></i> Logged in as: <strong>${user.email || 'guest@tourist.com'}</strong> (PayPal Sandbox / Live)
                </div>
            </div>
        `
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({
                title: 'Connecting to PayPal...',
                html: '<span style="color: #94a3b8; font-size: 13px;">Processing instant USD transaction approval...</span>',
                allowOutsideClick: false,
                background: '#1e293b',
                color: '#fff',
                didOpen: () => Swal.showLoading()
            });

            setTimeout(() => {
                const txnId = generateTxnId('PP-TXN');
                bookingPayload.paymentStatus = 'PAID';
                bookingPayload.transactionId = txnId;
                submitBookingToBackend(bookingPayload, currentDestination, user, submitBtn);
            }, 1100);
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Book Complete Tour Package';
            }
        }
    });
}

// 3. Pay on Arrival / Cash Reservation Modal
function openPayOnArrivalModal(bookingPayload, currentDestination, user, submitBtn) {
    const amountLkr = Number(bookingPayload.totalPrice || 0).toLocaleString();
    const usdTotal = Math.round((bookingPayload.totalPrice || 0) / 305);

    Swal.fire({
        title: 'Pay on Arrival Reservation',
        width: 480,
        background: '#1e293b',
        color: '#f8fafc',
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '<i class="fa-solid fa-hand-holding-dollar"></i> Confirm (Pay on Arrival)',
        denyButtonText: '<i class="fa-solid fa-credit-card"></i> Pay Online with Card Instead',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#f59e0b',
        denyButtonColor: '#10b981',
        cancelButtonColor: '#64748b',
        html: `
            <div style="text-align: left; font-size: 13.5px; line-height: 1.6; color: #cbd5e1;">
                <div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 14px; margin-bottom: 14px;">
                    <div style="color: #fcd34d; font-weight: 700; font-size: 14px; margin-bottom: 4px;">
                        <i class="fa-solid fa-circle-check"></i> Instant Booking Guarantee
                    </div>
                    Your tour date, private chauffeur, and site tickets will be secured right now.
                </div>

                <div style="background: #0f172a; padding: 12px 16px; border-radius: 8px; border: 1px solid #334155; margin-bottom: 14px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                        <span>Total Due on Arrival:</span>
                        <strong style="color: #10b981; font-size: 15px;">Rs. ${amountLkr}</strong>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 12px; color: #94a3b8;">
                        <span>USD Equivalent:</span>
                        <strong style="color: #38bdf8;">~$${usdTotal} USD</strong>
                    </div>
                </div>

                <p style="font-size: 12.5px; color: #94a3b8; margin: 0;">
                    <i class="fa-solid fa-info-circle" style="color: #38bdf8;"></i> You can pay this amount in <strong>Cash (LKR, USD, EUR) or POS Card</strong> directly to your tourist chauffeur when they pick you up. You can also pay online anytime before the trip via <em>My Bookings</em>.
                </p>
            </div>
        `
    }).then((res) => {
        if (res.isConfirmed) {
            const txnId = generateTxnId('POA-REF');
            bookingPayload.paymentStatus = 'PENDING_ARRIVAL';
            bookingPayload.transactionId = txnId;
            submitBookingToBackend(bookingPayload, currentDestination, user, submitBtn);
        } else if (res.isDenied) {
            // User chose to pay online with card instead
            bookingPayload.paymentMethod = 'Visa';
            openCardPaymentModal(bookingPayload, currentDestination, user, submitBtn);
        } else {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Book Complete Tour Package';
            }
        }
    });
}

// 4. Send Validated & Paid Booking to Spring Boot Backend
function submitBookingToBackend(bookingPayload, currentDestination, user, submitBtn) {
    fetch('http://localhost:8080/api/bookings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingPayload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server returned error ' + response.status);
        }
        return response.json();
    })
    .then(savedBooking => {
        const grandTotal = savedBooking.totalPrice || bookingPayload.totalPrice;
        const usdTotal = Math.round(grandTotal / 305);
        const bookingRef = `BK-2026-${String(savedBooking.id).padStart(4, '0')}`;
        const isPaid = (savedBooking.paymentStatus === 'PAID');
        const txnId = savedBooking.transactionId || (isPaid ? 'ONLINE-CARD' : 'POA-CHAUFFEUR');

        const qrPayload = `https://lankascape.lk/verify?ref=${bookingRef}&pax=${encodeURIComponent(user.fullName)}&dest=${encodeURIComponent(currentDestination.name)}&date=${savedBooking.travelDate}&total=${savedBooking.totalPrice}&pay=${savedBooking.paymentStatus}&txn=${txnId}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrPayload)}`;

        Swal.fire({
            icon: 'success',
            title: isPaid ? 'Payment & Tour Confirmed!' : 'Tour Package Reserved!',
            background: '#1e293b',
            color: '#f8fafc',
            html: `
                <div style="text-align: left; padding: 6px 0; font-size: 13.5px; line-height: 1.6;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px; margin-bottom: 10px;">
                        <span>Voucher Ref: <strong style="color: #38bdf8;">#${bookingRef}</strong></span>
                        <span style="background: ${isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${isPaid ? '#10b981' : '#f59e0b'}; font-size: 11px; padding: 3px 10px; border-radius: 12px; font-weight: 800; border: 1px solid ${isPaid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'};">
                            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i> ${isPaid ? 'PAID IN FULL' : 'PAY ON ARRIVAL'}
                        </span>
                    </div>

                    <div style="background: #0f172a; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; font-size: 12px; display: flex; justify-content: space-between; font-family: monospace;">
                        <span style="color: #94a3b8;">TRANSACTION REF:</span>
                        <strong style="color: #38bdf8;">${txnId}</strong>
                    </div>

                    <p style="margin-bottom: 4px;"><strong>Tour:</strong> ${currentDestination.name}</p>
                    <p style="margin-bottom: 4px;"><strong>Date:</strong> ${savedBooking.travelDate}</p>
                    <p style="margin-bottom: 4px;"><strong>Pickup:</strong> ${savedBooking.pickupLocation}</p>
                    <p style="margin-bottom: 4px;"><strong>Travelers:</strong> ${savedBooking.quantity} Person(s)</p>
                    <p style="margin-bottom: 4px;"><strong>Vehicle:</strong> ${savedBooking.vehicleType}</p>
                    <p style="margin-bottom: 4px;"><strong>Guide:</strong> ${savedBooking.guideType}</p>
                    <p style="margin-bottom: 4px;"><strong>Meal Plan:</strong> ${savedBooking.mealPlan}</p>
                    <p style="margin-bottom: 4px;"><strong>Hotel:</strong> ${savedBooking.hotelName}</p>
                    <p style="margin-bottom: 4px;"><strong>Payment Method:</strong> ${savedBooking.paymentMethod}</p>

                    <div style="border-top: 1px solid rgba(255,255,255,0.15); margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <strong>Total Amount:</strong>
                        <div>
                            <span style="color: #10b981; font-weight: 800; font-size: 16px;">Rs. ${Number(savedBooking.totalPrice).toLocaleString()}</span>
                            <span style="color: #38bdf8; font-weight: 700; font-size: 12px;">(~$${usdTotal} USD)</span>
                        </div>
                    </div>

                    <div style="text-align: center; margin-top: 12px; background: rgba(15, 23, 42, 0.6); padding: 10px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">
                        <img src="${qrCodeUrl}" alt="Booking QR Code" style="width: 120px; height: 120px; border-radius: 6px; background: white; padding: 4px;">
                        <div style="font-size: 11px; color: #38bdf8; font-weight: 700; margin-top: 4px;">
                            <i class="fa-solid fa-qrcode"></i> SCANNABLE PASSENGER QR CODE
                        </div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-print"></i> Print Official Voucher',
            cancelButtonText: 'View in My Bookings',
            confirmButtonColor: '#e07a27',
            cancelButtonColor: '#0284c7'
        }).then((result) => {
            if (result.isConfirmed) {
                printTourVoucherDirect(savedBooking, currentDestination, user, qrCodeUrl, bookingRef);
            } else {
                window.location.href = 'my-bookings.html';
            }
        });
    })
    .catch(error => {
        console.warn('Backend server offline, falling back to local demo booking:', error);
        // Fallback: create mock saved booking locally so the user can still see the complete voucher and QR code!
        const mockId = Math.floor(1000 + Math.random() * 9000);
        const savedBooking = {
            id: mockId,
            ...bookingPayload,
            totalPrice: bookingPayload.totalPrice || 25000,
            paymentStatus: bookingPayload.paymentStatus || 'PAID',
            travelDate: bookingPayload.travelDate || new Date().toISOString().split('T')[0]
        };

        // Store in local storage for my-bookings
        try {
            const localList = JSON.parse(localStorage.getItem('localDemoBookings') || '[]');
            localList.unshift({
                ...savedBooking,
                destination: currentDestination
            });
            localStorage.setItem('localDemoBookings', JSON.stringify(localList));
        } catch(e) {}

        const grandTotal = savedBooking.totalPrice;
        const usdTotal = Math.round(grandTotal / 305);
        const bookingRef = `BK-2026-${String(savedBooking.id).padStart(4, '0')}`;
        const isPaid = (savedBooking.paymentStatus === 'PAID');
        const txnId = savedBooking.transactionId || (isPaid ? 'ONLINE-CARD-DEMO' : 'POA-CHAUFFEUR');

        const qrPayload = `https://lankascape.lk/verify?ref=${bookingRef}&pax=${encodeURIComponent(user.fullName)}&dest=${encodeURIComponent(currentDestination.name)}&date=${savedBooking.travelDate}&total=${savedBooking.totalPrice}&pay=${savedBooking.paymentStatus}&txn=${txnId}`;
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrPayload)}`;

        Swal.fire({
            icon: 'success',
            title: isPaid ? 'Payment & Tour Confirmed! (Demo Mode)' : 'Tour Package Reserved! (Demo Mode)',
            background: '#1e293b',
            color: '#f8fafc',
            html: `
                <div style="text-align: left; padding: 6px 0; font-size: 13.5px; line-height: 1.6;">
                    <div style="background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; border-radius: 6px; padding: 6px 10px; margin-bottom: 10px; font-size: 12px; color: #fbbf24;">
                        <i class="fa-solid fa-circle-info"></i> Recorded in Offline Demo Mode. Start <b>RUN_PROJECT.bat</b> to persist in MySQL.
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px; margin-bottom: 10px;">
                        <span>Voucher Ref: <strong style="color: #38bdf8;">#${bookingRef}</strong></span>
                        <span style="background: ${isPaid ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; color: ${isPaid ? '#10b981' : '#f59e0b'}; font-size: 11px; padding: 3px 10px; border-radius: 12px; font-weight: 800; border: 1px solid ${isPaid ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)'};">
                            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i> ${isPaid ? 'PAID IN FULL' : 'PAY ON ARRIVAL'}
                        </span>
                    </div>

                    <div style="background: #0f172a; padding: 8px 12px; border-radius: 8px; margin-bottom: 10px; font-size: 12px; display: flex; justify-content: space-between; font-family: monospace;">
                        <span style="color: #94a3b8;">TRANSACTION REF:</span>
                        <strong style="color: #38bdf8;">${txnId}</strong>
                    </div>

                    <div style="text-align: center; margin: 12px 0;">
                        <img src="${qrCodeUrl}" alt="Booking QR Code" style="width: 140px; height: 140px; border-radius: 8px; border: 2px solid #38bdf8; background: white; padding: 4px;">
                        <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">
                            <i class="fa-solid fa-qrcode"></i> Dynamic Scannable Verification QR
                        </div>
                    </div>

                    <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 8px; font-size: 12.5px;">
                        <div><strong>Destination:</strong> ${currentDestination.name}</div>
                        <div><strong>Travel Date:</strong> ${savedBooking.travelDate}</div>
                        <div><strong>Total Amount:</strong> LKR ${Number(grandTotal).toLocaleString()} (approx $${usdTotal} USD)</div>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fa-solid fa-print"></i> Print Official A4 Voucher',
            cancelButtonText: 'Go to My Bookings',
            confirmButtonColor: '#e07a27',
            cancelButtonColor: '#0284c7'
        }).then((result) => {
            if (result.isConfirmed) {
                printTourVoucherDirect(savedBooking, currentDestination, user, qrCodeUrl, bookingRef);
            } else {
                window.location.href = 'my-bookings.html';
            }
        });
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-ticket"></i> Book Complete Tour Package';
        }
    });
}

// Dedicated High-Resolution A4 Tour Voucher Print Generator
function printTourVoucherDirect(booking, dest, user, qrUrl, bookingRef) {
    const unitPrice = dest.ticketPrice || 0;
    const ticketTotal = booking.ticketCost || (booking.quantity * unitPrice);
    const transportTotal = booking.transportCost || 0;
    const guideTotal = booking.guideCost || 0;
    const mealTotal = booking.mealCost || 0;
    const hotelTotal = booking.hotelCost || 0;
    const grandTotal = booking.totalPrice || (ticketTotal + transportTotal + guideTotal + mealTotal + hotelTotal);
    const usdTotal = Math.round(grandTotal / 305);
    const isPaid = (booking.paymentStatus === 'PAID');
    const txnId = booking.transactionId || (isPaid ? 'TXN-LS-VERIFIED' : 'POA-CHAUFFEUR');

    const printWindow = window.open('', '_blank', 'width=880,height=960');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>LankaScape Tour E-Voucher - ${bookingRef}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
            <style>
                @page { size: A4 portrait; margin: 12mm 15mm; }
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body {
                    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
                    background: #f1f5f9;
                    color: #1e293b;
                    padding: 24px;
                    font-size: 13px;
                    line-height: 1.5;
                }
                .print-controls-bar {
                    max-width: 780px;
                    margin: 0 auto 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .btn-print-action {
                    background: #e07a27;
                    color: #ffffff;
                    border: none;
                    padding: 11px 24px;
                    border-radius: 8px;
                    font-weight: 700;
                    font-size: 14px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(224, 122, 39, 0.3);
                }
                .btn-print-action:hover { background: #c25e11; }
                .voucher-card {
                    max-width: 780px;
                    margin: 0 auto;
                    border: 2px solid #cbd5e1;
                    border-radius: 12px;
                    padding: 32px;
                    background: #ffffff;
                    position: relative;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                }
                .header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #e07a27;
                    padding-bottom: 18px;
                    margin-bottom: 22px;
                }
                .brand-name {
                    font-size: 26px;
                    font-weight: 800;
                    color: #0f172a;
                    letter-spacing: -0.5px;
                }
                .brand-name span { color: #e07a27; }
                .brand-desc {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .company-meta {
                    font-size: 11px;
                    color: #64748b;
                    margin-top: 4px;
                    line-height: 1.4;
                }
                .ref-box {
                    text-align: right;
                }
                .ref-title {
                    font-size: 11px;
                    color: #64748b;
                    text-transform: uppercase;
                    font-weight: 700;
                }
                .ref-num {
                    font-size: 20px;
                    font-weight: 800;
                    color: #0284c7;
                    letter-spacing: 1px;
                }
                .verified-badge {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 3px 12px;
                    border-radius: 20px;
                    margin-top: 4px;
                }
                .section-heading {
                    font-size: 12px;
                    font-weight: 800;
                    color: #475569;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 10px;
                    border-left: 4px solid #e07a27;
                    padding-left: 8px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px 24px;
                    background: #f8fafc;
                    padding: 16px 20px;
                    border-radius: 8px;
                    border: 1px solid #e2e8f0;
                    margin-bottom: 22px;
                }
                .info-item strong {
                    display: block;
                    font-size: 11px;
                    color: #64748b;
                    text-transform: uppercase;
                }
                .info-item span {
                    font-size: 14px;
                    color: #0f172a;
                    font-weight: 600;
                }
                .cost-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 22px;
                }
                .cost-table th {
                    background: #f1f5f9;
                    color: #334155;
                    font-weight: 700;
                    text-align: left;
                    padding: 10px 14px;
                    font-size: 12px;
                    border-bottom: 2px solid #cbd5e1;
                }
                .cost-table td {
                    padding: 10px 14px;
                    border-bottom: 1px solid #e2e8f0;
                    color: #334155;
                }
                .cost-table tr.total-row td {
                    font-weight: 800;
                    font-size: 16px;
                    color: #0f172a;
                    background: #fffbeb;
                    border-top: 2px solid #e07a27;
                    border-bottom: 2px solid #e07a27;
                }
                .verification-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-top: 1px dashed #cbd5e1;
                    padding-top: 18px;
                    margin-top: 10px;
                }
                .notice-box {
                    max-width: 520px;
                    font-size: 11.5px;
                    color: #64748b;
                    line-height: 1.6;
                }
                .notice-box ul {
                    list-style-position: inside;
                    margin-top: 6px;
                }
                .qr-wrap {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .qr-frame {
                    width: 135px;
                    height: 135px;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 6px;
                    background: #ffffff;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.06);
                }
                @media print {
                    body { background: #ffffff; padding: 0; }
                    .print-controls-bar { display: none !important; }
                    .voucher-card { border: none; padding: 0; box-shadow: none; }
                }
            </style>
        </head>
        <body>
            <div class="print-controls-bar">
                <span style="font-size: 14px; color: #475569; font-weight: 600;">
                    <i class="fa-solid fa-file-invoice"></i> Official Passenger Voucher
                </span>
                <button class="btn-print-action" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> Print Voucher / Save as PDF
                </button>
            </div>

            <div class="voucher-card">
                <div class="header-row">
                    <div>
                        <div class="brand-name">Lanka<span>Scape</span></div>
                        <div class="brand-desc">Inbound Tours & Travel Colombo • Official E-Voucher</div>
                        <div class="company-meta">
                            Head Office: Level 14, World Trade Center, Colombo 01, Sri Lanka<br>
                            Hotline: +94 11 234 5678 • Email: tours@lankascape.lk • SLTDA/SQA/PRO/2026/0488
                        </div>
                    </div>
                    <div class="ref-box">
                        <div class="ref-title">VOUCHER REFERENCE</div>
                        <div class="ref-num">#${bookingRef}</div>
                        <div class="verified-badge" style="background: ${isPaid ? '#dcfce7' : '#fef3c7'}; color: ${isPaid ? '#15803d' : '#b45309'}; border: 1px solid ${isPaid ? '#86efac' : '#fcd34d'};">
                            <i class="fa-solid ${isPaid ? 'fa-circle-check' : 'fa-clock'}"></i> ${isPaid ? 'PAID IN FULL • ' + txnId : 'PAY ON ARRIVAL • PENDING'}
                        </div>
                    </div>
                </div>

                <div class="section-heading">Tour Itinerary & Passenger Details</div>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Lead Passenger Name:</strong>
                        <span>${user.fullName}</span>
                    </div>
                    <div class="info-item">
                        <strong>Tour Destination:</strong>
                        <span style="color: #0284c7;">${dest.name}</span>
                    </div>
                    <div class="info-item">
                        <strong>Travel Date:</strong>
                        <span>${booking.travelDate || 'Not specified'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Passenger Count:</strong>
                        <span>${booking.quantity} Person(s)</span>
                    </div>
                    <div class="info-item">
                        <strong>Departure / Pickup Point:</strong>
                        <span style="color: #b45309;">${booking.pickupLocation || 'Colombo Hotel'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Transport Vehicle:</strong>
                        <span>${booking.vehicleType || 'None (Self Arranged)'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Dedicated Tourist Guide:</strong>
                        <span>${booking.guideType || 'Chauffeur Guide Only'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Food & Dining Plan:</strong>
                        <span>${booking.mealPlan || 'No Meal Plan'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Accommodation / Hotel Stay:</strong>
                        <span>${booking.hotelName || 'Day Tour (No Overnight Stay)'}</span>
                    </div>
                    <div class="info-item">
                        <strong>Payment Status & Ref:</strong>
                        <span style="color: ${isPaid ? '#15803d' : '#b45309'}; font-weight: 700; font-family: monospace;">
                            ${isPaid ? 'PAID (' + txnId + ')' : 'PAY ON ARRIVAL (' + txnId + ')'}
                        </span>
                    </div>
                </div>

                <div class="section-heading">Itemized Payment & Receipt Details</div>
                <table class="cost-table">
                    <thead>
                        <tr>
                            <th>Package Component</th>
                            <th>Service Description</th>
                            <th style="text-align: right;">Amount (LKR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Site Entry Passes</strong></td>
                            <td>${booking.quantity} × Official Sanctuary/Site Passes</td>
                            <td style="text-align: right;">Rs. ${ticketTotal.toLocaleString()}</td>
                        </tr>
                        ${transportTotal > 0 ? `
                        <tr>
                            <td><strong>Colombo Private Transport</strong></td>
                            <td>Roundtrip AC Chauffeur Vehicle & Highway Tolls (${booking.vehicleType})</td>
                            <td style="text-align: right;">Rs. ${transportTotal.toLocaleString()}</td>
                        </tr>` : ''}
                        ${guideTotal > 0 ? `
                        <tr>
                            <td><strong>Dedicated Tourist Guide</strong></td>
                            <td>${booking.guideType}</td>
                            <td style="text-align: right;">Rs. ${guideTotal.toLocaleString()}</td>
                        </tr>` : ''}
                        ${mealTotal > 0 ? `
                        <tr>
                            <td><strong>Food & Dining Plan</strong></td>
                            <td>${booking.mealPlan} (${booking.quantity} Pax)</td>
                            <td style="text-align: right;">Rs. ${mealTotal.toLocaleString()}</td>
                        </tr>` : ''}
                        ${hotelTotal > 0 ? `
                        <tr>
                            <td><strong>Hotel Accommodation</strong></td>
                            <td>${booking.hotelName}</td>
                            <td style="text-align: right;">Rs. ${hotelTotal.toLocaleString()}</td>
                        </tr>` : ''}
                        <tr>
                            <td><strong>Payment Method & Processing</strong></td>
                            <td>${booking.paymentMethod || 'Credit/Debit Card'} (Ref: ${txnId})</td>
                            <td style="text-align: right; color: ${isPaid ? '#15803d' : '#b45309'}; font-weight: 700;">
                                ${isPaid ? 'CONFIRMED PAID' : 'PENDING ARRIVAL'}
                            </td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="2"><strong>${isPaid ? 'Grand Total Paid (All Inclusive)' : 'Total Due on Arrival (To Chauffeur)'}</strong></td>
                            <td style="text-align: right; color: ${isPaid ? '#15803d' : '#b45309'};">
                                Rs. ${grandTotal.toLocaleString()}<br>
                                <span style="font-size: 13px; color: #0284c7; font-weight: 600;">(~$${usdTotal} USD)</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="verification-footer">
                    <div class="notice-box">
                        <strong style="color: #0f172a;">Essential Passenger Notice:</strong>
                        <ul>
                            <li>Please present this digital voucher or physical printout upon vehicle pickup.</li>
                            <li>Your chauffeur will meet you at the designated departure point holding a LankaScape name board.</li>
                            <li>${isPaid ? 'Payment is fully settled. No additional site or chauffeur transport charges.' : 'Payment of Rs. ' + grandTotal.toLocaleString() + ' is due to your chauffeur upon departure.'}</li>
                            <li>24/7 Agency Helpline & Dispatch: <strong>+94 11 234 5678</strong>.</li>
                            <li>SLTDA Certified Inbound Tour Operator. Free cancellation up to 24h prior.</li>
                        </ul>
                    </div>
                    <div class="qr-wrap">
                        <img src="${qrUrl}" alt="Booking QR Code" class="qr-frame">
                        <span style="font-size: 10px; color: #64748b; margin-top: 4px; font-weight: 700; letter-spacing: 0.5px;">SCAN TO VERIFY PASS</span>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `);
    printWindow.document.close();
}
