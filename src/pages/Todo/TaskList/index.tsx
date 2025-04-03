import React, { useState, useEffect } from 'react';
import { Card, Tag, Button, Row, Col, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { history } from 'umi';
import styles from './index.less';
import CreateTask from '../CreateTask';

interface Task {
  id: number;
  description: string;
  category: string;
  color: string;
}

const demoTasks: Task[] = [
  {
    id: 1,
    description: 'Lockin',
    category: 'Sigma builder',
    color: '#1890ff'
  },  
];

const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks(demoTasks);
      localStorage.setItem('tasks', JSON.stringify(demoTasks));
    }
  }, []);

  const refreshTasks = () => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  };

  const handleDelete = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className={styles.container}>
      <h1 style={{ textAlign: 'center' }}>Todo List</h1>
      <Button
        type="primary"
        size="large"
        style={{ display: 'block', margin: 'auto' }}
        onClick={() => {
          setSelectedTaskId(null);
          setModalVisible(true);
        }}
      >
        Create Task
      </Button>
      <Row gutter={[16, 16]}>
        {tasks.map(task => (
          <Col xs={24} sm={12} md={8} lg={6} key={task.id}>
            <div className={styles.cardWrapper}>
              <Card 
                className={styles.taskCard}
                style={{ borderLeft: `8px solid ${task.color}` }}
              >
                <Tag 
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    backgroundColor: task.color,
                    color: '#fff',
                    fontSize: '16px',
                  }}
                >
                  {task.category}
                </Tag>
                <p style={{ marginTop: '40px', fontSize: '16px' }}>{task.description}</p>
                <div className={styles.taskActions}>
                  <EditOutlined 
                    style={{ color: task.color }} 
                    onClick={() => {
                      setSelectedTaskId(task.id);
                      setModalVisible(true);
                    }}
                  />
                  <DeleteOutlined 
                    style={{ color: task.color }} 
                    onClick={() => handleDelete(task.id)} 
                  />
                </div>
              </Card>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <CreateTask
          taskId={selectedTaskId || undefined}
          onClose={() => {
            setModalVisible(false);
            refreshTasks();
          }}
        />
      </Modal>
    </div>
  );
};

export default TaskList;