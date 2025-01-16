import { ReactNode } from "react";
import Navbar from "./wrapper/Navbar";


const Wrapper = ({ children }: { children: ReactNode }) => {
    return <Navbar>{children}</Navbar>;
  };
  
  export default Wrapper;
