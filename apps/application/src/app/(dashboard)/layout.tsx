"use client";

import { ScrollArea } from "@memoize/ui/scroll-area";
import { Suspense, useEffect } from "react";
import FetchEntries from "./fetch-entries";
import { Card } from "@memoize/ui/card";
import Search from "~/components/layout/search";
import AddEntry from "~/components/entires/add-entry";
import { cn } from "@memoize/ui";
import { usePathname } from "next/navigation";
import { useEntrySync } from "~/hooks/use-entry-sync";
import useStore from "~/store/entries";
import { api } from "~/trpc/react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const pathNameIsNotDashboard = pathName.includes("/entry");
  const setEntries = useStore((state) => state.setEntries);
  const { data, isLoading, error, refetch } =
    api.entries.findAllEntires.useQuery(undefined, {
      refetchOnWindowFocus: false, // Disable automatic refetching
      enabled: false, // We'll control when to fetch
    });
  useEntrySync();

  useEffect(() => {
    if (!isLoading && !error && data) {
      setEntries(data);
    }
  }, [data]);

  return (
    <section className="relative flex-1 gap-0 md:flex p-5">
      {/* <SidebarComponent /> */}
      <Card
        className={cn(
          "w-full p-2  sm:w-96 border-r shadow-sm",
          !pathNameIsNotDashboard ? "block" : "md:block hidden",
        )}
      >
        <Search />
        <ScrollArea className="h-[calc(100vh-9rem)]">
          <Suspense fallback={<div>Loading...</div>}>
            <FetchEntries />
          </Suspense>
        </ScrollArea>
      </Card>
      <AddEntry />
      <div className="relative grid w-full items-center px-2 md:block  md:p-0 mx-2">
        <ScrollArea className="h-[calc(100vh-6rem)]">{children}</ScrollArea>
      </div>
    </section>
  );
}
