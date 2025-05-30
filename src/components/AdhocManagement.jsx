import React, { useState, useEffect } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component
import { Col } from "react-bootstrap";
import { SelectButton } from "primereact/selectbutton";
import AdhocmanagementService from "../services/compliance/AdhocmanagementService";
import { toastService } from "../services/toastService";
import { ConfirmDialog } from 'primereact/confirmdialog'; // Add this import

const AdhocManagement = () => {
  const [adhocData, setAdhocData] = useState([]);
  const [managerData, setManagerData] = useState([]);
  const [selectedManager, setSelectedManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [facilityData, setFacilityData] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [employeeData, setEmployeeData] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const options = ["Pick Up", "Drop"];
  const [value, setValue] = useState(options[0]);
  const [shiftData, setShiftData] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  // Add state for request type
  const [requestTypes] = useState([
    { value: "Adhoc", name: "Ad-hoc" },
    { value: "Emergency", name: "Emergency" },
  ]);
  const [selectedRequestType, setSelectedRequestType] = useState(null);
  const [reasonData, setReasonData] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);

  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [selectedItemToDelete, setSelectedItemToDelete] = useState(null);


  // Update the reason dropdown component
  // const handleRequestTypeChange = (e) => {
  //   setSelectedRequestType(e.value);
  //   // Add any additional logic you need when request type changes
  //   console.log("Selected Request Type:", e.value);
  // };

  //   const deleteBtn = (rowData) => {
  //     return (
  //       <div className="action_btn">
  //         <Button label="Delete" icon="pi pi-trash" className="p-button-danger" />
  //       </div>
  //     );
  //   };
  useEffect(() => {
    fetchAdhocData();
    fetchManagerData();
    fetchFacilityDropdown();
    fetchEmployeeData();
    if (selectedFacility && selectedDate && value) {
      fetchShiftData();
    }
  }, [selectedFacility, selectedDate, value]);
  // Add handler for request type change
  const handleRequestTypeChange = async (e) => {
    setSelectedRequestType(e.value);
    // Fetch reason data when request type changes
    if (selectedFacility && e.value) {
      try {
        const response = await AdhocmanagementService.GetAdhocReason({
          facilityid: selectedFacility,
          triptype: e.value,
        });
        console.log("GetAdhocReason Response:", response);
        const data = typeof response === 'string' ? JSON.parse(response) : response;
        setReasonData(data || []);
      } catch (error) {
        console.error('Error fetching reason data:', error);
        setReasonData([]);
      }
    }
  };
  const fetchShiftData = async () => {
    try {
      const params = {
        facilityid: selectedFacility,
        sDate: selectedDate,
        type: value === "Pick Up" ? "P" : "D",
        processid: 0 // Default processid as 0
      };

      let response;
      if (value === "Pick Up") {
        response = await AdhocmanagementService.getpickshiftAdhoc(params);
      } else {
        response = await AdhocmanagementService.getdropshiftadhoc(params);
      }

      const data = typeof response === 'string' ? JSON.parse(response) : response;
      setShiftData(data || []);
    } catch (error) {
      console.error('Error fetching shift data:', error);
      setShiftData([]);
    }
  };
  const fetchAdhocData = async () => {
    try {
      setLoading(true);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);

      const formattedStartDate = startDate.toISOString().split("T")[0];
      const formattedEndDate = endDate.toISOString().split("T")[0];

      const empId = sessionStorage.getItem("ID");

      const params = {
        EmpId: parseInt(empId),
        sDate: formattedStartDate,
        eDate: formattedEndDate,
        status: "emp",
      };

      console.log("Sending params Adhoc Data:", params);

      const response = await AdhocmanagementService.SelectEmpAdhocRequest(
        params
      );
      // console.log("API Response:", response);
      const respData = JSON.parse(response);

      console.log("AdhocManagement Details", respData);
      setAdhocData(respData);
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployeeData = async () => {
    try {
      const empidname = "-1";
      const locationid = sessionStorage.getItem("locationId");
      const managerID = sessionStorage.getItem("ID");
      const params = {
        empidname: empidname,
        locationid: locationid,
        managerID: managerID,
      };
      console.log("Employee Params", params);
      const response = await AdhocmanagementService.EmpSearchManager(params);
      const data = JSON.parse(response);
      console.log("fetchEmployeeData list:", data);
      setEmployeeData(data);
    } catch (error) {
      console.error("Error fetching employee data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacilityDropdown = async () => {
    try {
      setLoading(true);
      const empId = sessionStorage.getItem("ID");

      const params = {
        EmpId: parseInt(empId),
      };

      const response = await AdhocmanagementService.SelectFacilityByGroup(
        params
      );
      console.log("Facility API Response:", response);

      // Ensure we have an array of data
      let facilities = [];
      if (Array.isArray(response)) {
        facilities = response;
      } else if (response && typeof response === "object") {
        // If response is an object, convert it to array
        facilities = [response];
      }

      console.log("Processed Facilities:", facilities);
      setFacilityData(facilities);

      // Set default facility if available
      const defaultFacility = facilities.find(facility => facility.Id === 1);
      if (defaultFacility) {
        setSelectedFacility(defaultFacility.Id);
      } else if (facilities.length > 0) {
        // Fallback to first facility if Id 1 not found
        setSelectedFacility(facilities[0].Id);
      }
    } catch (error) {
      console.error("Error fetching facility data:", error);
      setFacilityData([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchManagerData = async () => {
    try {
      setLoading(true);
      const params = {
        backupmgrid: sessionStorage.getItem("ID")
      };
      const response = await AdhocmanagementService.GetBackupMgrId(params);
      // Remove JSON.parse since response is already an object
      console.log("Manager Data:", response);
      setManagerData(response);

      // Set default manager if available
      if (response && response.length > 0) {
        setSelectedManager(response[0].MgrId);
        // Fetch employee data for the default manager
        fetchEmployeeData();
      }
    } catch (error) {
      console.error("Error fetching manager data:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleSidebarClose = () => {
    // Reset all form values to default
    setValue(options[0]); // Reset to "Pick Up"
    setSelectedDate(new Date().toISOString().split("T")[0]); // Reset to current date
    setSelectedShift(null);
    setSelectedRequestType(null);
    setSelectedReason(null);
    setSelectedEmployees([]);
    fetchEmployeeData();
    setVisibleLeft(false);
  };
  const handleSaveChanges = async () => {
    try {
      if (!shiftData || shiftData.length === 0) {
        toastService.warn("No shifts available for selected date and trip type");
        return;
      }
      if (!selectedShift || selectedShift.length === 0) {
        setSelectedShift(null);
        toastService.warn("Please Select Shift Time *");
        return;
      }

      if (!selectedReason) {
        toastService.warn("Please Select Reason *");
        return;
      }
      if (!selectedEmployees || selectedEmployees.length === 0) {
        toastService.warn("Please Select Employee *");
        return;
      }
      // Get employee IDs from selected employees
      const employeeIds = selectedEmployees.map(emp => emp.employeeid).join(',');
      // Get current user ID from session storage for Raisedby
      const currentUserId = sessionStorage.getItem("ID");
      // Prepare parameters for API call
      const params = {
        Empids: employeeIds,
        FacilityID: selectedFacility,
        shift: selectedShift,
        tripType: value === "Pick Up" ? "P" : "D",
        Raisedby: currentUserId,
        adhocdate: selectedDate,
        adflag: 1,
        reasonid: selectedReason,
        AdhocType: selectedRequestType
      };
      console.log("Save change params ", params);
      // Call the AddAdhocRequest API
      const response = await AdhocmanagementService.AddAdhocRequest(params);
      // Handle success
      if (response) {
        // Show success message
        toastService.success("Adhoc request saved successfully");
        handleSidebarClose();
        // Close the sidebar
        setVisibleLeft(false);
        // Refresh the adhoc data
        fetchAdhocData();
      }
    } catch (error) {
      console.error("Error saving adhoc request:", error);
      toastService.error("Failed to save adhoc request");
    }
  };
  // Open sidebar with employee data
  const openEditSidebar = () => {
    setVisibleLeft(true); // Open sidebar
  };
  // Function to check if cancel button should be enabled
  const isCancelEnabled = (rowData) => {
    return rowData.Enableds === 1 && !rowData.adhocreason.includes("Emergency");
  };
  const handleDeleteRequest = async (rowData) => {
    try {
      const params = {
        id: rowData.id, // Get the adhocid from the row data
        userid: parseInt(sessionStorage.getItem("ID"))
      };

      const response = await AdhocmanagementService.DeleteAdhoc(params);
      if (response) {
        // Remove the deleted row from the local state
        const updatedData = adhocData.filter(item => item.adhocid !== rowData.adhocid);
        setAdhocData(updatedData);

        toastService.success("Adhoc request deleted successfully");
        fetchAdhocData();
        setConfirmDialogVisible(false);
      }
    } catch (error) {
      console.error("Error deleting adhoc request:", error);
      toastService.error("Failed to delete adhoc request");
    }
  };
  const showDeleteConfirm = (rowData) => {
    setSelectedItemToDelete(rowData);
    setConfirmDialogVisible(true);
  };
  // Delete button template
  const deleteBtn = (rowData) => {
    if (isCancelEnabled(rowData)) {
      return (
        <div className="action_btn">
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="p-button-danger"
            onClick={() => showDeleteConfirm(rowData)}
          />
        </div>
      );
    } else {
      return <span>Expired</span>;
    }
  };
  return (
    <>
      <Header
        pageTitle="Adhoc's Management"
        showNewButton={true}
        onNewButtonClick={() => setVisibleLeft(true)}
      />
      <Sidebar />
      <div className="container-fluid p-0">
        <ConfirmDialog
          visible={confirmDialogVisible}
          onHide={() => setConfirmDialogVisible(false)}
          message="Are you sure you want to delete this adhoc request?"
          header="Confirmation"
          icon="pi pi-exclamation-triangle"
          accept={() => {
            if (selectedItemToDelete) {
              handleDeleteRequest(selectedItemToDelete);
            }
            setConfirmDialogVisible(false);
          }}
          reject={() => setConfirmDialogVisible(false)}
        />
      </div>
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6
              className="pageTitle"
              onClick={() => {
                setVisibleLeft(true);
              }}
            >
            </h6>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col">
            <div className="cardNew p-4 bg-secondary text-white">
              <h3>37</h3>
              <span class="subtitle_sm text-white">Total Adhocs</span>
            </div>
          </div>
          <div className="col">
            <div className="cardNew p-4">
              <h3>
                <strong>10</strong>
              </h3>
              <span class="subtitle_sm">My Requests</span>
            </div>
          </div>
          <div className="col">
            <div className="cardNew p-4">
              <h3 className="text-warning">04</h3>
              <span class="subtitle_sm">Pendings</span>
            </div>
          </div>
          <div className="col">
            <div className="cardNew p-4">
              <h3 className="text-success">02</h3>
              <span class="subtitle_sm">Approved</span>
            </div>
          </div>
          <div className="col">
            <div className="cardNew p-4">
              <h3 className="text-danger">11</h3>
              <span class="subtitle_sm">Rejected</span>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Table Start */}
          <div className="col-12">
            <div className="card_tb">
              {loading ? (
                <div>Loading...</div>
              ) : adhocData.length > 0 ? (
                <DataTable
                  value={adhocData}
                  paginator
                  rows={10}
                  rowsPerPageOptions={[5, 10, 25, 50]}
                  loading={loading}
                  emptyMessage="No Record Found"
                >
                  <Column sortable field="adhocid" header="Adhoc ID"></Column>
                  <Column field="empCode" header="EmployeeID"></Column>
                  <Column field="empName" header="Employee Name"></Column>
                  <Column field="AdhocDate" header="Shift Date"></Column>
                  <Column field="ShiftTime" header="Shift"></Column>
                  <Column field="TripType" header="Trip Type"></Column>
                  <Column field="facilityName" header="Facility"></Column>
                  <Column field="Status" header="Status"></Column>
                  <Column field="RaisedBy" header="Raised By"></Column>
                  <Column field="adhocreason" header="Reason"></Column>
                  <Column field="AprovedBy" header="Approved"></Column>
                  <Column field="" header="Action" body={deleteBtn}></Column>
                </DataTable>
              ) : (
                <div>No Record Found</div>
              )}
            </div>
          </div>

          <PrimeSidebar
            visible={visibleLeft}
            position="right"
            onHide={() => setVisibleLeft(false)}
            style={{ width: "80%" }}
            showCloseIcon={false}
            dismissable={false}
          >
            <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
              <h6 className="sidebarTitle">Raise Adhoc</h6>
              <Button
                icon="pi pi-times"
                className="p-button-rounded p-button-text text-white"
                onClick={handleSidebarClose}
                style={{ color: 'white' }}
              />
            </div>
            <div className="sidebarBody p-3">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="field col-2 mb-3">
                      <SelectButton
                        severity="success"
                        value={value}
                        onChange={(e) => setValue(e.value)}
                        options={options}
                        className="no-label"
                        style={{ width: "100%" }}
                      />
                    </div>
                    <div className="field col-2 mb-3">
                      <label>Select Date</label>
                      <InputText
                        type="date"
                        className="form-control"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div className="field col-2 mb-3">
                      <label>Facility</label>
                      <Dropdown
                        value={selectedFacility}
                        options={facilityData}
                        optionLabel="facilityName"
                        optionValue="Id"
                        placeholder="Select Facility"
                        className="w-100"
                        onChange={(e) => {
                          console.log("Selected Facility:", e.value);
                          setSelectedFacility(e.value);
                        }}
                        disabled={loading}
                      />
                    </div>
                    <div className="field col-2 mb-3">
                      <label>Shift <span className="text-danger">*</span></label>
                      <Dropdown
                        value={selectedShift}
                        options={shiftData}
                        optionLabel="shiftTime"
                        optionValue="shiftTime"
                        placeholder="Select Shift"
                        className="w-100"
                        onChange={(e) => setSelectedShift(e.value)}
                      />
                    </div>
                    <div className="field col-2 mb-3">
                      <label>Request Type</label>
                      <Dropdown
                        value={selectedRequestType}
                        options={requestTypes}
                        optionLabel="name"
                        optionValue="value"
                        placeholder="Select Request Type"
                        className="w-100"
                        onChange={handleRequestTypeChange}
                      />
                    </div>

                    <div className="field col-2 mb-3">
                      <label>Reason <span className="text-danger">*</span></label>
                      <Dropdown
                        value={selectedReason}
                        options={reasonData}
                        optionLabel="AdhocReason"
                        optionValue="ID"
                        placeholder="Select Reason"
                        className="w-100"
                        onChange={(e) => setSelectedReason(e.value)}
                      />
                    </div>
                    <hr className="mx-3" />
                    <div className="field col-2">
                      <label>Select Manager</label>
                      <Dropdown
                        value={selectedManager}
                        options={managerData}
                        optionLabel="ManagerName"
                        optionValue="MgrId"
                        placeholder="Select Manager"
                        className="w-100"
                        onChange={(e) => {
                          console.log("Selected Manager:", e.value);
                          setSelectedManager(e.value);
                          const originalID = sessionStorage.getItem("ID");
                          sessionStorage.setItem("ID", e.value);
                          // Fetch employee data for selected manager
                          fetchEmployeeData();
                          fetchAdhocData();
                          sessionStorage.setItem("ID", originalID);
                        }}
                      />
                    </div>
                    <div className="col-12">
                      <div className="card_tb">
                        <DataTable value={employeeData}
                          selectionMode="multiple"
                          selection={selectedEmployees}
                          onSelectionChange={(e) => setSelectedEmployees(e.value)}
                          paginator
                          rows={5}
                          rowsPerPageOptions={[5, 10, 25, 50]}>
                          <Column
                            selectionMode="multiple"
                            headerStyle={{ width: "3rem" }}
                          ></Column>

                          <Column
                            field="status"
                            header=""
                            body={(rowData) => (
                              <div className="d-flex align-items-center">
                                <span className="material-icons md-18 text-danger" title={rowData.tptreq === 'Y' ? 'Transport' : 'NoTransport'}>
                                  {rowData.tptreq === 'Y' ? 'directions_bus' : 'no_transfer'}
                                </span>
                                <span className="material-icons md-18 text-danger mx-2" title={rowData.geoCode === 'Y' ? 'Geocoded' : 'NoGeocoded'}>
                                  {rowData.geoCode === 'Y' ? 'location_on' : 'location_off'}
                                </span>
                              </div>
                            )}
                          ></Column>
                          <Column field="empName" header="Employee"></Column>
                          <Column field="processName" header="Project"></Column>
                          <Column field="facilityName" header="Facility"></Column>
                        </DataTable>
                      </div>
                    </div>
                    {/* Fixed button container at bottom of sidebar */}
                    <div className="sidebar-fixed-bottom">
                      <div className="d-flex gap-3 justify-content-end">
                        <Button
                          label="Cancel"
                          className="btn btn-outline-secondary"
                          onClick={handleSidebarClose}
                        />
                        <Button
                          label="Save Changes"
                          className="btn btn-success me-3"
                          onClick={handleSaveChanges}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </PrimeSidebar>
        </div>
      </div>
    </>
  );
};

export default AdhocManagement;
