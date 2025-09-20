# GameStore - Technical Summary
## Quick Reference for Viva

---

## 🏗️ **System Architecture**

```
Frontend (HTML/CSS/JS) ←→ Spring Boot REST API ←→ MongoDB Atlas
```

### **Technology Stack**
- **Backend**: Spring Boot 3.1.0, Java 21, Maven
- **Database**: MongoDB Atlas (Cloud)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Deployment**: Local development server

---

## 📁 **Project Structure**

```
src/main/java/com/bezkoder/spring/security/mongodb/
├── controllers/store/
│   └── GameStoreController.java          # REST API endpoints
├── domain/store/
│   ├── Game.java                        # Game entity
│   ├── UserProfile.java                 # User entity
│   ├── Purchase.java                    # Purchase entity
│   └── Subscription.java                # Subscription entity
├── repository/
│   ├── GameRepository.java              # Game data access
│   ├── UserProfileRepository.java       # User data access
│   ├── PurchaseRepository.java          # Purchase data access
│   └── SubscriptionRepository.java      # Subscription data access
├── service/
│   └── GameStoreService.java            # Business logic
└── config/
    └── GameStoreDataInitializer.java    # Sample data setup

src/main/resources/static/
├── index.html                           # Main application page
├── styles.css                           # All styling and animations
└── js/
    ├── config.js                        # Configuration and state
    ├── utils.js                         # Utility functions
    ├── api.js                           # API client
    ├── ui.js                            # UI components
    ├── animations.js                    # Animation system
    ├── gamestore.js                     # Game store logic
    ├── user.js                          # User management
    ├── subscription.js                  # Subscription handling
    ├── library.js                       # User library
    ├── analytics.js                     # Analytics display
    ├── events.js                        # Event handling
    └── app.js                           # Application entry point
```

---

## 🔌 **API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/store/games` | Get all games |
| GET | `/api/store/games/search?q={query}` | Search games |
| POST | `/api/store/users` | Create user profile |
| GET | `/api/store/users/{username}` | Get user profile |
| POST | `/api/store/users/{username}/wallet/add` | Add funds to wallet |
| POST | `/api/store/purchases` | Purchase a game |
| GET | `/api/store/users/{username}/purchases` | Get user's purchases |
| POST | `/api/store/subscriptions` | Create subscription |
| GET | `/api/store/users/{username}/subscription` | Get user subscription |
| POST | `/api/store/users/{username}/subscription/cancel` | Cancel subscription |
| GET | `/api/store/analytics/top-spenders` | Get top spenders |
| GET | `/api/store/analytics/top-buyers` | Get top buyers |
| GET | `/api/store/analytics/stats` | Get store statistics |

---

## 🗄️ **Database Collections**

### **Games**
```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String", 
  "price": "BigDecimal",
  "category": "String",
  "imageUrl": "String",
  "rating": "Double",
  "reviewCount": "Integer"
}
```

### **UserProfiles**
```json
{
  "_id": "ObjectId",
  "username": "String",
  "email": "String",
  "walletBalance": "BigDecimal",
  "premiumMember": "Boolean",
  "purchaseHistory": "Array",
  "totalSpent": "BigDecimal"
}
```

### **Purchases**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "gameId": "ObjectId", 
  "price": "BigDecimal",
  "purchaseDate": "LocalDateTime",
  "status": "String"
}
```

### **Subscriptions**
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "subscriptionType": "String",
  "monthlyPrice": "BigDecimal",
  "isActive": "Boolean",
  "nextBillingDate": "LocalDateTime"
}
```

---

## 🎨 **Frontend Features**

### **Advanced Animations**
- Liquid blob morphing background
- Particle system
- Confetti effects
- Magnetic button hover
- Ripple effects
- Glassmorphism cards
- Neumorphism buttons

### **User Experience**
- Real-time form validation
- Loading states and feedback
- Responsive design
- Accessibility features (ARIA, keyboard navigation)
- Smooth transitions and micro-interactions

### **State Management**
```javascript
const state = {
  currentUser: null,
  games: [],
  userProfile: null,
  userSubscription: null,
  userPurchases: []
};
```

---

## 🔧 **Key Configuration**

### **application.properties**
```properties
server.port=8080
spring.data.mongodb.uri=mongodb+srv://username:password@cluster.mongodb.net/database
spring.data.mongodb.database=bezkoder_db
```

### **Maven Dependencies**
- spring-boot-starter-web
- spring-boot-starter-data-mongodb
- spring-boot-starter-security
- spring-boot-starter-validation

---

## 🚀 **Running the Application**

### **Prerequisites**
- Java 21+
- Maven 3.6+
- MongoDB Atlas account

### **Steps**
1. Update MongoDB connection string in `application.properties`
2. Run: `./mvnw spring-boot:run`
3. Open: `http://localhost:8080`

---

## 🎯 **Key Features Demonstrated**

1. **Game Browsing**: Search, filter, and browse game catalog
2. **User Management**: Profile creation and wallet management
3. **Purchase System**: Game purchasing with wallet validation
4. **Subscription Plans**: Multiple tier subscription system
5. **Analytics Dashboard**: Store statistics and user insights
6. **Responsive Design**: Mobile-optimized interface
7. **Advanced Animations**: Modern UI with smooth interactions

---

## 💡 **Technical Highlights**

- **Modular Architecture**: Clean separation of concerns
- **RESTful API Design**: Standard HTTP methods and status codes
- **Real-time Validation**: Client-side form validation
- **Error Handling**: Comprehensive error management
- **Performance**: Optimized loading and smooth animations
- **Accessibility**: WCAG compliant design
- **Security**: Input validation and sanitization

---

## 🎤 **Quick Demo Points**

1. **Show the landing page** - Highlight the modern design
2. **Create a user profile** - Demonstrate form validation
3. **Browse games** - Show search and filtering
4. **Purchase a game** - Demonstrate wallet system
5. **Subscribe to a plan** - Show subscription flow
6. **View analytics** - Show data visualization
7. **Mobile responsiveness** - Resize browser window

---

**Remember**: Be confident, explain your code, and demonstrate the features live! 🚀
