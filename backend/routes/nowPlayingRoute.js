import { Router } from 'express'
import { auth } from '../helper/auth.js'
/*tuleeko joskus helper jossa on erikseen tuo auth*/


const router = router()

router.get('/now-playing', getNowPlaying)



export default router

curl --request GET \
     --url 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc&with_release_type=2|3&release_date.gte={min_date}&release_date.lte={max_date}' \
     --header 'Authorization: Bearer ACCESS_TOKEN' \
     --header 'accept: application/json'