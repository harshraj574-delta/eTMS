import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Chart } from "primereact/chart";

const RiPickDrop = ({ filter }) => {
  const [barChartData1, setBarChartData1] = useState({});
  const [barChartOptions1, setBarChartOptions1] = useState({});
  // Pick/Drop Trips Chart
  useEffect(() => {
    const fetchDataAndPrepareChart = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || null, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
          triptype: filter?.triptype || null, // selectedTripType
        };
        const res = await apiService.GetPickDropcount_shiftwise(obj);
        const apiData = JSON.parse(res) || [];
        const shiftTimeToHourLabel = (shiftTime) => {
          if (!shiftTime) return "";
          const hour = parseInt(shiftTime.slice(0, 2), 10);
          const minute = shiftTime.slice(2);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 === 0 ? 12 : hour % 12;
          return minute === "00"
            ? `${hour12}${ampm}`
            : `${hour12}:${minute}${ampm}`;
        };
        const timeLabels = apiData.map((entry) =>
          shiftTimeToHourLabel(entry.shiftTime)
        );
        const pickupCounts = apiData.map((entry) => entry.totalpickup || 0);
        const dropCounts = apiData.map((entry) => entry.totaldrop || 0);
        const documentStyle = getComputedStyle(document.documentElement);
        const textColorSecondary = documentStyle.getPropertyValue(
          "--text-color-secondary"
        );
        const surfaceBorder =
          documentStyle.getPropertyValue("--surface-border");
        setBarChartData1({
          labels: timeLabels,
          //labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [
            {
              type: "bar",
              label: "Pick Trips",
              backgroundColor: "#3377ff",
              data: pickupCounts,
              //data: [50, 25, 12, 48, 90, 76, 42],
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
            {
              type: "bar",
              label: "Drop Trips",
              backgroundColor: "#ea7878",
              data: dropCounts,
              //data: [21, 84, 24, 75, 37, 65, 34],
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
          ],
        });
        setBarChartOptions1({
          maintainAspectRatio: false,
          aspectRatio: 0.8,
          plugins: {
            tooltip: { mode: "index", intersect: false },
            legend: {
              labels: {
                color: "#000",
                usePointStyle: true,
                pointStyle: "circle",
                padding: 30,
                fontSize: "24px",
                boxWidth: 20,
              },
              position: "bottom",
            },
          },
          scales: {
            x: {
              stacked: true,
              ticks: { color: textColorSecondary },
              grid: { color: surfaceBorder },
            },
            y: {
              stacked: true,
              ticks: { color: textColorSecondary, reverse: true },
              grid: { color: surfaceBorder },
            },
          },
        });
      } catch (err) {
        setBarChartData1({});
      }
    };
    fetchDataAndPrepareChart();
  }, [filter]);

  return (
    <div className="cardx border-0 p-3">
      <div className="d-flex align-items-center justify-content-between">
        <h6>Pick/Drop Trips</h6>
        {/* <select name="" id="" className="form-select form-select-map">
          <option value="">Today</option>
          <option value="">This Week</option>
          <option value="">This Month</option>
        </select> */}
      </div>
      <hr />
      <Chart
        type="bar"
        data={barChartData1}
        options={barChartOptions1}
        className="w-full md:w-30rem"
      />
    </div>
  );
};

export default RiPickDrop;
