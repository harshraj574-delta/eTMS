import React, { useState } from 'react';
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component
import { Col } from 'react-bootstrap';

const VehicleTypeMaster = () => {
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
                        <h6 className="pageTitle">Manage Vehicle Type</h6>
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
                                    <label htmlFor="">Vendor </label>
                                    <Dropdown value="" placeholder="Select All Vendor" className="w-100" />
                                </div>
                                <div className="col-2 offset-6">
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
                                    driverName: "NA",
                                    facilityName: "NA",
                                    vendorName: "NA",
                                    fatherName: "6",
                                    contactNo: "Sea Hawk",
                                    dob: "Route",
                                }
                            ]} paginator rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}>
                                <Column sortable field="id" header="Vehicle" body={(rowData) => (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        setVisibleLeft(true);
                                    }}>
                                        SWIFT DZIRE
                                    </a>
                                )}></Column>
                                <Column field="" header="Vehicle Type"></Column>
                                <Column field="" header="Fuel Type"></Column>
                                <Column field="" header="Occupancy"></Column>
                                <Column field="" header="Vendor"></Column>
                                <Column field="dob" header="Scheme"></Column>
                            </DataTable>
                        </div>
                    </div>

                   {/* Prime Sidebar */}
                   <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} showCloseIcon={false} dismissable={false} style={{width:'50%'}}>
                        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
                            <h6 className="sidebarTitle">Edit Vehicle Type</h6>
                            <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                        </div>
                        <div className="sidebarBody">
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <h6 className="sidebarSubTitle">Vehicle Details</h6>
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vehicle</label>
                                    <InputText className="form-control" name="" placeholder="Vehicle" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Cost AC</label>
                                    <InputText className="form-control" name="" placeholder="Cost AC" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Cost Non-AC</label>
                                    <InputText className="form-control" name="" placeholder="Cost Non-AC" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Occupancy</label>
                                    <InputText className="form-control" name="" placeholder="Occupancy" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Vendor</label>
                                    <Dropdown placeholder="Vendor" className="w-100" />
                                </div>
                                <div className="field col-4 mb-3">
                                    <label>Scheme</label>
                                    <InputText className="form-control" name="" placeholder="Scheme" />
                                </div>
                            </div>
                        </div>
                        {/* Fixed button container at bottom of sidebar */}
                        <div className="sidebar-fixed-bottom position-absolute pe-3">
                                    <div className="d-flex gap-3 justify-content-end">
                                        <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                        <Button label="Save Changes" className="btn btn-success" />
                                    </div>
                                </div>
                    </PrimeSidebar>

                </div>
            </div>
        </>
    )
}

export default VehicleTypeMaster;