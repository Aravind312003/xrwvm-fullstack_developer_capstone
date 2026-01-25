const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const app = express();
const port = 3030;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Load seed data from JSON files
const reviews_data = JSON.parse(fs.readFileSync("reviews.json", 'utf8'));
const dealerships_data = JSON.parse(fs.readFileSync("dealerships.json", 'utf8'));

// Connect to MongoDB
mongoose.connect("mongodb://mongo_db:27017/", { 'dbName': 'dealershipsDB' })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Could not connect to MongoDB", err));

const Reviews = require('./review');
const Dealerships = require('./dealership');

// Fixed initialization: Added await to prevent race conditions during startup
const initDB = async () => {
    try {
        await Reviews.deleteMany({});
        await Reviews.insertMany(reviews_data['reviews']);
        
        await Dealerships.deleteMany({});
        await Dealerships.insertMany(dealerships_data['dealerships']);
        
        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
};
initDB();

// --- Routes ---

// 1. Home Route
app.get('/', (req, res) => {
    res.send("Welcome to the Mongoose API");
});

// 2. Fetch all reviews
app.get('/fetchReviews', async (req, res) => {
    try {
        const documents = await Reviews.find().lean();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews' });
    }
});

// 3. Fetch reviews by a particular dealer ID
app.get('/fetchReviews/dealer/:id', async (req, res) => {
    try {
        const dealerId = parseInt(req.params.id);
        if (isNaN(dealerId)) {
            return res.status(400).json({ error: 'Invalid Dealer ID format' });
        }
        const documents = await Reviews.find({ dealership: dealerId }).lean();
        res.json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reviews for dealer' });
    }
});

// 4. Fetch all dealerships
app.get('/fetchDealers', async (req, res) => {
    try {
        const documents = await Dealerships.find().lean();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealerships' });
    }
});

// 5. Fetch Dealers by a particular state
app.get('/fetchDealers/:state', async (req, res) => {
    try {
        const documents = await Dealerships.find({ state: req.params.state }).lean();
        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealers by state' });
    }
});

// 6. Fetch dealer by a particular ID
app.get('/fetchDealer/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid ID format' });
        }
        const document = await Dealerships.findOne({ id: id }).lean();
        if (!document) {
            return res.status(404).json({ error: 'Dealer not found' });
        }
        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching dealer by ID' });
    }
});

// 7. Insert a new review
app.post('/insert_review', async (req, res) => {
    try {
        const data = req.body;
        // Optimization: Find only the highest ID rather than fetching all docs
        const lastReview = await Reviews.findOne().sort({ id: -1 }).lean();
        let new_id = lastReview ? lastReview.id + 1 : 1;

        const review = new Reviews({
            "id": new_id,
            "name": data.name,
            "dealership": data.dealership,
            "review": data.review,
            "purchase": data.purchase,
            "purchase_date": data.purchase_date,
            "car_make": data.car_make,
            "car_model": data.car_model,
            "car_year": data.car_year,
        });

        const savedReview = await review.save();
        res.status(201).json(savedReview);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error inserting review' });
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});