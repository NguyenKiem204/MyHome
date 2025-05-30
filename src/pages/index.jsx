import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Sheet, Input } from "zmp-ui";
import { User, MessageSquare, FileText, Grid, Bell, Settings, Clock, ExternalLink } from "lucide-react";
import "../css/home.css";
const HomePage = () => {
  const [userName, setUserName] = useState("Người dùng");
  const [showWelcomeSheet, setShowWelcomeSheet] = useState(true);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "474cc9de345a4e1ca713aaf4f1be01e5";

  useEffect(() => {
    const isFirstTime = localStorage?.getItem("isFirstTime") !== "false";
    if (isFirstTime) {
      setShowWelcomeSheet(true);
      localStorage?.setItem("isFirstTime", "false");
    }
    fetchNewsData();
  }, []);

  const fetchNewsData = async (category = "all", query = "") => {
    try {
      setLoading(true);
      setError(null);

      let url;
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 7);
      
      const formatDate = (date) => date.toISOString().split('T')[0];

      if (query) {
        url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=20&apiKey=${API_KEY}`;
      } else {
        url = `https://newsapi.org/v2/everything?q=technology OR business OR science&from=${formatDate(yesterday)}&to=${formatDate(today)}&sortBy=popularity&language=en&pageSize=6&apiKey=${API_KEY}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'ok') {
        setNews(data.articles.slice(0, 3));
      } else {
        setError(data.message || 'Failed to fetch news');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('News fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const featureCards = [
    {
      id: 1,
      title: "Thông tin cá nhân",
      icon: <User size={28} />,
      path: "/profile",
      color: "#1E40AF",
      bgColor: "rgba(30, 64, 175, 0.1)"
    },
    {
      id: 2,
      title: "Gửi phản ánh",
      icon: <MessageSquare size={28} />,
      path: "/feedback",
      color: "#059669",
      bgColor: "rgba(5, 150, 105, 0.1)"
    },
    {
      id: 3,
      title: "Xem các blog",
      icon: <FileText size={28} />,
      path: "/blogs",
      color: "#D97706",
      bgColor: "rgba(217, 119, 6, 0.1)"
    },
    {
      id: 4,
      title: "Đăng ký tiện ích",
      icon: <Grid size={28} />,
      path: "/services",
      color: "#DC2626",
      bgColor: "rgba(220, 38, 38, 0.1)"
    },
    {
      id: 5,
      title: "Thông báo",
      icon: <Bell size={28} />,
      path: "/notifications",
      color: "#7C3AED",
      bgColor: "rgba(124, 58, 237, 0.1)"
    },
    {
      id: 6,
      title: "Cài đặt",
      icon: <Settings size={28} />,
      path: "/settings",
      color: "#6B7280",
      bgColor: "rgba(107, 114, 128, 0.1)"
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Page className="home-page">
      
      {/* Header */}
      <Box className="welcome-header">
        <Text className="welcome-title">
          Xin chào, {userName}! 👋
        </Text>
        <Text className="welcome-subtitle">
          Chào mừng bạn trở lại với ứng dụng
        </Text>
      </Box>

      <Box className="content-container">
        {/* Feature Cards */}
        <Box className="feature-section">
          <Text className="section-title">
            <Grid className="section-icon" size={20} />
            Tính năng chính
          </Text>
          
          <Box className="feature-grid">
            {featureCards.map((feature) => (
              <Box
                key={feature.id}
                className="feature-card"
                style={{ 
                  backgroundColor: feature.bgColor,
                  borderColor: feature.color + '20'
                }}
                onClick={() => window.location.href = feature.path}
              >
                <Box className="feature-icon" style={{ color: feature.color }}>
                  {feature.icon}
                </Box>
                <Text className="feature-title">{feature.title}</Text>
              </Box>
            ))}
          </Box>
        </Box>

        {/* News Section */}
        <Box className="news-section">
          <Box className="news-header">
            <Text className="section-title">
              <FileText className="section-icon" size={20} />
              Tin tức công nghệ
            </Text>
            <Button
              className="see-all-btn"
              variant="text"
              onClick={() => window.location.href = "/blogs"}
            >
              Xem tất cả →
            </Button>
          </Box>

          {loading && (
            <Box className="loading-container">
              <div className="loading-spinner"></div>
              <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                Đang tải tin tức...
              </Text>
            </Box>
          )}

          {error && (
            <Box className="error-container">
              <div className="error-icon">⚠️</div>
              <Text className="error-title">Không thể tải tin tức</Text>
              <Text className="error-message">{error}</Text>
              <button
                className="retry-btn"
                onClick={() => fetchNewsData()}
              >
                Thử lại
              </button>
            </Box>
          )}

          {!loading && !error && news.length > 0 && (
            <Box>
              {news.map((article, index) => (
                <Box
                  key={index}
                  className="news-item"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <Box className="news-image">
                    {article.urlToImage ? (
                      <img
                        src={article.urlToImage}
                        alt={article.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = `<div style="color: #3b82f6;"><svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg></div>`;
                        }}
                      />
                    ) : (
                      <FileText size={32} color="#3b82f6" />
                    )}
                  </Box>
                  
                  <Box className="news-content">
                    <Text className="news-title">
                      {truncateText(article.title, 70)}
                    </Text>
                    <Text className="news-description">
                      {truncateText(article.description, 80)}
                    </Text>
                    <Box className="news-meta">
                      <Text className="news-date">
                        <Clock size={12} style={{ marginRight: '4px' }} />
                        {formatDate(article.publishedAt)}
                      </Text>
                      <Text className="news-source">
                        {article.source?.name}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>

      {/* Welcome Sheet */}
      <Sheet
        visible={showWelcomeSheet}
        onClose={() => setShowWelcomeSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="welcome-sheet-content">
          <Box className="welcome-icon">
            <User size={32} color="white" />
          </Box>
          
          <Text className="welcome-sheet-title">
            Chào mừng bạn! 🎉
          </Text>
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
            Bắt đầu sử dụng
          </Button>
        </Box>
      </Sheet>
    </Page>
  );
};

export default HomePage;