# snouters-Hotel-Booking-Calendar-Management

## Prerequisites
- [Docker](https://www.docker.com/) installed on your machine.
- Redis installed on docker
```bash
   docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

## Getting Started
 Clone the repository and run application:
```bash
   git clone https://github.com/Amitpotdukhe/snouters-Hotel-Booking-Calendar-Management.git
   cd into the folder
   docker build -t snouters-hotel-management:latest .
   docker run -p 3000:3000 snouters-hotel-management:latest
