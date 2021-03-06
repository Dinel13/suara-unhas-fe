import React, { useEffect, useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { showNotification, hideNotification } from "../../store/uiSlice";
import { listSearch } from "../../actions/blog";

export default function Header() {
  const history = useHistory();
  const dispatch = useDispatch();
  const searchRef = useRef();
  const [offset, setOffset] = useState(0);
  const name = useSelector((state) => state.auth.name);
  useEffect(() => {
    //to get value of scrool
    window.onscroll = () => {
      setOffset(window.pageYOffset);
    };
  }, []);

  const searchSubmit = async (e) => {
    e.preventDefault();
    const search = searchRef.current.value;
    try {
      const data = await listSearch({ search });
      if (data.error) {
        throw data.error;
      }
      searchRef.current.value = "";
      history.push({
        pathname: "/pencarian",
        state: { data, search },
      });
    } catch (error) {
      dispatch(
        showNotification({
          status: "error",
          title: "Gagal!!",
          message: error || "Tidak bisa mencari",
          action: null,
        })
      );
      setTimeout(() => dispatch(hideNotification()), 1800);
    }
  };

  const clickMenu = () => {
    const navItem = document.getElementById("nav-item");
    if (navItem.classList.contains("flex")) {
      navItem.classList.remove("flex");
      navItem.classList.add("lg:flex");
      navItem.classList.add("hidden");
    } else {
      navItem.classList.add("flex");
      navItem.classList.remove("lg:flex");
      navItem.classList.remove("hidden");
    }
  };

  return (
    <header
      className={`text-gray-600 body-font shadow-lg border-gray-900 sticky top-0 w-full z-10 ${
        offset > 10.58 ? "bg-gray-100" : "bg-red-500"
      }`}
    >
      <div className="flex items-center justify-between flex-wrap p-3.5 px-4 md:px-6 lg:px-10 ">
        <Link
          to="/"
          className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-10 h-10 text-white p-2 bg-red-700 rounded-full"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
          </svg>
          <span className="ml-2 text-2xl text-gray-800">SuaraUnhas</span>
        </Link>
        <div className="block md:hidden" onClick={clickMenu}>
          <button className="flex items-center px-3 py-2 border rounded text-gray-600 border-gray-600 hover:text-gray-700 hover:border-3 hover:border-gray-700 focus:outline-none">
            <svg
              className="h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <nav
          className="w-full flex-grow md:items-center md:w-auto  hidden md:flex ml-2"
          id="nav-item"
        >
          <div className="flex-grow md:flex md:justify-center">
            <Link
              to="/"
              className="block mt-1 md:inline-block md:mt-0 text-gray-700 hover:text-gray-800 mr-4"
            >
              Beranda
            </Link>
            <Link
              to="/tulis"
              className="block mt-3 md:inline-block md:mt-0 text-gray-700 hover:text-gray-800  mr-4"
            >
              Tulis
            </Link>
            <Link
              to="/bacaan"
              className="block mt-3 md:inline-block md:mt-0 text-gray-700 hover:text-gray-800  mr-4"
            >
              Baca
            </Link>
          </div>
          <div className="flex flex-col md:flex-row items-end">
            <div className="flex items-end mb-2.5 md:mb-0 mt-4 md:mt-0">
              <form
                onSubmit={searchSubmit}
                className="flex w-40 items-center justify-center p-0 md:mr-1.5 relative mx-auto text-gray-600"
              >
                <input
                  className="text-gray-700 w-full border border-red-500 bg-gray-200 h-9 px-3 pr-6 rounded text-sm focus:outline-none"
                  type="search"
                  name="search"
                  ref={searchRef}
                  required
                  placeholder="Cari tulisan"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 py-2.5 px-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>

            {name ? (
              <div className="flex items-end">
                <Link
                  to="/akunku"
                  className="inline-flex items-center btn-ter text-sm  p-2 md:mt-0"
                >
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 mr-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Akunku
                </Link>
              </div>
            ) : (
              <div className="flex items-end">
                <Link
                  to="/daftar"
                  className="inline-flex items-center text-sm mr-1.5 px-2 py-1.5 btn-pri  border-2 border-red-700"
                >
                  Daftar
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </Link>
                <Link
                  to="/masuk"
                  className="inline-flex items-center text-sm p-2 btn-ter"
                >
                  Masuk
                  <svg
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"></path>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
