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

        return SuccessResponse.ok(res, 'Lấy thông tin danh mục thành công', result)
    })
    createCategory = catchAsync(async (req, res, next) => {
        const dataCategory = req.body
        const result = await categoryService.createCategory(dataCategory)

        return SuccessResponse.ok(res, 'Tạo danh mục thành công', result)
    })

    updateCategory = catchAsync(async (req, res, next) => {
        const { id } = req.params
        const dataCategory = req.body
        const result = await categoryService.updateCategory(id, dataCategory)

        return SuccessResponse.ok(res, 'Cập nhật thông tin danh mục thành công', result)
    })
}

module.exports = new CategoryController()
