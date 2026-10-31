package com.sltourism.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // කවුද බුක් කළේ කියලා
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // කොහෙටද බුක් කළේ කියලා
    @ManyToOne
    @JoinColumn(name = "destination_id", nullable = false)
    private Destination destination;

    @Column(name = "destination_name")
    private String destinationName;

    @Column(name = "booking_date")
    private LocalDate bookingDate;

    private Integer quantity;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "hotel_name")
    private String hotelName;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "travel_date")
    private String travelDate;

    @Column(name = "pickup_location")
    private String pickupLocation;

    @Column(name = "vehicle_type")
    private String vehicleType;

    @Column(name = "guide_type")
    private String guideType;

    @Column(name = "meal_plan")
    private String mealPlan;

    @Column(name = "ticket_cost")
    private Double ticketCost;

    @Column(name = "transport_cost")
    private Double transportCost;

    @Column(name = "guide_cost")
    private Double guideCost;

    @Column(name = "meal_cost")
    private Double mealCost;

    @Column(name = "hotel_cost")
    private Double hotelCost;

    @Column(name = "payment_status")
    private String paymentStatus;

    @Column(name = "transaction_id")
    private String transactionId;

    // Getters and Setters
    
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Destination getDestination() {
        return destination;
    }

    public void setDestination(Destination destination) {
        this.destination = destination;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getGuideType() {
        return guideType;
    }

    public void setGuideType(String guideType) {
        this.guideType = guideType;
    }

    public String getMealPlan() {
        return mealPlan;
    }

    public void setMealPlan(String mealPlan) {
        this.mealPlan = mealPlan;
    }

    public Double getTicketCost() {
        return ticketCost;
    }

    public void setTicketCost(Double ticketCost) {
        this.ticketCost = ticketCost;
    }

    public Double getTransportCost() {
        return transportCost;
    }

    public void setTransportCost(Double transportCost) {
        this.transportCost = transportCost;
    }

    public Double getGuideCost() {
        return guideCost;
    }

    public void setGuideCost(Double guideCost) {
        this.guideCost = guideCost;
    }

    public Double getMealCost() {
        return mealCost;
    }

    public void setMealCost(Double mealCost) {
        this.mealCost = mealCost;
    }

    public Double getHotelCost() {
        return hotelCost;
    }

    public void setHotelCost(Double hotelCost) {
        this.hotelCost = hotelCost;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getDestinationName() {
        return destinationName;
    }

    public void setDestinationName(String destinationName) {
        this.destinationName = destinationName;
    }
}
