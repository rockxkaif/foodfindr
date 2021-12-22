if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const fs = require('fs');
const restaurantFile = fs.readFileSync('/Users/Kaif/OneDrive/Desktop/foodfindr/seeds/file1.json', 'utf-8');
const restaurants = JSON.parse(restaurantFile);
const mongoose = require('mongoose');
/* const cities = require('./cities'); */
/* const { places, descriptors } = require('./seedHelpers'); */
const Restaurant = require('../models/restaurant');
const dbUrl = process.env.DB_URL;

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

/* const sample = array => array[Math.floor(Math.random() * array.length)]; */


const seedDB = async () => {
    await Restaurant.deleteMany({});
    for (let i = 0; i < 35; i++) 
    {
        for(let j = 0; j < 18; j++) 
        {
            if(`${restaurants[i].restaurants[j].restaurant.featured_image}` != '' && restaurants[i].restaurants[j].restaurant.location.longitude != '0.0000000000')
            {
                const rest = new Restaurant({
                    //YOUR USER ID
                    author: '61c333864e9de938147db71f',
                    city : `${restaurants[i].restaurants[j].restaurant.location.city}`,
                    address : `${restaurants[i].restaurants[j].restaurant.location.address}`,
                    title: `${restaurants[i].restaurants[j].restaurant.name}`,
                    description: `${restaurants[i].restaurants[j].restaurant.cuisines}`,
                    price: `${restaurants[i].restaurants[j].restaurant.average_cost_for_two}`,
                    image: `${restaurants[i].restaurants[j].restaurant.featured_image}`,
                    geometry: {
                        type: "Point",
                        coordinates: [
                            restaurants[i].restaurants[j].restaurant.location.longitude,
                            restaurants[i].restaurants[j].restaurant.location.latitude,
                        ]}
                    })
                    await rest.save();
            }
        }
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})
