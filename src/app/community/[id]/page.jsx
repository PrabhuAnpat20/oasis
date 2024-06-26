"use client";
import { HiUsers } from "react-icons/hi";
import { Toaster, toast } from "sonner";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import Link from "next/link";
import api from "@/api/api";
import CommunityPosts from "@/components/community/CommunityPosts";

export default function Page({ params }) {
  const [community, setCommunity] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = async () => {
    try {
      if (!isFollowing) {
        const response = await api.post("/community/subscribe", {
          community_id: params.id,
        });
        console.log(response);
        setIsFollowing(true);
        toast("Subscription added", {
          position: "top-right",
          className:
            "bg-black text-white pixel-text border border-solid border-green-400",
        });
        setCommunity((prevCommunity) => ({
          ...prevCommunity,
          isSubscribed: true,
        }));
      } else {
        const response = await api.delete("/community/unsubscribe", {
          data: { community_id: params.id },
        });
        console.log(response);
        setIsFollowing(false);
        setCommunity((prevCommunity) => ({
          ...prevCommunity,
          isSubscribed: false,
        }));
      }
    } catch (error) {
      console.error("Error during follow toggle:", error);
    }
  };

  const getCommunity = async (id) => {
    try {
      const response = await api.get(`/community?id=${id}`);
      const responseData = response.data;
      console.log(responseData);
      setCommunity(responseData);
      setIsFollowing(responseData.isSubscribed);
    } catch (error) {
      console.error("Error fetching community data:", error);
    }
  };

  useEffect(() => {
    getCommunity(params.id);
  }, [params.id, isFollowing]);

  return (
    <div className="md:mt-5 mt-4 md:w-[67%] md:mx-auto bg-black bg-opacity-80 md:bg-none md:bg-opacity-0 mx-3 mt-10 sm:mt-0  ">
      <Toaster />
      <div className="p-6">
        {community && (
          <div className="relative">
            <div className="cursor-pointer">
              <img
                src={community.banner}
                className="h-48 md:h-[270px] w-full"
              />
            </div>
            <div className="flex justify-center cursor-pointer">
              <img
                src={community.icon}
                alt=""
                className="rounded-full h-20 w-20 md:h-28 md:w-28 z-20 absolute mt-[-9%] bg-black"
              />
            </div>
            <div className="flex justify-between mt-14 text-lg ">
              <p className="font-bold text-[#00B2FF] pixel-text">
                {community.name}
              </p>
              <div className="flex my-auto ml-3">
                <div className="my-auto">
                  <HiUsers color="white" fill="white" fontSize="20px" />
                </div>
                <p className="text-white text-sm font-medium ml-1 pixel-text text-2xl">
                  {community.no_of_subscribers}
                </p>
              </div>
            </div>
            <div className=" flex">
              <img
                src={community.creator.profile_picture}
                alt=""
                className="  mr-2 my-auto rounded-full h-10 w-10"
              />
              <p className=" text-white my-auto">
                {community.creator.username}
              </p>
            </div>

            <div className="flex justify-between mt-3 text-sm">
              <div className="flex">
                <div>
                  <Link href="/create/post">
                    {(community.amcreator || isFollowing) && (
                      <button className="border-[1.5px] rounded-md p-1 mr-1 md:p-2 my-auto text-white  text-[0.5rem] border-[#767676] md:text-md pixel-text">
                        Create Post +
                      </button>
                    )}
                  </Link>
                </div>

                <p
                  className={`text-white rounded-md my-auto md:p-2 border-[#767676] border-[1.5px] p-1 sm:font-semibold px-2 md:px-4 text-[0.5rem] md:text-bse text-center cursor-pointer pixel-text ${
                    isFollowing ? "" : "bg-[#00b2ff]"
                  }`}
                  onClick={handleFollowToggle}
                >
                  {isFollowing ? "Subscribed" : "Subscribe"}
                </p>

                {community.amcreator && (
                  <div className="my-auto">
                    <Link href={`/EditCommunity/${community.id}`}>
                      <div className="flex ml-2">
                        <p className="my-auto text-white pixel-text text-xs md:text-md">
                          Edit
                        </p>
                        <MdEdit
                          color="#00b2ff"
                          size={20}
                          className="my-auto ml-1"
                        />
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <p className="text-[#828282] text-sm pixel-text my-auto">
                {community.type}
              </p>
            </div>
          </div>
        )}
        <div className="text-white my-4 text-xs md:text-base">
          {community && <p>{community.description}</p>}
        </div>
      </div>
      {isFollowing && <CommunityPosts posts={community.posts} />}
    </div>
  );
}
