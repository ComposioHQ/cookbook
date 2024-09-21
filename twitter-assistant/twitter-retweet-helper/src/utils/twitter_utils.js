import axios from 'axios';

const getUserDataByUsername = async (username) => {
  const token = "Bearer " + import.meta.env.VITE_TWITTER_TOKEN
  try {
    const response = await axios.get(`/twitter/2/users/by/username/${username}`, {
      params: {
        'user.fields': 'description,id,name,profile_image_url,username'
      },
      headers: {
        'Authorization': token
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export default getUserDataByUsername;
