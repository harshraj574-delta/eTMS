import axios from "axios";
import { map } from "lodash";
// import { api } from "./axios/api";
const api = axios.create({
  baseURL: "/api/api/v1",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const apiService = {
  //Login Validation
  login: async (credentials) => {
    try {
      const response = await api.post("/GetPassword", {
        UserName: credentials.username,
        Password: credentials.password,
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get User Details
  Spr_GetuserId: async (credentials) => {
    try {
      const response = await api.post("/Spr_GetuserId", {
        UserName: credentials.username,
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },


  //Get User Details
  GetLockDetails: async (params) => {
    try {
      const response = await api.post("/GetLockDetails", {
        facID: params.facID,
      });

      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //get menu details
  Spr_GetMenuItem: async (credentials) => {
    try {
      const response = await api.post("/Spr_GetMenuItem", {
        UserName: credentials.userID,
      });

      // Transform the data to ensure all required fields
      const menuItems = response.data.map((item) => ({
        MenuId: item.MenuID,
        MenuName: item.Text,
        MenuURL: item.NavigateUrl || "#",
        ParentId: item.ParentID || 0,
        IconClass: item.Description || "",
        IsActive: true, //Boolean(item.IsActive),
        OrderNo: item.RowNo || 0,
        // Add any other fields your API returns
      }));

      return menuItems;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  GetSpocAssignedProcess: async (params) => {
    try {
      const response = await api.post("/GetSpocAssignedProcess", {
        empid: params.empid,
        type: params.type,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  GetBackupMgrId: async (params) => {
    try {
      const response = await api.post("/GetBackupMgrId", {
        backupmgrid: params.backupmgrid,
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  GetMgrSchedule: async (params) => {
    try {
      const response = await api.post("/GetMgrSchedule", {
        mgrid: params.mgrid,
        sdate: params.sdate,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  SelectFacilityByGroup: async (params) => {
    try {
      const response = await api.post("/SelectFacilityByGroup", {
        empid: params.empid,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  GetShiftsbyDays: async (params) => {
    try {
      const response = await api.post("/GetShiftsbyDays", {
        facilityid: params.facilityid,
        type: params.type,
        weekday: params.weekday,
        ProcessId: params.ProcessId,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  GetMgrAssociate: async (params) => {
    try {
      const response = await api.post("/GetMgrAssociate", {
        mgrId: params.mgrId,
        ProcessId: params.ProcessId,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  InsertNewSchedule: async (params) => {
    try {
      const response = await api.post("/InsertNewSchedule", {
        empID: String(params.empID),
        fromDate: String(params.fromDate),
        toDate: String(params.toDate),
        facilityIn: String(params.facilityIn),
        facilityOut: String(params.facilityOut),
        logIn: String(params.logIn),
        logOut: String(params.logOut),
        WeeklyOff: String(params.WeeklyOff),
        userID: String(params.userID),
        weekendlogin: String(params.weekendlogin),
        weekendlogout: String(params.weekendlogout),
        pickadflag: String(params.pickadflag),
        dropadflag: String(params.dropadflag),
      });

      if (response && response.data) {
        console.log("InsertNewSchedule:", response.data);
        return JSON.parse(response.data);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  GetOneEmployeeSchedule: async (params) => {
    try {
      const response = await api.post("/GetOneEmployeeSchedule", {
        empid: params.empid,
        sDate: params.sdate,
      });
      console.log("GetOneEmployeeSchedule:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  ///Feedback pages

  //Get Feedback Data
  Spr_sprSelectFeedBack: async (credentials) => {
    try {
      const userId = credentials.userId || sessionStorage.getItem("ID");

      // Get date range from credentials or default to 1 year
      const endDate = credentials.endDate
        ? new Date(credentials.endDate)
        : new Date();
      const startDate = credentials.startDate
        ? new Date(credentials.startDate)
        : new Date();

      if (!credentials.startDate) {
        startDate.setFullYear(endDate.getFullYear() - 1);
      }

      // Format dates as required by API (YYYY-MM-DD HH:mm:ss.SSS)
      const sDate = `${startDate.toISOString().split("T")[0]} 00:00:00.000`;
      const eDate = `${endDate.toISOString().split("T")[0]} 00:00:00.000`;

      const response = await api.post("/sprSelectFeedBack", {
        empid: userId,
        sDate: sDate,
        eDate: eDate,
      });

      const formattedData = response.data.map((item) => ({
        TicketNo: item.TicketNo || "",
        TypeName: item.TypeName || "",
        empCode: item.empCode || "",
        empName: item.empName || "",
        Desrp: item.Desrp || "",
        ActionBy: item.ActionBy || "",
        RouteId: item.RouteId || "",
        RaisedDate: item.RaisedDate || "",
        UpdatedAt: item.UpdatedAt || new Date().toISOString(),
        Status: item.Status || "",
        Enableds: item.Enableds || 0,
        ReOpenStatus: item.ReOpenStatus || 0,
        StatusText: item.StatusText || "",
      }));

      console.log("Formatted Response:", formattedData);
      return formattedData;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  //Get Feedback Status

  Spr_sprSelectReply: async (credentials) => {
    try {
      const response = await api.post("/sprSelectReply", {
        TicketNo: credentials.ticketNo,
      });

      // Format the response data
      const formattedData = Array.isArray(response.data)
        ? response.data.map((item) => ({
          TicketNo: item.TicketNo || "",
          empCode: item.empCode || "",
          empName: item.empName || "",
          Descp: item.Descp || "",
          UpdatedAt: item.UpdatedAt || new Date().toISOString(),
          Status: item.Status || "",
          StatusId: item.StatusId || 0,
        }))
        : [];

      console.log("Reply Data:", formattedData);
      return formattedData;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  //Get Feedback CategoryDropDown Data
  Spr_GetComplaintCategory: async (credentials) => {
    try {
      const response = await api.post("/GetComplaintCategory", {
        facID: credentials.facID,
      });
      const DropDown = Array.isArray(response.data)
        ? response.data.map((item) => ({
          id: item.id || 0,
          Category: item.Category || "",
        }))
        : [];
      console.log("Category DropDown Data:", DropDown);
      return DropDown;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  //Get Feedback TypeDropDown Data
  Spr_GetComplaintType: async (credentials) => {
    try {
      const response = await api.post("/GetComplaintType", {
        ComplaintCategoryID: credentials.ComplaintCategoryID,
      });
      const DropDown = Array.isArray(response.data)
        ? response.data.map((item) => ({
          id: item.id || 0,
          Category: item.Category || "",
          CompName: item.CompName || "",
          C_Type: item.C_Type || "",
          severity: item.severity || 0,
        }))
        : [];
      console.log("Type DropDown Data:", DropDown);
      return DropDown;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },
  sprInsertFeedBackDetails: async (credentials) => {
    try {
      const response = await api.post("/sprInsertFeedBackDetails", {
        ticketno: credentials.ticketNo,
        desc: credentials.desc,
        actionid: credentials.actionid,
        statusid: credentials.statusid,
        FeedTypeId: credentials.FeedTypeId,
        RaisedDate: credentials.RaisedDate,
        RaisedById: credentials.RaisedById,
        RouteId: credentials.RouteId,
      });
      console.log("Insert Feedback Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  Spr_sprInsertReopen: async (credentials) => {
    try {
      const response = await api.post("/sprInsertReopen", {
        ticketno: credentials.ticketNo,
        desc: credentials.desc,
        actionid: credentials.actionid,
        statusid: credentials.statusid,
      });
      console.log("Reopen Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Employee
  GetEmployee: async (params) => {
    try {
      const response = await api.post("/GetEmployee", {
        Userid: params.userID,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Employee List
  GetEmployeeList: async (params) => {
    try {
      const response = await api.post("/GetEmployeeList", {
        facilityid: params.facilityid,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Manager List
  GetManagerList: async (params) => {
    try {
      const response = await api.post("/GetManagerList", {
        empidname: params.empName,
      });
      console.log("GetManagerList:", response.data);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Input Employee Search
  EmpSearch: async (params) => {
    try {
      const response = await api.post("/EmpSearch", {
        locationid: params.locationid,
        empidname: params.empidname,
        IsAdmin: params.IsAdmin,
      });
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Process By Facility
  GetProcessByFacility: async (params) => {
    try {
      const response = await api.post("/GetProcessByFacility", {
        facilityid: params.facilityid,
      });
      //console.log("GetProcessByFacility:", response.data);
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Sub Process
  GetSubProcess: async (params) => {
    try {
      const response = await api.post("/GetSubProcess", {
        processid: params.processid,
      });
      //console.log("GetSubProcess--xx-->:", response.data);
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Get Geo City By RS
  locationid: async (params) => {
    try {
      const response = await api.post("/GetGeoCityByRS", {
        locationid: params.locationid,
      });
      //console.log("locationid--xx-->:", response.data);
      return JSON.parse(response.data);
    } catch (error) {
      console.error("API Error:", error);
      throw error.response?.data || error.message;
    }
  },

  //Select Facility
  // selectFacility: async (params) => {
  //   try {
  //     const response = await api.post("/SelectFacility", {
  //       Userid: params.Userid,
  //     });
  //     return JSON.parse(response.data);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     throw error.response?.data || error.message;
  //   }
  // },

  //Select All Facility
  // selectAllFacility: async (params) => {
  //   try {
  //     const response = await api.post("/SelectAllFacility", {
  //       Userid: params.Userid,
  //     });
  //     return JSON.parse(response.data);
  //   } catch (error) {
  //     console.error("API Error:", error);
  //     throw error.response?.data || error.message;
  //   }
  // },

// Deepak Kumar

SelectLocation: async (params) => {
  try {
    const response = await api.post("/SelectLocation", {
      Userid: params.Userid,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

InsertLocation: async (params) => {
  try {
    const response = await api.post("/InsertLocation", {
      locationname: params.locationname,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

UpdateLocation: async (params) => {
  try {
    const response = await api.post("/UpdateLocation", {
      locationname: params.locationname,
      id:params.id,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

// UpdateLocation: async (params) => {
//   try {
//     const response = await api.post("/UpdateLocation", {
//       locationname: params.locationname,
//       id:params.id,
//     });
//     return JSON.parse(response.data);
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error.response?.data || error.message;
//   }
// },

GetFacility: async (params) => {
  try {
    const response = await api.post("/GetFacility", {
      locationid: params.locationid,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

SelectAllFacility: async (params) => {
  try {
    const response = await api.post("/SelectAllFacility");
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

SelectFacility: async (params) => {
  try {
    const response = await api.post("/SelectFacility", {
      Userid: params.Userid,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},


InsertFacility: async (params) => {
  try {
    const response = await api.post("/InsertFacility", {
      facility: params.facility,
      geoX: params.geoX,
      geoY: params.geoY,
      tptEmail: params.tptEmail,
      tptContactNo: params.tptContactNo,
      locationId: params.locationId,
      locationName: params.locationName,
      ShiftInchargeMail: params.ShiftInchargeMail,
      SiteLeadMail: params.SiteLeadMail,
      CityLeadMail: params.CityLeadMail,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

UpdateFacility: async (params) => {
  try {
    const response = await api.post("/UpdateFacility", {
      facility: params.facility,
      geoX: params.geoX,
      geoY: params.geoY,
      tptEmail: params.tptEmail,
      tptContactNo: params.tptContactNo,
      Id: params.Id,
      locationId: params.locationId,
      locationName: params.locationName,
      ShiftInchargeMail: params.ShiftInchargeMail,
      SiteLeadMail: params.SiteLeadMail,
      CityLeadMail: params.CityLeadMail,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

GetLevelDetail: async (params) => {
  try {
    const response = await api.post("/GetLevelDetail", {
      locationid: params.locationid,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

AddLevelDetails: async (params) => {
  try {
    const response = await api.post("/AddLevelDetails", {
      ContactName: params.ContactName,
      ContactNo: params.ContactNo,
      Email: params.Email,
      LocationId: params.LocationId,
      Level: params.Level,
    });
    return JSON.parse(response.data);
  } catch (error) {
    console.error("API Error:", error);
    throw error.response?.data || error.message;
  }
},

};
