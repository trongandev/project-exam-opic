const ErrorResponse = require('../core/error')
const { CategoryModel } = require('../models/category.model')

class CategoryService {
    async getAllCategories() {
        const categories = await CategoryModel.find({ isActive: true }).sort({ createdAt: -1 }).lean()
        return categories
    }

    async getCategoryById(id) {
        const category = await CategoryModel.findById(id).lean()

        return category
    }

    async createCategory(dataCategory) {
        const { title, desc, icon } = dataCategory

        const newCategory = new CategoryModel({ title, desc, icon })
        await newCategory.save()

        return newCategory
    }

    async createManyCategory(dataCategories) {
        for (const dataCategory of dataCategories) {
            const { title, desc, icon } = dataCategory

            const newCategory = new CategoryModel({ title, desc, icon })
            await newCategory.save()
        }

        return true
    }

    async updateCategory(id, dataCategory) {
        const { icon, title, desc, isActive } = dataCategory
        const category = await CategoryModel.findById(id)

        if (!category) {
            return false
        }
        // Cập nhật các trường
        if (icon !== undefined) category.icon = icon
        if (title !== undefined) category.title = title
        if (desc !== undefined) category.desc = desc
        if (isActive !== undefined) category.isActive = isActive
        await category.save()

        return category
    }

    async deleteCategory(id) {
        const category = await CategoryModel.findById(id)

        if (!category) {
            return false
        }

        await CategoryModel.deleteOne({ _id: id })
        return true
    }
}

module.exports = new CategoryService()
