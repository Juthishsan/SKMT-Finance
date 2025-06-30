import React, { useEffect, useState } from 'react'

import Login from './pages/auth/Login';
import Engine from './Engine';
import ForgotPassword from './pages/auth/ForgotPassword';
//import Swal from 'sweetalert2';


const AuthProvider = () => {
    const [component, setcomponent] = useState(() => {
        return localStorage.getItem('adminEmail') ? "Engine" : "Login";
    });
    const [engineSubComponent, setEngineSubComponent] = useState(() => {
        return localStorage.getItem('adminPanelPage') || "Dashboard";
    });

    useEffect(() => {
        if (component === "Engine") {
            localStorage.setItem('adminPanelPage', engineSubComponent);
        }
    }, [component, engineSubComponent]);

    const render = () => {
        switch (component) {
            case "Login":
                return <Login componentrender={componentrender} />;
            case "Engine":
                return <Engine component={engineSubComponent} componentrender={componentrender} />;
            case "ForgotPassword":
                return <ForgotPassword componentrender={componentrender} />;
            default:
                return <Login componentrender={componentrender} />;
        }
    };

    const componentrender = (componentName) => {
        if (
            [
                "Dashboard",
                "Products",
                "Orders",
                "Loans",
                "Users",
                "Admins",
                "Profile",
                "ContactMessages",
                "VehicleSales"
            ].includes(componentName)
        ) {
            setcomponent("Engine");
            setEngineSubComponent(componentName);
        } else {
        setcomponent(componentName);
    }
    };

    return (
        <div className=''>
            <div></div>
            <div>
                {render()}
            </div>
            <div></div>
        </div>
    )
}

export default AuthProvider