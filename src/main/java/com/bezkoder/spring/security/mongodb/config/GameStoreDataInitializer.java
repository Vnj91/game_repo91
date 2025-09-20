package com.bezkoder.spring.security.mongodb.config;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.bezkoder.spring.security.mongodb.domain.store.Game;
import com.bezkoder.spring.security.mongodb.repository.GameRepository;

@Component
public class GameStoreDataInitializer implements CommandLineRunner {

  @Autowired
  private GameRepository gameRepository;

  @Override
  public void run(String... args) throws Exception {
    // Clear existing games and reinitialize with new images
    gameRepository.deleteAll();
    initializeSampleGames();
  }

  private void initializeSampleGames() {
    List<Game> sampleGames = Arrays.asList(
      new Game("Cyberpunk 2077", "An open-world, action-adventure story set in Night City", "CD Projekt RED", new BigDecimal("59.99"), "RPG"),
      new Game("The Witcher 3: Wild Hunt", "A story-driven open world RPG", "CD Projekt RED", new BigDecimal("29.99"), "RPG"),
      new Game("Grand Theft Auto V", "Experience Los Santos and Blaine County", "Rockstar Games", new BigDecimal("39.99"), "Action"),
      new Game("Minecraft", "Build, explore, and survive in infinite worlds", "Mojang Studios", new BigDecimal("26.95"), "Sandbox"),
      new Game("Among Us", "A game of teamwork and betrayal", "InnerSloth", new BigDecimal("4.99"), "Multiplayer"),
      new Game("Fall Guys", "A massively multiplayer party royale game", "Mediatonic", new BigDecimal("19.99"), "Party"),
      new Game("Valorant", "A 5v5 character-based tactical FPS", "Riot Games", new BigDecimal("0.00"), "FPS"),
      new Game("League of Legends", "A fast-paced, competitive online game", "Riot Games", new BigDecimal("0.00"), "MOBA"),
      new Game("Counter-Strike 2", "The world's premier competitive FPS", "Valve", new BigDecimal("0.00"), "FPS"),
      new Game("Baldur's Gate 3", "A story-rich, party-based RPG", "Larian Studios", new BigDecimal("59.99"), "RPG"),
      new Game("Elden Ring", "A new fantasy action RPG", "FromSoftware", new BigDecimal("59.99"), "RPG"),
      new Game("Hogwarts Legacy", "An immersive, open-world action RPG", "Avalanche Software", new BigDecimal("59.99"), "RPG"),
      new Game("Call of Duty: Modern Warfare III", "The ultimate multiplayer experience", "Infinity Ward", new BigDecimal("69.99"), "FPS"),
      new Game("FIFA 24", "The world's game", "EA Sports", new BigDecimal("69.99"), "Sports"),
      new Game("NBA 2K24", "The most realistic basketball simulation", "Visual Concepts", new BigDecimal("69.99"), "Sports"),
      new Game("Assassin's Creed Mirage", "A return to the roots of the franchise", "Ubisoft", new BigDecimal("49.99"), "Action"),
      new Game("Spider-Man 2", "Swing through New York as Spider-Man", "Insomniac Games", new BigDecimal("69.99"), "Action"),
      new Game("God of War Ragnarök", "Embark on an epic journey", "Santa Monica Studio", new BigDecimal("69.99"), "Action"),
      new Game("Horizon Forbidden West", "Explore a beautiful post-apocalyptic world", "Guerrilla Games", new BigDecimal("59.99"), "Action"),
      new Game("The Last of Us Part II", "A story of revenge and redemption", "Naughty Dog", new BigDecimal("59.99"), "Action")
    );

    // Add additional properties to games with better images
    String[] gameImages = {
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2rpf.jpg", // Cyberpunk 2077
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg", // The Witcher 3
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7j.jpg", // GTA V
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r6y.jpg", // Minecraft
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4y.jpg", // Among Us
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l4z.jpg", // Fall Guys
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l50.jpg", // Valorant
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co1r7k.jpg", // League of Legends
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l51.jpg", // Counter-Strike 2
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l52.jpg", // Baldur's Gate 3
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l53.jpg", // Elden Ring
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l54.jpg", // Hogwarts Legacy
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l55.jpg", // Call of Duty
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l56.jpg", // FIFA 24
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l57.jpg", // NBA 2K24
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l58.jpg", // Assassin's Creed
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l59.jpg", // Spider-Man 2
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l5a.jpg", // God of War
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l5b.jpg", // Horizon
      "https://images.igdb.com/igdb/image/upload/t_cover_big/co2l5c.jpg"  // The Last of Us
    };

    for (int i = 0; i < sampleGames.size(); i++) {
      Game game = sampleGames.get(i);
      game.setPublisher(game.getDeveloper());
      game.setImageUrl(i < gameImages.length ? gameImages[i] : "https://via.placeholder.com/300x400/2a3142/ffffff?text=" + game.getTitle().replace(" ", "+"));
      game.setRating(4.0 + (i % 5) * 0.2); // Random rating between 4.0-4.8
      game.setReviewCount(100 + (i * 50)); // Varying review counts
      game.setTags(Arrays.asList(game.getCategory().toLowerCase(), "popular", "trending"));
    }

    gameRepository.saveAll(sampleGames);
    System.out.println("Initialized " + sampleGames.size() + " sample games");
  }
}
