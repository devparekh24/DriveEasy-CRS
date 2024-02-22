import "./CarList.css";
import { cars } from "../../../data/cars";
import AOS from 'aos';
import 'aos/dist/aos.css';
AOS.init({
  offset: 200,
  duration: 400,
  easing: 'ease-in-sine',
  delay: 100
})
interface Car {
  id: number | string;
  image: string;
  name: string;
}

const CarList = () => {

  return (
    <>
      <div className="cars-list">
        <h1>First Class Car Rental Services</h1>
        <h5>
          We offer professional car rental services in our range of
          high-end vehicles
        </h5>

        <div className="car-list-container">
          {cars.map((car: Car) => (
            <div className="car-card" id={String(car.id)} key={car.id}>
              <img data-aos="zoom-in-up" src={car.image} alt={car.name} className="card-image" />
              <div className="overlay">{car.name}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default CarList

