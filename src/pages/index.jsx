import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Sheet, Input } from "zmp-ui";
import { User, MessageSquare, FileText, Grid, Bell, Settings } from "lucide-react";
import "../css/home.css";

const HomePage = () => {
  const [userName, setUserName] = useState("Người dùng");
  const [showWelcomeSheet, setShowWelcomeSheet] = useState(false);

  useEffect(() => {
    const isFirstTime = localStorage.getItem("isFirstTime") !== "false";
    if (isFirstTime) {
      setShowWelcomeSheet(true);
      localStorage.setItem("isFirstTime", "false");
    }
  }, []);

  const featureCards = [
    {
      id: 1,
      title: "Thông tin cá nhân",
      icon: <User size={32} />,
      path: "/profile",
      color: "#4F46E5",
    },
    {
      id: 2,
      title: "Gửi phản ánh",
      icon: <MessageSquare size={32} />,
      path: "/feedback",
      color: "#10B981",
    },
    {
      id: 3,
      title: "Xem các blog",
      icon: <FileText size={32} />,
      path: "/blogs",
      color: "#F59E0B",
    },
    {
      id: 4,
      title: "Đăng ký tiện ích",
      icon: <Grid size={32} />,
      path: "/services",
      color: "#EC4899",
    },
    {
      id: 5,
      title: "Thông báo",
      icon: <Bell size={32} />,
      path: "/notifications",
      color: "#8B5CF6",
    },
    {
      id: 6,
      title: "Cài đặt",
      icon: <Settings size={32} />,
      path: "/settings",
      color: "#6B7280",
    },
  ];

  return (
    <div className="home-page">
      <Box className="welcome-section">
        <Text className="welcome-title">
          Xin chào, {userName}!
        </Text>
        <Text className="welcome-subtitle">
          Chào mừng bạn đến với ứng dụng của chúng tôi
        </Text>
      </Box>

      <Box className="feature-grid">
        {featureCards.map((feature) => (
          <Box
            key={feature.id}
            className="feature-card"
            style={{ backgroundColor: feature.color }}
            onClick={() => window.location.href = feature.path}
          >
            <Box className="feature-icon">{feature.icon}</Box>
            <Text className="feature-title">{feature.title}</Text>
          </Box>
        ))}
      </Box>

      <Box className="recent-news">
        <Box className="section-header">
          <Text className="section-title">Tin tức mới nhất</Text>
          <Button
            className="see-all-btn"
            variant="text"
            onClick={() => window.location.href = "/blogs"}
          >
            Xem tất cả
          </Button>
        </Box>

        <Box className="news-list">
          {[1, 2, 3].map((item) => (
            <Box key={item} className="news-item">
              <Box className="news-image"></Box>
              <Box className="news-content">
                <Text className="news-title">Tin tức {item}</Text>
                <Text className="news-description">
                  Mô tả ngắn về tin tức này. Nội dung được hiển thị tóm tắt...
                </Text>
                <Text className="news-date">22/05/2025</Text>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      <Sheet
        visible={showWelcomeSheet}
        onClose={() => setShowWelcomeSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="welcome-sheet">
          <Text className="welcome-sheet-title">Chào mừng bạn!</Text>
          <Text className="welcome-sheet-subtitle">
            Vui lòng cho chúng tôi biết tên của bạn để cá nhân hóa trải nghiệm
          </Text>
          <Input
            className="name-input"
            placeholder="Nhập tên của bạn"
            value={userName === "Người dùng" ? "" : userName}
            onChange={(e) => setUserName(e.target.value || "Người dùng")}
          />
          <Button
            className="continue-btn"
            fullWidth
            onClick={() => setShowWelcomeSheet(false)}
          >
            Tiếp tục
          </Button>
        </Box>
      </Sheet>
    </div>
  );
};

export default HomePage;