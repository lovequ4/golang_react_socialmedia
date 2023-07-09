import React,{useState,useEffect,useCallback} from 'react'
import { Navbar, Nav ,Container,NavDropdown,Button, Form, Modal,Row,Col} from 'react-bootstrap';
import {useParams } from 'react-router-dom'
import axios from 'axios';

const MyNavbar = ({ userPosts, setUserPosts }) =>{ 

  const ProfileImg = localStorage.getItem('userimg');

  //creat post use
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState('');
  const [image,setImage] = useState(null);

  //get user data
  const [userData, setUserData] = useState(null);
  const [showUserForm,setShowUserForm] = useState(false);
  const [statusForm,setStautusForm] = useState(false);
  
  const handleProfileClick = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/getuser/${userId}`); 
      const userData = response.data; 
      setUserData(userData);
      console.log(userData);
      setShowUserForm(true); 
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };
  

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userImg, setUserImg] = useState(null);
  
  const {userId}  = useParams();
  const username = localStorage.getItem('username')


  //load post
  const fetchPosts = useCallback(async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8080/posts/${userId}`);
      setUserPosts(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, [setUserPosts]);
  
  useEffect(() => {
    const fetchData = async () => {
      await fetchPosts(userId);
    };
    fetchData();
  }, [userId, fetchPosts]);
  
  
  //create post
  const handleSubmit =  async (e) => {
    e.preventDefault();
    
    // 執行發表貼文的相關操作（例如發送請求到後端）
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('content', content);
    formData.append('postimg', image);
    
  try {
    await axios.post('http://localhost:8080/addpost', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
      setShowForm(false); 
      fetchPosts(userId);
    } catch (error) {
      console.log(error);
    }
 
    // 重置表單狀態
    setContent('');
    setImage(null);
  };

   // 上傳圖片處理函數
   const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(file);
    setUserImg(file)
  };

  //updata user
  const handleUpdateUserSubmit = async(e) => {
    e.preventDefault();
 
    const formData = new FormData();
    formData.append('username', userName);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('userimg', userImg);
    
    try {
      await axios.patch(`http://localhost:8080/updateuser/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(formData)
      setUserName('');
      setPassword('');
      setEmail('');
      setUserImg(null);
      setStautusForm(true)
      setTimeout(() => {    
        setStautusForm(false); 
      }, 1000);        
     setShowUserForm(false);
    } catch (error) {
      console.log(formData)
      console.log(error);
    }
  };
  

  return (
    <>
    
    <Navbar collapseOnSelect expand="lg" className=" ">
      <Container>
      <Navbar.Toggle aria-controls="navbarNav" />
      <Navbar.Collapse id="navbarNav">
      
      <Nav className="mx-auto">
      <Nav.Link href={`/${username}/${userId}`} className="mx-1 d-none d-lg-inline">
        <i className="fas fa-home fa-lg" />
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-none d-lg-inline">
        <i className="fas fa-users fa-lg" />
      </Nav.Link>
      <Nav.Link  className="mx-1 d-none d-lg-inline" onClick={() => setShowForm(true)}>
        <i className="fas fa-plus-circle fa-lg" />
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-none d-lg-inline">
        <i className="fas fa-comments fa-lg" />
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-none d-lg-inline">
        <i className="fas fa-bell fa-lg" />
      </Nav.Link>

      <Nav.Link href="" className="mx-1 d-inline d-lg-none">
        Home
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-inline d-lg-none">
        Users
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-inline d-lg-none"  onClick={() => setShowForm(true)}>
        Add
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-inline d-lg-none">
        Comments
      </Nav.Link>
      <Nav.Link href="" className="mx-1 d-inline d-lg-none">
        Notifications
      </Nav.Link>
      </Nav>
      <Nav className="ml-auto">
        <Nav.Link href="" className="ml-auto">
          <NavDropdown title={<img src={`data:image/jpeg;base64,${ProfileImg}`}  className="rounded-circle" height="30" alt="" loading="lazy" />} id="basic-nav-dropdown" alignRight>
            <NavDropdown.Item href="" onClick={() => handleProfileClick()}>My Profile</NavDropdown.Item>
            <NavDropdown.Item href="">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav.Link>
      </Nav>
      </Navbar.Collapse>
      </Container>
    </Navbar>
    
     {/* create post */}
    <Modal show={showForm} onHide={() => setShowForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Create Post</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="content" className='mb-3'>
            <Form.Label>Content:</Form.Label>
            <Form.Control
              as="textarea"
              value={content}
              style={{ height: '300px', resize: 'vertical' }}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="image" className="mb-3">
            <Form.Label>Upload image:</Form.Label>
            <Form.Control type="file"  accept="image/*" name="postimg" onChange={handleImageUpload} />
          </Form.Group>

          <Row>
            <Col className="text-center d-grid gap-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>

        </Form>
      </Modal.Body>
      </Modal>

    {/* updata user */}
    <Modal show={showUserForm} onHide={() => setShowUserForm(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Updata User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      <Form onSubmit={handleUpdateUserSubmit}>
      
       
          <Form.Group controlId="username" className="mb-3">
            <Form.Label>UserName:</Form.Label>
            <Form.Control
              type="text"
              value={userName}
              name="username"
              placeholder={userData ? userData.username : ''}
              onChange={(e) => setUserName(e.target.value)}
              
            />
          </Form.Group>

          <Form.Group controlId="password" className="mb-3">
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              
            />
          </Form.Group>

          <Form.Group controlId="email" className="mb-3">
            <Form.Label>Email:</Form.Label>
            <Form.Control
              type="email"
              value={email}
              name="email"
              placeholder={userData ? userData.email : ''}
              onChange={(e) => setEmail(e.target.value)}
              
            />
          </Form.Group>

          <Form.Group controlId="userimg" className="mb-3">
            <Form.Label>Upload image:</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              
              name="userimg"
              onChange={handleImageUpload}
            />
          </Form.Group>

          <Row>
            <Col className="text-center d-grid gap-2">
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        
        </Form>
      </Modal.Body>
      </Modal>


      {statusForm && (
          <div className="modal show " tabIndex="-1" role="dialog" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered " role="document">
              <div className="modal-content text-primary">
              <div className="modal-header">
                  <h5 className="modal-title">Status</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  update success!
              </div>
              </div>
          </div>
          </div>
      )}
    </>
  )
}

export default MyNavbar


