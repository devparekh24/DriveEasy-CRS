import "./CarsShowcase.css";
import CarDetailsCard from "../CarDetailsCard/CarDetailsCard";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { useEffect, useMemo } from "react";
import { Car, setCars } from "../../../slices/carSlice";
import { useGetAllCarsQuery, useGetCarsWithAvailabilityQuery } from "../../../services/carApi";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

interface CarsShowcaseProps {
  filters: any;
  gridView: '1x1' | '2x2' | '3x3';
}

const CarsShowcase: React.FC<CarsShowcaseProps> = ({ filters, gridView }) => {

  const hasDateFilter = filters.startDate && filters.endDate;

  // Fetch all cars (used when no date filter is applied)
  const {
    data: allCarsData,
    isError: isAllCarsError,
    isLoading: isAllCarsLoading,
    error: allCarsError,
    isSuccess: isAllCarsSuccess,
  } = useGetAllCarsQuery(undefined, { skip: !!hasDateFilter });

  // Fetch cars with availability annotations (used when date filter is applied)
  const {
    data: availabilityCarsData,
    isError: isAvailabilityError,
    isLoading: isAvailabilityLoading,
    error: availabilityError,
    isSuccess: isAvailabilitySuccess,
  } = useGetCarsWithAvailabilityQuery(
    { pickupDate: filters.startDate, dropOffDate: filters.endDate },
    { skip: !hasDateFilter }
  );

  const dispatch = useAppDispatch();
  const cars = useAppSelector(state => state.car.cars);

  // Determine which data source to use
  const isLoading = hasDateFilter ? isAvailabilityLoading : isAllCarsLoading;
  const isError = hasDateFilter ? isAvailabilityError : isAllCarsError;
  const error = hasDateFilter ? availabilityError : allCarsError;
  const data = hasDateFilter ? availabilityCarsData : allCarsData;
  const isSuccess = hasDateFilter ? isAvailabilitySuccess : isAllCarsSuccess;

  useEffect(() => {
    if (isError && error) {
      toast.error((error as any)?.data?.message || 'Failed to fetch cars', {
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [isError, error]);

  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setCars({ data: (data as any).data?.data || [] }));
    }
  }, [dispatch, isSuccess, data]);

  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Only filter out unavailable cars when NO date filter is applied
    // When date filter IS applied, we show all cars (booked ones get a badge)
    if (!hasDateFilter) {
      result = result.filter((car: Car) => car.availability);
    }

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

    // Apply filters based on the selected values of fuel
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

    return result;
  }, [cars, filters]);

  return (
    isLoading ? (<Loader />) :
      (
        <div className="cars-showcase">
          <div className={`list-row grid-${gridView}`}>
            {filteredCars.length === 0 ? (<h3>No car found!</h3>) :
              (<>
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
                    bookedDates={car.bookedDates}
                    isBookedForPeriod={car.isBookedForPeriod}
                    conflictingBookings={car.conflictingBookings}
                  />
                ))
                }
              </>)
            }
          </div>
        </div>
      )
  )
}

export default CarsShowcase;
