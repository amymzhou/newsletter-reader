export type Source = {
  name: string;
  feedUrl: string;
  accentColor: string;
};

export const SOURCES: Source[] = [
  {
    name: "Lenny's Newsletter",
    feedUrl: "https://www.lennysnewsletter.com/feed",
    accentColor: "#E85D26",
  },
  {
    name: "Jasmine",
    feedUrl: "https://jasmine.substack.com/feed",
    accentColor: "#7C6AF7",
  },
];
