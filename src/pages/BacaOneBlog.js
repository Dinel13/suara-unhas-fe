import React, { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  WhatsappIcon,
  WhatsappShareButton,
  TwitterIcon,
  TwitterShareButton,
  TelegramIcon,
  TelegramShareButton,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";

import { singleBlog } from "../actions/blog";
import "./BacaOneBlog.css";

export default function BacaOneBlog() {
  const token = useSelector((state) => state.auth.token);
  const history = useHistory();
  const params = useParams();
  const [blogData, setBlogData] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState({});

  useEffect(() => {
    async function getBlog() {
      const res = await singleBlog(params.slug);
      setBlogData(res);
    }
    getBlog();
  }, [params]);

  const { body } = blogData;
  useEffect(() => {
    document.getElementById("body").innerHTML = body;
  }, [body]);

  const submitComment = async (e) => {
    e.preventDefault();
    if (!comment || comment instanceof String) {
      setStatus((prevState) => ({
        ...prevState,
        error: "Tuliskan komentar anda dulu",
      }));
      setTimeout(() => setStatus({}), 4000);
    } else if (comment.length > 2000) {
      setStatus((prevState) => ({
        ...prevState,
        error: "Komentar anda terlalu panjang",
      }));
      setTimeout(() => setStatus({}), 4000);
    } else if (!token) {
      setStatus((prevState) => ({
        ...prevState,
        error: "Kamu harus login dulu",
      }));
      setTimeout(() => {
        setStatus({});
        history.push("/masuk");
      }, 3000);
    } else {
      const saveComment = async () => {
        setStatus((prevState) => ({
          ...prevState,
          pending: true,
        }));
        const respon = await fetch(
          `${process.env.REACT_APP_SERVER_URL}/blog/${blogData.slug}/comment`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ comment: comment, blogId: blogData._id }),
          }
        );
        const data = await respon.json();
        if (!respon.ok) {
          throw new Error(data.message || "Tidak bisa mengirim komen");
        }
        return data;
      };
      try {
        const data = await saveComment();
        setBlogData((prevState) => ({ ...prevState, comment: data.comment }));
        setComment("");
        setStatus((prevState) => ({
          ...prevState,
          pending: false,
        }));
      } catch (error) {
        setStatus((prevState) => ({
          ...prevState,
          pending: false,
          error: "Sedang tidak bisa menambahkan komentar",
        }));
      }
    }
  };

  return (
    <div className="max-w-screen-lg mx-auto my-8 px-8 lg:px-24 ">
      {blogData.postedBy && (
        <>
          <h1 className="text-gray-900 text-3xl sm:text-4xl md:text-5xl  my-6 font-semibold">
            {blogData.title}
          </h1>
          <div className="flex items-center mb-5">
            <img
              alt={blogData.name}
              className="w-14 h-14 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
              src={
                blogData.postedBy.image &&
                process.env.REACT_APP_SERVER_URL_IMAGE +
                  "/" +
                  blogData.postedBy.image
              }
            />
            <div className="flex flex-col">
              <Link
                to={"/penulis/" + blogData.postedBy.publicId}
                className="text-indigo-600 font-medium text-lg tracking-wide"
              >
                {blogData.postedBy.name}
              </Link>
              <p className="text-gray-600">
                Ditulis tanggal{" "}
                {blogData.createdAt && (
                  <small className="font-semibold  tracking-wider">
                    {blogData.createdAt.substring(0, 10)}
                  </small>
                )}
              </p>
            </div>
          </div>
          {blogData.image !== "uploads/images/default.jpg" ? (
            <img
              className="text-center rounded-lg mx-auto lg:h-9/12  h-2/3"
              id="imageBlog"
              src={`${process.env.REACT_APP_SERVER_URL_IMAGE}/${blogData.image}`}
              alt={blogData.title}
            />
          ) : (
            <br />
          )}
        </>
      )}

      <div className="text-gray-800 mt-4 text-lg" id="body"></div>
      <div className="w-full bg-red-100 mt-8 p-3 rounded">
        <p className="text-lg text-gray-800">Bagikan tulisan ini</p>
        <div className="flex flex-wrap flex-row mt-2">
          <WhatsappShareButton
            url={process.env.REACT_APP_SERVER_URL_LINK + blogData.slug}
            title={blogData.title}
            separator=" "
            className="mr-2"
          >
            <WhatsappIcon size={44} round={true} />
          </WhatsappShareButton>
          <FacebookShareButton
            url={process.env.REACT_APP_SERVER_URL_LINK + blogData.slug}
            quote={blogData.title}
            className="mr-2"
          >
            <FacebookIcon size={44} round={true} />
          </FacebookShareButton>
          <TwitterShareButton
            url={process.env.REACT_APP_SERVER_URL_LINK + blogData.slug}
            className="mr-2"
            via="SuaraUnhas"
            hashtags={["SuaraUnhas", "Unhas"]}
            title={blogData.title}
          >
            <TwitterIcon size={44} round={true} />
          </TwitterShareButton>
          <TelegramShareButton
            url={process.env.REACT_APP_SERVER_URL_LINK + blogData.slug}
            title={blogData.title}
          >
            <TelegramIcon size={44} round={true} />
          </TelegramShareButton>
        </div>
      </div>
      <p className="text-gray-600 text-lg mt-4 mb-2">
        kategori:{" "}
        <span className="text-gray-700 font-bold">{blogData.category}</span>
      </p>
      <div className="text-gray-600 text-lg">
        Hastag:{" "}
        {blogData.hastags &&
          blogData.hastags.map((hastag, index) => (
            <p
              key={index}
              className="bg-gray-300 text-base rounded px-1 text-gray-900 inline-block mr-4"
            >
              #{hastag}
            </p>
          ))}
      </div>
      <div>
        <h3 className="text-lg text-gray-800 mt-2 ">Komentar pembaca</h3>
        {blogData.comment &&
          blogData.comment.map((comment, index) => (
            <p key={index} className="text-gray-800 ml-2">
              <Link
                to={"/penulis/" + comment.publicId}
                className="text-indigo-600"
              >
                {comment.nickName} :{" "}
              </Link>
              <span className="text-gray-600 text-sm">{comment.comment}</span>
            </p>
          ))}
      </div>

      <form action="#" onSubmit={submitComment} className="w-full mt-2">
        <label htmlFor="komen" className=" text-gray-800">
          Tambahkan Komentar
        </label>
        <textarea
          id="komen"
          type="text"
          className="w-full px-3 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:border-blue-500  focus:outline-none require"
          rows="3"
          placeholder="Tuliskan komen anda"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        {status.error && (
          <p className="text-red-500 text-sm py-1 italic">{status.error}</p>
        )}
        {status.pending ? (
          <button
            type="submit"
            disabled
            className="items-center bg-pink-500 border-5 focus:outline-none rounded text-gray-100 py-1 px-3"
          >
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
            >
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className="items-center bg-pink-700 border-5 focus:outline-none hover:bg-pink-900 rounded text-gray-100 py-1 px-3"
          >
            Kirim
          </button>
        )}
      </form>
    </div>
  );
}
