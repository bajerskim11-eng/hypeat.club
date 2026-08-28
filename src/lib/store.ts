import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AgentId } from "./catalog";
import { cashbackOf, dogShareOf, SPONSOR, MIN_REDEEM } from "./loyalty";
import { REWARDS, type SaleChannel } from "./venue";

export type ChatTurn = { role: "user" | "assistant"; text: string };

export type LedgerItem = {
  id: string;
  kind: "bill" | "redeem" | "stamp" | "treat" | "payout";
  spotId: string;
  amount: number;
  points: number;
  dogId?: string;
  dogPln?: number;
  channel?: SaleChannel;
  at: number;
};

export type Coupon = {
  id: string;
  spotId: string;
  value: number;
  at: number;
  used?: boolean;
};

export type Payout = {
  id: string;
  spotId: string;
  dogId: string;
  amount: number;
  at: number;
};

type Tab = "feed" | "chat" | "mapa" | "hunt" | "ar" | "karta";

type State = {
  agentId: AgentId | null;
  mascotId: AgentId;
  tab: Tab;
  points: number;
  stamps: string[];
  pos: { lat: number; lng: number } | null;
  history: ChatTurn[];
  cameraSpotId: string | null;
  adoptedDogId: string | null;
  dogFunds: Record<string, number>;
  ledger: LedgerItem[];
  coupons: Coupon[];
  payouts: Payout[];
  cardSpotId: string | null;
  clubTick: number;
  setAgent: (id: AgentId) => void;
  resetAgent: () => void;
  setTab: (tab: Tab) => void;
  addStamp: (spotId: string, extra?: number) => boolean;
  payBill: (spotId: string, amount: number) => { points: number; dogPln: number; dogId?: string } | null;
  bookSale: (
    spotId: string,
    amount: number,
    channel: SaleChannel,
  ) => { points: number; dogPln: number; dogId?: string } | null;
  redeem: (spotId: string, value: number) => Coupon | null;
  confirmCoupon: (id: string) => boolean;
  issueReward: (spotId: string, rewardId: string) => { label: string } | null;
  payoutShelter: (spotId: string) => Payout | null;
  adoptDog: (id: string | null) => void;
  setCardSpot: (id: string | null) => void;
  setPos: (pos: { lat: number; lng: number }) => void;
  pushTurn: (turn: ChatTurn) => void;
  clearHistory: () => void;
  setCameraSpot: (id: string | null) => void;
  bumpClub: () => void;
  addPoints: (n: number) => void;
  setMascot: (id: AgentId) => void;
};

function nid() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

