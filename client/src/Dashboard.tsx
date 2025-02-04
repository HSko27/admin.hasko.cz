import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./public/white png.png";
import axios from "axios";

interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastname: string;
  message: string;
  createdAt: string;
}
interface IAdmin {
  id: number;
  names: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IUser[]>([]);
  const [adminData, setAdminData] = useState<IAdmin[]>([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await axios.get(`http://5.39.202.91:3002/db`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getData();
  }, []);

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const response = await axios.get(`http://5.39.202.91:3002/admin`);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getAdminData();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const deleteMessage = async (userId: number) => {
    await axios.delete(`http://5.39.202.91:3002/db/${userId}`);
    const newData = data.filter((user) => user.id !== userId);
    setData(newData);
  };
  const deleteAdmin = async (adminId: number) => {
    await axios.delete(`http://5.39.202.91:3002/admin/${adminId}`);
    const newData = data.filter((admin) => admin.id !== adminId);
    setData(newData);
  };

  const logOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav className="bg-nav fixed w-full z-50 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <img src={Logo} className="h-8" alt="Flowbite Logo" />
          <h1 className="main-text text-2xl ">Admin page</h1>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <button
              onClick={logOut}
              type="button"
              className="consult-btn text-white ease-in-out duration-300 font-bold rounded-lg text-sm px-4 py-2 text-center"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </nav>


      <div className="flex flex-col md:flex-row" id="main">
        <div className="relative md:w-3/4 w-full overflow-x-auto shadow-md sm:rounded-lg mt-25">
        <h1 className="text-slate-50 md:ms-100 ms-50 mb-5">HSko.cz messages</h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
            <thead className="text-xs uppercase bg-neutral-700 text-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Message
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.map((user, index) => (
                <tr key={index} className="border-b bg-neutral-800 border-neutral-700 hover:bg-neutral-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {user.id + " " + "|" + " " + user.email}
                  </th>
                  <td className="px-6 py-4">{user.firstName + " " + user.lastname}</td>
                  <td className="px-6 py-4">{user.message}</td>
                  <td className="px-6 py-4">{user.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteMessage(user.id)} className="font-medium font-bold text-red-700 hover:text-red-900">
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="mx-2"></div>
        <div className="relative md:w-1/4 w-full overflow-x-auto shadow-md sm:rounded-lg md:mt-25 mt-10">
        <h1 className="text-slate-50 md:ms-35 ms-60 mb-5">Admin users</h1>
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
            <thead className="text-xs uppercase bg-neutral-700 text-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {adminData?.map((admin, index) => (
                <tr key={index} className="border-b bg-neutral-800 border-neutral-700 hover:bg-neutral-600">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {admin.id}
                  </th>
                  <td className="px-6 py-4">{admin.names}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => deleteAdmin(admin.id)} className="font-medium font-bold text-red-700 hover:text-red-900">
                      delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
