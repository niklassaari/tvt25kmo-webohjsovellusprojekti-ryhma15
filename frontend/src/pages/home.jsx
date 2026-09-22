import NowPlaying from './nowPlaying';

function Home() {
   return (
       <div id="container">


<section className="OnTheaters">
  <NowPlaying/>
</section>

{/* 2. UUSI OSIO: Top 3 */}
  <section className="TopRated">
    <h2>Top 3 Movies</h2>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>
    <div className="movie-list">...</div>

  </section>
</div>
 );
};


export default Home;