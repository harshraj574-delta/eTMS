import { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { apiService } from "../../../services/api";
 // Update path if needed
import { ProgressBar } from "primereact/progressbar";
const RiShiftCompletionPending = ({ filter }) => {
  const [doughnutchartData, setDoughnutChartData] = useState({});
  const [doughnutchartOptions, setDoughnutchartOptions] = useState({});
  const [isAllZero, setIsAllZero] = useState(false);
  const [chartValues, setChartValues] = useState([]);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await apiService.getShiftCompletePending({
          sDate: filter.sDate,
          eDate: filter.eDate,
          locationid: filter.locationid || null,
          facilityid: filter?.facilityid || null,
          vendorid: filter?.vendorid || null,
          triptype: filter?.triptype || null,
        });

        let responseData = [];

        if (typeof res === "string") {
          try {
            responseData = JSON.parse(res);
          } catch (err) {
            console.error("Invalid JSON from API", err);
            return;
          }
        } else {
          responseData = res;
        }

        const data = responseData[0] || {};

        // 🔹 Actual count values (not percentages)
        const total = Number(data?.TotalRoutes ?? 0);
        const allocated = Number(data?.Allocated ?? 0);
        const accepted = Number(data?.Accepted ?? 0);
        const started = Number(data?.VehicleStart ?? 0);
        const completed = Number(data?.VehicleEnd ?? 0);

        const values = [total, allocated, accepted, started, completed];
        const labels = [
          "Total Routes",
          "Allocated",
          "Accepted by Drivers",
          "Started",
          "Trip Completed",
        ];
        const colors = ["#9e9e9e", "#3b00ed", "#0baa60", "#d81b60", "#ff9800"];

        setIsAllZero(values.every((v) => v === 0));
        setChartValues(
          labels.map((label, index) => ({
            label,
            value: values[index],
            color: colors[index],
          }))
        );

        setDoughnutChartData({
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: colors,
              hoverBackgroundColor: colors,
            },
          ],
        });

        setDoughnutchartOptions({
          cutout: "90%",
          plugins: {
            legend: {
              display: false,
            },
          },
        });
      } catch (error) {
        console.error("Error fetching shift data", error);
      }
    };

    fetchChartData();
  }, [filter]);

  return (
    <div className="cardx border-0 p-3">
      <h6>Shift Completion Progress</h6>
      <hr />

      <div className="row py-5 mt-5 d-flex align-items-center">
        <div className="col-8">
          {/* <Chart
            type="doughnut"
            data={doughnutchartData}
            options={doughnutchartOptions}
            className="w-full md:w-30rem"
          /> */}
        </div>
        <div className="col-12 px-0">
          {!isAllZero && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm p-3">
              {chartValues.map((item, idx) => (
                <div key={idx} className="flex flex-col mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <small style={{ fontSize: "12px" }}>{item.label}:</small>
                    <small style={{ fontSize: "12px", fontWeight: 'bold' }}>
                      {item.value}
                    </small>
                  </div>
                  <ProgressBar
                    value={item.value}
                    style={{ height: "6px" }}
                    color={item.color}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isAllZero && (
        <p className="text-muted mt-2 text-sm">
          Note: All values are currently zero for this period.
        </p>
      )}
    </div>
  );
};

export default RiShiftCompletionPending;
