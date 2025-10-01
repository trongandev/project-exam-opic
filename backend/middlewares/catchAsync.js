//wrapper function để không phải viết try-catch trong mỗi controller:
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch((err) => {
            next(err)
        })
    }
}

module.exports = catchAsync
