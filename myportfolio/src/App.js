import './App.css';
import { NavBar } from './components/NavBar';
import { Banner } from './components/Banner';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProjectDetails } from './components/ProjectDetails';
import { ProjectForm } from './components/ProjectForm';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <Routes>
          <Route path="/" element={<><Banner /><Skills /><Projects /><Contact /></>} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/add-project" element={<ProjectForm mode="add" />} />
          <Route path="/edit-project/:id" element={<ProjectForm mode="edit" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
