import { useState, useEffect } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Row, Select, Space, Upload, message, Table, Popconfirm } from 'antd';
import axios from 'axios';
import { getAllProducts, deleteProduct } from './request';
import { CiEdit, CiTrash} from "react-icons/ci";


const { Option } = Select;

interface ProductsProps {
    id: string;
    category: string;
    description: string;
    name: string;
    url: string;
}

function Products() {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState<ProductsProps[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const products = await getAllProducts();
            if (products) {
                setProducts(products);
            }
        };
        fetchProducts();
    }, []);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const beforeUpload = (file: File) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must be smaller than 2MB!');
            return false;
        }
        return true;
    };

  
    // @ts-check
    // eslint-disable-next-line
    const handleUpload = async (file: File, onSuccess: Function, onError: Function) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            setLoading(true);
            const response = await axios.post('https://api.imgbb.com/1/upload?key=5be20866388a0566b4ef827905c25307', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setImageUrl(response.data.data.url); 
            message.success('Image uploaded successfully!');
            onSuccess('ok'); 
        } catch (error) {
            message.error('Failed to upload the image. Please try again.');
            onError(error); 
        } finally {
            setLoading(false);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const addNewProduct = (values: {
        category: string;
        name: string;
        description: string;
    }) => {
        const productData = {
            ...values,
            image: imageUrl, 
        };
        console.log('Product Data:', productData);
        form.resetFields();
        setOpen(false);
        setImageUrl(undefined);
        message.success('Товар успешно добавлен!');
    };

    const deleteProductHandler = async (id: string) => {
        const isDeleted = await deleteProduct(id);
        if (isDeleted) {
            const updatedProducts = products.filter((product) => product.id !== id);
            setProducts(updatedProducts);
            message.success('Товар успешно удален!');
        } else {
            message.error('Не удалось удалить товар. Пожалуйста, попробуйте еще раз.');
        }
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Наименование товара',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: '',
            key: 'action',
            render: (record: ProductsProps) => (
                <Space className='flex justify-end'>
                    <div className='mr-6' onClick={()=> {console.log('edit', record?.id)}}><CiEdit size={20}/></div>
                    <Popconfirm 
                        title="Вы уверены, что хотите удалить этот товар?" 
                        okText="Да" 
                        cancelText="Нет"
                        onConfirm={() => deleteProductHandler(record?.id)}
                        >
                       <CiTrash size={20} className='hover:cursor-pointer'/>
                    </Popconfirm>
                </Space>
            ),
        }
    ];



    return (
        <div>
            <div className="flex justify-end">
                <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                    Создать товар
                </Button>
                <Drawer
                    title="Создать товар"
                    width={600}
                    onClose={onClose}
                    open={open}
                    bodyStyle={{ paddingBottom: 80 }}
                >
                    <Form
                        layout="vertical"
                        hideRequiredMark
                        form={form}
                        onFinish={addNewProduct}
                    >
                        <Form.Item
                            name="category"
                            label="Категория"
                            rules={[{ required: true, message: 'Пожалуйста, выберите категорию' }]}
                        >
                            <Select placeholder="Пожалуйста, выберите категорию">
                                <Option value="electronics">Электроника</Option>
                                <Option value="fashion-appearl">Мода и одежда</Option>
                                <Option value="home-kitchen">Дом и кухня</Option>
                                <Option value="health-beauty">Здоровье и красота</Option>
                                <Option value="sports-outdoors">Спорт и отдых на природе</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="name"
                            label="Наименования товара"
                            rules={[{ required: true, message: 'Пожалуйста, введите название товара' }]}
                        >
                            <Input placeholder="Пожалуйста, введите название товара" />
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Описание"
                            rules={[{ required: true, message: 'Пожалуйста, введите описание' }]}
                        >
                            <Input.TextArea rows={4} placeholder="Пожалуйста, введите описание" />
                        </Form.Item>

                        <Form.Item
                            label="Изображение"
                        >
                            <Upload
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeUpload}
                                customRequest={({ file, onSuccess, onError }) =>
                                    // eslint-disable-next-line
                                    // @ts-ignore
                                    handleUpload(file as File, onSuccess, onError)
                                }
                            >
                                {imageUrl ? (
                                    <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
                                ) : (
                                    uploadButton
                                )}
                            </Upload>
                        </Form.Item>

                        <Row justify="center">
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Сохранить 
                                </Button>
                                <Button onClick={onClose}>Отмена</Button>
                            </Space>
                        </Row>
                    </Form>
                </Drawer>
            </div>
            <div>
                <Table columns={columns} dataSource={products} rowKey="id" />
            </div>
        </div>
    );
}

export default Products;