import React, { useEffect } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './index.less';

interface CreateTaskProps {
  taskId?: number;
  onClose: () => void;
}

const getRandomColor = () =>
  '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

const CreateTask: React.FC<CreateTaskProps> = ({ taskId, onClose }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (taskId) {
      const storedTasks = localStorage.getItem('tasks');
      if (storedTasks) {
        const tasks = JSON.parse(storedTasks) as any[];
        const taskToEdit = tasks.find(t => t.id === taskId);
        if (taskToEdit) {
          form.setFieldsValue({
            description: taskToEdit.description,
            category: taskToEdit.category,
          });
        }
      }
    }
  }, [taskId, form]);

  const onFinish = (values: any) => {
    const storedTasks = localStorage.getItem('tasks');
    const tasks = storedTasks ? JSON.parse(storedTasks) : [];

    const color = getRandomColor();

    if (taskId) {
      const updatedTasks = tasks.map((t: any) =>
        t.id === taskId
          ? {
              ...t,
              description: values.description,
              category: values.category,
              color,
            }
          : t
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      message.success('Task updated successfully!');
    } else {
      const newTask = {
        id: tasks.length ? Math.max(...tasks.map((t: any) => t.id)) + 1 : 1,
        description: values.description,
        category: values.category,
        color,
      };
      const updatedTasks = [...tasks, newTask];
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      message.success('Task created successfully!');
    }
    form.resetFields();
    onClose();
  };

  return (
    <div className={styles.container}>
      <Card title={taskId ? "Update Task" : "Create New Task"}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please enter a category' }]}
          >
            <Input placeholder="Enter category" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter task description' }]}
          >
            <Input.TextArea rows={4} placeholder="Enter task description" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
              {taskId ? "Update Task" : "Create Task"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateTask;