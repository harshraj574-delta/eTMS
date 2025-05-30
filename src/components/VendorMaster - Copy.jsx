import React, { useState } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { Checkbox } from "primereact/checkbox";
import { FileUpload } from "primereact/fileupload";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component

const VendorMaster = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [visibleLeft, setVisibleLeft] = useState(false);
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
                        <h6 className="pageTitle">Vendor Master</h6>
                    </div>
                    {/* Search Box */}
                    <div className="col-12">
                        <div className="card_tb p-3">
                            <div className="row">
                                <div className="col-3">
                                    <label htmlFor="">Facility</label>
                                    <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                        placeholder="Select Facility" className="w-100" filter />
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
                                    driverName: "John Doe",
                                    facilityName: "Facility A",
                                    vendorName: "Vendor X",
                                    fatherName: "James Doe",
                                    contactNo: "+91 9876543210",
                                    dob: "01/01/1990",
                                    bloodGroup: "O+",
                                    vehicleNo: "VH-001",
                                    vehicleRegNo: "MH-12-AB-1234",
                                    licenceNo: "LIC123456",
                                }
                            ]} paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column sortable field="id" header="ID" body={(rowData) => (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setVisibleLeft(true);
                                    }}>
                                        15226
                                    </a>
                                )}></Column>
                                <Column field="bloodGroup" header="Facility"></Column>
                                <Column field="driverName" header="Vendor Name"></Column>
                                <Column field="driverName" header="Fleet strength"></Column>
                                <Column field="facilityName" header="Fleet strength 2"></Column>
                                <Column field="vendorName" header="Fleet strength 3"></Column>
                                <Column field="fatherName" header="Vendor Contact"></Column>
                                <Column field="contactNo" header="Vendor Info"></Column>
                                <Column field="dob" header="Vendor EmailId"></Column>
                                <Column field="vehicleNo" header="Vendor Type"></Column>
                                <Column field="vehicleRegNo" header="Attrited"></Column>
                                <Column field="licenceNo" header="Updated by"></Column>
                            </DataTable>
                        </div>
                    </div>

                    {/* Prime Sidebar */}
                    <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} width="50%" showCloseIcon={false} dismissable={false} style={{width:'50%'}}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Add Vendor Master</h6>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                        </div>
                        <div className="sidebarBody">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Add New Vendor</h6>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Name</label>
                                    <InputText className="form-control" name="" placeholder="Name" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Email Address</label>
                                    <InputText className="form-control" name="" placeholder="Vendor Email Address" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Contact Number</label>
                                    <InputText className="form-control" name="" placeholder="Vendor Strength" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Fleet Strength</label>
                                    <InputText className="form-control" name="" placeholder="Vendor Strength" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Fleet Strength 2</label>
                                    <InputText className="form-control" name="" placeholder="Vendor Strength 2" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Fleet Strength 3</label>
                                    <InputText className="form-control" name="" placeholder="Vendor Strength 3" />
                                </div>
                                
                                <div className="field col-4 mb-3">
                                    <label>Information </label>
                                    <InputText className="form-control" name="" placeholder="Vendor Information" />
                                </div>
                               
                                <div className="field col-4 mb-3">
                                    <label>Facility</label>
                                    <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
                                </div>
                                <div className="field col-12 d-flex flex-wrap justify-content-start align-items-center gap-4" style={{ whiteSpace:"nowrap"}}>

                                    <div className="d-flex">
                                        <label htmlFor="">Vendor Type</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2"> Route Basis</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2"> KM Basis</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2"> Package Basis</label>
                                    </div>
                                </div>
                                

                                {/* Fixed button container at bottom of sidebar */}
                                <div className="sidebar-fixed-bottom position-absolute pe-3">
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                        <Button label="Save Changes" className="btn btn-success" />
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

export default VendorMaster;