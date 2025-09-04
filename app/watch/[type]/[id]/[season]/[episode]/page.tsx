"use client";

import serverUrls from "@/app/lib/serverUrls";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import fetchInfo from "@/app/lib/fetchInfo";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/utils/supabase";
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface ProgressData {
  watched: number;
  duration: number;
}

interface BaseMessage<T extends string, D> { type: T; data: D; }

type VidlinkMessage = BaseMessage<"MEDIA_DATA", Record<string, { show_progress?: Record<string, { progress?: ProgressData }> }>>;
type VidfastMessage = BaseMessage<"MEDIA_DATA", Record<string, { show_progress?: Record<string, { progress?: ProgressData }> }>>;
type VideasyMessage = BaseMessage<"PLAYER_EVENT", { currentTime: number; duration: number }>;
type VidoraMessage = BaseMessage<"MEDIA_DATA", { show_progress?: Record<string, { progress?: ProgressData }>; id?: number }>;
type VidrockMessage = BaseMessage<"MEDIA_DATA", Array<{id: number; type?: "movie" | "tv"; progress?: ProgressData; show_progress?: Record<string, { progress?: ProgressData }>;}>>;

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

type SourceHandlers = Record<SourceOrigin, (data: MediaDataMessage | string) => void>;

interface Season {
  season_number: number;
  episode_count: number;
}

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
  const params = useParams<{ type: string; id: string, season: string; episode: string }>();
  const type = params.type;
  const id = Number(params.id);
  const season = Number(params.season);
  const episode = Number(params.episode);
  const [watchProgress, setWatchProgress] = useState(0);
  const [durationData, setDurationData] = useState(0);
  const [episodesLength, setEpisodesLength] = useState(0);
  const [seasonLength, setSeasonLength] = useState(0);
  const router = useRouter();
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
        const { data: existing } = await supabase.from("watchedItem").select("*").eq("userId", user?.id).eq("itemId", id).eq("type", type).single();

        if (!existing) {
          const newItem = await fetchInfo(type, id);
          const seasonInfo = (newItem.seasons as Season[]).find((s) => s.season_number === season);

          document.title = `${newItem.title || newItem.name || ""} S${season} E${episode} - zmov`;
          setEpisodesLength(seasonInfo?.episode_count ?? 0);
          setSeasonLength(newItem.number_of_seasons);

          await supabase.from("watchedItem").upsert([
            {
              userId: user?.id,
              itemId: id,
              type,
              title: newItem.title || newItem.name || "",
              poster: newItem.backdrop_path
                ? `https://image.tmdb.org/t/p/w500/${newItem.backdrop_path}`
                : "",
              episode: episode,
              season: season,
              numOfEpisodes: seasonInfo?.episode_count ?? 0,
              numOfSeasons: newItem.number_of_seasons,
              progress: watchProgress,
              duration: durationData,
              createdAt: new Date(),
            },
          ]);
        } else {
          if (existing.season !== season) {
            const item = await fetchInfo(type, id);
            const seasonInfo = (item.seasons as Season[]).find((s) => s.season_number === season);

            setEpisodesLength(seasonInfo?.episode_count ?? 0);
          } else {
            setEpisodesLength(existing.numOfEpisodes);
          }

          document.title = `${existing.title || ""} S${season} E${episode} - zmov`;
          setSeasonLength(existing.numOfSeasons);

          if (!initialSetRef.current) {
            setInitialProgress(existing.progress ?? 0);
            initialSetRef.current = true;
          }

          await supabase
            .from("watchedItem")
            .update({
              episode : episode,
              season: season,
              progress: watchProgress,
              duration: durationData,
              createdAt: new Date(),
            })
            .eq("userId", user?.id)
            .eq("itemId", id)
            .eq("type", type)
        }
      } catch (e) {
        console.error("Failed to update/create watched item", e);
      }
    }

    updateOrCreateItem();
  }, [type, id, season, episode, watchProgress, durationData, user]);

  useEffect(() => {
    const sourceHandlers: SourceHandlers = {
      "https://vidlink.pro": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA") {
          const vidlinkData = data as VidlinkMessage;
          const currentItem = vidlinkData.data[id]?.show_progress?.[`s${season}e${episode}`];
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
      "https://vidfast.pro": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA") {
          const vidfastData = data as VidfastMessage;
          const currentItem = vidfastData.data[`t${id}`]?.show_progress?.[`s${season}e${episode}`];
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
      "https://player.videasy.net": (data) => {
        try {
          const parsedData: MediaDataMessage =
            typeof data === "string" ? JSON.parse(data) : data;
          if (parsedData.type === "PLAYER_EVENT") {
            setWatchProgress(parsedData.data.currentTime);
            setDurationData(parsedData.data.duration);
          }
        } catch (e) {
          console.error("Failed to parse videasy message data", e);
        }
      },
      "https://vidora.su": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA" && "id" in data.data) {
          const vidoraData = data as VidoraMessage;
          const currentItem = vidoraData.data.show_progress?.[`s${season}e${episode}`];
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
      "https://vidrock.net": (data) => {
        if (typeof data !== "object" || data === null) return;
        if (data.type === "MEDIA_DATA") {
          if (!Array.isArray(data.data)) return;
          const currentItem = data.data.find((item) => item.id === id);
          console.log('test', currentItem);
          console.log('test', data);
          if (currentItem?.progress) {
            setWatchProgress(currentItem.progress.watched);
            setDurationData(currentItem.progress.duration);
          }
        }
      },
    };

    const handleMessage = ({ origin, data }: MessageEvent) => {
      if (!data) return;
      const handler = sourceHandlers[origin as SourceOrigin];
      if (handler) handler(data);
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [id]);


  function handleNextEpisodeClick() {
    const isLastEpisode = Number(episode) >= episodesLength;
    const isLastSeason = Number(season) >= seasonLength;

    if (isLastEpisode && isLastSeason) {
      router.push(`/info/${type}/${id}`);
    } else if (isLastEpisode && !isLastSeason) {
      router.push(`/watch/${type}/${id}/${Number(season) + 1}/1`);
    } else {
      router.push(`/watch/${type}/${id}/${Number(season)}/${Number(episode) + 1}`);
    }
  }

  return (
    <>
      <div className="flex w-screen h-screen relative">
        <Link
          href={`/info/${type}/${id}`}
          className="absolute p-1 top-0 left-0"
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
        <div className="flex gap-2 absolute top-0 right-0 p-1">
          <select
            className="px-2 bg-black rounded-lg cursor-pointer border border-white/30"
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
          <button onClick={handleNextEpisodeClick} className="cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32px"
              height="32px"
              fill="#ffffff"
              viewBox="0 0 448 512"
            >
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
          </button>
        </div>
        <iframe
          src={`${selectedUrl}/${type}/${id}/${season}/${episode}${urlParams}${initialProgress}`}
          allowFullScreen={true}
          className="w-screen h-screen border-0"
        ></iframe>
      </div>
    </>
  );
}
