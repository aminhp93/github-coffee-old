import { Modal } from 'antd';

export default function CustomModal(props: any) {
  return (
    <Modal className="custom-modal" visible={true} {...props}>
      {props.children}
    </Modal>
  );
}
