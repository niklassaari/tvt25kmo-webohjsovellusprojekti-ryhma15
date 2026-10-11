import './footer.css';
import githublogo from '../assets/githublogo.png';

function Footer() {
  return (
    <footer className="footer">
        <div className="footer-title"> 
        <h3>Elokuvasovellus (Web-ohjelmoinnin sovellusprojekti)</h3>
        </div>
        
        <div className="footer-members">
        <h4>Projektin (Ryhmä 15) jäsenet:</h4>
        <p>Niklas Saari</p>
        <p>Patrik Saari</p>
        <p>Timi Lehto</p>
        <p>Tuomo Koskinen</p>
      </div>

      <div className="footer-docs">
        <h4>API References:</h4>
        <a href="https://developer.themoviedb.org/reference/getting-started">
        <p>TMBD API Reference</p>
        </a>
        
      </div>

      <div className="footer-divider"></div>

      <div className="footer-github">
        <a
          href="https://github.com/niklassaari/tvt25kmo-webohjsovellusprojekti-ryhma15"
        >
          <img src={githublogo} alt="githubrepo" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;