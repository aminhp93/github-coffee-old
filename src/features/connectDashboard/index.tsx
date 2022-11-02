import { Button, Input, Modal } from 'antd';
import { useState, useRef, useEffect } from 'react';
import type { InputRef } from 'antd';
import request from 'request';
import ProblemItem from './ProblemItem';

export default function ConnectDashboard() {
  const [listProblemSrc, setListProblemSrc] = useState<any>([]);
  const [problemSrc, setProblemSrc] = useState<any>([]);
  const [showListOldProblems, setShowListOldProblems] = useState(false);
  const inputRef = useRef<InputRef>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
    handleCreateProblem();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateProblem = async () => {
    if (inputRef?.current?.input?.value) {
      setProblemSrc(
        'https://codesandbox.io/embed/github/aminhp93/problem-react-template/tree/main/?fontsize=14&hidenavigation=1&theme=dark'
      );
      const res = await request({
        url: 'http://localhost:8000/api/problems/create/',
        method: 'POST',
        data: {
          problem_src: inputRef?.current?.input?.value,
        },
      });

      setListProblemSrc([...listProblemSrc, res.data]);
      getList();
    }
  };

  const handleUseDefaultTemplate = () => {
    setProblemSrc(
      'https://codesandbox.io/embed/github/aminhp93/problem-react-template/tree/main/?fontsize=14&hidenavigation=1&theme=dark'
    );
  };

  const getList = async () => {
    const res = await request({
      url: 'http://localhost:8000/api/problems/',

      method: 'GET',
    });
    setListProblemSrc(res.data.results);
    console.log(res);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <Button
          onClick={() => {
            setShowListOldProblems((old) => !old);
            if (showListOldProblems) {
              getList();
            }
          }}
        >
          {showListOldProblems ? 'Hide' : 'Show'} list available problems
        </Button>
        <Button onClick={() => setIsModalOpen(true)}>Create problem</Button>
      </div>

      <Modal
        // className="CustomModal"
        title="Create problem"
        open={isModalOpen}
        onOk={handleOk}
        width={1400}
        onCancel={handleCancel}
      >
        <Button onClick={handleUseDefaultTemplate}>Use default template</Button>
        <Input ref={inputRef} value={problemSrc} />
        <iframe
          src={problemSrc}
          style={{
            width: '100%',
            height: '500px',
            border: 0,
            borderRadius: '4px',
            overflow: 'hidden',
          }}
          title="hello123"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      </Modal>

      {showListOldProblems && (
        <>
          {[1, 2, 3].map((item: any, index) => (
            <ProblemItem problem={item} key={item.id} index={index} />
          ))}
        </>
      )}
    </div>
  );
}
