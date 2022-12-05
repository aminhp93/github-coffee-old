import React, { useEffect, useState, useRef } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { Button } from 'antd';

interface RequireFullscreenProps {
  component: React.RefObject<HTMLElement>;
  children: (isFullscreen: boolean) => React.ReactNode;
}

const RequireFullscreen: React.FC<RequireFullscreenProps> = ({
  component,
  children,
}) => {
  const [isFullscreen, setFullscreen] = useState(false);

  const handleFullScreen = () => {
    if (component?.current) {
      isFullscreen
        ? document.exitFullscreen()
        : component.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const onFullScreenChange = () => {
      setFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('msfullscreenchange', onFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullScreenChange);
      document.removeEventListener('mozfullscreenchange', onFullScreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        onFullScreenChange
      );
      document.removeEventListener('msfullscreenchange', onFullScreenChange);
    };
  }, []);

  return <div onClick={handleFullScreen}>{children(isFullscreen)}</div>;
};

const FullscreenButton: React.FC = () => {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootRef.current = document.getElementById('root');
  }, []);

  return (
    <RequireFullscreen component={rootRef}>
      {(isFullscreen) => (
        <Button
          //   type={isFullscreen ? 'ghost' : 'text'}
          icon={
            isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />
          }
        />
      )}
    </RequireFullscreen>
  );
};

export default FullscreenButton;
