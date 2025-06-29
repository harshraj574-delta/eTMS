import React, { useState } from 'react';
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

function MyAdhocRequest() {
    return (
        <>
            <Header pageTitle="" />
            <Sidebar />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle">Adhoc Request Status</h6>
                    </div>
                    <div className="col-12">
                        <div className="card_tb p-3">
                            <div className="row">
                                <div className="field col-2">
                                    <label></label>
                                    <Dropdown optionLabel="name" placeholder="Select Date" className="w-100" filter />
                                </div>
                                <div className="field col-2">
                                    <label></label>
                                    <Dropdown optionLabel="name" placeholder="Select Month" className="w-100" filter />
                                </div>
                                <div className="field col-2">
                                    <label></label>
                                    <Dropdown optionLabel="name" placeholder="Select Team Member" className="w-100" filter />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Data Table */}
                <div className="row">
                <div className="col-12">
                        <div className="card_tb">
                            <DataTable paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column sortable field="" header="AdhocID"></Column>
                                <Column field="" header="Employee Name"></Column>
                                <Column field="" header="Shift Date"></Column>
                                <Column field="" header="Shift"></Column>
                                <Column field="" header="Trip Type"></Column>
                                <Column field="" header="Facility"></Column>
                                <Column field="" header="Status"></Column>
                                <Column field="" header="Raised By"></Column>
                                <Column field="" header="Approved"></Column>
                                <Column field="" header="Reason"></Column>
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MyAdhocRequest;