# Titanlory Server

## Overview
This is the backend server for the project, built with Node.js, Express, and MongoDB. The backend provides APIs to manage player data, leaderboard rankings, and supports additional functionalities like caching with Redis.

## Table of Contents

- [Features](#features)
- [Tech Stack](#teck-stack)
- [Installation](#installation)
- [Endpoints](#endpoints)

## Features
- RESTful API with CRUD operations
- Leaderboard ranking and prize distribution logic
- Caching with Redis for performance optimization

## Tech Stack
- **Node.js** and **Express**: For server and API handling
- **MongoDB** with **Mongoose**: For data storage and ORM
- **Redis**: For caching
- **Node Cron**: For scheduled distribution prizes weekly

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/miuvenk/titanlory-server
   cd titanlory-server

2. Install dependencies:
   ```bash
   npm install

3. Configure environment variables by creating a .env file in the root directory:
   ```bash
   PORT=9000
   MONGODB_URI=your_mongodb_uri
   REDIS_HOST=your_redis_host
   REDIS_PORT=your_redis_port
   REDIS_PASSWORD=your_redis_password

4. Run the server:
   ```bash
   npm start

## Endpoints
 **Leaderboard Routes** /leaderboard
 - POST /
    - **Description:** Description: Fetch the current leaderboard data. If a player is specified by name, it returns the top 100 players along with the player if they are present but not in the top 100, as well as the 3 players above and 2 players below the specified player in ranking.
    - **Request Body Example:** 
      If nothing is sent in the body, it will only return the first 100 users. 
      ```bash
      { 
        "playerName": "Player70" 
      } 

  - POST /distributePrizePool
    - **Description:** Manually trigger the prize distribution for top 100 players (Useful for testing the cron functionality. Use for testing only.).
    - **Request Body Example:** No need body.
 
**Player Routes** /players
  - POST /add
    - **Description:** Add a new player to the leaderboard (for testing real-time changes. Use for testing only).
    - **Request Body Example:** 
    ```bash
     {
      "name": "TEST",
      "country": "Turkey",
      "weeklyEarnings": 10
     }
  
 - GET /:id
    - **Description:** Retrieve information about a specific player by their unique ID.
    - **Example:** GET /player/12345 fetches player data for the player with ID 12345. Need to be mongoDB _id.

  - PUT /update
     - **Description:** Update a player’s money, enabling real-time testing of leaderboard rankings. (Use for testing only.)
     - **Request Body Example:** 
     ```bash
     {
      "playerName": "Player70",
      "money": 200
     }

