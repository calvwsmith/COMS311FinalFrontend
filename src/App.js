import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Card, Container, Row, Col, Button, Badge, Form } from 'react-bootstrap';

import "../node_modules/bootstrap/dist/css/bootstrap.css";

/*
    Author: Calvin Smith
    ISU Netid : calsmith@iastate.edu
    Date :  5/02/2024
*/

function App() {
  const [view, setView] = useState(0);
  const [previousView, setPreviousView] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [mediaType, setMediaType] = useState(0);
  const [media, setMedia] = useState({});
  const [user, setUser] = useState({});

  //Helper Function
  const karma = (id, isLike) => {
    var sned = {
      id: id,
      lik: isLike
    }
    fetch(`http://localhost:8081/karma`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: `${JSON.stringify(sned)}`})
      .then(response => {if (!response.ok){ throw new Error("bad loging response")} else return response})
  }

  //Nav Bar
  const Nav = () => {

    const Account = () => {
      if (loggedIn){
        return (<div>
          <ul class="navbar-nav ml-auto"> 
            <li class="nav-item">
              <button onClick={() => {setView(4)}} class="nav-link">Profile</button>
            </li>
          </ul>
        </div>);
      }
      else {
        return (<div>
          <ul class="navbar-nav ml-auto"> 
            <li class="nav-item">
              <button onClick={() => {setView(2)}} class="nav-link">Log In</button>
            </li>
            <li class="nav-item">
              <button onClick={() => {setView(3)}} class="nav-link">Sign Up</button>
            </li>
          </ul>
        </div>);
      }
    }

    return (<div>
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                  <button onClick={() => {setView(0)}} class="nav-link">Linkt</button>
                </li>
            </ul>
            <ul class="navbar-nav mx-auto">
                <li class="nav-item">
                  <button onClick={() => {setView(1); setMediaType(0)}} class="nav-link">Image</button>
                </li>
                <li class="nav-item">
                  <button onClick={() => {setView(1); setMediaType(1)}} class="nav-link">Video</button>
                </li>
                <li class="nav-item">
                  <button onClick={() => {setView(1); setMediaType(2)}} class="nav-link">Audio</button>
                </li>
            </ul>
            <Account />
        </div>
      </nav>
    </div>);
  }
  
  //view 0
  const Linkt = () => {

    return (<div>
      <h1>Info</h1>
        <br></br>
        <h6>Created For:</h6>
          <h4>SE/ComS319 Construction of User Interfaces, Spring 2024</h4>
        <br></br>
        <h6>Date:</h6>
          <h4>5/2/2024</h4>
        <br></br>
        <h6>Creator</h6>
          <h4>Calvin Smith</h4>
          <h4>calsmith@iastate.edu</h4>
        <br></br>
        <h6>Instructors</h6>
          <h4>Dr. Abraham N. Aldaco Gastelum : aaldaco@iastate.edu</h4>
          <h4>Dr. Ali Jannesari : jannesar@iastate.edu</h4>
    </div>);
  }

  //view 1
  const Media = () => {
    const [searchInput, setSearchInput] = useState("");
    const [items, setItems] = useState([]);
    const [searchKey, setSearchKey] = useState('');

    const fetchData = async () => {
      try {
        setSearchKey('title');
        const response = await fetch(`http://localhost:8081/${mediaType}`);
        const jsonData = await response.json();
        setItems(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    useEffect(() => {
      fetchData();
    }, []);

    const handleChange = (e) => {
      e.preventDefault();
      setSearchInput(e.target.value);
    }

    function Album({els}){
      return (
        <Container>
            <Row xs={1} sm={2} md={3} lg={4} xl={5}>
                {(els.filter((item) => {return item[searchKey].match(searchInput)})).map(album => (
                    <Col key={Number(album.likes)}>
                        <Card style={{ width: '14rem' }}>
                            <Card.Img variant="top" src={album.imageurl} />
                            <Card.Body>
                                <Card.Title>{album.title}</Card.Title>
                                <div class="container">
                                  <div class="row">
                                      <div class="col-md-6">
                                          <button type="button" class="btn btn-primary" onClick={() => karma(album.id, true)}>Like <span class="badge badge-light">{album.likes}</span></button>
                                      </div>
                                      <div class="col-md-6">
                                          <button type="button" class="btn btn-secondary" onClick={() => karma(album.id, false)}>Dislike <span class="badge badge-light">{album.dislikes}</span></button>
                                      </div>
                                  </div>
                                  <div class="row mt-3">
                                    <div class="col-md-12">
                                        <button type="button" class="btn btn-primary btn-block" onClick={() => {setMedia(album); setPreviousView(view); setView(5)}}>View and Comment</button>
                                    </div>
                                  </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
      )
    }

    const handleSearchKeyChange = (dat) => {
      setSearchKey(dat.target.value);
    }

    const images = {
      0: "https://i.imgur.com/1G2Kkzz.png",
      1: "https://i.imgur.com/SQjBPtM.png",
      2: "https://i.imgur.com/jYuqVHP.png",
    };

    return (<div>
      <Container fluid>
      <img src={images[mediaType]} className="img-fluid border border-dark" alt="Media" />
      </Container>
      <br></br>
      <div className="d-flex">
        <span className="p-3">Search By:  </span>
        <select value={searchKey} onChange={handleSearchKeyChange} className="form-control" id="exampleSelect" style={{ maxWidth: '200px' }}>
          <option value="title">Title</option>
          <option value="description">Description</option>
          <option value="link">Link</option>
          <option value="author">Author</option>
        </select>
      </div>
      <br></br>
      <input autoFocus type="search" id="form1" class="form-control" placeholder="Search" onChange={handleChange} value={searchInput} />
      <Album els={items} />
    </div>);
  }

  //view 2
  const LogIn = () => {
    const {register, handleSubmit, formState: { errors }, } = useForm();
    const [failure, setFailure] = useState(true);

    const onSubmit = userData => {
      fetch('http://localhost:8081/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: `${JSON.stringify(userData)}`})
      .then(response => {if (!response.ok){ throw new Error("bad loging response")} else return response.json()})
      .then(data => {setLoggedIn(data); setFailure(data); setUser(userData); if (data) setView(4)});
      
    }

    return (<div>
      <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
      <h3>Log In</h3>
      <div className="form-group">
        <input {...register("username", { required: true })} placeholder="Username" className="form-control" />
      </div>
      <div className="form-group">
        <input {...register("password", { required: true })} placeholder="Password" className="form-control" />
      </div>
      <div class="col">
        <button type="submit" className="btn btn-primary">Lets Go!</button>
      </div>
      </form>
      {failure ? null : <div class="text-danger">Invalid Username or Password</div>}
    </div>);
  }

  //view 3
  const SignUp = () => {
    const {register, handleSubmit, formState: { errors }, } = useForm();
    const [badInfo, setBadInfo] = useState(false);

    const onSubmit = userData => {
      fetch('http://localhost:8081/signup', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: `${JSON.stringify(userData)}`})
      .then(response => {if (!response.ok){ throw new Error("bad loging response")} else return response.json()})
      .then(data => {setBadInfo(data)})
    }

    return (<div>
      <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
      <h3>Sign Up</h3>
      <div className="form-group">
        <input {...register("username", { required: true })} placeholder="Username" className="form-control" />
      </div>
      <div className="form-group">
        <input {...register("password", { required: true })} placeholder="Password" className="form-control" />
      </div>
      <div className="form-group">
        <input {...register("confirmPass", { required: true })} placeholder="Confirm Password" className="form-control" />
      </div>
      <div class="col">
        <button type="submit" className="btn btn-primary">Lets Go!</button>
      </div>
      </form>
      {badInfo ? <div class="text-danger">Username Taken</div> : null}
    </div>);
  }

  //view 4
  const Profile = () => {
    const {register, handleSubmit, formState: {errors}} = useForm();
    const [els, setItems] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:8081/`);
          const jsonData = await response.json();
          setItems(jsonData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
      fetchData();
    }, []);

    const del = async (id) => {
      await fetch(`http://localhost:8081/${id}`, {method: "DELETE"});
    }

    const logout = () => {
      setLoggedIn(false);
      setUser({});
      setView(2);
    }

    const onSubmit = async data => {
      const newPost = {
        imageurl: data.imageurl,
        title: data.title,
        link: data.link,
        likes: 0,
        dislikes: 0,
        comments: [],
        description: data.description,
        type: Number(data.type),
        author: user.username
      }
      console.log(newPost);
      fetch(`http://localhost:8081/post`,
      {method: "POST", headers: {'Content-Type': 'application/json'}, body: `${JSON.stringify(newPost)}`});
    }

    return (<div>
      <h1>{user.username}</h1>
      <Card>
        <Card.Body>
          <Card.Title>Create Post</Card.Title>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group controlId="imageurl">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" placeholder="Enter image URL" {...register("imageurl")} />
            </Form.Group>

            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Enter title" {...register("title")} />
            </Form.Group>

            <Form.Group controlId="link">
              <Form.Label>Link</Form.Label>
              <Form.Control type="text" placeholder="Enter link" {...register("link")} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" placeholder="Enter description" {...register("description")} />
            </Form.Group>

            <Form.Group controlId="type">
              <Form.Label>Type</Form.Label>
              <Form.Control as="select" {...register("type")}>
                <option value={0}>Image</option>
                <option value={1}>Video</option>
                <option value={2}>Audio</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">Submit</Button>
          </Form>
        </Card.Body>
      </Card>
      <Container>
        <Row xs={1} sm={2} md={3} lg={4} xl={5}>
          {(els.filter((item) => {return item.author.match(user.username)})).map(album => (
            <Col key={Number(album.likes)}>
              <Card style={{ width: '14rem' }}>
                <Card.Img variant="top" src={album.imageurl} />
                <Card.Body>
                  <Card.Title>{album.title}</Card.Title>
                  <div class="container">
                    <div class="row">
                      <div class="col-md-6">
                        <button type="button" class="btn btn-primary" onClick={() => karma(album.id, true)}>Like <span class="badge badge-light">{album.likes}</span></button>
                      </div>
                      <div class="col-md-6">
                        <button type="button" class="btn btn-secondary" onClick={() => karma(album.id, false)}>Dislike <span class="badge badge-light">{album.dislikes}</span></button>
                      </div>
                    </div>
                    <div class="row mt-3">
                      <div class="col-md-12">
                        <button type="button" class="btn btn-primary btn-block" onClick={() => {setMedia(album); setPreviousView(view); setView(5)}}>View and Comment</button>
                      </div>
                    </div>
                  </div>
                </Card.Body>
                <div class="col-md-6">
                  <button type="button" class="btn btn-danger" onClick={() => {del(album.id)}}>Delete</button>
                </div>
              </Card>
            </Col>

          ))}
        </Row>
      </Container>
      <Card style={{ width: '20rem' }}>
        <Card.Body>
        <button type="button" class="btn btn-danger" onClick={() => logout()}>Log Out</button>
        
        </Card.Body>
        
      </Card>
    </div>);
  }

  //view 5
  const PostView = () => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      const sneder = {
        id: media.id,
        comment: comment
      }
      await fetch(`http://localhost:8081/comment`, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(sneder)})
      setComment('');
    }

    return (<div>
      <Button onClick={async () => setView(previousView)}>Return</Button>
      <Card>
      <Card.Img variant="top" src={media.imageurl} />
        <Card.Body>
            <Card.Title>{media.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Link: <a href={media.link}>{media.link}</a></Card.Subtitle>
            <Card.Text>Description: {media.description}</Card.Text>
            <Card.Footer>
              <Button variant="primary" className="mr-2" onClick={() => {karma(media.id, true)}}>
                  Like <Badge variant="light">{media.likes}</Badge>
              </Button>
              <Button variant="secondary" onClick={() => {karma(media.id, false)}}>
                  Dislike <Badge >{media.dislikes}</Badge>
              </Button>
            </Card.Footer>
          </Card.Body>
          <Card.Header>Comments:</Card.Header>
          <Container>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="commentForm">
                <Form.Control 
                  type="text" 
                  placeholder="put nice words here" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Submit
              </Button>
            </Form>
          </Container>
            {media.comments.map(els => (
              <Card.Text>{els}</Card.Text>
            ))}
        </Card>
    </div>);
  }

  return (<div className="App">
      <Nav />
      <br></br>
      <div className="p-3">
      {({
        0: <Linkt />,
        1: <Media />,
        2: <LogIn />,
        3: <SignUp />,
        4: <Profile />,
        5: <PostView />
      }) [view]}
    </div>
  </div>);
}

export default App;
