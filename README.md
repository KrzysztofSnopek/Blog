# ShareYourPicture

## Table of content
* [General info](#general-info)
* [Setup](#setup)
* [Technologies](#technologies)

## General info

A React based gallery app that allows user to browse through the images, upload and name his own pictures. The app will also let you like the uploaded images on the main page. Log in function was introduced with the help of firebase. Firebase storage and Firestore have been used to upload and get all the pictures and information from the database. The project is styled with Tailwindcss and Material UI.

You can check the latest deployed version here:
https://show-your-picture.web.app/

## Setup
Navigate to the folder you want the repository, clone the repository with a command:

```
git clone https://github.com/KrzysztofSnopek/ShareYourPic
```

To run this project, install it locally using npm:

```

$ cd ShareYourPic/blog-exercise
$ npm install
$ npm start

```

## Technologies

Project is created with:
* React v18.2.0
* Typescript v4.9.5
* Firebase v9.17.1
* Universal-cookie v4.0.4
* React Icons v4.6.0
* Uuid v9.0.0
* react-router-dom v6.8.1
* Mobx-react v7.6.0
* Tailwindcss v3.3.1

Project allows the user to:
* Log in, log out with a google account
* View, add, name and like images
* Check the most liked photos
