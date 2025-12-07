import{BrowserRouter as Router,Routes,Route}from"react-router-dom"
import{ThemeProvider}from"@mui/material/styles"
import CssBaseline from"@mui/material/CssBaseline"
import theme from"./theme/theme"
import Layout from"./components/Layout/Layout"
import HomePage from"./pages/HomePage"
import LoginPage from"./pages/LoginPage"
function App(){return(<ThemeProvider theme={theme}><CssBaseline/><Router><Layout><Routes><Route path="/"element={<HomePage/>}/><Route path="/login"element={<LoginPage/>}/></Routes></Layout></Router></ThemeProvider>)}
export default App