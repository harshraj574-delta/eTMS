import React, { useState, useEffect } from "react";
import Sidebar from "../Master/SidebarMenu";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";
import Header from "../Master/Header";
import { apiService } from "../../services/api";
import sessionManager from "../../utils/SessionManager.js";
import { toastService } from '../../services/toastService';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const Location = () => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    fetchLocationData();
  }, []);

  const fetchLocationData = async () => {
    try {
      setLoading(true);
      const locationData = await apiService.SelectLocation({
        Userid: sessionManager.getUserSession().Userid,
      });
      console.log("Location Data:", locationData); // Add this line to log the location data t
      setLocationData(locationData);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toastService.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLocation = async () => {
    const locationName = newLocation.trim();
    if (!locationName) {
      toastService.warn('Please Enter Valid Location Name!!');
      return;
    }

    try {
      setLoading(true);
      const apiresponse = await apiService.InsertLocation({
        locationname: locationName,
      });

      if (apiresponse[0].result === 1) {
        toastService.success('Data Saved Successfully!!');
        setNewLocation('');
        await fetchLocationData();
      } else {
        toastService.warn('Location Name Already Exists!!');
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toastService.error("Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  const handleEditLocation = async () => {
    if (!selectedLocation || !selectedLocation.locationName.trim()) {
      toastService.warn('Please Enter Valid Location Name!!');
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.UpdateLocation({
        locationname: selectedLocation.locationName.trim(),
        id: selectedLocation.Id,
      });

      if (response[0].result === 1) {
        toastService.success('Location Updated Successfully!!');
        await fetchLocationData();
      } else {
        toastService.warn('Location Name Already Exists!!');
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toastService.error("Error updating location");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid p-0">
      <Header pageTitle="Location" showNewButton={true} onNewClick={() => {
        setNewLocation("");
      }} />
      <Sidebar />

      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Location <small>Allows to Add New Location.</small></h6>
          </div>
          <div className="col-lg-12">
            <div className="card_tb">
              {/* <table className="table" id="tbLocation">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Location Name</th>
                  </tr>
                </thead>
                <tbody>
                  {locationData.map((location) => (
                    <tr key={location.Id}>
                      <td>{location.Id}</td>
                      <td>
                        <a
                          href="#!"
                          className="btn-text"
                          data-bs-toggle="offcanvas"
                          data-bs-target="#LocationEdit"
                          aria-controls="offcanvasRight"
                          onClick={() => setSelectedLocation({
                            locationName: location.locationName,
                            Id: location.Id
                          })}
                        >
                          <span className="ms-3">{location.locationName}</span>
                        </a>
                      </td>
                      
                    </tr>
                  ))}
                </tbody>
              </table> */}

              <DataTable value={locationData}>
                  <Column field="Id" header="ID"></Column>
                  <Column header="Location Name" body={(ashpreet) => (
                    <a
                      href="#!"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#LocationEdit"
                      aria-controls="offcanvasRight"
                      onClick={() => setSelectedLocation({
                        locationName: ashpreet.locationName,
                        Id: ashpreet.Id
                      })}
                    >
                      <span className="ms-3">{ashpreet.locationName}</span>
                    </a>
                  )}></Column>
                </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* Add Location Offcanvas */}
      <div
        tabIndex="-1"
        className="offcanvas offcanvas-end"
        id="raise_Feedback"
        aria-labelledby="offcanvasRightLabel">
        <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 className="subtitle fw-normal">Add New Location</h5>
          <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div className="offcanvas-body">
          <div className="mb-3">
            <label htmlFor="locationName" className="form-label">Location Name</label>
            <input
              type="text"
              className="form-control"
              id="locationName"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter location name"
            />
          </div>
        </div>
        <div className="offcanvas-footer">
          <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
            Cancel
          </button>
          <button
            className="btn btn-success mx-3"
            onClick={handleSaveLocation}
            data-bs-dismiss="offcanvas">
            Save
          </button>
        </div>
      </div>

      {/* Edit Location Offcanvas */}
      <div
        className="offcanvas offcanvas-end"
        tabIndex="-1"
        id="LocationEdit"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
          <h5 className="subtitle fw-normal">Edit Location</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          {selectedLocation && (
            <div className="mb-3">
              <label htmlFor="editLocationName" className="form-label">Location Name</label>
              <input
                type="text"
                className="form-control"
                id="editLocationName"
                value={selectedLocation.locationName}
                onChange={(e) => setSelectedLocation({ ...selectedLocation, locationName: e.target.value })}
              />
            </div>
          )}
        </div>
        <div className="offcanvas-footer">
          <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
            Cancel
          </button>
          <button
            className="btn btn-success mx-3"
            onClick={handleEditLocation}
            data-bs-dismiss="offcanvas">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Location;