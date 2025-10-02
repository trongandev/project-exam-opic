const HTML_TEMPLATE = (user, code, message, detail) => {
    return `
    <!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <title>OTP Email Template</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 0;
                margin: 0;
                width: 100%;
            }
            .container {
                width: 100%;
            }
            .container-sec {
                background-color: #ffffff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                max-width: 600px;
                margin-left: auto;
                margin-right: auto;
            }
            .otp-code {
                font-size: 24px;
                font-weight: bold;
                background-color: #f8f9fa;
                padding: 15px;
                text-align: center;
                border-radius: 8px;
                border: 1px dashed #007bff;
                color: #007bff;
            }
            .btn-verify {
                display: inline-block;
                padding: 10px 20px;
                color: #ffffff;
                background-color: #007bff;
                border-radius: 6px;
                text-decoration: none;
                font-weight: bold;
            }
            .footer-text {
                color: #6c757d;
                font-size: 14px;
                text-align: center;
                margin-top: 20px;
            }
            .footer-text a {
                color: #007bff;
                text-decoration: none;
            }
            .otp-lock {
                color: #333;
                font-size: 80px;
            }
            .welcome-section {
                background: #144fa9db;
                padding: 30px;
                border-radius: 4px;
                color: #fff;
                font-size: 20px;
                margin: 20px 0px;
            }
            .welcome-text {
                font-family: monospace;
            }
            .app-name {
                font-size: 30px;
                font-weight: 800;
                text-align: center;
            }
            .verify-text {
                margin-top: 25px;
                font-size: 25px;
                letter-spacing: 3px;
            }
            i.fas.fa-envelope-open {
                font-size: 35px !important;
                color: #ffffff;
            }
            .black {
                color: #000;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="container-sec">
                <div class="text-center">
                    <div class="welcome-section">
                        <div class="app-name">OPIc Exam</div>
                    </div>
                    <h2 class="black">Xin chào, ${user}</h2>
                    <p class="black">${message} của bạn là:</p>
                    <div class="otp-code">${code}</div>
                    <p class="mt-4 black">${detail}</p>
                </div>
                <div class="footer-text">
                    <p>Nếu bạn gặp lỗi, vui lòng <a href="mailto:trongandev@gmail.com">liên hệ</a> cho chúng tôi.</p>
                </div>
            </div>
        </div>
    </body>
</html>`
}

module.exports = HTML_TEMPLATE
