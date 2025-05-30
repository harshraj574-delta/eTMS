import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const VendorWiseBilling = () => {
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
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dt = useRef(null);

  // Sample data for the table
  const baseData = useMemo(() => [
    {
      vendorName: 'Sea Hawk',
      zoneName: 'Central Delhi',
      vehicleType: '4 Seater',
      scRoute: 10,
      scheduleRate: 150,
      scheduleAmount: 1500,
      guardCount: 2,
      guardAmount: 200,
      unSchedule: 2,
      unscheduleAmount: 300,
      tollCost: 100,
      grandTotal: 2100
    },
    {
      vendorName: 'Eagle Transport',
      zoneName: 'North Delhi',
      vehicleType: '6 Seater',
      scRoute: 8,
      scheduleRate: 180,
      scheduleAmount: 1440,
      guardCount: 1,
      guardAmount: 100,
      unSchedule: 1,
      unscheduleAmount: 200,
      tollCost: 50,
      grandTotal: 1790
    }
  ], []);

  const columns = useMemo(() => [
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'zoneName', header: 'Zone Name' },
    { field: 'vehicleType', header: 'Vehicle Type' },
    { field: 'scRoute', header: 'Sc Route' },
    { field: 'scheduleRate', header: 'Schedule Rate' },
    { field: 'scheduleAmount', header: 'Schedule Amount' },
    { field: 'guardCount', header: 'Guard Count' },
    { field: 'guardAmount', header: 'Guard Amount' },
    { field: 'unSchedule', header: 'Unscheduled' },
    { field: 'unscheduleAmount', header: 'Unscheduled Amount' },
    { field: 'tollCost', header: 'Toll Cost' },
    { field: 'grandTotal', header: 'Grand Total' }
  ], []);

  // Create the repeated data with useMemo
  const costData = useMemo(() => 
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
      const fileName = `vendor_billing_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchData} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  return (
    <>
      <Header pageTitle="Vendor Wise Billing" />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Vendor Wise Billing Report</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-md-2 col-sm-6 mb-3">
                  <label>From Date</label>
                  <Calendar 
                    className="w-100" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.value)}
                    placeholder="Enter From Date" 
                  />
                </div>

                <div className="col-md-2 col-sm-6 mb-3">
                  <label>To Date</label>
                  <Calendar 
                    className="w-100" 
                    value={toDate}
                    onChange={(e) => setToDate(e.value)}
                    placeholder="Enter To Date" 
                  />
                </div>
                
                <div className="col-md-2 col-sm-6 mb-3">
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
                
                <div className="col-md-2 col-sm-6 mb-3">
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

        <div className="row mt-3">
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
                rowsPerPageOptions={[10, 25, 50]}
              >
                {columns.map(col => (
                  <Column key={col.field} field={col.field} header={col.header} sortable />
                ))}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VendorWiseBilling;
