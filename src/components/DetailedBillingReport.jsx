import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const DetailedBillingReport = () => {
  // States for filters
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dt = useRef(null);

  // Define base data with useMemo
  const baseData = useMemo(() => [
    {
      shiftDate: '05 May 2025',
      planVendorName: 'Prakriti',
      actVendorName: 'Prakriti',
      vehicleNo: 'DL52GD2302',
      tripType: 'Pickup',
      routeId: '014142R0001',
      routeNo: '12A',
      location: 'Gurgaon, DLF City Phase 3-Gurgaon',
      billingZone: 'Gurugram',
      routeZone: 'Gurugram',
      logInOut: '08:00 AM',
      actLogInOut: '08:05 AM',
      deployedVehicleType: 'Xpress T ',
      billingVehicleType: '4 Seater',
      totCapacity: 6,
      schedulePax: 5,
      actPax: 5,
      noShowPax: 0,
      fuelType: 'Diesel',
      fuelRate: 6.5,
      cost: 1200,
      tollName: 'DND',
      tollCost: 100,
      guardCost: 150,
      totalCost: 1450,
      tripSheetUpdated: 'Yes'
    },
    // Second record with same data
    {
      shiftDate: '05 May 2025',
      planVendorName: 'Prakriti',
      actVendorName: 'Prakriti',
      vehicleNo: 'DL52GD2302',
      tripType: 'Pickup',
      routeId: '014142R0001',
      routeNo: '12A',
      location: 'Gurgaon, DLF City Phase 3-Gurgaon',
      billingZone: 'Gurugram',
      routeZone: 'Gurugram',
      logInOut: '08:00 AM',
      actLogInOut: '08:05 AM',
      deployedVehicleType: 'Xpress T ',
      billingVehicleType: '4 Seater',
      totCapacity: 6,
      schedulePax: 5,
      actPax: 5,
      noShowPax: 0,
      fuelType: 'Diesel',
      fuelRate: 6.5,
      cost: 1200,
      tollName: 'DND',
      tollCost: 100,
      guardCost: 150,
      totalCost: 1450,
      tripSheetUpdated: 'Yes'
    }
  ], []);

  // Define table columns
  const columns = useMemo(() => [
    { field: 'shiftDate', header: 'Shift Date' },
    { field: 'planVendorName', header: 'Plan Vendor Name' },
    { field: 'actVendorName', header: 'Act Vendor Name' },
    { field: 'vehicleNo', header: 'Vehicle No' },
    { field: 'tripType', header: 'Trip Type' },
    { field: 'routeId', header: 'Route Id' },
    { field: 'routeNo', header: 'Route No' },
    { field: 'location', header: 'Location' },
    { field: 'billingZone', header: 'Billing Zone' },
    { field: 'routeZone', header: 'Route Zone' },
    { field: 'logInOut', header: 'Log In Out' },
    { field: 'actLogInOut', header: 'Act Log In Out' },
    { field: 'deployedVehicleType', header: 'Deployed Vehicle Type' },
    { field: 'billingVehicleType', header: 'Billing Vehicle Type' },
    { field: 'totCapacity', header: 'Tot Capacity' },
    { field: 'schedulePax', header: 'Schedule Pax' },
    { field: 'actPax', header: 'Act Pax' },
    { field: 'noShowPax', header: 'No Show Pax' },
    { field: 'fuelType', header: 'Fuel Type' },
    { field: 'fuelRate', header: 'Fuel Rate' },
    { field: 'cost', header: 'Cost' },
    { field: 'tollName', header: 'Toll Name' },
    { field: 'tollCost', header: 'Toll Cost' },
    { field: 'guardCost', header: 'Guard Cost' },
    { field: 'totalCost', header: 'Total Cost' },
    { field: 'tripSheetUpdated', header: 'Trip Sheet Updated' }
  ], []);

  // Create the repeated data
  const billingData = useMemo(() => 
    Array.from({ length: 12 }, () => baseData).flat(),
  [baseData]);

  useEffect(() => {
    fetchData();
    
    // Mock data for facility dropdown
    setFacilities([
      { label: 'Facility 1', value: 'facility1' },
      { label: 'Facility 2', value: 'facility2' }
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
      const fileName = `detailed_billing_report_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  const refreshData = () => {
    fetchData();
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={refreshData} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  return (
    <>
      <Header pageTitle="Detailed Billing Report" />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Detailed Billing Report</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2 mb-3">
                  <label>Start Date</label>
                  <Calendar 
                    className="w-100" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.value)}
                    placeholder="Enter Start Date" 
                  />
                </div>

                <div className="col-2 mb-3">
                  <label>End Date</label>
                  <Calendar 
                    className="w-100" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.value)}
                    placeholder="Enter End Date" 
                  />
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
                value={billingData} 
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
                  <Column key={col.field} field={col.field} header={col.header} />
                ))}
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailedBillingReport;
