import { Banner } from "../common/Banner";
import Header from "../common/Header";
import Footer from '../common/Footer'
export default function MainLayout({children}){
  return (
    <>
    <Header/>
   
    <main>{children}</main>
    <Footer/>
    </>
  )
}