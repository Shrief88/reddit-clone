# Breddit

A Social Media Fullstack app using PERN stack technologies based on reddit website.

## Features

- Login with google functionality.
- Login as demo user with limited access.
- Custom feed based on user activities with infinite scroll.
- Custom permissions set for necessary endpoints.
- Image Upload and image processing.
- Create, update, and vote on posts, comments, and replies.
- Save other users posts.
- Text Editor for writing posts.
- Create and follow subreddits and other users.
- Real time notification system.
- Light and dark themes.
- Awesome modern minimalist UI

## Technologies

### Backend:

- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [express-validator](https://express-validator.github.io/docs)
- [Cloudinary](https://www.npmjs.com/package/cloudinary)
- [Multer](https://github.com/expressjs/multer)
- [JWT](https://jwt.io/)
- [Passport](https://www.passportjs.org/)
- [Socket.io](https://socket.io/)
- [Prisma](https://www.prisma.io/)

### Frontend:

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind](https://tailwindcss.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Axios](https://www.axios.com/)
- [React_Hook_Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Interwave](https://interweave.dev/)
- [React-quill](https://www.npmjs.com/package/react-quill)
- [React-router](https://reactrouter.com/en/main)
- [Tanstack/react-query](https://tanstack.com/)

## Server installation

First you need to have node and postgres installed on your machine

then clone the repo and in the repo directory open terminal and type

```bash
  cd server
  npm i -g db-migrate
  npm install
```

## Server Configurations on localhost

### **_Database config_**

we will now start by creating our dev database and creating our super user.

open terminal and type the following to create the databases

```bash
  psql postgres
  CREATE USER brieddet_user WITH PASSWORD 'password123';
  CREATE DATABASE briddit;
  \c briddit
  GRANT ALL PRIVILEGES ON DATABASE briddit TO brieddet_user;
```

Now you successfully created the necessary databases to start the project.

### **_Environment Variables Config_**

in terminal type

```bash
  touch .env
```

then add the following in your .env file

```bash
PORT = 3000
NODE_ENV = development
BASE_URL = http://localhost:3000
DATABASE_URL = <database connection string>
CLIENT_URL = <your frontend url>
ACCESS_TOKEN_SECRET = xxxxxxxxx
GOOGLE_CLIENT_ID = xxxxx
GOOGLE_CLIENT_SECRET = xxxxxxxx
```

## Building

```bash
  db-migrate up
  npm run dev
```

**_Now Express Server should be running on port 3000_**

## Server installation

After finishing installing the server go back to the root of the repo to open terminal and type

```bash
  cd client
  npm install
```

## CLinet Configurations on localhost

### **_Environment Variables Config_**

in terminal type

```bash
  touch .env
```

then add the following in your .env file

```bash
VITE_API_URI = <your api url>
VITE_SOCKET_URI = <your server url>
```

## Building

```bash
  npm run dev
```

**_Now React app should be running on port 5173_**