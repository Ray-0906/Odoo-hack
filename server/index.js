import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import  { conectDB } from './config/db.js';
import authRoutes from './Routes/authRoutes.js';
import queRoutes from './Routes/queRoutes.js';
import ansRoutes from './Routes/ansRoute.js';
import {  seedTags } from './addtag.js';

// Middleware
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // ✅ include PATCH
}));;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat', // Replace with real secret or env var
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,           // ✅ ensures it's HTTPS-only
    sameSite: "none"        // ✅ allows cross-origin (Vercel → Render)
  }
}));

app.use(passport.initialize());
app.use(passport.session());

//paths 
app.use('/auth', authRoutes);
app.use('/ques', queRoutes);
app.use('/ans', ansRoutes);


app.listen(3000, () => {
    conectDB();
    // seedTags();
    console.log('Server is running on port 3000');
});