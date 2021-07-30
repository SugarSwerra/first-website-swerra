import React, {useContext} from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {AuthContext} from "../helpers/AuthContext";


function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const {authState} = useContext(AuthContext);
  let history = useHistory();

  useEffect(() => {

    //NEL CASO IN CUI L'UTENTE NON SIA LOGGATO E TENTA DI ACCEDERE ALL'HOMEPAGE
    //VIENE AUTOMATICAMENTE REINDIRIZZATO ALLA PAGINA DI LOGIN
    if (!localStorage.getItem("accessToken")) {
      history.push("/login");
    } else {
    axios.get("https://first-website-swerra.herokuapp.com/posts", {headers:
    {accessToken: localStorage.getItem("accessToken")}
  }).then((response) => {
      setListOfPosts(response.data.listOfPosts);
      //IN QUESTO MODO VENGONO RICHIESTI TUTTI GLI ID DEI POST A CUI UN UTENTE HA MESSO LIKE
      setLikedPosts(response.data.likedPosts.map((like) => {
        return like.PostId;
      }));
    });
    }
  }, []);

  const likeAPost = (postId) => {
    axios.post("https://first-website-swerra.herokuapp.com/likes", {PostId: postId}, {headers:
    {accessToken: localStorage.getItem("accessToken")}
  }).then((response) => {
    setListOfPosts(listOfPosts.map((post) => {
      if (post.id === postId) {
        if (response.data.liked) { //SE QUANDO IL TASTO LIKE VIENE CLICCATO È IMPOSTATO SU FALSE
          return (
            {...post, Likes: [...post.Likes, 0]} //SICCOME IL NUMERO TOTALE DI LIKE VIENE CONTANTO CON LA
          )                                     //LUNGHEZZA DI ARRAY, NON IMPORTA IL TIPO DI OGGETTO 
        } else { //ALTRIMENTI SE È IMPOSTATO SU TRUE, IL NUMERO DI LIKE VIENE DECREMENTATO
          const likeArray = post.Likes
          likeArray.pop() //VIENE RIMOSSO L'ULTIMO ELEMENTO DELLA LISTA DI LIKE
          return (
            {...post, Likes: likeArray}
          )
        }
      } else {
        return post; //TUTTI GLI ALTRI POST VENGONO MOSTRATI COME PRIMA
      }
    }))

    if (likedPosts.includes(postId)) {
      setLikedPosts(likedPosts.filter((id) => { //QUELLO CHE VIENE FATTO È INDIVIDUARE IL POST CON QUELL'ID
        return id != postId;                // E VIENE RESTITUITO L'ARRAY SENZA L'ELEMENTO CHE ABBIA QUELL'ID
      }));
    } else {
      //AGGIUNGIAMO IL NUOVO POSTID ALL'ARRAY
      setLikedPosts([...likedPosts, postId]);
    }
  })
  };

  return (
    <div>
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
            <div className="footer">
              <div className="username"><Link to={`/profile/${value.UserId}`}>{value.username}</Link></div>
            <div className="buttons">
              <ThumbUpAltIcon onClick={() => {likeAPost(value.id)}} className={likedPosts.includes(value.id) ?
              "unlikeBttn" : "likeBttn"} />
            </div>
              <label>{value.Likes.length}</label>
            </div>
          </div>
        );
      })}
    </div>
  );
}

//LA FUNZIONE INCLUDES() CONTROLLA SE UN DETERMINATO OGGETTO SI TROVA ALL'INTERNO DI UNO SPECIFICO ARRAY

export default Home;