import { ArrowRight } from 'lucide-react'

export default function TermsPage() {
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-10 my-20 min-h-screen">
            <div className="space-y-3">
                <h1 className="text-2xl font-medium">Điều khoản & dịch vụ</h1>
                <p>
                    Chào mừng bạn đến với OPIc do{' '}
                    <a target="_blank" href="fb.com/trongandev" className="text-primary underline">
                        trongandev
                    </a>{' '}
                    vận hành. Khi truy cập hoặc sử dụng website, ứng dụng, và các dịch vụ liên quan (gọi chung là “Dịch vụ”), bạn đồng ý bị ràng buộc bởi Điều khoản Dịch vụ này (“Điều khoản”). Nếu bạn
                    không đồng ý, vui lòng ngừng sử dụng Dịch vụ.
                </p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Mô tả Dịch vụ</h1>
                <p>
                    Dịch vụ cung cấp môi trường luyện tập và nâng cao kỹ năng nói tiếng Anh, tham khảo cấu trúc thi OPIc, bao gồm nhưng không giới hạn: phát hiện âm vị, chấm điểm phát âm, phản hồi về
                    lưu loát/độ chính xác, mô phỏng câu hỏi phỏng vấn, và nội dung do người học chia sẻ.
                </p>
                <p className="text-red-700 inline-flex items-center gap-2">
                    <ArrowRight size={16} /> Dịch vụ KHÔNG phải là nền tảng thi chính thức và không bảo đảm kết quả thi OPIc thực tế.
                </p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Không liên kết với OPIc/ACTFL</h1>
                <p>OPIc là viết tắt của Oral Proficiency Interview – computer. OPIc và các nhãn hiệu liên quan là tài sản của ACTFL và/hoặc các chủ sở hữu liên quan.</p>
                <p>
                    Chúng tôi không liên kết, tài trợ, hay được chứng thực bởi ACTFL hay bất kỳ tổ chức sở hữu OPIc nào. Mọi tài liệu liên quan OPIc trong Dịch vụ chỉ nhằm mục đích học tập, tham khảo.
                </p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Tài khoản và điều kiện sử dụng</h1>
                <p>Bạn phải đủ 18 tuổi, hoặc đủ [13/16] tuổi và có sự đồng ý hợp pháp của cha mẹ/người giám hộ theo luật áp dụng.</p>
                <p>Bạn chịu trách nhiệm về độ chính xác của thông tin đăng ký và bảo mật thông tin đăng nhập. Mọi hoạt động diễn ra dưới tài khoản của bạn được coi là do bạn thực hiện.</p>
                <p>Chúng tôi có quyền tạm ngừng hoặc chấm dứt tài khoản nếu phát hiện vi phạm Điều khoản hoặc hành vi gây hại cho Dịch vụ hoặc người dùng khác.</p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Nội dung do người dùng tạo (UGC)</h1>
                <p>Dịch vụ cho phép bạn đăng, tải lên, ghi âm, hoặc chia sẻ nội dung (ví dụ: câu trả lời nói, văn bản, bình luận, tài liệu luyện tập).</p>
                <p>
                    Bạn giữ quyền sở hữu đối với UGC của mình, nhưng cấp cho chúng tôi giấy phép toàn cầu, không độc quyền, có thể cấp lại, có phí hoặc miễn phí, để sử dụng, sao chép, lưu trữ, sửa
                    đổi, phân phối, hiển thị, phát hành và tạo tác phẩm phái sinh từ UGC nhằm vận hành, cải thiện và quảng bá Dịch vụ.
                </p>
                <p>
                    Bạn cam kết UGC không vi phạm bản quyền, nhãn hiệu, bí mật kinh doanh, quyền riêng tư hoặc các quyền khác; không chứa nội dung bất hợp pháp, thù ghét, quấy rối, khiêu dâm trái pháp
                    luật, spam, mã độc, hoặc thông tin sai lệch.
                </p>
                <p>Chúng tôi có thể xem xét, gỡ bỏ, chặn hoặc vô hiệu hóa UGC theo luật hoặc khi thấy cần thiết để bảo vệ cộng đồng, nhưng không có nghĩa vụ kiểm duyệt toàn bộ nội dung.</p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Tuyên bố về tính chính xác nội dung học tập</h1>
                <p>
                    Một phần nội dung trên Dịch vụ do người học chia sẻ lại, không phải tài liệu chính thức, chỉ là nguồn tham khảo để hiểu cách thi và dàn bài. Nội dung có thể không đầy đủ, không
                    chính xác hoặc lỗi thời.
                </p>
                <p>Chúng tôi không bảo đảm tính chính xác, đầy đủ hoặc hữu dụng của bất kỳ nội dung nào, và không chịu trách nhiệm đối với việc bạn dựa vào nội dung đó.</p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Tính năng AI và dữ liệu giọng nói</h1>
                <p>
                    Để cung cấp các chức năng như phát hiện âm vị, chấm điểm phát âm, phân tích giọng nói, Dịch vụ có thể thu thập và xử lý dữ liệu âm thanh/giọng nói, bản ghi, bản phiên âm và dữ liệu
                    kỹ thuật liên quan.
                </p>
                <p>
                    Mục đích sử dụng: cung cấp phản hồi, chấm điểm, cải thiện mô hình AI và nâng cao chất lượng Dịch vụ. Tùy chọn: bạn có thể cho phép hoặc từ chối việc dùng dữ liệu của mình để cải
                    thiện mô hình qua [trang cài đặt/tùy chọn consent] (nếu có).
                </p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Quyền sở hữu trí tuệ</h1>
                <p>
                    Tất cả nội dung, phần mềm, thiết kế, nhãn hiệu, logo, và tài liệu thuộc Dịch vụ (trừ UGC) là tài sản của chúng tôi hoặc đối tác cấp phép. Bạn được cấp quyền sử dụng có giới hạn,
                    không độc quyền, không thể chuyển nhượng để truy cập và dùng Dịch vụ theo Điều khoản.
                </p>
                <p>Bạn không được sao chép, sửa đổi, dịch ngược, biên dịch, khai thác, bán lại, hay tạo tác phẩm phái sinh từ Dịch vụ nếu không có sự cho phép bằng văn bản.</p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Hành vi bị cấm</h1>
                <p>Sử dụng Dịch vụ cho mục đích bất hợp pháp, gian lận thi cử, hoặc lách quy định của kỳ thi chính thức.</p>
                <p>Quấy rối, đe dọa, mạo danh, xâm phạm quyền riêng tư của người khác.</p>
                <p> Can thiệp vào hoạt động của Dịch vụ, đưa mã độc, thu thập dữ liệu trái phép, hoặc truy cập trái phép.</p>
                <p> Tải lên nội dung vi phạm bản quyền; chia sẻ đáp án/đề thi chính thức khi không có quyền.</p>
                <p>Tự động hóa, scraping, hoặc sử dụng bot/thư viện để trích xuất dữ liệu nếu chưa được cho phép.</p>
            </div>
            <div className="space-y-3">
                <h1 className="text-xl font-medium">Khiếu nại bản quyền và gỡ bỏ nội dung</h1>
                <p>
                    Nếu bạn tin rằng nội dung trên Dịch vụ vi phạm bản quyền, vui lòng gửi thông báo đến{' '}
                    <a href="mailto:trongandev@gmail.com" className="text-primary underline">
                        trongandev@gmail.com
                    </a>{' '}
                    kèm:
                </p>
                <p>(1) thông tin người khiếu nại;</p>
                <p>(2) mô tả tác phẩm bị xâm phạm;</p>
                <p>(3) vị trí nội dung bị cáo buộc;</p>
                <p>(4) tuyên bố thiện chí và độ chính xác;</p>
                <p>(5) chữ ký điện tử hoặc bản cứng.</p>
                <p>Chúng tôi sẽ xử lý theo luật áp dụng.</p>
            </div>
        </div>
    )
}
