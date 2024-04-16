import { toggleModal } from "@/stores/player/currentAudioPlayer";
import Link from "next/link";
import SidebarItem from "@/components/sidebarItem";
import { Image } from "@nextui-org/react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    const dispatch = useDispatch();

    return (
        <div
            className="w-[14rem] border-r-[#242424] border-r mini-laptop:w-[55px] relative bg-black/50 backdrop-blur-xl p-3
            mini-laptop:p-0 tablet:hidden mobile:hidden"
        >
            <Link href="/home">
                <div className="flex flex-row items-center px-3 mt-2 select-none cursor-pointer">
                    <div className="mini-laptop:mt-4 relative w-[40px] h-[40px] mini-laptop:w-[30px]">
                        <Image src="/logo.jpeg" alt="logo" />
                    </div>

                    <h1
                        className="text-center uppercase mx-2 text-md 
                 tracking-wider mini-laptop:hidden"
                    >
                        Rhyme
                    </h1>
                </div>
            </Link>

            <div className="px-4 mt-8">
                <SidebarItem name="home" label="Home" />
                <SidebarItem name="search" label="Search" />
                <SidebarItem name="library" label="Your Library" />
                <div className="my-6 border-b border-slate-800 "></div>
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        dispatch(
                            toggleModal({
                                data: true,
                                song_id: "NEW",
                            })
                        );
                    }}
                    className="group select-none cursor-pointer mt-4 flex flex-row items-center 
               mini-laptop:hidden tablet:hidden mobile:hidden"
                >
                    <i className="icon-create_new text-[26px] opacity-70 mr-3 group-hover:opacity-100"></i>
                    <p className="group-hover:opacity-100 text-white opacity-70">
                        Create Playlist
                    </p>
                </div>
                <Link href={`/playlist/liked`}>
                    <div
                        className={`${pathname == "/playlist/liked"
                            ? "opacity-100"
                            : "opacity-70"
                            } hover:opacity-100 mini-laptop:hidden tablet:hidden mobile:hidden group select-none cursor-pointer mt-4 flex flex-row items-center 
               mini-laptop:w-full mini-laptop:mt-6 mobile:mt-0 tablet:mt-0 mobile:mx-8 tablet:mx-10`}
                    >
                        <div className=" rounded bg-gradient-to-tl to-[#4C17F3] from-[#ddd7d7] px-2 py-2 flex items-center mr-3">
                            <i className="icon-heart text-[12px]"></i>
                        </div>

                        <p className=" text-white ">Liked Songs</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
