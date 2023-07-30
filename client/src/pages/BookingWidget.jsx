import axios from "axios";
import { differenceInCalendarDays } from "date-fns/esm";
import { useContext, useEffect, useState } from "react"
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";


export default function BookingWidget({place}){
    const [checkIn,setCheckIn]=useState('');
    const[checkOut,setCheckOut]=useState('');
    const [numberOfGuest,setNumberOfGuest]=useState(1);
    const [name,setName]=useState('');
    const [phone,setPhone]=useState('');
     const [redirect,setRedirect]=useState('');
     const {user}=useContext(UserContext);

     useEffect(()=>{
        if(user){
            setName(user.name);
        }
     },[user])

    let numberOfNights=0;
    if(checkIn && checkOut){
        numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    } 

    async function BookThisPlace(){
       
       const response= await axios.post('/bookings',{
            checkIn,checkOut,numberOfGuest,name,phone,
            place:place._id,price:numberOfNights *place.price,
        });

        const bookingsId=response.data._id;
     
      setRedirect(`/account/bookings/"${bookingsId}`);

    }

   if(redirect){
    return <Navigate to={redirect}/>
   }


    return(
        <div className="bg-white shadow p-4 rounded-2xl">
              <div className="text-2xl text-center">
                Price :${place.price} /per night
              </div>

              <div className="border rounded-2xl mt-4 ">
              <div className="flex">
              <div className=" py-3 px-4">
                <label>Check In:  </label>

                <input type="date" value={checkIn} onChange={(ev)=>setCheckIn(ev.target.value)}/>
                </div>

                <div className="  py-3 px-4 border-l ">
                <label>Check Out: </label>
                <input type="date" value={checkOut} onChange={(ev)=>setCheckOut(ev.target.value)}/>
              </div>
              </div>
              <div className="  py-3 px-4 border-t">
                <label>Max Guest: </label>
                <input type="number" value={numberOfGuest} onChange={(ev)=>setNumberOfGuest(ev.target.value)}/>
              </div>
               {numberOfNights >0 && (
                <div className="  py-3 px-4 border-t">
                <label>Your full name:</label>
                <input type="text" value={name} onChange={(ev)=>setName(ev.target.value)}/>
                <label>Your Phone number:</label>
                <input type="tel" value={phone} onChange={(ev)=>setPhone(ev.target.value)}/>
              </div>
               )}

              </div>
              <button onClick={BookThisPlace} className="primary mt-4">Book this Place
              { numberOfNights >0 &&(
                <span>{numberOfNights * place.price}</span>
              )}
              </button>

            </div>
    )
}

