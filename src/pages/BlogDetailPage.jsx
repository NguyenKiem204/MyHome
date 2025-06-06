// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Avatar, Icon, Sheet, Input } from "zmp-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ThumbsUp, MessageSquare, Share2, Bookmark, Clock,
  ArrowLeft, Send, User, Heart, Eye, Calendar,
  Tag, ChevronRight, MessageCircle, BookOpen
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const BlogDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Mô phỏng blog chi tiết
  const blogDetail = {
    id: parseInt(id),
    title: "Hướng dẫn sử dụng tính năng mới trong ứng dụng",
    content: `
      <div class="prose max-w-none">
        <p class="text-gray-700 leading-relaxed mb-6">Chào mừng bạn đến với hướng dẫn toàn diện về các tính năng mới trong phiên bản cập nhật gần đây của ứng dụng chúng tôi. Những cải tiến này sẽ giúp nâng cao trải nghiệm người dùng và mang lại nhiều tiện ích hơn trong quá trình sử dụng.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
          <span class="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">1</span>
          Giao diện người dùng được cải tiến
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">Phiên bản mới đã được thiết kế lại với giao diện người dùng hiện đại và trực quan hơn. Chúng tôi đã tối ưu hóa layout, màu sắc và typography để tạo ra trải nghiệm mượt mà và dễ sử dụng. Các thành phần UI đều được bo tròn góc và có hiệu ứng shadow tinh tế.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
          <span class="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">2</span>
          Chế độ tối (Dark Mode)
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">Một trong những tính năng được yêu cầu nhiều nhất - Chế độ tối đã chính thức có mặt! Bạn có thể dễ dàng chuyển đổi giữa chế độ sáng và tối thông qua cài đặt. Chế độ tối không chỉ giúp bảo vệ mắt trong điều kiện ánh sáng yếu mà còn tiết kiệm pin cho thiết bị.</p>
        
        <h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 flex items-center gap-2">
          <span class="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-sm font-bold">3</span>
          Tính năng đồng bộ hóa đa thiết bị
        </h2>
        <p class="text-gray-700 leading-relaxed mb-6">Với tính năng đồng bộ hóa mới, bạn có thể truy cập và quản lý dữ liệu của mình từ nhiều thiết bị khác nhau một cách seamless. Tất cả thông tin sẽ được cập nhật real-time và bảo mật bằng công nghệ mã hóa end-to-end.</p>
        
        <div class="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">💡 Mẹo sử dụng</h3>
          <p class="text-blue-800">Để tận dụng tối đa các tính năng mới, hãy cập nhật ứng dụng lên phiên bản mới nhất và khám phá từng tính năng một cách chi tiết.</p>
        </div>
      </div>
    `,
    coverImage: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
    category: "guide",
    author: {
      name: "Nguyễn Văn Admin",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80",
      role: "Technical Writer",
      bio: "Chuyên gia về UX/UI và phát triển ứng dụng mobile"
    },
    publishDate: "20/05/2025",
    readingTime: "5 phút",
    views: 1247,
    likes: 124,
    comments: [
      {
        id: 1,
        user: {
          name: "Nguyễn Văn Bình",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        content: "Bài viết rất hữu ích, cảm ơn admin! Tôi đã áp dụng thành công các tính năng mới và thấy rất hài lòng.",
        timestamp: "21/05/2025 10:30",
        likes: 5,
      },
      {
        id: 2,
        user: {
          name: "Trần Thị Cẩm",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b68e8c4c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        content: "Dark mode cuối cùng đã có! Đây là tính năng tôi chờ đợi từ lâu. Interface mới trông rất professional.",
        timestamp: "21/05/2025 14:15",
        likes: 8,
      },
      {
        id: 3,
        user: {
          name: "Lê Minh Đức",
          avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80",
        },
        content: "Tính năng đồng bộ hoạt động rất smooth. Có thể hướng dẫn thêm về cách setup cho team không?",
        timestamp: "22/05/2025 09:45",
        likes: 3,
      },
    ],
    relatedPosts: [
      {
        id: 2,
        title: "5 mẹo để tối ưu hóa trải nghiệm người dùng",
        coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "tips",
        readingTime: "3 phút"
      },
      {
        id: 5,
        title: "Cách xử lý các vấn đề thường gặp khi sử dụng ứng dụng",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "support",
        readingTime: "7 phút"
      },
      {
        id: 8,
        title: "Những xu hướng thiết kế mobile app năm 2025",
        coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
        category: "trends",
        readingTime: "6 phút"
      }
    ],
  };

  useEffect(() => {
    setTimeout(() => {
      setBlog(blogDetail);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleLike = () => {
    setLiked(!liked);
    setBlog((prev) => ({
      ...prev,
      likes: prev.likes + (liked ? -1 : 1),
    }));
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
  };

  const handleComment = () => {
    if (commentText.trim()) {
      const newComment = {
        id: blog.comments.length + 1,
        user: {
          name: "Bạn",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        },
        content: commentText,
        timestamp: "Vừa xong",
        likes: 0,
      };
      setBlog({
        ...blog,
        comments: [newComment, ...blog.comments],
      });
      setCommentText("");
      setShowCommentSheet(false);
    }
  };

  const getCategoryInfo = (category) => {
    switch(category) {
      case 'guide': return { name: 'Hướng dẫn', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', icon: BookOpen };
      case 'tips': return { name: 'Mẹo hay', color: 'bg-gradient-to-r from-yellow-500 to-orange-500', icon: Tag };
      case 'news': return { name: 'Tin tức', color: 'bg-gradient-to-r from-red-500 to-pink-500', icon: MessageCircle };
      case 'support': return { name: 'Hỗ trợ', color: 'bg-gradient-to-r from-green-500 to-emerald-500', icon: User };
      case 'trends': return { name: 'Xu hướng', color: 'bg-gradient-to-r from-purple-500 to-indigo-500', icon: TrendingUp };
      default: return { name: 'Công nghệ', color: 'bg-gradient-to-r from-gray-500 to-gray-600', icon: Tag };
    }
  };

  const renderSkeletonCard = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header Skeleton */}
      <div className="relative h-80 bg-gray-200 animate-pulse">
        <div className="absolute top-4 left-4 w-10 h-10 bg-gray-300 rounded-full animate-pulse" />
      </div>
      
      {/* Content Skeleton */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 bg-gray-200 rounded animate-pulse w-4/5" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
            </div>
          </div>
          <div className="space-y-3">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <Page>{renderSkeletonCard()}</Page>;
  }

  const categoryInfo = getCategoryInfo(blog.category);
  const CategoryIcon = categoryInfo.icon;

  return (
    <Page className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${blog.coverImage})` }}
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

        {/* Floating Action Button */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={handleBookmark}
            className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
              bookmarked ? 'bg-blue-500 text-white' : 'bg-white/90 text-gray-700 hover:bg-white'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? 'fill-current' : ''}`} />
          </button>
          <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200">
            <Share2 className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Article Header */}
          <div className="p-8 border-b border-gray-100">
            {/* Category */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-semibold mb-4 ${categoryInfo.color}`}>
              <CategoryIcon className="w-4 h-4" />
              {categoryInfo.name}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
              {blog.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img 
                  src={blog.author.avatar} 
                  alt={blog.author.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-blue-100"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{blog.author.name}</h3>
                  <p className="text-sm text-blue-600 font-medium">{blog.author.role}</p>
                  <p className="text-xs text-gray-500">{blog.author.bio}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{blog.publishDate}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readingTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>

          {/* Action Bar */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    liked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-red-500'
                  }`}
                >
                  <ThumbsUp className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  <span className="font-medium">{blog.likes}</span>
                </button>

                <button
                  onClick={() => setShowCommentSheet(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span className="font-medium">{blog.comments.length}</span>
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Đã có {blog.likes} lượt thích • {blog.comments.length} bình luận
              </div>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-500" />
                Bình luận ({blog.comments.length})
              </h2>
              <button
                onClick={() => setShowCommentSheet(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                Thêm bình luận
              </button>
            </div>
          </div>

          <div className="p-6">
            {blog.comments.length > 0 ? (
              <div className="space-y-6">
                {blog.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                    <img 
                      src={comment.user.avatar} 
                      alt={comment.user.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{comment.user.name}</h4>
                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors duration-200">
                          <Heart className="w-4 h-4" />
                          <span>{comment.likes}</span>
                        </button>
                        <button className="text-sm text-gray-500 hover:text-blue-500 transition-colors duration-200">
                          Trả lời
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có bình luận nào</h3>
                <p className="text-gray-500 mb-4">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
                <button
                  onClick={() => setShowCommentSheet(true)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                >
                  Viết bình luận đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-green-500" />
              Bài viết liên quan
            </h2>
          </div>
          <div className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blog.relatedPosts.map((post) => (
                <div key={post.id} className="group cursor-pointer bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getCategoryInfo(post.category).color} text-white`}>
                      {getCategoryInfo(post.category).name}
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.readingTime}</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comment Sheet */}
      <Sheet visible={showCommentSheet} onClose={() => setShowCommentSheet(false)}>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Thêm bình luận</h3>
            <button 
              onClick={() => setShowCommentSheet(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Chia sẻ suy nghĩ của bạn về bài viết này..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowCommentSheet(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Hủy
              </button>
              <button 
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Gửi bình luận
              </button>
            </div>
          </div>
        </div>
      </Sheet>
    </Page>
  );
};

export default BlogDetailPage;