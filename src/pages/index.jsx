import React, { useState, useEffect, Suspense } from "react";
import { Box, Page, Text, Button } from "zmp-ui";
import {
  User,
  MessageSquare,
  FileText,
  Grid,
  Bell,
  Settings,
  Clock,
} from "lucide-react";
import api from "../services/api";
import { useNavigate } from "zmp-ui";

// Custom hook for fetching user data
const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/auth/me");
        if (response.data.success && response.data.resident) {
          setUserData(response.data.resident);
        } else {
          setError(response.data.message || "Không lấy được thông tin cư dân");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading, error };
};

// Custom hook for fetching news data
const useNewsData = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = "https://harmless-right-chipmunk.ngrok-free.app/api/news";

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_URL}/top-headlines?country=us&pageSize=5`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const validArticles = (data.articles || [])
        .filter(
          (article) =>
            article.title &&
            article.description &&
            article.title !== "[Removed]" &&
            article.description !== "[Removed]"
        )
        .slice(0, 5);

      setNews(validArticles);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return { news, loading, error, refetch: fetchNews };
};

// Lazy loaded components
const UserInfo = React.lazy(() => import("../components/UserInfo"));
const FeatureCards = React.lazy(() => import("../components/FeatureCards"));
const NewsList = React.lazy(() => import("../components/NewsList"));

const HomePage = () => {
  const navigate = useNavigate();
  const { userData, loading: userLoading, error: userError } = useUserData();
  const {
    news,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNewsData();

  // Loading state
  if (userLoading || newsLoading) {
    return <FullPageSkeleton />;
  }

  return (
    <Page className="min-h-screen bg-gray-50">
      <Suspense fallback={<UserInfoSkeleton />}>
        <UserInfo userData={userData} />
      </Suspense>

      <Box className="px-4 pb-20">
        <Suspense fallback={<FeatureCardsSkeleton />}>
          <FeatureCards navigate={navigate} />
        </Suspense>

        <Suspense fallback={<NewsListSkeleton />}>
          <NewsList
            news={news}
            error={newsError}
            onRetry={refetchNews}
            navigate={navigate}
          />
        </Suspense>
      </Box>
    </Page>
  );
};

// Skeleton Component cho User Info
const UserInfoSkeleton = () => (
  <Box className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6 text-white mt-16">
    <Box className="flex items-center">
      <Box className="w-12 h-12 mr-3 rounded-full bg-white/20 animate-pulse"></Box>
      <Box className="flex-1">
        <Box className="w-48 h-6 bg-white/20 rounded animate-pulse mb-2"></Box>
        <Box className="w-32 h-4 bg-white/10 rounded animate-pulse"></Box>
      </Box>
    </Box>
  </Box>
);

// Skeleton Component cho Feature Cards
const FeatureCardsSkeleton = () => (
  <Box className="grid grid-cols-2 gap-4">
    {[...Array(6)].map((_, index) => (
      <Box
        key={index}
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
      >
        <Box className="flex flex-col items-center text-center">
          <Box className="w-7 h-7 bg-gray-200 rounded animate-pulse mb-3"></Box>
          <Box className="w-16 h-4 bg-gray-200 rounded animate-pulse"></Box>
        </Box>
      </Box>
    ))}
  </Box>
);

// Skeleton Component cho News Items
const NewsItemSkeleton = () => (
  <Box className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
    <Box className="flex gap-4">
      <Box className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 animate-pulse"></Box>
      <Box className="flex-1 min-w-0">
        <Box className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2"></Box>
        <Box className="w-4/5 h-4 bg-gray-200 rounded animate-pulse mb-3"></Box>
        <Box className="w-3/4 h-3 bg-gray-200 rounded animate-pulse mb-2"></Box>
        <Box className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></Box>
        <Box className="flex items-center justify-between mt-3">
          <Box className="w-20 h-3 bg-gray-200 rounded animate-pulse"></Box>
          <Box className="w-16 h-3 bg-gray-200 rounded animate-pulse"></Box>
        </Box>
      </Box>
    </Box>
  </Box>
);

// Skeleton Component cho News List
const NewsListSkeleton = () => (
  <Box className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <NewsItemSkeleton key={index} />
    ))}
  </Box>
);

// Skeleton Component cho toàn trang
const FullPageSkeleton = () => (
  <Page className="min-h-screen bg-gray-50">
    <UserInfoSkeleton />
    <Box className="px-4 pb-20">
      <Box className="mt-6">
        <Box className="flex items-center mb-4">
          <Grid className="mr-2 text-gray-700" size={20} />
          <Text className="text-lg font-semibold text-gray-800">
            Tính năng chính
          </Text>
        </Box>
        <FeatureCardsSkeleton />
      </Box>
      <Box className="mt-8">
        <Box className="flex items-center justify-between mb-4">
          <Box className="flex items-center">
            <FileText className="mr-2 text-gray-700" size={20} />
            <Text className="text-lg font-semibold text-gray-800">
              Tin tức nổi bật
            </Text>
          </Box>
        </Box>
        <NewsListSkeleton />
      </Box>
    </Box>
  </Page>
);

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

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

export default HomePage;
