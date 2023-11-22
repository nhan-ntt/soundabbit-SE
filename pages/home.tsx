import type { NextPage } from "next";

import AppLayout from "@/layouts/appLayout";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { Artist } from "@/interfaces/artist";
import {
    getRecentUsers,
    HomePageState,
    RequestStatus,
} from "@/stores/homePage/homePageSlice";
import HorizontalSongsList from "@/components/HorizontalSongsList";
import HorizontalArtistsList from "@/components/HorizontalArtistsList";
import ErrorComponent from "@/components/error";
import { Spinner } from "@nextui-org/react";
import VerticalArtistCard from "@/components/verticalArtistCard";

const Home: NextPage = () => {
    const {
        recentUsers: recentArtist,
        status,
        topHits,
        popularHits,
        trendingArtists,
    }: HomePageState = useSelector((state: any) => state.homePage);
    const { user } = useSelector((state: any) => state.auth);

    const dispatch = useDispatch<any>();

    useEffect(() => {
        if (user) {
            if (status !== RequestStatus.Success) {
                dispatch(getRecentUsers());
            }
        }
    }, []);

    return (
        <AppLayout>
            {status == RequestStatus.Loading ? (
                <div
                    className=" w-[calc(100vw_-_14rem_-_16px)] mini-laptop:w-[calc(100vw_-_55px)] 
        tablet:w-screen mobile:w-screen overflow-x-hidden  h-screen mobile:h-[calc(100vh_-_50px)] 
        tablet:h-[calc(100vh_-_50px)] flex flex-col items-center justify-center"
                >
                    <Spinner
                        className="mb-40"
                        size="lg"
                        color="success"
                        labelColor="success"
                    />
                </div>
            ) : status == RequestStatus.Error ? (
                <ErrorComponent />
            ) : status == RequestStatus.Success ? (
                <div className="pt-10 mini-laptop:pt-2 mobile:pt-1 tablet:pt-2">
                    <h1 className="select-none pt-6 tablet:px-6 px-8 mobile:px-4 pb-6 text-3xl mini-laptop:text-2xl tablet:text-2xl mobile:text-xl">
                        Artist
                    </h1>
                    <div
                        className="select-none px-8 tablet:px-6 mobile:px-4 grid grid-cols-3 gap-x-6 gap-y-5 mini-laptop:gap-x-3 
          mini-laptop:gap-y-4 tablet:gap-y-4 tablet:gap-x-3 mobile:grid-cols-2 mobile:gap-x-3 mobile:gap-y-3"
                    >
                        {recentArtist.map((artist: Artist, index: number) => (
                            <VerticalArtistCard key={index} artist={artist} />
                        ))}
                    </div>
                    <div className="mt-12">
                        <h1 className="px-8 tablet:px-6 mobile:px-4 text-xl mb-6 mobile:text-base">
                            Trending Artists
                        </h1>
                        <HorizontalArtistsList artists={trendingArtists} />
                    </div>

                    <div className="mt-12">
                        <h1 className="px-8 tablet:px-6 mobile:px-4 text-xl mb-6 mobile:text-base">
                            Top Hits this Week
                        </h1>
                        <HorizontalSongsList songs={topHits} />
                    </div>
                    <div className="mt-6">
                        <h1 className="px-8 tablet:px-6 mobile:px-4 text-xl mb-6 mobile:text-base">
                            Popular releases
                        </h1>
                        <HorizontalSongsList songs={popularHits} />
                    </div>
                    <div className="h-40"></div>
                </div>
            ) : (
                <div className="w-full h-screen"></div>
            )}
        </AppLayout>
    );
};

export default Home;
