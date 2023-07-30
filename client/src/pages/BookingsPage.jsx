import { useEffect, useState } from "react";
import AccountNav from "./AccountNav";
import axios from "axios";
import PlaceImg from "../components/PlaceImg";
import { differenceInCalendarDays, format } from "date-fns";
import { Link } from "react-router-dom";
import BookingDates from "../components/BookingDates";

export default function BookingsPage(){
    const [bookings,setBookings]=useState([]);
    useEffect(()=>{
      axios.get('/bookings').then((response) =>{
        setBookings(response.data);
      }); 
    },[])

    return (
        <div>
            <AccountNav/>
            <div className="grid-flow-row ">
             {bookings?.length>0 && bookings.map(booking =>(
                
                <Link to={`/account/bookings/${booking._id}`} className="flex w-full max-w gap-4 bg-gray-200 rounded-2xl border-b border-gray-500  my-2 overflow-hidden">
                <div className="w-48 flex-shrink-0">
                 <PlaceImg place={booking.place} />
                 </div>
                 <div className="py-3 pr-3 grow ">
                  <h2 className="text-xl">{booking.place.title}</h2>
                  <BookingDates booking={booking} className="border-t border-gray-300 mt-4 mb-2 py-2  text text-gray-500"/>
                <div className="text-xl">
                  
                    <div className="flex gap-1 ">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8  h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                     </svg>
                     <span className="text-2xl">
                     Total price:${booking.price}
                     </span>
                  
                    </div>
                </div>
                </div>
               
                </Link>
                
             ))}
            </div>
        </div>
    )
} 