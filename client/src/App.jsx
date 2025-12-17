import './App.css';
import axios from "axios"
import { useEffect,useState } from 'react';

function App() {
  const [users ,setUser]=useState([]);
  const[filteruser,setFilteruser]=useState([])

  const[ismodelopen ,setisModelopen] = useState(false)
  const[userdata,setUserdata] =useState({name:"",age:"",city:""})

  const getallusers = async () => {

     await axios.get("http://localhost:8000/users").then((res) => {
       setUser(res.data)
       setFilteruser(res.data)
    }); 
    }
    useEffect(()=>{
          getallusers();
    },[])
  
 const handletextchange = (e) => {
  const searchtxt = e.target.value.toLowerCase();

  const filtervalue = users.filter((user) =>
    user.name.toLowerCase().includes(searchtxt) ||
    user.city.toLowerCase().includes(searchtxt)
  );
  setFilteruser(filtervalue);
};

// Delete user function:

const handledelete = async (id) => {
  const isconfirmed = window.confirm("Are You Sure , you want to delete the user")
  if (isconfirmed){
    await axios.delete(`http://localhost:8000/users/${id}`).then((res)=>{
      setUser(res.data)
      setFilteruser(res.data)
    })
  }
  
}

// close model

const closemodel=()=>{
  setisModelopen(false) 
  getallusers();
}

// Add user function 
const handleaddrecord=()=>{
   setUserdata({name:"",age:"",city:""})
   setisModelopen(true)
}

const handledata=(e)=>{
    setUserdata({...userdata,[e.target.name]: e.target.value})
}

const handlesubmit=async (e)=>{
   e.preventDefault();
  if(userdata.id){
      await axios.patch(`http://localhost:8000/users/${userdata.id}`,userdata).then((res)=>{
    console.log(res) 
   })
  }
  else{
    await axios.post("http://localhost:8000/users",userdata).then((res)=>{
    console.log(res) 
   })
  }
 closemodel(); 
 setUserdata({name:"",age:"",city:""}) 
}
// update user data
const handleupdate=(user)=>{
     setUserdata(user)
     setisModelopen(true) 
}
  return (
    <>
      <div className='container'>
            <h3>CRUD APPLICATION</h3>
            <div className='Input-search' >
               <input type="search" placeholder='Search Text Here' onChange={handletextchange}/>
               <button className='btn green ' onClick={handleaddrecord}>Add Record</button>
            </div>
            <table className='table'>
               <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>City</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
               </thead>
               <tbody>
                {
                  filteruser && filteruser.map((user,index)=>{
                    return(
                  <tr key={user.id}>
                  <td>{index}</td>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.city}</td>
                  <td><button className='btn green'onClick={()=>handleupdate(user)}>Edit</button></td>
                  <td><button className='btn red ' onClick={()=>handledelete(user.id)}>Delete</button></td>
                </tr>)
                  })
                }
               </tbody>
            </table>

            { ismodelopen && (
              <div className='model'>
                  <div className='model-content'>
                    <span className='close' onClick={closemodel}>
                      &times;
                    </span>
                      <h2>{userdata.id ? "Update Record" : "Add Record"}</h2>
                      <div className='input-group'>
                      <label htmlFor="Name">Full Name</label>
                      <input type="text" value={userdata.name} name='name' id='name' onChange={handledata}/>  
                      </div>
                      <div className='input-group'>
                      <label htmlFor="Age">Age</label>
                      <input type="number" value={userdata.age} name='age' id='age' onChange={handledata}/>  
                      </div>
                      <div className='input-group'>
                      <label htmlFor="City">City</label>
                      <input type="text" value={userdata.city} name='city' id='city' onChange={handledata}/>  
                      </div>
                      <button className='btn green' onClick={handlesubmit}>{userdata.id ? "Update User" : "Add User"}</button>
                  </div>
              </div>
            )}
      </div>
    </>
  )
}

export default App
