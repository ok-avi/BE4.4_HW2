const { initializeDB } = require("./db/db.connect.js");
const { Hotel } = require("./models/hotels.models.js");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

const app = express();
initializeDB();
app.use(express.json());
app.use(cors(corsOptions));

async function getAllHotels() {
    try {
        const hotel = await Hotel.find();
        // console.log("hotel", hotel);
        return hotel;
    } catch (error) {
        throw error;
    }
}
app.get("/hotels", async (req, res) => {
    try {
        const hotel = await getAllHotels();
        res.status(200).json(hotel);
    } catch (error) {
        res.status(500).json({ error: "Error while fetching hotel" });
    }
});

app.get("/", (req, res) => {
    res.send("hello");
});

async function createHotel(data) {
    try {
        const hotel = new Hotel(data);
        const savedHotel = await hotel.save();
        return hotel;
    } catch (error) {
        throw error;
    }
}

app.post("/hotels", async (req, res) => {
    try {
        const hotel = await createHotel(req.body);
        res.status(201).json({ message: "Hotel created", hotel: hotel });
    } catch (error) {
        res.status(500).json({ error: "Error while creating hotel" });
    }
});

async function deleteHotelById(id) {
    try {
        const hotel = await Hotel.findByIdAndDelete(id);
        return hotel;
    } catch (error) {
        throw error;
    }
}

app.delete("/hotels/:hotelId", async (req, res) => {
    try {
        const deletedHotel = await deleteHotelById(req.params.hotelId);
        res.status(200).json({ message: "Hotel deleted", hotel: deletedHotel });
    } catch (error) {
        res.status(500).json({ error: "Error while deleting hotel" });
    }
});

async function updateHotelById(id, data) {
    try {
        const hotel = await Hotel.findByIdAndUpdate(id, data);
        return hotel;
    } catch (error) {
        throw error;
    }
}

app.post("/hotels/:hotelId", async (req, res) => {
    try {
        const updatedHotel = await updateHotelById(
            req.params.hotelId,
            req.body
        );
        if (updatedHotel) {
            res.status(200).json({
                message: "hotel updated",
                hotel: updatedHotel,
            });
        } else {
            res.status(404).json({ message: "Hotel not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error while updating the hotel" });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server running at port", PORT);
});
