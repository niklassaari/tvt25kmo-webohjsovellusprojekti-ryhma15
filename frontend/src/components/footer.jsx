import hootertest from "../assets/hootertest.png";
import githublogo from "../assets/githublogo.png";


function Footer() {
  return (
    
    
    <footer style={{
      position: "relative",
      width: "100%",              // ADD
      minHeight: "100px",         // ADD
      }}>

{/*hootertest on tuo headerin ja hooterin musta tausta*/}
{/*Lisää tänne vielä ainakin jäsenten nimet, ja silleen että muovautuu sisällön mukaan*/}
      <img src={hootertest} 
      style={{
  position: "absolute",
  top: 0,               // ADD
  left: 0,              // ADD
  width: "100%",
  height: "100%",
  display: "flex",
  justifyContent: "space-between",
  objectFit: "cover",
  
  alignItems: "center",
  height: "100%",
  }} />

{/*Footer tekstit*/}
<div className="footertext" style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
}}
          >
<p>test</p>
</div>
{/* Linkki githubiin */}
   <a
        href="https://github.com/niklassaari/tvt25kmo-webohjsovellusprojekti-ryhma15"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
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