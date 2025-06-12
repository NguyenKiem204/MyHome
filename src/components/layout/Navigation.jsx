import React, { useState, useEffect } from "react";
import { BottomNavigation } from "zmp-ui";
import { Home, User, MessageSquare, FileText, Grid } from "lucide-react";
import { useNavigate, useLocation } from "zmp-ui";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const currentPath = location.pathname;
    let newActiveTab = "home";

    if (currentPath.startsWith("/profile")) {
      newActiveTab = "profile";
    } else if (currentPath.startsWith("/feedback")) {
      newActiveTab = "feedback";
    } else if (currentPath.startsWith("/blogs")) {
      newActiveTab = "blogs";
    } else if (currentPath.startsWith("/services")) {
      newActiveTab = "services";
    } else if (currentPath === "/") {
      newActiveTab = "home";
    }

    if (activeTab !== newActiveTab) {
      setActiveTab(newActiveTab);
    }
  }, [location.pathname, activeTab]);

  const handleNavChange = (selected) => {
    switch (selected) {
      case "home":
        navigate("/");
        break;
      case "profile":
        navigate("/profile");
        break;
      case "feedback":
        navigate("/feedback");
        break;
      case "blogs":
        navigate("/blogs");
        break;
      case "services":
        navigate("/services");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={(key) => handleNavChange(key)}
      style={{ zIndex: 1000 }}
    >
      <BottomNavigation.Item
        key="home"
        label="Trang chủ"
        icon={<Home size={24} />}
      />
      <BottomNavigation.Item
        key="profile"
        label="Cá nhân"
        icon={<User size={24} />}
      />
      <BottomNavigation.Item
        key="feedback"
        label="Phản ánh"
        icon={<MessageSquare size={24} />}
      />
      <BottomNavigation.Item
        key="blogs"
        label="Blog"
        icon={<FileText size={24} />}
      />
      <BottomNavigation.Item
        key="services"
        label="Tiện ích"
        icon={<Grid size={24} />}
      />
    </BottomNavigation>
  );
};

export default Navigation;