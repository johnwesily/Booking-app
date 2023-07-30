import Perks from "./Perks";
import PhotosUploader from "../components/PhotosUploader";
import { useEffect, useState } from "react";
import axios from "axios";
import AccountNav from "../../AccountNav";
import { Navigate, useParams } from "react-router-dom";



export default function PlacesFormPage(){
    const{id}=useParams();


const[title,setTitle]=useState('');
const[address,setAddress]=useState('');
const[addedPhotos,SetAddedPhotos]=useState([]);
const[description,setDescription]=useState('');
const[perks,setPerks]=useState([]);
const[extraInfo,setExtraInfo]=useState('');
const[checkIn,setCheckIn]=useState('');
const[checkOut,setCheckOut]=useState('');
const[maxGuests,setMaxGuests]=useState(1);
const[price,setPrice]=useState(100);

const [redirect,setRedirect]=useState(false);


useEffect(()=>{
 if(!id){
    return;
 }
 axios.get('/places/'+id).then(response =>{
    const{data}=response;
    setTitle(data.title);
    setAddress(data.address);
    setCheckIn(data.checkIn);
    setCheckOut(data.checkOut);
    setMaxGuests(data.maxGuests);
    setDescription(data.description);
    setPerks(data.perks)
    setExtraInfo(data.extraInfo);
    SetAddedPhotos(data.photos);
    setPrice(data.price);
 })
},[id]);
  

function inputHeader(text){
    return (
        <h2 className="text-xl mt-4 ">{text}</h2>
    );
  }

  function inputDescription(text){
    return(
        <p className="text-gray-500 text-sm">{text}</p>
    );
  }

  function preInput(header,description){
    return (
        <>  {inputHeader(header)}
            {inputDescription(description)}
        </>
    )
  }

  async function savePlace(ev){

    ev.preventDefault();
    const placeData={title,address,photos:addedPhotos,
        description,perks,extraInfo,
        checkIn,checkOut,maxGuests,price};
 
    if(id){
        axios.put('/places',{id,...placeData}); 
     }
    else{
        axios.post('/places',placeData)}
  
    setRedirect(true);
  }

  if(redirect){
    return<Navigate to={'/account/places'}/>
  }

    return (
        
          <div>
           <AccountNav/>
          <form onSubmit={savePlace}>  
            {preInput('Title','title for your place : should be short and catch as in advistment')}
            <input type="text" placeholder="title of your house" value={title} onChange={ev=>setTitle(ev.target.value)}/>
            {inputHeader('Address')}
            <input type="text" placeholder="adders " value={address} onChange={ev=>setAddress(ev.target.value)} />
            {preInput('Photos','more==better')}
              <PhotosUploader addedPhotos={addedPhotos} onChange={SetAddedPhotos}/>
              {preInput('Description','Description of the place')}
               <textarea  value={description} onChange={ev=>setDescription(ev.target.value)}/>
              {preInput('Perks',"Select all the perks of you place")}
             <Perks selected={perks} onChange={setPerks} />
              {preInput("Extra","house rules,etc...")}
              <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}/>
              {preInput("Check in&out time","add check in and out time and please make sure to have some time to clean between the guests")} 
              <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
                     <div>
                     <h3 className="mt-2 -mb-2 " >Check in time</h3>
                     <input type="text" placeholder="14:00" value={checkIn} onChange={ev=>setCheckIn(ev.target.value)}/>
                     </div>
                     <div>
                     <h3 className="mt-2 -mb-2 ">Check out time</h3>
                     <input type="text" placeholder="11:00" value={checkOut} onChange={ev=>setCheckOut(ev.target.value)}/>
                     </div>
                     <div>
                     <h3 className="mt-2 -mb-2 "> Max guests</h3>
                     <input type="number" placeholder="1" value={maxGuests} onChange={ev=>setMaxGuests(ev.target.value)}/>
                     </div>
                     <div>
                     <h3 className="mt-2 -mb-2 ">price per night</h3>
                     <input type="number" placeholder="100" value={price} onChange={ev=>setPrice(ev.target.value)}/>
                     </div>
              </div>
            
                <button className="primary my-4">Save</button>
            
          </form>
        </div>
    
    )
} 