import React, { useState, useEffect, use } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CostMasterService from "../services/compliance/CostMasterService";
import SystemSettingService from "../services/compliance/SystemSettingService";
import { toastService } from "../services/toastService";
import sessionManager from "../utils/SessionManager.js";
import { set } from "lodash";

const SystemSetting = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editRow, setEditRow] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(1);
  const [facilities, setFacilities] = useState([]);
  // const UserID = sessionStorage.getItem("UserID") || 1; // Default to 1 if UserID is not set
  const UserID = sessionManager.getUserSession().ID; // Default to 1 if UserID is not set
  const [loading, setLoading] = useState(true);
  const [configData, setConfigData] = useState([]); // State to hold configuration data
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  // Date formatting function
  const formatDateTime = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    const ss = String(date.getSeconds()).padStart(2, "0");
    return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
  };

  useEffect(() => {
    fetchFacilities();
    fetchConfigData();
  }, []);
  useEffect(() => {
    if (selectedFacility) {
      fetchConfigData();
    }
  }, [selectedFacility]);

  const actionBodyTemplate = (rowData) => (
    <Button
      className="btn btn-sm btn-outline-success"
      onClick={() => {
        setEditRow(rowData);
        setSidebarVisible(true);
      }}
    >
      Edit
    </Button>
  );
  //Fetch Facilities
  const fetchFacilities = async () => {
    try {
      const response = await CostMasterService.SelectFacility({
        Userid: UserID,
      });
      const parsedResponse =
        typeof response === "string" ? JSON.parse(response) : response;
      const formattedData = Array.isArray(parsedResponse)
        ? parsedResponse.map((item) => ({
          label: item.facility || item.facilityName, // Using facility or facilityName from your API response
          value: item.Id, // Using Id from your API response
        }))
        : [];
      setFacilities(formattedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };
  //Fetch Configuration Data
  const fetchConfigData = async () => {
    try {
      setIsSubmitting(true); // Start loading
      const response = await SystemSettingService.GetConfiguration({
        facilityid: selectedFacility,
      });
      const parsedResponse =
        typeof response === "string" ? JSON.parse(response) : response;
      setConfigData(parsedResponse);
    } catch (error) {
      console.error("Error fetching configuration data:", error);
    } finally {
      setIsSubmitting(false); // Stop loading
    }
  };
  // Handle Save
  const handleSave = async () => {
    setIsSubmitting(true);
    if (!editRow) {
      console.error("No row selected for editing.");
      return;
    }
    const regexPattern = "^[1-9]+[0-9]*$";
    const regex = new RegExp(regexPattern);
    if (!regex.test(editRow.configValue)) {
      toastService.error("Please enter numeric value.");
      setIsSubmitting(false);
      return;
    }
    try {
      // const response = await SystemSettingService.GetRegex({
      //   configname: editRow.configName,
      //   facilityid: selectedFacility,
      // });
      // const regex = new RegExp(response[0].regex);
      // if (!regex.test(editRow.configValue)) {
      //   toastService.error(response.error);
      //   return;
      // }
      // If validation passes, save the settings
      await SystemSettingService.AddSetting({
        configname: editRow.configName,
        configvalue: editRow.configValue,
        description: editRow.description,
        id: editRow.id,
        userid: UserID, // Replace with actual user ID
      });

      // Close sidebar and refresh data
      setSidebarVisible(false);
      // Implement your BindGrid or data refresh function here
      // For example: fetchData();
      toastService.success("Settings saved successfully.");
      fetchConfigData(); // Refresh the configuration data
    } catch (error) {
      console.error('Error saving settings:', error);
      toastService.error('An error occurred while saving. Please try again.');
    }
    finally {
      setIsSubmitting(false); // Stop loading
    }
  };


  return (
    <div>
      {isSubmitting && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(255,255,255,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="spinner-border text-primary"
            style={{ width: 60, height: 60, fontSize: 32 }}
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <Header
        pageTitle="System Setting"
        showNewButton={false}
        onNewButtonClick={() => { }}
      />
      <Sidebar />
      <div className="middle">
        <div className="card_tb p-3">
          <div className="row">
            <div className="col-2">
              <label htmlFor="facility">Facility</label>
              <Dropdown
                id="facility"
                placeholder="Select Facility"
                value={selectedFacility}
                options={facilities}
                onChange={(e) => {
                  setSelectedFacility(e.value);
                  
                }}
                className="w-100"
                defaultValue={1}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-3">
            <div className="card_tb">
              <DataTable
                paginator
                rows={50}
                rowsPerPageOptions={[50, 100, 150, 200]}
                value={configData}
                className="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <Column field="configName" header="Parameter Name" />
                <Column field="facilityName" header="Facility" />
                <Column field="configValue" header="Configuration Value" />
                <Column field="description" header="Description" />
                <Column field="CreatedBy" header="Created By" />
                <Column field="ChangedDate" header="Changed On"
                  body={({ ChangedDate }) => formatDateTime(ChangedDate)} />
                <Column
                  header="Actions"
                  body={actionBodyTemplate}
                  style={{ minWidth: "120px" }}
                />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
      {/* PrimeSidebar for Edit */}
      <PrimeSidebar
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
        position="right"
        style={{ width: "25%", backdropFilter: "blur(8px)" }}
        showCloseIcon={false}
        dismissable={false}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">
            {editRow ? editRow.configName : ""}
            <small className="d-block">
              {editRow
                ? `Last updated by: ${editRow.CreatedBy ? editRow.CreatedBy : "NA"} | on: ${editRow.ChangedDate ? formatDateTime(editRow.ChangedDate) : "NA"}`
                : ""}
            </small>
          </h6>
          <span
            className="material-icons me-3"
            style={{ cursor: "pointer" }}
            onClick={() => setSidebarVisible(false)}
          >
            close
          </span>
        </div>
        <div className="sidebarBody p-3">
          {editRow ? (
            <div className="row">
              <div className="col-12">
                <div className="field mb-3">
                  <label htmlFor="parameterName">Parameter Name</label>
                  <InputText
                    id="parameterName"
                    value={editRow ? editRow.configName : ""}
                    className="w-100"
                    disabled
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="field mb-3">
                  <label htmlFor="facility">Facility Name</label>
                  <InputText
                    id="facility"
                    value={editRow ? editRow.facilityName : ""}
                    className="w-100"
                    disabled
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="field mb-3">
                  <label htmlFor="configValue">Configuration Value</label>
                  <InputText
                    id="configValue"
                    value={editRow ? editRow.configValue : ""}
                    className="w-100"
                    onChange={(e) => {
                      setEditRow((prev) => ({
                        ...prev,
                        configValue: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="col-12">
                <div className="field mb-3">
                  <label htmlFor="description">Description</label>
                  <InputText
                    id="description"
                    value={editRow ? editRow.description : ""}
                    className="w-100"
                    onChange={(e) => {
                      setEditRow((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-danger">No row selected for editing.</div>
          )}
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => setSidebarVisible(false)}

            />
            <Button label="Save" className="btn btn-success" onClick={handleSave} />
          </div>
        </div>
      </PrimeSidebar>
    </div>
  );
};

export default SystemSetting;
