
import Loading from "./Loading";
import Navbar from "./navbar";
import Home from "./home";
import WhyChoose from "./WhyChoose";
import Footer from "./Footer";
function App() {
 return (
  <>
  <Loading/>
  <div className="App">
    <Loading/>
   <Navbar/>
    <Home/>
    <WhyChoose/>
    <Footer/>
  </div>
  </>
 );
}
export default App;
