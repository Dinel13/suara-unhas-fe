import React from "react";

import Penulis from "../penulis/Penulis";
import Loading from "../loading/Loading";

export default function PenulisPop() {
  const [penulisData, setPenulisData] = React.useState(null);
  const [status, setStatus] = React.useState({ pending: false, error: "" });

  React.useEffect(() => {
    setStatus((prevState) => ({ ...prevState, pending: true }));
    const getTulisanPop = async () => {
      const fetchToBackend = async () => {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/users/populer`,
          { method: "GET" }
        );
        const data = res.json();
        if (!res.ok) {
          throw new Error(data.message || "gagal meload penulis populer");
        }
        return data;
      };

      try {
        const data = await fetchToBackend();
        setPenulisData(data.user);
        setStatus((prevState) => ({ ...prevState, pending: false }));
      } catch (error) {
        setStatus((prevState) => ({
          ...prevState,
          pending: false,
          error: error,
        }));
      }
    };
    getTulisanPop();
  }, []);

  // const fake = [
  //   { name: "udin", fakultas: "teknik", blog: "6", id: 5 },
  //   { name: "udindas", fakultas: "kesmas", blog: "9", id: 7 },
  //   { name: "udin da", fakultas: "hukum", blog: "2", id: 8 },
  // ];

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-10 sm:py-14 lg:py-16 mx-auto">
        <div className="flex flex-col text-center w-full mb-16">
          <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">
            Penulis Populer
          </h1>
          <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
            Kamu bisa saja tidak melakukan apa-apa tapi lihatlah mereka yang
            kini populer karena karyanya.
          </p>
        </div>
        <div className="flex flex-wrap -m-4 pb-10">
          {status.pending && <Loading />}
          {status.error && (
            <h3 className="sm:text-1xl text-center mx-auto text-xl font-medium mb-24 text-gray-700">
              Belum tersedia penulis populer
            </h3>
          )}
          {penulisData &&
            penulisData.map((penulis, index) => (
              <Penulis key={index} penulis={penulis} />
            ))}
        </div>
      </div>
    </section>
  );
}
