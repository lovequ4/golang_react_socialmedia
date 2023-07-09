import React, { useState } from 'react'
import LOGIN_IMG from '../images/Coffee_Table_Laptops_Smartphone_592694_2560x3840.jpg'
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {

    let navigate = useNavigate()

    const[user,setUser]=useState({
    username:"", 
    password:"",
    email:""
    })

    const{username,password,email}=user

    const [isRegistered, setIsRegistered] = useState(false);
    const [errors, setErrors] = useState({});

    const onInputChange =(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }

    
    const onSubmit =async(e)=>{
        e.preventDefault()
    
            // Check if any of the fields are empty
    if (!username || !password || !email) {
    setErrors({ message: 'Please enter the username, password, email' });
    return;
    }

    // Reset errors
    setErrors({});  


    await axios.post("http://localhost:8080/signup",user)
        setIsRegistered(true)
        setTimeout(() => {
            setIsRegistered(false); // 2 秒后隐藏成功消息
            navigate("/"); // 導向主頁
        }, 1500);
    }

  return (
    <section className="vh-100" style={{backgroundcolor: '#9A616D'}}>
    <div className="container py-5 h-100">
    <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col col-xl-10">
        <div className="card" style={{borderradius: '1rem'}}>
            <div className="row g-0">
            <div className="col-12 col-md-6 col-lg-6 d-none d-md-block">
                <img src={LOGIN_IMG}
                alt="login form" class="img-fluid" style={{borderradius: '1rem 0 0 1rem'}} />
            </div>
            <div className="col-12 col-md-6 col-lg-6 d-flex align-items-center">
                <div className="card-body p-4 p-lg-5 text-black">

                <form onSubmit={(e) => onSubmit(e)}>

                    <div className="d-flex align-items-center mb-3 pb-1">
                  
                    </div>

                    <h5 className="fw-normal mb-3 pb-3 text-center" style={{letterspacing: '1px'}}>Signup User</h5>

                    <div className="form-outline mb-4">
                    <input type="email" id="form2Example17" class="form-control form-control-lg" 
                      value={email}
                      name="email"
                      onChange={(e) => onInputChange(e)} />
                    <label className="form-label" for="form2Example17">Email address</label>
                    </div>

                    <div className="form-outline mb-4">
                    <input type="text" id="form2Example27" class="form-control form-control-lg" 
                      value={username}
                      name="username"
                      onChange={(e) => onInputChange(e)} />
                    <label className="form-label" for="form2Example27">Username</label>
                    </div>

                    <div className="form-outline mb-4">
                    <input type="password" id="form2Example27" class="form-control form-control-lg" 
                      value={password}
                      name="password"
                      onChange={(e) => onInputChange(e)} />
                    <label className="form-label" for="form2Example27">Password</label>
                    </div>

                    <div className="pt-1 d-grid gap-2">
                    <button className="btn btn-dark btn-lg btn-block" type="submit">Signup</button>
                    </div>

                    {isRegistered && (
                        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Success</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                Register success!
                            </div>
                            </div>
                        </div>
                        </div>
                    )}

                    {errors.message && (
                        <div className="alert alert-danger">{errors.message}</div>
                    )}

                    <div className="pt-1 d-grid gap-2 mt-4">
                    <Link to="/" className="btn btn-danger btn-lg btn-block ">
                        Cancel
                    </Link>
                    </div>
                    
                </form>

                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </div>
</section>
  )
}

export default Signup