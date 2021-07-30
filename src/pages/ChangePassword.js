import React, {useState} from 'react';
import axios from 'axios';



function ChangePassword() {

    const [oldPassword, setOldPassword] = useState("");
    const[newPassword, setNewPassword] = useState("");

    const changePassword = () => {
        //VIENE INSERITO /AUTH PERCHÈ LA RICHIESTA AXIOS SI TROVA ALL'INTERNO DELLA ROUTE USERS
        axios.put ("https://first-website-swerra.herokuapp.com/auth/changepassword", {
            oldPassword: oldPassword, newPassword: newPassword
        }, {headers: {
            accessToken:localStorage.getItem("accessToken")
        }}).then((response) => {
            if(response.data.error) {
                alert (response.data.error);
            }
        })
    }

    return (
        <div>
            <h1>Change your Password!</h1>
            <input type="text" placeholder="Old Password" onChange={(event) => {setOldPassword(event.target.value)}} />
            <input type="text" placeholder="New Password" onChange={(event) => {setNewPassword(event.target.value)}} /> 
            <button onClick={changePassword} >Confirm</button>           
        </div>
    )
}

export default ChangePassword
