import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Chart } from "primereact/chart";

const RiDropSafeChart = ({ filter }) => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [dropSafeData, setDropSafeData] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const obj = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: filter.locationid || null, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
          triptype: filter?.triptype || null, // selectedTripType 
        };
        const res = await apiService.GetDropSafe_shiftwise(obj);
        const apiData = typeof res === "string" ? JSON.parse(res) : res || [];
        const shiftTimeToLabel = (shiftTime) => {
          if (!shiftTime) return "";
          const hour = parseInt(shiftTime.slice(0, 2), 10);
          const minute = shiftTime.slice(2);
          const ampm = hour >= 12 ? "PM" : "AM";
          const hour12 = hour % 12 === 0 ? 12 : hour % 12;
          return minute === "00"
            ? `${hour12}${ampm}`
            : `${hour12}:${minute}${ampm}`;
        };
        const labels = apiData.map((entry) =>
          shiftTimeToLabel(entry.shiftTime)
        );
        const values = apiData.map((entry) => entry.totalDropSafe || 0);
        setChartData({
          labels,
          datasets: [
            {
              label: "Drop Safe Overview",
              data: values,
              backgroundColor: "#5fbbd7",
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
          ],
        });
        setChartOptions({
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
                fontSize: "14px",
                boxWidth: 20,
              },
              position: "bottom",
            },
          },
          scales: {
            x: { ticks: { color: "#999" }, grid: { color: "#ddd" } },
            y: {
              beginAtZero: true,
              ticks: { color: "#999" },
              grid: { color: "#ddd" },
            },
          },
        });
      } catch (err) {
        setChartData({});
      }
    };

    fetchChartData();
  }, [filter]);

  // Drop Safe count
  useEffect(() => {
    const fetchDropSafeData = async () => {
      try {
        const credentials = {
          sDate: filter.sDate, // selectedPeriod
          eDate: filter.eDate, // selectedPeriod
          locationid: 1, // selCity
          facilityid: filter?.facilityid || null, // selFacility
          vendorid: filter?.vendorid || null, // selVendor
          triptype: filter?.triptype || null, // selectedTripType
        };
        const responseData = await apiService.GetDropSafecount(credentials);
        let parsedData =
          typeof responseData === "string"
            ? JSON.parse(responseData)
            : responseData;
        setDropSafeData(parsedData);
      } catch (err) {
        setDropSafeData([]);
      }
    };
    fetchDropSafeData();
  }, [filter]);

  return (
    <div className="cardx border-0 p-3">
      <div className="d-flex justify-content-between align-items-center border-0">
        <h6>Drop Safe Overview</h6>
        <h4 className="d-flex">
          {dropSafeData[0]?.totalDropSafe ?? 0}
          <span className="overline_text d-flex ms-2 align-items-center">
            <span className="text-success me-1">
              <img src="images/icons/arrow-up.png" alt="" />{" "}
              {dropSafeData[0]?.DropsafeDiffper ?? 0}%
            </span>
            vs yesterday
          </span>
        </h4>
        {/* <select className="form-select form-select-map">
          <option value="">Today</option>
          <option value="">This Week</option>
          <option value="">This Month</option>
        </select> */}
      </div>
      <hr />
      {chartData ? (
        <Chart type="bar" data={chartData} options={chartOptions} />
      ) : (
        <p className="text-center text-muted">No data available for chart.</p>
      )}
    </div>
  );
};

export default RiDropSafeChart;
