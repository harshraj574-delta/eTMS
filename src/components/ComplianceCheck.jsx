import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from 'primereact/checkbox';

const ComplianceCheck = () => {
  // Dropdown options
  const [facilities, setFacilities] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [zones, setZones] = useState([]);
  const [routeTypes, setRouteTypes] = useState([]);
  const [vehicleRegNo, setVehicleRegNo] = useState([]);
  
  // Selected values
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedRouteType, setSelectedRouteType] = useState(null);
  const [selectedVehicleRegNo, setSelectedVehicleRegNo] = useState(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checked, setChecked] = useState(false);

  const dt = useRef(null);

  // Define compliance check items
  const baseData = useMemo(() => [
    {
      Heads: 'First Aid missing',
      Status: <Dropdown options={[]} placeholder="Select Status" />,
      Remark: <InputText className="form-control" placeholder="" />,
      Penalty: '500'
    },
    {
      Heads: 'Seat belt',
      Status: <Dropdown options={[]} placeholder="Select Status" />,
      Remark: <InputText className="form-control" placeholder="" />,
      Penalty: '500'
    }
  ], []);

  // Create the data for table
  const costData = useMemo(() => 
    Array.from({ length: 1 }, () => baseData).flat(),
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

    setVehicleRegNo([
      { label: 'Vehicle 1', value: 'vehicle1' },
      { label: 'Vehicle 2', value: 'vehicle2' },
      { label: 'Vehicle 3', value: 'vehicle3' },
      { label: 'Vehicle 4', value: 'vehicle4' },
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
      const fileName = `compliance_check_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  return (
    <>
      <Header
        pageTitle=""
        showNewButton={true}
      />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Compliance Check</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2">
                  <label>Shift Date</label>
                  <Calendar className="w-100" placeholder="Select Shift Date" />
                </div>
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
                  <label>Vehicle Reg. No.</label>
                  <Dropdown
                    value={selectedVehicleRegNo}
                    options={vehicleRegNo}
                    onChange={(e) => setSelectedVehicleRegNo(e.value)}
                    placeholder="Select Vehicle Reg. No."
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
                rows={10} 
                tableStyle={{ minWidth: '50rem' }}
                size="small"
                loading={loading}
                emptyMessage={error ? `Error: ${error}` : "No records found"}
                stripedRows
              >
                <Column field="Heads" header="Heads"></Column>
                <Column field="Status" header="Status" sortable />
                <Column field="Remark" header="Remark" sortable />
                <Column field="Penalty" header="Penalty" sortable />
              </DataTable>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2 d-flex align-items-center pt-4">
                  <Checkbox 
                    inputId="otherCheck" 
                    checked={checked}
                    onChange={e => setChecked(e.checked)} 
                  />
                  <label htmlFor="otherCheck" className="ms-3">Not in the list, Enter Other!</label>
                </div>
                <div className="col-2">
                  <label>Description</label>
                  <InputText className="form-control" placeholder="Rear light damaged" />
                </div>
                <div className="col-2">
                  <label>Penalty</label>
                  <InputText className="form-control" placeholder="400" />
                </div>
                <div className="col-2 no-label">
                  <Button label="Save" className="btn btn-primary" />
                  <Button label="Cancel" className="btn btn-outline-dark ms-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComplianceCheck;
