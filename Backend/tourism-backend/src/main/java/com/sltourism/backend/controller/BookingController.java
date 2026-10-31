package com.sltourism.backend.controller;

import com.sltourism.backend.model.Booking;
import com.sltourism.backend.model.Destination;
import com.sltourism.backend.model.User;
import com.sltourism.backend.repository.BookingRepository;
import com.sltourism.backend.repository.DestinationRepository;
import com.sltourism.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private DestinationRepository destinationRepository;

    // 1. CREATE: Create a new booking
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        // Server-side validation
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Quantity must be at least 1!");
        }
        if (request.getTravelDate() == null || request.getTravelDate().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Travel date is required!");
        }
        
        Optional<User> user = userRepository.findById(request.getUserId());
        Optional<Destination> destination = destinationRepository.findById(request.getDestinationId());
        
        if (user.isEmpty() || destination.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User or Destination not found!");
        }

        Booking booking = new Booking();
        booking.setUser(user.get());
        booking.setDestination(destination.get());
        booking.setDestinationName(destination.get().getName());
        booking.setQuantity(request.getQuantity());
        booking.setBookingDate(LocalDate.now());
        booking.setHotelName(request.getHotelName() != null ? request.getHotelName() : "None");
        booking.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "Card");
        booking.setTravelDate(request.getTravelDate());
        booking.setPickupLocation(request.getPickupLocation() != null ? request.getPickupLocation() : "Colombo Hotel / Airport");
        booking.setVehicleType(request.getVehicleType() != null ? request.getVehicleType() : "None");
        booking.setGuideType(request.getGuideType() != null ? request.getGuideType() : "None");
        booking.setMealPlan(request.getMealPlan() != null ? request.getMealPlan() : "None");

        // Breakdown Costs
        double ticketCost = request.getTicketCost() != null ? request.getTicketCost() : (request.getQuantity() * destination.get().getTicketPrice());
        double transportCost = request.getTransportCost() != null ? request.getTransportCost() : 0.0;
        double guideCost = request.getGuideCost() != null ? request.getGuideCost() : 0.0;
        double mealCost = request.getMealCost() != null ? request.getMealCost() : 0.0;
        double hotelCost = request.getHotelCost() != null ? request.getHotelCost() : 0.0;

        booking.setTicketCost(ticketCost);
        booking.setTransportCost(transportCost);
        booking.setGuideCost(guideCost);
        booking.setMealCost(mealCost);
        booking.setHotelCost(hotelCost);

        double total = (request.getTotalPrice() != null && request.getTotalPrice() > 0)
                ? request.getTotalPrice()
                : (ticketCost + transportCost + guideCost + mealCost + hotelCost);
        booking.setTotalPrice(total);

        booking.setPaymentStatus(request.getPaymentStatus() != null ? request.getPaymentStatus() : "PAID");
        booking.setTransactionId(request.getTransactionId() != null ? request.getTransactionId() : ("TXN-LS-" + System.currentTimeMillis()));
        
        Booking saved = bookingRepository.save(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 2. READ: Get all bookings for a user
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserBookings(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingRepository.findByUserId(userId));
    }

    // 2. READ: Get single booking details by ID (for Viewing Details / E-Receipt)
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        Optional<Booking> booking = bookingRepository.findById(id);
        if (booking.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found!");
        }
        return ResponseEntity.ok(booking.get());
    }

    // 3. UPDATE: Edit / Reschedule an existing booking
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id, @RequestBody BookingRequest request) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking with ID " + id + " not found!");
        }

        // Server-side validation
        if (request.getQuantity() != null && request.getQuantity() <= 0) {
            return ResponseEntity.badRequest().body("Ticket quantity must be at least 1!");
        }

        Booking booking = optionalBooking.get();
        if (booking.getDestinationName() == null && booking.getDestination() != null) {
            booking.setDestinationName(booking.getDestination().getName());
        }

        if (request.getTravelDate() != null && !request.getTravelDate().trim().isEmpty()) {
            booking.setTravelDate(request.getTravelDate());
        }
        if (request.getHotelName() != null) {
            booking.setHotelName(request.getHotelName());
        }
        if (request.getPaymentMethod() != null) {
            booking.setPaymentMethod(request.getPaymentMethod());
        }
        if (request.getPickupLocation() != null) {
            booking.setPickupLocation(request.getPickupLocation());
        }
        if (request.getVehicleType() != null) {
            booking.setVehicleType(request.getVehicleType());
        }
        if (request.getGuideType() != null) {
            booking.setGuideType(request.getGuideType());
        }
        if (request.getMealPlan() != null) {
            booking.setMealPlan(request.getMealPlan());
        }
        if (request.getQuantity() != null) {
            booking.setQuantity(request.getQuantity());
        }
        if (request.getTotalPrice() != null && request.getTotalPrice() > 0) {
            booking.setTotalPrice(request.getTotalPrice());
        }
        if (request.getPaymentStatus() != null) {
            booking.setPaymentStatus(request.getPaymentStatus());
        }
        if (request.getTransactionId() != null) {
            booking.setTransactionId(request.getTransactionId());
        }

        Booking updated = bookingRepository.save(booking);
        return ResponseEntity.ok(updated);
    }

    // 4. DELETE: Cancel / Delete a booking safely
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        Optional<Booking> optionalBooking = bookingRepository.findById(id);
        if (optionalBooking.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found!");
        }

        bookingRepository.deleteById(id);
        return ResponseEntity.ok("Booking #" + id + " has been successfully canceled.");
    }
}
