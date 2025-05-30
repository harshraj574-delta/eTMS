import React from "react";
import { useState, useEffect } from 'react';
import Sidebar from './Master/SidebarMenu';
import Notifications from './Master/Notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../components/css/style.css';

import { Chart } from 'primereact/chart';

import { Image } from "primereact/image";
import { Button } from 'primereact/button';
import Header from './Master/Header';
const Dashboard = () => {

  const [data, setData] = useState({
    labels: ['Allocated', 'Accepted by drivers', 'Strated', 'Trip Completed '],
    datasets: [
      {
        data: [300, 50, 100, 50],
        backgroundColor: [
          '#3b00ed',
          '#0baa60',
          '#d81b60',
          '#ff9800'
        ],
        hoverBackgroundColor: [
          '#3b00ed',
          '#0baa60',
          '#d81b60',
          '#ff9800'
        ]
      }
    ]
  });

  useEffect(() =>{
    const fetchData = async () =>{
      const url = 'https://jsonplaceholder.typicode.com/comments'
      const dataSet1 = [];
      const dataSet2 = [];
      await fetch(url).then((data) =>{
        console.log("API DATA",data); 
        const res = data.json();
        return res;
      }).then((res) =>{
        console.log("API DATA",res);
        for( const resData of res){
          dataSet1.push(resData.id);
          dataSet2.push(resData.postId); 
        }
        setData({
    labels: ['Allocated', 'Accepted by drivers', 'Strated', 'Trip Completed '],
    datasets: [
      {
        data: [300, 50, 100, 50],
        backgroundColor: [
          '#3b00ed',
          '#0baa60',
          '#d81b60',
          '#ff9800'
        ],
        hoverBackgroundColor: [
          '#3b00ed',
          '#0baa60',
          '#d81b60',
          '#ff9800'
        ]
      }
    ]
  })
        console.log("fetchData", dataSet1, dataSet2);
      }).catch((error) =>{
        console.log("Error", error); 
      })
    }
    fetchData();
  },[]);

  const [doughnutchartData, setdoughnutChartData] = useState({});
  const [doughnutchartOptions, setdoughnutChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const options = {
      cutout: '90%',
      plugins: {
        legend: {
          position: 'bottom',
        }
      }
    };
    setdoughnutChartData(data);
    setdoughnutChartOptions(options);
  },

    []);

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'Auguest', 'September', 'October', 'November', 'December'],
      datasets: [
        {
          type: 'bar',
          label: 'Normal Trips',
          backgroundColor: '#5c92ff',
          data: [50, 25, 12, 48, 90, 76, 42, 10, 35, 67, 34, 89]
        },
        {
          type: 'bar',
          label: 'Adhoc Trips',
          backgroundColor: '#e3a008',
          data: [21, 84, 24, 75, 37, 65, 34, 56, 23, 76, 34, 89]
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        tooltips: {
          mode: 'index',
          intersect: false
        },
        legend: {
          labels: {
            color: textColor
          },
          position: 'bottom'
        },
      },
      scales: {
        x: {
          stacked: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          stacked: true,
          ticks: {
            color: textColorSecondary,
            reverse: true
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setBarChartData(data);
    setBarChartOptions(options);
  }, []);

  const [barChartData, setBarChartData] = useState({});
  const [barChartOptions, setBarChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Shift vs Employee per trip',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: '#63abfd',
          tension: 0.4
        },
        {
          label: 'Shift vs occupancy per trip',
          data: [28, 48, 40, 19, 86, 27, 50],
          fill: false,
          borderColor: '#e697ff',
          tension: 0.4
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        legend: {
          position: 'bottom'
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setLineChartData(data);
    setLineChartOptions(options);
  }, []);

  const [lineChartData, setLineChartData] = useState({});
  const [lineChartOptions, setLineChartOptions] = useState({});





  return (
    <div className="container-fluid p-0">
      {/* Header */}
      <Header pageTitle={"Dashboard"} />

      {/* Sidebar */}
      <Sidebar />

      <div className="middle">
        <div class="row mb-4">
          <div class="col-12 d-flex justify-content-between alimgn-items-center">
            <h6 class="pageTitle">Dashboard</h6>
            <div className="">
              <Button label="Live Map View" severity="success" outlined className="btn btn-outline-success" />
              <Button label="Map Insights" severity="success" outlined className="btn btn-outline-secondary ms-3" />
            </div>
          </div>
        </div>
        {/* Stat Box */}
        <div className="row">
          <div className="col-5 d-flex">
            <div className="cardNew w-100">
              <ul class="">
                <li>
                  <h3><strong>3,543</strong></h3>
                  <span class="subtitle_sm">Routes</span>
                  <span class="overline_text text-warning">24,546 Employees</span>
                </li>
                <li>
                  <h3><strong>02%</strong></h3>
                  <span class="subtitle_sm">Trip Cancellation</span>
                  <span class="overline_text text-success">100% reallocated</span>
                </li>
                <li>
                  <h3><strong>03</strong></h3>
                  <span class="subtitle_sm">Per Trip Employee Avg.</span>
                  <span class="overline_text text-warning">1245 Vehicles</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-7 d-flex">
            <div className="cardNew w-100">
              <ul class="">
                <li>
                  <h3><strong>87%</strong></h3>
                  <span class="subtitle_sm">OTD</span>
                </li>
                <li>
                  <h3><strong>86%</strong></h3>
                  <span class="subtitle_sm">OTA</span>
                </li>
                <li>
                  <h3><strong>100%</strong></h3>
                  <span class="subtitle_sm">Completed</span>
                </li>
                <li>
                  <h3><strong>2.05 hrs</strong></h3>
                  <span class="subtitle_sm text-primary">Avg Trip Time</span>
                </li>
                <li>
                  <h3><strong>234</strong></h3>
                  <span class="subtitle_sm text-warning">Adhoc Trips</span>
                </li>
                <li>
                  <h3><strong>16</strong></h3>
                  <span class="subtitle_sm text-danger">No Shows</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Charts */} 
        <div className="row mt-4">
          <div className="col-4">
            <div className="col-12">
              <div className="cardx border-0 p-3">
                <h6>Route Distribution</h6>
                <hr />
                <Image src="src/assets/heatmap.png" alt="Image" width="100%" />
              </div>
            </div>
          </div>
          <div className="col-8">
            <div className="row">
              <div className="col-6">
                <div className="cardx border-0 p-3">
                  <h6>Shift/Employee/Occupancy per Trip </h6>
                  <hr />
                  <Chart type="line" data={lineChartData} options={lineChartOptions} />
                </div>
              </div>
              <div className="col-6">
                <div className="cardx border-0 p-3">
                  <h6>Smart Insights</h6>
                  <hr />
                  <Image src="src/assets/insights.png" alt="Image" width="100%" />
                </div>
              </div>
              <div className="col-6 mt-4">
                <div className="cardx border-0 p-3">
                  <h6>Normal vs Adhoc Trips</h6>
                  <hr />
                  <Chart type="bar" data={barChartData} options={barChartOptions} />
                </div>
              </div>
              <div className="col-6 mt-4">
                <div className="cardx border-0 p-3">
                  <h6>Shift Completion Vs Pending</h6>
                  <hr />
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <Chart type="doughnut" data={doughnutchartData} options={doughnutchartOptions} className="w-full md:w-30rem" />
                    {/* <div style={{
                      position: 'absolute',
                      top: '56%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}>
                      84% <br /> Allocation
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
export default Dashboard;