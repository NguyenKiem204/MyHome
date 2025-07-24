import React, { useState, useEffect } from "react";
import { Box, Text, Button, useSnackbar } from "zmp-ui";
import api from "../services/api";
import useAuthStore from "../store/useAuthStore";

const VoteSection = ({ buildingIds = ["nloxyb1gpm9o6jf76z9pg0fj"] }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [textAnswers, setTextAnswers] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const { openSnackbar } = useSnackbar();
  const { user } = useAuthStore();

  const handleTextChange = (questionId, value) => {
    setTextAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleOptionChange = (questionId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const fetchVoteSurveys = async () => {
    try {
      setLoading(true);
      
      // 1. Lấy danh sách vote/survey với populate questions và options
      const buildingIdsParam = buildingIds.join(',');
      const response = await api.get("/vote-surveys", {
        params: {
          "filters[$or][0][buildings][documentId][$in]": buildingIdsParam,
          "filters[$or][1][buildings][id][$null]": true,
          "populate[questions][populate][options]": true,
        },
      });

      if (response.data && response.data.data) {
        // 2. Lọc các item có trạng thái active
        const activeItems = response.data.data.filter(
          (item) => item.statusVote_survey === "active"
        );

        // 3. Xử lý từng item để lấy thông tin user responses
        const itemsWithDetails = await Promise.all(
          activeItems.map(async (item) => {
            try {
              // Khởi tạo thông tin cơ bản
              item.hasVoted = false;
              item.responseId = null;
              item.userAnswers = [];

              // 4. Kiểm tra user đã vote chưa (chỉ khi đã đăng nhập)
              if (user) {
                const responseCheck = await api.get("/survey-responses", {
                  params: {
                    "filters[vote_survey]": item.id,
                    "filters[resident]": user.id,
                  },
                });

                const userResponses = responseCheck.data.data || [];
                
                if (userResponses.length > 0) {
                  item.hasVoted = true;
                  item.responseId = userResponses[0].id;

                  // 5. Lấy chi tiết các câu trả lời của user
                  const userAnswersResponse = await api.get("/survey-answers", {
                    params: {
                      "filters[survey_response]": item.responseId,
                      "populate[question]": true,
                      "populate[option]": true,
                    },
                  });

                  item.userAnswers = userAnswersResponse.data.data || [];
                  
                  console.log(`User vote status for ${item.id}:`, {
                    hasVoted: item.hasVoted,
                    responseId: item.responseId,
                    userAnswers: item.userAnswers,
                  });
                }
              }

              return item;
            } catch (err) {
              console.error(`Error processing item ${item.id}:`, err);
              // Trả về item với thông tin mặc định nếu có lỗi
              return {
                ...item,
                hasVoted: false,
                responseId: null,
                userAnswers: []
              };
            }
          })
        );

        console.log("Processed items with details:", itemsWithDetails);
        setItems(itemsWithDetails);
        
        // Khởi tạo selected options và text answers từ user answers
        const initialSelectedOptions = {};
        const initialTextAnswers = {};
        
        itemsWithDetails.forEach(item => {
          if (item.userAnswers && item.userAnswers.length > 0) {
            item.userAnswers.forEach(answer => {
              if (answer.option) {
                initialSelectedOptions[answer.question.id] = answer.option.id;
              }
              if (answer.textAnswer) {
                initialTextAnswers[answer.question.id] = answer.textAnswer;
              }
            });
          }
        });
        
        setSelectedOptions(initialSelectedOptions);
        setTextAnswers(initialTextAnswers);
      }
    } catch (err) {
      console.error("Error fetching vote surveys:", err);
      setError("Không thể tải danh sách bình chọn. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteSurveys();
  }, [user]); // Thêm user vào dependency để refresh khi login/logout

  const handleVote = async (item, question, optionId = null, textAnswer = null) => {
    try {
      // Kiểm tra đăng nhập
      if (!user) {
        openSnackbar({
          text: "Vui lòng đăng nhập để tham gia bình chọn",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      // Kiểm tra đã vote chưa
      if (item.hasVoted) {
        openSnackbar({
          text: "Bạn đã tham gia bình chọn này rồi",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      // Validate input
      if (question.type === "text") {
        const currentTextAnswer = textAnswer || textAnswers[question.id];
        if (!currentTextAnswer || currentTextAnswer.trim() === "") {
          openSnackbar({
            text: "Vui lòng nhập câu trả lời",
            type: "warning",
            duration: 3000,
          });
          return;
        }
        textAnswer = currentTextAnswer.trim();
      }

      if (question.type !== "text" && !optionId) {
        openSnackbar({
          text: "Vui lòng chọn một lựa chọn",
          type: "warning",
          duration: 3000,
        });
        return;
      }

      // Show loading state
      const loadingSnackbar = openSnackbar({
        text: "Đang gửi bình chọn...",
        type: "loading",
        duration: 10000,
      });

      // Tạo survey response nếu chưa có
      let responseId = item.responseId;
      if (!responseId) {
        const responseResult = await api.post("/survey-responses", {
          data: {
            vote_survey: item.id,
            resident: user.id,
          },
        });
        responseId = responseResult.data.data.id;
      }

      // Chuẩn bị data cho survey answer
      const answerData = {
        data: {
          survey_response: responseId,
          question: question.id,
        },
      };

      // Thêm data tương ứng với loại câu hỏi
      if (question.type === "text") {
        answerData.data.textAnswer = textAnswer;
      } else {
        answerData.data.option = optionId;
      }

      // Gửi câu trả lời
      await api.post("/survey-answers", answerData);

      // Close loading snackbar
      if (loadingSnackbar && typeof loadingSnackbar.close === 'function') {
        loadingSnackbar.close();
      }

      openSnackbar({
        text: "Bình chọn thành công!",
        type: "success",
        duration: 3000,
      });

      // Refresh danh sách để cập nhật trạng thái
      await fetchVoteSurveys();

    } catch (err) {
      console.error("Error submitting vote:", err);
      
      let errorMessage = "Không thể gửi bình chọn. Vui lòng thử lại!";
      
      // Xử lý các lỗi cụ thể từ API
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 400 && data.error) {
          if (data.error.message) {
            errorMessage = data.error.message;
          } else if (data.error.details) {
            errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.";
          }
        } else if (status === 401) {
          errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        } else if (status === 403) {
          errorMessage = "Bạn không có quyền thực hiện hành động này.";
        } else if (status === 404) {
          errorMessage = "Không tìm thấy bình chọn hoặc câu hỏi.";
        } else if (status === 409) {
          errorMessage = "Bạn đã trả lời câu hỏi này rồi.";
        } else if (status >= 500) {
          errorMessage = "Lỗi hệ thống. Vui lòng thử lại sau.";
        }
      } else if (err.request) {
        errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
      }
      
      openSnackbar({
        text: errorMessage,
        type: "error",
        duration: 4000,
      });
    }
  };

  // Hàm kiểm tra user đã trả lời câu hỏi này chưa
  const hasAnsweredQuestion = (item, questionId) => {
    if (!item.userAnswers) return false;
    return item.userAnswers.some(answer => answer.question.id === questionId);
  };

  // Hàm lấy câu trả lời của user cho câu hỏi
  const getUserAnswerForQuestion = (item, questionId) => {
    if (!item.userAnswers) return null;
    return item.userAnswers.find(answer => answer.question.id === questionId);
  };

  if (loading) {
    return (
      <Box className="flex justify-center items-center p-4">
        <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <Text className="ml-2 text-gray-600">Đang tải...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <Text className="text-red-600">{error}</Text>
          <Button 
            onClick={fetchVoteSurveys} 
            className="mt-2 bg-red-100 text-red-600 hover:bg-red-200"
            size="small"
          >
            Thử lại
          </Button>
        </div>
      </Box>
    );
  }

  return (
    <Box className="p-4 space-y-6">
      {items.map((item) => (
        <Box
          key={item.id}
          className="bg-white rounded-xl shadow-lg p-4 space-y-4 transform transition-all duration-300 hover:shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <Text className="text-lg font-medium">{item.title}</Text>
            <div className="flex items-center space-x-2">
              <Text
                className={`text-xs px-2 py-1 rounded-full ${
                  item.type === "vote"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {item.type === "vote" ? "Bình chọn" : "Khảo sát"}
              </Text>
              {item.hasVoted && (
                <Text className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-600">
                  ✓ Đã tham gia
                </Text>
              )}
            </div>
          </div>

          {/* Description */}
          <Text className="text-sm text-gray-600">{item.description}</Text>

          {/* Anonymous notice */}
          {item.isAnonymous && (
            <Text className="text-xs text-orange-500 italic">
              * Khảo sát này được thực hiện ẩn danh
            </Text>
          )}

          {/* Questions */}
          {item.questions && item.questions.map((question) => {
            const hasAnswered = hasAnsweredQuestion(item, question.id);
            const userAnswer = getUserAnswerForQuestion(item, question.id);

            return (
              <div key={question.id} className="space-y-3 border-t pt-3">
                <Text className="font-medium">{question.content}</Text>

                {question.type === "text" ? (
                  // Text input for text questions
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={4}
                      disabled={hasAnswered}
                      value={hasAnswered ? userAnswer?.textAnswer || "" : (textAnswers[question.id] || "")}
                      onChange={(e) => handleTextChange(question.id, e.target.value)}
                    />
                    {!hasAnswered && (
                      <Button
                        onClick={() => handleVote(item, question, null, textAnswers[question.id])}
                        className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        size="small"
                        disabled={!textAnswers[question.id] || textAnswers[question.id].trim() === ""}
                      >
                        Gửi câu trả lời
                      </Button>
                    )}
                    {hasAnswered && (
                      <Text className="text-sm text-green-600 italic">
                        ✓ Đã trả lời
                      </Text>
                    )}
                  </div>
                ) : (
                  // Options for multiple choice questions
                  <div className="space-y-3">
                    {question.options && question.options.map((option) => {
                      const isSelected = hasAnswered ? 
                        userAnswer?.option?.id === option.id : 
                        selectedOptions[question.id] === option.id;
                      
                      return (
                        <div 
                          key={option.id} 
                          className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                            isSelected ? 'border-blue-500 bg-blue-50' : 'hover:border-blue-300 hover:bg-gray-50'
                          } ${hasAnswered ? 'opacity-75 cursor-not-allowed' : ''}`}
                          onClick={() => {
                            if (!hasAnswered) {
                              handleOptionChange(question.id, option.id);
                              handleVote(item, question, option.id);
                            }
                          }}
                        >
                          <input
                            type="radio"
                            name={`question-${question.id}`}
                            value={option.id}
                            disabled={hasAnswered}
                            checked={isSelected}
                            onChange={() => {}} // Handled by onClick
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                          />
                          <Text className="text-sm flex-grow">{option.content}</Text>
                          {isSelected && hasAnswered && (
                            <Text className="text-xs text-green-600">✓</Text>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Date info */}
          <div className="flex justify-between items-center text-sm text-gray-500 mt-4 pt-4 border-t">
            <Text>
              Bắt đầu: {new Date(item.startDate).toLocaleDateString("vi-VN")}
            </Text>
            <Text>
              Kết thúc: {new Date(item.endDate).toLocaleDateString("vi-VN")}
            </Text>
          </div>
        </Box>
      ))}

      {/* Empty state */}
      {items.length === 0 && !loading && (
        <Box className="text-center py-8">
          <Text className="text-gray-500">
            Không có bình chọn hoặc khảo sát nào đang diễn ra
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default VoteSection;