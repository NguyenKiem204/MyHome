import React from "react";
import { Box, Text, Button } from "zmp-ui";
import { FileText, Clock } from "lucide-react";

const NewsList = ({ news, error, onRetry, navigate }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };

  const getTimeSince = (dateString) => {
    if (!dateString) return "";

    const now = new Date();
    const publishDate = new Date(dateString);
    const diffTime = Math.abs(now - publishDate);
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      return `${diffDays} ngày trước`;
    } else if (diffHours > 0) {
      return `${diffHours} giờ trước`;
    } else {
      return "Vừa mới";
    }
  };

  return (
    <Box className="mt-8">
      <Box className="flex items-center justify-between mb-4">
        <Box className="flex items-center">
          <FileText className="mr-2 text-gray-700" size={20} />
          <Text className="text-lg font-semibold text-gray-800">
            Tin tức nổi bật
          </Text>
        </Box>
        <Button
          className="text-white-600 text-sm font-medium"
          variant="text"
          onClick={() => navigate("/blogs")}
        >
          Xem tất cả →
        </Button>
      </Box>

      {/* Error State */}
      {error && (
        <Box className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <Text className="text-red-800 font-medium mb-1">
            Không thể tải tin tức
          </Text>
          <Text className="text-red-600 text-sm mb-3">{error}</Text>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors mt-3"
            onClick={onRetry}
          >
            Thử lại
          </button>
        </Box>
      )}

      {/* Success State - Hiển thị tin tức */}
      {!error && news.length > 0 && (
        <Box className="space-y-4">
          {news.map((article, index) => (
            <Box
              key={index}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-200"
              onClick={() => window.open(article.url, "_blank")}
            >
              <Box className="flex gap-4">
                <Box className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {article.urlToImage ? (
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.parentNode.innerHTML = `<div class="text-blue-600 flex items-center justify-center w-full h-full"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg></div>`;
                      }}
                    />
                  ) : (
                    <FileText size={24} className="text-blue-600" />
                  )}
                </Box>

                <Box className="flex-1 min-w-0">
                  <Text className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                    {article.title}
                  </Text>
                  <Text className="text-gray-600 text-xs mb-3 line-clamp-2 leading-relaxed">
                    {truncateText(article.description, 100)}
                  </Text>

                  <Box className="flex items-center justify-between text-xs">
                    <Box className="flex items-center text-gray-500">
                      <Clock size={12} className="mr-1" />
                      <Text>{getTimeSince(article.publishedAt)}</Text>
                    </Box>

                    <Box className="flex items-center">
                      {article.source?.name && (
                        <Text className="text-blue-600 font-medium truncate max-w-24">
                          {article.source.name}
                        </Text>
                      )}
                    </Box>
                  </Box>

                  {article.author && (
                    <Text className="text-xs text-gray-400 mt-1 truncate">
                      Tác giả: {article.author}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Empty State */}
      {!error && news.length === 0 && (
        <Box className="text-center py-8">
          <div className="text-4xl mb-4">📰</div>
          <Text className="text-gray-600 font-medium mb-2">
            Chưa có tin tức
          </Text>
          <Text className="text-gray-500 text-sm">
            Không có tin tức nào được tải từ server lúc này.
          </Text>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-4"
            onClick={onRetry}
          >
            Tải lại tin tức
          </button>
        </Box>
      )}
    </Box>
  );
};

export default NewsList;
