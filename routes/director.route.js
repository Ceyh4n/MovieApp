const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const directorModel = require('../models/Director')

router.get('/', (req, res) => { //lookup table - to create relationship between 2 tables
  directorModel.aggregate([
      {
          $lookup:
          {
             from:'movies',
             localField:'_id',
             foreignField:'director_id',
             as:'movies' 
          },
      },
      {
        $unwind:{
            path:'$movies',
            preserveNullAndEmptyArrays:false
        }
      },

      {
        $group:{
            _id:{
                name:'$name',
                surname:'$surname'
            },
            movies:{
                $push:'$movies'
            }
        }
    },

    {
        $project:{
            _id:'$_id._id',
           name:'$_id.name',
            surname:'$_id.surname',
            'movies.title':1,
            'movies.imdb_score':true // ==1
        }
    }

  ]).then((data)=>{res.json(data)})
    .catch((err)=>{res.json(err)})
})

router.get('/:directorId', (req, res) => {
  const resultQuery = directorModel.aggregate(
      [
          {
              $match:{_id:mongoose.Types.ObjectId(req.params.directorId)}
          },
          {
            $lookup:
            {
               from:'movies',
               localField:'_id',
               foreignField:'director_id',
               as:'movies' 
            },
          }
      ]
  )
})

//updating directors in database
router.put('/:directorId', function (req, res, next) {
    directorModel.findByIdAndUpdate(req.params.movieId,req.body, {new:true})
    .then((data)=>{res.json(data)})
    .catch((err)=>{next({message:'The director was not found', code:99})
    res.json(err)})
  })
  
  //deleting directors in database
  router.delete('/:directorId', function (req, res, next) {
    directorModel.findByIdAndRemove(req.params.movieId)
              .then((data)=>{res.json(data)})
              .catch((err)=>{next({message:'The director was not found', code:99})
              res.json(err)})
  })

router.post('/', function (req, res) {
    const director = new directorModel(req.body);
        
    director.save() // using promise
    .then((data)=>{res.json(data)})
    .catch((err)=>{res.json(err)})
})

module.exports = router;