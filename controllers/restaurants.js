const Restaurant = require('../models/restaurant');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const restaurants = await Restaurant.find({});
    res.render('restaurants/index', { restaurants })
}

module.exports.searchRestaurant = async (req, res) => {
  
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)    
    let query = Restaurant.find(JSON.parse(queryString))

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('city')
    }

    //3) Field Limiting
    // Select pattern  .select("firstParam secondParam"), it will only show the selected field, add minus sign for excluding (include everything except the given params)
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    // page=2&limit=10, 1-10 page 1, 11-20 page 2, 21-30 page 3
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    //EXECUTE QUERY
    const restaurants = await query
    res.render('restaurants/search', { restaurants})
  /*   res.status(200).json({
      status: 'success',
      results: restaurants.length,
      data: {
        restaurants
      }
    }); */
  }


module.exports.renderNewForm = (req, res) => {
    res.render('restaurants/new');
}

module.exports.createRestaurant = async (req, res, next) => {
  const restaurant = new Restaurant(req.body.restaurant);
    const geoData = await geocoder.forwardGeocode({
        query: req.body.restaurant.address,
        limit: 1
    }).send()
    restaurant.geometry = geoData.body.features[0].geometry;
    restaurant.author = req.user._id;
    await restaurant.save();
    req.flash('success', 'Successfully made a new restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.showRestaurant = async (req, res,) => {
    const restaurant = await Restaurant.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/show', { restaurant });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id)
    if (!restaurant) {
        req.flash('error', 'Cannot find that restaurant!');
        return res.redirect('/restaurants');
    }
    res.render('restaurants/edit', { restaurant });
}

module.exports.updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, { ...req.body.restaurant });
    req.flash('success', 'Successfully updated restaurant!');
    res.redirect(`/restaurants/${restaurant._id}`)
}

module.exports.deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    await Restaurant.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted restaurant')
    res.redirect('/restaurants');
}