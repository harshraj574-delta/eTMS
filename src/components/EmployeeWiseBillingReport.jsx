import React, { useState, useEffect, useMemo, useRef } from "react";
import Header from "./Master/Header";
import Sidebar from "./Master/SidebarMenu";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton"; // Add 

// Add this import at the top of your file
  import * as XLSX from 'xlsx';

const EmployeeWiseBillingReport = () => {
  // Dropdown options
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
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 // Add this skeleton template function
  const skeletonTemplate = () => {
    return <Skeleton width="100%" height="1rem" />
  };
  

  const dt = useRef(null);

  // Define sample data with useMemo
  const baseData = useMemo(() => [
    {
      facilityName: 'GGN',
      shiftDate: '01 Apr 2025',
      tripType: 'Pick',
      shiftTime: '08:00 AM',
      vendorName: 'Prakriti',
      vehicleType: 'Xpress T ',
      routeId: '014108R0001',
      employeeId: 'C51618',
      employeeName: 'Yatender Verma',
      managerId: '75015',
      managerName: 'Amit Kishore',
      gender: 'M',
      processName: 'Zinnia Building',
      travelStatus: 'Boarded',
      tripCost: 1200,
      guardCost: 200,
      perEmpGuardCost: 40,
      actPax: 5,
      noShowPax: 0,
      totalCost: 1400,
      perEmpTotalCost: 280
    },
    {
      facilityName: 'Nodia',
      shiftDate: '01 Apr 2025',
      tripType: 'Drop',
      shiftTime: '08:00 AM',
      vendorName: 'Delta',
      vehicleType: 'Xpress T ',
      routeId: '014108R0001',
      employeeId: 'C51618',
      employeeName: 'Yatender Verma',
      managerId: '75015',
      managerName: 'Amit Kishore',
      gender: 'F',
      processName: 'Zinnia Building',
      travelStatus: 'Boarded',
      tripCost: 1200,
      guardCost: 200,
      perEmpGuardCost: 40,
      actPax: 5,
      noShowPax: 0,
      totalCost: 1400,
      perEmpTotalCost: 280
    }], []);

  const columns = useMemo(() => [
    { field: 'facilityName', header: 'Facility Name' },
    { field: 'shiftDate', header: 'Shift Date' },
    { field: 'tripType', header: 'Trip Type' },
    { field: 'shiftTime', header: 'Shift Time' },
    { field: 'vendorName', header: 'Vendor Name' },
    { field: 'vehicleType', header: 'Vehicle Type' },
    { field: 'routeId', header: 'Route Id' },
    { field: 'employeeId', header: 'Employee Id' },
    { field: 'employeeName', header: 'Employee Name' },
    { field: 'managerId', header: 'Manager Id' },
    { field: 'managerName', header: 'Manager Name' },
    { field: 'gender', header: 'Gender' },
    { field: 'processName', header: 'Process Name' },
    { field: 'travelStatus', header: 'Travel Status' },
    { field: 'tripCost', header: 'Trip Cost' },
    { field: 'guardCost', header: 'Guard Cost' },
    { field: 'perEmpGuardCost', header: 'Per Emp Guard Cost' },
    { field: 'actPax', header: 'Act Pax' },
    { field: 'noShowPax', header: 'No Show Pax' },
    { field: 'totalCost', header: 'Total Cost' },
    { field: 'perEmpTotalCost', header: 'Per Emp Total Cost' }
  ], []);

  // Create the repeated data with useMemo
  const costData = useMemo(() => 
    Array.from({ length: 100 }, () => baseData).flat(),
  [baseData]);
  
  // Gender cell template
  const genderTemplate = (rowData) => {
    if (rowData.gender === 'M') {
      return <span className="badge bg-primary-subtle rounded-pill text-dark text-uppercase">{rowData.gender}</span>;
    } else if (rowData.gender === 'F') {
      return <span className="badge bg-danger-subtle rounded-pill text-dark text-uppercase">{rowData.gender}</span>;
    }
    return rowData.gender;
  };

  // Trip Type cell template
  const tripTypeTemplate = (rowData) => {
    if (rowData.tripType === 'Pick') {
      return <span className="badge text-bg-primary rounded-pill text-uppercase">{rowData.tripType}</span>; 
    } else if (rowData.tripType === 'Drop') {
      return <span className="badge text-bg-danger rounded-pill text-uppercase">{rowData.tripType}</span>;
    }
  }

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

  const exportExcel = () => {
    if (dt.current) {
      // Get the current date for the filename
      const fileName = `employee_billing_report_${new Date().toISOString().slice(0,10)}`;      
      // Get the data from the DataTable
      const data = dt.current.props.value;      
      // Create a worksheet
      const worksheet = XLSX.utils.json_to_sheet(data);      
      // Create a workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Employee Billing");      
      // Generate Excel file and trigger download
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
  };

  const [rowsPerPage, setRowsPerPage] = useState(50);
  
  const excelButton = <Button label="" icon="pi pi-download" size="small" text onClick={exportExcel} className="btn btn-outline-dark d-flex ms-auto" />
  const paginatorLeft = <Button type="button" icon="pi pi-refresh" text onClick={fetchData} />;
  const paginatorRight = (
    <>
      <span className="mx-2">Rows per page:</span>
      <Dropdown 
        options={[50, 100, 200]} 
        value={rowsPerPage} 
        onChange={(e) => setRowsPerPage(e.value)} 
        className="p-dropdown-sm"
      />
    </>
  );

  // Add this state to track scroll position
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Add this useEffect to handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };    
    window.addEventListener('scroll', handleScroll);    
    // Clean up the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <Header mainTitle="Transport" pageTitle="Employee Wise Billing Report" showNewButton={true} />
      <Sidebar />
      <div className="middle px-0">
      <div className={`filterBx ${isScrolled ? 'filterShadow' : ''}`}>
        <div className="row">
                <div className="col-2">
                  {/* <label>Start Date</label> */}
                  <Calendar className="w-100" placeholder="Enter Start Date" />
                </div>

                <div className="col-2">
                  {/* <label>End Date</label> */}
                  <Calendar className="w-100" placeholder="Enter End Date" />
                </div>
                
                <div className="col-2">
                  {/* <label htmlFor="facility">Facility</label> */}
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
                  <Button label="Search" className="btn btn-primary" onClick={fetchData} />
                </div>
                <div className="col-4 text-center">
                {excelButton}
                </div>
              </div>
        </div>

        <div className="p-3">
        <div className="row d-none">
          <div className="col-6">
            <h6 className="pageTitle">Employee Wise Billing Report</h6>
          </div>
          <div className="col-12 text-end d-flex justify-content-end align-items-center">
          {excelButton}
          </div>
        </div>
        <div className="row d-none">
          <div className="col-12">
            <div className="card_tb p-3">
              <div className="row">
                <div className="col-2">
                  {/* <label>Start Date</label> */}
                  <Calendar className="w-100" placeholder="Enter Start Date" />
                </div>

                <div className="col-2">
                  {/* <label>End Date</label> */}
                  <Calendar className="w-100" placeholder="Enter End Date" />
                </div>
                
                <div className="col-2">
                  {/* <label htmlFor="facility">Facility</label> */}
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
                  <Button label="Search" className="btn btn-primary" onClick={fetchData} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="card_tb mt-0">
              <DataTable 
                ref={dt}
                value={loading ? Array(50).fill({}) : costData} 
                paginator 
                rows={rowsPerPage} 
                tableStyle={{ minWidth: '50rem' }}
                size="small"
                //loading={loading}
                emptyMessage={error ? `Error: ${error}` : "No records found"}
                stripedRows
                scrollable
                //scrollHeight="800px"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
                paginatorLeft={<>
                  <span>Showing {costData.length > 0 ? '1' : '0'} to {Math.min(rowsPerPage, costData.length)} of {costData.length} employees</span>
                </>}
                paginatorRight={paginatorRight}
              >
                {columns.map(col => {
                  if (col.field === 'gender') {
                    return <Column key={col.field} field={col.field} header={col.header} body={loading ? skeletonTemplate : genderTemplate} />;
                  } else if (col.field === 'tripType') {
                    return <Column key={col.field} field={col.field} header={col.header} body={loading ? skeletonTemplate : tripTypeTemplate} />;
                  }
                  return <Column key={col.field} field={col.field} header={col.header} body={loading ? skeletonTemplate : null} />;
                })}
              </DataTable>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};
export default EmployeeWiseBillingReport;
