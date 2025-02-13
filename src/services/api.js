import axios from 'axios';

const api = axios.create({
  baseURL: '/api/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const apiService = {
    //Login Validation
  login: async (credentials) => {
    try {
      const response = await api.post('/GetPassword', {
        UserName: credentials.username,
        Password: credentials.password
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },
 
 //Get User Details
  Spr_GetuserId: async (credentials) => {
    try {
      const response = await api.post('/Spr_GetuserId', {
        UserName: credentials.username
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  //get menu details
  Spr_GetMenuItem: async (credentials) => {
    try {
      const response = await api.post('/Spr_GetMenuItem', {
        UserName: credentials.username
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

};