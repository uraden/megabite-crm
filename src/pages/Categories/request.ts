import api from '../../api'
import axios from 'axios'

export const getAllCategories = async () => {
    try {
        const response = await axios.get(api.category());
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return null;
    }
}

export const deleteCategory = async (id: string) => {
    try {
        await axios.delete(api.modifyCategory(id));
        return true;
    } catch (error) {
        console.error('Failed to delete category:', error);
        return false;
    }
}

export const addCategory = async (categoryData : {
    name: string
}) =>{
    try {
        await axios.post(api.category(), categoryData);
        return true;
    } catch (error) {
        console.error('Failed to add category:', error);
        return false;
    }
}

export const updateCategory = async (id: string, categoryData: {
    name: string
}) => {
    try {
        await axios.put(api.modifyCategory(id), categoryData);
        return true;
    } catch (error) {
        console.error('Failed to update category:', error);
        return false;
    }
}