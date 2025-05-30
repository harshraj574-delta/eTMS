import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const CostMaster = () => {
  // Separate states for different dropdowns
  const [facilities, setFacilities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [routeTypes, setRouteTypes] = useState([]);

  // Selected values
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState(null);

  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [AddNewCost, setAddNewCost] = useState(false);
  const [EditNewCost, setEditNewCost] = useState(false);

  const dt = useRef(null);

  // Define cost data with useMemo to prevent recreation on each render
  const baseData = useMemo(() => [
    {
      vendor: 'Sea Hawk',
      vehicleType: '4 Seater',
      routeType: 'One-Way',
      zoneName: 'Central Delhi',
      acCost: 1500,
      nonAcCost: 1200,
      fuelRate: 5.5,
      guardCost: 2,
      fromDate: '01 May 2025',
      toDate: '05 May 2025'
    },
    {
      vendor: 'Sea Hawk',
      vehicleType: '4 Seater',
      routeType: 'One-Way',
      zoneName: 'Central Delhi',
      acCost: 1000,
      nonAcCost: 800,
      fuelRate: 6.0,
      guardCost: 2,
      fromDate: '01 May 2025',
      toDate: '05 May 2025'
    }
  ], []);

  // Create the repeated data with useMemo
  const costData = useMemo(() =>
    Array.from({ length: 10 }, () => baseData).flat(),
    [baseData]);

  useEffect(() => {
    // Component mount effect
    fetchData();

    // Mock data for dropdowns
    setFacilities([
      { label: 'Facility 1', value: 'facility1' },
      { label: 'Facility 2', value: 'facility2' }
    ]);

    setVendors([
      { label: 'Vendor 1', value: 'vendor1' },
      { label: 'Vendor 2', value: 'vendor2' }
    ]);

    setVehicleTypes([
      { label: 'Bus', value: 'bus' },
      { label: 'Van', value: 'van' }
    ]);

    setZones([
      { label: 'Zone 1', value: 'zone1' },
      { label: 'Zone 2', value: 'zone2' }
    ]);

    setRouteTypes([
      { label: 'Intercity', value: 'intercity' },
      { label: 'Intracity', value: 'intracity' }
    ]);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      // Add your actual API call here
      setLoading(false);
    } catch (err) {
      setError(err?.message || "An error occurred");
      setLoading(false);
    }
  };

  // Add this function for Excel export
  const exportExcel = () => {
    if (dt.current) {
      const fileName = `employee_list_${new Date().toISOString().slice(0, 10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={() => getEmployeeData()} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  return (
    <>
      <Header
        pageTitle="Cost Master"
        showNewButton={true}
        onNewButtonClick={() => setAddNewCost(true)}
      />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Trip Rate Master</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2">
                  <label htmlFor="facility">Facility</label>
                  <Dropdown
                    id="facility"
                    value={selectedFacility}
                    options={facilities}
                    placeholder="Select Facility"
                    onChange={(e) => setSelectedFacility(e.value)}
                    className="w-100"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="vendor">Vendor</label>
                  <Dropdown
                    id="vendor"
                    value={selectedVendor}
                    options={vendors}
                    placeholder="Select Vendor"
                    onChange={(e) => setSelectedVendor(e.value)}
                    className="w-100"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="vehicleType">Vehicle Type</label>
                  <Dropdown
                    id="vehicleType"
                    value={selectedVehicleType}
                    options={vehicleTypes}
                    placeholder="Select Vehicle Type"
                    onChange={(e) => setSelectedVehicleType(e.value)}
                    className="w-100"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="zone">Zone</label>
                  <Dropdown
                    id="zone"
                    value={selectedZone}
                    options={zones}
                    placeholder="Select Zone"
                    onChange={(e) => setSelectedZone(e.value)}
                    className="w-100"
                  />
                </div>
                <div className="col-2">
                  <label htmlFor="routeType">Route Type</label>
                  <Dropdown
                    id="routeType"
                    value={selectedRouteType}
                    options={routeTypes}
                    placeholder="Select Route Type"
                    onChange={(e) => setSelectedRouteType(e.value)}
                    className="w-100"
                  />
                </div>
                <div className="col-2">
                  <Button label="Search" className="btn btn-primary no-label" onClick={fetchData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card_tb">
              <DataTable
                ref={dt}
                value={costData}
                paginator
                rows={10}
                tableStyle={{ minWidth: '50rem' }}
                size="small"
                loading={loading}
                emptyMessage={error ? `Error: ${error}` : "No records found"}
                stripedRows
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} employees"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                <Column field="vendor" header="Vendor" sortable body={(rowData) => (
                  <a href="#" onClick={setEditNewCost}>{rowData.vendor}</a>
                )}></Column>
                <Column field="vehicleType" header="Vehicle Type" sortable />
                <Column field="routeType" header="Route Type" sortable />
                <Column field="zoneName" header="Zone Name" sortable />
                <Column field="acCost" header="AC Cost" sortable />
                <Column field="nonAcCost" header="Non-AC Cost" sortable />
                <Column field="fuelRate" header="Fuel Rate" sortable />
                <Column field="guardCost" header="Guard Cost" sortable />
                <Column field="fromDate" header="From Date" sortable />
                <Column field="toDate" header="To Date" sortable />
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Cost sidebar */}
      <PrimeSidebar
        visible={AddNewCost}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        {/* Sidebar content */}
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">Add New Cost</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => {
              setAddNewCost(false);
            }}
          />
        </div>
        <div className="sidebarBody">
          <div className="row">
            <div className="col-6 mb-3">
              <label>Facility <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Vendor <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Vehicle Type</label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Effective Date</label>
              <Calendar className="w-100"></Calendar>
            </div>
            <div className="col-6 mb-3">
              <label>Route Zone <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Route Zone" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Route Type <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Route Type" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Ac Cost <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Ac Cost" />
            </div>
            <div className="col-6 mb-3">
              <label>Non-Ac Cost <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Non-Ac Cost" />
            </div>
            <div className="col-6 mb-3">
              <label>Fuel Rate <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Fuel Rate" />
            </div>
            <div className="col-6 mb-3">
              <label>Guard Rate <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Guard Rate" />
            </div>

          </div>
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => {
                setAddNewCost(false);
              }}
            />
            <Button label="Save" className="btn btn-success" />
          </div>
        </div>
      </PrimeSidebar>

      {/* Edit New Cost sidebar */}
      <PrimeSidebar
        visible={EditNewCost}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        {/* Sidebar content */}
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">Sea Hawk</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => {
              setEditNewCost(false);
            }}
          />
        </div>
        <div className="sidebarBody">
          <div className="row">
            <div className="col-6 mb-3">
              <label>Facility <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Vendor <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Vehicle Type</label>
              <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Effective Date</label>
              <Calendar className="w-100"></Calendar>
            </div>
            <div className="col-6 mb-3">
              <label>Route Zone <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Route Zone" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Route Type <span>*</span></label>
              <Dropdown optionLabel="name" placeholder="Select Route Type" className="w-100" filter />
            </div>
            <div className="col-6 mb-3">
              <label>Ac Cost <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Ac Cost" />
            </div>
            <div className="col-6 mb-3">
              <label>Non-Ac Cost <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Non-Ac Cost" />
            </div>
            <div className="col-6 mb-3">
              <label>Fuel Rate <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Fuel Rate" />
            </div>
            <div className="col-6 mb-3">
              <label>Guard Rate <span>*</span></label>
              <InputText className="form-control" name="" placeholder="Enter Guard Rate" />
            </div>

          </div>
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditNewCost(false);
              }}
            />
            <Button label="Save" className="btn btn-success" />
          </div>
        </div>
      </PrimeSidebar>
    </>
  );
};

export default CostMaster;
