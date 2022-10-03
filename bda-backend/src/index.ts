import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import connectRedis from 'connect-redis';
import cookieParser from "cookie-parser";
import session from "express-session";
import bodyParser from "body-parser";
import cors from "cors";
import prisma from "./clients/prismaClient";
import redisClient from "./clients/redisClient";
import {buildSchema} from "type-graphql";
import {graphqlAuthChecker} from "./graphql/graphqlAuthChecker";
import {ApolloServer} from "apollo-server-express";
import {MemberResolver} from "./graphql/queries/Member";
import {StudentResolver} from "./graphql/queries/Student";
import authenticationRoute from "./routes/autenticationRoute";
import fileUploadRoute from "./routes/fileUploadRoute";
import staticRoute from "./routes/staticRoute";
import {PartentheseCategoryResolver} from "./graphql/queries/PartentheseCategory";
import {Partenthese} from "./graphql/types/Partenthese";
import {PartentheseResolver} from "./graphql/queries/Partenthese";
import debugRoute from "./routes/debugRoute";

// Load environment variables from .env file
dotenv.config()

// Create a new express application instance
const APP = express();
const PORT = process.env.PORT || 3001;

// Connect to redis
const redisStore = connectRedis(session);

const corsOptions = {
    origin: ['http://localhost:5173', "http://localhost:3001"],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

// Fuck CORS, all my homies hate CORS
APP.use(cors(corsOptions));

// Configure the application to use sessions for storing the user's session
APP.use(cookieParser(process.env.SESSION_SECRET));
APP.use(session({
    store: new redisStore({
        client: redisClient
    }),
    name: 'session',
    secret: process.env.SESSION_SECRET ? process.env.SESSION_SECRET : 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        httpOnly: true,
        secure: false, // TODO: change to true when in production
    }
}));

APP.use(bodyParser.json());

// Run server
(async () => {
    const schema = await buildSchema({
        resolvers: [
            MemberResolver,
            StudentResolver,
            PartentheseCategoryResolver,
            PartentheseResolver
        ],
        validate: false,
        authChecker: graphqlAuthChecker,
        authMode: "null",
    });

    const server = new ApolloServer({
        schema,
        context: ({req}) => {
            return {
                prisma: prisma,
                // @ts-ignore
                user: req.session.user
            };
        }
    });

    await server.start();

    server.applyMiddleware({
        app: APP,
        path: "/graphql",
        cors: false,
    });

    debugRoute(APP);
    authenticationRoute(APP);
    fileUploadRoute(APP);
    staticRoute(APP);

    APP.listen(PORT, () => {
        console.log(`[*] Server is running on port ${PORT}`);
    });
})().finally(async () => {
    await prisma.$disconnect();
});