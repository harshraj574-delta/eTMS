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

   //Get User Details
   GetLockDetails: async (params) => {
    try {
      const response = await api.post('/GetLockDetails', {
        facID: params.facID
      });    

      return JSON.parse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  


//get menu details
  Spr_GetMenuItem: async (credentials) => {
    try {
      const response = await api.post('/Spr_GetMenuItem', {
        UserName: credentials.userID
      });

      // Transform the data to ensure all required fields
      const menuItems = response.data.map(item => ({
        MenuId: item.MenuID,
        MenuName: item.Text,
        MenuURL: item.NavigateUrl || '#',
        ParentId: item.ParentID || 0,
        IconClass: item.Description || '',
        IsActive: true,//Boolean(item.IsActive),
        OrderNo: item.RowNo || 0,
        // Add any other fields your API returns
      }));


      return menuItems;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },


  GetSpocAssignedProcess: async (params) => {
    try {
      const response = await api.post('/GetSpocAssignedProcess', {
        empid: params.empid,
        type: params.type
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },


  GetBackupMgrId: async (params) => {
    try {
      const response = await api.post('/GetBackupMgrId', {
        backupmgrid: params.backupmgrid
      });
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  GetMgrSchedule: async (params) => {
    try {
      const response = await api.post('/GetMgrSchedule', {
        mgrid: params.mgrid,
        sdate: params.sdate
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  SelectFacilityByGroup: async (params) => {
    try {
      const response = await api.post('/SelectFacilityByGroup', {
        empid: params.empid
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  GetShiftsbyDays: async (params) => {
    try {
      const response = await api.post('/GetShiftsbyDays', {
        facilityid: params.facilityid,
        type: params.type,
        weekday: params.weekday,
        ProcessId: params.ProcessId,
      });
      return JSON.parse(response.data); 
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },

  GetMgrAssociate: async (params) => {
    try {
      const response = await api.post('/GetMgrAssociate', {
        mgrId: params.mgrId,
        ProcessId: params.ProcessId
      });
      return JSON.parse(response.data); 
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },


  ///Feedback pages

   //Get Feedback Data
   Spr_sprSelectFeedBack: async (credentials) => {
    try {
      const userId = credentials.userId || sessionStorage.getItem('ID');

      // Get date range from credentials or default to 1 year
      const endDate = credentials.endDate ? new Date(credentials.endDate) : new Date();
      const startDate = credentials.startDate ? new Date(credentials.startDate) : new Date();

      if (!credentials.startDate) {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Format dates as required by API (YYYY-MM-DD HH:mm:ss.SSS)
      const sDate = `${startDate.toISOString().split('T')[0]} 00:00:00.000`;
      const eDate = `${endDate.toISOString().split('T')[0]} 00:00:00.000`;

      const response = await api.post('/sprSelectFeedBack', {
        empid: userId,
        sDate: sDate,
        eDate: eDate
      });

      const formattedData = response.data.map(item => ({
        TicketNo: item.TicketNo || '',
        TypeName: item.TypeName || '',
        empCode: item.empCode || '',
        empName: item.empName || '',
        Desrp: item.Desrp || '',
        ActionBy: item.ActionBy || '',
        RouteId: item.RouteId || '',
        RaisedDate: item.RaisedDate || '',
        UpdatedAt: item.UpdatedAt || new Date().toISOString(),
        Status: item.Status || '',
        Enableds: item.Enableds || 0,
        ReOpenStatus: item.ReOpenStatus || 0,
        StatusText: item.StatusText || ''
      }));

      console.log("Formatted Response:", formattedData);
      return formattedData;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },
  //Get Feedback Status

  Spr_sprSelectReply: async (credentials) => {
    try {
      const response = await api.post('/sprSelectReply', {
        TicketNo: credentials.ticketNo
      });

      // Format the response data
      const formattedData = Array.isArray(response.data) ? response.data.map(item => ({
        TicketNo: item.TicketNo || '',
        empCode: item.empCode || '',
        empName: item.empName || '',
        Descp: item.Descp || '',
        UpdatedAt: item.UpdatedAt || new Date().toISOString(),
        Status: item.Status || '',
        StatusId: item.StatusId || 0
      })) : [];

      console.log('Reply Data:', formattedData);
      return formattedData;
    } catch (error) {
      console.error('API Error:', error);
      throw error.response?.data || error.message;
    }
  },



};