export const useGuide = create<State>()(
  persist(
    (set, get) => ({
      agentId: null,
      mascotId: "skarbnik",
      tab: "chat",
      points: 0,
      stamps: [],
      pos: null,
      history: [],
      cameraSpotId: null,
      adoptedDogId: null,
      dogFunds: {},
      ledger: [],
      coupons: [],
      payouts: [],
      cardSpotId: null,
      clubTick: 0,
      setAgent: (id) => set({ agentId: id, mascotId: id, tab: "chat", history: [] }),
      resetAgent: () => set({ agentId: null, tab: "chat", history: [] }),
      setTab: (tab) => set({ tab }),
      addStamp: (spotId, extra = 0) => {
        const { stamps, points, ledger } = get();
        if (stamps.includes(spotId)) {
          if (extra) set({ points: points + extra });
          return false;
        }
        set({
          stamps: [...stamps, spotId],
          points: points + 10 + extra,
          ledger: [
            {
              id: nid(),
              kind: "stamp" as const,
              spotId,
              amount: 0,
              points: 10 + extra,
              at: Date.now(),
            },
            ...ledger,
          ].slice(0, 60),
        });
        return true;
      },
      payBill: (spotId, amount) => get().bookSale(spotId, amount, "app"),
      bookSale: (spotId, amount, channel) => {
        if (!(amount > 0)) return null;
        const guestPts = channel === "app" ? cashbackOf(amount) : 0;
        const issuedPts = cashbackOf(amount);
        const dogPln = dogShareOf(amount);
        const dogId = SPONSOR[spotId];
        const s = get();
        const stamps = s.stamps.includes(spotId) ? s.stamps : [...s.stamps, spotId];
        const dogFunds = { ...s.dogFunds };
        if (dogId) dogFunds[dogId] = Math.round(((dogFunds[dogId] ?? 0) + dogPln) * 100) / 100;
        set({
          points: s.points + guestPts,
          stamps,
          dogFunds,
          ledger: [
            {
              id: nid(),
              kind: "bill" as const,
              spotId,
              amount,
              points: channel === "app" ? guestPts : issuedPts,
              dogId,
              dogPln,
              channel,
              at: Date.now(),
            },
            ...s.ledger,
          ].slice(0, 60),
        });
        return { points: channel === "app" ? guestPts : issuedPts, dogPln, dogId };
      },
      redeem: (spotId, value) => {
        const s = get();
        const v = Math.floor(value);
        if (v < MIN_REDEEM || s.points < v) return null;
        const coupon: Coupon = { id: nid(), spotId, value: v, at: Date.now() };
        set({
          points: s.points - v,
          coupons: [coupon, ...s.coupons].slice(0, 20),
          ledger: [
            {
              id: nid(),
              kind: "redeem" as const,
              spotId,
              amount: v,
              points: -v,
              at: Date.now(),
            },
            ...s.ledger,
          ].slice(0, 60),
        });
        return coupon;
      },
      confirmCoupon: (id) => {
        const s = get();
        const coupon = s.coupons.find((c) => c.id === id && !c.used);
        if (!coupon) return false;
        set({
          coupons: s.coupons.map((c) => (c.id === id ? { ...c, used: true } : c)),
        });
        return true;
      },
      issueReward: (spotId, rewardId) => {
        const reward = REWARDS.find((r) => r.id === rewardId);
        if (!reward) return null;
        const s = get();
        if (!reward.house && s.points < reward.points) return null;
        const nextPts = reward.house ? s.points : s.points - reward.points;
        set({
          points: nextPts,
          ledger: [
            {
              id: nid(),
              kind: "treat" as const,
              spotId,
              amount: reward.points,
              points: reward.house ? 0 : -reward.points,
              at: Date.now(),
            },
            ...s.ledger,
          ].slice(0, 60),
        });
        return { label: reward.label };
      },
      payoutShelter: (spotId) => {
        const s = get();
        const dogId = SPONSOR[spotId];
        if (!dogId) return null;
        const collected = s.ledger
          .filter((l) => l.spotId === spotId && l.kind === "bill")
          .reduce((a, l) => a + (l.dogPln ?? 0), 0);
        const sent = (s.payouts ?? []).filter((p) => p.spotId === spotId).reduce((a, p) => a + p.amount, 0);
        const amount = Math.round((collected - sent) * 100) / 100;
        if (amount < 1) return null;
        const payout: Payout = { id: nid(), spotId, dogId, amount, at: Date.now() };
        set({
          payouts: [payout, ...(s.payouts ?? [])],
          ledger: [
            {
              id: nid(),
              kind: "payout" as const,
              spotId,
              amount,
              points: 0,
              dogId,
              dogPln: -amount,
              at: Date.now(),
            },
            ...s.ledger,
          ].slice(0, 60),
        });
        return payout;
      },
      adoptDog: (id) => set({ adoptedDogId: id }),
      setCardSpot: (id) => set({ cardSpotId: id }),
      setPos: (pos) => set({ pos }),
      pushTurn: (turn) => set({ history: [...get().history, turn].slice(-24) }),
      clearHistory: () => set({ history: [] }),
      setCameraSpot: (id) => set({ cameraSpotId: id }),
      bumpClub: () => set({ clubTick: get().clubTick + 1 }),
      addPoints: (n) => {
        if (n > 0) set({ points: get().points + n });
      },
      setMascot: (id) => set({ mascotId: id }),
    }),
    {
      name: "beboki-hypeat",
      partialize: (s) => ({
        agentId: s.agentId,
        mascotId: s.mascotId,
        points: s.points,
        stamps: s.stamps,
        adoptedDogId: s.adoptedDogId,
        dogFunds: s.dogFunds,
        ledger: s.ledger,
        coupons: s.coupons,
        payouts: s.payouts,
        cardSpotId: s.cardSpotId,
      }),
    },
  ),
);
