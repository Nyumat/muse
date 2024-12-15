import {
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DashboardPageLayout } from "@/layout/page-layout";
import Fetcher from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { useAudioStore, usePlayerControls } from "@/stores/audioStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, MoreVertical, Pencil, Play, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { formatDate } from "../../../lib/utils";
import { AddSongDialog } from "../add-song-dialog";

const api = Fetcher.getInstance();

export interface Song {
    _id: string;
    title: string;
    duration: number;
    mediaUrl: string;
    r2Key: string;
    createdBy: string;
    upload_date: string;
    view_count: number;
    thumbnail: string;
    tags: string[];
    stream_url: string | undefined;
    original_url: string;
    extractor: string;
    duration_string: string;
    ytdlp_id: string;
    uploader: string;
    createdAt: Date;
    updatedAt: Date;
}

const getSongs = async () => {
    const res = await api.get<Song[]>("/api/songs");
    return res.data;
};

const deleteSong = async (id: string) => {
    await api.delete(`/api/songs/${id}`);
};


const MobileSongsList = ({
    songs,
    onPlay,
    onDelete,
    currentSong
}: {
    songs: Song[];
    onPlay: (id: string) => void;
    onDelete: (id: string) => void
    currentSong: Song | null;
}) => {
    return (
        <Card className="bg-primary/10 border-primary/50">
            <CardContent className="p-0">
                {songs?.map((song, index) => (
                    <div
                        key={song._id}
                        className="p-4 grid grid-cols-[auto_1fr_auto] gap-4 items-center border-b border-primary/20 last:border-0 active:bg-primary/5"
                        onClick={() => onPlay(song._id)}
                    >
                        <div className="relative">
                            <img
                                src={song.thumbnail}
                                alt={song.title}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                        </div>

                        <div className="min-w-0">
                            <div className="font-medium text-[14px] truncate text-gray-100">
                                {song.title}
                            </div>
                            <div className="text-[12px] text-gray-400 truncate">
                                {song.uploader}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                                <Eye className="h-3 w-3" />
                                <span>{song.view_count.toLocaleString()}</span>
                                <span className="mx-1">•</span>
                                <span>{song.duration_string}</span>
                            </div>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <MoreVertical className="h-4 w-4 text-gray-400" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => {
                                    e.stopPropagation();
                                    onPlay(song._id);
                                }}>
                                    <Play className="h-4 w-4 mr-2" />
                                    {currentSong?._id === song._id ? "Pause" : "Play"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Details
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-red-500 focus:text-red-500"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(song._id);
                                    }}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Song
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

const DesktopSongsList = ({ songs, onPlay, onDelete }:
    { songs: Song[]; onPlay: (id: string) => void; onDelete: (id: string) => void }
) => {
    return (
        <div className="rounded-md border-none backdrop-blur-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Thumbnail</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Uploader</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Views</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {songs?.map((song) => (
                        <TableRow key={song._id} className={cn("border-none")}>
                            <TableCell>
                                <img
                                    src={song.thumbnail}
                                    alt={`${song.title} thumbnail`}
                                    className="rounded-md object-cover w-16 h-16"
                                />
                            </TableCell>
                            <TableCell
                                className="font-medium truncate max-w-44"
                                title={song.title}
                            >
                                {song.title}
                            </TableCell>
                            <TableCell>{song.duration_string}</TableCell>
                            <TableCell>{song.uploader}</TableCell>
                            <TableCell>{formatDate(song.upload_date)}</TableCell>
                            <TableCell>{song.view_count.toLocaleString()}</TableCell>

                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Play"
                                    onClick={() => onPlay(song._id)}
                                >
                                    <Play className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" title="Edit">
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    title="Delete"
                                    onClick={() => onDelete(song._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

// Main Songs View Component
export function SongsView() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const songsPerPage = 10;
    const queryClient = useQueryClient();
    const query = useQuery({ queryKey: ["songs"], queryFn: getSongs });
    const removeSong = useMutation({
        mutationFn: deleteSong,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["songs"] });
        },
    });

    const filteredSongs = query?.data?.filter(
        (song) =>
            song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.uploader.toLowerCase().includes(searchTerm.toLowerCase()) ||
            song.tags.some((tag) =>
                tag.toLowerCase().includes(searchTerm.toLowerCase())
            )
    );

    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = filteredSongs?.slice(indexOfFirstSong, indexOfLastSong) || [];
    const totalPages = Math.ceil((filteredSongs?.length || 0) / songsPerPage);

    const { playSong } = usePlayerControls();
    const { currentSong } = useAudioStore();

    return (
        <DashboardPageLayout
            breadcrumbs={
                <>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Songs</BreadcrumbPage>
                    </BreadcrumbItem>
                </>
            }
        >

            <h1 className="text-2xl font-semibold text-gray-100 mb-4">Your Song Library</h1>

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <Input
                    placeholder="Search songs, artists, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-sm bg-gray-900/40 border-gray-800 placeholder-gray-400"
                />
                <AddSongDialog />
            </div>

            {/* Mobile view */}
            <div className="md:hidden">
                <MobileSongsList
                    songs={currentSongs}
                    onPlay={playSong}
                    onDelete={(id) => removeSong.mutate(id)}
                    currentSong={currentSong}
                />
            </div>

            {/* Desktop view */}
            <div className="hidden md:block">

                <DesktopSongsList
                    songs={currentSongs}
                    onPlay={playSong}
                    onDelete={(id) => removeSong.mutate(id)}
                />
            </div>

            {/* Pagination */}
            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            />
                        </PaginationItem>
                        {[...Array(totalPages)].map((_, index) => (
                            <PaginationItem key={index}>
                                <PaginationLink
                                    href="#"
                                    onClick={() => setCurrentPage(index + 1)}
                                    isActive={currentPage === index + 1}
                                >
                                    {index + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={() => setCurrentPage((prev) =>
                                    Math.min(prev + 1, totalPages)
                                )}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </DashboardPageLayout>
    );
}

export default SongsView;