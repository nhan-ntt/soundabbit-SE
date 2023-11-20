import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { playPause, toggleModal } from "@/stores/player/currentAudioPlayer";
import { useState } from "react";
import {
    CreatePlaylistStatus,
    renamePlaylist,
} from "../stores/player/currentAudioPlayer";
import { useRouter } from "next/navigation";
import {
    addSongToPlaylist,
    createNewPlaylist,
} from "../stores/player/currentAudioPlayer";
import { toast } from "react-toastify";
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Input,
    Autocomplete,
    AutocompleteItem,
} from "@nextui-org/react";

function AddToPlaylistModal() {
    const { isModalOpen, playlists, passedDataToModal, createPlaylistStatus } =
        useSelector((state: any) => state.player);

    const { user } = useSelector((state: any) => state.auth);
    const router = useRouter();
    const dispatch = useDispatch<any>();
    const modal = useRef(null);
    const [playlistID, setPlaylistID] = useState<string>("");
    const [name, setname] = useState<string>("");
    useEffect(() => {
        if (!isModalOpen) return;

        if (passedDataToModal.playlist_name) {
            setname(passedDataToModal.playlist_name);
        }

        function handleClick(event: any) {
            // @ts-ignore-comment
            if (modal.current && !modal.current.contains(event.target)) {
                dispatch(toggleModal({ data: false, song_id: "" }));
            }
        }

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isModalOpen]);

    useEffect(() => {
        if (
            createPlaylistStatus == CreatePlaylistStatus.done &&
            name.length !== 0
        ) {
            const playlist = playlists.find((e: any) => e.name == name);
            dispatch(toggleModal({ data: false, song_id: "" }));
            router.push(`/playlist/${playlist.id}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createPlaylistStatus]);

    return (
        <div>
            <Modal
                isOpen={isModalOpen}
                onOpenChange={() => {
                    dispatch(
                        toggleModal({
                            data: false,
                            song_id: "",
                        })
                    );
                }}
                placement={"center"}
                backdrop={"blur"}
            >
                <ModalContent>
                    {passedDataToModal.song_id == "NEW" ? (
                        <>
                            <ModalHeader>Create playlist</ModalHeader>
                            <ModalBody>
                                <Input
                                    variant="bordered"
                                    type="text"
                                    label="Playlist Name"
                                    onChange={(e) => {
                                        setname(e.target.value);
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={
                                        name.length === 0 ||
                                        createPlaylistStatus ==
                                            CreatePlaylistStatus.waiting
                                    }
                                    onClick={() => {
                                        dispatch(
                                            createNewPlaylist({
                                                token: user.token,
                                                name: name,
                                                song_id: undefined,
                                            })
                                        );
                                        toast.success(
                                            "Playlist has been created!"
                                        );
                                    }}
                                    className="bg-[#2bb540] disabled:bg-[#287b34] w-full p-1.5 text-center uppercase text-white tracking-wider font-bold"
                                >
                                    Create New
                                </Button>
                            </ModalFooter>
                        </>
                    ) : passedDataToModal.song_id == "RENAME" ? (
                        <>
                            <ModalHeader>Rename Playlist:</ModalHeader>
                            <ModalBody>
                                <Input
                                    type="text"
                                    label="Playlist name"
                                    value={name}
                                    onChange={(e) => {
                                        setname(e.target.value);
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    isDisabled={name.length === 0}
                                    onClick={() => {
                                        dispatch(
                                            renamePlaylist({
                                                token: user.token,
                                                name: name,
                                                id: passedDataToModal.playlist_id,
                                            })
                                        );
                                        dispatch(
                                            toggleModal({
                                                data: false,
                                                song_id: "",
                                            })
                                        );
                                        toast.success("Playlist Renamed!");
                                    }}
                                    className="bg-[#2bb540] disabled:bg-[#287b34] w-full p-1.5 text-center uppercase text-white tracking-wider font-bold"
                                >
                                    Rename playlist
                                </Button>
                            </ModalFooter>
                        </>
                    ) : (
                        <>
                            <ModalHeader>Add to playlist:</ModalHeader>
                            <ModalBody>
                                <div>
                                    <Autocomplete
                                        variant="bordered"
                                        label="Choose a playlist"
                                        onSelectionChange={(value: any) => {
                                            setPlaylistID(value);
                                        }}
                                    >
                                        {playlists.map((playlist: any) => (
                                            <AutocompleteItem key={playlist.id}>
                                                {playlist.name}
                                            </AutocompleteItem>
                                        ))}
                                    </Autocomplete>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    className="bg-[#2bb540] disabled:bg-[#287b34] w-full p-1.5 text-center uppercase text-white tracking-wider font-bold"
                                    onClick={() => {
                                        dispatch(
                                            addSongToPlaylist({
                                                token: user.token,
                                                playlist_id: playlistID,
                                                song_id:
                                                    passedDataToModal.song_id,
                                            })
                                        );
                                        dispatch(
                                            toggleModal({
                                                data: false,
                                                song_id: "",
                                            })
                                        );
                                        toast.success("Added to playlist!");
                                    }}
                                >
                                    Add to playlist
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}

export default AddToPlaylistModal;
