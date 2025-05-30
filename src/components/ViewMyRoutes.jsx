import React, { useEffect, useState } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ViewMyRoutes = () => {
  return (
    <>
      <Header pageTitle="Manage Employee" showNewButton={true} />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">View My Routes</h6>
          </div>
        </div>
        <div className="row">
          {/* Search Box */}
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2">
                  <label htmlFor="">Trips for the Day</label>
                  <InputText type="date"
                    className="w-100"
                    placeholder="Trips for the Day"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="">Employee Name </label>
                  <Dropdown
                    placeholder="Select Vendor"
                    className="w-100"
                    filter
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb">
              <DataTable value={[
                { tripId: '023838R0016', tripDate: 'Jul 05, 24', tripType: 'PickUp', shift: '18:30', facility: 'Noida' },
                { tripId: '023838R0016', tripDate: 'Jul 05, 24', tripType: 'Drop', shift: '18:30', facility: 'Noida' },
                { tripId: 'Trip Not Generated', tripDate: 'Jul 05, 24', tripType: 'PickUp', shift: '18:30', facility: 'Noida' }
              ]} paginator rows={10} emptyMessage="No data available">
                <Column field="tripId" header="Trip ID" />
                <Column field="tripDate" header="Trip Date" />
                <Column field="tripType" header="Trip Type" body={(rowData) => (
                    <span className={`badge ${rowData.tripType === 'Drop' ? 'text-bg-danger' : 'text-bg-primary'} rounded-pill text-uppercase`}>
                        {rowData.tripType}
                    </span>
                )} />
                <Column field="shift" header="Shift" />
                <Column field="facility" header="Facility" />
                <Column field="action" header="Action" body={(rowData) => (
                //   <Button icon="pi pi-trash" className="p-button-danger" />
                  <button class="btn btn-sm btn-outline-danger" onClick={() => handleDelete(rowData)}>Delete</button>
                )} />
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewMyRoutes;
