package com.sltourism.backend.controller;

public class BookingRequest {
    private Long userId;
    private Long destinationId;
    private Integer quantity;
    private String hotelName;
    private String paymentMethod;
    private String travelDate;
    private String pickupLocation;
    private String vehicleType;
    private String guideType;
    private String mealPlan;
    private Double totalPrice;
    private Double ticketCost;
    private Double transportCost;
    private Double guideCost;
    private Double mealCost;
    private Double hotelCost;
    private String paymentStatus;
    private String transactionId;

    // Getters and Setters
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public Long getDestinationId() { return destinationId; }
    public void setDestinationId(Long destinationId) { this.destinationId = destinationId; }
    
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getTravelDate() { return travelDate; }
    public void setTravelDate(String travelDate) { this.travelDate = travelDate; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getVehicleType() { return vehicleType; }
    public void setVehicleType(String vehicleType) { this.vehicleType = vehicleType; }

    public String getGuideType() { return guideType; }
    public void setGuideType(String guideType) { this.guideType = guideType; }

    public String getMealPlan() { return mealPlan; }
    public void setMealPlan(String mealPlan) { this.mealPlan = mealPlan; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public Double getTicketCost() { return ticketCost; }
    public void setTicketCost(Double ticketCost) { this.ticketCost = ticketCost; }

    public Double getTransportCost() { return transportCost; }
    public void setTransportCost(Double transportCost) { this.transportCost = transportCost; }

    public Double getGuideCost() { return guideCost; }
    public void setGuideCost(Double guideCost) { this.guideCost = guideCost; }

    public Double getMealCost() { return mealCost; }
    public void setMealCost(Double mealCost) { this.mealCost = mealCost; }

    public Double getHotelCost() { return hotelCost; }
    public void setHotelCost(Double hotelCost) { this.hotelCost = hotelCost; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
}
