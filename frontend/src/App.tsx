import { AuthProvider } from './context/AuthContext';
import { LeveloraProvider } from './context/LeveloraContext';
import { AppShell } from './components/layout/AppShell';

export function App() {
  return (
    <AuthProvider>
      <LeveloraProvider>
        <AppShell />
      </LeveloraProvider>
    </AuthProvider>
  );
}

export default App;
