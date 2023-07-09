import React,{useState,useEffect} from 'react'
import axios from 'axios';


function HeartIcon({ item }) {
  const [isLiked, setIsLiked] = useState(item.isLiked);
  const [likeCount, setLikeCount] = useState(item.like);

  useEffect(() => {
    const likedStatus = localStorage.getItem(`post_${item.postid}_liked`);
    if (likedStatus !== null) {
      setIsLiked(JSON.parse(likedStatus));
    }
  }, [item.postid]);

  const handleLikeClick = async (e) => {
    e.preventDefault();
    try {
      if (isLiked) {
        await axios.patch(`http://localhost:8080/postunlike/${item.postid}`);
        setIsLiked(false);
        setLikeCount(likeCount - 1);
      } else {
        await axios.patch(`http://localhost:8080/postlike/${item.postid}`);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
      }
      // save like status in local storage
      localStorage.setItem(`post_${item.postid}_liked`, JSON.stringify(!isLiked));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <i
        className={`fa-heart${isLiked ? ' fas' : ' far'} fa-lg mx-1 mt-2`}
        style={{ cursor: 'pointer', color: isLiked ? 'pink' : 'black' }}
        onClick={(e) => handleLikeClick(e)}
      />
      {likeCount}
    </>
  );
}

export default HeartIcon