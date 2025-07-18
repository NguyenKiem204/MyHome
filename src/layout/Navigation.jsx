import React, { useState, useEffect } from "react";
import { BottomNavigation } from "zmp-ui";
import { Home, User, MessageSquare, Bell, Grid } from "lucide-react";
import { useNavigate, useLocation } from "zmp-ui";

const Navigation = ({ onNotificationClick, notificationCount }) => {
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
      case "services":
        navigate("/services");
        break;
      case "notifications":
        if (onNotificationClick) onNotificationClick();
        break;
      default:
        navigate("/");
    }
  };

  // Badge cho số lượng thông báo
  const renderBellWithBadge = () => (
    <span className="relative inline-block">
      <Bell size={24} />
      {notificationCount > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 min-w-[20px] h-5 flex items-center justify-center border border-white">
          {notificationCount > 99 ? "99+" : notificationCount}
        </span>
      )}
    </span>
  );

  return (
    <BottomNavigation
      fixed
      activeKey={activeTab}
      onChange={handleNavChange}
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
        key="services"
        label="Tiện ích"
        icon={<Grid size={24} />}
      />
      <BottomNavigation.Item
        key="notifications"
        label="Thông báo"
        icon={renderBellWithBadge()}
      />
    </BottomNavigation>
  );
};

export default Navigation;
