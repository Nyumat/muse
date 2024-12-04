import { MiniPlayer } from "@/components/mini-player";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { usePlayerControls } from "@/stores/audioStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Play, Trash2 } from "lucide-react";
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
  const currentSongs = filteredSongs?.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages =
    (filteredSongs && Math.ceil(filteredSongs?.length / songsPerPage)) || 1;

  const { playSong } = usePlayerControls();

  return (
    <>
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
        <div className="mb-4 flex justify-between items-center">
          <Input
            placeholder="Search songs, artists, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm backdrop-blur-lg"
          />
          <AddSongDialog />
        </div>
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
              {currentSongs?.map((song) => (
                <TableRow key={song._id} className={cn("border-none")}>
                  <TableCell>
                    <img
                      src={song.thumbnail}
                      alt={`${song.title} thumbnail`}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell
                    className="font-medium truncate max-w-44"
                    title={song.title}
                  >
                    {song.title}
                  </TableCell>
                  <TableCell>{formatDuration(song.duration)}</TableCell>
                  <TableCell>{song.uploader}</TableCell>
                  <TableCell>{formatDate(song.upload_date)}</TableCell>
                  <TableCell>{song.view_count.toLocaleString()}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Play"
                      onClick={() => {
                        playSong(song._id);
                      }}
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
                      onClick={() => removeSong.mutate(song._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  //   disabled={currentPage === 1}
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
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  //   disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
            <MiniPlayer />
          </Pagination>
        </div>
      </DashboardPageLayout>
    </>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
