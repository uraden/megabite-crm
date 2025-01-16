// import {useNavigate } from "react-router-dom";
import { ReactNode } from "react";
import Wrapper from "../layout";

const Protected = ({children} : {children: ReactNode}) => {
    // const navigate = useNavigate();

   
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if(!token) {
    //         navigate("/login");
    //     }
    // }, []);
    return (
        <Wrapper>
            {children}
        </Wrapper>
    )
};


export default Protected;