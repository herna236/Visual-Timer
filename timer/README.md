# Mystery Image Revealer App

## Overview
The **Mystery Image Revealer App** is a unique application that displays a mystery image behind a black overlay. Users can set a timer to gradually reveal the image. The app is designed to provide an engaging experience by limiting users to five timers longer than one minute during a trial period. After reaching this limit, users must pay to use longer timers.

## Features
- **Mystery Image Display**: An image is obscured by a black overlay.
- **User-Input Timer**: Users can set a timer, and the image will gradually be revealed as time progresses.
- **Timer Limitations**: Users are limited to five timers longer than one minute during the trial period.
- **Payment Integration**: Users can subscribe to continue using timers longer than one minute after the trial period.
- **Thorough Documentation**: All parts of the application are thoroughly documented for ease of use and understanding.

## Technology Stack
- **Frontend**:
  - **React**: For building user interfaces.
  - **Axios**: For making HTTP requests.
  - **Howler**: For audio management.
- **Backend**:
  - **Node.js**: For server-side scripting.
  - **Express**: For building the RESTful API.
  - **MongoDB**: For the database to store user information and settings.
  - **Mongoose**: For object data modeling (ODM) with MongoDB.
- **Authentication**:
  - **JWT (JSON Web Tokens)**: For user authentication.
  - **bcrypt**: For hashing passwords.
- **CORS**: For enabling cross-origin resource sharing.

## Installation
- ive added a sample.env you will have to create a secret password and make sure the ports are configured correctly
