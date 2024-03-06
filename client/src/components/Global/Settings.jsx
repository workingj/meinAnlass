import "./Styles/settings.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/MyEventContext";
import validateForm from "../../validator/formvalidator.js";
import ChangePassword from "./ChangePassword.jsx";

function Settings() {
  const { userData ,images, setImages} = useAuth();
  const [data, setData] = useState({
    // firstName: "Issa",
    // lastName: "alali",
    // email: "issa@exp.com",
    // avater: "defaultAvatar.svg",
    // birthDate: "12/12/1990",
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    avater: userData.avatar,
    birthDate: userData.birthDate,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSave, setActiveSave] = useState(false);
  const [changePasswordPopup, setChangePasswordPopup] = useState(false);
  const [file, setFile] = useState(null);
  
  const [changImage, setChangImage] = useState(false);

  // fetch Images

  useEffect(() => {
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    axios
      .get(`${VITE_API_URL}/user/image/${userData._id}`)
      .then((res) => {
        console.log(res.data);
        setImages(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changImage]);

  // cancle button
  const handleCancel = (e) => {
    e.stopPropagation();
    setChangePasswordPopup(false);
  };

  // -------------------format date--------------
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  // -------------------handle button--------------

  const handleButton = (idName, span) => {
    const idInbox = document.getElementById(idName);
    const spanButton = document.getElementById(span);
    const savebtn = document.getElementById("save");
    const cancelbtn = document.getElementById("cancel");

    setActiveSave(true);

    if (isEditMode) {
      idInbox.readOnly = true;
      idInbox.style.backgroundColor = "lightgray";
      spanButton.innerHTML = "Edit";
      setIsEditMode(false);
      // savebtn.style.display = "visible";
      // cancelbtn.style.display = "visible";
    } else {
      idInbox.readOnly = false;
      idInbox.disabled = false;
      idInbox.focus();
      spanButton.innerHTML = "Save";
      idInbox.style.backgroundColor = "white";
      setIsEditMode(true);
    }
  };
  // -------------------avatar change--------------
  const handleAvatarChange = (e) => {
    e.preventDefault();
   
    if (!file) {
      alert("please select an image to upload");
    }

    const formData = new FormData();
    formData.append("image", file);
    const VITE_API_URL = import.meta.env.VITE_API_URL;
    console.log("file: ", file);
    try {
      axios
        .put(`${VITE_API_URL}/user/upload/${userData._id}`, formData)
        .then((res) => {
          console.log(res);
          setChangImage(!changImage)
          toast.success("Avatar updated successfully");
        })
        .catch((err) => {
          console.log(err);
          toast.error("Avatar not updated");
        });
    } catch (error) {
      console.log(error);
    }
  };

  // -------------------form submit--------------
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      toast.error("Please save  the changes");
      return;
    }
    const newErrors = validateForm(data);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0)
      toast.error(
        Object.values(newErrors)
          .map((value) => value)
          .join(" ")
      );
    else {
      const VITE_API_URL = import.meta.env.VITE_API_URL;

      try {
        axios
          .put(`${VITE_API_URL}/user/${userData._id}`, data)
          .then((res) => {
            console.log(res);

            toast.success("Profile updated successfully");
          })
          .catch((err) => {
            console.log(err);
            toast.error("Profile not updated");
          });
      } catch (error) {
        console.log(error);
      }

      console.log("Form submitted:", data);
    }
  };

  return (
    <div className="settings">
      <h2>Settings your Profile</h2>
      <div>
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className=" formsitting
       "
        >
          <div>
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={data.firstName}
              className={`border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 m-2 w-72 bg-gray-100`}
              onChange={(e) => {
                setData({ ...data, firstName: e.target.value });
              }}
              readOnly
              disabled
            />

            {/* edit button */}
            <span
              id="span-first-name"
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              onClick={() => handleButton("firstName", "span-first-name")}
            >
              Edit
            </span>
            <br />
            <span className="text-red-500">{errors.firstName}</span>
          </div>
          <br />
          <div>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={data.lastName}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, lastName: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-last-name"
              onClick={() => handleButton("lastName", "span-last-name")}
            >
              Edit
            </span>
            <br />
            <span className="text-red-500">{errors.lastName}</span>
          </div>

          <br />
          <div>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={data.email}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, email: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-email"
              onClick={() => handleButton("email", "span-email")}
            >
              Edit
            </span>
            <br />
            <span className="text-red-500">{errors.email}</span>
          </div>
          <br />
          <div>
            <label htmlFor="birthDate">birthDate</label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formatDate(data.birthDate)}
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100"
              onChange={(e) => setData({ ...data, birthDate: e.target.value })}
              readOnly
              disabled
            />
            <span
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              id="span-birthDate"
              onClick={() => handleButton("birthDate", "span-birthDate")}
            >
              Edit
            </span>
            <br />
            <span className="text-red-500">{errors.birthDate}</span>
          </div>
          <br />
          
          <div>
            <label htmlFor="avater">Avater</label>
            <input
              type="file"
              id="avater"
              name="avater"
              className="border border-gray-300 rounded-md p-2 m-2  w-72 bg-gray-100 
              
              "
              
              onChange={(e) => 
                setFile(e.target.files[0])
                }
            />
           
            <span className="text-red-500">{errors.avater}</span>
            <button
            onClick={(e) => handleAvatarChange(e)}
              type="submit"
              className="bg-blue-500 text-white text-sm rounded-md
            border-solid border-2 border-blue-500 py-1 px-1 hover:bg-blue-800 transition duration-300 font-oleo font-bold py-1 px-2"
            >
              Upload
            </button>
          </div>
          <br />
          <div>
            <a
              className="btn-left my-2 hover:bg-blue-200 text-blue-500 cursor-pointer"
              onClick={() => setChangePasswordPopup(true)}
            >
              Change Password
            </a>
          </div>
          <br />
          <div
            className="flex justify-center gap-4 m-4  
          "
          >
            <button
              id="save"
              type="submit"
              className="bg-blue-500 text-white text-sm rounded-md 
            border-solid border-2 border-blue-500 py-1 px-1 hover:bg-blue-800 transition duration-300 font-oleo font-bold py-1 px-2"
              disabled={!activeSave}
            >
              Save
            </button>
            <button
              id="cancel"
              type="reset"
              className="bg-red-500 text-white text-sm rounded-md 
            border-solid border-2 border-red-500 py-1 px-1 hover:bg-red-800 transition duration-300 font-oleo font-bold py-1 px-2 mr-4"
              onClick={() =>
                setData({
                  firstName: userData.firstName,
                  lastName: userData.lastName,
                  email: userData.email,
                  avater: userData.avatar,
                  birthDate: userData.birthDate,
                })
              }
            >
              Cancel
            </button>
          </div>
        </form>
       
      </div>
      {changePasswordPopup && (
        <ChangePassword
          handleCancel={handleCancel}
          setChangePasswordPopup={setChangePasswordPopup}
        />
      )}
    </div>
  );
}

export default Settings;
