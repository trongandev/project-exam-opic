# Topics:

GET /api/topics - Lấy danh sách (có phân trang, tìm kiếm)
GET /api/topics/:id - Lấy theo ID  
GET /api/topics/slug/:slug - Lấy theo slug
POST /api/topics - Tạo mới (cần auth)
PUT /api/topics/:id - Cập nhật (cần auth)
DELETE /api/topics/:id - Xóa (cần auth)

POST /api/topics/:id/questions - Thêm câu hỏi
PUT /api/topics/:topicId/questions/:questionId - Sửa câu hỏi  
DELETE /api/topics/:topicId/questions/:questionId - Xóa câu hỏi

# Exam Histories:

GET /api/exam-histories - Tất cả (admin)
GET /api/exam-histories/my-histories - Của user hiện tại
GET /api/exam-histories/my-statistics - Thống kê user hiện tại
GET /api/exam-histories/user/:userId - Theo user (admin)
GET /api/exam-histories/statistics/:userId - Thống kê theo user
GET /api/exam-histories/:id - Theo ID
POST /api/exam-histories - Tạo mới
PUT /api/exam-histories/:id - Cập nhật
DELETE /api/exam-histories/:id - Xóa

POST /api/exam-histories/:id/answers - Thêm câu trả lời
PUT /api/exam-histories/:historyId/answers/:answerId - Sửa câu trả lời
