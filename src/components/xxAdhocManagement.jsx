import React, { useState } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component
import { Col } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';

const AdhocManagement = () => {

    const [visibleLeft, setVisibleLeft] = useState(false);

    const options = ['Pick Up', 'Drop'];
    const [value, setValue] = useState(options[0]);

    const deleteBtn = (rowData) => {
        return (
            <div className="action_btn">
                <Button label="Delete" icon="pi pi-trash" className="p-button-danger" />
            </div>
        )
    }

    // Open sidebar with employee data
    const openEditSidebar = () => {
        setVisibleLeft(true); // Open sidebar
    };

    return (
        <>
            <Header pageTitle="" showNewButton={true} onNewButtonClick={() => setVisibleLeft(true)} />
            <Sidebar />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle" onClick={() => { setVisibleLeft(true); }}>Adhoc's Management </h6>
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
                            <h3><strong>10</strong></h3>
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
                            <DataTable paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column sortable field="id" header="Adhoc ID"></Column>
                                <Column field="Anurag Singh" header="Employee Name"></Column>
                                <Column field="28/06/2023" header="Shift Date"></Column>
                                <Column field="20:00" header="Shift"></Column>
                                <Column field="Drop" header="Trip Type"></Column>
                                <Column field="GGN" header="Facility"></Column>
                                <Column field="Approved" header="Status"></Column>
                                <Column field="John Doe" header="Raised By"></Column>
                                <Column field="Client Business Meeting" header="Reason"></Column>
                                <Column field="Shivani Ahuja" header="Approved"></Column>
                                <Column field="" header="Action" body={deleteBtn}></Column>
                            </DataTable>
                        </div>
                    </div>

                    <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} style={{width: '80%'}} showCloseIcon={false} dismissable={false}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Raise  Adhoc</h6>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                        </div>
                        <div className="sidebarBody p-3">
                            <div className="row">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="field col-2 mb-3">
                                            
<SelectButton severity="success" value={value} onChange={(e) => setValue(e.value)} options={options} className="no-label" style={{width:'100%'}} />
                                        </div>
                                        <div className="field col-2 mb-3">
                                            <label>Request Type</label>
                                            <Dropdown optionLabel="name" placeholder="Select Request Type" className="w-100" filter />
                                        </div>
                                        <div className="field col-2 mb-3">
                                            <label>Facility</label>
                                            <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
                                        </div>
                                        <div className="field col-2 mb-3">
                                            <label>Select Date</label>
                                            <InputText type="date" className="form-control" name="" placeholder="" />
                                        </div>
                                        <div className="field col-2 mb-3">
                                            <label>Shift</label>
                                            <Dropdown optionLabel="name" placeholder="Select Shift" className="w-100" filter />
                                        </div>
                                        <div className="field col-2 mb-3">
                                            <label>Reason</label>
                                            <Dropdown optionLabel="name" placeholder="Select Reason" className="w-100" filter />
                                        </div>
                                        <hr className="mx-3" />
                                        <div className="field col-2">
                                            <label>Select Manager</label>
                                            <Dropdown optionLabel="name" placeholder="Anurag Singh" className="w-100" filter />
                                        </div>
                                        <div className="col-12">
                                        <div className="card_tb">
                                            <DataTable value="" selectionMode="">
                                                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                                                <Column field="code" header="Employee"></Column>
                                                <Column field="name" header="Project"></Column>
                                                <Column field="category" header="Facility"></Column>
                                            </DataTable>
                                        </div>
                                        </div>
                                        {/* Fixed button container at bottom of sidebar */}
                                        <div className="sidebar-fixed-bottom">
                                            <div className="d-flex gap-3 justify-content-end">
                                                <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                                <Button label="Save Changes" className="btn btn-success me-3" />
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
    )
}

export default AdhocManagement;