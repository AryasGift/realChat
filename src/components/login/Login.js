import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import './Login.css'; 
import { Slide, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword ,signInWithEmailAndPassword } from 'firebase/auth';
import { auth ,db} from '../../lib/Firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../../lib/upload';


function Login() {
    const [icon, setIcon] = useState({
        file: null,
        url: ""
    });
    const[loading,setLoading]=useState(false)
    const handleIcon = (e) => {
        if (e.target.files[0]) {
            setIcon({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            });
        }
    };
  const handleLogin=async(e)=>{
   e.preventDefault();
   setLoading(true);
   const formData=new FormData(e.target)
   const {username,email,password}=Object.fromEntries(formData)
   try{
      await signInWithEmailAndPassword(auth,email,password)

   }
   catch(err){
      console.log(err);
   }
  finally{
    setLoading(false);
  }
  }
  const handleRegister=async(e)=>{
    e.preventDefault()
    setLoading(true)
     const formData=new FormData(e.target)
     const {username,email,password}=Object.fromEntries(formData)
     try{
      const res=await createUserWithEmailAndPassword(auth,email,password)
      const imgUrl=await upload(icon.file)
      await setDoc(doc(db, "users",res.user.uid), {
        username,
        email,
        avatar:imgUrl,
        id:res.user.uid,
        blocked:[],
    });
    await setDoc(doc(db, "userchats",res.user.uid), {
        chats:[]
    });
    toast.success('Account created ,login now', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
     }
     catch(err){
        console.log(err);
     }
     finally{
        setLoading(false);
     }
  }
    return (
        <div className='login'>
            <div className="item">
                <h1>Welcome Back</h1>
                <form onSubmit={handleLogin}>
                    <Form.Group className="mb-3" controlId="loginEmail">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <input type="text" placeholder="name@example.com" name='email' />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginPassword">
                        {/* <Form.Label>Password</Form.Label> */}
                        <input type="password" placeholder="password" name='password' />
                    </Form.Group>
                    <button type="submit" disabled={loading}>{loading ? "Loading":"Sign In"}</button>
                </form>
            </div>
            <div className='separator'></div>
            <div className='item1'>
                <h1>Create an Account</h1>
                <form onSubmit={handleRegister}>
                    <label htmlFor="file">
                        <img src={icon.url || "https://i.postimg.cc/0NMbxvg8/istockphoto-removebg-preview.png"} alt="icon preview" />
                        Upload an Image
                    </label>
                    <input type="file" id='file' style={{ display: "none" }} onChange={handleIcon} />
                    <input type="text" placeholder='Username' name='username' />
                    <input type="text" placeholder='Email' name='email' />
                    <input type="password" placeholder="password" name='password' />
                    <button type="submit" disabled={loading}>{loading ?"loading":"Sign Up"}</button>
                </form>
            </div>
        </div>
    );
}

export default Login;
