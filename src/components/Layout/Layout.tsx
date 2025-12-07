import{ReactNode}from"react"
import{Box}from"@mui/material"
import NestedNavbar from"./NestedNavbar"
import Footer from"./Footer"
function Layout({children}:{children:ReactNode}){return(<Box sx={{display:"flex",flexDirection:"column",height:"100vh"}}><NestedNavbar/><Box sx={{flexGrow:1,mt:"64px",mb:"56px",overflow:"auto",bgcolor:"#f5f5f5"}}>{children}</Box><Footer/></Box>)}
export default Layout