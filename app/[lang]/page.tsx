import { getDictionary } from '@/lib/dictionaries';
import { getProjects, getPosts } from '@/lib/entries';
import SideNav from '@/components/SideNav';
import Hero from '@/components/Hero';
import Work from '@/components/Work';
import About from '@/components/About';
import Studies from '@/components/Studies';
import Journal from '@/components/Journal';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default async function Home({ params }: any) {
  const dict = getDictionary(params.lang);
  const [projects, posts] = await Promise.all([getProjects(), getPosts()]);

  return (
    <>
      <SideNav dict={dict} lang={params.lang} />
      <main>
        <Hero dict={dict} />
        <Work dict={dict} projects={projects} lang={params.lang} />
        <About dict={dict} />
        <Studies dict={dict} />
        <Journal dict={dict} posts={posts} lang={params.lang} />
        <Contact dict={dict} />
      </main>
      <Footer dict={dict} />
    </>
  );
}