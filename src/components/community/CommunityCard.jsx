"use client";
import api from "@/api/api";
import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { HiUsers } from "react-icons/hi";
import { Toaster, toast } from "sonner";
export default function ComunityCard({
  key,
  name,
  description,
  followers,
  type,
  icon,
  id,
  following,
}) {
  const [isfollowing, setIsFollowing] = useState(following);

  const handleFollowToggle = async () => {
    try {
      if (!isfollowing) {
        const response = await api.post("/community/subscribe", {
          community_id: id,
        });
        toast("Subscription added", {
          position: "top-right",
          className:
            "bg-black text-white pixel-text border border-solid border-green-400",
        });

        setIsFollowing(true);
      } else {
        const response = await api.delete("/community/unsubscribe", {
          data: { community_id: id },
        });

        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error during follow toggle:", error);
    }
  };

  return (
    <>
      <Toaster />
      <div className="my-4 " key={key}>
        <div className=" md:m-0 bg-black p-3  opacity-95 rounded-3xl  md:mr-16">
          <div className=" my-4">
            <div className="mb-3">
              <div className="">
                {/* <div className="flex w-full sm:justify-between"> */}
                <div className=" ">
                  <div className="  md:grid grid-cols-12  gap-2 ">
                    <div className=" my-auto overflow-hidden flex  col-span-5">
                      <div>
                        <Link href={`/community/${id}`}>
                          {icon === "" ? (
                            <img
                              src="/profile2.png"
                              alt=""
                              className="  h-24  w-24 rounded-full "
                            />
                          ) : (
                            <img
                              src={icon}
                              alt=""
                              className="  h-24  w-24 rounded-full "
                            />
                          )}
                        </Link>
                      </div>
                      <div className=" my-auto">
                        <Link href={`/community/${id}`}>
                          <p className=" pixel-text text-[#00B2FF] text-xs md:text-[1rem] font-bold text-md   my-auto  ml-5 sm:ml-3  ">
                            {name}
                          </p>
                        </Link>
                      </div>
                    </div>

                    <p className="text-[#828282] text-sm md:text-md my-auto col-span-2 pixel-text hidden md:block">
                      {type}
                    </p>
                    <div className="flex my-auto ml-3 col-span-3 pixel-text hidden md:block">
                      <div className="my-auto flex">
                        <HiUsers color="white" fill="white" fontSize="18px" />
                        <p className="text-white text-sm font-medium ml-1">
                          {followers}
                        </p>
                      </div>
                    </div>

                    <p
                      className={`hidden md:block text-white rounded-md my-auto border-[#767676] border-[1.5px]  p-1 sm:font-semibold px-4  text-[10px]  sm:mr-4 ml-1  text-center col-span-2 cursor-pointer pixel-text ${
                        isfollowing ? " px-0" : "bg-[#00B2FF]"
                      }`}
                      onClick={handleFollowToggle}
                    >
                      {isfollowing ? "Subscribed" : "Subscribe"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex mt-3 md:hidden justify-between">
                <div className="flex my-auto">
                  <p className="text-[#828282] pixel-text  text-xs my-auto">
                    {type}
                  </p>
                  <div className="my-auto ml-4">
                    <HiUsers color="white" fill="white" fontSize="15px" />
                  </div>
                  <p className="text-white text-xs font-medium ml-1 my-auto ">
                    {followers}
                  </p>
                </div>
                <p
                  className={` ml-4 text-white rounded-md my-auto border-[#767676] border-[1.5px]  p-1 sm:font-semibold px-2 text-[7px] md:text-[10px]   cursor-pointer pixel-text ${
                    isfollowing ? "" : "bg-[#00B2FF]"
                  }`}
                  onClick={handleFollowToggle}
                >
                  {isfollowing ? "Subcribed" : "Subscribe"}
                </p>
              </div>
            </div>
            <p className="text-white   text-xs  ml-1  mt-3 md:text-base">
              {description}
            </p>
          </div>
        </div>
      </div>
      <hr className="border border-blue-500   mx-3 " />
    </>
  );
}
