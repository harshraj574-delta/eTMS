import React, { useState } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const dummyData = [
  {
    id: 1,
    parameterName: "Max Login Attempts",
    facility: "Facility A",
    configValue: "5",
    description: "Maximum allowed login attempts before lockout",
    updatedBy: "Admin",
    updatedOn: "2024-07-01",
  },
  {
    id: 2,
    parameterName: "Session Timeout",
    facility: "Facility B",
    configValue: "30 min",
    description: "User session timeout duration",
    updatedBy: "SuperAdmin",
    updatedOn: "2024-07-02",
  },
];

const SystemSetting = () => {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [editRow, setEditRow] = useState(null);

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

  return (
    <div>
      <Header
        pageTitle="System Setting"
        showNewButton={false}
        onNewButtonClick={() => {}}
      />
      <Sidebar />
      <div className="middle">
        <div className="card_tb p-3">
          <div className="row">
            <div className="field col-2 mb-3">
              <label>Facility Name</label>
              <Dropdown
                optionLabel="name"
                placeholder="GGN "
                className="w-100"
                filter
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 p-3">
            <div className="card_tb">
              <DataTable
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25, 50]}
                value={dummyData}
                className="p-datatable-sm"
                responsiveLayout="scroll"
              >
                <Column field="parameterName" header="Parameter Name" />
                <Column field="facility" header="Facility" />
                <Column field="configValue" header="Configuration Value" />
                <Column field="description" header="Description" />
                <Column field="updatedBy" header="Updated By" />
                <Column field="updatedOn" header="Updated On" />
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
        style={{ width: "30%", backdropFilter: "blur(8px)" }}
        showCloseIcon={false}
        dismissable={false}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">
            {editRow ? editRow.parameterName : ""}
            <small className="d-block">
              {editRow
                ? `Last updated by: ${editRow.updatedBy} | on ${editRow.updatedOn}`
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
              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="parameterName">Parameter Name</label>
                  <InputText
                    id="parameterName"
                    value={editRow ? editRow.parameterName : ""}
                    className="w-100"
                    disabled
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="facility">Facility Name</label>
                  <InputText
                    id="facility"
                    value={editRow ? editRow.facility : ""}
                    className="w-100"
                    disabled
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="configValue">Configuration Value</label>
                  <InputText
                    id="configValue"
                    value={editRow ? editRow.configValue : ""}
                    className="w-100"
                  />
                </div>
              </div>
              <div className="col-6">
                <div className="field mb-3">
                  <label htmlFor="description">Description</label>
                  <InputText
                    id="description"
                    value={editRow ? editRow.description : ""}
                    className="w-100"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-danger">No row selected for editing.</div>
          )}
        </div>
      </PrimeSidebar>
    </div>
  );
};

export default SystemSetting;
