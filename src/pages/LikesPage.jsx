import React, { useEffect, useState } from "react";
import LikesPopup from "../components/LikesPopup";
import Navigation from "../components/Navigation";
import axios from "../axios";
function LikesPage() {
  const [popup, setPopup] = useState(true);

  // const users = [
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  //   {
  //     name: "Екатерина",
  //     distance: "1.3km",
  //     city: "Москва",
  //     photo1:
  //       "https://proteinfactory.com/wp-content/uploads/2019/06/david-laid.jpg",
  //     age: "18",
  //   },
  // ];

  const [users, setUsers] = useState();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    axios
      .post("/auth/getUserById", {
        userId,
      })
      .then((res) => res.data)
      .then((data) => {
        if (data?.likedBy) {
          axios
            .post("/getLikedUsers", {
              userIds: data?.likedBy,
              currentUserId: userId,
            })
            .then((res) => res.data)
            .then((data) => {
              if (data) {
                console.log(data);
                setUsers(data);
              }
            });
        }
      });
  }, []);
  return (
    <>
      <div className="w-[90%] mt-[80px] flex flex-col justify-start items-center mb-[70px]">
        {popup && <LikesPopup onClose={() => setPopup(false)}></LikesPopup>}
        <p className="flex justify-start items-center gap-1 font-semibold text-[28px] text-gray w-[100%] text-start mt-[30px]">
          Лайки{" "}
          <img className="w-[28px]" src="/images/icons/heart_red.png" alt="" />
        </p>
        <img src="" alt="" />
        <div className="flex mt-4 justify-between items-start w-[100%] flex-wrap h-[auto]">
          {users &&
            users.map((elem, idx) => (
              <div
                key={idx}
                className="relative flex justify-center items-center w-[165.5px] h-[220px] rounded-[16px]  mt-1"
                style={{
                  border: "1px solid #f2dddf",
                  boxShadow:
                    "0 2px 4px 0 rgba(139, 146, 159, 0.1), 0 8px 8px 0 rgba(139, 146, 159, 0.09), 0 18px 11px 0 rgba(139, 146, 159, 0.05), 0 32px 13px 0 rgba(139, 146, 159, 0.01), 0 50px 14px 0 rgba(139, 146, 159, 0)",
                  background: "#feffff",
                }}
              >
                <img
                  src={elem.photos[0]}
                  alt="photo"
                  className="rounded-[8px] w-[146px] h-[204px] object-cover"
                />
                <div className="flex justify-start items-center gap-1 absolute left-[12px] bottom-11">
                  <div className="text-red-500 bg-white rounded-[16px] h-[24px] w-[55px] text-center font-semibold">
                    {elem?.km?.slice(0, 3)}км.
                  </div>
                  <p className="flex justify-start items-center gap-1 text-white text-[14px] ">
                    <img src="/images/icons/location.svg" alt="" /> {elem.city}
                  </p>
                </div>
                <div className="flex justify-start items-center gap-1 absolute left-[12px] bottom-3">
                  <h1 className="text-[20px] text-white font-semibold ">
                    {elem?.name}
                  </h1>
                  <h1 className="text-[20px] text-white font-semibold ">
                    {elem?.birthYear
                      ? new Date().getFullYear() - elem.birthYear
                      : "Возраст неизвестен"}
                  </h1>
                </div>
              </div>
            ))}
        </div>
      </div>

      <Navigation />
    </>
  );
}

export default LikesPage;
