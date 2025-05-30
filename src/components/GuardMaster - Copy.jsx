import React, { useState } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { Dropdown } from 'primereact/dropdown';
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component

const GuardMaster = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [selectedActive, setSelectedActive] = useState(null);

    const cities = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];
    // Open sidebar with employee data
    const openEditSidebar = () => {
        setVisibleLeft(true); // Open sidebar
    };

    return (
        <>
            <Header pageTitle="Vehicle Master" showNewButton={true} />
            <Sidebar />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle">Guard Master</h6>
                    </div>
                    {/* Search Box */}
                    <div className="col-12">
                        <div className="card_tb p-3">
                            <div className="row">
                                <div className="col-2">
                                    <label htmlFor="">Facility</label>
                                    <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                        placeholder="Select Facility" className="w-100" filter />
                                </div>
                                <div className="col-2 offset-8">
                                    <label htmlFor="" className="d-block">Search Any</label>
                                    <InputText placeholder="Search Any Value" className="w-100" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table Start */}
                    <div className="col-12">
                        <div className="card_tb">
                            <DataTable value={[
                                {
                                    id: 1,
                                    driverName: "SE2-SG-0720-018",
                                    facilityName: "Satendra Babu",
                                    vendorName: "Escort Supervisor",
                                    fatherName: "8954721725",
                                    contactNo: "SSS Security",
                                    dob: "7/1/2020",
                                    bloodGroup: "03/01/2024",
                                    vehicleNo: "Y",
                                    vehicleRegNo: "confirm by pragati",
                                    licenceNo: "GGN",
                                    licenceExpDate: "NA",
                                    badgeNo: "NA",
                                    badgeExpDate: "NA",
                                    // action: <a href="#!"><i className="pi pi-download" style={{ color: 'var(--primary-color)' }}></i></a>
                                }
                            ]} paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column sortable field="id" header="Guard SE2 ID" body={(rowData) => (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setVisibleLeft(true);
                                    }}>
                                        EG001055
                                    </a>
                                )}></Column>
                                <Column field="driverName" header="Guard Agency ID"></Column>
                                <Column field="facilityName" header="Guard Name"></Column>
                                <Column field="vendorName" header="Designation"></Column>
                                <Column field="fatherName" header="Contact No"></Column>
                                <Column field="contactNo" header="Vendor"></Column>
                                <Column field="dob" header="Induction Date"></Column>
                                <Column field="bloodGroup" header="Release Date"></Column>
                                <Column field="vehicleNo" header="Active"></Column>
                                <Column field="vehicleRegNo" header="Remarks"></Column>
                                <Column field="licenceNo" header="Facility"></Column>
                                <Column field="licenceExpDate" header="Aadhar No."></Column>
                                <Column field="badgeNo" header="PVC Status"></Column>
                                {/* <Column field="badgeExpDate" header="Vaccine Name"></Column> */}
                                {/* <Column field="action" header="Action"></Column> */}
                            </DataTable>
                        </div>
                    </div>

                    {/* Prime Sidebar */}
                    <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} width="50%" showCloseIcon={false} dismissable={false}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Edit Guard Master</h6>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                        </div>
                        <div className="sidebarBody">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Guard Details</h6>
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Guard SE2 ID</label>
                                    <InputText className="form-control" name="" placeholder="Guard SE2 ID" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Guard Agency ID</label>
                                    <InputText className="form-control" name="" placeholder="Guard Agency ID" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Guard Name</label>
                                    <InputText className="form-control" name="" placeholder="Guard Name" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Designation</label>
                                    <InputText className="form-control" name="" placeholder="Designation" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Contact No</label>
                                    <InputText className="form-control" name="" placeholder="Contact No" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Vendor</label>
                                    <InputText className="form-control" name="" placeholder="Vendor" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Induction Date</label>
                                    <InputText className="form-control" name="" placeholder="Induction Date" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Release Date</label>
                                    <InputText className="form-control" name="" placeholder="Release Date" />
                                </div>
                                
                                <div className="field col-12 mb-3">
                                    <label>Remarks</label>
                                    <InputText className="form-control" name="" placeholder="Remarks" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Aadhar No.</label>
                                    <InputText className="form-control" name="" placeholder="Aadhar No." />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>PVC Status</label>
                                    <InputText className="form-control" name="" placeholder="PVC Status" />
                                </div>
                                <div className="field col-3 mb-3">
                                    <label>Active</label>
                                    <Dropdown 
                                        options={[
                                            { name: 'Yes', value: 'yes' },
                                            { name: 'No', value: 'no' }
                                        ]} 
                                        value={selectedActive}
                                        onChange={(e) => setSelectedActive(e.value)}
                                        optionLabel="name" 
                                        className="w-100" 
                                        placeholder="Select Active"
                                    />
                                    
                                </div>
                            </div>
                        </div>
                        {/* Fixed button container at bottom of sidebar */}
                        <div className="sidebar-fixed-bottom">
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                        <Button label="Save Changes" className="btn btn-success" />
                                    </div>
                                </div>
                    </PrimeSidebar>

                </div>
            </div>
        </>
    );
}

export default GuardMaster;