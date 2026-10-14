# TVT25KMO Group 15 Web Programming Application Project 

## Description

This is a project for the Web Applications Development course at Oulu University of Applied Sciences (Oamk). 
The application is containerized using Docker, with separate containers for the backend, frontend, and database.

The web application allows users to:
- Browse and search for different movies.
- Rate movies and read feedback from other users.
- View average ratings for each movie.
- Create and join user groups with dedicated group movie lists.

## Tech Stack

- **Frontend:** React, Vite
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

# REST API Documentation

The REST API documentation is available as a Postman collection, and can be viewed using Postman: 

1. Open the "Collections" section in Postman

2. Click on the "Import" option 

3. Import a file called **Movie_Database_API.json** from the *Project Documentation* folder in the root of the project.

You can read a short overview and explanations for each request in Postman.

## Installation & Running

Make sure you have [Docker](https://www.docker.com/) and Docker Compose installed on your machine.

1. Clone the repository:
    ```bash
    git clone https://github.com/niklassaari/tvt25kmo-webohjsovellusprojekti-ryhma15.git
    cd tvt25kmo-webohjsovellusprojekti-ryhma15

2. Configure the environment variables in the *backend* and *frontend* folders
    Make sure that you've acquired the API key and token from the [The Movie Database](https://www.themoviedb.org/) website before building the containers. (Refer to to the .env.example files for further instructions)

3. Build and start containers using Docker Compose
    docker compose up --build

4. Open your browser and navigate to:
    Frontend: http://localhost:5173 (or check your container port mapping)

## Usage

1. Go to the [live application](http://128.214.255.200:5173/) or your local instance.

2. Register a new profile on the Register page to unlock full features.

3. Once logged in, you can write reviews, create new groups, or join existing ones to view group-specific movie lists.

## Planning

### User interface was planned using Moqups website

Click here for the UI plan: [Moqups website plan](https://app.moqups.com/Id4FP0qgzwahcGSzwfVSEkLi9BZbu0nu/view/page/ad64222d5)

## Afterword

Special thanks to all the members of the project:

- Niklas Saari
- Patrik Saari
- Timi Lehto
- Tuomo koskinen
