const { CategoryModel } = require('../models/category.model')

class CategoryService {
    async getAllCategories() {
        const categories = await CategoryModel.find({ isActive: true }).sort({ createdAt: -1 }).lean()
        return categories
    }

    async getCategoryById(id) {
        const category = await CategoryModel.findById(id).lean()

        if (!category) {
            throw new ErrorResponse('Không tìm thấy danh mục', 404)
        }

        return category
    }

    async createCategory(dataCategory) {
        const { title, desc, icon } = dataCategory

        const newCategory = new CategoryModel({ title, desc, icon })
        await newCategory.save()

        return newCategory
    }

    async updateCategory(id, dataCategory) {
        const { title, desc, isActive } = dataCategory
        const category = await CategoryModel.findById(id)

        if (!category) {
            throw new ErrorResponse('Không tìm thấy danh mục', 404)
        }
        // Cập nhật các trường
        if (title !== undefined) category.title = title
        if (desc !== undefined) category.desc = desc
        if (isActive !== undefined) category.isActive = isActive
        await category.save()

        return category
    }
}

module.exports = new CategoryService()
