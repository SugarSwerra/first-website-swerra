import React, {useState, useContext} from 'react'
import axios from 'axios';
import {useHistory} from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setAuthState} = useContext(AuthContext);

    let history = useHistory();

    const login = () => {
        const data = {username: username, password: password};
        axios.post("http://localhost:3001/auth/login", data).then((response) => {
            //NEL CASO IN CUI SI VERIFICA UN ERRORE VERRÀ GENERATO UN ALERT
            if (response.data.error){
                alert(response.data.error);
            }
            else { //CHIAVE, VALORE
                //USARE COSTRUTTO IF ELSE ALTRIMENTI IL TOKEN VIENE CREATO IN OGNI CASO
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({username: response.data.username, id: response.data.id, status: true});
                history.push("/");
            }
        });

        }

        return (
            <div className="loginContainer">
                <label>Email</label>
                <input type="text" placeholder="example@gmail.com" onChange={(event) => {
                    setUsername(event.target.value);
                }} />
                <label>Password</label>
                <input type="password" placeholder="123456" onChange={(event) => {
                    setPassword(event.target.value);
                }} />
    
                <button onClick={login}>Login</button>
            </div>
        )
    };



export default Login
