import React from "react";

import Blog from "../blog/Blog";
import Loading from "../loading/Loading";

export default function TulisanTerbaru() {
  const [blogData, setBlogData] = React.useState(null);
  const [status, setStatus] = React.useState({ pending: false, error: "" });

  React.useEffect(() => {
    setStatus((prevState) => ({ ...prevState, pending: true }));
    const getTulisanPop = async () => {
      const fetchToBackend = async () => {
        const res = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/blogs/newest`,
          { method: "GET" }
        );
        const data = res.json();
        if (!res.ok) {
          throw new Error(data.message || "gagal meload tulisan terbaru");
        }
        return data;
      };
      try {
        const data = await fetchToBackend();
        setBlogData(data.blog);
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

  // const fakeBlog = [
  //   {
  //     title: "tes",
  //     category: "cate",
  //     excerpt: "<p> teagd djsadhjas njsahd jhdjsa jd ash </>",
  //     slug: "test",
  //     image: "testt",
  //     like: 654,
  //     comment: 670,
  //   },
  //   {
  //     title: "tesdd",
  //     category: "catefdf",
  //     excerpt: "<p> teagddsfdsfds djsadhjas njsahd jhdjsa jd ash </>",
  //     slug: "test",
  //     image: "testt",
  //     like: 654,
  //     comment: 67,
  //   },
  //   {
  //     title: "tesasdsad",
  //     category: "catefds",
  //     excerpt: "<p> teagdfdsfdsfds djsadhjas njsahd jhdjsa jd ash </>",
  //     slug: "test",
  //     image: "testt",
  //     like: 654,
  //     comment: 67,
  //   },
  // ];

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 pt-10 sm:pt-14 lg:pt-16 pb-8  mx-auto">
        <h1 className="sm:text-3xl text-center text-2xl font-medium title-font mb-8 text-gray-900">
          Tulisan Terbaru
        </h1>
        <div className="flex flex-wrap -m-4 pb-10">
          {status.pending && <Loading />}
          {status.error && (
            <h3 className="sm:text-1xl text-center mx-auto text-xl font-medium mb-24 text-gray-700">
              Belum tersedia tulisan Terbaru
            </h3>
          )}
          {blogData &&
            blogData.map((blog, index) => <Blog key={index} blog={blog} />)}
        </div>
      </div>
      <hr />
    </section>
  );
}
