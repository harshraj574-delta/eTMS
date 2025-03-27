import React, { useState, useEffect } from "react";
import Sidebar from "../Master/SidebarMenu";
import Notifications from "../Master/Notifications";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.bundle.min.js";
// import "../css/style.css";
import Header from "../Master/Header";
import { apiService } from "../../services/api";
import sessionManager from "../../utils/SessionManager.js";
import { toastService } from '../../services/toastService';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext";

const FacilityMaster = () => {
    const [facilityData, setFacilityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showOffcanvas, setShowOffcanvas] = useState(false);
    const [newFacility, setNewFacility] = useState("");
    const [selectedFacility, setSelectedFacility] = useState(null);
    const [location, setLocationData] = useState([]);
    const [facilityContactData, setFacilityContactData] = useState([]);
    const [facContactLocation, setfacContactLocation] = useState([]);


    useEffect(() => {
        fetchFacilityData();
        BindFacilityContactList();
        BindLocationList();
        BindFacilityContactLevelList();
    }, []);

    const BindFacilityContactLevelList = async () => {
        try {
            const response = await apiService.GetFacility({
                locationid: 0,
            });

            setfacContactLocation(response);
        }
        catch (error) {
            console.error("Error fetching locationlist:", error);
        }
    };

    const BindLocationList = async () => {
        try {
            const response = await apiService.SelectLocation({
                Userid: 0,
            });

            setLocationData(response);
        }
        catch (error) {
            console.error("Error fetching locationlist:", error);
        }
    };

    const BindFacilityContactList = async () => {
        try {
            const response = await apiService.GetLevelDetail({
                locationid: 0,//sessionManager.getUserSession().locationId,
            });
            setFacilityContactData(response);
        }
        catch (error) {
            console.error("Error fetching locationlist:", error);
        }
    };



    const fetchFacilityData = async () => {
        try {
            setLoading(true);
            console.log(sessionManager.getUserSession());

            if (sessionManager.getUserSession().ISadmin === "Y") {
                const response = await apiService.SelectAllFacility({
                });
                console.log(response);
                setFacilityData(response);
            }
            else {
                const response = await apiService.SelectFacility({
                    Userid: sessionManager.getUserSession().Userid,
                });
                console.log(response);
                setFacilityData(response);
            }


        } catch (error) {
            console.error("Error fetching facilities:", error);
            setFacilityData([]);
            toastService.error("Error fetching facilities");
        } finally {
            setLoading(false);
        }
    };

    const handleNewFacility = () => {
        setShowOffcanvas(true);
    };

    const handleSaveFacility = async () => {
        if (document.getElementById('txtfacilityName').value.trim() === '') {
            toastService.warn('Please Enter Facility Name');
            return;
        }
        else if (document.getElementById('ddlLocation').value === '0') {
            toastService.warn('Please Select Location');
            return;
        }

        const locationSelect = document.getElementById('ddlLocation');
        const selectedLocationText = locationSelect.options[locationSelect.selectedIndex].text;

        try {
            setLoading(true);
            const apiresponse = await apiService.InsertFacility({
                facility: document.getElementById('txtfacilityName').value.trim(),
                geoX: 0,
                geoY: 0,
                tptEmail: document.getElementById('txtHelpdeskemail').value.trim(),
                tptContactNo: document.getElementById('txtContactNo').value.trim(),
                locationId: locationSelect.value,
                locationName: selectedLocationText,
                ShiftInchargeMail: document.getElementById('txtTeamLeademail').value.trim(),
                SiteLeadMail: document.getElementById('txtManageremail').value.trim(),
                CityLeadMail: document.getElementById('txtSiteLeadEmail').value.trim(),
            });

            if (apiresponse[0].result === 1) {
                toastService.success('Data Saved Successfully');
                // Clear all form fields
                document.getElementById('txtfacilityName').value = '';
                document.getElementById('txtContactNo').value = '';
                document.getElementById('ddlLocation').value = '0';
                document.getElementById('txtHelpdeskemail').value = '';
                document.getElementById('txtTeamLeademail').value = '';
                document.getElementById('txtManageremail').value = '';
                document.getElementById('txtSiteLeadEmail').value = '';
                setNewFacility('');
                setShowOffcanvas(false);

                const offcanvasElement = document.getElementById('raise_Feedback');
                const closeButton = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
                if (closeButton) {
                    closeButton.click();
                }

                await fetchFacilityData();
            } else {
                toastService.warn('Facility Name Already Exists');
            }
        } catch (error) {
            console.error("Error saving facility:", error);
            toastService.error("Error saving facility");
        } finally {
            setLoading(false);
        }
    };

    const fetchFacilityForEdit = async (facilityName, facilityId, tptContactNo, locationId, tptEmail, ShiftInchargeMail, SiteLeadMail, LocLeadMail) => {
        try {
            setSelectedFacility({
                facilityName: facilityName,
                Id: facilityId,
                tptContactNo: tptContactNo,
                locationId: locationId,
                tptEmail: tptEmail,
                ShiftInchargeMail: ShiftInchargeMail,
                SiteLeadMail: SiteLeadMail,
                LocLeadMail: LocLeadMail
            });
        } catch (error) {
            console.error("Error setting facility for edit:", error);
            toastService.error("Error loading facility for edit");
        }
    };

    const handleEditFacility = async () => {
        if (!selectedFacility || !selectedFacility.facilityName.trim()) {
            toastService.warn('Please Enter Valid Facility Name');
            return;
        }
        else if (document.getElementById('ddleditLocation').value === '0') {
            toastService.warn('Please Select Location');
            return;
        }

        try {
            setLoading(true);
            const locationSelect = document.getElementById('ddleditLocation');
            const selectedLocationText = locationSelect.options[locationSelect.selectedIndex].text;

            const response = await apiService.UpdateFacility({
                facility: selectedFacility.facilityName,
                geoX: 0,
                geoY: 0,
                tptEmail: selectedFacility.tptEmail,
                tptContactNo: selectedFacility.tptContactNo,
                Id: selectedFacility.Id,
                locationId: selectedFacility.locationId,
                locationName: selectedLocationText,
                ShiftInchargeMail: selectedFacility.ShiftInchargeMail,
                SiteLeadMail: selectedFacility.SiteLeadMail,
                CityLeadMail: selectedFacility.LocLeadMail,
            });

            if (response[0].result === 1) {
                toastService.success('Facility Updated Successfully');
                // Close the offcanvas using data-bs-dismiss
                const offcanvasElement = document.getElementById('FacilityEdit');
                const closeButton = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
                if (closeButton) {
                    closeButton.click();
                }
                await fetchFacilityData();
            } else {
                toastService.warn('Facility Name Already Exists');
            }
        } catch (error) {
            console.error("Error updating facility:", error);
            toastService.error("Error updating facility");
        } finally {
            setLoading(false);
        }
    };

    const handleContactSave = async () => {
        try {
            setLoading(true);
            if (document.getElementById('ddlContactLocation').value === '0') {
                toastService.warn('Please Select Location');
                return;
            }
            else if (document.getElementById('ddlLevel').value === '0') {
                toastService.warn('Please Select Level');
                return;
            }
            else if (document.getElementById('txtContactName').value.trim() === '') {
                toastService.warn('Please Enter Contact Name');
                return;
            }

            const response = await apiService.AddLevelDetails({
                ContactName: document.getElementById('txtContactName').value.trim(),
                ContactNo: document.getElementById('txtLevelContactNo').value.trim(),
                Email: document.getElementById('txtContactEmail').value.trim(),
                LocationId: document.getElementById('ddlContactLocation').value,
                Level: document.getElementById('ddlLevel').value,
            });

            if (response[0].result === 1) {
                toastService.success('Data Saved Successfully');

            } else {
                toastService.success('Data Updated Successfully');
            }

            // Close the offcanvas using data-bs-dismiss
            const offcanvasElement = document.getElementById('AddFacilityContact');
            const closeButton = offcanvasElement.querySelector('[data-bs-dismiss="offcanvas"]');
            if (closeButton) {
                closeButton.click();
            }
            await BindFacilityContactList();
            document.getElementById('txtContactName').value = '';
            document.getElementById('ddlContactLocation').value = '0';
            document.getElementById('txtContactEmail').value = '';
            document.getElementById('txtLevelContactNo').value = '';
            document.getElementById('ddlLevel').value = '0';
        }
        catch (error) {
            console.error("Error updating facility Contact details:", error);
            toastService.error("Error updating facility Contact details");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid p-0">
            <Header pageTitle={"Facility Master"} showNewButton={true} onNewClick={handleNewFacility} />
            <Sidebar />

            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle">Facility Master <small>Allows to View, Edit and Add New Facility.</small></h6>
                    </div>
                    <div className="col-lg-12">
                        <div className="card_tb text-center">
                            <DataTable value={facilityData} loading={loading}>
                                <Column field="facilityName" header="Facility Name" body={(rowData) => (
                                    <a
                                        href="#!"
                                        className="btn-text text-decoration-none"
                                        data-bs-toggle="offcanvas"
                                        data-bs-target="#FacilityEdit"
                                        aria-controls="offcanvasRight"
                                        onClick={() =>
                                            fetchFacilityForEdit(facility.facilityName, facility.Id, facility.tptContactNo, facility.locationId, facility.tptEmail, facility.ShiftInchargeMail, facility.SiteLeadMail, facility.LocLeadMail)
                                        }
                                    >
                                        {rowData.facilityName}
                                    </a>
                                )}
                                ></Column>
                                {/* <Column field="facilityName" header="Facility Name"></Column> */}
                                <Column field="tptContactNo" header="Helpdesk Contact No"></Column>
                                <Column field="locationName" header="Location"></Column>
                                <Column field="tptEmail" header="Helpdesk Email"></Column>
                                <Column field="ShiftInchargeMail" header="Team Lead Email [SEV1]"></Column>
                                <Column field="SiteLeadMail" header="Manager Email [SEV2]"></Column>
                                <Column field="LocLeadMail" header="Site Lead Email [SEV3]"></Column>
                            </DataTable>
                            {/* <div className="table-responsive">
                                <table className="table" id="tbFacility">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-center" style={{ minWidth: '100px' }}>Facility Name</th>
                                            <th className="text-center" style={{ minWidth: '100px' }}>Helpdesk Contact No</th>
                                            <th className="text-center" style={{ minWidth: '100px' }}>Location</th>
                                            <th className="text-center" style={{ minWidth: '150px' }}>Helpdesk Email</th>
                                            <th className="text-center" style={{ minWidth: '150px' }}>Team Lead Email [SEV1]</th>
                                            <th className="text-center" style={{ minWidth: '150px' }}>Manager Email [SEV2]</th>
                                            <th className="text-center" style={{ minWidth: '150px' }}>Site Lead Email [SEV3]</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilityData.map((facility, index) => (
                                            <tr key={index}>
                                                <td className="text-center">
                                                    <a
                                                        href="#!"
                                                        className="btn-text text-decoration-none"
                                                        data-bs-toggle="offcanvas"
                                                        data-bs-target="#FacilityEdit"
                                                        aria-controls="offcanvasRight"
                                                        onClick={() =>
                                                            fetchFacilityForEdit(facility.facilityName, facility.Id,facility.tptContactNo,facility.locationId,facility.tptEmail,facility.ShiftInchargeMail,facility.SiteLeadMail,facility.LocLeadMail)
                                                        }
                                                    >
                                                        {facility.facilityName}
                                                    </a>
                                                </td>
                                                <td className="text-center">{facility.tptContactNo}</td>
                                                <td className="text-center">{facility.locationName}</td>
                                                <td className="text-center">{facility.tptEmail}</td>
                                                <td className="text-center">{facility.ShiftInchargeMail}</td>
                                                <td className="text-center">{facility.SiteLeadMail}</td>
                                                <td className="text-center">{facility.LocLeadMail}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="card_tb">
                            <div className="d-flex p-3">
                                <InputText placeholder="Search Any Value" />

                                <button className="btn btn-outline-primary ms-auto" data-bs-toggle="offcanvas" data-bs-target="#AddFacilityContact" aria-controls="offcanvasRight">
                                    <span className="material-icons">add_circle</span>
                                </button>
                            </div>
                            <div className="table-responsive">
                                <DataTable value={facilityContactData} loading={loading}>
                                    <Column field="locationName" header="Location"></Column>
                                    <Column field="Level" header="Level"></Column>
                                    <Column field="ContactName" header="Name"></Column>
                                    <Column field="ContactNo" header="Contact No"></Column>
                                    <Column field="Email" header="Email"></Column>
                                </DataTable>
                                {/* <table className="table" id="tbFacilityContact">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="text-center">Location</th>
                                            <th className="text-center">Level</th>
                                            <th className="text-center">Name</th>
                                            <th className="text-center">Contact No</th>
                                            <th className="text-center">Email
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {facilityContactData.map((facility, index) => (
                                            <tr key={index}>

                                                <td className="text-center">{facility.locationName}</td>
                                                <td className="text-center">{facility.Level}</td>
                                                <td className="text-center">{facility.ContactName}</td>
                                                <td className="text-center">{facility.ContactNo}</td>
                                                <td className="text-center">{facility.Email}</td>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table> */}
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Offcanvas Component */}
            <div
                tabIndex="-1"
                className="offcanvas offcanvas-end"
                id="raise_Feedback"
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
                    <h5 className="subtitle fw-normal">Add New Facility</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowOffcanvas(false)} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <label htmlFor="facilityName" className="form-label">Facility Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="txtfacilityName"
                            value={newFacility}
                            onChange={(e) => setNewFacility(e.target.value)}
                            placeholder="Enter facility name"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ContactNo" className="form-label">Contact No</label>
                        <input
                            type="number"
                            className="form-control"
                            id="txtContactNo"
                            placeholder="Enter Contact No"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Location" className="form-label">Location</label>
                        <select
                            className="form-control"
                            id="ddlLocation"
                            placeholder="Enter Location"
                        >
                            <option value="0">Select Location</option>
                            {location.map((loc, index) => (
                                <option key={index} value={loc.Id}>{loc.locationName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="HelpdeskEmail" className="form-label">Helpdesk Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="txtHelpdeskemail"
                            placeholder="Enter Help desk Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="TeamLeadEmail" className="form-label">Team Lead Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="txtTeamLeademail"
                            placeholder="Enter Team Lead Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ManagerEmail" className="form-label">Manager Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="txtManageremail"
                            placeholder="Enter Manager Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="SiteLeadEmail" className="form-label">Site Lead Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="txtSiteLeadEmail"
                            placeholder="Enter Site Lead Email"
                        />
                    </div>
                </div>
                <div className="offcanvas-footer">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                        Cancel
                    </button>
                    <button
                        className="btn btn-success mx-3"
                        onClick={handleSaveFacility}>
                        Save
                    </button>
                </div>
            </div>

            {/* Edit Facility Offcanvas */}
            <div
                className="offcanvas offcanvas-end"
                tabIndex="-1"
                id="FacilityEdit"
                aria-labelledby="offcanvasRightLabel"
            >
                <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
                    <h5 className="subtitle fw-normal">Edit Facility</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        data-bs-dismiss="offcanvas"
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {selectedFacility && (
                        <div>
                            <div className="mb-3">
                                <label htmlFor="editFacilityName" className="form-label">Facility Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="editFacilityName"
                                    value={selectedFacility.facilityName}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, facilityName: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ContactNo" className="form-label">Contact No</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="txteditContactNo"
                                    value={selectedFacility.tptContactNo}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, tptContactNo: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="Location" className="form-label">Location</label>
                                <select
                                    className="form-control"
                                    id="ddleditLocation"
                                    value={selectedFacility.locationId}
                                    onChange={(e) => setSelectedFacility({
                                        ...selectedFacility,
                                        locationId: e.target.value
                                    })}
                                >
                                    <option value="0">Select Location</option>
                                    {location.map((loc, index) => (
                                        <option key={index} value={loc.Id}>{loc.locationName}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="HelpdeskEmail" className="form-label">Helpdesk Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="txteditHelpdeskemail"
                                    placeholder="Enter Help desk Email"
                                    value={selectedFacility.tptEmail}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, tptEmail: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="TeamLeadEmail" className="form-label">Team Lead Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="txteditTeamLeademail"
                                    placeholder="Enter Team Lead Email"
                                    value={selectedFacility.ShiftInchargeMail}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, ShiftInchargeMail: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="ManagerEmail" className="form-label">Manager Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="txteditManageremail"
                                    placeholder="Enter Manager Email"
                                    value={selectedFacility.SiteLeadMail}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, SiteLeadMail: e.target.value })}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="SiteLeadEmail" className="form-label">Site Lead Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="txteditSiteLeadEmail"
                                    placeholder="Enter Site Lead Email"
                                    value={selectedFacility.LocLeadMail}
                                    onChange={(e) => setSelectedFacility({ ...selectedFacility, LocLeadMail: e.target.value })}
                                />
                            </div>
                        </div>
                    )}
                </div>
                <div className="offcanvas-footer">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                        Cancel
                    </button>
                    <button
                        className="btn btn-success mx-3"
                        onClick={handleEditFacility}>
                        Save
                    </button>
                </div>
            </div>


            {/* Offcanvas Component for Facility Contact Level*/}
            <div
                tabIndex="-1"
                className="offcanvas offcanvas-end"
                id="AddFacilityContact"
                aria-labelledby="offcanvasRightLabel">
                <div className="offcanvas-header bg-secondary text-white offcanvas-header-lg">
                    <h5 className="subtitle fw-normal">Add New Contact Level</h5>
                    <button type="button" className="btn-close btn-close-white" onClick={() => setShowOffcanvas(false)} data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <div className="mb-3">
                        <label htmlFor="Location" className="form-label">Location</label>
                        <select
                            className="form-control"
                            id="ddlContactLocation"
                            placeholder="Enter Location"
                        >
                            <option value="0">Select Location</option>
                            {facContactLocation.map((loc, index) => (
                                <option key={index} value={loc.Id}>{loc.FullName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Level" className="form-label">Level</label>
                        <select
                            className="form-control"
                            id="ddlLevel"
                            placeholder="Enter Location"
                        >
                            <option value="0">Select Level</option>
                            <option value="level 1">level 1</option>
                            <option value="level 2">level 2</option>
                            <option value="level 3">level 3</option>
                            <option value="level 4">level 4</option>
                            <option value="level 5">level 5</option>
                            <option value="level 6">level 6</option>
                            <option value="level 7">level 7</option>
                            <option value="level 8">level 8</option>
                            <option value="level 9">level 9</option>
                            <option value="level 10">level 10</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ContactName" className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="txtContactName"
                            placeholder="Enter Contact Name"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ContactNo" className="form-label">Contact No</label>
                        <input
                            type="number"
                            className="form-control"
                            id="txtLevelContactNo"
                            placeholder="Enter Contact No"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="ContactEmail" className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="txtContactEmail"
                            placeholder="Enter Email"
                        />
                    </div>

                </div>
                <div className="offcanvas-footer">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="offcanvas">
                        Cancel
                    </button>
                    <button
                        className="btn btn-success mx-3"
                        onClick={handleContactSave}>
                        Save
                    </button>
                </div>
            </div>


            {/* Backdrop */}
            {showOffcanvas && (
                <div
                    className="offcanvas-backdrop show"
                    onClick={() => setShowOffcanvas(false)}
                ></div>
            )}
        </div>
    );
};

export default FacilityMaster;