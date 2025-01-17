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
        await axios.delete([api.mockApi(), id].join("/"));
        return true;
    } catch (error) {
        console.error('Failed to delete product:', error);
        return false;
    }
}