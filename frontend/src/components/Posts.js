import React,{useState,useEffect} from 'react'
import './Posts.css'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import Navbar from './Navbar';
import HeartIcon from './HeartIcon';

const Posts = () => {
    
    const [userPosts,setuserPosts] = useState([])
    const {userId}  = useParams();
    const [comment,setComment] = useState('')

    const fetchPosts = async (userId) => {
      try {
        const res = await axios.get(`http://localhost:8080/posts/${userId}`);
        setuserPosts(res.data);
        console.log(res.data);
      } catch (error) {
        console.log(error);
      }
    };
   
    useEffect(() => {
      const fetchData = async () => {
        fetchPosts(userId);
      };
      fetchData();
    }, [userId]);

    //click comment
    const handleCommentSubmit = async(e,item) => {
      e.preventDefault();
      const userId = parseInt(localStorage.getItem('userId'));
      const username = localStorage.getItem('username');
      const postId = item.postid

      const commentData = {
        userId: userId,
        username: username,
        comment: comment
      };
   
      try {
        await axios.post(`http://localhost:8080/comments/${postId}`,commentData)
        setComment('')
        fetchPosts(userId); 
      } catch (error) {
        console.log(error)
      }
    };
    

  return (
  <>
    <Navbar userPosts={userPosts} setUserPosts={setuserPosts} />
    
    <div>
      <div className="container text-">
        <div className=""> 
        {/* className="row d-flex justify-content-center" */}
           
            
        {userPosts && userPosts.length > 0 ? (
            userPosts.map((item) => (
            <div key={item.postid} className="card mb-3">
              
              <img 
                src={`data:image/jpeg;base64,${item.postImg}`}
                className="card-img-top" 
                alt=""
                />
                
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="card-title">
                    <img className="rounded-circle mx-1" 
                          height="30" 
                          loading="lazy"  
                          src={`data:image/jpeg;base64,${item.user.userImg}`} 
                          alt=''/>
                    {item.user.name}</h5>
                  <p className="card-text text-muted small">{item.Create_time}</p>
                </div>
                <p className="card-text">{item.content}</p>
                
                <p> 
                  <HeartIcon  item={item}/>
                </p>
                
                <div className="border rounded p-2 mb-2 " style={{ maxHeight: "200px", overflowY: "auto"  }}>
                {item.comments && item.comments.length > 0 ? (
                    item.comments.map((comment, index) => (
                      <div key={comment.id} className='comments'>
                         <p>
                          {comment.username}: {comment.comment}
                          <small className="comment-time" style={{ float: "right" }}>
                            {comment.CreatedAt}
                          </small>
                        </p>
                        
                        {index !== item.comments.length - 1 && <hr className="my-2" />}
                      </div>
                    ))
                  ) : (
                    <p className="text-muted">No Comment</p>
                  )}
                </div>

              </div>
              <form onSubmit={(e) => handleCommentSubmit(e, item)}>
                <div className="input-group mb-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="submit"
                    id="button-addon2"
                  >
                    Submit
                  </button>
                </div>
              </form>
              
            </div>
            ))
            )  : (
              <div className="card mb-3">
                <div className="card-body">
                  <p className="text-muted text-center">No Post</p>
                </div>
              </div>
            )}    
              
        </div>
      </div>
    </div>

                {/* {userPosts.map((item) => (
              <div key={item.id} className="col-12 col-md-4  mb-4 mb-md-0 "> 
             
                <div className="image-container">
                  
                  <img
                    src={`data:image/jpeg;base64,${item.postimg}`}
                    alt=""
                    className="card-img img-thumbnail img-fluid rounded"
                    style={{height:'50vh',width:'40vh'}}
                    onClick={() => handleImageClick(item)}
                    
                  />
                </div>
           
              </div> 
            ))}
             */}
    </>
  )
}

export default Posts