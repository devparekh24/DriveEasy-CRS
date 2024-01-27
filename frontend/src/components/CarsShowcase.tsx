import { carsForBooking } from "../data/cars";
import "../styles/CarsShowcase.css";
import CarDetailsCard from "./CarDetailsCard";

interface CarDetails {
  id: number | string;
  name: string;
  image: string;
  seats: string;
  gearType: string;
  luggage: string;
  ratePerDay: string | number;
}
const CarsShowcase = () => {
  return (
    <div className="cars-showcase">
      <div className="list-row">
        {carsForBooking?.map((car: CarDetails) => (
          <CarDetailsCard
            key={car?.id}
            id={String(car.id)}
            carName={car.name}
            carImg={car.image}
            seats={car.seats}
            gear={car.gearType}
            luggage={car.luggage}
            carRate={car.ratePerDay}
          />
        ))}
      </div>
    </div>
  )
}

export default CarsShowcase;