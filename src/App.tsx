import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
// import { ipcMain, ipcRenderer } from 'electron';
import { Steps, Hints } from 'intro.js-react';
import { getStorageValue, setStorageValue } from './api/dbapi';
import { getDefaultCharactersFromPublic } from './api/extrasapi';
import LorebooksPage from './pages/lorebooks';
import AttachmentsPage from './pages/attachments';
import CompletionsPage from './pages/completions';
import UserPage from './pages/users';
import DiscordPage from './pages/discord';
import MenuThemeLoader from './components/menu-theme-loader';
import ConstructsPage from './pages/constructs';
import ChatPage from './pages/chat/';
import SettingsPage from './pages/settings';
import ConstructManagement from './components/construct-crud';
import ZeroPage from './pages/zero';
import NavBar from './components/shared/NavBar';
import { io } from 'socket.io-client';
import NetworkPage from './pages/network';

export const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
  e.preventDefault();
  // ipcRenderer.send('open-external-url', url);
};

export const url = 'http://localhost:3003';
export const socket = io('http://localhost:3003');

function App() {
  const [needsReload, setNeedsReload] = useState(false);
  const [doneTutorial, setDoneTutorial] = useState(true);
  const [isFirstRun, setIsFirstRun] = useState(false);
  
  const returnToMenu = () => {
    history.back();
  }

  useEffect(() => {
    getStorageValue('doneTutorial').then((value) => {
      if(value === null) {
        setDoneTutorial(false);
      }else{
        let hasTrue = value === 'true';
        setDoneTutorial(hasTrue);
      }
    });
    getStorageValue('isFirstRun').then((value) => {
      if(value === null) {
        setIsFirstRun(true);
      }else{
        let hasTrue = value === 'true';
        setIsFirstRun(hasTrue);
      }
    });
  }, []);

  useEffect(() => {
      const closeOnEscapeKey = (e: { key: string; }) => e.key === "Escape" ? returnToMenu() : null;
      document.body.addEventListener("keydown", closeOnEscapeKey);
      return () => {
          document.body.removeEventListener("keydown", closeOnEscapeKey);
      };
  }, []);
  
  useEffect(() => {
    if(isFirstRun) {
      getDefaultCharactersFromPublic();
      setStorageValue('isFirstRun', 'false');
      setIsFirstRun(false);
    }
  }, [isFirstRun]);

  return (
    <div id='App'>
      <Router>
        <MenuThemeLoader needsReload setNeedsReload={setNeedsReload}/>
        <NavBar />
        <div className='main-content'>
          <Routes>
            <Route path='/*' element={<Navigate to='/constructs' />} />
            <Route path='/network' element={<NetworkPage/>} />
            <Route path='/constructs' element={<ConstructsPage/>} />
            <Route path='/constructs/:id' element={<ConstructManagement/>} />
            <Route path='/constructs/new' element={<ConstructManagement/>} />
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/chat/:id' element={<ChatPage />} />
            <Route path='/discord' element={<DiscordPage/>} />
            <Route path='/settings' element={<SettingsPage/>} />
            <Route path='/zero' element={<ZeroPage/>} />
            <Route path='/users' element={<UserPage/>} />
            <Route path='/lorebooks' element={<LorebooksPage/>} />
            <Route path='/attachments' element={<AttachmentsPage/>} />
            <Route path='/completions' element={<CompletionsPage/>} />
          </Routes>
        </div>
        <Steps
          initialStep={0}
          enabled={!doneTutorial}
          steps={[
            {
              title: 'Add a Construct',
              tooltipClass: 'introJs-custom-box',
              element: '#newConstruct',
              intro: 'Click here to add a new Construct.',
            },
            {
              title: 'Import a Character Card',
              tooltipClass: 'introJs-custom-box',
              element: '#importCard',
              intro: 'You can import a character card in both V1 (Tavern) and V2 formats. This will automatically add the Construct to your list.',
            }
          ]}
          onChange={(e) => {}}
          onStart={() => {setDoneTutorial(false); setStorageValue('doneTutorial', 'false'); window.location.hash = '/';}}
          onExit={() => {setDoneTutorial(true); setStorageValue('doneTutorial', 'true');}}
        />
      </Router>
    </div>
  )
}

export default App;
