// src/pages/index.jsx (HomePage)
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button } from "zmp-ui";
import { User, MessageSquare, FileText, Grid, Bell, Settings, Clock } from "lucide-react";
import axios from "axios";
import api from "../utils/api";

const HomePage = () => {
  const [appUserInfo, setAppUserInfo] = useState(null);
  const [appUserDataLoading, setAppUserDataLoading] = useState(true);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "474cc9de345a4e1ca713aaf4f1be01e5";

  const fetchAppUserInfo = async () => {
    try {
      setAppUserDataLoading(true);
      const response = await api.get("/auth/me"); 
      if (response.data.success) {
        setAppUserInfo(response.data.data);
      } else {
        console.error("Không thể lấy thông tin người dùng ứng dụng:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng ứng dụng:", error);
    } finally {
      setAppUserDataLoading(false);
    }
  };

  const fetchNewsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
      );
      setNews(response.data.articles);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Không thể tải tin tức. Vui lòng kiểm tra kết nối mạng.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  useEffect(() => {
    fetchAppUserInfo();
    fetchNewsData();
  }, []);

  const featureCards = [
    { id: 1, title: "Tài khoản", icon: <User size={28} />, path: "/profile", color: "#3B82F6", bgColor: "#DBEAFE" },
    { id: 2, title: "Phản ánh", icon: <MessageSquare size={28} />, path: "/feedback", color: "#F59E0B", bgColor: "#FFFBEB" },
    { id: 3, title: "Blog", icon: <FileText size={28} />, path: "/blogs", color: "#10B981", bgColor: "#D1FAE5" },
    { id: 4, title: "Dịch vụ", icon: <Grid size={28} />, path: "/services", color: "#EF4444", bgColor: "#FEE2E2" },
    { id: 5, title: "Cài đặt", icon: <Settings size={28} />, path: "/settings", color: "#6366F1", bgColor: "#EEF2FF" },
    { id: 6, title: "Thông báo", icon: <Bell size={28} />, path: "/notifications", color: "#8B5CF6", bgColor: "#EDE9FE" },
  ];

  const getDisplayName = () => {
    if (!appUserInfo) return "Người dùng";
    if (appUserInfo.firstName && appUserInfo.lastName) {
      return `${appUserInfo.firstName} ${appUserInfo.lastName}`;
    }
    if (appUserInfo.firstName) {
      return appUserInfo.firstName;
    }
    if (appUserInfo.username) {
      return appUserInfo.username;
    }
    return "Người dùng";
  };

  return (
    <Page className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <Box className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white mt-16">
        <Box className="flex items-center">
          {/* Avatar */}
          {appUserInfo?.avatarUrl && ( // Sử dụng avatarUrl từ thông tin backend
            <Box className="w-12 h-12 mr-3 rounded-full overflow-hidden border-2 border-white/30">
              <img
                src={appUserInfo.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'; // Ẩn ảnh nếu lỗi
                }}
              />
            </Box>
          )}
          
          <Box className="flex-1">
            <Text className="text-xl font-bold mb-1">
              {appUserDataLoading ? (
                <span className="inline-block w-32 h-6 bg-white/20 rounded animate-pulse"></span>
              ) : (
                `Xin chào, ${getDisplayName()}! 👋` // SỬA ĐỔI Ở ĐÂY để hiển thị tên đầy đủ
              )}
            </Text>
            <Text className="text-blue-100 text-sm">
              Chào mừng bạn trở lại với ứng dụng
            </Text>
          </Box>
        </Box>
      </Box>

      <Box className="px-4 pb-20">
        {/* Feature Cards */}
        <Box className="mt-6">
          <Box className="flex items-center mb-4">
            <Grid className="mr-2 text-gray-700" size={20} />
            <Text className="text-lg font-semibold text-gray-800">
              Tính năng chính
            </Text>
          </Box>
          
          <Box className="grid grid-cols-2 gap-4">
            {featureCards.map((feature) => (
              <Box
                key={feature.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                style={{ 
                  backgroundColor: feature.bgColor,
                  borderColor: feature.color + '20'
                }}
                onClick={() => window.location.href = feature.path}
              >
                <Box className="flex flex-col items-center text-center">
                  <Box className="mb-3" style={{ color: feature.color }}>
                    {feature.icon}
                  </Box>
                  <Text className="text-sm font-medium text-gray-700">
                    {feature.title}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* News Section (Giữ nguyên) */}
        <Box className="mt-8">
          <Box className="flex items-center justify-between mb-4">
            <Box className="flex items-center">
              <FileText className="mr-2 text-gray-700" size={20} />
              <Text className="text-lg font-semibold text-gray-800">
                Tin tức công nghệ
              </Text>
            </Box>
            <Button
              className="text-white-600 text-sm font-medium"
              variant="text"
              onClick={() => window.location.href = "/blogs"}
            >
              Xem tất cả →
            </Button>
          </Box>

          {loading && (
            <Box className="flex flex-col items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
              <Text className="text-gray-500 text-sm">
                Đang tải tin tức...
              </Text>
            </Box>
          )}

          {error && (
            <Box className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <Text className="text-red-800 font-medium mb-1">Không thể tải tin tức</Text>
              <Text className="text-red-600 text-sm mb-3">{error}</Text>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                onClick={() => fetchNewsData()}
              >
                Thử lại
              </button>
            </Box>
          )}

          {!loading && !error && news.length > 0 && (
            <Box className="space-y-4">
              {news.map((article, index) => (
                <Box
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(article.url, '_blank')}
                >
                  <Box className="flex gap-3">
                    <Box className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {article.urlToImage ? (
                        <img
                          src={article.urlToImage}
                          alt={article.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentNode.innerHTML = `<div class="text-blue-600"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg></div>`;
                          }}
                        />
                      ) : (
                        <FileText size={24} className="text-blue-600" />
                      )}
                    </Box>
                    
                    <Box className="flex-1 min-w-0">
                      <Text className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                        {truncateText(article.title, 70)}
                      </Text>
                      <Text className="text-gray-600 text-xs mb-2 line-clamp-2">
                        {truncateText(article.description, 80)}
                      </Text>
                      <Box className="flex items-center justify-between text-xs text-gray-500">
                        <Box className="flex items-center">
                          <Clock size={10} className="mr-1" />
                          <Text>{formatDate(article.publishedAt)}</Text>
                        </Box>
                        <Text className="truncate max-w-20">
                          {article.source?.name}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Page>
  );
};

export default HomePage;