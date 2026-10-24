import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Categories } from "@/components/home/categories";
import { Why } from "@/components/home/why";
import { ListOrBrowse } from "@/components/home/list-or-browse";
import { MostStarred } from "@/components/home/most-starred";
import { Fresh } from "@/components/home/fresh";
import { Faq } from "@/components/home/faq";
import { Closing } from "@/components/home/closing";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      <Why />
      <ListOrBrowse />
      <MostStarred />
      <Fresh />
      <Faq />
      <Closing />
    </>
  );
}
