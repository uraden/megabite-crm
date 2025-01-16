import { useState } from 'react';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Row, Select, Space, Upload, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

function Products() {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState<string>();
    const [loading, setLoading] = useState(false);

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

    const addNewProduct = (values: any) => {
        const productData = {
            ...values,
            image: imageUrl, // Attach the uploaded image URL
        };
        console.log('Product Data:', productData);
        form.resetFields();
        setOpen(false);
    };

    console.log('Image URL:', imageUrl);

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
                                    Save
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </Space>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        </div>
    );
}

export default Products;
