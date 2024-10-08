import axios from 'axios';
import { auth } from '../config/firebase';

const getUserDataByUsername = async (username) => {
  try {
    const idToken = await auth.currentUser.getIdToken(true);
    const token = "Bearer " + idToken;
    const getUserTwitterDataURL = import.meta.env.VITE_BACKEND_URL + "/getusertwitterdata"
    const response = await axios.post(getUserTwitterDataURL, {
      username: username
    }, {
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        return { error: "Username not found." };
      } else if (error.response.status === 429) {
        return { error: "Too many requests. Please try again later." };
      } else {
        return { error: `HTTP error occurred: ${error.response.data.error}` };
      }
    } else {
      return { error: 'An error occurred while fetching user data.' };
    }
  }
};

export default getUserDataByUsername;
