const ErrorResponse = require('../core/error')
const SuccessResponse = require('../core/success')
const catchAsync = require('../middlewares/catchAsync')
const categoryService = require('../services/category.service')

class CategoryController {
    getAllCategories = catchAsync(async (req, res, next) => {
        const result = await categoryService.getAllCategories()

        return SuccessResponse.ok(res, 'Lấy thông tin danh mục thành công', result)
    })

    getCategoryById = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const result = await categoryService.getCategoryById(id)
        if (!result) {
            return ErrorResponse.notFound(res, 'Không tìm thấy danh mục')
        }

        return SuccessResponse.ok(res, 'Lấy thông tin danh mục thành công', result)
    })

    createCategory = catchAsync(async (req, res, next) => {
        const result = await categoryService.createCategory(req.body)

        return SuccessResponse.ok(res, 'Tạo danh mục thành công', result)
    })

    createManyCategory = catchAsync(async (req, res, next) => {
        await categoryService.createManyCategory(req.body)

        return SuccessResponse.ok(res, 'Tạo nhiều danh mục thành công')
    })

    updateCategory = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const result = await categoryService.updateCategory(id, req.body)
        if (!result) {
            return ErrorResponse.notFound(res, 'Không tìm thấy danh mục')
        }

        return SuccessResponse.ok(res, 'Cập nhật thông tin danh mục thành công', result)
    })

    deleteCategory = catchAsync(async (req, res, next) => {
        const { id } = req.params
        await categoryService.deleteCategory(id)
        return SuccessResponse.ok(res, 'Xóa danh mục thành công')
    })
}

module.exports = new CategoryController()
