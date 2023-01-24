import '../styles/globals.css'
import NavBar from "../components/NavBar.jsx";
import Footer from "../components/Footer.jsx";

const MyApp = ({ Component, pageProps }) => (
  <div>
    <NavBar />
    <Component {...pageProps} />
    <Footer />
  </div>
);

export default MyApp
