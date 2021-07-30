import React, {useContext, useEffect, useState} from 'react'
import {useParams, useHistory} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";

function Profile() {

    //RAPPRESENTA IL NUMERO CHE VIENE PASSATO DOPO PROFILE {PROFILE/:ID}
    let {id} = useParams();
    const [username, setUsername] = useState("");
    const [listOfPosts, setListOfPosts] = useState([]);
    const {authState} = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        axios.get (`https://first-website-swerra.herokuapp.com/auth/basicinfo/${id}`).then((response) => {
            setUsername(response.data.username);
        });

        axios.get(`https://first-website-swerra.herokuapp.com/posts/byuserId/${id}`).then((response) => {
        setListOfPosts(response.data);
    })
    }, [])

    return (
        <div className="profilePageContainer">
            <div className="basicInfo">
                <h1>Username:{username}</h1>
                {authState.username === username && (
                <button onClick={() => {history.push("/changepassword")}}>Change Password</button>)}
            </div>
            <div className="listOfPost">
            {listOfPosts.map((value, key) => {
        return (
          <div
            key={key}
            className="post"
          >
            <div className="title"> {value.title} </div>
            <div className="body" onClick={() => {
              history.push(`/post/${value.id}`);
            }}>{value.postText}</div>
            <div className="footer">{value.username}
            <div className="buttons">
            <label>{value.Likes.length}</label>
            </div>
            </div>
          </div>
        );
      })}
            </div>
        </div>
    )
}

export default Profile
