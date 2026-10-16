import { CallToAction } from '../components/home/CallToAction';
import { Hero } from '../components/home/Hero';
import { Purpose } from '../components/home/Purpose';
import { Workflow } from '../components/home/Workflow';

export function HomePage() {
  return (
    <>
      <Hero />
      <Purpose />
      <Workflow />
      <CallToAction />
    </>
  );
}
