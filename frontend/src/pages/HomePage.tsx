import { Link } from 'react-router-dom';
import Properties from './property-listing/Properties';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Properties />
    </div>
  )
}

export default HomePage
