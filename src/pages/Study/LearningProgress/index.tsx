import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Input, DatePicker, InputNumber, Select, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Subject, StudySession } from '../types';

const LearningProgress: React.FC = () => {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSession, setEditingSession] = useState<StudySession | null>(null);
  const [form] = Form.useForm();

  // localStorage
  useEffect(() => {
    const storedSessions = localStorage.getItem('study_sessions');
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSessions) {
      setSessions(JSON.parse(storedSessions));
    }
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
  }, []);

  const handleSave = (values: any) => {
    const updatedSessions = editingSession
      ? sessions.map(s => 
          s.id === editingSession.id 
            ? { 
                ...s, 
                ...values,
                date: values.date.format('YYYY-MM-DD HH:mm:ss')
              }
            : s
        )
      : [
          ...sessions,
          {
            id: sessions.length ? Math.max(...sessions.map(s => s.id)) + 1 : 1,
            ...values,
            date: values.date.format('YYYY-MM-DD HH:mm:ss')
          }
        ];
    
    setSessions(updatedSessions);
    localStorage.setItem('study_sessions', JSON.stringify(updatedSessions));
    message.success(`Study session ${editingSession ? 'updated' : 'added'} successfully!`);
    setModalVisible(false);
    form.resetFields();
  };

  // typings

  const columns = [
    {
      title: 'Subject',
      dataIndex: 'subjectId',
      key: 'subjectId',
      render: (subjectId: number) => {
        const subject = subjects.find(s => s.id === subjectId);
        return subject?.name || 'Unknown Subject';
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: 'Duration (minutes)',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StudySession) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingSession(record);
              form.setFieldsValue({
                ...record,
                date: moment(record.date)
              });
              setModalVisible(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const updatedSessions = sessions.filter(s => s.id !== record.id);
              setSessions(updatedSessions);
              localStorage.setItem('study_sessions', JSON.stringify(updatedSessions));
              message.success('Study session deleted successfully!');
            }}
          />
        </>
      )
    }
  ];

  return (
    <Card title="Learning Progress">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingSession(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Study Session
      </Button>

      <Table
        dataSource={sessions}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={editingSession ? 'Edit Study Session' : 'Add Study Session'}
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
            name="subjectId"
            label="Subject"
            rules={[{ required: true, message: 'Please select a subject' }]}
          >
            <Select placeholder="Select subject">
              {subjects.map(subject => (
                <Select.Option key={subject.id} value={subject.id}>
                  {subject.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="date"
            label="Date & Time"
            rules={[{ required: true, message: 'Please select date and time' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration (minutes)"
            rules={[{ required: true, message: 'Please enter duration' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Content"
            rules={[{ required: true, message: 'Please enter content' }]}
          >
            <Input.TextArea rows={4} placeholder="What did you study?" />
          </Form.Item>

          <Form.Item
            name="notes"
            label="Notes"
          >
            <Input.TextArea rows={2} placeholder="Any additional notes?" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default LearningProgress;