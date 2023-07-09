import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';


const PostDetails = () => {

  const { postId } = useParams();
  const [post, setPost] = useState([]);

 

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/post/${postId}`);
        setPost(response.data);
        console.log(response.data)
      } catch (error) {
        console.error(error);
      }
    };

    fetchPostDetails();
  }, [postId]);

  return (
      <div>
      <div className="container text-center">
        <div className="row d-flex justify-content-center">
          
            {post.map((item) => (
              <div key={item.id} className="col-12 col-md-4  mb-4 mb-md-0 "> 
            
                <div className="image-container">
                  
                  <img
                    src={`data:image/jpeg;base64,${item.postimg}`}
                    alt=""
                    className="card-img img-thumbnail img-fluid rounded"
                    style={{height:'50vh',width:'40vh'}}                 
                  />
                </div>
          
              </div> 
            ))}
        </div>
      </div>
    </div>

 
  )
}



export default PostDetails
