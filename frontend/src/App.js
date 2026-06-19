import { PipelineUI } from './ui';
import { TopNav } from './components/TopNav';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <TopNav />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <LeftSidebar />
        <div style={{ flex: 1, position: 'relative' }}>
          <PipelineUI />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
}

export default App;
