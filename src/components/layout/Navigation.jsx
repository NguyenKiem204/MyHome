import React, { useState } from "react";
import { BottomNavigation } from "zmp-ui";
import { Home, User, MessageSquare, FileText, Grid } from "lucide-react";
import { useNavigate } from "zmp-ui";

const Navigation = () => {
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  const handleNavChange = (selected) => {
    setActiveTab(selected);
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
      style={{ zIndex: 1000 }} // Đảm bảo Navigation nổi trên nội dung
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