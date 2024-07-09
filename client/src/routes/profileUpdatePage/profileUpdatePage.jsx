import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";

function ProfileUpdatePage() {
  const {updateUser, currentUser} = useContext(AuthContext);
  const [error, setError] = useState('');
  const [avatar, setAvatar] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      avatar: formData.get("avatar") || avatar
    };
    try{
      const res =  await apiRequest.put(`/users/${currentUser.id}`, data);
      updateUser(res.data)
      setError('')
      navigate('/profile')

    }catch(err){
      console.log(err)
      setError(err.response.data.message)
    }

  }
  return (
    <div className="profileUpdatePage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Update Profile</h1>
          <div className="item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              defaultValue={currentUser.username}
            />
          </div>
          <div className="item">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={currentUser.email}
            />
          </div>
          <div className="item">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" />
          </div>
          <button>Update</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
      <div className="sideContainer">
        <img  src={avatar[0] || currentUser.avata || "/noavatar.jpeg"} alt="" className="avatar"   
         />
         <UploadWidget uwConfig={{
          cloudName: "deyjfdexz",
          uploadPreset: "estate",
          multiple: false,
          maxImageFileSize: 2000000,
          folder: "avatars",
        }}
        setState={setAvatar}
        />
      </div>
    </div>
  );
}

export default ProfileUpdatePage;
