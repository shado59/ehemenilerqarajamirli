import { redirect } from 'next/navigation';

export default function Home() {
  // Ana səhifəni /en və ya /az kimi bir dil səhifəsinə yönləndir,
  // yoxsa birbaşa öz komponentin varsa onu import et.
  // Əgər ayrıca ana səhifə componentini hələ yazmamısansa,
  // sadəcə bunu qoy — ən azı login açılmasın:
  return (
    <main>
      <p>Ana səhifə</p>
    </main>
  );
}