import { useState, useEffect } from "react";
import {
  getAllCategories,
  deleteCategory,
  addCategory,
  updateCategory,
} from "./request";
import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Drawer,
  Form,
  Input,
  Row,
  Space,
  Table,
  Popconfirm,
  message,
} from "antd";
import { CiEdit, CiTrash } from "react-icons/ci";

interface CategoriesProps {
  id: string;
  name: string;
}

function Categories() {
  const [categories, setCategories] = useState<CategoriesProps[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoriesProps | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const allCategories = await getAllCategories();
      if (allCategories) {
        setCategories(allCategories);
      }
    } catch (error) {
      message.error("Не удалось получить категории");
      console.log(error)
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showDrawer = (category?: CategoriesProps) => {
    if (category) {
      setEditMode(true);
      setSelectedCategory(category);
      form.setFieldsValue(category);
    } else {
      setEditMode(false);
      form.resetFields();
    }
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = async (values: CategoriesProps) => {
    try {
      if (editMode && selectedCategory) {
        await updateCategory(selectedCategory.id, values);
        message.success("Категория успешно обновлена");
      } else {
        await addCategory(values);
        message.success("Категория добавлена ​​успешно");
      }
      fetchCategories();
      onClose();
    } catch (error) {
      message.error("Failed to save category");
      console.log(error)
    }
  };

  const deleteCategoryHandler = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success("Категория успешно удалена");
      fetchCategories();
    } catch (error) {
      message.error("Не удалось удалить категорию");
      console.log(error)
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "",
      key: "action",
      render: (record: CategoriesProps) => (
        <Space className="flex justify-end">
          <div className="mr-6" onClick={() => showDrawer(record)}>
            <CiEdit size={20} className="hover:cursor-pointer" />
          </div>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот товар?"
            okText="Да"
            cancelText="Нет"
            onConfirm={() => deleteCategoryHandler(record.id)}
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
          Создать категорию +
        </Button>
        <Drawer
          title={editMode ? "Редактировать категорию" : "Создать категорию"}
          width={600}
          onClose={onClose}
          open={drawerOpen}
          bodyStyle={{ paddingBottom: 80 }}
        >
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={handleFormSubmit}
          >
            <Form.Item
              name="name"
              label="Наименование"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите название категории",
                },
              ]}
            >
              <Input placeholder="Пожалуйста, введите название категории" />
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
        <h2 className="text-[16px] mb-[10px]">Созданные категории</h2>
        <Table
          columns={columns}
          dataSource={categories}
          pagination={false}
          rowKey="id"
        />
      </div>
    </div>
  );
}

export default Categories;
