// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Page, useNavigate, useParams } from "zmp-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ArrowLeft, Calendar } from "lucide-react";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // id là documentId
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        // id ở đây chính là documentId
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const renderSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="relative h-80 bg-gray-200 animate-pulse" />
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-4/5" />
          </div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) return <Page>{renderSkeleton()}</Page>;
  if (error)
    return (
      <Page>
        <div className="max-w-2xl mx-auto py-20 text-center text-red-600">
          Lỗi: {error}
        </div>
      </Page>
    );
  if (!blog)
    return (
      <Page>
        <div className="max-w-2xl mx-auto py-20 text-center text-gray-500">
          Không tìm thấy bài viết
        </div>
      </Page>
    );

  const image =
    blog.imageUrl ||
    "https://via.placeholder.com/800x400/f3f4f6/6b7280?text=No+Image";

  return (
    <Page className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${image})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />
        </div>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(blog.createdAt).toLocaleDateString("vi-VN")}
              </span>
            </div>
          </div>
          <div className="p-8 mb-10">
            {blog.content ? (
              <ReactMarkdown className="prose prose-lg max-w-none ">
                {blog.content}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-500 italic">Không có nội dung</div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};

export default BlogDetailPage;
