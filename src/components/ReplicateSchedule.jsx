import React from "react";
import SidebarMenu from "./Master/SidebarMenu";
import Header from "./Master/Header";

function ReplicateSchedule() {
    return (
        <>
            <Header />
            <SidebarMenu />
            <div className="middle">
                <div className="row">
                    <div className="col-12">
                        <div class="card_tb">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>G</th>
                                        <th>T</th>
                                        <th>EmpName</th>
                                        <th>Mon 17-March</th>
                                        <th>Tue 18-March</th>
                                        <th>Wed 19-March</th>
                                        <th>Thur 20-March</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>TMP123</td>
                                        <td>Anurag Singh</td>
                                        <td>Zinnia Building</td>
                                        <td>Hyderabad</td>
                                        <td>dkumar@cyberdelta.com</td>
                                        <td>car</td>
                                        <td><div class="badgee badge_success d-inline-block">Active</div></td>
                                        <td>Edit</td>
                                    </tr>
                                    <tr>
                                        <td>TMP123</td>
                                        <td>Anurag Singh</td>
                                        <td>Zinnia Building</td>
                                        <td>Hyderabad</td>
                                        <td>dkumar@cyberdelta.com</td>
                                        <td>car</td>
                                        <td><span class="badgee badge_danger">Inactive</span></td>
                                        <td>Edit</td>
                                    </tr>
                                    <tr>
                                        <td>TMP123</td>
                                        <td>Anurag Singh</td>
                                        <td>Zinnia Building</td>
                                        <td>Hyderabad</td>
                                        <td>dkumar@cyberdelta.com</td>
                                        <td>car</td>
                                        <td><div class="badgee badge_success d-inline-block">Active</div></td>
                                        <td>Edit</td>
                                    </tr>
                                    <tr>
                                        <td>TMP123</td>
                                        <td>Anurag Singh</td>
                                        <td>Zinnia Building</td>
                                        <td>Hyderabad</td>
                                        <td>dkumar@cyberdelta.com</td>
                                        <td>car</td>
                                        <td><div class="badgee badge_success d-inline-block">Active</div></td>
                                        <td>Edit</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReplicateSchedule;