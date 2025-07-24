import React, { useState, useEffect } from "react";
import { Page, useNavigate } from "zmp-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import api from "../services/api";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const pageSize = 6;

  const fetchBlogs = async (page = 1, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/blogs", {
        params: {
          sort: "createdAt:desc",
          "pagination[page]": page,
          "pagination[pageSize]": pageSize,
          "fields[0]": "title",
          "fields[1]": "documentId",
          "fields[2]": "imageUrl",
          "fields[3]": "createdAt",
        },
      });
      const items = (response.data.data || []).map((item) => ({
        id: item.id,
        title: item.title,
        documentId: item.documentId,
        createdAt: item.createdAt,
        image:
          item.imageUrl ||
          "https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image",
      }));
      if (append) {
        setBlogs((prev) => [...prev, ...items]);
      } else {
        setBlogs(items);
      }
      setHasMore(items.length === pageSize);
    } catch (err) {
      setError(err.message);
      if (!append) setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchBlogs(1, false);
    // eslint-disable-next-line
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchBlogs(nextPage, true);
    }
  };

  const renderSkeletonCard = (key) => (
    <div
      key={key}
      className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
    >
      <div className="aspect-video bg-gray-200 animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-4/5" />
        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
      </div>
    </div>
  );

  const renderBlogCard = (blog) => (
    <div
      key={blog.id}
      className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer"
      onClick={() => navigate(`/blog-detail/${blog.documentId}`)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={blog.image}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x225/f3f4f6/6b7280?text=No+Image";
          }}
        />
      </div>
      <div className="p-6 space-y-3">
        <h3 className="font-bold text-gray-900 text-lg leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {blog.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{new Date(blog.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Page className="py-3 min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="sticky top-10 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 mt-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Tin Tức & Blog
            </h1>
            <p className="text-gray-600 mt-1">
              Cập nhật những tin tức mới nhất từ ban quản lý
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8 mb-8">
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
              <span className="font-medium">Lỗi khi tải tin tức:</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && blogs.length === 0 ? (
            Array.from({ length: 6 }, (_, index) => renderSkeletonCard(index))
          ) : blogs.length > 0 ? (
            blogs.map(renderBlogCard)
          ) : !loading && !error ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl text-gray-400">📰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài viết
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Hiện tại chưa có bài viết nào.
              </p>
            </div>
          ) : null}
        </div>
        {!loading && blogs.length > 0 && hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang tải..." : "Xem thêm bài viết"}
            </button>
          </div>
        )}
      </div>
    </Page>
  );
};

export default BlogPage;
