// src/pages/BlogDetailPage.jsx
import React, { useState, useEffect } from "react";
import { Box, Page, Text, Button, Avatar, Icon, Sheet, Input } from "zmp-ui";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  ThumbsUp, MessageSquare, Share2, Bookmark, Clock,
  ArrowLeft, Send, User, Heart
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
// import "../css/blog-detail.css";

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
      <p>Chào mừng bạn đến với hướng dẫn toàn diện về các tính năng mới trong phiên bản cập nhật gần đây của ứng dụng chúng tôi...</p>
      <h2>1. Giao diện người dùng được cải tiến</h2>
      <p>Phiên bản mới đã được thiết kế lại với giao diện người dùng hiện đại và trực quan hơn...</p>
      <h2>2. Chế độ tối (Dark Mode)</h2>
      <p>Một trong những tính năng được yêu cầu nhiều nhất - Chế độ tối đã chính thức có mặt!...</p>
      <h2>3. Tính năng đồng bộ hóa đa thiết bị</h2>
      <p>Với tính năng đồng bộ hóa mới, bạn có thể truy cập và quản lý dữ liệu của mình từ nhiều thiết bị khác nhau...</p>
    `,
    coverImage: "https://via.placeholder.com/800x400",
    category: "guide",
    author: {
      name: "Admin",
      avatar: "https://via.placeholder.com/50",
    },
    publishDate: "20/05/2025",
    readingTime: "5 phút",
    likes: 124,
    comments: [
      {
        id: 1,
        user: {
          name: "Nguyễn Văn B",
          avatar: "https://via.placeholder.com/40",
        },
        content: "Bài viết rất hữu ích, cảm ơn admin!",
        timestamp: "21/05/2025 10:30",
        likes: 5,
      },
      {
        id: 2,
        user: {
          name: "Trần Thị C",
          avatar: "https://via.placeholder.com/40",
        },
        content: "Tôi đã thử tính năng mới và thấy rất hài lòng...",
        timestamp: "21/05/2025 14:15",
        likes: 3,
      },
    ],
    relatedPosts: [
      {
        id: 2,
        title: "5 mẹo để tối ưu hóa trải nghiệm người dùng",
        coverImage: "https://via.placeholder.com/100",
      },
      {
        id: 5,
        title: "Cách xử lý các vấn đề thường gặp khi sử dụng ứng dụng",
        coverImage: "https://via.placeholder.com/100",
      },
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
          avatar: "https://via.placeholder.com/40",
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

  const renderSkeleton = () => (
    <Box className="blog-detail-skeleton">
      <Skeleton height={300} width="100%" />
      <Box className="blog-detail-header-skeleton">
        <Skeleton height={32} width="80%" />
        <Skeleton height={20} width="40%" />
      </Box>
      <Box className="blog-detail-content-skeleton">
        <Skeleton count={5} height={20} />
      </Box>
    </Box>
  );

  if (loading) {
    return <Page className="blog-detail-page">{renderSkeleton()}</Page>;
  }

  return (
    <Page className="blog-detail-page">
      <Box
        className="blog-detail-cover"
        style={{ backgroundImage: `url(${blog.coverImage})` }}
      >
        <Button
          className="back-button"
          icon={<ArrowLeft size={20} />}
          onClick={() => navigate(-1)}
        />
      </Box>

      <Box className="blog-detail-content">
        <Box className="blog-detail-header">
          <Box className={`blog-category ${blog.category}`}>
            {blog.category === "guide"
              ? "Hướng dẫn"
              : blog.category === "tips"
              ? "Mẹo hay"
              : blog.category === "news"
              ? "Tin tức"
              : "Công nghệ"}
          </Box>

          <Text className="blog-detail-title">{blog.title}</Text>

          <Box className="blog-meta">
            <Box className="author-info">
              <Avatar src={blog.author.avatar} size={36} />
              <Box>
                <Text className="author-name">{blog.author.name}</Text>
                <Text className="publish-date">{blog.publishDate}</Text>
              </Box>
            </Box>
            <Box className="reading-time">
              <Clock size={16} />
              <Text>{blog.readingTime}</Text>
            </Box>
          </Box>
        </Box>

        <Box
          className="blog-detail-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        <Box className="blog-actions">
          <Button
            className={`action-button ${liked ? "active" : ""}`}
            variant="text"
            onClick={handleLike}
            icon={<ThumbsUp size={20} fill={liked ? "#4F46E5" : "none"} />}
          >
            {blog.likes}
          </Button>

          <Button
            className="action-button"
            variant="text"
            onClick={() => setShowCommentSheet(true)}
            icon={<MessageSquare size={20} />}
          >
            {blog.comments.length}
          </Button>

          <Button
            className="action-button"
            variant="text"
            onClick={() => {}}
            icon={<Share2 size={20} />}
          >
            Chia sẻ
          </Button>

          <Button
            className={`action-button ${bookmarked ? "active" : ""}`}
            variant="text"
            onClick={handleBookmark}
            icon={
              <Bookmark size={20} fill={bookmarked ? "#4F46E5" : "none"} />
            }
          >
            Lưu
          </Button>
        </Box>

        <Box className="comment-section">
          <Text className="section-title">
            Bình luận ({blog.comments.length})
          </Text>
          {blog.comments.length > 0 ? (
            <Box className="comment-list">
              {blog.comments.map((comment) => (
                <Box key={comment.id} className="comment-item">
                  <Avatar src={comment.user.avatar} size={40} />
                  <Box className="comment-content">
                    <Box className="comment-header">
                      <Text className="comment-user">{comment.user.name}</Text>
                      <Text className="comment-time">{comment.timestamp}</Text>
                    </Box>
                    <Text className="comment-text">{comment.content}</Text>
                    <Box className="comment-actions">
                      <Button variant="text" size="small" icon={<Heart size={16} />}>
                        {comment.likes}
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        icon={<MessageSquare size={16} />}
                      >
                        Trả lời
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className="empty-comments">
              <Text>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</Text>
            </Box>
          )}
        </Box>
      </Box>

      <Sheet visible={showCommentSheet} onClose={() => setShowCommentSheet(false)}>
        <Box className="comment-sheet">
          <Text className="sheet-title">Thêm bình luận</Text>
          <Input
            type="text"
            placeholder="Nhập bình luận của bạn..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button icon={<Send />} onClick={handleComment}>
            Gửi
          </Button>
        </Box>
      </Sheet>
    </Page>
  );
};

export default BlogDetailPage;
