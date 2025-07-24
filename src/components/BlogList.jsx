import React, { useState, useEffect } from "react";
import { Box, Text } from "zmp-ui";
import { useNavigate } from "zmp-ui";
import api from "../services/api";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/blogs", {
          params: {
            sort: "createdAt:desc",
            "pagination[page]": 1,
            "pagination[pageSize]": 3,
            "fields[0]": "title",
            "fields[1]": "documentId",
            "fields[2]": "imageUrl",
            "fields[3]": "createdAt",
          },
        });
        console.log("Blog response:", response.data);
        const items = (response.data.data || []).map((item) => ({
          id: item.id,
          title: item.title,
          documentId: item.documentId,
          createdAt: item.createdAt,
          image:
            item.imageUrl ||
            "https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image",
        }));
        setBlogs(items);
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Không thể tải tin tức");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Box className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Box key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </Box>
        ))}
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <Text className="text-red-500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box className="space-y-4">
      {blogs.map((blog) => (
        <Box
          key={blog.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
          onClick={() => navigate(`/blog/${blog.documentId}`)}
        >
          <div className="relative">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>
          <Box className="p-4">
            <Text className="text-lg font-medium line-clamp-2 mb-2">
              {blog.title}
            </Text>
            <Text className="text-sm text-gray-500">
              {formatDate(blog.createdAt)}
            </Text>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BlogList;
