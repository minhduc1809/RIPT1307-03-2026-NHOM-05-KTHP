import { useKeycloak } from '@react-keycloak/web';
import { Button } from 'antd';
import * as React from 'react';
import { useCallback, useEffect } from 'react';

interface LoginWithKeycloakProps {
  title: string;
  oneSignalId: any;
  onLoginSuccess: (
    token: string,
    refreshToken: string,
    idToken: string,
    oneSignalId: string,
  ) => void;
}

const LoginWithKeycloak: React.FC<LoginWithKeycloakProps> = ({
  title,
  oneSignalId,
  onLoginSuccess,
}) => {
  const { keycloak } = useKeycloak();

  const login = useCallback(() => {
    keycloak?.login();
  }, [keycloak]);

  useEffect(() => {
    if (keycloak.authenticated)
      onLoginSuccess(
        keycloak?.token ?? '',
        keycloak?.refreshToken ?? '',
        keycloak?.idToken ?? '',
        oneSignalId,
      );
  }, [keycloak.authenticated]);

  return (
    <div>
      <Button
        onClick={login}
        type="primary"
        style={{
          marginTop: 8,
          width: '100%',
        }}
        size="large"
      >
        {title}
      </Button>
    </div>
  );
};

export default LoginWithKeycloak;
