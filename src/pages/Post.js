import React, {useEffect, useState, useContext} from 'react'
import { useParams, useHistory} from 'react-router-dom'
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";

function Post() {
    let {id} = useParams();
    const [postObject, setPostObject] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("")
    const {authState} = useContext(AuthContext);

    let history = useHistory();

    useEffect(() => {
        axios.get(`https://first-website-swerra.herokuapp.com/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
      });
     
            axios.get(`https://first-website-swerra.herokuapp.com/comments/${id}`).then((response) => {
            setComments(response.data);
        });
    }, []);

    const addComment = () => {
        axios.post("https://first-website-swerra.herokuapp.com/comments", {commentBody: newComment, PostId: id},
        {//HEADER DEVE AVERE LO STESSO NOME CHE C'È NEL MIDDLEWARE ALL'INTERNO DI REQ.HEADER
            headers: {
                //È BENE USARE LA LOCAL STORAGE IN MODO TALE DA POTER PERMETTERE UN ACCESSO PERSISTENTE
                accessToken: localStorage.getItem("accessToken")
            }
        })
        .then((response) => {
            if (response.data.error) {
                console.log(response.data.error);
            } else {
                const commentToAdd = {commentBody: newComment, username: response.data.username};
                setComments([...comments, commentToAdd]);
                setNewComment("");
            }
        }); 
    }

    const deleteComment = (id) => {

        axios.delete(`https://first-website-swerra.herokuapp.com/comments/${id}`, {
            headers: {
                accessToken:localStorage.getItem("accessToken")
            },
        }).then(() => {
            setComments(comments.filter((val) => {
                return val.id != id;
            })
        )
    })
}

    //IMPORTANTE PASSARE COME PARAMETRO L'ACCESS TOKEN ALTRIMENTI È COME SE L'UTENTE NON FOSSE LOGGATO
    const deletePost = (id) => {
        axios.delete(`https://first-website-swerra.herokuapp.com/posts/${id}`, {
            headers: {
                accessToken:localStorage.getItem("accessToken")
            },
        }).then(() => {
            history.push("/");
        });
    }
    
    const editPost = (option) => { //PARAMETRO USATO PER DETERMINARE TITOLO O CORPO DEL POST
        if (option === "title") {
            let newTitle = prompt("Enter a new Title:");//DOPO LO SLASH VIENE MESSO /TITLE IN QUANTO NEL BACKEND
                                                        //È CHIAMATO IN QUESTO MODO
            axios.put("https://first-website-swerra.herokuapp.com/posts/title", {newTitle: newTitle, id: id,}, {headers: {
                accessToken: localStorage.getItem("accessToken")
            }})

            //IN QUESTO MODO MANTENIAMO GLI ATTRIBUTI DEL POSTOBJECT, TRANNE IL TITLE TRAMITE LO STATO
            setPostObject({...postObject, title: newTitle});

        } else {
            //MODIFICA CORPO
            let newPostText = prompt("Enter a New Text:");
            //LA VARIABILE È NEWTEXT POICHÈ NELLA ROUTE ABBIAMO CHIAMATO COSÌ LA NOSTRA VARIABILE
            axios.put("https://first-website-swerra.herokuapp.com/posts/postText", {newText: newPostText, id: id}, {headers: {
                accessToken:localStorage.getItem("accessToken")
            }})

            setPostObject({...postObject, postText: newPostText});
        }
    }


    return (
        <div className="postPage">
            <div className="leftSide">
            <div className="post" id="individual">
                <div className="title" onClick={() => {
                    if (authState.username === postObject.username)
                    {editPost("title")}}}>{postObject.title}</div>
                <div className="body" onClick={() => {
                    if (authState.username === postObject.username) {
                        editPost("body")}}}>{postObject.postText}</div>
                <div className="footer">{postObject.username}
                    {authState.username === postObject.username && 
                    (<button onClick={() => {deletePost(postObject.id)}}>
                        Delete Post</button>)}
                </div>
            </div>
            </div>
            <div className="rightSide">
            <div className="addCommentContainer">
                <input type="text" value={newComment} placeholder="Comment..." onChange={(event) => {setNewComment(event.target.value)}} />
                <button onClick={addComment}>Add Comment</button>
            </div>
            <div className="listOfComments">
                {comments.map((comment, key) => {
                    return (
                        <div key={key} className="comment">{comment.commentBody}
                        <label> Username: {comment.username}</label>
                        {authState.username === comment.username && <button onClick={() => {deleteComment(comment.id)}}>X</button>}
                        </div>
                    )
                })}
            </div>  
            </div>
        </div>
    )
}

export default Post
