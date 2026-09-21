import NowPlaying from "./nowPlaying";

const Home = () => {
   return (
    <div id="container">
      <h1>Testi </h1>
      

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

}




export default Home;