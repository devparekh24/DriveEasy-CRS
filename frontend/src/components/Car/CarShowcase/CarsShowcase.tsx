import "./CarsShowcase.css";
import CarDetailsCard from "../CarDetailsCard/CarDetailsCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect } from "react";
import { setCars } from "../../../slices/carSlice";
import { useGetAllCarsQuery } from "../../../services/carApi";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

export interface CarDetails {
  _id: string;
  carName: string;
  carType: string;
  companyName: string;
  mileage: number;
  year: string;
  capacity: number;
  color: string;
  availability: boolean;
  rentPrice: number;
  image: string;
  fule: string;
  transmission: string;
}

const CarsShowcase = () => {
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

  return (
    isLoading ? (<Loader />) :
      (
        <div className="cars-showcase">
          <div className="list-row">
            {cars.map((car: CarDetails) => (
              <CarDetailsCard
                key={car._id}
                id={car._id}
                carName={car.carName}
                image={car.image}
                capacity={car.capacity}
                transmission={car.transmission}
                rentPrice={car.rentPrice}
                availability={car.availability}
                color={car.color}
                companyName={car.companyName}
                fule={car.fule}
                mileage={car.mileage}
                year={car.year}
              />
            ))}
          </div>
        </div>
      )
  )
}

export default CarsShowcase;