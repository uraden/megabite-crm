import api from '../../api';
import axios from 'axios';

export const getAllProducts = async () => {
    try {
        const response = await axios.get(api.mockApi());
        return response.data;
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return null;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        await axios.delete(api.modifyMockApi(id));
        return true;
    } catch (error) {
        console.error('Failed to delete product:', error);
        return false;
    }
}

export const addProduct = async (productData: {
    category: string;
    name: string;
    description: string;
    image: string;
}) => {
    try {
        await axios.post(api.mockApi(), productData);
        return true;
    } catch (error) {
        console.error('Failed to add product:', error);
        return false;
    }
}

export const updateProduct = async (id: string, productData: {
    category: string;
    name: string;
    description: string;
    image: string;
}) => {
    try {
        await axios.put(api.modifyMockApi(id), productData);
        return true;
    } catch (error) {
        console.error('Failed to update product:', error);
        return false;
    }
}