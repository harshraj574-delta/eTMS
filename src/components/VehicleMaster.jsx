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

const VehicleMaster = () => {
    const [selectedCity, setSelectedCity] = useState(null);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [addVehicle, setAddVehicle] = useState(false);
    //const [editVehicle, setEditVehicle] = useState(false);
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
            <Header pageTitle="Vehicle Master" showNewButton={true} onNewButtonClick={setAddVehicle} />
            <Sidebar />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle">Vehicle Master</h6>
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
                                <div className="col-2">
                                    <label htmlFor="">Vendor</label>
                                    <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                                        placeholder="Select Vendor" className="w-100" filter />
                                </div>
                                
                                <div className="col-2">
                                    <Button label="Submit" className="btn btn-dark no-label-prime" />
                                </div>
                                <div className="col-2 offset-4">
                                    <label htmlFor="">Search Any</label>
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
                                    licenceExpDate: "31/12/2024",
                                    badgeNo: "BDG789",
                                    badgeExpDate: "31/12/2024",
                                    action: <a href="#!"><i className="pi pi-download" style={{ color: 'var(--primary-color)' }}></i></a>
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
                                <Column field="driverName" header="Vehicle Reg. No."></Column>
                                <Column field="driverName" header="Vehicle Type"></Column>
                                <Column field="facilityName" header="Facility Name"></Column>
                                <Column field="vendorName" header="Vendor Name"></Column>
                                {/* <Column field="fatherName" header="Modal No."></Column>
                                <Column field="contactNo" header="Reg. Date"></Column> */}
                                <Column field="dob" header="Permit Expiry"></Column>
                                <Column field="bloodGroup" header="Insurance Expiry"></Column>
                                <Column field="vehicleNo" header="Fitness Expiry"></Column>
                                <Column field="vehicleRegNo" header="Tax Expiry"></Column>
                                <Column field="licenceNo" header="PUC Expiry"></Column>
                                {/* <Column field="licenceExpDate" header="Cab Induction"></Column> */}
                                <Column field="badgeNo" header="Cab Expiry"></Column>
                                {/* <Column field="badgeExpDate" header="Fuel Type"></Column> */}
                                {/* <Column field="action" header="Action" className="text-center"></Column> */}
                            </DataTable>
                        </div>
                    </div>

                    {/* Add Vehicle Master */}
                    <PrimeSidebar visible={addVehicle} position="right" onHide={() => setAddVehicle(false)} showCloseIcon={false} dismissable={false} style={{width: '50%'}}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Add Vehicle Master</h6>
                            <span className="d-flex align-items-center">
                    <p>Attrited</p>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setAddVehicle(false)} />
                                </span>
                        </div>
                        <div className="sidebarBody">
                            <div className="row">
                                <div className="col-12 mb-3">
                                <div className="bg-light-blue w-100 d-flex justify-content-between align-items-center">
                                    <h6 className="sidebarSubTitle">Vehical Details</h6>
                                    <div className="d-flex justify-content-between me-3">
                                    <Checkbox inputId="AadharVerification" className="" name="" />
                                    <label htmlFor="AadharVerification" className="ms-2">Attrited</label>
                                    </div>
                                    </div>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vehicle No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Vehical Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Registration No. <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Vehicle Registration" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Registration Date</label>
                                    <Calendar className="w-100" name="" placeholder="Vehicle Registration Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Facility</label>
                                    <Dropdown optionLabel="name" placeholder="Select Facility Name" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vendor</label>
                                    <Dropdown optionLabel="name" placeholder="Select Vendor Name" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vehicle Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Vehicle Type" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Permit Expiry Date</label>
                                    <Calendar className="w-100" name="" placeholder="Permit Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance Expiry</label>
                                    <Calendar className="w-100" name="" placeholder="Insurance Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Fitness Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="Fitness Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Tax Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="Tax Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>PUC Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="PUC Expiry Date" />
                                </div>
                                {/* <div className="field col-4 mb-3">
                                    <label>Emission Expiry Date</label>
                                    <Calendar className="w-100" name="" placeholder="Emission Expiry Date" />
                                </div> */}
                                <div className="field col-4 mb-3">
                                    <label>Cab Induction</label>
                                    <Calendar className="w-100" name="" placeholder="Cab Induction Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Cab Expiry</label>
                                    <Calendar className="w-100" name="" placeholder="Cab Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Chassis No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Chassis Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Model No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Modal Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance No.</label>
                                    <InputText className="form-control" name="" placeholder="Insurance Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance Company </label>
                                    <InputText className="form-control" name="" placeholder="Insurance Company Name" />
                                </div>
                                <div className="field col-4">
                                    <label className="d-block">Fuel Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Fuel Type" className="w-100" filter />
                                    {/* <div className=" d-flex align-items-center gap-4 mt-3">
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Petrol</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Electric</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Diesel</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">CNG</label>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Warning-1</label>
                                    <InputText className="form-control" name="" placeholder="Warning-1" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Warning-2</label>
                                    <InputText className="form-control" name="" placeholder="Warning-2" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Final Warning</label>
                                    <InputText className="form-control" name="" placeholder="Final Warning" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Attrited Date</label>
                                    <Calendar className="w-100" name="" placeholder="Attrited Date" />
                                </div>
                                {/* <div className="field col-3 d-flex align-items-center">
                                    <div className="d-flex mt-3">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Attrited</label>
                                    </div>
                                </div> */}
                                <div className="field col-8 mb-3">
                                    <label>Remark</label>
                                    <InputText className="form-control" name="" placeholder="Remark" />
                                </div>
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Document Details</h6>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Document Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Document Type" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Choose File</label>
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" className="w-100" />
                                </div>
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Other Details</h6>
                                </div>
                                <div className="field col-12 d-flex flex-wrap justify-content-start align-items-center gap-4" style={{ whiteSpace:"nowrap"}}>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Emergency Contact Detail Danglers</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Wireless Set</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Fire Extinguisher</label>
                                    </div>
                                    {/*  */}
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Spare Tyre</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Medical Kit</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Umbrella</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Torch</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Documents</label>
                                    </div>
                                </div>

                                {/* Fixed button container at bottom of sidebar */}
                                <div className="sidebar-fixed-bottom">
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                        <Button label="Save Changes" className="btn btn-success" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    </PrimeSidebar>

                    {/* Edit Vehicle Master */}
                    <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} showCloseIcon={false} dismissable={false} style={{width: '50%'}}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Edit Vehicle Master</h6>
                            <span className="d-flex align-items-center">
                    <p>Attrited</p>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                                </span>
                        </div>
                        <div className="sidebarBody">
                            <div className="row">
                                <div className="col-12 mb-3">
                                <div className="bg-light-blue w-100 d-flex justify-content-between align-items-center">
                                    <h6 className="sidebarSubTitle">Vehical Details</h6>
                                    <div className="d-flex justify-content-between me-3">
                                    <Checkbox inputId="AadharVerification" className="" name="" />
                                    <label htmlFor="AadharVerification" className="ms-2">Attrited</label>
                                    </div>
                                    </div>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vehicle No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Vehical Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Registration No. <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Vehicle Registration" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Registration Date</label>
                                    <Calendar className="w-100" name="" placeholder="Vehicle Registration Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Facility</label>
                                    <Dropdown optionLabel="name" placeholder="Select Facility Name" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vendor</label>
                                    <Dropdown optionLabel="name" placeholder="Select Vendor Name" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vehicle Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Vehicle Type" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Permit Expiry Date</label>
                                    <Calendar className="w-100" name="" placeholder="Permit Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance Expiry</label>
                                    <Calendar className="w-100" name="" placeholder="Insurance Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Fitness Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="Fitness Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Tax Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="Tax Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>PUC Expiry </label>
                                    <Calendar className="w-100" name="" placeholder="PUC Expiry Date" />
                                </div>
                                {/* <div className="field col-4 mb-3">
                                    <label>Emission Expiry Date</label>
                                    <Calendar className="w-100" name="" placeholder="Emission Expiry Date" />
                                </div> */}
                                <div className="field col-4 mb-3">
                                    <label>Cab Induction</label>
                                    <Calendar className="w-100" name="" placeholder="Cab Induction Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Cab Expiry</label>
                                    <Calendar className="w-100" name="" placeholder="Cab Expiry Date" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Chassis No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Chassis Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Model No.  <span>*</span></label>
                                    <InputText className="form-control" name="" placeholder="Modal Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance No.</label>
                                    <InputText className="form-control" name="" placeholder="Insurance Number" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Insurance Company </label>
                                    <InputText className="form-control" name="" placeholder="Insurance Company Name" />
                                </div>
                                <div className="field col-4">
                                    <label className="d-block">Fuel Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Fuel Type" className="w-100" filter />
                                    {/* <div className=" d-flex align-items-center gap-4 mt-3">
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Petrol</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Electric</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">Diesel</label>
                                        </div>
                                        <div className="d-flex">
                                            <Checkbox inputId="AadharVerification" className="" name="" />
                                            <label htmlFor="AadharVerification" className="ms-2">CNG</label>
                                        </div>
                                    </div> */}
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Warning-1</label>
                                    <InputText className="form-control" name="" placeholder="Warning-1" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Warning-2</label>
                                    <InputText className="form-control" name="" placeholder="Warning-2" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Final Warning</label>
                                    <InputText className="form-control" name="" placeholder="Final Warning" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Attrited Date</label>
                                    <Calendar className="w-100" name="" placeholder="Attrited Date" />
                                </div>
                                {/* <div className="field col-3 d-flex align-items-center">
                                    <div className="d-flex mt-3">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Attrited</label>
                                    </div>
                                </div> */}
                                <div className="field col-8 mb-3">
                                    <label>Remark</label>
                                    <InputText className="form-control" name="" placeholder="Remark" />
                                </div>
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Document Details</h6>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Document Type</label>
                                    <Dropdown optionLabel="name" placeholder="Select Document Type" className="w-100" filter />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Choose File</label>
                                    <FileUpload mode="basic" name="demo[]" url="/api/upload" accept="image/*" className="w-100" />
                                </div>
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Other Details</h6>
                                </div>
                                <div className="field col-12 d-flex flex-wrap justify-content-start align-items-center gap-4" style={{ whiteSpace:"nowrap"}}>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Emergency Contact Detail Danglers</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Wireless Set</label>
                                    </div>

                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Fire Extinguisher</label>
                                    </div>
                                    {/*  */}
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Spare Tyre</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Medical Kit</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Umbrella</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Torch</label>
                                    </div>
                                    <div className="d-flex">
                                        <Checkbox inputId="AadharVerification" className="" name="" />
                                        <label htmlFor="AadharVerification" className="ms-2">Documents</label>
                                    </div>
                                </div>

                                {/* Fixed button container at bottom of sidebar */}
                                <div className="sidebar-fixed-bottom">
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

export default VehicleMaster;