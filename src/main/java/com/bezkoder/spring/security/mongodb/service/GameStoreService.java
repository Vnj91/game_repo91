package com.bezkoder.spring.security.mongodb.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bezkoder.spring.security.mongodb.domain.store.Game;
import com.bezkoder.spring.security.mongodb.domain.store.Purchase;
import com.bezkoder.spring.security.mongodb.domain.store.Subscription;
import com.bezkoder.spring.security.mongodb.domain.store.UserProfile;
import com.bezkoder.spring.security.mongodb.repository.GameRepository;
import com.bezkoder.spring.security.mongodb.repository.PurchaseRepository;
import com.bezkoder.spring.security.mongodb.repository.SubscriptionRepository;
import com.bezkoder.spring.security.mongodb.repository.UserProfileRepository;

@Service
public class GameStoreService {
  
  private final GameRepository gameRepository;
  private final PurchaseRepository purchaseRepository;
  private final SubscriptionRepository subscriptionRepository;
  private final UserProfileRepository userProfileRepository;

  @Autowired
  public GameStoreService(GameRepository gameRepository, 
                         PurchaseRepository purchaseRepository,
                         SubscriptionRepository subscriptionRepository,
                         UserProfileRepository userProfileRepository) {
    this.gameRepository = gameRepository;
    this.purchaseRepository = purchaseRepository;
    this.subscriptionRepository = subscriptionRepository;
    this.userProfileRepository = userProfileRepository;
  }

  // Game Management
  public List<Game> getAllGames() {
    return gameRepository.findByIsActiveTrue();
  }

  public Page<Game> getGames(int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return gameRepository.findByIsActiveTrue(pageable);
  }

  public Optional<Game> getGameById(String id) {
    return gameRepository.findById(id);
  }

  public List<Game> getGamesByCategory(String category) {
    return gameRepository.findByCategoryAndIsActiveTrue(category);
  }

  public List<Game> searchGames(String query) {
    return gameRepository.findByTitleContainingIgnoreCaseAndIsActiveTrue(query);
  }

