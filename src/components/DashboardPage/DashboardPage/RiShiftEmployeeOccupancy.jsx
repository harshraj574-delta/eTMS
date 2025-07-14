import { useState, useEffect } from "react";
import { apiService } from "../../services/api";
import { Chart } from "primereact/chart";

const RiShiftEmployeeOccupancy = ({ filter }) => {
  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});

  useEffect(() => {
    const fetchOccupancyData = async () => {
      
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || null, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
          triptype: filter?.triptype || null, // selectedTripType
        };

        const response = await apiService.GetEmpOccupancy(filter);
        console.log("Raw API Response =>", response);

        let data = [];

        // Handle array, object, or string formats safely
        if (Array.isArray(response)) {
          data = response;
        } else if (Array.isArray(response?.data)) {
          data = response.data;
        } else if (typeof response === "string") {
          try {
            const parsed = JSON.parse(response);
            if (Array.isArray(parsed)) {
              data = parsed;
            }
          } catch (e) {
            console.error("Failed to parse string response:", e);
          }
        }

        if (!Array.isArray(data) || data.length === 0) {
          console.warn("No data to display");
          return;
        }

        // Convert "2100" to "9 PM"
        const formatTime = (timeStr) => {
          const hour = parseInt(timeStr.substring(0, 2), 10);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 || 12;
          return `${hour12} ${ampm}`;
        };

        const labels = data.map((item) => formatTime(item.shifttime));
        const employeeData = data.map((item) => Number(item.totalemplyee) || 0);
        const occupancyData = data.map((item) => Number(item.totaloccupancy) || 0);

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue("--text-color");
        const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
        const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

        setLineChartData({
          labels,
          datasets: [
            {
              label: "Employee per Trip",
              data: employeeData,
              fill: false,
              borderColor: "#63abfd",
              backgroundColor: "#63abfd",
              tension: 0.4,
              yAxisID: 'y',
            },
            {
              label: "Occupancy per Trip",
              data: occupancyData,
              fill: false,
              borderColor: "#e697ff",
              backgroundColor: "#e697ff",
              tension: 0.4,
              yAxisID: 'y1',
            },
          ],
        });

        setLineChartOptions({
          stacked: false,
          maintainAspectRatio: false,
          aspectRatio: 0.6,
          plugins: {
            legend: {
              labels: {
                color: textColor,
                usePointStyle: true,
                pointStyle: "circle",
              },
              position: "bottom",
            },
          },
          scales: {
            x: {
              ticks: { color: textColorSecondary },
              grid: { color: surfaceBorder },
            },
            y: {
              beginAtZero: true,
              suggestedMax: Math.max(...employeeData, ...occupancyData) + 1,
              ticks: { color: textColorSecondary },
              grid: { color: surfaceBorder },
              position: 'left',
            },
            y1: {
              beginAtZero: true,
              suggestedMax: Math.max(...employeeData, ...occupancyData) + 1,
              ticks: { color: textColorSecondary },
              grid: { color: surfaceBorder },
              position: 'right',
            },
          },
        });
      } catch (error) {
        console.error("Error fetching occupancy data:", error);
      }
    };

    if (filter?.sDate && filter?.eDate) {
      fetchOccupancyData();
    }
  }, [filter]);

  return (
    <div className="cardx border-0 p-3">
      <div className="d-flex justify-content-between align-items-center border-0">
        <h6>Shift/Employee/Occupancy per Trip</h6>
      </div>
      <hr />
      <Chart
        type="line"
        data={lineChartData}
        options={lineChartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
};

export default RiShiftEmployeeOccupancy;
