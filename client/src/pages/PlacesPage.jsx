
import { Link, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";





export default  function PlacesPage() {

    const [places,setPlaces] =useState([])

    useEffect(()=>{
        axios.get('/user-places').then(({data})=>{
         setPlaces(data);
        })
    },[])
  
  return ( 
    <div>
      <AccountNav/>
        <div className="text-center py-3">
          <Link className="text-white inline-flex gap-1 bg-primary rounded-full px-6 py-2" to={"/account/places/new"} >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new place
          </Link>
        </div>
        <div className="mt-4"> 
            {places.length > 0 && places.map(place =>(
                <Link key={place._id} to={'/account/places/'+place._id} className="bg-gray-200 flex cursor-pointer  gap-4 p-2 rounded-xl">
                <div key={place._id} className="w-32 h-32 bg-gray-300 flex shrink-0">
                {place.photos.length>0 &&( 
                    <img key={place._id}   className="object-cover " src={"https://airbnb-v20y.onrender.com/uploads/"+place.photos[0]}  alt="" />
                )}
                </div>
                <div className="grow-0 shrink">
                <h2 className=" text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
                </div>
                </Link>
            ))}
        </div>
    </div>
  );
} 


