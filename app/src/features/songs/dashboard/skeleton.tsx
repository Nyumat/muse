import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function SongsPageSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b">
        <div className="flex items-center gap-2 px-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <Skeleton className="h-10 w-[300px] mb-4" />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-4 w-[80px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[80px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[120px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[80px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
                <TableHead>
                  <Skeleton className="h-4 w-[100px]" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(10)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-20 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[50px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <Skeleton className="h-10 w-[300px]" />
        </div>
      </main>
    </div>
  );
}
