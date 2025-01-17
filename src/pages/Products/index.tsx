import { useState, useEffect } from "react";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Upload,
  message,
  Table,
  Popconfirm,
} from "antd";
import { getAllProducts, deleteProduct, addProduct, updateProduct } from "./request";
import { CiEdit, CiTrash } from "react-icons/ci";

const { Option } = Select;

interface ProductsProps {
  id: string;
  category: string;
  description: string;
  name: string;
  url: string;
  image: string;
}

function Products() {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductsProps | null>(
    null
  );

  const fetchProducts = async () => {
    const products = await getAllProducts();
    if (products) {
      setProducts(products);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showDrawer = (product?: ProductsProps) => {
    if (product) {
      setEditMode(true);
      setSelectedProduct(product);
      form.setFieldsValue({
        category: product.category,
        name: product.name,
        description: product.description,
      });
      setImageUrl(product.image);
    } else {
      setEditMode(false);
      setSelectedProduct(null);
      form.resetFields();
      setImageUrl(undefined);
    }
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    form.resetFields();
    setImageUrl(undefined);
  };

  const handleFormSubmit = async (values: {
    category: string;
    name: string;
    description: string;
  }) => {
    const productData = {
      ...values,
      image: imageUrl || "",
    };

    if (editMode && selectedProduct) {
        
      const isUpdated = await updateProduct(selectedProduct.id, productData);
      
      if (isUpdated) {
        await fetchProducts();
        message.success("Товар успешно обновлен!");
      }

    } else {
      const isAdded = await addProduct(productData);
      if (isAdded) {
        await fetchProducts();
      }
      message.success("Товар успешно добавлен!");
    }

    onClose();
  };

  const deleteProductHandler = async (id: string) => {
    const isDeleted = await deleteProduct(id);
    if (isDeleted) {
      setProducts(products.filter((product) => product.id !== id));
      message.success("Товар успешно удален!");
    } else {
      message.error(
        "Не удалось удалить товар. Пожалуйста, попробуйте еще раз."
      );
    }
  };




const props = {
    name: 'image',
    action: 'https://api.imgbb.com/1/upload?key=5be20866388a0566b4ef827905c25307',
    maxCount: 1,
    listType: 'picture',
    onChange: (info: {
        file: { status: string; response: { data: { url: string } }; name: string };
    }) => {
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.data.url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },

}


const editProps = {
    name: 'image',
    action: 'https://api.imgbb.com/1/upload?key=5be20866388a0566b4ef827905c25307',
    maxCount: 1,
    listType: 'picture',
    defaultFileList: [
        {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: imageUrl,
        },
    ],
    onChange: (info: {
        file: { status: string; response: { data: { url: string } }; name: string };
    }) => {
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.data.url);
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
}

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Наименование товара",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "",
      key: "action",
      render: (record: ProductsProps) => (
        <Space className="flex justify-end">
          <div className="mr-6" onClick={() => showDrawer(record)}>
            <CiEdit size={20} className="hover:cursor-pointer" />
          </div>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот товар?"
            okText="Да"
            cancelText="Нет"
            onConfirm={() => deleteProductHandler(record.id)}
          >
            <CiTrash size={20} className="hover:cursor-pointer" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => showDrawer()}
          icon={<PlusOutlined />}
        >
          Создать товар
        </Button>
        <Drawer
          title={editMode ? "Редактировать товар" : "Создать товар"}
          width={600}
          onClose={onClose}
          open={open}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={handleFormSubmit}
          >
            <Form.Item
              name="category"
              label="Категория"
              rules={[
                { required: true, message: "Пожалуйста, выберите категорию" },
              ]}
            >
              <Select placeholder="Пожалуйста, выберите категорию">
                <Option value="electronics">Электроника</Option>
                <Option value="fashion-appearl">Мода и одежда</Option>
                <Option value="home-kitchen">Дом и кухня</Option>
                <Option value="health-beauty">Здоровье и красота</Option>
                <Option value="sports-outdoors">
                  Спорт и отдых на природе
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Наименование товара"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите название товара",
                },
              ]}
            >
              <Input placeholder="Пожалуйста, введите название товара" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Описание"
              rules={[
                { required: true, message: "Пожалуйста, введите описание" },
              ]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Пожалуйста, введите описание"
              />
            </Form.Item>

            <Form.Item label="Изображение">
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
              <Upload
                {...(editMode ? editProps : props)}
               >
                <Button>
                    Загрузить
                </Button>
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
      <div className="mt-6">
        <h2 className="text-[16px] mb-[10px]">Созданные товары</h2>
        <Table
          columns={columns}
          dataSource={products}
          pagination={false}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default Products;
