import type { InputRef } from 'antd';
import { Button, Input, Modal } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
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
      const res = await axios({
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
    const res = await axios({
      url: 'http://localhost:8000/api/problems/',

      method: 'GET',
    });
    setListProblemSrc(res.data.results);
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <div className="flex" style={{ justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={() => {
            setShowListOldProblems((old) => !old);
            if (showListOldProblems) {
              getList();
            }
          }}
        >
          {showListOldProblems ? 'Hide' : 'Show'} list available problems
        </Button>
        <Button size="small" onClick={() => setIsModalOpen(true)}>
          Create problem
        </Button>
      </div>

      <Modal
        title="Create problem"
        open={isModalOpen}
        onOk={handleOk}
        width={1400}
        onCancel={handleCancel}
      >
        <Button size="small" onClick={handleUseDefaultTemplate}>
          Use default template
        </Button>
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
