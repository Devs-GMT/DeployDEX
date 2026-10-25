import { Hero } from "@/components/home/hero";
import { Intro } from "@/components/home/intro";
import { Categories } from "@/components/home/categories";
import { Why } from "@/components/home/why";
import { ListOrBrowse } from "@/components/home/list-or-browse";
import { MostStarred } from "@/components/home/most-starred";
import { Fresh } from "@/components/home/fresh";
import { Faq } from "@/components/home/faq";
import { Closing } from "@/components/home/closing";
import { FlyingKit } from "@/components/ui/decor";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      <FlyingKit />
      <Why />
      <ListOrBrowse />
      <FlyingKit delay={-8} />
      <MostStarred />
      <Fresh />
      <Faq />
      <FlyingKit delay={-15} />
      <Closing />
    </>
  );
}
