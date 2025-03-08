import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        // <div className="navbar bg-base-100 shadow-sm">
        //     <div className="flex-1">
        //         <a className="btn btn-ghost text-xl">Medicords</a>
        //     </div>

        //     <div className="flex gap-2">
        //         <div className="dropdown dropdown-end">
        //             <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar">
        //                 <div className="w-10 rounded-full">
        //                     <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
        //                 </div>
        //             </div>

        //             <ul className="menu dropdown-content bg-base-100 rounded-box mt-2 w-52">
        //                 <li><a>Profile</a></li> <li><a>Settings</a></li> <li><a>Logout</a></li>
        //             </ul>
        //         </div>
        //     </div>
        // </div>

        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex="0" role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>

                    <ul className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                        <li><Link to={"/"}>Home</Link></li>
                        <li><Link to={"/health-partners"}>Health Partners</Link></li>
                        <li><Link to={"/affiliations"}>Affiliations</Link></li>
                    </ul>
                </div>

                <p className="pl-3 text-xl font-bold">Medicords</p>
            </div>

            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal gap-2">
                    <li><Link to={"/"}>Home</Link></li>
                    <li><Link to={"/health-partners"}>Health Partners</Link></li>
                    <li><Link to={"/affiliations"}>Affiliations</Link></li>
                </ul>
            </div>

            <div className="navbar-end gap-2 pr-3">
                <Link to={"/sign-in"} className="btn btn-sm btn-soft">Log In</Link>
                <Link to={"/create-account"} className="btn btn-sm btn-soft">Sign Up</Link>
            </div>
        </div>
    );
}

export default Navbar;