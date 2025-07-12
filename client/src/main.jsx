import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/SignUp.jsx';
import StackItLanding from './pages/Home.jsx';
import AddQuestion from './pages/addQues.jsx';
import StackItHomepage from './pages/View.jsx';
import QuestionPage from './pages/QuestionDetail.jsx';
import NotificationPage from './pages/Notice.jsx';
import AnswerApprovalPage from './pages/ApprovalPage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '/', element: <StackItLanding /> },
      { path: '/home', element: <StackItHomepage /> },
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
      { path: '/add', element: <AddQuestion /> },
      { path: '/notices', element: <NotificationPage /> },
      { path: '/que/:id', element: <QuestionPage /> },
      { path: '/approve/:answerId', element: <AnswerApprovalPage /> },
     
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <RouterProvider router={router} />
    
  </StrictMode>,
)
