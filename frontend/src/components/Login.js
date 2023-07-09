import React,{useState} from 'react'
import './Login.css'
import LOGIN_IMG from '../images/Coffee_Table_Laptops_Smartphone_592694_2560x3840.jpg'
import GOOGLE_ICON from '../images/Google__G__Logo.png' 
import {useNavigate } from 'react-router-dom' 
import axios from 'axios'
//https://mdbootstrap.com/docs/standard/extended/login/#!
// img https://www.google.com/search?q=social%20media%20images&tbm=isch&hl=zh-TW&tbs=rimg:CT8rHd8draSTYatdSRKMPiU2sgIMCgIIABAAOgQIABAAwAIA2AIA4AIA&authuser=0&sa=X&ved=0CBoQuIIBahcKEwjwhaK_2uz_AhUAAAAAHQAAAAAQFA&biw=1903&bih=929#imgrc=M91RE07TWpd3iM

const Login = () => {

    let navigate = useNavigate()

    const[user,setUser]=useState({
        username:'',
        password:''
    })

    const{username,password}=user

    const [islogin, setIslogin] = useState(false);

    const onInputChange =(e)=>{
        setUser({...user,[e.target.name]:e.target.value})
    }
    
    const onSubmit =async(e)=>{
      e.preventDefault();
      try{
      const response = await axios.post("http://localhost:8080/login",user)
      const userId = response.data.id
      const username = response.data.username
      const userImg = response.data.userimg
      
      localStorage.setItem("userId", userId);
      localStorage.setItem("username",username)
      localStorage.setItem('userimg', userImg)
      console.log(userImg)
      setTimeout(() => {
        setIslogin(false); // 1 秒后隐藏成功消息
        navigate(`/${username}/${userId}`) // 導向
      }, 1000);
      }catch(error){
        console.error("Login failed:", error)
        setIslogin(true)
        setTimeout(() => {
            setIslogin(false); // 1 秒后隐藏成功消息
            navigate("/") // 導向
          }, 1500);
      }
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
        
                            <h5 className="fw-normal mb-3 pb-3" style={{letterspacing: '1px'}}>Login User</h5>
        
                            <div className="form-outline mb-4">
                            <input type="text" id="form2Example17" className="form-control form-control-lg" 
                                name="username"
                                value={username}
                                onChange={(e) => onInputChange(e)} 
                                required/>
                            <label className="form-label" for="form2Example17">Email address</label>
                            </div>
        
                            <div className="form-outline mb-4">
                            <input type="password" id="form2Example27" className="form-control form-control-lg" 
                                value={password}
                                name="password"
                                onChange={(e) => onInputChange(e)} 
                                required/>
                            <label className="form-label" for="form2Example27">Password</label>
                            </div>
        
                            <div className="pt-1 d-grid gap-2">
                                <button className="btn btn-dark btn-lg btn-block" type="submit" >Login</button>
                            </div>

                            {islogin && (
                                <div className="modal show " tabIndex="-1" role="dialog" style={{ display: "block" }}>
                                <div className="modal-dialog modal-dialog-centered " role="document">
                                    <div className="modal-content bg-danger text-light">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Error</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        Invalid account or password!
                                    </div>
                                    </div>
                                </div>
                                </div>
                            )}

                            <div className="w-100 d-flex align-items-center justify-content-center py-2 position-relative">
                                <hr className="flex-grow-1"/>
                                <p className="m-0 px-3">or</p>
                                <hr className="flex-grow-1"/>
                            </div>

                                     
                            <a  href='/' className="w-100 text-dark my-2 bg-white border border-black-40 rounded-md p-2 text-center d-flex align-items-center justify-content-center text-decoration-none rounded mb-4">
                                <img className='mx-2' src={GOOGLE_ICON} alt="" style={{width:'5%'}} />
                                Sign In with Google
                            </a>
                                        
       
                            
                            <a className="small text-muted text-decoration-none" href="#!">Forgot password?</a>
                            <p className="mb-5 pb-lg-2 " style={{color: '#393f81'}}>Don't have an account? 
                            <a className='text-decoration-none mx-2' href="/signup" style={{color: '#393f81'}}>Signup here</a></p>
                            
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

export default Login


 // <div className='wrapper d-flex align-items-center justify-content-center w-100'>
        
    //     <div className='login'>
    //         <h2 className='text-center'>Login User</h2>
    //         <form className='needs-vaildation'>
    //             <div className='from-group was-validated mb-2'>
    //                 <label htmlFor='email' className='form-label'>Email</label>
    //                 <input type='email' className='form-control' required></input>
    //                 <div className='invalid-feedback'>
    //                     Please enter you email 
    //                 </div>
    //             </div>
    //             <div className='from-group was-validated mb-2'>
    //                 <label htmlFor='password' className='form-label'>password</label>
    //                 <input type='password' className='form-control' required></input>
    //                 <div className='invalid-feedback'>
    //                     Please enter you password 
    //                 </div>
    //             </div>
    //             <div className='from-group mb-2'>
    //                 <input type='checkbox' className='form-check-input'></input>
    //                 <label htmlFor='check' className='form-check-label'>Remember me</label>
    //             </div>

    //             <button type='sumbit' className='btn btn-success mt-2 w-100'>Login</button>
                
    //             <div className="w-100 d-flex align-items-center justify-content-center py-2 position-relative">
    //                 <hr className="flex-grow-1"/>
    //                 <p className="m-0 px-3">or</p>
    //                 <hr className="flex-grow-1"/>
    //             </div>

    //             <a  href='/' className="w-100 text-dark my-2 bg-white border border-black-40 rounded-md p-4 text-center d-flex align-items-center justify-content-center text-decoration-none rounded mb-4">
    //                 <img className='mx-2' src={GOOGLE_ICON} alt="" style={{width:'10%'}} />
    //                 Sign In with Google
    //             </a>

    //             <div className="w-100 d-flex align-items-center justify-content-center">
    //                 <p className="text-base font-normal text-dark ">Don't have an account? <span className='mx-2 '><a className='text-decoration-none text-dark' href="/">Sign up</a></span></p>
    //             </div>


    //         </form>
    //     </div>
    // </div>