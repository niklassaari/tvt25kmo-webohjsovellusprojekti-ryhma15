import NowPlaying from "./nowPlaying";
import TopMovies from "./topMovies";
import TopShows from "./topShows";

function Home() {
  return (
    <div id="container">

      <section className="OnTheaters">
        <NowPlaying />
      </section>

      {/* parhaiten arvostellut elokuvat */}
      <section className="TopRatedMovies">
        <TopMovies />
      </section>

      <section className="TopRatedShows">
        <TopShows />
      </section>

    </div>
  );
}

export default Home; 