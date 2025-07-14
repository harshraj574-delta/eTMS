import { useState, useEffect } from "react";
import { apiService } from "../../../services/api";
import { Chart } from "primereact/chart";

const RiNormalAdhoc = ({ filter }) => {
  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue("--text-color");
    const textColorSecondary = documentStyle.getPropertyValue("--text-color-secondary");
    const surfaceBorder = documentStyle.getPropertyValue("--surface-border");

    const fetchNormalAdhoc = async () => {
      try {
        const obj = {
          sDate: filter.sDate,
          eDate: filter.eDate,
          locationid: filter.locationid || null,
          facilityid: filter?.facilityid || null,
          vendorid: filter?.vendorid || null,
          triptype: filter?.triptype || null,
        };

        const res = await apiService.GetNormalAdhoc_shiftwise(obj);
        const responseData = JSON.parse(res) || [];

        if (!responseData.length) {
          setBarChartData({});
          return;
        }

        const convertShiftTimeToLabel = (shiftTime) => {
          const hour = shiftTime.slice(0, 2);
          const minute = shiftTime.slice(2);
          const hourNum = parseInt(hour);
          const ampm = hourNum >= 12 ? "PM" : "AM";
          const hour12 = hourNum % 12 || 12;
          return `${hour12}:${minute} ${ampm}`;
        };

        const labels = responseData.map((item) => convertShiftTimeToLabel(item.shiftTime));
        const normalTrips = responseData.map((item) => item.NornalTripCount); // fixed typo
        const adhocTrips = responseData.map((item) => item.AdhocTripcount);

        setBarChartData({
          labels,
          datasets: [
            {
              type: "bar",
              label: "Normal Trips",
              backgroundColor: "#5c92ff",
              data: normalTrips,
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
            {
              type: "bar",
              label: "Adhoc Trips",
              backgroundColor: "#e3a008",
              data: adhocTrips,
              barPercentage: 0.6,
              categoryPercentage: 0.6,
            },
          ],
        });

        setBarChartOptions({
          maintainAspectRatio: false,
          aspectRatio: 0.58,
          plugins: {
            tooltips: { mode: "index", intersect: false },
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
        console.error("Error fetching Normal vs Adhoc chart data:", err);
        setBarChartData({});
      }
    };

    if (filter?.sDate && filter?.eDate) {
      fetchNormalAdhoc();
    }
  }, [filter]);

  return (
    <div className="cardx border-0 p-3">
      <h6>Normal vs Adhoc Trips</h6>
      <hr />
      <Chart
        type="bar"
        data={barChartData}
        options={barChartOptions}
        className="w-full md:w-30rem"
      />
    </div>
  );
};

export default RiNormalAdhoc;
