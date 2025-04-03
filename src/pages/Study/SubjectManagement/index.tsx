import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, message, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Subject } from '../types';

const SubjectManagement: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  const handleSave = (values: any) => {
    const updatedSubjects = editingSubject
      ? subjects.map(s => 
          s.id === editingSubject.id 
            ? { ...s, ...values }
            : s
        )
      : [
          ...subjects,
          {
            id: subjects.length ? Math.max(...subjects.map(s => s.id)) + 1 : 1,
            ...values,
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
          }
        ];
    
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    message.success(`Subject ${editingSubject ? 'updated' : 'added'} successfully!`);
    setModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Subject Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Subject) => (
        <Tag color={record.color}>{text}</Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Subject) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSubject(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const updatedSubjects = subjects.filter(s => s.id !== record.id);
              setSubjects(updatedSubjects);
              localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
              message.success('Subject deleted successfully!');
            }}
          />
        </>
      )
    }
  ];

  return (
    <Card title="Subject Management">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingSubject(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Subject
      </Button>

      <Table
        dataSource={subjects}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={editingSubject ? 'Edit Subject' : 'Add Subject'}
        visible={modalVisible}
        onOk={form.submit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="name"
            label="Subject Name"
            rules={[{ required: true, message: 'Please enter subject name' }]}
          >
            <Input placeholder="Enter subject name" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default SubjectManagement;