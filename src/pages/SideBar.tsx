import { useEffect,useState } from "react";
import AnimeService from "../requests/index";
import { BookOpen, Search, Settings2, Tv } from "lucide-react";
import { useUserStore } from "@/app/store";
import { currentUI } from "@/app/store";
import TooltipComp from "@/components/Tooltip";
import { useQuery } from "@tanstack/react-query";

const SideBar = () => {

    console.log("SiderBar Renders");
    const { setUser } = useUserStore();
    const { setCurrentTab } = currentUI();
    const [userData, setUserData] = useState<ViewerQueryResponse>(
        JSON.parse(localStorage.getItem("userDetail") || "{}")
    );

    //? any better way?
    const [firstRender, setFirstRender] = useState(false);

    const {
        data: userDataResponse,
    } = useQuery({
        queryKey: ["userDetails"],
        queryFn: () => AnimeService.userDetails(),
        enabled : !firstRender
    })

    useEffect(() => {

        if(!firstRender && !userData.Viewer) {
            setFirstRender(true);
        }

        if (userDataResponse && !userData.Viewer) {
            console.log("Insider")
            setUser({ id: userDataResponse?.Viewer.id, name: userDataResponse?.Viewer.name });
            setUserData(userDataResponse);
            localStorage.setItem("userDetail", JSON.stringify(userDataResponse));
        }
    }, [userDataResponse]);


    return (
        <section className="bg-purple border-l-2 border-l-black  h-full pt-3 flex flex-col items-center justify-between">
                <div className="p-1 flex flex-col items-center">
                    <a href={userData?.Viewer?.siteUrl} target="_blank">
                        <img
                            alt="User Avatar"
                            src={userData?.Viewer?.avatar?.large}
                            className="p-1 mb-[2rem] w-12 h-12 rounded-full border-2 border-white hover:bg-black hover:cursor-pointer"
                        />
                    </a>
                    <Search
                        size={30}
                        id="search"
                        className=" text-white text-2xl hover:cursor-pointer outline-none"
                        onClick={() => setCurrentTab("SEARCH")}
                        strokeWidth={3}
                    />
                    <TooltipComp content="Search" anchorSelect="#search" />
                    <Tv
                        strokeWidth={3}
                        id="anime"
                        size={30}
                        className="mt-[2rem] text-white text-2xl hover:cursor-pointer outline-none"
                        onClick={() => setCurrentTab("MYANIME")}
                    />

                    <TooltipComp content="My Anime" anchorSelect="#anime" />
                    <BookOpen
                        id="manga"
                        strokeWidth={3}
                        size={30}
                        color="#fff"
                        className="mt-[2rem] text-white text-2xl hover:cursor-pointer outline-none"
                        onClick={() => setCurrentTab("MYMANGA")}
                    />
                    <TooltipComp content="My Manga" anchorSelect="#manga" />
                </div>
                <Settings2
                    id="settings"
                    strokeWidth={3}
                    size={30}
                    className="text-white text-2xl hover:cursor-pointer mb-[1rem] outline-none"
                    onClick={() => setCurrentTab("SETTINGS")}
                />
                <TooltipComp content="Settings" anchorSelect="#settings" />
        </section>
    );
};

export default SideBar;
