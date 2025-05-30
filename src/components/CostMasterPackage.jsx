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

const CostMasterPackage = () => {
  // Dropdown options
  const [facilities, setFacilities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [routeTypes, setRouteTypes] = useState([]);
  
  // Selected filter values
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddSidebar, setShowAddSidebar] = useState(false);
  const [showEditSidebar, setShowEditSidebar] = useState(false);
  const [selectedCost, setSelectedCost] = useState(null);

  const dt = useRef(null);

  // Sample data for the table
  const baseData = useMemo(() => [
    {
      zoneName: 'Central Delhi',
      vendor: 'Sea Hawk',
      vehicleType: '4 Seater',
      acCost: 1500,
      nonAcCost: 1200,
      fuelRate: 5.5,
      guardCost: 2,
      days: 5,
      startTime: '08:00 AM',
      endTime: '06:00 PM',
      fromDate: '01 May 2025',
      toDate: 'Ongoing'
    },
    {
      zoneName: 'North Delhi',
      vendor: 'Eagle Transports',
      vehicleType: '6 Seater',
      acCost: 1800,
      nonAcCost: 1500,
      fuelRate: 6.2,
      guardCost: 2.5,
      days: 3,
      startTime: '09:00 AM',
      endTime: '05:00 PM',
      fromDate: '02 May 2025',
      toDate: 'Ongoing'
    }
  ], []);

  // Create repeated data for demonstration
  const costData = useMemo(() => 
    Array.from({ length: 10 }, () => baseData).flat(),
  [baseData]);

  useEffect(() => {
    // Load data on component mount
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

  // Export table data to Excel
  const exportExcel = () => {
    if (dt.current) {
      const fileName = `cost_master_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  // Handle row click to open edit sidebar
  const handleRowClick = (rowData) => {
    setSelectedCost(rowData);
    setShowEditSidebar(true);
  };

  // Zone name column template with clickable link
  const zoneNameTemplate = (rowData) => (
    <a href="#" onClick={(e) => {
      e.preventDefault();
      handleRowClick(rowData);
    }}>
      {rowData.zoneName}
    </a>
  );

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchData} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  // Shared form for both Add and Edit sidebars
  const renderCostForm = (isEdit) => (
    <div className="row">
      <div className="col-6 mb-3">
        <label>Facility <span>*</span></label>
        <Dropdown optionLabel="name" placeholder="Select Facility" className="w-100" filter />
      </div>
      <div className="col-6 mb-3">
        <label>Zone Name <span>*</span></label>
        <Dropdown optionLabel="name" placeholder="Select Zone Name" className="w-100" filter />
      </div>
      <div className="col-6 mb-3">
        <label>Vendor <span>*</span></label>
        <Dropdown optionLabel="name" placeholder="Select Vendor" className="w-100" filter />
      </div>
      <div className="col-6 mb-3">
        <label>Vehicle Type</label>
        <Dropdown optionLabel="name" placeholder="Select Vehicle Type" className="w-100" filter />
      </div>
      <div className="col-6 mb-3">
        <label>Effective Date</label>
        <Calendar className="w-100" />
      </div>
      <div className="col-6 mb-3">
        <label>AC Cost <span>*</span></label>
        <InputText className="form-control" placeholder="Enter AC Cost" />
      </div>
      <div className="col-6 mb-3">
        <label>Non-AC Cost <span>*</span></label>
        <InputText className="form-control" placeholder="Enter Non-AC Cost" />
      </div>
      <div className="col-6 mb-3">
        <label>Fuel Rate <span>*</span></label>
        <InputText className="form-control" placeholder="Enter Fuel Rate" />
      </div>
      <div className="col-6 mb-3">
        <label>Guard Rate <span>*</span></label>
        <InputText className="form-control" placeholder="Enter Guard Rate" />
      </div>
      <div className="col-6 mb-3">
        <label>Days <span>*</span></label>
        <InputText className="form-control" placeholder="Enter Days" />
      </div>
      <div className="col-6 mb-3">
        <label>Shift Start Time</label>
        <Dropdown optionLabel="name" placeholder="Select Shift Start Time" className="w-100" filter />
      </div>
      <div className="col-6 mb-3">
        <label>Shift End Time</label>
        <Dropdown optionLabel="name" placeholder="Select Shift End Time" className="w-100" filter />
      </div>
    </div>
  );

  return (
    <>
      <Header
        pageTitle="Cost Master"
        showNewButton={true}
        onNewButtonClick={() => setShowAddSidebar(true)}
      />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Cost Master Package</h6>
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
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                <Column field="zoneName" header="Zone Name" sortable body={zoneNameTemplate} />
                <Column field="vendor" header="Vendor" sortable />
                <Column field="vehicleType" header="Vehicle Type" sortable />
                <Column field="acCost" header="AC Cost" sortable />
                <Column field="nonAcCost" header="Non-AC Cost" sortable />
                <Column field="fuelRate" header="Fuel Rate" sortable />
                <Column field="guardCost" header="Guard Cost" sortable />
                <Column field="days" header="Days" sortable />
                <Column field="startTime" header="Start Time" sortable />
                <Column field="endTime" header="End Time" sortable />
                <Column field="fromDate" header="From Date" sortable />
                <Column field="toDate" header="To Date" sortable />
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Cost sidebar */}
      <PrimeSidebar
        visible={showAddSidebar}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">Add New Cost Master Package</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => setShowAddSidebar(false)}
          />
        </div>
        <div className="sidebarBody">
          {renderCostForm(false)}
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => setShowAddSidebar(false)}
            />
            <Button label="Save" className="btn btn-success" />
          </div>
        </div>
      </PrimeSidebar>

      {/* Edit Cost sidebar */}
      <PrimeSidebar
        visible={showEditSidebar}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">{selectedCost?.zoneName || 'Edit Cost'}</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => setShowEditSidebar(false)}
          />
        </div>
        <div className="sidebarBody">
          {renderCostForm(true)}
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => setShowEditSidebar(false)}
            />
            <Button label="Update" className="btn btn-success" />
          </div>
        </div>
      </PrimeSidebar>
    </>
  );
};

export default CostMasterPackage;
