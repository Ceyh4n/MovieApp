//create route for the movie page

const express = require('express')
const router = express.Router();
const MovieModel = require('../models/Movie')

//getting movies from db to movie page (/api/movies)
router.get('/', (req, res) => {
  MovieModel.find() // => lists all db items
  .then((data)=>{res.json(data)})
  .catch((err)=>{res.json(err)})
})

//getting movies with their directors
router.get('/directorlist', (req, res) => {
  MovieModel.aggregate(
    [
      {
        $lookup:
        {
          from:'directors',
          localField:'director_id',
          foreignField:'_id',
          as:'director'
        }
      }
    ]
  ) // => lists all db items
  .then((data)=>{res.json(data)})
  .catch((err)=>{res.json(err)})
})

//getting movies betwwen to given created years
router.get('/between/:start/:end', (req, res) => { //url always returns string
  const {start, end} = req.params;
  MovieModel.find({year:{"$gte":Number(start), "$lte":Number(end)}}) // checking the years between end and start
  .then((data)=>{res.json(data)})
  .catch((err)=>{res.json(err)})
})

//getting top 10 movies from db to movie page (/api/movies)
router.get('/top10', (req, res) => {
  MovieModel.find().sort({imdb_score:-1}).limit(10) // => lists all db items
  .then((data)=>{res.json(data)})
  .catch((err)=>{res.json(err)})
})

// getting movie by giving ID
router.get('/:movieId', (req, res, next) => {
  MovieModel.findById(req.params.movieId) // => lists movie by its ID
  .then((data)=>{
    //if(data===null){next({message:'Movie ID not found!', code:99})}; if returned object null then error message but latest updates runs catch directly
    res.json(data)})
  .catch((err)=>{
    next({message:'Movie ID not found!', code:99});
    res.json(err)})
})

//sending new movies to the db.
router.post('/', function (req, res) {
    const movie = new MovieModel(req.body); //matching all movie properties automatically
    
    // movie.save((err,data)=>{  //using callback function
    //     if(err){res.json(err)};
    //     res.json(data);
    // });

    movie.save() // using promise
    .then((data)=>{res.json(data)})
    .catch((err)=>{res.json(err)})
})

//updating movies in database
router.put('/:movieId', function (req, res, next) {
  MovieModel.findByIdAndUpdate(req.params.movieId,req.body, {new:true})
  .then((data)=>{res.json(data)})
  .catch((err)=>{next({message:'The movie was not found', code:99})
  res.json(err)})
})

//deleting movies in database
router.delete('/:movieId', function (req, res, next) {
  MovieModel.findByIdAndRemove(req.params.movieId)
            .then((data)=>{res.json(data)})
            .catch((err)=>{next({message:'The movie was not found', code:99})
            res.json(err)})
})

module.exports = router;