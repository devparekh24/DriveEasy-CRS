import { useParams } from "react-router-dom";
import { carsByType } from "../../../data/cars";
import CarDetailsCard from "../CarDetailsCard/CarDetailsCard";

interface CarDetails {
  id: number | string;
  name: string;
  image: string;
  seats: string;
  gearType: string;
  luggage: string;
  ratePerDay: string;
}

export default function CarTypeList() {
  const params = useParams<{ type: string }>();
  const carTypes = carsByType.filter((car: CarDetails) => params.type === car.gearType);

  console.log("carTypes >> ", params.type);
  console.log("testCars arr >> ", carTypes);

  return (
    <div className="cars-showcase">
      <div className="list-row">
        {carTypes.length > 0 ? (
          <>
            {carTypes.map((car: CarDetails) => (
              <CarDetailsCard
                key={car.id}
                id={String(car.id)}
                carName={car.name}
                image={car.image}
                seats={car.seats}
                gear={car.gearType}
                luggage={car.luggage}
                carRate={car.ratePerDay}
              />
            ))}
          </>
        ) : (
          <h3>No Cars of this Type</h3>
        )}
      </div>
    </div>
  );
}
