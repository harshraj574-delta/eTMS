import React, { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "./Master/SidebarMenu";
import Header from "./Master/Header";
import { apiService } from "../services/api";

import { Calendar } from "primereact/calendar";
import { AutoComplete } from "primereact/autocomplete";
import { classNames } from 'primereact/utils';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from 'primereact/dropdown';
import { Checkbox } from 'primereact/checkbox';
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { RadioButton } from 'primereact/radiobutton';
import { FilterMatchMode } from "primereact/api";
import { Sidebar as PrimeSidebar } from "primereact/sidebar"; // Renamed to avoid conflict with your Sidebar component
import { get } from "lodash";
import sessionManager from "../utils/SessionManager";

function ManageEmployee() {
    const [employees, setEmployees] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [visibleLeft, setVisibleLeft] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState('');
    const dt = useRef(null); // Add this line for DataTable reference
    const [processes, setProcesses] = useState([]);
    const [subProcesses, setSubProcesses] = useState([]);
    //const [facility, setFacility] = useState(null);
    const [locations, setLocations] = useState(null);
    const [facilitys, setFacilitys] = useState(null);
    const [allFacilitys, setAllFacilitys] = useState(null);
    useEffect(() => {
        getEmployeeData();
        getManagersList();
        GetProcessByFacility();
    }, []);



    //Get ProcessBy Facility
    const GetProcessByFacility = async () => {
        try {
            setLoading(true);
            const facilityid = sessionManager.getUserSession().FacilityID;
            const response = await apiService.GetProcessByFacility({
                facilityid: facilityid.toString()
            });

            if (Array.isArray(response)) {
                const formattedProcesses = response.map(process => ({
                    label: process.ProcessName || process.processName,
                    value: process.Id
                }));
                setProcesses(formattedProcesses);
            } else {
                setProcesses([]);
            }
        } catch (error) {
            console.error("Error fetching process data:", error);
            setProcesses([]);
        } finally {
            setLoading(false);
        }
    };

    //Get Sub Process
    const GetSubProcess = async (processId) => {
        try {
            setLoading(true);
            //const facilityid = sessionManager.getUserSession().FacilityID;

            // Make API call to get subprocess data
            const response = await apiService.GetSubProcess({
                processid: processId,
            });

            // Format response data if it's an array
            if (Array.isArray(response)) {
                const formattedSubProcesses = response.map(subprocess => ({
                    label: subprocess.subProcessName, // Display name
                    value: subprocess.Id // ID value
                }));
                console.log("formattedSubProcesses: ", formattedSubProcesses);
                // Update state with formatted data
                setSubProcesses(formattedSubProcesses);
            } else {
                // Set empty array if response is not valid
                setSubProcesses([]);
            }
        } catch (error) {
            // Handle any errors that occur during API call
            console.error("Error fetching subprocess data:", error);
            setSubProcesses([]);
        } finally {
            // Reset loading state
            setLoading(false);
        }
    };


    //Get Geo City By RS
    const locationid = async (id) => {
        try {
            setLoading(true);
            const response = await apiService.locationid({
                locationid: id
            });

            console.log("locationid--xxx-->", response);
            if (Array.isArray(response)) {
                const formattedCities = response.map(locations => ({
                    label: locations.City,
                    value: locations.City // Display name
                }));
                console.log("formattedCities: ", formattedCities);
                // Update state with formatted data
                setLocations(formattedCities);
            } else {
                // Set empty array if response is not valid
                setLocations([]);
            }
        } catch (error) {
            console.error("Error fetching location data:", error);

        } finally {
            setLoading(false);
        }
    };

    //selectFacility
    const selectFacility = async (id) => {
        try {
            setLoading(true);
            const response = await apiService.selectFacility({
                Userid: id
            });

            console.log("selectFacility response:", response);
            if (Array.isArray(response)) {
                const formattedFacility = response.map(facility => ({
                    label: facility.facilityName, // Use facility name as label
                    value: facility.Id // Use facility ID as value
                }));
                console.log("Formatted facility data:", formattedFacility);
                setFacilitys(formattedFacility);
            } else {
                console.log("Response is not an array:", response);
                setFacilitys([]);
            }
        } catch (error) {
            console.error("Error fetching facility data:", error);
            setFacilitys([]);
        } finally {
            setLoading(false);
        }
    };

    //selectFacility
    const selectAllFacility = async (id) => {
        try {
            setLoading(true);
            const response = await apiService.selectAllFacility({
                Userid: id
            });

            console.log("selectAllFacility response:", response);
            if (Array.isArray(response)) {
                const formattedAllFacility = response.map(allFacility => ({
                    label: allFacility.facilityName, // Use facility name as label
                    value: allFacility.Id // Use facility ID as value
                }));
                console.log("All facility data:", formattedAllFacility);
                setAllFacilitys(formattedAllFacility);
            } else {
                console.log("Response is not an array:", response);
                setAllFacilitys([]);
            }
        } catch (error) {
            console.error("Error fetching facility data:", error);
            setAllFacilitys([]);
        } finally {
            setLoading(false);
        }
    };





    // Add this function to fetch managers
    const getManagersList = async () => {
        try {
            const response = await apiService.GetManagerList({
                locationid: "",
                empidname: "",
                IsAdmin: ""
            });

            console.log("Managers response:", response);

            // Process the response and set managers state
            if (Array.isArray(response)) {
                const formattedManagers = response.map(manager => ({
                    label: manager.empName || manager.EmpName || manager.userName || manager.UserName || manager.id,
                    value: manager.id || manager.Id || manager.empId || manager.EmpId
                }));
                setManagers(formattedManagers);
            } else if (typeof response === 'string') {
                try {
                    const parsedData = JSON.parse(response);
                    if (Array.isArray(parsedData)) {
                        const formattedManagers = parsedData.map(manager => ({
                            label: manager.empName || manager.EmpName || manager.userName || manager.UserName || manager.id,
                            value: manager.id || manager.Id || manager.empId || manager.EmpId
                        }));
                        setManagers(formattedManagers);
                    }
                } catch (e) {
                    console.error("Error parsing managers data:", e);
                    setManagers([]);
                }
            } else {
                console.error("Unexpected manager response format:", response);
                setManagers([]);
            }
        } catch (error) {
            console.error("Error fetching managers:", error);
            // Use a default or empty array for managers if the API fails
            setManagers([]);
        }
    };
    // Get Employee Data
    const getEmployeeData = async () => {
        try {
            setLoading(true);
            const facilityid = sessionManager.getUserSession().FacilityID;
            console.log("facid", facilityid);
            const response = await apiService.GetEmployeeList({
                facilityid: facilityid
            });
            console.log("EmployeeList", response);
            if (Array.isArray(response)) {
                setEmployees(response);
            } else {
                console.error("Unexpected response format:", response);
            }
        } catch (error) {
            console.error("Error fetching employee data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Add this function to handle search
    const handleEmpSearch = async () => {
        try {
            setLoading(true);
            //const locationId = sessionManager.getUserSession().locationId;
            //console.log("isadmin", sessionManager.getUserSession().locationId);
            const response = await apiService.EmpSearch({
                locationid: sessionManager.getUserSession().locationId,
                empidname: searchKeyword,
                IsAdmin: sessionManager.getUserSession().ISadmin,
            });
            //console.log("Search Results:", response);

            if (Array.isArray(response)) {
                setEmployees(response);
            } else if (response && typeof response === 'string') {
                try {
                    const parsedResponse = JSON.parse(response);
                    if (Array.isArray(parsedResponse)) {
                        setEmployees(parsedResponse);
                    } else {
                        console.error("Parsed response is not an array:", parsedResponse);
                        setEmployees([]);
                    }
                } catch (e) {
                    console.error("Error parsing response:", e);
                    setEmployees([]);
                }
            } else {
                console.error("Unexpected search response format:", response);
                setEmployees([]);
            }
        } catch (error) {
            console.error("Error searching employees:", error);
            setEmployees([]);
        } finally {
            setLoading(false);
        }
    };


    // Open sidebar with employee data
    const openEditSidebar = (employee) => {
        console.log("Employee", employee)
        setSelectedEmployee(employee); // Set selected employee data
        setVisibleLeft(true); // Open sidebar

        if (employee.processId) {
            GetSubProcess(employee.processId);
        }
        if (employee.id) {
            locationid(employee.id);
        }
        if (sessionManager.getUserSession().ISadmin === 'Y') {
            if (employee.id) {
                selectAllFacility(employee.id);
            }
        }
        else {
            if (employee.id) {
                selectFacility(employee.id);
            }
        }



    };

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSelectedEmployee((prev) => ({ ...prev, [name]: value }));
    };

    // Status Badge
    const StatusData = (rowData) => (
        <Badge value={rowData.attrited === "N" ? "Active" : "Inactive"} severity={rowData.attrited === "N" ? "badgee badge_success" : "badgee badge_danger"} />
    );

    // Add debounce function
    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Create memoized search handler
    const handleSearch = useCallback(
        debounce((value) => {
            setFilters({
                global: { value, matchMode: FilterMatchMode.CONTAINS },
            });
        }, 300),
        []
    );

    // Add this function for Excel export
    const exportExcel = () => {
        if (dt && dt.current) {
            dt.current.exportCSV();
        }
    };

    const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() => getEmployeeData()} />;
    const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

    return (
        <>
            <Header pageTitle="Manage Employee" showNewButton={true} />
            <Sidebar />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <h6 className="pageTitle">Manage Emplyoee</h6>
                        <div className="card_tb">

                            <div className="row mb-3">
                                {/* <div className="col-3">
                                    <IconField iconPosition="left">
                                    <InputIcon className="pi pi-search" />
                                    <InputText className="mb-3 p-inputtext-sm" onChange={(e) => handleSearch(e.target.value)} placeholder="Keyword Search" />
                                </IconField>
                                </div> */}
                                <div className="col-3">
                                    {/* <div className="p-inputgroup flex-1">
                                        <InputText
                                            placeholder="Keyword Search"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleEmpSearch()}
                                        />
                                        <Button
                                            icon="pi pi-search"
                                            className="p-button-primary"
                                            onClick={handleEmpSearch}
                                        />
                                    </div> */}

                                    <div className="p-inputgroup m-3 mb-0">
                                        <InputText
                                            placeholder="Keyword Search"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleEmpSearch()}
                                            className="w-100"
                                        />
                                        <span className="p-inputgroup-addon" onClick={handleEmpSearch} style={{ cursor: "pointer" }}>
                                            <i className="pi pi-search"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <DataTable
                                ref={dt}
                                value={employees}
                                loading={loading}
                                paginator
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                filters={filters}
                                //showGridlines
                                //className="p-datatable-gridlines"
                                stripedRows
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                paginatorLeft={paginatorLeft}
                                paginatorRight={paginatorRight}
                                removableSort
                            >
                                <Column sortable field="empCode" header="Employee Id" body={(rowData) => (
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        openEditSidebar(rowData);
                                    }}>
                                        {rowData.empCode}
                                    </a>
                                )}></Column>
                                <Column sortable field="empName" header="Employee Name"></Column>
                                <Column sortable field="ProcessName" header="Process"></Column>
                                <Column sortable field="facilityName" header="Facility Name"></Column>
                                <Column sortable field="email" header="E-mail Address"></Column>
                                <Column sortable field="tptReq" header="TptReq"></Column>
                                <Column sortable header="Status" body={StatusData}></Column>
                                {/* <Column
                                    header="Action"
                                    body={(rowData) => (
                                        <Button label="Edit" className="btn btn-sm btn-outline-warning" onClick={() => openEditSidebar(rowData)} />
                                    )}
                                /> */}
                            </DataTable>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Employee Sidebar */}
            <PrimeSidebar visible={visibleLeft} position="right" onHide={() => setVisibleLeft(false)} width="50%" showCloseIcon={false} dismissable={false}>
                <div className="d-flex justify-content-between align-items-center sidebarTitle p-0">
                    <h6 className="sidebarTitle">{selectedEmployee?.empName || ''} - {selectedEmployee?.empCode || ''}</h6>
                    <Button icon="pi pi-times" className="p-button-rounded p-button-text" onClick={() => setVisibleLeft(false)} />
                </div>
                {selectedEmployee && (
                    <div className="sidebarBody">
                    <div className="row">
                            <div className="col-12 mb-3">
                                <h6 className="sidebarSubTitle">Edit Personal Details</h6>
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Employee Code</label>
                                <InputText className="form-control" name="empid" value={selectedEmployee.empCode || ""} onChange={handleInputChange} />
                        </div>
                            <div className="field col-3 mb-3">
                            <label>Employee Name</label>
                            <InputText className="form-control" name="empName" value={selectedEmployee.empName || ""} onChange={handleInputChange} />
                        </div>
                            <div className="field col-3 mb-3">
                            <label>User Name</label>
                            <InputText className="form-control" name="userName" value={selectedEmployee.userName || ""} onChange={handleInputChange} />
                        </div>

                            <div className="field col-3 mb-3">
                            <label>Gender</label>
                                <div className="d-flex gap-3">
                                    <div className="d-flex align-items-center gap-2">
                                    <RadioButton
                                        inputId="genderMale"
                                        name="Gender"
                                        value="Male"
                                        onChange={handleInputChange}
                                        checked={selectedEmployee.Gender === "Male"}
                                    />
                                        <label htmlFor="ingredient1" className="ml-2">Male</label>
                                </div>
                                    <div className="d-flex align-items-center gap-2">
                                    <RadioButton
                                        inputId="genderFemale"
                                        name="Gender"
                                        value="Female"
                                        onChange={handleInputChange}
                                        checked={selectedEmployee.Gender === "Female"}
                                    />
                                        <label htmlFor="ingredient2" className="ml-2">Female</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field col-3 mb-3">
                            <label>Mobile</label>
                            <InputText className="form-control" name="tptReq" value={selectedEmployee.mobile || ""} onChange={handleInputChange} />
                        </div>
                            <div className="field col-3 mb-3">
                            <label>Phone</label>
                            <InputText className="form-control" name="attrited" value={selectedEmployee.phone || ""} onChange={handleInputChange} />
                        </div>
                            <div className="field col-6 mb-3">
                                <label>Email</label>
                                <InputText className="form-control" name="email" value={selectedEmployee.email || ""} onChange={handleInputChange} />
                            </div>
                            <div className="col-12 my-3">
                                <h6 className="sidebarSubTitle">Edit Transport Details</h6>
                            </div>

                            {/* <div className="field col-3 mb-3">
                                <label className="d-block">Facility</label>
                                <Dropdown value={selectedEmployee.facilityId || ""} onChange={handleInputChange} options={[{ label: 'New York', value: 'NY' }, { label: 'Rome', value: 'RM' }, { label: 'London', value: 'LDN' }, { label: 'Istanbul', value: 'IST' }, { label: 'Paris', value: 'PRS' }]}
                                    placeholder="Select a Facility" className="w-full md:w-14rem w-100" />
                            </div> */}
                            {/* <div className="field col-3 mb-3">
                                <label className="d-block">Facility</label>
                                <Dropdown
                                    name="facilityId"
                                    value={selectedEmployee.facilityId || ""}
                                    onChange={handleInputChange}
                                    options={facility.map(facility => ({
                                        label: facility.facilityName,
                                        value: facility.facilityId
                                    }))}
                                    placeholder="Select a Facility"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No facilities available"
                                    filter
                                />
                            </div> */}
                            <div className="field col-3 mb-3">
                                <label className="d-block">Facility</label>
                                <Dropdown
                                    name="facilities"
                                    value={selectedEmployee.id || ""}
                                    onChange={handleInputChange}
                                    options={facilitys}
                                    placeholder="Select Facility"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No Facility available"
                                    filter
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label className="d-block">Process</label>
                                <Dropdown
                                    name="ProcessName"
                                    value={selectedEmployee.processId || ""}
                                    onChange={handleInputChange}
                                    options={processes}
                                    placeholder="Select a Process"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No Process available"
                                    filter
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Sub Process</label>
                                {/* <InputText className="form-control" name="password" value={selectedEmployee.subProcessId || ""} onChange={handleInputChange} /> */}
                                <Dropdown
                                    name="subProcessName"
                                    value={selectedEmployee.subProcessId || ""}
                                    onChange={handleInputChange}
                                    options={subProcesses}
                                    placeholder="Select a Sub Process"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No Sub Process available"
                                    filter
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label className="d-block">Manager</label>
                                <Dropdown
                                    name="managerId"
                                    value={selectedEmployee.managerId || ""}
                                    onChange={handleInputChange}
                                    options={managers}
                                    filter
                                    placeholder="Select a Manager"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No managers available"
                                />

                            </div>
                            <div className="field col-3 mb-3">
                                <label className="d-block">Medical Case</label>
                                {/* <InputText className="form-control" name="password" value={selectedEmployee.password || ""} onChange={handleInputChange} /> */}

                                <Dropdown
                                    name="MedicalCase"
                                    className="w-full md:w-14rem w-100"
                                    placeholder="Select Medical Case"
                                    options={[
                                        { label: 'No', value: '0' },
                                        { label: 'Family Way', value: '1' },
                                        { label: 'Special Category', value: '2' },
                                    ]}
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Medical Expiry Date</label>
                                <Calendar
                                    name="MedicalExpiryDate"
                                    value={selectedEmployee.MedicalExpiryDate ? new Date(selectedEmployee.MedicalExpiryDate) : null}
                                    onChange={(e) => handleInputChange({
                                        target: {
                                            name: "MedicalExpiryDate",
                                            value: e.value
                                        }
                                    })}
                                    //showIcon
                                    className="w-100"
                                    dateFormat="dd/mm/yy"
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Project Code</label>
                                <InputText className="form-control" name="MedicalCaseDetails" value={selectedEmployee.ProcessName || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Emergency Contact No</label>
                                <InputText className="form-control" name="EmergencyContact" value={selectedEmployee.EmergencyContact || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Emergency Name</label>
                                <InputText className="form-control" name="EmergencyName" value={selectedEmployee.EmergencyName || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label className="d-block">Transport Required</label>
                                <Checkbox checked={selectedEmployee.tptReq === "Y"}
                                    onChange={(e) => handleInputChange({
                                        target: {
                                            name: "tptReq",
                                            value: e.target.checked ? "Y" : "N"
                                        }
                                    })} className=""></Checkbox>
                            </div>
                            <div className="field col-3 mb-3">
                                <label className="d-block">Attrited</label>
                                <Checkbox checked={selectedEmployee.attrited === "Y"}
                                    onChange={(e) => handleInputChange({
                                        target: {
                                            name: "attrited",
                                            value: e.target.checked ? "Y" : "N"
                                        }
                                    })} className=""></Checkbox>

                                {/* <InputText className="form-control" name="attrited" value={selectedEmployee.attrited || ""} onChange={handleInputChange} /> */}
                            </div>
                            <div className="col-12 my-3">
                                <h6 className="sidebarSubTitle">Edit Address Details</h6>
                            </div>
                            <div className="field col-12 mb-3">
                                <label>Address</label>
                                <InputText className="form-control" name="TransportType" value={selectedEmployee.address || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Pincode</label>
                                <InputText className="form-control" name="TransportNumber" value={selectedEmployee.pincode || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>City</label>
                                {/* <InputText className="form-control" name="TransportExpiryDate" value={selectedEmployee.City || ""} onChange={handleInputChange} /> */}
                                <Dropdown
                                    name="subProcessName"
                                    value={selectedEmployee.City || ""}
                                    onChange={handleInputChange}
                                    options={locations}
                                    placeholder="Select City"
                                    className="w-full md:w-14rem w-100"
                                    emptyMessage="No Sub Process available"
                                    filter
                                />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Area</label>
                                <InputText className="form-control" name="TransportContact" value={selectedEmployee.Colony || ""} onChange={handleInputChange} />
                            </div>
                            <div className="field col-3 mb-3">
                                <label>Landmark</label>
                                <InputText className="form-control" name="TransportName" value={selectedEmployee.Landmark || ""} onChange={handleInputChange} />
                            </div>



                            <div className="d-flex gap-3 justify-content-end">
                                <Button label="Cancel" className="btn btn-outline-secondary" onClick={() => setVisibleLeft(false)} />
                                <Button label="Update Changes" className="btn btn-success" onClick={() => setVisibleLeft(false)} />
                            </div>
                        </div>
                    </div>
                )}
            </PrimeSidebar>
        </>
    );
}

export default ManageEmployee;
