# Destination Next - A travel planning app

A web application designed in MERN stack that helps users plan their trip and keep track of their destinations using maps.

Check it out at: [Destination Next](https://destination-next.herokuapp.com/)

Built with [React.js](https://reactjs.org/), [Node.js](https://nodejs.org/en/), [Express](https://expressjs.com/), and [MongoDb](https://www.mongodb.com/). Maps integated via [MapBox API](https://www.mapbox.com/). Code deployed and hosted using [Heroku](https://www.heroku.com/).

## Table of Contents

- [Destination Next - A travel planning app](#trip-log---a-travel-planning-app)
  - [Table of Contents](#table-of-contents)
  - [Tech stacks used](#tech-stacks-used)
  - [Folder Structure](#folder-structure)
  - [Suggestions](#suggestions)

## Tech stacks used
1. [`React.js`](https://reactjs.org/) : The frontend web views of this application were made using React.
2. [`MUI`](https://mui.com/) : Most of the components used in the front-end were imported from here.
3. [`React-map-GL`](https://visgl.github.io/react-map-gl/) : Used as a wrapper around Mapbox API for forward geocoding i.e., search locations to view on the map and get its longitude, latitude, and more
4. [`Node.js`](https://visgl.github.io/react-map-gl/) : Used to create the backend for this application.
5. [`Passport.js`](https://www.passportjs.org/) : Used to authenticate users, and maintain user sessions.
6. [`Axios`](https://www.npmjs.com/package/axios) : Used to send and recieve api calls between the backend and the frontend.
7. [`Express`](https://expressjs.com/) : Used to build RESTful API's with Node.js
8. [`MongoDb`](https://www.mongodb.com/) : Database made using MongoDB. Mongoose employed to manage data entities and relationships.

## Folder Structure

After creating an app, it should look something like:

```md
.
├── README.md
├── Backend
│ ├── models
| | ├── destination.js
| | └── user.js
| ├── passport.js
| ├── routes
| | └── destination-routes.js
| ├── passport.js
| ├── server.js
| ├── package-lock.json
| └── package.json
├── public
│ └── [...]
├── src
| ├── apis
| | ├── authApis.js
| | └── dataApis.js
| ├── assests
│ | └── [...]
| ├── components
| | ├── destinations
| | | └── Destination.js
| | ├── home
| | | ├── maps
| | | | ├── MapBox.js
| | | | └── Mapbox.css
| | | └── Home.js
| | ├── login
| | | └── Login.js
| | └── signup
| | | └── Signup.js
| ├── utils
│ | └── PrivateRoute.js
| ├── App.css
| ├── index.css
| ├── index.js
| └── routing.js
├── .gitignore
├── .npmrc
├── config-overrides.js
├── package-lock.json
└── package.json
```

## Suggestions
If you feel like this app could be improved in any way, or have any feedback for this application, please feel free to contact me at:
akash925@gmail.com

