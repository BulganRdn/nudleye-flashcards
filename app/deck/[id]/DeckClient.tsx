"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Globe2,
  Lock,
  Pencil,
  Play,
  Trash2,
} from "lucide-react";
import { fetchJson } from "@/lib/http";
import DecorativeLayer from "@/components/ui/DecorativeLayer";

export type DeckDetail = {
  id: string;
  name: string;
  emoji: string;
  description?: string;
  createdAt: string;
  words: number;
  mastered: number;
  progress: number;
  streak: number;
  isOwner?: boolean;
  isPublic?: boolean;
  creator?: { name: string };
  wordsList: Array<{
    id: string;
    korean: string;
    mongolian: string;
    mastered: boolean;
    dueDate?: string;
  }>;
};

export default function DeckClient({ deck }: { deck: DeckDetail }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [copyError, setCopyError] = useState("");
  const card = deck.wordsList[index];

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (!deck.wordsList.length) return;
      if (event.key === "ArrowRight") {
        setIndex((current) => Math.min(deck.wordsList.length - 1, current + 1));
        setFlipped(false);
      }
      if (event.key === "ArrowLeft") {
        setIndex((current) => Math.max(0, current - 1));
        setFlipped(false);
      }
      if (event.key === " ") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [deck.wordsList.length]);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/decks/${deck.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Багцыг устгаж чадсангүй.");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["decks"] });
      router.replace("/library");
    },
  });

  const copyMutation = useMutation({
    mutationFn: () => fetchJson<{ deckId: string }>("/api/decks/add-to-library", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ deckId: deck.id }),
    }),
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ["decks"] });
      router.push(`/deck/${data.deckId}`);
    },
    onError: (error) => setCopyError(error instanceof Error ? error.message : "Багцыг хуулж чадсангүй."),
  });

  function deleteDeck() {
    if (window.confirm(`"${deck.name}" багцыг бүрмөсөн устгах уу?`)) deleteMutation.mutate();
  }

  function selectCard(cardIndex: number) {
    setIndex(cardIndex);
    setFlipped(false);
  }

  return (
    <div className="app-shell app-content min-h-screen">
      <main className="page-canvas max-w-6xl">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/library" className="btn-ghost px-2 py-2 text-sm">
            <ArrowLeft className="h-4 w-4" />Миний сан
          </Link>
          {deck.isOwner && (
            <div className="flex gap-1">
              <Link href={`/deck/${deck.id}/edit`} className="btn-ghost px-3 py-2 text-sm">
                <Pencil className="h-4 w-4" />Засах
              </Link>
              <button onClick={deleteDeck} disabled={deleteMutation.isPending} className="btn-ghost px-3 py-2 text-sm hover:text-[#c84b4b]">
                <Trash2 className="h-4 w-4" />{deleteMutation.isPending ? "Устгаж байна" : "Устгах"}
              </button>
            </div>
          )}
        </div>

        <header className="panel relative mb-6 flex flex-col justify-between gap-5 overflow-hidden p-5 sm:flex-row sm:items-start sm:p-6">
          <DecorativeLayer variant="deck" />
          <div className="relative min-w-0">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-3xl font-bold tracking-[-.045em]">{deck.name}</h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#858995]">
                  {deck.isPublic ? <Globe2 className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                  {deck.isPublic ? "Бусдад нээлттэй" : "Зөвхөн надад"}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e7280]">
                {deck.description || "Энэ багцад тайлбар оруулаагүй байна."}
              </p>
              <div className="mt-3 flex items-center gap-4 text-xs text-[#7e828e]">
                <span>{deck.words} карт</span>
                {deck.progress > 0 && <span>{deck.progress}% эзэмшсэн</span>}
              </div>
            </div>
          </div>

          {deck.words > 0 && deck.isOwner ? (
            <Link href={`/review/test/${deck.id}`} className="btn-primary w-fit shrink-0 px-5 py-3 text-sm">
              <Play className="h-4 w-4 fill-current" />Картаар сурах
            </Link>
          ) : !deck.isOwner ? (
            <button onClick={() => copyMutation.mutate()} disabled={copyMutation.isPending} className="btn-primary w-fit shrink-0 px-5 py-3 text-sm disabled:opacity-50">
              <Copy className="h-4 w-4" />{copyMutation.isPending ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          ) : null}
        </header>

        {copyError && <div className="mb-5 rounded-lg border border-[#efcaca] bg-[#fff2f0] px-4 py-3 text-sm text-[#a84040]">{copyError}</div>}

        {deck.wordsList.length === 0 ? (
          <section className="study-set-card px-6 py-12 text-center">
            <h2 className="font-bold">Энэ багц хоосон байна</h2>
            <p className="mt-2 text-sm text-[#777b87]">Эхний front/back картаа нэмээд суралцаж эхлээрэй.</p>
            {deck.isOwner && <Link href={`/deck/${deck.id}/edit`} className="btn-primary mt-5 px-4 py-2.5 text-sm">Үг нэмэх</Link>}
          </section>
        ) : card ? (
          <>
            <section className="mx-auto max-w-4xl">
              <div>
                <div>
                  <motion.button
                    whileTap={{ scale: .995 }}
                    onClick={() => setFlipped((value) => !value)}
                    className="flashcard-surface relative min-h-[330px] w-full overflow-hidden text-center"
                  >
                    <DecorativeLayer variant="flashcard" />
                    <div className="flex items-center justify-between border-b border-[#e4e6eb] px-5 py-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#8c909c]">
                      <span>{flipped ? "Хариу тал" : "Асуух тал"}</span>
                      <span>{index + 1} / {deck.wordsList.length}</span>
                    </div>
                    <div className="grid min-h-[270px] place-items-center px-6 py-10">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={flipped ? "back" : "front"}
                          initial={{ opacity: 0, rotateX: -14, y: 6 }}
                          animate={{ opacity: 1, rotateX: 0, y: 0 }}
                          exit={{ opacity: 0, rotateX: 14, y: -6 }}
                          transition={{ duration: .18 }}
                        >
                          <div className="text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                            {flipped ? card.mongolian : card.korean}
                          </div>
                          <div className="mt-6 text-xs text-[#818591]">Дарж хариуг харах</div>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <button onClick={() => selectCard(Math.max(0, index - 1))} disabled={index === 0} className="btn-secondary px-4 py-2.5 text-sm disabled:opacity-30">
                    <ArrowLeft className="h-4 w-4" />Өмнөх
                  </button>
                  <button onClick={() => selectCard(Math.min(deck.wordsList.length - 1, index + 1))} disabled={index === deck.wordsList.length - 1} className="btn-secondary px-4 py-2.5 text-sm disabled:opacity-30">
                    Дараах<ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

            </section>

            <section className="mx-auto mt-8 max-w-4xl">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold">Үгийн жагсаалт</h2>
                {deck.isOwner && <Link href={`/deck/${deck.id}/edit`} className="text-xs font-bold text-[#84530f]">Жагсаалт засах</Link>}
              </div>
              <div className="overflow-hidden rounded-[18px] border border-white/80 bg-white/82 shadow-[0_12px_32px_rgba(31,42,68,.06)] backdrop-blur-xl">
                {deck.wordsList.map((word, wordIndex) => (
                  <button
                    key={word.id}
                    onClick={() => {
                      selectCard(wordIndex);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="grid w-full grid-cols-[38px_1fr_1fr] gap-3 border-b border-[#eceef1] px-4 py-3 text-left text-sm transition last:border-0 hover:bg-[#f8f9fb]"
                  >
                    <span className="font-mono text-xs text-[#9a9da7]">{String(wordIndex + 1).padStart(2, "0")}</span>
                    <span className="truncate font-semibold">{word.korean}</span>
                    <span className="truncate text-[#6e7280]">{word.mongolian}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        ) : null}
      </main>
    </div>
  );
}
