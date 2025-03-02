import { useState } from "react";
import { Card, CardContent } from "@mui/material";
import { Button, ButtonGroup } from "@mui/material";
import UserDetails from "./UserDetails";
import UpdateDetails from "./UpdateDetails";
import Documents from "./Documents";
import Subscription from "./Subscription";

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState("UserDetails");
    
    const renderComponent = () => {
        switch (activeTab) {
            case "UserDetails":
                return <UserDetails />;
            case "UpdateDetails":
                return <UpdateDetails />;
            case "Documents":
                return <Documents />;
            case "Subscription":
                return <Subscription />;
            default:
                return <UserDetails />;
        }
    };

    return (
        <div style={{ padding: "24px", backgroundColor: "#f5f5f5", minHeight: "100vh", display: "flex", justifyContent: "center" }}>
            <Card style={{ width: "100%", maxWidth: "600px", padding: "16px", boxShadow: "0px 4px 10px rgba(0,0,0,0.1)", borderRadius: "8px" }}>
                <ButtonGroup fullWidth variant="contained" color="primary" style={{ marginBottom: "16px" }}>
                    <Button onClick={() => setActiveTab("UserDetails")} style={{ backgroundColor: activeTab === "UserDetails" ? "#1976d2" : "#e0e0e0" }}>User Details</Button>
                    <Button onClick={() => setActiveTab("UpdateDetails")} style={{ backgroundColor: activeTab === "UpdateDetails" ? "#1976d2" : "#e0e0e0" }}>Update Details</Button>
                    <Button onClick={() => setActiveTab("Documents")} style={{ backgroundColor: activeTab === "Documents" ? "#1976d2" : "#e0e0e0" }}>Documents</Button>
                    <Button onClick={() => setActiveTab("Subscription")} style={{ backgroundColor: activeTab === "Subscription" ? "#1976d2" : "#e0e0e0" }}>Subscription</Button>
                </ButtonGroup>
                <CardContent>
                    {renderComponent()}
                </CardContent>
            </Card>
        </div>
    );
}
