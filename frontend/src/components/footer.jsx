import hooter from "../assets/hooter.png";
import githublogo from "../assets/githublogo.png";

function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100px",
      }}
    >
      {/* hootertest is the black background for the footer */}

      <img
        src={hooter}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Footer text */}
      <div
        className="footertext"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          paddingTop: "10px",
        }}
      >
        <p>test</p>
      </div>

      {/* Link to GitHub */}
      <a
        href="https://github.com/niklassaari/tvt25kmo-webohjsovellusprojekti-ryhma15"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "relative",
          zIndex: 1,
          display: "block",
          width: "fit-content",
          margin: "0 auto",
          marginBottom: "20px",
        }}
      >
        <img
          src={githublogo}
          alt="GitHub"
          style={{
            width: "50px",
            height: "50px",
          }}
        />
      </a>
    </footer>
  );
}

export default Footer;