import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function IndexPage(){
   const [places,setPlaces]=useState([]);

   useEffect(()=>{
    axios.get('/places').then(response =>{
     setPlaces(response.data);
    })
   },[]);

    return(
        <div className="flex">

         <div className="grid lg:grid-cols-4 gap-6 gap-y-8  md:gird-cols-3 grid-cols-2 px-2 xl:grid-cols-6 flex-shrink mt-8 ">
         {places.length>0 && places.map(place =>(
            <Link to={'/place/'+place._id}>
            <div className="bg-gray-500 mb-2 rounded-2xl flex ">
            {place.photos[0] &&(
               
                <img className="rounded-2xl object-cover aspect-square " src={"https://airbnb-v20y.onrender.com/uploads/"+place.photos[0]} alt=""/>
              
            )} 
            </div>
            <h3 className="font-bold ">{place.address}</h3>
            <h2 className="text-sm text-gray-500">{place.title}</h2>
            <div className="mt-1">
             <span className="font-bold">${place.price}  </span>per night
            </div>
            </Link>
         ))}
       </div>
    </div>
    )
} 
 