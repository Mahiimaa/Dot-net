
import Navbar from './Navbar';

import HomePage from '../Home';
import BookList from '../BookList';
const Layout = () => {
  return (
    <div>
     
      
      <div id="Home" className='section'>
        <HomePage />
      </div>
      <div id="BookList" className='section'>
        <BookList />
      </div>
      {/* <div id="meetings" className='section'>
        <Meetings/>
      </div>
      <div id="dine" className='section'>
        <Dine/>
      </div>
      <div id="gallery" className='section'>
        <Gallery />
      </div>
      <div id="contact" className='section'>
        <Contact />
      </div>
      <Footer /> */}
    </div>
  );
};

export default Layout;
