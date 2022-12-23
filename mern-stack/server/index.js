import mongoose from "mongoose"
import cors from "cors"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import express from "express"

dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/mern-stack"
mongoose
      .connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connection established..."))
      .catch((error) => console.error("MongoDB connection failed:", error.message))

const PORT = process.env.PORT || 5050

app.get("/api", (req, res) => {
      res.status(200).json({ message: "Nyumat's take on MERN stack." })
})

app.get("/api/secret", (req, res) => {
      res.status(200).json({ message: "This is a secret message!" })
})

app.listen(PORT, () => {
      console.log(`\n\n Server started on port ${PORT}....`)
})

