<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>
<h1 align="center">🎬 Movie Bookmarking & Favorites Web App  </h1>
<a><img src='https://i.imgur.com/LyHic3i.gif'/></a>

![Project Preview](https://i.ibb.co/Z6R03P7P/f066912f-6d91-4da4-bce3-c5f0edb888ba.png)  

## 🚀 Overview  
The **Movie Bookmarking & Favorites Web App** allows users to browse movies, bookmark them for later, mark them as favorites, and manage their profiles. Authentication is required for bookmarking, favoriting, and viewing detailed movie information. The app ensures cross-device syncing and persistence of user data.  

---

## ✨ Features  

### 🎥 Movie Browsing (Public)  
✅ **All users (authenticated or not) can see a list of movies.**  
✅ **Unauthenticated users cannot view detailed movie information (description, trailer, etc.).**  
✅ **All users can search for movies.**  

### 🔑 User Authentication  
✅ **Sign-up/Login using Firebase.**  
✅ **Authenticated users can:**  
   - Mark movies as favorites.  
   - Remove movies from bookmarks/favorites.  
   - Access and edit their profile (e.g., update name).  
   - Log out.  

### 📌 Dashboard  
✅ **Authenticated users get a personalized dashboard where they can:**  
   - See a list of favorite movies.  
   - View real-time updates when movies are added/removed from favorites.  

### 🔄 Cross-Device Syncing  
✅ **When a user logs in on another device, their bookmarks and favorites list is preserved.**  

### 🎞️ Movie Details (Authenticated Users Only)  
✅ **Only signed-in users can view full movie details (e.g., description, trailer).**  
✅ **Authenticated users should be able to watch trailers if available.**  

### 👤 Profile & Settings  
✅ **Users can view and edit their profile (e.g., update their name).**  
✅ **Profile changes should persist.**  

### 🎨 General UI/UX  
✅ **Ensure a clean, intuitive, and responsive design.**  
✅ **Provide error handling for unauthorized users trying to access restricted features.**  

---

## 🛠 Tech Stack  
- **Frontend Framework** – Next.js  
- **Language** – TypeScript  
- **Authentication** – Firebase
- **Movie Data API** – TMDB API  
- **State Management** – React hooks (`useState`, `useEffect`)  
- **UI Styling** – Tailwind CSS  

---
![Project Preview](https://i.ibb.co/9mMnBjHg/c406ca05-e138-4dde-96e6-57051b7466ec.png)  

## 🚀 Installation & Setup  
```sh
# Clone the repository
git clone https://github.com/MuritalaAhmed05/HNGx-stage8-movie-app

# Navigate to the project directory
cd movie-app-1

# Install dependencies
npm install

# Start the development server
npm run dev
