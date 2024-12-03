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
import { useQuery } from "@tanstack/react-query";
import { Pencil, Play, Trash2 } from "lucide-react";
import { useState } from "react";
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

export function SongsView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const songsPerPage = 10;
  const query = useQuery({ queryKey: ["songs"], queryFn: getSongs });

  const filteredSongs = query?.data?.filter(
    (song) =>
      song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.uploader.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  ) as Song[];

//   const indexOfLastSong = currentPage * songsPerPage;
//   const indexOfFirstSong = indexOfLastSong - songsPerPage;
//   const currentSongs = filteredSongs?.slice(indexOfFirstSong, indexOfLastSong);
  const totalPages = Math.ceil(filteredSongs?.length / songsPerPage) || 1;

  return (
    <>
      <DashboardPageLayout
        breadcrumbs={
          <>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
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
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query?.data?.map((song) => (
                <TableRow key={song._id} className={cn("border-none")}>
                  <TableCell>
                    <img
                      src={`https://i.ytimg.com/vi/6QAAnh9sPF8/sddefault.jpg`} // TODO: Replace with song.thumbnail
                      alt={`${song.title} thumbnail`}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium truncate max-w-44">
                    {song.title}
                  </TableCell>
                  <TableCell>{formatDuration(song.duration)}</TableCell>
                  <TableCell>{song.uploader}</TableCell>
                  <TableCell>
                    {new Date(song.upload_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{song.view_count.toLocaleString()}</TableCell>
                  <TableCell className="truncate max-w-12">
                    {song.tags.join(", ").slice(0, 20)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="Play">
                      <Play className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete">
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
