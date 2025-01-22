import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import './PickContacts.css'
function PickContacts({contacts,primary,setShowContactsSelect,filteredRecords}) {
  let send = [];
  const navigate = useNavigate()
  useEffect(()=>{
    if(primary){
      send.push(primary)
    }
  },[])

  console.log("initail send",send)
  const handleChange = (e,contact)=>{
    
    if(e.target.checked==false){
      console.log("id",contact)
      send = send.filter((cont)=>{
        if(cont._id==contact._id){
          return false;
        }else{
          return true;
        }
      })
    }else{
      send.push(contact);
    }
    console.log("send",send)
  }
  const handleSend = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://patientcare-2.onrender.com/records/send-email`,
        {filteredRecords,send}, 
        { withCredentials: true } // Configuration object for Axios
      );
      navigate('/records')
      toast.success(response.data.message);
    } catch (e) {
      console.error(e);
      toast.error("Failed to send the email.");
    }
  };



  return (
    <div className='pick'>
     {primary&&primary.isVerified ? (
  <div>
    <div>
      <h5>Primary Contact</h5>
    name:{primary.name}
    <br />
    email:{primary.email}
    </div>
    <input type="checkbox" onChange={(e)=>{handleChange(e,primary)}} defaultChecked/>
  </div>
) : <p>No contact set as Primary</p>}

{
  contacts.map((item, idx) => (item.isVerified&&!item.isPrimary&&
    <ul key={item._id}>
      <li style={{border:"2px solid gray",padding:"20px"}}>
        <div >
          <h5>Contact {idx + 1}</h5>
          {/* Displaying the correct contact data */}
          Name: {item.name}
          <br />
          Email: {item.email}
        </div>
        <input 
          type="checkbox" 
          onChange={(e) => handleChange(e, item)} 
        />
      </li>
    </ul>
  ))
}

  <button className="sub" onClick={handleSend}>Send</button>

  <button className="can "onClick={()=>{setShowContactsSelect(false)}}>cancel</button>

    </div>
  )
}

export default PickContacts