import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Sidebar as PrimeSidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const PenaltyMaster = () => {
  // Dropdown options
  const [facilities, setFacilities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [routeTypes, setRouteTypes] = useState([]);
  
  // Selected filter values
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  
  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addNewPenalty, setAddNewPenalty] = useState(false);
  const [editPenalty, setEditPenalty] = useState(false);
  const [selectedPenalty, setSelectedPenalty] = useState(null);

  const dt = useRef(null);

  // Sample data
  const baseData = useMemo(() => [
    {
      facilityName: 'Delhi HQ',
      vendorName: 'Sea Hawk',
      penaltyName: 'Late Arrival',
      penaltyAmount: 500,
      penaltyFor: 'Driver',
      fromDate: '2025-05-01',
      toDate: '2025-05-03'
    },
    {
      facilityName: 'Gurgaon Center',
      vendorName: 'Eagle Transport',
      penaltyName: 'Vehicle Breakdown',
      penaltyAmount: 1000,
      penaltyFor: 'Vehicle',
      fromDate: '2025-05-02',
      toDate: '2025-05-04'
    }
  ], []);

  // Create the repeated data
  const penaltyData = useMemo(() => 
    Array.from({ length: 10 }, () => baseData).flat(),
  [baseData]);

  useEffect(() => {
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
    
    // Initialize other dropdowns
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

  // Excel export function
  const exportExcel = () => {
    if (dt.current) {
      const fileName = `penalty_list_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchData} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  // Table columns configuration
  const columns = useMemo(() => [
    { 
      field: 'facilityName', 
      header: 'Facility Name',
      body: (rowData) => (
        <a href="#!" 
          onClick={() => {
            setSelectedPenalty(rowData);
            setEditPenalty(true);
          }}
        >
          {rowData.facilityName}
        </a>
      )
    },
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'penaltyName', header: 'Penalty Name' },
    { field: 'penaltyAmount', header: 'Penalty Amount' },
    { field: 'penaltyFor', header: 'Penalty For' },
    { field: 'fromDate', header: 'From Date' },
    { field: 'toDate', header: 'To Date' }
  ], []);

  // Add Form Fields
  // Add form state and validation
  const [formData, setFormData] = useState({
    facility: '',
    vendor: '',
    penaltyName: '',
    penaltyAmount: '',
    penaltyFor: '',
    effectiveDate: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.facility) errors.facility = 'Facility is required';
    if (!formData.vendor) errors.vendor = 'Vendor is required';
    if (!formData.penaltyName.trim()) errors.penaltyName = 'Penalty Name is required';
    if (!formData.penaltyAmount.trim()) errors.penaltyAmount = 'Penalty Amount is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = () => {
    setSubmitted(true);
    if (validateForm()) {
      // Process form submission
      console.log('Form data:', formData);
      // Close sidebar and reset form
      setAddNewPenalty(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      facility: null,
      vendor: null,
      penaltyName: '',
      penaltyAmount: '',
      penaltyFor: null,
      effectiveDate: ''
    });
    setFormErrors({});
    setSubmitted(false);
  };

  const renderAddForm = () => (
    <div className="row">
      <div className="col-6 mb-3">
        <label>Facility <span className="text-danger">*</span></label>
        <Dropdown 
          optionLabel="label" 
          value={formData.facility}
          options={facilities}
          placeholder="Select Facility" 
          className={`w-100 ${submitted && formErrors.facility ? 'p-invalid' : ''}`} 
          filter
          onChange={(e) => handleInputChange('facility', e.value)} 
        />
        {submitted && formErrors.facility && <small className="p-error">{formErrors.facility}</small>}
      </div>
      <div className="col-6 mb-3">
        <label>Vendor <span className="text-danger">*</span></label>
        <Dropdown 
          optionLabel="label" 
          value={formData.vendor}
          options={vendors}
          placeholder="Select Vendor" 
          className={`w-100 ${submitted && formErrors.vendor ? 'p-invalid' : ''}`} 
          filter
          onChange={(e) => handleInputChange('vendor', e.value)} 
        />
        {submitted && formErrors.vendor && <small className="p-error">{formErrors.vendor}</small>}
      </div>
      <div className="col-6 mb-3">
        <label>Penalty Name <span className="text-danger">*</span></label>
        <InputText 
          className={`form-control ${submitted && formErrors.penaltyName ? 'p-invalid' : ''}`} 
          placeholder="Enter Penalty Name"
          value={formData.penaltyName}
          onChange={(e) => handleInputChange('penaltyName', e.target.value)} 
        />
        {submitted && formErrors.penaltyName && <small className="p-error">{formErrors.penaltyName}</small>}
      </div>
      <div className="col-6 mb-3">
        <label>Penalty Amount <span className="text-danger">*</span></label>
        <InputText 
          className={`form-control ${submitted && formErrors.penaltyAmount ? 'p-invalid' : ''}`} 
          placeholder="Enter Penalty Amount"
          value={formData.penaltyAmount}
          onChange={(e) => handleInputChange('penaltyAmount', e.target.value)} 
        />
        {submitted && formErrors.penaltyAmount && <small className="p-error">{formErrors.penaltyAmount}</small>}
      </div>
      <div className="col-6 mb-3">
        <label>Penalty For</label>
        <Dropdown 
          optionLabel="label" 
          value={formData.penaltyFor}
          options={[
            { label: 'Driver', value: 'driver' },
            { label: 'Vehicle', value: 'vehicle' }
          ]}
          placeholder="Select Penalty For" 
          className="w-100" 
          filter
          onChange={(e) => handleInputChange('penaltyFor', e.value)} 
        />
      </div>
      <div className="col-6 mb-3">
        <label>Effective Date</label>
        <InputText 
          className="form-control" 
          placeholder="Enter Effective Date"
          value={formData.effectiveDate}
          onChange={(e) => handleInputChange('effectiveDate', e.target.value)} 
        />
      </div>
    </div>
  );

  return (
    <>
      <Header
        pageTitle="Penalty Master"
        showNewButton={true}
        onNewButtonClick={() => setAddNewPenalty(true)}
      />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Penalty Master</h6>
          </div>
        </div>
        
        {/* Filter Section */}
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
                  <Button label="Search" className="btn btn-primary no-label" onClick={fetchData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="row">
          <div className="col-12">
            <div className="card_tb">
              <DataTable 
                ref={dt}
                value={penaltyData} 
                paginator 
                rows={10} 
                tableStyle={{ minWidth: '50rem' }}
                size="small"
                loading={loading}
                emptyMessage={error ? `Error: ${error}` : "No records found"}
                stripedRows
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} records"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                paginatorLeft={paginatorLeft}
                paginatorRight={paginatorRight}
              >
                {columns.map(col => (
                  <Column 
                    key={col.field} 
                    field={col.field} 
                    header={col.header} 
                    body={col.body} 
                  />
                ))}
              </DataTable>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Penalty Sidebar */}
      <PrimeSidebar
        visible={addNewPenalty}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">Add New Penalty Master</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => setAddNewPenalty(false)}
          />
        </div>
        <div className="sidebarBody">
          {renderAddForm()}
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => setAddNewPenalty(false)}
            />
            <Button 
              label="Save" 
              className="btn btn-success" 
              onClick={handleSave}
            />
          </div>
        </div>
      </PrimeSidebar>

      {/* Edit Penalty Sidebar */}
      <PrimeSidebar
        visible={editPenalty}
        position="right"
        showCloseIcon={false}
        dismissable={false}
        style={{ width: "40%" }}
      >
        <div className="sidebarHeader d-flex justify-content-between align-items-center sidebarTitle p-0">
          <h6 className="sidebarTitle">Edit Penalty Master</h6>
          <Button
            icon="pi pi-times"
            className="p-button-rounded p-button-text"
            onClick={() => setEditPenalty(false)}
          />
        </div>
        <div className="sidebarBody">
          {renderAddForm ()}
        </div>
        <div className="sidebar-fixed-bottom position-absolute pe-3">
          <div className="d-flex gap-3 justify-content-end">
            <Button
              label="Cancel"
              className="btn btn-outline-secondary"
              onClick={() => {
                setEditPenalty(false);
                resetForm();
              }}
            />
            <Button 
              label="Update" 
              className="btn btn-success" 
              onClick={handleSave}
            />
          </div>
        </div>
      </PrimeSidebar>
    </>
  );
};

export default PenaltyMaster;
