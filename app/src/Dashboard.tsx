import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./public/white png.png";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();



  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      <nav className="bg-nav fixed w-full z-50 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <img src={Logo} className="h-8" alt="Flowbite Logo" />
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <a href="https://www.instagram.com/_.stejsky.__/?hl=cs" target="_blank">
              <button
                type="button"
                className="consult-btn text-white ease-in-out duration-300 font-bold rounded-lg text-sm px-4 py-2 text-center"
              >
                Odhlásit se
              </button>
            </a>
          </div>
        </div>
      </nav>
      <div id="main">
        <h1>Všechny zprávy</h1>
      </div>
    </>
  );
};

export default Dashboard;
