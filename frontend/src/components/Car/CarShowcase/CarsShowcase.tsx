import { carsForBooking } from "../../../data/cars";
import "./CarsShowcase.css";
import CarDetailsCard from "../CarDetailsCard/CarDetailsCard";
import { useAppDispatch } from "../../../hooks/hooks";
import { useEffect } from "react";
import { setCars } from "../../../slices/carSlice";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { toast } from "react-toastify";

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
  const { data, isError, isLoading, error, isSuccess } = useGetAllCarsQuery();
  const dispatch = useAppDispatch();
  console.log(data)

  const carData = async () => {
    try {
      if (isLoading) console.log('loading...')
      if (isError) {
        throw error
      }
      await data
    }
    catch (error: any) {
      toast.error(error.data.message, {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      })
    }
  }

  useEffect(() => {
    carData()
    if (isSuccess) {
      dispatch(setCars(data))
    }
  }, [dispatch, isSuccess, carData])
  
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