import React from "react";
import { useSelector, useDispatch } from "react-redux";
import ListItem from "../components/ListItem";
import { SongProps } from "../interfaces/Song";
import AppLayout from "@/layouts/appLayout";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
    reorderQueue,
    setActiveSong,
} from "../stores/player/currentAudioPlayer";
import NoSSRWrapper from "../components/noSSRWrapper";
import NavBar from "../components/backButton";
import { useState } from "react";
function Queue() {
    const { songs, currentIndex } = useSelector((state: any) => state.player);
    const [srcollPosition, setScrollPosition] = useState(0);
    const dispatch = useDispatch<any>();

    const onDragHandle = (result: any) => {
        if (!result.destination) {
            return;
        }
        const newlist = reorder(result.source.index, result.destination.index);
        dispatch(
            reorderQueue([...songs.slice(0, currentIndex + 1), ...newlist])
        );
    };

    const reorder = (startIndex: number, endIndex: number) => {
        const result = Array.from(songs.slice(currentIndex + 1));
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const onScroll = (e: any) => {
        setScrollPosition(e.target.scrollTop);
    };

    return (
        <NoSSRWrapper>
            <AppLayout color="#121212" title="Queue" onScroll={onScroll}>
                <NavBar
                    condition={srcollPosition >= 100}
                    color={"#333333"}
                    title={"Queue"}
                />
                <div className="px-6 pt-20 mobile:px-4">
                    <h1 className="text-3xl font-ProximaBold mb-6">Queue</h1>
                    <h1 className="text-base text-gray-400 font-ProximaBold mb-2">
                        Now Playing
                    </h1>
                    <ListItem
                        onTap={() => {}}
                        song={songs[currentIndex]}
                        showNumber={1}
                    />
                    <h1 className="text-base font-ProximaBold my-5 text-gray-400">
                        Next in Queue:
                    </h1>
                    <DragDropContext onDragEnd={onDragHandle}>
                        <Droppable droppableId="droppable">
                            {(provided, _) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {songs
                                        .slice(currentIndex + 1)
                                        .map((song: SongProps, i: any) => (
                                            <Draggable
                                                key={song.id.toString()}
                                                index={i}
                                                draggableId={song.id.toString()}
                                            >
                                                {(provided, snapshot) => (
                                                    <div
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                    >
                                                        <ListItem
                                                            onTap={() =>
                                                                dispatch(
                                                                    setActiveSong(
                                                                        {
                                                                            songs: songs,
                                                                            index: songs.indexOf(
                                                                                song
                                                                            ),
                                                                        }
                                                                    )
                                                                )
                                                            }
                                                            song={song}
                                                            showNumber={i + 2}
                                                        />
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <div className="pb-32"></div>
                </div>
            </AppLayout>
        </NoSSRWrapper>
    );
}

export default Queue;
