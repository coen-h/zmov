"use client";

import serverUrls from "@/app/lib/serverUrls";
import { useState, useEffect, useRef } from "react";
import fetchInfo from "@/app/lib/fetchInfo";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import { useParams } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ProgressData {
  watched: number;
  duration: number;
}

interface BaseMessage<T extends string, D> { type: T; data: D; }

type VidlinkMessage = BaseMessage<"MEDIA_DATA", Record<string, { progress?: ProgressData }>>;
type VidfastMessage = BaseMessage<"MEDIA_DATA", Record<string, { progress?: ProgressData }>>;
type VideasyMessage = BaseMessage<"PLAYER_EVENT", { currentTime: number; duration: number }>;
type VidoraMessage = BaseMessage<"MEDIA_DATA", { id: number; type: "movie" | "tv"; progress: ProgressData }>;
type VidrockMessage = BaseMessage<"MEDIA_DATA", { id: number; type: "movie" | "tv"; progress: ProgressData }>;

type MediaDataMessage =
  | VidlinkMessage
  | VidfastMessage
  | VideasyMessage
  | VidoraMessage
  | VidrockMessage;

type SourceOrigin =
  | "https://vidlink.pro"
  | "https://vidfast.pro"
  | "https://player.videasy.net"
  | "https://vidora.su"
  | "https://vidrock.net";

type SourceHandlers = Record<
  SourceOrigin,
  (data: MediaDataMessage | string) => void
>;

export default function Watch() {
  const urls = serverUrls();
  const [selectedUrl, setSelectedUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const storedServer = localStorage.getItem("lastUsedServer");
      if (storedServer) return storedServer;
    }
    return urls[0].url;
  });
  const [urlParams, setUrlParams] = useState(() => {
    const initial = urls.find((item) => item.url === selectedUrl);
    return initial ? initial.params : urls[0].params;
  });
  const params = useParams<{ type: string; id: string }>();
  const type = params.type;
  const id = Number(params.id);
  const [watchProgress, setWatchProgress] = useState(0);
  const [durationData, setDurationData] = useState(0);
  const [initialProgress, setInitialProgress] = useState("");
  const initialSetRef = useRef(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
    });
  }, []);

  useEffect(() => {
    if (!user) return;

    async function updateOrCreateItem() {
      try {
        const { data: existing } = await supabase
          .from("watchedItem")
          .select("*")
          .eq("userId", user?.id)
          .eq("itemId", id)
          .eq("type", type)
          .single();

        if (!existing) {
          const newItem = await fetchInfo(type, id);
          initialSetRef.current = true;
          document.title = `${newItem.title || ""} - zmov`;

          await supabase.from("watchedItem").upsert([
            {
              userId: user?.id,
              itemId: id,
              type,
              title: newItem.title || newItem.name || "",
              poster: newItem.backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${newItem.backdrop_path}`
                : "",
              progress: watchProgress,
              duration: durationData,
              createdAt: new Date(),
            },
          ]);
        } else {
          document.title = `${existing.title || ""} - zmov`;

          if (!initialSetRef.current) {
            setInitialProgress(existing.progress ?? 0);
            initialSetRef.current = true;
          }

          await supabase
            .from("watchedItem")
            .update({
              progress: watchProgress,
              duration: durationData,
              createdAt: new Date(),
            })
            .eq("userId", user?.id)
            .eq("itemId", id)
            .eq("type", type);
        }
      } catch (e) {
        console.error("Failed to update watch progress:", e);
      }
    }

    updateOrCreateItem();
  }, [type, id, watchProgress, durationData, user]);

  useEffect(() => {
    const sourceHandlers: SourceHandlers = {
      "https://vidlink.pro": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA" && !("id" in data.data)) {
          const currentItem = data.data[id.toString()];
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
      "https://vidfast.pro": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA" && !("id" in data.data)) {
          const currentItem = data.data[`m${id}`];
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
      "https://player.videasy.net": (data) => {
        try {
          const parsed: MediaDataMessage =
            typeof data === "string" ? JSON.parse(data) : data;
          if (parsed.type === "PLAYER_EVENT") {
            setWatchProgress(parsed.data.currentTime);
            setDurationData(parsed.data.duration);
          }
        } catch (e) {
          console.error("Failed to parse videasy message data", e);
        }
      },
      "https://vidora.su": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA" && "id" in data.data) {
          const vidoraData = data as VidoraMessage;
          if (vidoraData?.data.progress) {
            setWatchProgress(vidoraData.data.progress.watched);
            setDurationData(vidoraData.data.progress.duration);
          }
        }
      },
      "https://vidrock.net": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA") {
          if (!Array.isArray(data.data)) return;
          const currentItem = data.data.find((item) => item.id === id);
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
    };

    const handleMessage = (event: MessageEvent) => {
      const { origin, data } = event;
      if (!data) return;
      if (origin in sourceHandlers) {
        sourceHandlers[origin as SourceOrigin](data);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [id, type]);

  return (
    <>
      <div className="flex w-screen h-screen relative">
        <Link
          href={`/info/${type}/${id}`}
          className="absolute pt-1 pl-1 top-0 left-0"
          prefetch={false}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32px"
            height="32px"
            fill="#ffffff"
            viewBox="0 0 448 512"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
        </Link>
        <select
          className="absolute top-1 right-1 bg-black py-1 px-2 rounded-lg cursor-pointer border border-white/30"
          onChange={(e) => {
            const selected = urls.find((item) => item.url === e.target.value);
            if (selected) {
              setInitialProgress(String(watchProgress));
              setSelectedUrl(selected.url);
              setUrlParams(selected.params);
              localStorage.setItem("lastUsedServer", selected.url);
            }
          }}
          value={selectedUrl}
        >
          {urls.map((item) => (
            <option key={item.id} value={item.url}>
              {item.name}
            </option>
          ))}
        </select>
        <iframe
          src={`${selectedUrl}/${type}/${id}${urlParams}${initialProgress}`}
          allowFullScreen={true}
          className="w-screen h-screen border-0"
        ></iframe>
      </div>
    </>
  );
}
