# Coura

Coura ia an anonymous Quora tailored to college student which enables users to ask questions, post blogs about any specific topics while also receiving anonymous and genuine responses from verified members. The platform enable users to register only through their college or institute email id and also send an email to verify the user. The home page consists of feed which contains the questions and answers, the blog feed is present on the navbar and redirects to the blog page. The technical stack used for this application is MERN along with concepts like DBMS, OOPS , Design and Architecture. We see this website being used by the majority of college students in the future to get answers anonymously without having the fear to write truth on a public platform about the college, teachers etc.

Website: https://coura-8zlld8b8j-coura-team.vercel.app/

## Prerequisites
One must have nodeJs installed on the system. You can follow this tutorial to set up NodeJs on your system: https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac

Download Link: https://nodejs.org/en/download/ (Download the LTS version).

## Setting the project on local System
Clone the git repository from the following link: https://github.com/College-Quora/Coura and run command "npm install", move to coura_frontend and coura_backend directory to run "npm install"

Also add an .env file in the root folder which will contain : <br/>
PORT = 80  <br/> 
EMAIL_HOST = smtp.gmail.com <br/>
EMAIL_SERVICE = Gmail <br/>
EMAIL_PORT = 465 <br/>
EMAIL_SECURE = true <br/>
EMAIL_USER = 'EmailId'  <br/>
EMAIL_PASS = 'Password' <br/>
BASE_URL = http://localhost:3000 <br/>
JWT_SECRET = 'JWT Secret Key' <br/>
MONGODB_CONNECTION_URL = 'YOUR CONNECTION STRING URI'  (To generate the uri, refer the mongodb atlas docs : https://www.mongodb.com/docs/guides/cloud/connectionstring/ ) 

### How to run program:

- Clone the git repository in your system
- Navigate to the Coura folder
- Run the following commands:

```groovy
npm install
npm start // this will start the backend
```

- In a new terminal tab go to the `coura_frontend` folder inside the `Coura` folder and run the following commands:

```groovy
npm install 
npm start // this will start the front end
```

- App will start on [http://localhost:3000/](http://localhost:3000/).

## Screenshots of some webpages
### Home Page
![](https://github.com/College-Quora/Coura/blob/main/snippets/Screenshot%202023-03-25%20015107.png)

### Login Page
![alt text](https://github.com/College-Quora/Coura/blob/main/snippets/screencapture-coura-8zlld8b8j-coura-team-vercel-app-login-2023-03-25-01_37_25.png)

<!-- ## Answers Page
![alt text](https://github.com/College-Quora/Coura/blob/main/snippets/Screenshot%202023-03-25%20022754.png) -->

### Create Blog Window
![alt text](https://github.com/College-Quora/Coura/blob/main/snippets/Screenshot%202023-03-25%20021130.png)


