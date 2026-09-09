import { Router } from 'express'
import { auth } from '../helper/auth.js'


router.get('/', (req, res, next)=> {
   pool.query('SELECT * FROM task', (err, result)=>{
    if (err){
        return next(err)
    }
    res.status(200).json(result.rows || [])
   })
})







curl --request GET \
     --url 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}' \
     --header 'Authorization: Bearer ACCESS_TOKEN' \
     --header 'accept: application/json'