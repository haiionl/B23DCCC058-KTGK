import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Modal, Form, Select, InputNumber, Progress, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import type { Subject, StudySession, MonthlyGoal } from '../types';

import { DatePicker } from "antd";

const MonthlyGoals: React.FC = () => {
  const [goals, setGoals] = useState<MonthlyGoal[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingGoal, setEditingGoal] = useState<MonthlyGoal | null>(null);
  const [form] = Form.useForm();

  // localStorage
  useEffect(() => {
    const storedGoals = localStorage.getItem('monthly_goals');
    const storedSubjects = localStorage.getItem('subjects');
    const storedSessions = localStorage.getItem('study_sessions');
    
    if (storedGoals) setGoals(JSON.parse(storedGoals));
    if (storedSubjects) setSubjects(JSON.parse(storedSubjects));
    if (storedSessions) setSessions(JSON.parse(storedSessions));
  }, []);

  // Calculate
  const calculateProgress = (goal: MonthlyGoal) => {
    const monthSessions = sessions.filter(session => {
      const sessionMonth = moment(session.date).format('YYYY-MM');
      return session.subjectId === goal.subjectId && sessionMonth === goal.month;
    });

    const totalMinutes = monthSessions.reduce((acc, session) => acc + session.duration, 0);
    const totalHours = totalMinutes / 60;
    const progress = Math.min(Math.round((totalHours / goal.targetHours) * 100), 100);

    return {
      progress,
      achieved: totalHours >= goal.targetHours
    };
  };

  const handleSave = (values: any) => {
    const goalData = {
      ...values,
      month: moment(values.month).format('YYYY-MM')
    };

    const updatedGoals = editingGoal
      ? goals.map(g => 
          g.id === editingGoal.id 
            ? { ...g, ...goalData }
            : g
        )
      : [
          ...goals,
          {
            id: goals.length ? Math.max(...goals.map(g => g.id)) + 1 : 1,
            ...goalData,
            completed: false
          }
        ];
    
    setGoals(updatedGoals);
    localStorage.setItem('monthly_goals', JSON.stringify(updatedGoals));
    message.success(`Goal ${editingGoal ? 'updated' : 'added'} successfully!`);
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
        return <Tag color={subject?.color}>{subject?.name || 'Unknown Subject'}</Tag>;
      }
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (month: string) => moment(month).format('MMMM YYYY')
    },
    {
      title: 'Target Hours',
      dataIndex: 'targetHours',
      key: 'targetHours'
    },
    {
      title: 'Progress',
      key: 'progress',
      render: (_: any, record: MonthlyGoal) => {
        const { progress, achieved } = calculateProgress(record);
        return (
          <Progress 
            percent={progress} 
            status={achieved ? 'success' : 'active'}
            format={percent => `${percent}%`}
          />
        );
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MonthlyGoal) => (
        <>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingGoal(record);
              form.setFieldsValue({
                ...record,
                month: moment(record.month)
              });
              setModalVisible(true);
            }}
          />
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const updatedGoals = goals.filter(g => g.id !== record.id);
              setGoals(updatedGoals);
              localStorage.setItem('monthly_goals', JSON.stringify(updatedGoals));
              message.success('Goal deleted successfully!');
            }}
          />
        </>
      )
    }
  ];

  return (
    <Card title="Monthly Goals">
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingGoal(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Add Monthly Goal
      </Button>

      <Table
        dataSource={goals}
        columns={columns}
        rowKey="id"
      />

      <Modal
        title={editingGoal ? 'Edit Monthly Goal' : 'Add Monthly Goal'}
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
            name="month"
            label="Month"
            rules={[{ required: true, message: 'Please select a month' }]}
          >
            <DatePicker picker="month" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="targetHours"
            label="Target Hours"
            rules={[{ required: true, message: 'Please enter target hours' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default MonthlyGoals;