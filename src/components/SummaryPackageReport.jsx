import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const SummaryPackageReport = () => {
  // Separate states for different dropdowns
  const [facilities, setFacilities] = useState([]);
  
  // Selected values
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const dt = useRef(null);

  // Define cost data with useMemo to prevent recreation on each render
  const baseData = useMemo(() => [
    {
      vendorName: 'Sea Hawk',
      zone: 'Central',
      vehicleType: '4 Seater',
      billCode: 'BILL-001',
      cost: 1500,
      workingDays: 5,
      totalCost: 7500,
      additionalCost: 300
    },
    {
      vendorName: 'Eagle Transport',
      zone: 'North',
      vehicleType: '6 Seater',
      billCode: 'BILL-002',
      cost: 1800,
      workingDays: 4,
      totalCost: 7200,
      additionalCost: 500
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

  // Function for Excel export
  const exportExcel = () => {
    if (dt.current) {
      const fileName = `summary_package_report_${new Date().toISOString().slice(0,10)}`;
      dt.current.exportCSV({ fileName });
    }
  };

  const handleSubmit = () => {
    fetchData();
    // Add logic to filter data based on selected criteria
  };

  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchData} />;
  const paginatorRight = <Button type="button" icon="pi pi-download" text onClick={exportExcel} />;

  const columns = useMemo(() => [
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'zone', header: 'Zone' },
    { field: 'vehicleType', header: 'Vehicle Type' },
    { field: 'billCode', header: 'Bill Code' },
    { field: 'cost', header: 'Cost' },
    { field: 'workingDays', header: 'Working Days' },
    { field: 'totalCost', header: 'Total Cost' },
    { field: 'additionalCost', header: 'Additional Cost' }
  ], []);

  return (
    <>
      <Header pageTitle="Summary Package Report" />
      <Sidebar />
      <div className="middle">
        <div className="row">
          <div className="col-12">
            <h6 className="pageTitle">Summary Package Billing Report</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-md-2 mb-3">
                  <label>From Date</label>
                  <Calendar 
                    className="w-100" 
                    value={fromDate}
                    onChange={(e) => setFromDate(e.value)}
                    placeholder="Enter From Date" 
                  />
                </div>

                <div className="col-md-2 mb-3">
                  <label>To Date</label>
                  <Calendar 
                    className="w-100" 
                    value={toDate}
                    onChange={(e) => setToDate(e.value)}
                    placeholder="Enter To Date" 
                  />
                </div>
                <div className="col-md-2 mb-3">
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

export default SummaryPackageReport;