  public List<Game> getGamesByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
    return gameRepository.findByPriceBetweenAndIsActiveTrue(minPrice, maxPrice);
  }

  public Game createGame(Game game) {
    return gameRepository.save(game);
  }

  // User Profile Management
  public UserProfile createUserProfile(String username, String email, String fullName) {
    UserProfile profile = new UserProfile(username, email, fullName);
    return userProfileRepository.save(profile);
  }

  public Optional<UserProfile> getUserProfile(String username) {
    return userProfileRepository.findByUsername(username);
  }

  public UserProfile updateUserProfile(UserProfile profile) {
    profile.setUpdatedAt(LocalDateTime.now());
    return userProfileRepository.save(profile);
  }

  // Purchase Management
  public PurchaseResult purchaseGame(String username, String gameId, String paymentMethod) {
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      return PurchaseResult.error("User not found");
    }

    Optional<Game> gameOpt = gameRepository.findById(gameId);
    if (gameOpt.isEmpty()) {
      return PurchaseResult.error("Game not found");
    }

    UserProfile user = userOpt.get();
    Game game = gameOpt.get();

    // Check if user already owns the game
    Optional<Purchase> existingPurchase = purchaseRepository.findByUserIdAndGameId(user.getId(), gameId);
    if (existingPurchase.isPresent()) {
      return PurchaseResult.error("Game already purchased");
    }

    // Check if user has sufficient wallet balance
    if (user.getWalletBalance().compareTo(game.getPrice()) < 0) {
      return PurchaseResult.error("Insufficient wallet balance");
    }

    // Create purchase record
    Purchase purchase = new Purchase(user.getId(), username, gameId, game.getTitle(), game.getPrice());
    purchase.setPaymentMethod(paymentMethod);
    purchase.setStatus("COMPLETED");
    purchase = purchaseRepository.save(purchase);

    // Update user profile
    user.setWalletBalance(user.getWalletBalance().subtract(game.getPrice()));
    user.setTotalGamesPurchased(user.getTotalGamesPurchased() + 1);
    user.setTotalSpent(user.getTotalSpent().add(game.getPrice()));
    user.setUpdatedAt(LocalDateTime.now());
    userProfileRepository.save(user);

    return PurchaseResult.success(purchase);
  }

  public List<Purchase> getUserPurchases(String username) {
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      return List.of();
    }
    return purchaseRepository.findByUserIdOrderByPurchaseDateDesc(userOpt.get().getId());
  }

  // Subscription Management
  public SubscriptionResult createSubscription(String username, String subscriptionType, String paymentMethod) {
    System.out.println("Creating subscription for user: " + username + ", type: " + subscriptionType);
    
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      System.out.println("User not found: " + username);
      return SubscriptionResult.error("User not found");
    }

    UserProfile user = userOpt.get();
    System.out.println("Found user: " + user.getUsername() + ", wallet balance: " + user.getWalletBalance());

    // Check if user already has an active subscription
    Optional<Subscription> existingSubscription = subscriptionRepository.findByUserIdAndIsActiveTrue(user.getId());
    if (existingSubscription.isPresent()) {
      System.out.println("User already has active subscription");
      return SubscriptionResult.error("User already has an active subscription");
    }

    BigDecimal monthlyPrice = getSubscriptionPrice(subscriptionType);
    if (monthlyPrice == null) {
      return SubscriptionResult.error("Invalid subscription type");
    }

    // Check wallet balance
    if (user.getWalletBalance().compareTo(monthlyPrice) < 0) {
      return SubscriptionResult.error("Insufficient wallet balance");
    }

    // Create subscription
    Subscription subscription = new Subscription(user.getId(), username, subscriptionType, monthlyPrice);
    subscription.setPaymentMethod(paymentMethod);
    subscription = subscriptionRepository.save(subscription);
    System.out.println("Created subscription with ID: " + subscription.getId());

    // Update user profile
    user.setWalletBalance(user.getWalletBalance().subtract(monthlyPrice));
    user.setPremiumMember(true);
    user.setUpdatedAt(LocalDateTime.now());
    userProfileRepository.save(user);
    System.out.println("Updated user profile, new wallet balance: " + user.getWalletBalance());

    return SubscriptionResult.success(subscription);
  }

  public Optional<Subscription> getUserSubscription(String username) {
    System.out.println("Getting subscription for user: " + username);
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      System.out.println("User not found when getting subscription: " + username);
      return Optional.empty();
    }
    Optional<Subscription> subscription = subscriptionRepository.findByUserIdAndIsActiveTrue(userOpt.get().getId());
    System.out.println("Found subscription: " + (subscription.isPresent() ? subscription.get().getSubscriptionType() : "None"));
    return subscription;
  }

  public SubscriptionResult cancelSubscription(String username) {
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      return SubscriptionResult.error("User not found");
    }

    Optional<Subscription> subscriptionOpt = subscriptionRepository.findByUserIdAndIsActiveTrue(userOpt.get().getId());
    if (subscriptionOpt.isEmpty()) {
      return SubscriptionResult.error("No active subscription found");
    }

    Subscription subscription = subscriptionOpt.get();
    subscription.setActive(false);
    subscription.setStatus("CANCELLED");
    subscription.setUpdatedAt(LocalDateTime.now());
    subscriptionRepository.save(subscription);

    // Update user profile
    UserProfile user = userOpt.get();
    user.setPremiumMember(false);
    user.setUpdatedAt(LocalDateTime.now());
    userProfileRepository.save(user);

    return SubscriptionResult.success(subscription);
  }

  // Wallet Management
  public boolean addToWallet(String username, BigDecimal amount) {
    Optional<UserProfile> userOpt = userProfileRepository.findByUsername(username);
    if (userOpt.isEmpty()) {
      return false;
    }

    UserProfile user = userOpt.get();
    user.setWalletBalance(user.getWalletBalance().add(amount));
    user.setUpdatedAt(LocalDateTime.now());
    userProfileRepository.save(user);
    return true;
  }

  // Analytics
  public List<UserProfile> getTopSpenders(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return userProfileRepository.findTopSpenders(pageable);
  }

  public List<UserProfile> getTopBuyers(int limit) {
    Pageable pageable = PageRequest.of(0, limit);
    return userProfileRepository.findTopBuyers(pageable);
  }

  public long getTotalActiveSubscriptions() {
    return subscriptionRepository.countByIsActiveTrue();
  }

  public long getTotalCompletedPurchases() {
    return purchaseRepository.countByStatus("COMPLETED");
  }

  private BigDecimal getSubscriptionPrice(String subscriptionType) {
    return switch (subscriptionType.toUpperCase()) {
      case "BASIC" -> new BigDecimal("9.99");
      case "PREMIUM" -> new BigDecimal("19.99");
      case "ULTIMATE" -> new BigDecimal("29.99");
      default -> null;
    };
  }

  // Result Classes
  public static class PurchaseResult {
    private final boolean success;
    private final String message;
    private final Purchase purchase;

    private PurchaseResult(boolean success, String message, Purchase purchase) {
      this.success = success;
      this.message = message;
      this.purchase = purchase;
    }

    public static PurchaseResult success(Purchase purchase) {
      return new PurchaseResult(true, "Purchase completed successfully", purchase);
    }

    public static PurchaseResult error(String message) {
      return new PurchaseResult(false, message, null);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Purchase getPurchase() { return purchase; }
  }

  public static class SubscriptionResult {
    private final boolean success;
    private final String message;
    private final Subscription subscription;

    private SubscriptionResult(boolean success, String message, Subscription subscription) {
      this.success = success;
      this.message = message;
      this.subscription = subscription;
    }

    public static SubscriptionResult success(Subscription subscription) {
      return new SubscriptionResult(true, "Subscription created successfully", subscription);
    }

    public static SubscriptionResult error(String message) {
      return new SubscriptionResult(false, message, null);
    }

    public boolean isSuccess() { return success; }
    public String getMessage() { return message; }
    public Subscription getSubscription() { return subscription; }
  }
}
