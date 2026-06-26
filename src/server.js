import express from "express";
import dotenv from "dotenv";
import studentRoutes from "./routes/studentRoutes.js";
import {MongoClient} from "mongodb";
import {init} from "./repository/studentRepository.js";

// const envResult = dotenv.config();
//
// console.log("envResult:", envResult);
// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("DB_NAME:", process.env.DB_NAME);
// console.log("PORT:", process.env.PORT);


dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json());

app.use(studentRoutes)

app.use((req, res) => {
    res.status(404).type('text/plain; charset=utf-8').send('Not Found');
})

async function startServer() {
    try{
        await client.connect();
        const database = client.db(process.env.DB_NAME)
        init(database);
        app.listen(port, () => {
            console.log(`Listening on port ${port}. Press Ctrl+C to stop.`);
        })
    } catch (error) {
        console.log('Failed connection to MongoDB', error)
    }
}

startServer();

