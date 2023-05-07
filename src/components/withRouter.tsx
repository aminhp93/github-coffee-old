import { useLocation, useNavigate, useParams } from 'react-router-dom';

function withRouter<ComponentProps>(Component: React.FC<ComponentProps>) {
  function ComponentWithRouterProp(props: ComponentProps) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }

  return ComponentWithRouterProp;
}

export default withRouter;
