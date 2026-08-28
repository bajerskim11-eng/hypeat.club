export const CASHBACK_RATE = 0.1;
export const DOG_RATE = 0.02;
export const MIN_REDEEM = 20;

export type Dog = {
  id: string;
  name: string;
  age: string;
  img: string;
  story: string;
  goal: number;
};

export const DOGS: Dog[] = [
  {
    id: "burek",
    name: "Burek",
    age: "ok. 5 lat",
    img: "/beboki/dogs/burek.jpg",
    story: "Mieszaniec z Nikiszowca. Czeka na dom. Karmienie i leczenie z % obrotu kawiarni.",
    goal: 400,
  },
  {
    id: "mela",
    name: "Mela",
    age: "ok. 2 lata",
    img: "/beboki/dogs/mela.jpg",
    story: "Mała, czujna. Lubi ogródki na Mariackiej. Cel: szczepienia i transporter.",
    goal: 280,
  },
  {
    id: "szarik",
    name: "Szarik",
    age: "ok. 4 lata",
    img: "/beboki/dogs/szarik.jpg",
    story: "Duży, spokojny. Partner Sztolni. Zbiera na sterylizację i karma premium.",
    goal: 520,
  },
  {
    id: "kajtek",
    name: "Kajtek",
    age: "ok. 3 lata",
    img: "/beboki/dogs/kajtek.jpg",
    story: "Uszy jak radar. Żurownia odkłada 2% obrotu na jego leczenie zębów.",
    goal: 350,
  },
  {
    id: "fela",
    name: "Fela",
    age: "seniorka",
    img: "/beboki/dogs/fela.jpg",
    story: "Szara dama z dworca. Kaktusy i Max składają się na weterynarza.",
    goal: 300,
  },
];

export const SPONSOR: Record<string, string> = {
  aioli: "burek",
  basiliana: "mela",
  zurownia: "kajtek",
  kaktusy: "fela",
  sztolnia: "szarik",
  max: "fela",
  byfyj: "burek",
};

export function dogById(id: string) {
  return DOGS.find((d) => d.id === id);
}

export function cashbackOf(amount: number) {
  return Math.round(amount * CASHBACK_RATE);
}

export function dogShareOf(amount: number) {
  return Math.round(amount * DOG_RATE * 100) / 100;
}
