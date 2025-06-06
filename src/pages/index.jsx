import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Sheet, Input } from "zmp-ui";
import { User, MessageSquare, FileText, Grid, Bell, Settings, Clock, ExternalLink } from "lucide-react";
import { getUserInfo } from "zmp-sdk/apis";

const HomePage = () => {
  const [userName, setUserName] = useState("Người dùng");
  const [userInfo, setUserInfo] = useState(null);
  // const [showWelcomeSheet, setShowWelcomeSheet] = useState(true);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(true);

  const API_KEY = "474cc9de345a4e1ca713aaf4f1be01e5";

  // Lấy thông tin người dùng từ ZMP SDK
  const fetchUserInfo = async () => {
    try {
      setUserDataLoading(true);
      
      const userInfoResponse = await getUserInfo({});
      
      if (userInfoResponse.userInfo) {
        const { name, avatar } = userInfoResponse.userInfo;
        const userData = {
          name: name || "Người dùng",
          avatar: avatar || null,
        };
        
        setUserInfo(userData);
        setUserName(userData.name);
        
        // Nếu có thông tin người dùng, không cần hiển thị welcome sheet
        // setShowWelcomeSheet(false);
        
        console.log("User info loaded:", userData);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Giữ nguyên trạng thái mặc định nếu không lấy được thông tin
    } finally {
      setUserDataLoading(false);
    }
  };

  useEffect(() => {
    // Lấy thông tin người dùng khi component mount
    fetchUserInfo();
    
    // Lấy dữ liệu tin tức
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
    <Page className="min-h-screen bg-gray-50 ">
      {/* Header */}
      <Box className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white mt-16">
        <Box className="flex items-center">
          {/* Avatar */}
          {userInfo?.avatar && (
            <Box className="w-12 h-12 mr-3 rounded-full overflow-hidden border-2 border-white/30">
              <img
                src={userInfo.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Box>
          )}
          
          <Box className="flex-1">
            <Text className="text-xl font-bold mb-1">
              {userDataLoading ? (
                <span className="inline-block w-32 h-6 bg-white/20 rounded animate-pulse"></span>
              ) : (
                `Xin chào, ${userName}! 👋`
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

        {/* News Section */}
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

      {/* Welcome Sheet - chỉ hiện khi không có thông tin người dùng */}
      {/* <Sheet
        visible={showWelcomeSheet && !userInfo}
        onClose={() => setShowWelcomeSheet(false)}
        autoHeight
        mask
        handler
        swipeToClose
      >
        <Box className="p-6 text-center mb-8">
          <Box className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} color="white" />
          </Box>
          
          <Text className="text-xl font-bold text-gray-900 mb-2">
            Chào mừng bạn! 🎉
          </Text>
          <Text className="text-gray-600 mb-6">
            Vui lòng cho chúng tôi biết tên của bạn để cá nhân hóa trải nghiệm
          </Text>
          
          <Input
            className="mb-4"
            placeholder="Nhập tên của bạn"
            value={userName === "Người dùng" ? "" : userName}
            onChange={(e) => setUserName(e.target.value || "Người dùng")}
          />
          
          <Button
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
            fullWidth
            onClick={() => setShowWelcomeSheet(false)}
          >
            Bắt đầu sử dụng
          </Button>
        </Box>
      </Sheet> */}
    </Page>
  );
};

export default HomePage;