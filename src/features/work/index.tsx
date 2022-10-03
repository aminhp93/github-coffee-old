import CustomFlexLayout from 'components/CustomFlexLayout';
import { Button } from 'antd';

const Work: React.FunctionComponent = () => {
  const savedLayout = localStorage.getItem('flexLayoutModel_Work');
  let json;

  if (savedLayout) {
    json = JSON.parse(savedLayout);
  }

  const handleOnModelChange = (data: any) => {
    localStorage.removeItem('flexLayoutModel_Work');
    localStorage.setItem('flexLayoutModel_Work', JSON.stringify(data.toJson()));
  };

  const handleChangeLayout = () => {
    localStorage.removeItem('flexLayoutModel_Work');
    window.location.reload();
  };

  return (
    <div className="flex height-100" style={{ flexDirection: 'column' }}>
      <div>
        <Button onClick={() => handleChangeLayout()}>Reset layout</Button>
      </div>
      <div className="flex-1">
        <CustomFlexLayout json={json} onModelChange={handleOnModelChange} />
      </div>
    </div>
  );
};

export default Work;
