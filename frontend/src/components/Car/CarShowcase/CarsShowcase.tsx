import "./CarsShowcase.css";
import CarDetailsCard from "../CarDetailsCard/CarDetailsCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect, useMemo } from "react";
import { Car, setCars } from "../../../slices/carSlice";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const CarsShowcase = ({ filters }: { filters: any }) => {

  const { data, isError, isLoading, error, isSuccess } = useGetAllCarsQuery();
  const dispatch = useAppDispatch();
  const cars = useAppSelector(state => state.car.cars)
  console.log(cars)
  console.log(data)

  const carData = async () => {
    try {
      // if (isLoading) console.log('loading...')
      if (isError) {
        throw error
      }
      await data
    }
    catch (error: any) {
      toast.error(error?.data?.message, {
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
      dispatch(setCars(data?.data))
    }
  }, [dispatch, isSuccess, carData])

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Apply filters based on the selected values of rentPrice
    switch (filters.sortBy) {
      case 'dailyPriceHighToLow':
        result = result.sort((a: Car, b: Car) => b.rentPricePerDay - a.rentPricePerDay);
        break;
      case 'dailyPriceLowToHigh':
        result = result.sort((a: Car, b: Car) => a.rentPricePerDay - b.rentPricePerDay);
        break;
      case 'hourlyPriceHighToLow':
        result = result.sort((a: Car, b: Car) => b.rentPricePerHour - a.rentPricePerHour);
        break;
      case 'hourlyPriceLowToHigh':
        result = result.sort((a: Car, b: Car) => a.rentPricePerHour - b.rentPricePerHour);
        break;
      case 'perKMPriceHighToLow':
        result = result.sort((a: Car, b: Car) => b.rentPricePerKm - a.rentPricePerKm);
        break;
      case 'perKMPriceLowToHigh':
        result = result.sort((a: Car, b: Car) => a.rentPricePerKm - b.rentPricePerKm);
        break;

      default:
        break;
    }

    // Apply filters based on the selected values of transmission
    switch (filters.transmission) {
      case 'manual':
        result = result.filter((item: Car) => item.transmission === 'Manual');
        break;
      case 'automatic':
        result = result.filter((item: Car) => item.transmission === 'Automatic');
        break;
      case 'am':
        result = result.filter((item: Car) => item.transmission === 'AM');
        break;
      case 'cv':
        result = result.filter((item: Car) => item.transmission === 'CV');
        break;

      default:
        break;
    }

    // Apply filters based on the selected values of transmission
    switch (filters.fuel) {
      case 'petrol':
        result = result.filter((item: Car) => item.fule === 'Petrol');
        break;
      case 'diesel':
        result = result.filter((item: Car) => item.fule === 'Diesel');
        break;
      case 'cng':
        result = result.filter((item: Car) => item.fule === 'CNG');
        break;
      case 'ev':
        result = result.filter((item: Car) => item.fule === 'EV');
        break;

      default:
        break;
    }

    // Apply filters based on the selected values of seatingCapacity
    switch (filters.seatingCapacity) {
      case 'gt5':
        result = result.filter((item: Car) => item.capacity > 5);
        break;
      case 'lteq5':
        result = result.filter((item: Car) => item.capacity <= 5);
        break;

      default:
        break;
    }

    // Apply more filters as needed

    return result;
  }, [cars, filters]);

  return (
    isLoading ? (<Loader />) :
      (
        <div className="cars-showcase">
          <div className="list-row">
            {filteredCars.map((car: Car) => (
              <CarDetailsCard
                key={car._id}
                _id={car._id}
                carName={car.carName}
                image={car.image}
                capacity={car.capacity}
                transmission={car.transmission}
                rentPricePerDay={car.rentPricePerDay}
                rentPricePerHour={car.rentPricePerHour}
                rentPricePerKm={car.rentPricePerKm}
                availability={car.availability}
                color={car.color}
                companyName={car.companyName}
                fule={car.fule}
                mileage={car.mileage}
                year={car.year}
                carNumberPlate={car.carNumberPlate}
                whenWillCarAvailable={car.whenWillCarAvailable}
              />
            ))}
          </div>
        </div>
      )
  )
}

export default CarsShowcase;